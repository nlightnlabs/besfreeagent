import React, {useState, useContext, useEffect, useRef} from 'react';
import {Context } from './Context.js';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from './apis/axios.js'
import { generalIcons } from './apis/icons.js';
import './styles/main.css'
import StatusListBox from './StatusListBox.js';

const LandingPage = () => {


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
    requestTypes,
    setRequestTypes,
    appData,
    setAppData,
    attachments,
    setAttachments,
    pageList,
    setPageList,
    icons
  } = useContext(Context)


const headerStyle={
    height: 200,
    marginBottom: 10
}


const tasks = [
    {subject: "CDW contract renewal", status: "New Document", timestamp: "Yesterday"},
    {subject: "Furniture installation for HQ", status: "New Comment",timestamp: "Thursday, 12/10/23"},
    {subject: "Specs refresh for IT hardware", status: "Completed", timestamp: "Monday, 12/09/23"},
    {subject: "New Tableau license provisioning", status: "Completed", timestamp: "Tuesday, 12/02/23"},
    {subject: "Digital tansformation project", status: "Cancelled", timestamp: "Friday, 11/30/23"}
]

const requests = [
    {subject: "Order for Additional Google licenses", status: "Approved", timestamp: "Today"},
    {subject: "MSA for New Partnership", status: "Reviewing", timestamp: "Tuesday, 12/19/23"},
    {subject: "Access to Jira", status: "Denied" ,timestamp: "Friday, 12/15/23"},
    {subject: "New Laptop and Mouse", status: "Approved", timestamp: "Wednesday, 12/13/23"},
    {subject: "Help with Sourcing Event", status: "Hold", timestamp: "Friday, 10/08/23"}
]

const actions = [
    {subject: "Update supplier business records for professional services", status: ""},
    {subject: "Evaluate new suppliers for IT consulting", status: ""},
    {subject: "Update bill rates for temp staff services", status: ""},
    {subject: "Update risk profiles for shipping and freight suppliers", status: ""},
    {subject: "Update ESG data for facility maintenance suppliers", status: ""},
    {subject: "Update payment terms for courier services ", status: ""}
]

const searchBarStyle = {
    width: "100%",
    height: 100,
    border: "1px solid rgb(235,235,235)",
    borderRadius: 10,
    backgroundColor: 'white',
    marginTop: 50,
    fontSize: 50,
    color: "rgb(235,235,235)",
    placeholderColor: "rgb(235,235,235)"
}


const colors =[
    {status: "Draft", color: "rgba(200,200,200,1)"},
    {status: "Approved", color: "green"},
    {status: "Reviewing", color: "rgba(92,155,213,1)"},
    {status: "Hold", color: "orange"},
    {status: "Denied", color: "red"},
    {status: "Completed", color: "green"},
    {status: "New Document", color: "rgba(92,155,213,1)"},
    {status: "New Comment", color: "orange"},
    {status: "Cancelled", color: "red"}
]


const pageStyle={
    height: "100%",
    width: "100%",
    overflowY: "auto",
    overflowX: "hidden"
}

useEffect(()=>{

},[tasks, requests, actions])
 

  return (
    <div className="flex-container justify-content-center">

    {/* Searchbar Panel */}
    <div className="d-flex p-3 justify-content-between" style={headerStyle}>
        <input className = "d-flex bg-white shadow p-3" style={searchBarStyle} placeholder="Search..."></input>
    </div>


    <div className="d-flex"></div>

    {/* Main Content Panels */}
    <div className="grid p-md-5">

        {/* Panel 1 */}
        <div className="panel">
            <StatusListBox
                title="My Requests"
                data={requests}
                colors = {colors}
                buttonLabel = "New Request"
                listType = "status"
            />
        </div>

        {/* Panel 2 */}
        <div className="panel">
            <StatusListBox
                title="My Work"
                data={tasks}
                colors = {colors}
                buttonLabel = "New Work"
                listType = "status"
            />
        </div>

        {/* Panel 3 */}
        <div className="panel">
            <StatusListBox
                title="Suggested Actions"
                data={actions}
                colors = {colors}
                listType = "action"
            />
        </div>

                
        </div>  
    </div>
  )
}

export default LandingPage