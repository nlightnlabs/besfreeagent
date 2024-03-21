import React, {useState, useEffect} from 'react'
import * as crud from './apis/crud.js'
import * as nlightnApi from './apis/nlightn.js'

import "bootstrap/dist/css/bootstrap.min.css"
import VoiceRecorder from './VoiceRecorder.js'
import VoiceRecord from './VoiceRecord.js'

const AIInput = (props) => {

    const [prompt, setPrompt] = useState("")
    const [microphoneIcon, setMicrophoneIcon] = useState("")
    const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
    const transcription = props.transcription
    const setTranscription = props.setTranscription

    const handleChange = async (e)=>{
        const {name, value} = e.target
        setPrompt(value)
        setTranscription(value)
    }

    useEffect(()=>{
        setPrompt(transcription)
    },[transcription])

    useEffect(()=>{
        const getIcon = async ()=>{
            const environment = window.environment
            let appName = ""
            if(environment ==="freeagent"){
                appName = "icon"
            }else{
                appName = "icons"
            }
            const iconDataResponse = await crud.getData(appName)
            console.log(iconDataResponse)
            setMicrophoneIcon(iconDataResponse.find(i=>i.name==="microphone").image)
        }
        getIcon()
    },[])


  return (
    <div className="d-flex flex-column align-items-center w-100">
        
        <h3 className="mt-5">Summarize your need:</h3>

        <div className="d-flex flex-column align-items-center w-100">
            
            <textarea name="prompt" 
                onChange={(e)=>handleChange(e)} 
                value={prompt} 
                className="form-control m-1 w-100 mb-3"
                style={{color: "rgb(0,100,225)", fontSize: "20px", height:"200px"}}
                resize ="none"
                placeholder= "Type what you need here"
            >    
            </textarea>

            <div className="d-flex p-1 border border-1 rounded-3 shadow-sm m-1" onClick={(e)=>setShowVoiceRecorder(!showVoiceRecorder)}>
                <img src={microphoneIcon} style={{height: "50px", width: "50px", cursor: "pointer"}}></img>
            </div>

            {showVoiceRecorder && 
                <div className="d-flex justify-content-center w-100">
                    <VoiceRecord
                        setTranscription = {setTranscription} 
                        display={showVoiceRecorder}
                        setDisplay = {setShowVoiceRecorder}
                    />
                </div>
            }

        </div>
        
    </div>
  )
}

export default AIInput