import React, { useState } from 'react';
import axios from 'axios';

const AudioToText = (transcription)=> {

  const transcription = props.transcription
  const setTranscription = props.setTranscription
  const [audioFile, setAudioFile] = useState(null);

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const transcribe = async () => {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);

      const response = await axios.post('/api/convertAudioToText', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTranscription(response.data.transcription);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button className="btn btn-primary" onClick={handleUpload} disabled={!audioFile}>
        Convert to Text
      </button>
      {transcription && <div>{transcription}</div>}
    </div>
  );
}

export default AudioToText;
