import React, {useEffect, useState} from 'react'

const Apps = (props) => {

    const apps = props.apps
    const handleSelectedApp = props.handleSelectedApp
    const [businessProcesses, setBusinessProcesses] = useState([])

    const getBusinessProcesses = ()=>{
        let fieldSet = new Set()
        apps.map(item=>{
            fieldSet.add(item.business_process)
        })
        let fields = Array.from(fieldSet)
        setBusinessProcesses(fields)
        console.log(fields)
    }

    useEffect(()=>{
        getBusinessProcesses()
    },[apps])

    const iconStyle={
        maxHeight: 40,
        maxWidth: 40,
        cursor: "pointer"
      }

  return (
    <div className="d-flex flex-column p-3" style={{width: "100%", height:"100%"}}>
        {businessProcesses.length>0 && businessProcesses.map((businessProcess,bpIndex)=>(
            <div className="d-flex flex-column mb-3" key={bpIndex}>
                <div className="d-flex w-100" style={{fontSize: "16px", color: "gray", fontWeight: "bold", borderBottom: "1px solid lightgray"}}>{businessProcess}</div>
                <div className="d-flex">
                {
                    apps.map((app,index)=>(
                    app.business_process === businessProcess ?
                    <div id={app.name} className="d-flex align-items-center flex-column justify-content-center m-3" style={{height: "50px", width: "50px", cursor: "pointer"}} key={index}>
                        <img  style={iconStyle} src={app.icon} alt={`${app.label} icon`} onClick={(e)=>{handleSelectedApp(e, app)}}></img>
                        <div className="d-flex text-center" style={{fontSize: 12, color: "gray", whiteSpace:"wrap"}} onClick={(e)=>{handleSelectedApp(e,app)}}>{app.label}</div>
                    
                    </div>
                    :
                    null))
                }
                </div>
            </div>
            
        ))
        }
    </div>
  )
}

export default Apps