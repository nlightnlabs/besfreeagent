import React, {useState, useEffect, useMemo, useCallback} from 'react'
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import './styles/main.css'
import RecordDetails from './RecordDetails.js';
import { getTable } from './apis/axios.js';
import {toProperCase} from './functions/formatValue.js'
import { UTCToLocalTime } from './functions/time.js';
import * as nlightnApi from "./apis/nlightn.js"
import FloatingPanel from './FloatingPanel.js';

const Table = (props) => {

    const user = props.user;
    const tableName = props.tableName || ""
    const formName = props.formName || ""
    const appData = props.appData
    const [tableData, setTableData] = useState([]);
    const [fields, setFields] = useState([])
    const [recordId, setSelectedRecordId] = useState(0)
    const [showRecordDetails, setShowRecordDetails] = useState(false)
    const appIcons = props.appIcons
    

    const getTableData = async (req, res)=>{

      const response = await nlightnApi.getTable(tableName)
      console.log("table data:",response)

      let fieldList = []
        if(response.data.length>0){
          Object.keys(response.data[0]).map((field,index)=>{
            fieldList.push({headerName: toProperCase(field.replaceAll("_"," ")), field: field, filter: true})
        })
          setFields(fieldList)
        }

        setTableData(response.data.sort((a, b) => {
          return  b.id-a.id;
        }));

      }
      
  useEffect(()=>{
    getTableData()
  },[])


    const onCellClicked = (e) => {
      setSelectedRecordId(e.data.id)
      setShowRecordDetails(true)
    }
  
  return (
      <div className="ag-theme-quartz animate__animated animate__fadeIn animate__duration-0.5s" style={{fontSize:"12px", height: "100%", width: "100%" }}>
        <AgGridReact 
          rowData={tableData} 
          columnDefs={fields} 
          onCellClicked={onCellClicked}
        />
        {
          showRecordDetails && 
          <div className="d-flex" style={{height:"100vh", width: "100vw", backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", top: 0, left:0, zIndex:999}}>
            <FloatingPanel
              title={""}
              top="50vh"
              left="50vw"
              height="80vh"
              width="50vw"
              appData={appData}
              displayPanel={setShowRecordDetails}
            >
            <RecordDetails
              tableName={tableName}
              recordId={recordId}
              tableData={tableData}
              formName={formName}
              user = {user}
              appData = {appData}
              setShowRecordDetails = {setShowRecordDetails}
              refreshTable = {setTableData}
              updateParentStates = {[getTableData]}
            />
            </FloatingPanel>
          </div>
        }          
    </div>
  )
}

export default Table