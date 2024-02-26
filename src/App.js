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
    pageName,
  } = useContext(Context)

  const [displayPage, setDisplayPage] = useState(false)

  let pageData=[
    {name: "Home", component: <Home/>, data: "home", request_type: false, description: "Description for this request", icon:`${appIcons}/home_icon.png`},
    {name: "GenAIStudio", component: <GenAIStudio/>, data: "gen_ai_stuid", request_type: false, description: "Description for this request", icon:`${appIcons}/GenAIStudio_icon.png`},
    {name: "Catalog", component: <Catalog/>, data: "catalog", request_type: false, description: "Description for this request", icon:`${appIcons}/Catalog_icon.png`},
    {name: "Records", component: <Records/>, data: "records", request_type: false, description: "Description for this request", icon:`${appIcons}/Records_icon.png`},
    {name: "Annoncement", component: <Article/>, data: "news_article", request_type: false, description: "Description for this request", icon:`${appIcons}/Records_icon.png`},
  ]

 
  const pageStyle={
    backgroundSize: "cover",
    backgroundImage: "linear-gradient(0deg, rgb(220, 230, 255), rgb(245, 250, 255), white)",
    height: "100vh",
    width: "100vw",
    overflow: "hidden"
  }

  useEffect(()=>{
    if(FAClient !==null){
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