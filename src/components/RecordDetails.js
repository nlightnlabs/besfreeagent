import React, {useState, useEffect} from 'react'
import DataEntryFrom from './DataEntryForm.js'
import Activities from './Activities.js'
import * as nlightnAPI from "./apis/nlightn.js"
import "bootstrap/dist/css/bootstrap.min.css"


const RecordDetails = (props) => {

    const tableName = props.tableName || ""
    const formName =  props.formName || ""
    const recordId = props.recordId || ""
    const user = props.user || {}
    const tableData = props.tableData || []

    const setShowRecordDetails = props.setShowRecordDetails
    const [recordData, setRecordData] = useState([])
    const [fields, setFields] = useState([])
    const [activities, setActivities] = useState([])
    const [formData, setFormData] = useState([])

    const [forceUpdate, setForceUpdate] = useState(false);

    const updateParentStates = () => {
      setForceUpdate(prevState => !prevState);
      props.updateParentStates.forEach(func=>{
        func()
      })
    };

    const getRecordData = async ()=>{
        const params={
            tableName,
            recordId,
            idField: 'id'
        }

        const returnedData = await nlightnAPI.getRecord(params)
        setRecordData(returnedData)
        setFields(Object.keys(returnedData))
      }


      const ActivitiesPanel = {
        resize: "horizontal",
      }

      const FormDataPanel = {
        resize: "horizontal",
      }

      useEffect(()=>{
        getRecordData()
      },[props])

  return (
    <div className="flex flex-column" style={{height: "100%", width:"100%", overflow: "hidden"}}>
        <div className="d-flex w-100 flex-column p-3">
 
        <div className="row">
            <div className="col-7 p-3" style={FormDataPanel}>
                <DataEntryFrom
                    formName = {formName}
                    tableName={tableName}
                    pageTitle={"Record Details"}
                    recordId={recordId}
                    formData={recordData}
                    fields = {fields}
                    userId={user.id}
                    user = {user}
                    updateParent = {setFormData}
                    updateParentStates = {[updateParentStates]}
                />
             </div>
            
            <div className="col-5 p-3" style={ActivitiesPanel}>
                <Activities
                    tableName={tableName}
                    pageTitle={"Activities"}
                    recordId={recordId}
                    user={user}
                    forceUpdate={forceUpdate ? 'forceUpdate' : 'normal'}
                />
            </div>
        </div>
        </div>
    </div>
  )
}

export default RecordDetails