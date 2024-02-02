import React, {useState, useEffect, useRef, createRef} from 'react'
import FloatingDiv from './FloatingDiv'
import {getRecords} from './apis/axios.js'
import "bootstrap/dist/css/bootstrap.min.css"

const Workflow = (props) => {

  const workflowName = props.workflowName
  const workflowTitle = props.workflowTitle

  const [events, setEvents] = useState([
    {id: 1, name: "Start", type: "start", contents:`<h3>Close</h3><br><label>Date: Date</label><br><label>By: User</label>`, startLeft: 800, startTop: 100, height: 125, width: 200, className: "d-flex flex-column shadow bg-white rounded-3"},
    {id: 2, name: "Submit", type: "action", contents:`<h3>Submit</h3><br><label>Date: Date</label><br><label>By: User</label>`, startLeft: 50, startTop: 100, height: 125, width: 200, className: "d-flex flex-column shadow bg-white rounded-3"},
    {id: 3, name: "Review", type: "action", contents:`<h3>Review</h3><br><label>Date: Date</label><br><label>By: User</label>`, startLeft: 300, startTop: 100, height: 125, width: 200, className: "d-flex flex-column shadow bg-white rounded-3"},
    {id: 4, name: "Decide", type: "decision", contents:`<h3>Decision</h3><br><label>Date: Date</label><br><label>By: User</label>`, startLeft: 550, startTop: 100, height: 125, width: 200, className: "d-flex flex-column shadow bg-white rounded-3"},
    {id: 5, name: "Close", type: "end", contents:`<h3>Close</h3><br><label>Date: Date</label><br><label>By: User</label>`, startLeft: 800, startTop: 100, height: 125, width: 200, className: "d-flex flex-column shadow bg-white rounded-3"}
  ])

  const eventRefs = useRef([]);
  eventRefs.current = events.map(
      (item, index) =>   eventRefs.current[index] = createRef(item.id)
    )

  const getEvents = async (req, res)=>{
    const params = {
      tableName: "workflows",
      conditionField: "name",
      condition: "workflowName"
    }
    const eventData = await getRecords(params)
  }

  useEffect(()=>{
    getEvents()
  },[])
  
  const addEvent = ()=>{

  }

  const deleteEvent = ()=>{

  }

  const editEvent = ()=>{

  }

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    padding: 5
  }


  return (
    <div className="flex-container w-100">
        <div style={titleStyle}>{workflowTitle}</div>
        <div className="row">
          <div className="col-sm-2 bg-light border border-1" style={{height:500, width: "100%", overflowY:'auto'}}>
            <button className="btn-btn-success" style = {{fontSize: 14}} onClick={(e)=>addEvent(e)}>Add Start Node</button>
            <button className="btn-btn-primary" style = {{fontSize: 14}}onClick={(e)=>addEvent(e)}>Add Action</button>
            <button className="btn-btn-alert" style = {{fontSize: 14}} onClick={(e)=>addEvent(e)}>Add Decision</button>
            <button className="btn-btn-dark" style = {{fontSize: 14}} onClick={(e)=>addEvent(e)}>Add Connector</button>
            <button className="btn-btn-danger" style = {{fontSize: 14}} onClick={(e)=>addEvent(e)}>Add End Node</button>
          </div>
          <div className="col-sm-10 border border-1">
            <div className="d-flex bg-white" style={{height:500, width: "100%", overflow:'auto'}} >
                {
                  events.map((item,index)=>(
                    <FloatingDiv 
                      key={item.id}
                      contents = {item.contents}
                      startLeft = {item.startLeft}
                      startTop = {item.startTop}
                      className={item.className}
                      style={item.style}
                    />
                  ))
                }
            </div>
          </div>
        </div>
    </div>
  )
}

export default Workflow