import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect, useRef, createRef} from 'react'
import { toProperCase } from './functions/formatValue.js';
import MultiInput from './MultiInput.js';
import {generalIcons} from './apis/icons.js'
import Attachments from './Attachments.js';
import TableInput from './TableInput.js';
import * as fileServer from './apis/fileServer.js'
import * as nlightnApi from './apis/nlightn.js'

const DataEntryForm = (props) => {

    const formName= props.formName || "Form"
    const pageTitle= props.pageTitle || toProperCase(formName.replaceAll("_"," "))
    const tableName = props.tableName
    const recordId = props.recordId
    const updateParent = props.updateParent
    const updateParentStates = props.updateParentStates

    const [formData, setFormData] = useState(props.formData);
	  const user = props.user
	  const [appData, setAppData] = useState(props.appData);

	  const setUploadFilesRef = props.setUploadFilesRef;
    const [initialFormData, setInitialFormData] = useState({})

    const [sections, setSections] = useState([])
    const [formElements, setFormElements] = useState([]);
    const [dropdownLists, setDropdownLists] = useState([]);
    const [allowEdit, setAllowEdit] = useState(true)
    const [valueColor, setValueColor] = useState("#5B9BD5")
    const [inputFill, setInputFill] = useState("#F4F5F5")
    const [border, setBorder] = useState("1px solid rgb(235,235,235)")    
    const [initialData, setInitialData] = useState({})
    const [updatedData,setUpdatedData] = useState({})
    const [attachments, setAttachments] = useState([])
    const [lineItems, setLineItems] = useState([])
    const[initialValues, setInitialValues] = useState(false)
    const [uiRefreshTriggers, setUIRefreshTriggers] = useState({})
    
    

    useEffect(()=>{
     
      getFormFields();
    },[])

    const getFormFields = async () => {
      
        const tableName= "forms"
        const conditionalField= "ui_form_name"
        const condition= formName
    
      try {
  
        const formFields = await nlightnApi.getRecords(tableName, conditionalField, condition);
        console.log("formFields",formFields)
        // Saving the state. This is always consistent.
        setFormElements(formFields);
        createRefs(formFields)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    
    
    // Function to dynamically create refs based on the names or IDs
    const refs = useRef({});
    const createRefs = async (formFields) => {
    console.log("formFields",formFields)
    const refList = {};
      formFields.forEach(item => {
        refList[item.ui_name] = createRef();
      })
    refs.current = refList;
    getFormData(formFields)
    };
    
    
    const getFormData = async (formFields) => {
      const updatedFormFields = formFields;
      try {
        const params = {
          tableName: tableName,
          recordId: recordId,
          idField: "id",
        };
 
        const formData = await nlightnApi.getRecord(params);
        setFormData(formData);
        calculateForm(updatedFormFields, formData);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };
    
    const calculateForm = async (formFields, formData) => {
      let updatedFormData = formData;
      
      // Use Promise.all to await all async operations in map function
      await Promise.all(formFields.map(async (item) => {
        let value = formData[item.ui_id];
    
        try {
          if (item.ui_calculation_type === "formula") {
              value = eval(item.ui_formula);
          }
    
          if (item.ui_calculation_type === "fetch") {
            const tableName = item.ui_reference_data_table;
            const fieldName = item.ui_reference_data_field;
            const conditionalField = item.ui_reference_data_conditional_field;
            const conditionalValue = eval(item.ui_reference_data_conditional_value);
            value = await nlightnApi.getValue(tableName, fieldName, conditionalField, conditionalValue);
          }
    
          updatedFormData = { ...updatedFormData, ...{ [item.ui_id]: value } };
        } catch (error) {
          console.log(error);
          value = ""
        }
      }));
    
      // Run after all async operations in map function are completed
      
      setFormElements(formFields)
      setInitialFormData(updatedFormData);
      setFormData(updatedFormData);
      updateParent(updatedFormData);
      getSections(formFields);
      getDropDownLists(formFields, updatedFormData);
    };
    
    
    const getDropDownLists = async (formFields,updatedFormData) => {
      
      if (formFields.length > 0) {
        
        let tempDropdownLists = [];
        let listData = {};

        await Promise.all(
          
          formFields.map(async (item) => {
            
            if((item.ui_component_type === "select" || item.ui_component_type === "table")){

              if(item.ui_query !=null && item.ui_query !=""){
              
                const query = item.ui_query
                const response = await nlightnApi.getData(query)
                
                let listItems = []
                response.map(item=>{
                  listItems.push(item.option)
                })
    
                // Storing each drop down list in an object
                listData = {
                  name: `${item.ui_id}_list`,
                  listItems: listItems,
                };

                  //Add each list to the array of dropdown lists
                if(tempDropdownLists.find(i=>i.name===listData.name)){		
                  tempDropdownLists.find(i=>i.name===listData.name).listItems = listData.listItems
                }else{
                  tempDropdownLists.push(listData);
                }
    
              }else{
                  let conditionalValue = item.ui_reference_data_conditional_value
          
                  if(conditionalValue !=null){
                    if(conditionalValue.search(".")>0){
                      conditionalValue = eval(conditionalValue)
                    }else{
                      conditionalValue =conditionalValue
                    }
                  }
          
                  if (
                    item.ui_reference_data_table != null &&
                    item.ui_reference_data_field != null
                  ) {
          
                    let dataTable = item.ui_reference_data_table
                    if((item.ui_reference_data_table).search("()=>")>0){
                      dataTable = eval(item.ui_reference_data_table)()
                    }
          
                    if(item.ui_reference_data_conditional_field !=null && conditionalValue !=null){
                     
                      const response = await nlightnApi.getConditionalList(
                        dataTable,
                        item.ui_reference_data_field,
                        item.ui_reference_data_conditional_field,
                        eval(conditionalValue)
                      );
                      
                      // Storing each drop down list in an object
                      listData = {
                        name: `${item.ui_id}_list`,
                        listItems: response,
                      };
                      
                        //Add each list to the array of dropdown lists
                      if(tempDropdownLists.find(i=>i.name===listData.name)){		
                        tempDropdownLists.find(i=>i.name===listData.name).listItems = listData.listItems
                      }else{
                        tempDropdownLists.push(listData);
                      }

                    }else{
                      const response = await nlightnApi.getList(
                        dataTable,
                        item.ui_reference_data_field
                      );
                      const listItems = await response;
        
                      // Storing each drop down list in an object
                      listData = {
                        name: `${item.ui_id}_list`,
                        listItems: listItems,
                      };
                      if(tempDropdownLists.find(i=>i.name===listData.name)){		
                        tempDropdownLists.find(i=>i.name===listData.name).listItems = listData.listItems
                      }else{
                        tempDropdownLists.push(listData);
                      }        
                    }
                  }
              };
            }
        }))
   
        setDropdownLists(tempDropdownLists); 
        setInitialValues(true);
      }
    };


    const getSections = (formFields)=>{
      
      let sectionSet = new Set()
      formFields.map(items=>{
        sectionSet.add(items.ui_form_section)
      })

      let sectionList = []
      sectionSet.forEach(item=>{
        let visible = formFields.filter(r=>r.ui_form_section == item)[0].ui_section_visible
        sectionList.push({name: item, visible: visible})
      })
      setSections(sectionList)
    }

    useEffect(()=>{
      calculateForm(formElements, formData);
    },[uiRefreshTriggers])

    
    const prepareAttachments = (e)=>{
        console.log(e.name)
        console.log(e.fileData)
        const fieldName = e.name
        const fileData = e.fileData
        setAttachments([...attachments,{ui_name: fieldName, fileData: fileData}]);
        // setFormData({...formData,...{["attachments"]:[...attachments,...fileData]}});
    }

    const getAttachments = async () => {

      let formDataWithAttachments = formData;
      let updatedDataWithAttachments = updatedData;
      let updatedAttachments = attachments;
    
      await Promise.all(attachments.map(async (item, index) => {

        let updatedFileData = item.fileData;
    
        await Promise.all(
          updatedFileData.map(async (file, fileIndex) => {
      
            let filePath = user
              ? `${fileServer.fileServerRootPath}/${tableName}/user_${user.id}_${user.first_name}_${user.last_name}/${file.name}`
              : `${fileServer.fileServerRootPath}/${tableName}/general_user/${file.name}`;
            const url = await fileServer.uploadFile(filePath,file)
    
            let updatedFile = {...file, ...{["url"]: url}};
            delete updatedFile.data
            console.log(updatedFile)
            updatedFileData[fileIndex] = updatedFile;
    
          }))
    
        updatedAttachments[index] = updatedFileData;
        updatedDataWithAttachments = {...updatedDataWithAttachments, ...{[item.ui_name]: updatedFileData}};
        formDataWithAttachments = {...formDataWithAttachments, ...{[item.ui_name]: updatedFileData}};
      }));
    
      return { formDataWithAttachments, updatedDataWithAttachments };
    };
    
    const handleSave = async (req, res) => {

      if(JSON.stringify(initialData) !== JSON.stringify(formData)){

        let recordToSendToDb = formData;
        let updatesToSendToDb = updatedData;

        //Get urls for any attachments and upload attachments to the file server
        if(attachments.length>0){
          const { formDataWithAttachments, updatedDataWithAttachments } = await getAttachments();
          recordToSendToDb = formDataWithAttachments;
          updatesToSendToDb = updatedDataWithAttachments;
        }
        
        // Stringify all fields that hold arrays or javascript objects to flatting the data
        Object.keys(recordToSendToDb).map(key=>{
          if(typeof recordToSendToDb[key] ==="object"){
            recordToSendToDb = {...recordToSendToDb, ...{[key]:JSON.stringify(recordToSendToDb[key])}}
          }
        })
        console.log(recordToSendToDb)
     
        //update database table with updated record data
          const updatedRecordFromDb= await nlightnApi.updateRecord(tableName,"id",recordId,recordToSendToDb)
          console.log("updatedRecordFromDb",updatedRecordFromDb)
         
          let match = true
          if(updatedRecordFromDb.id!==recordToSendToDb.id){
            match=false;
          }
       
          if(match){  
              
              alert("Record updated")
              setFormData(updatedRecordFromDb)
              setInitialData(updatedRecordFromDb)
              getFormData(formElements)

              // Update activity log
              nlightnApi.updateActivityLog(tableName, recordId, user.email, JSON.stringify(updatesToSendToDb))

                //Refresh UI in Parent object
                updateParentStates.forEach(func=>{
                  func();
                })
            
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

    const handleChange = (e)=> {
      const {name, value} = e.target
      setUpdatedData({...updatedData,...{[name]:value}})
      setFormData({...formData,...{[name]:value}})
      let updatedFormData = { ...formData, ...{ [name]: value } };
      console.log(updatedFormData)
      calculateForm(formElements, updatedFormData);
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

    const sectionTitle = {
      fontSize: 20,
      marginBottom: 10
    }

    const sectionStyle = {
      border: "1px solid rgb(235,235,235)",
      borderRadius: 10,
      padding: 15,
      backgroundColor: "white",
      marginBottom: 40
    }

    const titleStyle={
      fontSize: 24,
      fontWeight: 'normal'
    }

    useEffect(()=>{
      editProps()
    },[allowEdit])
    
const pageStyle={
  minWidth: 300
}

return(
  <div className="d-flex flex-column w-100 h-100 overflow-y-auto bg-light" style={pageStyle}>
      <div className="d-flex" style={titleStyle}>{pageTitle}</div>
      {initialValues && dropdownLists.length>0 && 
        <form>
      {/* Button menu */}
      <div className="d-flex justify-content-end p-1">
          <img 
              src={allowEdit ? `${generalIcons}/lock_icon.png` : `${generalIcons}/edit_icon.png`} alt="Edit" 
              style={iconStyle} 
              onClick={(e)=>setAllowEdit(!allowEdit)}>    
          </img>
          <img 
            src={`${generalIcons}/save_icon.png`} 
            alt="Save" style={iconStyle} 
            onClick={(e)=>handleSave(e)}>
          </img>
          <img 
            src={`${generalIcons}/trash_icon.png`} 
            alt="Save" style={iconStyle} 
            onClick={(e)=>handleSave(e)}>
          </img>
      </div>
      <div className="d-flex flex-column" style={{height: "70vh", overflowY: "auto",overflowX: "hidden"}}>
        {sections.map((section, sectionIndex)=>(
          section.name  !==null && section.visible ? 
            <div key={sectionIndex}  className="d-flex flex-column shadow-sm" style={sectionStyle}>
              <div style={sectionTitle}>{toProperCase(section.name.replaceAll("_"," "))}</div>
                {
                  formElements.map((item,index)=>(
                    item.ui_form_section === section.name && 
                    item.ui_component_visible && 
                    (item.ui_component_type === "input" || item.ui_component_type=="select") && 
                    item.ui_input_type!=="file" && item.ui_input_type!=="image"?
                    <div key={index} ref={refs.current[item.ui_name]} className="d-flex flex-column mb-3">
                      <MultiInput
                      id={item.ui_id}
                      name={item.ui_name}
                      className={item.ui_classname}
                      label={item.ui_label}
                      type={item.ui_input_type}
                      value={initialFormData[item.ui_id]}
                      valueColor = {item.ui_color}
                      inputFill = {item.ui_backgroundColor}
                      fill={item.ui_backgroundColor}
                      border={border}
                      readonly = {eval(item.ui_readonly) || !allowEdit}
                      disabled = {eval(item.ui_disabled) || !allowEdit}
                      onClick = {eval(item.ui_onclick)}
                      onChange = {eval(item.ui_onchange)}
                      onBlur = {eval(item.ui_onblur)}
                      onMouseOver = {eval(item.ui_onmouseover)}
                      onMouseLeave = {eval(item.ui_mouseLeave)}
                      list={dropdownLists.find(l=>l.name===`${item.ui_id}_list`) !=null? dropdownLists.find(l=>l.name===`${item.ui_id}_list`).listItems:null}
                      allowAddData = {item.ui_allow_add_data}       
                    />
                    </div>
                  : 
                  item.ui_form_section === section.name && 
                  item.ui_component_visible &&  
                  item.ui_component_type=="input" &&
                  item.ui_input_type=="file" ?
                  <div key={index} ref={refs.current[item.ui_name]}   className="d-flex flex-column mb-3">
                      <Attachments 
                        id={item.ui_id}
                        name={item.ui_name}
                        onChange = {prepareAttachments}
                        valueColor = {item.ui_color}
                        currentAttachments = {initialFormData[item.ui_id]}
                        user = {user}
                        readonly = {eval(item.ui_readonly) || !allowEdit}
                        disabled = {eval(item.ui_disabled) || !allowEdit}
                      />
                    </div>
                    : 
                    item.ui_form_section === section.name && 
                    item.ui_component_visible &&  
                    item.ui_component_type=="input" &&
                    item.ui_input_type=="image" ?
                  <div key={index} ref={refs.current[item.ui_name]}  className="d-flex flex-column mb-3">
                      {
                       JSON.parse(initialFormData[item.ui_id]) && initialFormData[item.ui_id] !="" && initialFormData[item.ui_id] !=null?(
                           <div className="d-flex w-100 p-1" style={{height:"fit-content", width:"90%", overflowX: "auto"}}>
                          {JSON.parse(initialFormData[item.ui_id]).map((att,index)=>(
                                 <img 
                                  key={index}
                                  src={att.url} 
                                  alt={`${att.name} icon`} 
                                  style={{height: "100px", width: "auto"}}>
                                </img>
                          ))}
                           </div>
                          )
                        :
                        null
                      }
                      <Attachments 
                        id={item.ui_id}
                        name={item.ui_name}
                        className={item.ui_classname}
                        label={item.ui_label}
                        onChange = {prepareAttachments}
                        valueColor = {item.ui_color}
                        currentAttachments = {initialFormData[item.ui_id]}
                        user = {user}
                        readonly = {eval(item.ui_readonly) || !allowEdit}
                        disabled = {eval(item.ui_disabled) || !allowEdit}
                        multiple = {true}
                      />
                    </div>
                  :  
                    item.ui_form_section === section.name && 
                    item.ui_component_visible && 
                    item.ui_component_type=="table" && 
                    initialFormData[item.ui_id] !=null && initialFormData[item.ui_id] !=""?
                    <div key={index} ref={refs.current[item.ui_name]}   className="d-flex flex-column mb-3">
                      <TableInput
                        id={item.ui_id}
                        name={item.ui_name}
                        onChange = {handleChange}
                        valueColor = {item.ui_color}
                        valueSize = {item.ui_font_size}
                        valueWeight = {item.ui_font_weight}
                        valueFill = {item.ui_background_color}
                        initialTableData = {initialFormData[item.ui_id]}
                        list={dropdownLists.find(l=>l.name===`${item.ui_id}_list`) !=null? dropdownLists.find(l=>l.name===`${item.ui_id}_list`).listItems:null}
                        readonly = {eval(item.ui_readonly) || !allowEdit}
                        disabled = {eval(item.ui_disabled) || !allowEdit}
                      />
                    </div>
                    :
                  null
                ))}
            </div>
            :
            null
        ))}
      </div>
      </form>
      }
    </div>
  )
  
}

export default DataEntryForm