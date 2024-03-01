import React, {useState, useEffect} from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import {UTCToLocalDate} from "./functions/formatValue"

const StatusListBox = (props) => {

    const title = props.title
    const appData = props.appData
    const updateParentStates = props.updateParentStates

    //Data must have three fields: subject, status, and timestamp
    const data = props.data || []
    
    //Colors must have two fields: status, color
     const colors = props.colors || [
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
    const buttonLabel = props.buttonLabel

    // List type options should be status or actions
    const listType = props.listType || "status"

    const [fitlerWindowDisplay, setFilterWindowDisplay] = useState("none")
    const [sortWindowDisplay, setSortWindowDisplay] = useState("none")

  
    const iconStyle={
        maxHeight: 30,
        maxWidth: 30,
        marginLeft: 5,
    }
    
    const buttonStyle={
        fontSize: 14
    }
    
    const titleColor = {
        color: "#5B9BD5"
    }
    
    const getColor =(status)=>{
        
        try{
            const color = colors.filter(item=>item.status ===status)[0].color
            return color
        }catch(error){
            // console.log(status)
            return "gray"
        }
    }
    
    const timeStampStyle = {
        display: "flex",
        justifyContent:"end",
        marginBottom: 5,
        color: "gray",
        fontSize: 12,
        padding: 2,
        width: "100px",
    }

    
    const listItemStyle = {
        display: "flex",
        justifyContent: "space-between",
        minHeight: 50,
        padding: 5,
        border: "1px solid rgb(235,235,235)",
        borderRadius: 10,
        fontSize: 14,
        padding: 10,
        lineHeight:1.5,
        width: "100%"
    }

    const statusStyle={
        display: "flex", 
        width: "100px", 
        justifyContent: "end",
        fontSize: "12px",
        fontWeight: "bold"
    }


    const handleClick=(e)=>{
        const id = e.target.id
        let nextPage = "Records"

        updateParentStates.setSelectedApp("requests")
        updateParentStates.setPage(updateParentStates.pages.filter(x=>x.name===nextPage)[0])
        updateParentStates.setPageList([...updateParentStates.pageList,nextPage])
        updateParentStates.setPageName(nextPage)
        
    }

    useEffect(()=>{

    },[props])

  return (
    <div>
        {data.map((item,index)=>(
        <div key={index} id={item.id} style={{display: "flex", flexDirection: "column", width: "100%", cursor: "pointer"}} onClick={(e)=>handleClick(e)}>
                <div className = "d-flex justify-content-between shadow shadow-sm" style={listItemStyle}>
                    <div className="d-flex flex-column" style={{width: "55%", fontSize: "12px"}}>
                        <span style={{fontWeight: "bold"}}>{item.subject}</span>
                        <span>{item.request_type}</span>
                    </div>
                    <div className="d-flex flex-column justify-content-end">
                        <span style={{...statusStyle,...{color: getColor(item.stage)}}}>{item.stage}</span>
                        <span style={timeStampStyle}>{UTCToLocalDate(item.request_date)}</span>
                    </div>
                    
                </div>
                <div style={timeStampStyle}>{item.timestamp}</div>

        </div>
        ))}
    </div>
  )
}

export default StatusListBox