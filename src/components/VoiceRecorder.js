import React, {useState, useEffect} from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import * as nlightnApi from './apis/nlightn'


const Mp3Recorder = new MicRecorder({ 
    bitRate: 64 ,
    prefix: "data:audio/wav;base64,",
});


const VoiceRecorder =(props)=>{

    const [isRecording, setIsRecording] = useState(false)
    const [blobURL, setBlobURL] = useState("")
    const [isBlocked, setIsBlocked] = useState(false)
    const setTranscription = props.setTranscription
    const setDisplay = props.setDisplay


  const start = (e) => {
    if (isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder
        .start()
        .then(() => {
            setIsRecording(true);
        }).catch((e) => console.error(e));
    }
  };

  const stop = (e) => {
    Mp3Recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob)
        console.log(blobURL)
        const binaryString = btoa(blobURL)
        console.log(binaryString);
        setBlobURL(blobURL)
        setIsRecording(false)
      }).catch((e) => console.log(e));
  };

  const transcribeToText = async () => {

    const saveBlobURLAsAudioFile = async (blobURL, filename) => {
        try {
          const response = await fetch(blobURL);
          const blob = await response.blob();
          const audioFile = new File([blob], filename, { type: blob.type });
          return audioFile;
        } catch (error) {
          console.error('Error saving blob URL as audio file:', error);
          throw error;
        }
      };

    //   const audioFile = await saveBlobURLAsAudioFile(blobURL,"request.mp3")

      const response = await nlightnApi.convertAudioToText(blobURL)
      console.log(response)
    //   setTranscription(response)

    };


    const clearRecording = (e) => {
        setBlobURL("")
    };

  

  useEffect(()=>{
    navigator.getUserMedia({ audio: true },
        () => {
          console.log('Permission Granted');
          setIsBlocked(false)
        },
        () => {
          console.log('Permission Denied');
          setIsBlocked(true)
        },
      );
  },[])


    return (
      <div className="d-flex w-100 flex-column align-items-center border border-1 rounded-3">
        
        <div className="d-flex w-100 justify-content-end">
            <div 
                className="d-flex p-1 me-1" 
                style={{color:"gray",cursor: "pointer"}}
                onClick={(e)=>setDisplay(false)}
            >x</div>
        </div>

        <audio className="d-flex w-100 m-1" src={blobURL} controls="controls" />

        <div className="d-flex w-100 justify-content-center">
            <button  className="btn btn-outline-success m-1" onClick={(e)=>start(e)} disabled={isRecording}>Record</button>
            <button  className="btn btn-outline-danger m-1" onClick={(e)=>stop(e)} disabled={!isRecording}>Stop</button>
            <button  className="btn btn-outline-primary m-1" onClick={(e)=>transcribeToText(e)}>Transcribe</button>
            <button  className="btn btn-outline-secondary m-1" onClick={(e)=>clearRecording(e)}>Reset</button>
        </div>
        
      </div>
    );
}



export default VoiceRecorder;