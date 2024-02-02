import React, {useState, useContext, useEffect} from 'react';
import {Context } from './components/Context';
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import {getRecord, getTable} from './components/apis/axios.js'
import {appIcons} from './components/apis/icons.js'
import Home from './components/Home.js';
import GenAIStudio from './components/GenAIStudio.js'
import Records from './components/Records.js'
import Catalog from './components/Catalog.js'
import NewsArticle from './components/NewsArticle.js';


function App() {



   //Set up local states
   const [purchaseReqs, setPurchaseReqs] = useState(null);

   const useExternalScript = (src) => {
       useEffect(() => {
       const script = document.createElement('script');
       script.src = src;
       script.async = true;
       document.body.appendChild(script);

       setTimeout(() => {
           initializeFreeAgentConnection();
       }, 500);

       return () => {
               document.body.removeChild(script);
           };
           }, [src]);
   };
    //script to itnegrate FreeAgent library
    useExternalScript('https://freeagentsoftware1.gitlab.io/apps/google-maps/js/lib.js');
   
   //INPUT FROM FREEAGENT Specifiy App to bring in
   const PURCHASE_REQ_APP = 'custom_app_53';
   const initializeFreeAgentConnection = () => {
       
      const FAAppletClient = window.FAAppletClient;
       
       //Initialize the connection to the FreeAgent this step takes away the loading spinner
       const FAClient = new FAAppletClient({
           appletId: 'nlightnlabs-bes-home',
       });

       //Bridget to access freeagent apps
       FAClient.listEntityValues({
           entity: PURCHASE_REQ_APP,
           limit: 100,
          //  fields: [
          //      "request_date",
          //      "request_date",
          //  ]
       }, (purchaseReqs) => {
               console.log('initializeFreeAgentConnection Success!', purchaseReqs);
           if (purchaseReqs) {
               setPurchaseReqs(purchaseReqs);
           }
           });

        //OUTPUT 
       //Function to create a new record/entity in FA app
       FAClient.createEntity({
           entity:"requests",
           field_values: {
               request_type: "",
               subject: "",
               requester: "",
           }
       })

       //Function to update or delete a record/entity in FA app
       FAClient.updateEntity({
           entity:"requests", // app name
           id:"", //What record to update
           field_values: {
               request_type: "",
               subject: "",
               requester: "",
               deleted: false //ONLY USE IF need to delete
           }
       })
   };

    

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
    {name: "News Article", component: <NewsArticle/>, data: "news_article", request_type: false, description: "Description for this request", icon:`${appIcons}/Records_icon.png`},
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

        {pageData.find(item=>item.name===pageName).component}

    </div>
  );
}

export default App;