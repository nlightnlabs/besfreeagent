import React, {useState, useContext, useEffect, useRef, useLayoutEffect} from 'react'
import {Context} from "./Context.js"
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import MultiInput from './MultiInput.js';
import { getTable, getRecords, search } from './apis/axios.js';
import StatusListBox from './StatusListBox.js';
import Draggable from 'react-draggable'
import RequestIntakeHome from './RequestIntakeHome.js';
import * as crud from "./apis/crud.js"


const Home = (props) => {

  const {
    user,
    setUser,
    users,
    setUsers,
    page,
    appIcons,
    setAppIcons,
    setPage,
    pages,
    setPages,
    pageName,
    setPageName,
    requestType,
    setRequestType,
    appData,
    setAppData,
    pageList,
    setPageList,
    tableName,
    setTableName,
    apps,
    setApps,
    selectedApp,
    setSelectedApp
  } = useContext(Context)

  

  useEffect(()=>{
      getAnnouncements()
      getApps()
      getRequests()
},[])

  const [announcements, setAnnouncements] = useState([])
  const [requests, setRequests] = useState([])
  const [searchTerms, setSearchTerms] = useState("")

 

  const [highlightedAnnouncement, setHlightedAnnouncement] = useState({});
  
  const getAnnouncements = async (req, res)=>{
    const environment = window.environment
    let appName = ""
    if(environment ==="freeagent"){
      appName= "announcement"
    }else{
      appName="announcements"
    }
    try{
      const response = await crud.getData(appName)
        console.log("announcements: ",response)
        setAnnouncements(response)
        setHlightedAnnouncement(response[0]);
    }catch(error){
      console.log(error)
      setAnnouncements([])
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

  const getRequests = async (req, res)=>{
    const environment = window.environment
    let appName = ""
    if(environment ==="freeagent"){
      appName= "custom_app_52"
    }else{
      appName="requests"
    }
    try{
      const response = await crud.getData(appName)
        console.log("requests: ",response)
        setRequests(response)
    }catch(error){
        console.log(error)
        setRequests([])
    }
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


const handleSearch = async (e)=>{

  const searchResults = search(searchTerms)

}


  const goToCatalog =(e)=>{
    const nextPage = "Catalog"
    setPage(pages.filter(x=>x.name===nextPage)[0])
    setPageList([...pageList,nextPage])
    setPageName(nextPage)
  }

  const gotToGenAI =(e)=>{
    const nextPage = "GenAIStudio"
    setPage(pages.filter(x=>x.name===nextPage)[0])
    setPageList([...pageList,nextPage])
    setPageName(nextPage)
  }

  const handleSelectedApp =(e,app)=>{
    const environment = window.environment
    
    const parentId = e.currentTarget.parentElement.id; 
    setSelectedApp(parentId)
    console.log(parentId)
    
    if(environment == "freeagent"){
      const appHomePage = apps.find(i=>i.name === parentId).home_page_link
      console.log(appHomePage)
      const FAClient = window.FAClient
      FAClient.navigateTo(appHomePage)
    }else{
      setTableName(apps.filter(row=>row.name==parentId)[0].db_table)
      const nextPage = app.default_component
      setPage(pages.filter(x=>x.name===nextPage)[0])
      setPageList([...pageList,nextPage])
      setPageName(nextPage)
    }
  }

  const handleSelectedArticle =(articleId)=>{
    
    if (articleId>0){
      setAppData({...appData,...{["selected_article_id"]:articleId}})
      const nextPage = "Announcement"
      setPage(pages.filter(x=>x.name===nextPage)[0])
      setPageList([...pageList,nextPage])
      setPageName(nextPage)
    }
  }
  
  
 // Effect to rotate images at equal intervals
 useEffect(() => {
    let intervalId;
    if (announcements.length > 0) {
      let index = 0;
  
      const rotateImages = () => {
        index = (index + 1) % announcements.length; // Increment index and reset to 0 when reaching the end  
        setHlightedAnnouncement(announcements[index]);
      };

      // Set an interval to rotate images at 3-second intervals
      intervalId = setInterval(rotateImages, 3000);
    }

    // Clean up the interval when the component unmounts or when newsData changes
    return () => clearInterval(intervalId);
  }, [announcements]);

  const sectionTitleStyle={
    fontSize: 20,
    fontWeight: "normal",
    color: "#5B9BD5",
    marginBottom: 10
  }

  const iconStyle={
    maxHeight: 40,
    maxWidth: 40,
    cursor: "pointer"
  }

  const bannerRef = useRef()
  const [bannerWidth, setBannerWidth] = useState("100%")
  const [contentWidth, setContentWidth] = useState("100%")
  useEffect(()=>{
    setBannerWidth(bannerRef.current.clientWidth)
  },[bannerRef, announcements])

  useEffect(()=>{
    setContentWidth(bannerWidth)
  },[bannerWidth])

  const [imageClass, setImageClass] = useState("animate__animated animate__fadeIn animate__duration-0.5s")
  const [pageClass, setPageClass] = useState("flex-container animate__animated animate__fadeIn animate__duration-0.5s")

  // This segment auto sizes the content height according to the window height
  const contentContainerRef = useRef();
  const [contentContainerHeight, setContentContainerHeight] = useState('');
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const handleContainerResize = () => {
    if (contentContainerRef.current) {
      const { top } = contentContainerRef.current.getBoundingClientRect();
      setContentContainerHeight(windowHeight - top);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    handleContainerResize(); 

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [windowHeight]);


  useLayoutEffect(() => {
    
    // Recalculate container height on window resize
    window.addEventListener('resize', handleContainerResize);

    // Call initially to calculate height after render
    handleContainerResize(); 

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleContainerResize);
    };
  }, [windowHeight, contentContainerRef]);

 
return(
    <div className={pageClass}>

    {/* Search bar and shop menu */}
    {/* <div className="d-flex justify-content-center mb-3">
        <div className="d-flex justify-content-between" style={{width: "50%"}}>

          <div className="d-flex me-3 flex-column" onClick={(e)=>goToCatalog(e)}>
                <img style={iconStyle} src={appIcons.length > 0 ? appIcons.find(item=>item.name==="shopping").image:null}></img>
                <div style={{fontSize: 14, color: "gray"}}>Shop</div>
            </div>
            <div className="d-flex me-3 flex-column" onClick={(e)=>gotToGenAI(e)}>
                <img style={iconStyle} src={appIcons.length > 0 ? appIcons.find(item=>item.name==="gen_ai").image:null}></img>
                <div style={{fontSize: 14, color: "gray"}}>GenAI</div>
            </div>


            <MultiInput
                valueSize={14}
                valueColor="#5B9BD5"
                label="Search"
                border={"2px solid lightgray"}
                onChange={(e)=>setSearchTerms(e.target.value)}
            />
            <div className="d-flex me-3 flex-column" onClick={(e)=>gotToGenAI(e)}>
                <img style={iconStyle} src={appIcons.length > 0 ? appIcons.find(item=>item.name==="search").image:null}></img> 
                <div style={{fontSize: 14, color: "gray"}}>Search</div>
            </div>
        </div>
    </div> */}
        
    {/* News Banner */}
    
    {/* <div className="d-flex justify-content-center p-0" style={{ margin: "0", padding: "0" }}>
      <div ref={bannerRef} className="carousel p-0 border border-1 rounded-3 bg-white shadow ms-2 me-2 mb-3 justify-content-center" 
      style={{ height: "auto", width: "100%", overflowY: "hidden", margin: "auto", padding: "0", cursor: "pointer"}}>
          {announcements.length > 0 && (
              <img
                  src={highlightedAnnouncement.cover_image}
                  alt={highlightedAnnouncement.headline}
                  className={imageClass}
                  style={{ width: "100%", height: "auto", margin: "auto"}}
                  onClick={(e)=>handleSelectedArticle(highlightedAnnouncement.id)}
              />
          )}
      </div>
  </div> */}

    {/* Content section */}
    <div className="d-flex justify-content-center">
    
      <div ref={contentContainerRef} className="d-flex justify-content-between" style={{width: "100%", height:contentContainerHeight, minHeight:"300px"}}>
        
         {/* Request Something Panel*/}
          <div className="d-flex flex-column justify-content-around p-2 border border-1 rounded-3 bg-white shadow m-2" 
          style={{height: "95%", width: "33%", minWidth:"300px", overflowY: "auto"}}>
            <div style={sectionTitleStyle}>Request Something</div>
            <div style={{overflowY: "auto"}}>
              <RequestIntakeHome
                appData = {appData}
                setSelectedApp = {setSelectedApp}
                setTableName = {setTableName}
                setPage = {setPage}
                pageList = {pageList}
                setPageList = {setPageList}
                pages = {pages}
                apps = {apps}
                pageName={pageName}
                setPageName={setPageName}
              />
            </div>
          </div>
  

        {/* Request status panel */}
          {/* <div className="d-flex flex-column justify-content-around p-2 border border-1 rounded-3 bg-white shadow m-2" 
          style={{height: "95%", width: "33%", minWidth:"300px", overflowY: "auto"}}>
            <div style={sectionTitleStyle}>My Requests</div>
            <div style={{overflowY: "auto"}}>
              <StatusListBox
                  title="My Requests"
                  data={requests}
                  colors = {colors}
                  buttonLabel = "New Request"
                  listType = "status"
                  updateParentStates = {{setPageName, setPage, setPageList, setSelectedApp, pages, pageList}}
                  appData = {{user: appData.user_info}}
              />
              </div>
          </div> */}

         {/* Work on Something Panel */}
        {/* <div className="d-flex flex-column p-2 border border-1 rounded-3 bg-white shadow m-2" style={{height: "95%", width: "33%",minWidth:"300px", overflowY: "auto"}}>
            <div style={sectionTitleStyle}>Work on Something</div>
            <div className="d-flex justify-content-center flex-wrap">
            {
              apps.map((app,index)=>(
                <div id={app.name} className="d-flex flex-column m-3" style={{height: 50, width: 50, zIndex:100, cursor: "pointer"}} key={index}>
                    <img  style={iconStyle} src={appIcons.length > 0 ? appIcons.find(item=>item.name===app.icon).image:null} alt={`${app.label} icon`} onClick={(e)=>{handleSelectedApp(e, app)}}></img>
                    <div style={{fontSize: 12, color: "gray"}} onClick={(e)=>{handleSelectedApp(e,app)}}>{app.label}</div>
                </div>
              ))
            }
            </div>
        </div> */}
            
        </div>
        
    </div>

</div>
)
}

export default Home