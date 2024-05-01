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


  const [announcements, setAnnouncements] = useState([])
  const [requests, setRequests] = useState([])
  const [searchTerms, setSearchTerms] = useState("")
  const [highlightedAnnouncement, setHlightedAnnouncement] = useState({});
  const [loading, setLoading] = useState(true)
  
  const getAnnouncements = async ()=>{
    const environment = window.environment
    let appName = ""
    if(environment ==="freeagent"){
      appName= "announcement"
    }else{
      appName="announcements"
    }
    try{
      const response = await crud.getData(appName)
        setAnnouncements(response)
        setHlightedAnnouncement(response[0]);
    }catch(error){
      console.log(error)
      setAnnouncements([])
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
      
        setRequests(response)
        setAppData(prev=>({...prev,icons: appIcons}))
    }catch(error){
        console.log(error)
        setRequests([])
    }
  }


  useEffect(()=>{

    const loadData = async () => {
      try {
        await getAnnouncements();
        getRequests();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();

},[])

  const handleSelectedApp =(e,app)=>{
    const environment = window.environment
    
    const parentId = e.currentTarget.parentElement.id; 
    console.log("parentId",parentId)
    setSelectedApp(parentId)
    
    if(environment == "freeagent"){
      
      if(parentId =="gen_ai"){
        const nextPage = app.home_page_link
        setPage(pages.filter(x=>x.name===nextPage)[0])
        setPageList([...pageList,nextPage])
        setPageName(nextPage)
      }
      else{
        const appHomePage = apps.find(i=>i.name === parentId).home_page_link
        const FAClient = window.FAClient
        FAClient.navigateTo(appHomePage)
      }
    }else{
      setTableName(apps.find(row=>row.name==parentId).db_table)
      const nextPage = app.default_component
      setPage(pages.filter(x=>x.find===nextPage))
      setPageList([...pageList,nextPage])
      setPageName(nextPage)
    }
  }

  const handleSelectedArticle =(articleId)=>{
    console.log(articleId)
    if (articleId !=null && articleId !=""){
      setAppData({...appData,...{["selected_article_id"]:articleId}})
      const nextPage = "Article"
      
      console.log("pages", pages)
      console.log("pages.find(x=>x.name===nextPage)",pages.find(x=>x.name===nextPage))

      setPage(pages.find(x=>x.name===nextPage))
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
    fontSize: 24,
    fontWeight: "normal",
    color: "#5B9BD5",
    marginBottom: 10,
    backgroundColor: "rgb(225,235,245)"
  }

  const bannerRef = useRef()
  const [bannerWidth, setBannerWidth] = useState("100%")
  const [contentWidth, setContentWidth] = useState("100%")
  useEffect(()=>{
    if(bannerRef.current){
      setBannerWidth(bannerRef.current.clientWidth)
    }
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
    <div className={pageClass} style={{height:"100vh", width: "100vw", backgroundColor: "white"}}>
      
    {/* News Banner */}
    
    {!loading && 
      <div className="d-flex justify-content-center p-0" style={{ margin: "0", padding: "0" }}>
      <div ref={bannerRef} className="carousel p-0 border border-1 rounded-3 bg-white shadow ms-2 me-2 mb-3 justify-content-center" 
      style={{ height: "auto", width: "100%", overflow: "hidden", margin: "auto", padding: "0", cursor: "pointer"}}>
          {announcements.length > 0 && (
              <img
                  src={highlightedAnnouncement.cover_image}
                  alt={highlightedAnnouncement.headline}
                  className={imageClass}
                  style={{ width: "100%", height: "100%", margin: "auto"}}
                  onClick={(e)=>handleSelectedArticle(highlightedAnnouncement.id)}
              />
          )}
      </div>
    </div>
    }

    {/* Content section */}
    {!loading && 
    <div className="d-flex justify-content-center" style={{height: "80%"}}>
    
      <div ref={contentContainerRef} className="d-flex justify-content-between" style={{width: "100%", height:"90%", minHeight:"300px"}}>

        
         {/* Request Something Panel*/}
          <div className="d-flex flex-column justify-content-around border border-1 rounded-3 bg-white shadow m-2" 
          style={{height: "95%", width: "33%", minWidth:"300px", overflowY: "auto"}}>
            <div className="p-2" style={sectionTitleStyle}>Request Something</div>
            <div className="p-3" style={{overflowY: "auto"}}>
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

            {/* Work on Something Panel */}
          <div className="d-flex flex-column border border-1 rounded-3 bg-white shadow m-2" style={{height: "95%", width: "70%",minWidth:"300px", overflow: "hidden"}}>
            <div className="p-2" style={sectionTitleStyle}>Work on Something</div>
            <div className="d-flex flex-column p-3" style={{width: "100%", height:"90%", overflowY:"auto"}}>
              <Apps 
                apps = {apps}
                handleSelectedApp = {handleSelectedApp}
              />
              </div>
          </div>
          </div>
          </div>
        }
    </div>
)
}

export default Home