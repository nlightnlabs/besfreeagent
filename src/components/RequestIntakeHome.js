import React, {useState, useContext, useEffect, useRef, useLayoutEffect} from 'react'
import {Context} from "./Context.js"
import {getTable} from './apis/axios.js'
import RequestIntakeForm from './RequestIntakeForm.js';
import FloatingPanel from './FloatingPanel.js';
import * as crud from './apis/crud.js'
import * as nlightnApi from './apis/nlightn'

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

    const environment = window.environment

    const [showRequestIntakeModal, setShowRequestIntakeModal] = useState(false)
    const [formName, setFormName] = useState("")
    const [formData, setFormData] = useState({})
    const [spendCategories, setSpendCategories] = useState([])
    const [businessUnits, setBusinessUnits] = useState([])
    const [businesses, setBusinesses] = useState([])
    const [dbFieldData, setDbFieldData]= useState([])

    useEffect(()=>{

        let appName = ""
        if(environment === "freegent"){
          appName = "custom_app_52"
        }else{
          appName = "requests"
        }

      const getRequestStypes = async ()=>{
        const response = await nlightnApi.getTable("request_flow_types")
        setRequestTypes(response.data)
      }
      getRequestStypes()


      const getBusinessUnits = async ()=>{
        const response = await crud.getData(appName)
        setBusinessUnits(response)
      }
      getBusinessUnits()
    

      const getCategories = async ()=>{
        const response = await crud.getData(appName)
        setSpendCategories(response)
      }
      getCategories()
    

      const getBusinesses = async ()=>{
        const response = await crud.getData(appName)
        setBusinesses(response)
      }
      getBusinesses()

     
      const getRequestDbFieldNames = async ()=>{
        const response = await crud.getColumnData(appName)
        setDbFieldData(response)
      }
      getRequestDbFieldNames()

    },[])

    const handleSelect = (e)=>{
        const selectedRequestType = e.target.id
        setRequestType(selectedRequestType)
        setFormName(requestTypes.find(item=>item.name===selectedRequestType).starting_form_name)
        setShowRequestIntakeModal(true)
    }

  
      const iconStyle = {
      maxHeight: 50,
      maxWidth: 50,
      cursor: "pointer",
      marginLeft: 5,
	  };

  useEffect(()=>{
    if(!showRequestIntakeModal){
      setFormData({})
    }
    //console.log(formData)
  },[showRequestIntakeModal])

  const goToMarketPlace=(e)=>{
    const nextPage = "Market Place"
    setPage(pages.filter(x=>x.name===nextPage)[0])
    setPageList([...pageList,nextPage])
    setPageName(nextPage)
  }

  return (
    <div className="d-flex flex-column" style={{height:"100%"}}>
      
      <div className="d-flex justify-content-center mb-1">
          <div className="d-flex flex-column align-items-center" onClick={(e)=>goToMarketPlace(e)}>
                <img style={iconStyle} src={appIcons.length > 0 ? appIcons.find(item=>item.name==="shopping").image:null}></img>
                <div style={{fontSize: 14, color: "rgb(0,150,225", fontWeight: "bold"}}>Shop</div>
            </div>
      </div>

      <div className="d-flex justify-content-center mb-1" style={{height:"25px", color: "gray"}}> - OR - </div>

      <div className="d-flex w-100 justify-content-center mb-1" style={{fontSize: 14, color: "rgb(0,150,225", fontWeight: "bold"}}> Request Something</div>

      <div className="d-flex flex-column" style={{height:"100%", overflow:"auto"}}>
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
        </div>
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
          {formName === "request_summary" ?
            <RequestIntakeForm
              requestType = {"Summary"}
              setRequestType = {setRequestType}
              formName = {"request_summary"}
              setFormName = {setFormName}
              formData = {formData}
              setFormData = {setFormData}
              appData ={{...appData,...{spendCategories},...{businessUnits},...{businesses},...{dbFieldData}}}
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
              appData ={{...appData,...{spendCategories},...{businessUnits},...{businesses},...{dbFieldData}}}
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