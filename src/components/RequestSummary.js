import React, {useState, useEffect, useContext} from 'react'
import { Context } from "./Context.js"
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import SuccessIcon from './success_icon.svg';
import {toProperCase} from './functions/formatValue.js'
import updateActivity from './updateActivity.js';

const RequestSummary = () => {

    const {
        user,
        setUser,
        userLoggedIn,
        setUserLoggedIn,
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
        setRequestTypes
      } = useContext(Context)

let formData = {}

const [pageClass, setPageClass] = useState("container mt-5 animate__animated animate__fadeIn animate__duration-0.5s")
  
 const boxStyle={
    width: "100%",
    height: "100%",
    overflowY: "auto"

 }

 const [files, setFiles] = useState([])

 

 useEffect(()=>{
    console.log(appData)
    let x = Array.from(attachments)
    setFiles(x)

    console.log({app:"requests",record: appData.request_summary.id , user:user,description:"New request submitted"})

    // updateActivity({app:"requests",record: appData.request_summary.id , user:user,description:"New request submitted"});
 },[])

 const handleSubmit = (e)=>{
    let request_summary = {}
    setAppData({...appData, request_summary})

    let request_details = {}
    setAppData({...appData, request_details})

    let nextPage ="Requests"

    if(e.nativeEvent.submitter.name==="againButton"){
        nextPage = "Home"
    }
    setPage(pages.filter(x=>x.name===nextPage)[0])
    setPageList([...pageList,nextPage])
    setPageName(nextPage)
 }

  return (
    <div className = {pageClass} style={{height: "100%", overflow:"hidden"}}>
        <div className="row" style={{height: "100%", overflow:"hidden"}}>
            <div className="col"></div>

            <div className="col-lg-8" style={{height: "100%", overflowY:"hidden"}}>
                <div className="d-flex justify-content-center mt-3">
                    <form onSubmit={handleSubmit}>
                    <div className="btn-group mb-3">
                        <button name="againButton" className="btn btn-outline-secondary" data-bs-toggle="button" type="submit">Request Again</button>
                        <button name="requestsButton" className="btn btn-primary" data-bs-toggle="button" type="submit">See Requests</button>
                    </div>
                    </form>
                </div>

                <div className="d-flex justify-content-center animate__animated animate__heartbeat animate__duration-0.5s" style={{height: 150, overflow: "hidden"}}>
                    <img  src={appData.appIcons.find(i=i.name==="check_mark").image} style={{height: 125} }alt="Success Icon"/>
                </div>
            
                <h1 className="text-center">Thank You</h1>
                <h4 className="text-center">Your request is being reviewed</h4>

                
                
                
                <div className="=flex-fill shadow shadow-lg rounded-top-2" style={{backgroundImage: "linear-gradient(45deg, rgb(9, 128, 243), rgb(0, 223, 255))", height:25}}></div>
                
                <div className="box d-flex flex-column border border-1 rounded-2 bg-light shadow p-3" style={boxStyle}>
                    <table className="table" style={{overFlowY: "auto"}}>
                        <tbody>
                            {
                            Object.keys(appData).map((attr, index) => (
                            attr !=="user_info" && 
                            <table style={{fontSize: 14, width: "100%"}}>
                            <tbody>
                                <tr >
                                    <td colspan="2" className="bg-light p-0 w-100" style={{fontSize: 18, fontWeight: 'bold'}}>{toProperCase(attr.replaceAll("_"," "))}</td>
                                </tr>
                                {Object.keys(appData[attr]).map((item,index2)=>(
                                    <tr style={{borderTop: "1px solid lightgray", height: 14, paddingLeft: 20, paddingRight: 10}} key={index2}>
                                        <td style={{width: "25%"}}>{toProperCase(item.replaceAll("_"," "))}</td>
                                        <td style={{width: "70%"}}>
                                            {item && typeof appData[attr][item] ==="object" && Array.isArray(appData[attr][item]) && item=="attachments"?
                                                <ul>
                                                    {(appData[attr][item]).map((obj, index3)=>(
                                                        obj && <li key={index3}><a href={`${obj["url"]}`}>{obj["name"]}</a></li>
                                                    ))}  
                                                </ul>
                                            :
                                            item && typeof appData[attr][item] ==="object" && Array.isArray(appData[attr][item])? 
                                                <ul>
                                                    {(appData[attr][item]).map((obj, index3)=>(
                                                        obj && <li key={index3}>{JSON.stringify(obj).replace(/[\[\]{\}/'/"]/g,'').replaceAll(/,/g,", ").replaceAll(/:/g,": ")}</li>
                                                    ))}  
                                                </ul>
                                            :
                                                item && typeof appData[attr][item] === "object" && !Array.isArray(appData[attr][item])?
                                                <ul>
                                                    {Object.keys(appData[attr][item]).map((obj, index3)=>(
                                                        obj && <li key={index3}>{JSON.stringify([obj]).replace(/[\[\]{\}/'/"]/g,'').replaceAll(/,/g,", ").replaceAll(/:/g,": ")}</li>
                                                    ))}  
                                                </ul>
                                            :
                                            item && typeof appData[attr][item] === "string"?
                                                <span>{appData[attr][item]}</span>
                                            :
                                            <div>{JSON.stringify(appData[attr][item])}</div>
                                            }
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                                </table>
                            ))} 
                        </tbody>
                    </table>
                    
                </div>
                
            </div>
            <div className="col"></div>
        </div>
      
    </div>
  )
}

export default RequestSummary