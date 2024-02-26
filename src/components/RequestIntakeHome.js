import React, {useState, useContext, useEffect, useRef, useLayoutEffect} from 'react'
import {getTable} from './apis/axios.js'
import {appIcons} from './apis/icons.js'
import RequestIntakeForm from './RequestIntakeForm.js';
import Draggable from 'react-draggable';

import "bootstrap/dist/css/bootstrap.min.css";

const RequestIntakeHome = (props) => {

    const appData = props.appData
    const [showRequestIntakeModal, setShowRequestIntakeModal] = useState(false)
    const [formName, setFormName] = useState("")
    const [formData, setFormData] = useState({})
    const [requestTypes, setRequestTypes] = useState([])
    const [requestType, setRequestType] = useState("") 
    const selectedApp = props.selectedApp
    const setSelectedApp = props.setSelectedApp
    const setTableName = props.setTableName
    const pages = props.pages
    const setPage = props.setPage
    const pageList = props.pagList
    const setPageList = props.setPageList
    const apps = props.apps
    const pageName = props.pageName
    const setPageName = props.setPageName


    const getRequestStypes = async (req, res)=>{
        
        try{
             const response = await getTable("request_flow_types")
             const requestData = response.data  
             setRequestTypes(requestData)
        }catch(error){
            //console.log(error)
        }
    }

    useEffect(()=>{
        getRequestStypes()
    },[])

    const handleSelect = (e)=>{
        const selectedRequestType = e.target.id
        setRequestType(selectedRequestType)
        setFormName(requestTypes.find(item=>item.name===selectedRequestType).starting_form_name)
        setShowRequestIntakeModal(true)
    }

    const RequestIntakeModalStyle={
        position: "fixed", 
        top: '50%',
        left: '50%',
        height: "80vh", 
        width: "50vw", 
        translate: "-50% -50%",
        zIndex: 999,
        cursor: "grab",
        overflow: "hidden"
      }

      const iconStyle = {
      maxHeight: 30,
      maxWidth: 30,
      cursor: "pointer",
      marginLeft: 5,
	  };

  useEffect(()=>{
    if(!showRequestIntakeModal){
      setFormData({})
    }
    //console.log(formData)
  },[showRequestIntakeModal])

  return (
    <div>
        {requestTypes.map((item, index)=>(
            item.include && 
            <div key={index} id={item.name} className="d-flex border border-1 border-light shadow shadow-sm p-2 m-2" style={{cursor: "pointer", zIndex:7}} onClick={(e)=>handleSelect(e)}>
                <img  id={item.name} src={`${appIcons}/${item.icon || "other_request_icon.png"}`} alt={`${item.name} icon`} style={{maxHeight: 30, maxWidth: 30}}></img>
                <div id={item.name} className="d-flex flex-column ps-3">
                    <div id={item.name} style={{fontSize: 14, fontWeight: 'bold'}}>{item.label}</div>
                    <div id={item.name}  style={{fontSize: 12, color: 'gray'}}>{item.description} </div>
                </div>
            </div>
            ))}
        
        {showRequestIntakeModal &&
      <Draggable>
        <div className="d-flex flex-column bg-light rounded-3 shadow border border-3" style={RequestIntakeModalStyle}>
          <div className="d-flex justify-content-end" style={{height: "30px", backgroundColor: "rgb(0, 100, 2225)"}}>
            <img src={`${appIcons}/close_icon.png`} alt="Close Button" style={iconStyle} onClick={(e)=>setShowRequestIntakeModal(false)}></img>
          </div>
          {formName == "request_summary" ?
            <RequestIntakeForm
              requestType = {"request_summary"}
              setRequestType = {setRequestType}
              formName = {"request_summary"}
              setFormName = {setFormName}
              formData = {formData}
              setFormData = {setFormData}
              appData = {{user: appData["user_info"], setShowRequestIntakeModal, setSelectedApp, setPage, pageList, setTableName, setPageList, pages, apps, pageName, setPageName}}
            />
          :
            <RequestIntakeForm
              requestType = {requestType}
              setRequestType = {setRequestType}
              formName = {formName}
              setFormName = {setFormName}
              formData = {formData}
              setFormData = {setFormData}
              appData = {{user: appData["user_info"], setShowRequestIntakeModal, setSelectedApp,setPage, pageList, setTableName, setPageList, pages, apps, pageName, setPageName}}

            />
          }

        </div>
      </Draggable>
    }
    </div>
  )
}

export default RequestIntakeHome