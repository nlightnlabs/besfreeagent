import React, {useState, useContext, useEffect} from 'react';
import {Context } from './components/Context.js';
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import {getRecord, getTable} from './components/apis/axios.js'
import {appIcons} from './components/apis/icons.js'
import Home from './components/Home.js';
import GenAIStudio from './components/GenAIStudio.js'
import Records from './components/Records.js'
import Catalog from './components/Catalog.js'
import Article from './components/Article.js';
import Header from './components/Header.js'
import * as crud from "./components/apis/crud.js"

function App() {

  // ********************************************************************FREE AGENT CONNECTION***********************************************************
    
    // IMPORTANT:  Be sure to import crud functions file where data needs to be added, updated, or deleted and include freeagent api file in api folder

    // Set the environment to either freeagent or nlightn
    let environment = "freeagent"
    if(process.env.NODE_ENV ==="development"){
        environment = "nlightn"
    }
    window.environment = environment

    const[faTest, setFATest] = useState([])
    
    const useExternalScript = (src) => {
        useEffect(() => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            document.body.appendChild(script);

            //Initialize the connection to the FreeAgent this step takes away the loading spinner
            setTimeout(() => {
                const FAAppletClient = window.FAAppletClient;

                const FAClient = new FAAppletClient({
                    appletId: 'nlightnlabs-bes-home',
                });
                window.FAClient = FAClient;

                FAClient.listEntityValues({
                  entity:"web_app"
                },(response)=>{
                  console.log("Free agent connection successfully.  Web apps: ",response)
                  setFATest(response)
                })

            }, 500);

            return () => {
                document.body.removeChild(script);
            };
        }, [src]);
    };
    //script to itnegrate FreeAgent library
    useExternalScript('https://freeagentsoftware1.gitlab.io/apps/google-maps/js/lib.js');



// ********************************************************APP SPECIFIC CODE STARTS HERE******************************************************************************

  
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
    icons,
    apps,
    setApps,
    selectedApp,
    setSelectedApp
  } = useContext(Context)


  let pageData=[
    {name: "Home", component: <Home/>, data: "home", request_type: false, description: "Description for this request", icon:`${appIcons}/home_icon.png`},
    {name: "GenAIStudio", component: <GenAIStudio/>, data: "gen_ai_stuid", request_type: false, description: "Description for this request", icon:`${appIcons}/GenAIStudio_icon.png`},
    {name: "Catalog", component: <Catalog/>, data: "catalog", request_type: false, description: "Description for this request", icon:`${appIcons}/Catalog_icon.png`},
    {name: "Records", component: <Records/>, data: "records", request_type: false, description: "Description for this request", icon:`${appIcons}/Records_icon.png`},
    {name: "Annoncement", component: <Article/>, data: "news_article", request_type: false, description: "Description for this request", icon:`${appIcons}/Records_icon.png`},
  ]


  const getPageData = async(req, res)=>{
    try{
      setPages(pageData)
      setPage(pageData.filter(x=>x.name===pageName)[0])
    }catch(error){
      console.log(error)
    }
  }

  const getRequestTypes = ()=>{
    let list = []
    pageData.forEach(item=>{
      item.request_type && list.push(item)
    })
    return list
  }

  const getUserInfo = async(req, res)=>{
    const params ={
      tableName: "users",
      conditionalField: "email",
      condition: user
    }
    const response = await getRecord(params)
    alert(response)
    setUser(response)
  }

  const getApps = async(req, res)=>{
    const response = await getTable("apps")
    setApps(response.data)
  }

 useEffect(()=>{
    getPageData()
    setRequestTypes(getRequestTypes()) 
    getUserInfo()
    getApps()
  },[])
 
  const pageStyle={
    backgroundSize: "cover",
    backgroundImage: "linear-gradient(0deg, rgb(220, 230, 255), rgb(245, 250, 255), white)",
    height: "100vh",
    width: "100vw",
    overflow: "hidden"
  }

  return (
    <div style={pageStyle}>
        <Header/>
        {pageData.find(item=>item.name===pageName).component}
    </div>
  );
}

export default App;