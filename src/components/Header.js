import React, {useState, useContext, useEffect, useRef} from 'react';
import {Context } from './Context.js';
import "bootstrap/dist/css/bootstrap.min.css"
import MultiInput from './MultiInput.js';
import FloatingPanel from './FloatingPanel.js';
import * as crud from "./apis/crud.js"

const Header = () => {

    const {
      user,
      setUser,
      userLoggedIn,
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

    

    const [showUserOptions, setShowUserOptions] = useState(false)
    
    const topBarRef = useRef(null)
    const menuRef = useRef(null)

    const iconStyle = {
        maxHeight: 50,
    cursor: "pointer"
    }

  
  const handleAppOption=(app)=>{
      const environment = window.environment
      
      if(environment === "freeagent" && app.name !== "gen_ai" && app.name!=="request_intake"){
        const FAClient = window.FAClient
        const page = apps.find(item=>item.name===app.name).home_page_link
        FAClient.navigateTo(page)
      }else{
        setSelectedApp(app.name)
        setTableName(app.db_table)
        let nextPage = app.default_component
        setPageList([nextPage])
        setPage(pages.filter(x=>x.name===nextPage)[0])
        setPageName(nextPage)
      }
  }

  const topBarStyle={
    position: "sticky",
    top: 0,
    height: 60,
    borderBottom: "1px solid lightgray",
    marginBottom: "10px",
    zIndex:9999,
    backgroundColor: "rgb(0,100,150)"
  }

  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const menuStyle={
    position: 'absolute',
    width: 300, 
    right: 0, 
    overflowY: "auto", 
    top: topBarStyle.height, 
    height: windowDimensions.height-topBarStyle.height-1,
    backgroundColor: "#9DC3E6",
  }

  const [searchTerms, setSearchTerms] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const runSearch = async (e)=>{
    if (e.key === 'Enter' || e.key === 'Tab') {
      console.log(`Running search for ...${searchTerms}`);
      const response = await crud.search(searchTerms)
      console.log(response)
      setSearchResults(response)
      setShowSearchResults(true)
    }
  }

  const [showSearchResults, setShowSearchResults] = useState(false)

  return (
    <div ref={topBarRef} className="d-flex justify-content-between" style={topBarStyle}>
      
        <div className="d-flex align-items-center p-1" style={{height:"90%", width:"400px", overflow: "hidden"}}>
          <input 
          id="search_bar"
          name="search_bar"
          value={searchTerms}
          onChange={(e)=>setSearchTerms(e.target.value)}
          onKeyUp={(e)=>runSearch(e)}
          placeholder="Search" 
          style={{color: "rgb(0,150,225)", padding: "10px", border: "none", outline: "none", borderRadius: "10px", height: "100%", width: "100%"}}></input>
        </div>

        <div className="d-flex justify-content-end" style={{height:"90%", width:"400px"}}>
          <div className="p-1"><img id="homeButton" src={appIcons.length>0? appIcons.find(item=>item.name==="home").image:null} style={iconStyle} onClick={(e)=>setPageName("Home")}></img></div>
          <div className="p-1"><img id="menuButton" src={appIcons.length>0? appIcons.find(item=>item.name==="settings").image:null} style={iconStyle} onClick={(e)=>setPageName("Settings")}></img></div>
      </div>


      {showSearchResults &&
        <FloatingPanel  title={"Search Results"} height = {"80vh"} width={"80vw"} appData={appData} displayPanel ={setShowSearchResults}>
          {searchResults.length>0 && 
          <div className="d-flex flex-column p-3" style={{height:"100%", width:"100%"}}>
            <h3>Returned {searchResults.length} results:</h3>
            <div className="d-flex flex-column" style={{width: "100%", height:"95%", overflowY:"auto"}}>
              {searchResults.map((item)=>(
                <a key={item.id} style={{textDecoration: "none"}} href={item.source}>
                  <div className="border border-1 bg-white rounded-3 mb-1 shadow-sm">
                    <div className="d-flex p-1" style={{fontSize: "18px", fontWeight: "bold", color: "black"}}>{item.title}</div>
                    <div className="d-flex p-1" style={{fontSize: "14px",  color: "black"}}>{item.contents}</div>
                    <div className="d-flex p-1" style={{fontSize: "12px", color: "gray"}}>{item.source}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>}
        </FloatingPanel>
      }

      {/* {showUserOptions &&
      <div className="d-flex flex-column border border-1 rounded rounded-3 shadow shadow p-3" 
      style={menuStyle}
      onMouseLeave={()=>setShowUserOptions(false)}
      >
        <div className="d-flex flex-column flex-wrap mb-3 border-bottom">
            <div style={{fontSize: 12}}>Signed in:</div>
            <div className="fw-bold text-primary p-1" style={{fontSize: 12}}>{user.full_name}</div>
        </div>

        <div className="d-flex flex-column flex-wrap mb-3 border-top-1 ">
          {apps.map((app,index)=>(
              <button key={index} id={app.name} name={app.name} className="btn btn-light text-secondary mb-1 text-sm p-1" onClick={(e)=>handleAppOption(app)}>
                <div className="d-flex justify-content-start">
                  <img src={app.icon} style={{height: 25, width: 25, marginRight: 10}}></img>
                  {app.label}
                </div>
              </button>
          ))}
        </div>
            
        </div>
      } */}
    </div>
  )
}

export default Header