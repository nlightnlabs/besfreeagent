import React, {useState, useContext, useEffect, useRef, useLayoutEffect} from 'react'
import {Context} from "./Context.js"
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import MultiInput from './MultiInput.js';
import StatusListBox from './StatusListBox.js';
import RequestIntakeHome from './RequestIntakeHome.js';
import Apps from './Apps.js';
import * as crud from "./apis/crud.js"
import Spinner from './Spinner.js';
import FloatingPanel from './FloatingPanel.js';


const Home = (props) => {

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
}= useContext(Context)



 
return(
    <div className={pageClass} style={{height:"100vh", width: "100vw", backgroundColor: "white"}}>
      <h1>test</h1>
    </div>
)
}

export default Home