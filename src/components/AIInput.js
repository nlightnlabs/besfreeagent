import React, {useState, useEffect} from 'react'
import * as crud from './apis/crud.js'
import "bootstrap/dist/css/bootstrap.min.css"
import VoiceRecord from './VoiceRecord.js'
import MultiInput from './MultiInput.js'

const AIInput = () => {

    const [prompt, setPrompt] = useState("")
    const [microphoneIcon, setMicrophoneIcon] = useState("")
    const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)

    const [transcription, setTranscription] =useState("")

    const translateVoiceToText = async (e)=>{
        let text = ""
        return text
    }

    const handleChange = async (e)=>{
        const {name, value} = e.target
        setPrompt(value)
        setTranscription(value)
    }

    useEffect(()=>{
        const getIcon = async ()=>{

            const environment = window.environment
            let appName = ""
            if(environment ==="freeagent"){
                appName = "icon"
            }else{
                appName = "icons"
            }
            const iconDataResponse = await crud.getData("icons")
            console.log(iconDataResponse)
            setMicrophoneIcon(iconDataResponse.find(i=>i.name==="microphone").image)
        }
        getIcon()
    },[])

  return (
    <div className="d-flex flex-column flex-wrap">
            <div className="d-flex form-floating w-100  m-1">
                <MultiInput
                    id="prompt"
                    name="prompt"
                    value = {prompt}
                    onChange={(e)=>handleChange(e)}
                    label="What do you need?"
                    placeholder="What do you need?"
                />
            </div>
        <div className="d-flex">
            <div className="d-flex m-1 align-items-center m-1">
                <img src={microphoneIcon ? microphoneIcon : null} 
                style={{height: "30px", width: "30px", cursor: "pointer"}}
                onClick={(e)=>setShowVoiceRecorder(true)}></img>
            </div>

            {showVoiceRecorder && 
            <div className="d-flex w-100 m-1">
                <VoiceRecord
                    transcription = {transcription}
                    setTranscription = {setPrompt}
                    setShowPanel = {setShowVoiceRecorder}
                />
            </div>
            }
        </div>

        {/* {showVoiceRecorder && 
            <FloatingPanel height={300} width={300} displayPanel={setShowVoiceRecorder}>
                <div className="d-flex bg-white flex-column" style={{height:"100%", width:"100%"}}>
                    <div className="d-flex w-100 p-1 mb-3 align-items-center">Say what your need</div>
                    <div className="d-flex p-1" style={{height: "200px", overflowY:"auto", color: "rgb(0,150,225)"}}>
                        {voicePrompt}
                    </div>
                </div>
            </FloatingPanel>
        } */}

    </div>
  )
}

export default AIInput