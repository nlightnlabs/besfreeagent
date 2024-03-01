import React, {useState, useContext, useEffect, useRef, useLayoutEffect} from 'react'
import {Context} from "./Context.js"
import {getTable} from './apis/axios.js'
import RequestIntakeForm from './RequestIntakeForm.js';
import FloatingPanel from './FloatingPanel.js';

import "bootstrap/dist/css/bootstrap.min.css";

const RequestIntakeHome = (props) => {

 const {
    user,
    setUser,
    users,
    setUsers,
    userLoggedIn,
    setUserLoggedIn,
    appIcons,
    setAppIcons,
    apps,
    setApps,
    selectedApp,
    setSelectedApp,
    page,
    setPage,
    pages,
    setPages,
    pageName,
    setPageName,
    requestType,
    setRequestType,
    appData,
    setAppData,
    attachments,
    setAttachments,
    pageList,
    setPageList,
    requestTypes,
    setRequestTypes,
    initialFormData,
    setInitialFormData,
    tableName,
    setTableName,
    tables,
    setTables,
    currency,
    setCurrency,
    language,
    setLanguage,
    currencySymbol,
    setCurrencySymbol
} = useContext(Context)

    const [showRequestIntakeModal, setShowRequestIntakeModal] = useState(false)
    const [formName, setFormName] = useState("")
    const [formData, setFormData] = useState({})

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
            <div key={index} id={item.name} className="d-flex border border-1 border-light rounded-3 shadow shadow-sm p-2 m-2" style={{cursor: "pointer", zIndex:7}} onClick={(e)=>handleSelect(e)}>
                <img  id={item.name} src={item.icon} alt={`${item.name} icon`} style={{maxHeight: 30, maxWidth: 30}}></img>
                <div id={item.name} className="d-flex flex-column ps-3">
                    <div id={item.name} style={{fontSize: 14, fontWeight: 'bold'}}>{item.label}</div>
                    <div id={item.name}  style={{fontSize: 12, color: 'gray'}}>{item.description} </div>
                </div>
            </div>
            ))}
        
        {showRequestIntakeModal &&
      <FloatingPanel
        title={requestType}
        top="50vh"
        left="50vw"
        height="80vh"
        width="800px"
        appData={appData}
        displayPanel={setShowRequestIntakeModal}
      >
        <div className="d-flex w-100">
          {formName == "request_summary" ?
            <RequestIntakeForm
              requestType = {"Summary"}
              setRequestType = {setRequestType}
              formName = {"request_summary"}
              setFormName = {setFormName}
              formData = {formData}
              setFormData = {setFormData}
              setShowRequestIntakeModal = {setShowRequestIntakeModal}
            />
          :
            <RequestIntakeForm
              requestType = {requestType}
              setRequestType = {setRequestType}
              formName = {formName}
              setFormName = {setFormName}
              formData = {formData}
              setFormData = {setFormData}
              setShowRequestIntakeModal = {setShowRequestIntakeModal}
            />
          }

        </div>
      </FloatingPanel>
    }
    </div>
  )
}

export default RequestIntakeHome