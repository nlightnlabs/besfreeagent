import React, { useState, useContext } from 'react';
import * as XLSX from 'xlsx/xlsx.mjs';
import {appIcons} from './apis/icons.js'
import MultiInput from './MultiInput.js';
import Draggable from 'react-draggable';
import {Context} from './Context'

const GenAIAnalyzeSpend = () => {

  const {user, appData} = useContext(Context)

  const [showUploadDataWindow, setShowUploadDataWindow] = useState(false);
  const [showConnectDataWindow, setShowConnectDataWindow] = useState(false);
  const [showPullInternalDatawindow, setShowPullInternalDataWindow] = useState(false);
  
  const [uploadedData, setUploadedData] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log(file)
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryString = event.target.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      console.log(data)

      setUploadedData(data);
      setShowUploadDataWindow(true);
    };

    reader.readAsBinaryString(file);
  };

  

  const iconStyle = {
    height: 30,
    width: 30,
    cursor: "pointer"
  }

  const iconButtonStyle = {
    height: 30,
    width: 30,
    cursor: "pointer"
  }
  
  const handleUploadFileClick=(e)=>{
    document.getElementById('fileInput').click()
    
  }

  const handleConnectToData = (e)=>{
    setShowConnectDataWindow(true)
  }

  const handlePullInternalData = (e)=>{
    setShowPullInternalDataWindow(true)
  }

  const [formData, setFormData] = useState({})
  const handleInputChange = (e)=>{
    const {name,value} = e.target
    setFormData({...FormData,...{[name]:value}})
  }

  const handleFetchData = async (e)=>{
    const url = formData.url;
    const headers = formData.headers; // Changed from `const header = formData.headers` to `const headers = formData.headers`
    const body = formData.body;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers, // Changed from `headers: header` to `headers: headers`
        body: body
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json(); // Assuming the response is JSON, use response.json() to parse it

      setUploadedData(data);
      setShowUploadDataWindow(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Unable to fetch data. Please review information provided.");
    }
  }

  const modalStyle={
    position: "fixed", 
    top: '50%',
    left: '50%',
    translate: "-50% -50%",
    height: "80vh", 
    width: "80vw", 
    zIndex: 999,
    cursor: "grab",
  }

  return (
    <div>
      <div className="d-flex justify-content-around" style={{width: "100%"}}>
        <div
          className="d-flex bg-white flex-column align-items-center text-center border border-2 shadow rounded-3 p-1 p-3 ms-3 me-3"
          style={{fontSize: 14, width: '175px', height: '175px', cursor:"pointer" }}
          onClick={(e)=>{handleUploadFileClick(e)}}
        >
          <img src={`${appIcons}/upload_icon.png`}></img>
          <span>Upload Invoice Spend Data</span>
          <span>(Excel or CSV)</span>
        </div>
        <input
          id="fileInput"
          type="file"
          accept=".xlsx, .xls, .csv"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />

        <div
           className="d-flex bg-white flex-column align-items-center text-center border border-2 shadow rounded-3 p-1 p-3 ms-3 me-3"
           style={{fontSize: 14, width: '175px', height: '175px', cursor:"pointer" }}
            onClick={(e)=>{handleConnectToData(e)}}
        >
          <img src={`${appIcons}/connect_icon.png`}></img>
          <span>Connect to data</span>
        </div>


        <div
           className="d-flex bg-white flex-column align-items-center text-center border border-2 shadow rounded-3 p-1 p-3 ms-3 me-3"
           style={{fontSize: 14, width: '175px', height: '175px', cursor:"pointer" }}
            onClick={(e)=>{handlePullInternalData(e)}}
        >
          <img src={`${appIcons}/download_icon.png`} style={{rotate: "90deg"}}></img>
          <span>Pull Internal Invoice Data</span>
        </div>
      </div>
      
  

      {showUploadDataWindow && (
        <Draggable>
        <div className="d-flex flex-column bg-light shadow shadow-3 border border-3 rounded-3" style={modalStyle}>
          
          <div className="d-flex align-items-center justify-content-between" style={{backgroundColor: "rgb(50,100,255"}}>
           <div className="d-flex ms-3 align-items-center" style={{height: 24, fontWeight: 'bold', color: "white"}}>Map Columns In File To Fields</div>
           <div className="button-group p-1">
               <img src={`${appIcons}/close_icon.png`} style={iconButtonStyle}  name="closeButton" onClick={(e)=>{setShowUploadDataWindow(false)}}></img>
           </div>
         </div>

         <div className="d-flex justify-content-end m-3">
           <button className="btn btn-success">Analyze</button>
         </div>

          <div className="d-flex bg-white p-3" style={{height: "100%", width: "100%", overflow: "auto", fontSize: 12}}>
          {
            <table className="table table-striped">
            <tbody>
              {uploadedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          }
          </div>
        </div>
        </Draggable>
      )}

      {showConnectDataWindow &&
         <div className="d-flex flex-column bg-light shadow shadow-3 border border-3 rounded-3">
          
         <div className="d-flex align-items-center justify-content-between" style={{backgroundColor: "rgb(50,100,255"}}>
           <div className="d-flex ms-3 align-items-center" style={{height: 24, fontWeight: 'bold', color: "white"}}>Enter API Details</div>
           <div className="button-group p-1">
               <img src={`${appIcons}/close_icon.png`} style={iconButtonStyle}  name="closeButton" onClick={(e)=>{setShowConnectDataWindow(false)}}></img>
           </div>
         </div>

         <div className="d-flex justify-content-end m-3">
           <button className="btn btn-primary" onClick={(e)=>handleFetchData(e)}>Submit</button>
         </div>

         <div className="d-flex bg-light flex-column p-3 w-100 h-100">
            <MultiInput type="input" name="url" onChange={(e)=>handleInputChange(e)} label="Enter the url" placeholder="Enter the url"/>
            <MultiInput type="textarea" name= "header" onChange={(e)=>handleInputChange(e)} label="Enter header parameters" placeholder="Enter header information"/>
            <MultiInput type="textarea" name="body" onChange={(e)=>handleInputChange(e)} label="Enter body parameters" placeholder="Enter body parameters"/>
         </div>
       </div>
      }

      {showPullInternalDatawindow &&
         <div className="d-flex flex-column bg-light shadow shadow-3 border border-3 rounded-3">
          
          <div className="d-flex align-items-center justify-content-between" style={{backgroundColor: "rgb(50,100,255"}}>
           <div className="d-flex ms-3 align-items-center" style={{height: 24, fontWeight: 'bold', color: "white"}}>Preview And Confirm Data</div>
           <div className="button-group p-1">
               <img src={`${appIcons}/close_icon.png`} style={iconButtonStyle}  name="closeButton" onClick={(e)=>{setShowPullInternalDataWindow(false)}}></img>
           </div>
         </div>

         <div className="d-flex justify-content-end m-3">
           <button className="btn btn-success">Analyze</button>
         </div>

         <div className="d-flex bg-white p-3 w-100 h-100">
            Comming Soon...
         </div>
       </div>
      }
    </div>
  );
};

export default GenAIAnalyzeSpend;