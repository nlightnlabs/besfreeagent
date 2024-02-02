import React, {useState, useEffect, useContext, useRef} from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import SuperInput from './SuperInput.js'
import {getRecord, getData, getTable, getRecords, updateRecord, addRecord} from './apis/axios.js'
import { toProperCase } from './functions/formatValue.js';
import { generalIcons } from './apis/icons.js';

const Form = (props) => {

  const tableName = props.tableName
  const recordId = props.recordId
  const userData = props.userData
  const refreshTable = props.refreshTable
  const refreshActivities = props.refreshActivities
  const updateActivitiesOnSave = props.updateActivitiesOnSave || false
  const recordData = props.formData
  const fields = props.fields
  const [initialData, setInitialData] = useState({})
  const [formData, setFormData] = useState({})
  const [updatedData,setUpdatedData] = useState({})
  const [allowEdit, setAllowEdit] = useState(false)
  const [valueColor, setValueColor] = useState("#5B9BD5")
  const [inputFill, setInputFill] = useState("#F4F5F5")
  const [border, setBorder] = useState("1px solid rgb(235,235,235)")

  const handleChange = (e)=>{
    const {name, value} = e.target
    setUpdatedData({...updatedData,...{[name]:value}})
    setFormData({...formData,...{[name]:value}})
  }

   //OPTIONAL: Update activities log when this form changes
   const updateActivityLog= async()=>{
        
        // Prepare data into JSON text string
        let updateDescription= JSON.stringify(updatedData)

        // Send updated activities to db
        const updateActivities = async ()=>{

            const query = `SELECT A.*, B.first_name, B.last_name from activities as A left join users as B on A.user = B.email where "record_id"='260' and "app" = 'requests' order by "created" desc;`
            const activityUpdateResponse = await getData(query)
            console.log(activityUpdateResponse)
        }
        await updateActivities()

        // Get the udpated ativities log back
        const getUpdatedActivities = async ()=>{
            const params = {
                tableName: "activities",
                recordId,
                idField: 'record_id'
            }
            const updatedActivities= await getRecords(params)
            const sortedActivities = ()=>{
                updatedActivities.map((a,b)=>{

                })
            }
            refreshActivities(updatedActivities)
        }
        getUpdatedActivities()
   }

   //Refreshes the table in the UI
   const updateTable = async (req, res)=>{
        const response = await getTable(tableName)
        refreshTable(response.data.data.sort((a, b) => {
        return  b.id-a.id;
        }));
    }

  const handleSave = async (req, res) => {

    if(JSON.stringify(initialData) !== JSON.stringify(formData)){

        //update database and table with record data
        const params = {
            tableName,
            recordId,
            idField: 'id',
            formData
        }
        const updatedRecord= await updateRecord(params)

        console.log(updatedRecord)
        console.log(updatedData)

        let match=true
        Object.keys(updatedData).map(field=>{
            if(updatedData.field==updatedRecord.field){
                match = true
            }else{
                match = false
            }
        })

        if(match){
            setFormData(updatedRecord)
            setInitialData(updatedRecord)
            alert("Record updated")

            //Update Activities
                if(updateActivitiesOnSave){
                updateActivityLog()
            }

            //Refresh table in UI
            updateTable()

            }
            else{
                alert("Unable to update record. Please check inputs.")
            }
        }else{
            alert("Nothing to save.  Form is not was not edited")
        }
    }

  const iconStyle ={
    maxHeight: 30,
    maxWidth: 30,
    cursor: "pointer",
    marginLeft: 5
  }


  const editProps = ()=>{
    if(allowEdit){
        setInputFill("white")
        setValueColor("#5B9BD5")
        setBorder("1px solid rgb(235,235,235)")
    }else{
        setInputFill("#F8F9FA")
        setValueColor("black")
        setBorder("none")
    }
  }

  useEffect(()=>{
    setInitialData(recordData)
    setFormData(recordData)
  },[props])

  useEffect(()=>{
    editProps()
  },[allowEdit])


  const titleStyle={
    fontSize: 24
  }


  return (
    <div className="d-flex flex-column bg-light flex-fill" style={{height: "75%"}}>
        <div style={titleStyle}>Record Details</div>
        <form>

            <div className="d-flex justify-content-end p-1">
                <img 
                    src={allowEdit ? `${generalIcons}/lock_icon.png` : `${generalIcons}/edit_icon.png`} alt="Edit" 
                    style={iconStyle} 
                    onClick={(e)=>setAllowEdit(!allowEdit)}>    
                </img>
                <img src={`${generalIcons}/save_icon.png`} alt="Save" style={iconStyle} onClick={(e)=>handleSave(e)}></img>
            </div>

            <div className="d-flex flex-column" style={{height: "75%", overflowY: "auto"}}>
            {fields.map((field, index)=>(
                <div key={index} className="form-floating mb-2">
                    <SuperInput
                        className="form-control"
                        id={field}
                        label={toProperCase(field.replaceAll("_"," "))}
                        name={field}
                        value={field=="record_created"? (new Date(recordData[field])).toLocaleDateString('en-US') :recordData[field]}
                        valueColor={valueColor}
                        fill={inputFill}
                        border={border}
                        padding={0}
                        onChange={handleChange}
                        readonly = {field=='id' || field== 'record_created' || !allowEdit}
                        disabled = {field=='id' || field== 'record_created' || !allowEdit}
                    />
                </div>
            ))}
            </div>
        </form>
    </div>
  )
}

export default Form