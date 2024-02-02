import React, {useState, useContext, useEffect, useRef} from 'react';
import {Context } from './Context';
import "bootstrap/dist/css/bootstrap.min.css"
import Table from './Table.js';
import List from './List.js';
import { getTable } from './apis/axios.js';
import { toProperCase } from './functions/formatValue.js';
import ParetoChart from './ParetoChart.js';

const Requests = (props) => {

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
    tableName,
    setTableName,
    tables,
    setTables
  } = useContext(Context)

  const [data, setData] = useState([])
  const [fields, setFields] = useState([])
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [showTable, setShowTable] = useState(true)
  const [showCharts, setShowCharts] = useState(true)

  const chartsSectionRef = useRef(null)
  const [chartsSectionWindowSize, setChartsSectionWindowSize] = useState({})

  const getRequestData = async (req, res)=>{
    const response = await getTable(tableName)
    setData(response.sort((a, b) => {
      return  b.id-a.id;
    }));
    setFields(Object.keys(response[0]))
}


useEffect(()=>{
  getRequestData()
},[])

useEffect(()=>{
  setChartsSectionWindowSize({
    width: chartsSectionRef.current.clientWidth,
    height: chartsSectionRef.current.clientHeight,
  })
},[chartsSectionRef])

const chartContainerStyle={
  width: (chartsSectionWindowSize.width/3).toString()&"px",
  height: 300,
  minWidth: 400, 
  minHeight: 300,
}

const tableContainerStyle = {
  height: "100vh", 
  overflowY:"auto",
  padding: 20
}

  return (

    <div className="flex-container flex-column flex-wrap">
        <div className="d-flex flex-column bg-light">
            
            <h2 className="ps-3">{toProperCase(tableName)}</h2>
            {/* Charts container */}
            <div ref = {chartsSectionRef} className="d-flex flex-wrap justify-content-around" style={{height: 300, overflow: 'auto'}}>
              <div className="d-flex border border-1 bg-white justify-content-center rounded-3 shadow mb-3 w-md-100" style={chartContainerStyle}>
              
              </div>
              <div className="d-flex border border-1 bg-white justify-content-center rounded-3 shadow mb-3 w-md-100" style={chartContainerStyle}>
              
              </div>
              <div className="d-flex border border-1 bg-white justify-content-center rounded-3 shadow mb-3 w-md-100" style={chartContainerStyle}>
              
              </div>
            </div>

            {/* Show table container for large screen size */}
            {data.length>0 &&
            <div className="d-flex bg-light" style={tableContainerStyle}>
              <Table 
                userData={appData.user_info}
                tableName={tableName}
                />
            </div>
            }

            {/* Show list container for small screen size */}
            {data.length>0 &&
            <div className="d-flex d-md-none justify-content-center flex-wrap" style={{minHeight: "50%", overflowY:"scroll"}}>
                <List
                  tableName={tableName}
                  userData={appData.user_info}
                />
            </div>
            }
        </div>
    </div>
  )
}

export default Requests