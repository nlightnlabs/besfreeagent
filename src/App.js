import React, {useState, useContext, useEffect} from 'react';
import {Context } from './components/Context.js';
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import Home from './components/Home.js';
import GenAIWorkbench from './components/GenAIWorkbench.js';
import Records from './components/Records.js'
import MarketPlace from './components/MarketPlace.js'
import Article from './components/Article.js';
import Header from './components/Header.js'
import * as crud from './components/apis/crud.js'

function App() {

  // ********************************************************************FREE AGENT CONNECTION***********************************************************
    
    // IMPORTANT:  Be sure to import crud functions file where data needs to be added, updated, or deleted and include freeagent api file in api folder

    // Set the environment to either freeagent or nlightn
    let environment = "freeagent"
    if(process.env.NODE_ENV ==="development"){
        environment = "nlightn"
    }
    window.environment = environment

    const [FAClient, setFAClient] = useState(null)
    
    const useExternalScript = (src) => {
        useEffect(() => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            document.body.appendChild(script);
            

            //Initialize the connection to the FreeAgent this step takes away the loading spinner
            setTimeout(()=>{
                const FAAppletClient = window.FAAppletClient;
                let faClient = new FAAppletClient({
                    appletId: 'nlightnlabs-bes-home',
                });
                window.FAClient = faClient;
                setFAClient(faClient)
            },500)
                
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
    users,
    setUsers,
    appIcons,
    setAppIcons,
    pageName,
    setPageName,
    apps,
    setApps
  } = useContext(Context)

  const [displayPage, setDisplayPage] = useState(false)

  let pageData=[
    {name: "Home", component: <Home/>},
    {name: "GenAI Workbench", component: <GenAIWorkbench/>},
    {name: "Market Place", component: <MarketPlace/>},
    {name: "Records", component: <Records/>},
    {name: "Article", component: <Article/>},
  ]

  const pageStyle={
    backgroundSize: "cover",
    backgroundImage: "linear-gradient(0deg, rgb(220, 230, 255), rgb(245, 250, 255), white)",
    height: "100vh",
    width: "100vw",
    overflow: "hidden"
  }

  const getUserData = async ()=>{
    const response = await crud.getUserData()
    console.log("users: ",response)
    setUser(response.user)
    setUsers(response.users)
  }

  const getAppIcons = async (req, res)=>{
    const environment = window.environment
    let appName = ""
    if(environment ==="freeagent"){
      appName= "icon"
    }else{
      appName="icons"
    }

    try{
        const response = await crud.getData(appName)
        console.log("app icons: ",response)
        setAppIcons(response)
    }catch(error){
        console.log(error)
        setAppIcons([])
    }
  }

  const getApps = async (req, res)=>{
    const environment = window.environment
    let appName = ""
    if(environment ==="freeagent"){
      appName= "web_app"
    }else{
      appName="apps"
    }

    try{
      const response = await crud.getData(appName)
        console.log("apps: ",response)
        setApps(response)
    }catch(error){
      console.log(error)
      setApps([])
    }
  }

  useEffect(()=>{
    if(FAClient !==null){
      getUserData()
      getAppIcons()
      getApps()
      setDisplayPage(true)
    }
},[FAClient])

  return (
    <div style={pageStyle}>
        {displayPage && <Header/>}
        {displayPage && pageData.find(item=>item.name===pageName).component}
    </div>
  );
}

export default App;