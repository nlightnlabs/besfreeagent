import React, { useState, useEffect, useRef } from 'react';
import * as nlightnApi from './apis/nlightn.js'

function VoiceRecorder(props) {
  const setTranscription = props.setTranscription;
  const display = props.display
  const setDisplay = props.setDisplay;

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [blobURL, setBlobURL] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null); // Declare mediaRecorder as state

  let chunks = []; // Array to store audio chunks

    const audioPlayerRef = useRef(null);
    const soundWaveCanvasRef = useRef(null);
    let audioContext = null;
    let analyser = null;
    let dataArray = null;
    let canvasContext = null;
    let audioSource = null

    const startAudioContext = async ()=>{
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        canvasContext = soundWaveCanvasRef.current.getContext('2d');

        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            audioSource = audioContext.createMediaStreamSource(stream);
            audioSource.connect(analyser);
            audioPlayerRef.current.srcObject = stream;
          })
          .catch(error => console.error('Error accessing microphone:', error));
    
        return () => {
          if (audioContext) {
            audioContext.close();
          }
        };
    }
  
  
    const draw = async () => {
      if (!canvasContext || !soundWaveCanvasRef.current) return;
    
      const WIDTH = soundWaveCanvasRef.current.width;
      const HEIGHT = soundWaveCanvasRef.current.height;
    
      analyser.getByteTimeDomainData(dataArray);
    
      canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
      canvasContext.lineWidth = 4;
      canvasContext.strokeStyle = 'rgba(0, 225, 0,0.5)';
      canvasContext.beginPath();
    
      const sliceWidth = (WIDTH * 1.0) / analyser.frequencyBinCount;
      let x = 0;
    
      for (let i = 0; i < analyser.frequencyBinCount; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * HEIGHT) / 2;
    
        if (i === 0) {
          canvasContext.moveTo(x, y);
        } else {
          canvasContext.lineTo(x, y);
        }
    
        x += sliceWidth;
      }
    
      canvasContext.lineTo(WIDTH, HEIGHT / 2);
      canvasContext.stroke();
    
      requestAnimationFrame(draw);
    };
    

  

  const startRecording = async () => {
    setTranscription("")
    setAudioBlob(null)
    setBlobURL("")

    await startAudioContext()

    await draw();

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {

        setIsRecording(true);
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder); // Store mediaRecorder in state
      
        recorder.ondataavailable = (event) => {
          chunks.push(event.data); // Store each chunk of audio data
        };

        recorder.onstop = () => {

          console.log("stopped")
          // Combine all chunks into a single Blob
          const audioBlob = new Blob(chunks, { type: 'audio/wav' });
          setAudioBlob(audioBlob);

          console.log(audioBlob)
          const blobURL = URL.createObjectURL(audioBlob);
          setBlobURL(blobURL);

          setTimeout(()=>{transcribeToText(audioBlob)},100)

          chunks = []; // Clear the chunks array after recording
        };

        recorder.start();

      })
      .catch((error) => console.error('Error accessing microphone:', error));
  };

  const stopRecording = () => {
    console.log(mediaRecorder)

    if (mediaRecorder) {
      mediaRecorder.stop(); // Check if mediaRecorder is defined before calling stop
      setIsRecording(false);
      console.log(audioBlob)
    }
    
  };

  const transcribeToText = async (audioBlob) => {
    // Check if audioBlob is available before transcribing
    console.log(audioBlob)
    if (audioBlob) {
      const response = await nlightnApi.convertAudioToText(audioBlob);
      console.log(response);
      setTranscription(response)
    } else {
      console.error('No audioBlob available');
    }
  };

  

  return (
    <div className="d-flex justify-content-between w-100">
      <div className="d-flex w-100 flex-column align-items-center">

        <div className="d-flex w-100 justify-content-end">
          <div
            className="d-flex p-1 me-1"
            style={{ color: 'gray', cursor: 'pointer' }}
            onClick={(e) => setDisplay(false)}
          >
          </div>
        </div>
        <div className="d-flex w-100 justify-content-center">
          <div className="btn-group">
            <button className="btn btn-danger" disabled={isRecording} onClick={() => startRecording()}>
              Record
            </button>
            <button className={isRecording? "btn btn-primary" : "btn btn-outline-secondary"} disabled={!isRecording} onClick={(e) => stopRecording(e)}>
              Submit
            </button>
          </div>
        </div>

        {display &&
          <div className="d-flex flex-column p-3" style={{overflow:"hidden"}}>
            <canvas ref={soundWaveCanvasRef} height={100} width={300} style={{color: "gray"}} />
          </div>
        }
    </div>
    </div>
  );
}

export default VoiceRecorder;