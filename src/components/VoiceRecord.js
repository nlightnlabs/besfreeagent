import React, { useState } from 'react';
import * as nlightnApi from './apis/nlightn.js'

function VoiceRecorder(props) {

  const setTranscription = props.setTranscription
  const setShowPanel = props.setShowPanel

  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioFile, setAudioFile] = useState(null)
  const [mediaRecorder, setMediaRecorder] = useState()

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setIsRecording(true);
        let mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = event => {
          setAudioChunks(prevChunks => [...prevChunks, event.data]);
        };
        console.log(mediaRecorder)
        mediaRecorder.start();
        setMediaRecorder(mediaRecorder)
      })
      .catch(error => console.error('Error accessing microphone:', error));
  };

  const stopRecording = () => {
    console.log( "mediaRecorder" , mediaRecorder)

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      console.log( "mediaRecorder.state" , mediaRecorder.state)

    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    console.log("audioBlob",audioBlob)

    const audioUrl = URL.createObjectURL(audioBlob);
    console.log("audioUrl",audioUrl)

    const audio = new Audio(audioUrl);
    console.log("audio",audio)

    setAudioFile(audio)
    }
  };

  const playRecording = () => {
    console.log("audio",audioFile)
    audioFile.play();
  };

  const clearRecording = () => {
    setAudioChunks(null)
    setAudioChunks([]);
  };

  const transcribeToText = async () => {
    const response = await nlightnApi.convertAudioToText(audioFile)
    console.log(response)
    setTranscription(response)
    setShowPanel(false)
  };

  return (
    <div className="d-flex justify-content-between w-100">
        <div className="btn-group">
            <button className="btn btn-primary" onClick={(e)=>startRecording(e)} disabled={isRecording}>
            Start
            </button>
            <button className="btn btn-danger" onClick={(e)=>stopRecording(e)} disabled={!isRecording}>
            Stop
            </button>
            <button className="btn btn-success" onClick={(e)=>playRecording(e)} disabled={audioChunks.length === 0}>
            Play
            </button>
            <button className="btn btn-outline-secondary" onClick={(e)=>clearRecording(e)} disabled={audioChunks.length === 0}>
            Clear
            </button>
        </div>
        <div className="d-flex">
            <button className="btn btn-primary m-1" onClick={(e)=>transcribeToText(e)} disabled={audioChunks.length === 0}>
                Submit
            </button>
            <button className="btn btn-outline-secondary m-1" onClick={(e)=>setShowPanel(false)}>
                Cancel
            </button>
        </div>
    </div>
  );
}

export default VoiceRecorder;
