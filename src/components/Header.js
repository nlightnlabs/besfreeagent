import React, {useState, useContext, useEffect, useRef} from 'react';
import {Context } from './Context.js';
import "bootstrap/dist/css/bootstrap.min.css"

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
      setSelectedApp(app.name)
      setTableName(app.db_table)
      let nextPage = app.default_component
      setPageList([nextPage])
      setPage(pages.filter(x=>x.name===nextPage)[0])
      setPageName(nextPage)
  }

  const topBarStyle={
    position: "sticky",
    top: 0,
    height: 60,
    borderBottom: "1px solid lightgray",
    marginBottom: "10px",
    zIndex:9999
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

  return (
    <div ref={topBarRef} className="d-flex bg-white justify-content-end" style={topBarStyle}>
      <div className="p-1"><img id="homeButton" src={appIcons.length>0? appIcons.find(item=>item.name==="home").image:null} style={iconStyle} onClick={(e)=>setPageName("Home")}></img></div>
      <div className="p-1"><img id="menuButton" src={appIcons.length>0? appIcons.find(item=>item.name==="menu").image:null} style={iconStyle} onClick={(e)=>setShowUserOptions(!showUserOptions)}></img></div>

      {showUserOptions &&
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
      }
    </div>
  )
}

export default Header