import React, {useState, useContext, useEffect, useRef, createRef} from 'react';
import axios from './apis/axios.js'
import "bootstrap/dist/css/bootstrap.min.css"
import {toProperCase} from "./functions/formatValue.js"
import { generalIcons } from './apis/icons.js'
import {updateRecord, getTable} from './apis/axios.js'
import RecordDetails from './RecordDetails.js';

const List = (props) => {

  const userData = props.userData;
  const tableName = props.tableName || ""
  const [tableData, setTableData] = useState([]);
  const [fields, setFields] = useState([])
  const [recordId, setSelectedRecordId] = useState(0)
  const [showRecordDetails, setShowRecordDetails] = useState(false)


  const getTableData = async (req, res)=>{
    const response = await getTable(tableName)
    setTableData(response.data.sort((a, b) => {
      return  b.id-a.id;
    }));

    let fieldList = []
      if(response.data.length>0){
        Object.keys(response.data[0]).map((field,index)=>(
          fieldList.push({field: field, filter: true})
        ))
        setFields(fieldList)
      }
    }
    

useEffect(()=>{
  getTableData()
},[])

  const handleRecordSelect = (e) => {
    setSelectedRecordId(e.currentTarget.id)
    setShowRecordDetails(true) 
  }

useEffect(()=>{
  
},[props])


const titleStyle = {
  color: "black",
  fontSize: 18,
  fontWeight: "bold"
}
const labelStyle ={
  color: "gray",
  fontSize: 12
}

const valueStyle ={
  color: "black",
  fontSize: 14
}

return (
    <div className="d-flex flex-column bg-light w-100 p-3">
      {
        tableData.map((record,index)=>(
          <div key={index} id={record.id} className="rounded-3 shadow-sm" style={{cursor: "pointer"}} onClick={(e)=>handleRecordSelect(e)}>
          <table className="table table-borderless">
            <thead>
              <tr>
                <th scope="col" className="w-50"></th>
                <th scope="col" className="w-50"></th>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td colSpan="2">
                <div style={labelStyle}>{toProperCase(Object.keys(record)[2].replaceAll("_"," "))}</div>
                <div style={titleStyle}>{record[Object.keys(record)[2]]}</div>
              </td>
            </tr>
            <tr>
              <td>
                <div style={labelStyle}>{toProperCase(Object.keys(record)[3].replaceAll("_"," "))}</div>
                <div style={valueStyle}>{record[Object.keys(record)[3]]}</div>
              </td>
              <td>
                <div style={labelStyle}>{toProperCase(Object.keys(record)[4].replaceAll("_"," "))}</div>
                <div style={valueStyle}>{record[Object.keys(record)[4]]}</div>
              </td>
            </tr>
            <tr>
              <td>
                <div style={labelStyle}>{toProperCase(Object.keys(record)[5].replaceAll("_"," "))}</div>
                <div style={valueStyle}>{record[Object.keys(record)[5]]}</div>
              </td>
              <td>
                <div style={labelStyle}>{toProperCase(Object.keys(record)[6].replaceAll("_"," "))}</div>
                <div style={valueStyle}>{record[Object.keys(record)[6]]}</div>
              </td>
            </tr>
            </tbody>
          </table>
          </div>
        ))
      }
    </div>
  )
}

export default List