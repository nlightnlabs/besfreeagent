import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import React, { useState, useEffect, useRef, createRef } from "react";
import { toProperCase, UTCToLocalDate } from "./functions/formatValue.js";
import axios, {
	getData,
	getList,
	getConditionalList,
	getValue,
	addRecord,
	updateActivityLog
} from "./apis/axios.js";
import { rootPath } from "./apis/fileServer.js";
import {appIcons} from './apis/icons.js'

import Attachments from "./Attachments.js";
import MultiInput from "./MultiInput.js";
import TableInput from "./TableInput.js";

const RequestIntakeForm = (props) => {
	const requestType = props.requestType
	const setRequestStype = props.setRequestStype
	const formData = props.formData;
	const setFormData = props.setFormData

	const [formName, setFormName] = useState(props.formName)
	
	const appData = props.appData
	const userData = props.appData.user
	const setSelectedApp = props.appData.setSelectedApp
	const setTableName = props.appData.setTableName
	const pages = props.appData.pages
    const pageList = ["",""]
	const setPage = props.appData.setPage
    const setPageList = props.appData.setPageList
	const apps = props.appData.apps
	const setShowRequestIntakeModal = props.appData.setShowRequestIntakeModal
	const pageName = props.appData.pageName
	const setPageName = props.appData.setPageName

	const [outputData, setOutputData] = useState({})

	const [pageTitle, setPageTitle] = useState("")
	const [pageSubTitle, setPageSubTitle] = useState("")
	
	const [formElements, setFormElements] = useState([]);
	const [formInputElements, setFormInputElements] = useState([]);

	const [sections, setSections] = useState([]);

	const [dropdownLists, setDropdownLists] = useState([]);
	const [allowEdit, setAllowEdit] = useState(true);
	const [valueColor, setValueColor] = useState("#5B9BD5");
	const [inputFill, setInputFill] = useState("#F4F5F5");
	const [border, setBorder] = useState("1px solid rgb(235,235,235)");
	const [initialData, setInitialData] = useState({});

	const [updatedData, setUpdatedData] = useState({});
	const [attachments, setAttachments] = useState([]);
	const [lineItems, setLineItems] = useState([]);
	const [uiTriggerFields, setUiTriggerFields] = useState([])
	const [refresh, setRefresh] = useState()

	const [initialValues, setInitialValues] = useState(false);
	const [formClassList, setFormClassList] = useState("form-group")

	const [lastPage, setLastPage] = useState(false)

	useEffect(() => {
		getFormFields();
		console.log(formData)
	}, [formName, props.requestType])



	const getFormFields = async () => {
		
		const query = `SELECT * FROM request_flow_forms where "ui_form_name" = '${formName}';`

		try {
			const formFields = await getData(query);
			
			setPageTitle(formFields.find(item=>item.ui_form_name==formName).name)
			setPageSubTitle(formFields.find(item=>item.ui_form_name==formName).ui_form_description)
			setLastPage(formFields.find(item=>item.ui_form_name==formName).ui_last_input_page)

			// Saving the state.  This is always consistent.
			setFormElements(formFields);

			//Get the sections data
			getSections(formFields);

			//Setup initial formdata with default values if any
			setUpFormData(formFields);
			
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const setUpFormData = async (formFields) => {

    let tempFormData = formData;

		let formInputElements = []
		if (formFields && formFields.length > 0) {
			
			formFields.forEach((item) => {
				if(item.ui_input_type !="output" && item.ui_input_type !="navigation"){
					formInputElements.push(item)
				}}
			)
			setFormInputElements(formInputElements)

			formInputElements.forEach((item) =>{
				try {
					let value = item.ui_default_value
					if(item.ui_input_type =="table"){
						value=JSON.parse(value)
					}else{
						value = eval(value)
					}
					tempFormData = {
						...tempFormData,
						...{ [item.ui_id]: {value: value, db_field_name: item.ui_id}}
					}

				} catch (error) {
					//console.log(error);
					//console.log(item.ui_default_value);
				}
			})

			setFormData((prevState) => ({ ...prevState, ...tempFormData }));
			
			// setOutputData((prevState) => ({ ...prevState, ...tempOutputData }));
			calculateForm(formInputElements, tempFormData);
			
		}
	};

	const calculateForm = async (formDataFields, updatedFormData) => {

		let formData = updatedFormData;
		//console.log(formData)

		formDataFields.map(async (item) => {

			//console.log(formData[item.ui_id].value)
			let value = formData[item.ui_id].value
			//console.log(value)
			try {
				if (item.ui_calculation_type == "formula") {
					value = eval(item.ui_formula);
				}

				if(item.ui_calculation_type == "fetch"){
					const tableName = item.ui_reference_data_table;
					const fieldName = item.ui_reference_data_field;

					const conditionalField = item.ui_reference_data_conditional_field
					let conditionalValue = item.ui_reference_data_conditional_value
					if(conditionalField !=null && conditionalValue !=null){
						//console.log(`${item.ui_reference_data_field}: ${conditionalValue.search(".")}`)
						if(conditionalValue.search(".")>0){
							conditionalValue = eval(conditionalValue)
						}
					}
					value = await getValue(tableName,fieldName,conditionalField,conditionalValue)
				}
				formData = {...formData, [item.ui_id] : {...formData[item.ui_id],["value"]: value}}
				//console.log(formData)
	
				setFormData((prevState) => ({ ...prevState, ...formData }));
				setInitialValues(true);
				getDropDownLists(formDataFields,formData);

			} catch (error) {
				//console.log(error);
				//console.log(item);
			}
            });
        };

	const getDropDownLists = async (formDataFields,updatedFormData) => {
		
		let tempDropdownLists = [];

		if (formDataFields.length > 0) {
			formDataFields.map((item) => {

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
					item.ui_reference_data_field != null &&
					(item.ui_component_type === "select" ||
						item.ui_component_type === "table")
				) {
					if(item.ui_reference_data_conditional_field !=null && conditionalValue !=null){
						
						const getListItems = async (req, res) => {
							try {
								const response = await getConditionalList(
									item.ui_reference_data_table,
									item.ui_reference_data_field,
									item.ui_reference_data_conditional_field,
									conditionalValue
								);
								const listItems = await response;
	
								// Storing each drop down list in an object
								let listData = {
									name: `${item.ui_id}_list`,
									listItems: listItems,
								};
								tempDropdownLists.push(listData);
	
								//Add each list to the array of dropdown lists
								setDropdownLists([...dropdownLists, ...tempDropdownLists]);
							} catch (error) {
								//console.log(error);
							}
						};
						getListItems();
					}else{
						const getListItems = async (req, res) => {
							try {
								const response = await getList(
									item.ui_reference_data_table,
									item.ui_reference_data_field
								);
								const listItems = await response;
	
								// Storing each drop down list in an object
								let listData = {
									name: `${item.ui_id}_list`,
									listItems: listItems,
								};
								tempDropdownLists.push(listData);
	
								//Add each list to the array of dropdown lists
								setDropdownLists([...dropdownLists, ...tempDropdownLists]);

							} catch (error) {
								//console.log(error);
							}
						};
						getListItems();
					}
				}
			});
		}
	};

	const getSections = (formFields) => {
		let sectionSet = new Set();
		formFields.map((items) => {
			sectionSet.add(items.ui_form_section);
		});

		let sectionList = [];
		sectionSet.forEach((item) => {
			let visible = formFields.filter((r) => r.ui_form_section == item)[0].ui_section_visible;
			let title_visible = formFields.filter((r) => r.ui_form_section == item)[0].ui_section_title_visible;
			sectionList.push({ name: item, visible: visible, title_visible: title_visible });
		});

		setSections(sectionList);
	};

	const prepareAttachments = (fileData) => {
		setAttachments([...attachments, ...fileData]);
		setFormData({...formData, ["attachments"]: {...formData["attachments"],["value"]: fileData}});
	};



	const uploadFiles = async () => {
		let fileData = attachments;

		const upload = async () => {
			const updatedFiles = await Promise.all(
				fileData.map(async (file) => {
					let fileName = file.name;
					let filePath = `${rootPath}/user_${userData.id}_${userData.first_name}_${userData.last_name}/${fileName}`;
					if (userData) {
						filePath = `${rootPath}/user_${userData.id}_${userData.first_name}_${userData.last_name}/${fileName}`;
					} else {
						filePath = rootPath;
					}

					const response = await axios.post(`/getS3FolderUrl`, {
						filePath: filePath,
					});
					const url = await response.data;
					const fileURL = await url.split("?")[0];

					await fetch(url, {
						method: "PUT",
						headers: {
							"Content-Type": file.type,
						},
						body: file.data,
					});
					return {
						...file,
						...{
							["name"]: file.name,
							["type"]: file.type,
							["size"]: file.size,
							["url"]: fileURL,
						},
					};
				})
			);

			//console.log(updatedFiles)

			setAttachments([...attachments, ...updatedFiles]);

			let updatedDataWithAttachments = {...updatedData, ["attachments"]: {...updatedData["attachments"],["value"]: updatedFiles}};
			setUpdatedData({...updatedData, ["attachments"]: {...updatedData["attachments"],["value"]: updatedFiles}});

			let formDataWithAttachments = {...formData, ["attachments"]: {...formData["attachments"],["value"]: updatedFiles}};
			//console.log(formDataWithAttachments)
			
			setFormData({...formData, ["attachments"]: {...formData["attachments"],["value"]: updatedFiles}});
			return { formDataWithAttachments, updatedDataWithAttachments };
		};

		const output = await upload();
		return output;
	};

	const handleSubmit =async (e, nextPage)=>{

		e.preventDefault();
		const form = e.target
		if(lastPage){

				

				const getRecordId = async ()=>{
					const getNewRecordIDQuery = `Select id from requests where requester_user_id ='${userData.id}' order by id desc limit 1;`
					console.log(getNewRecordIDQuery)
			
					try{  
					const responseId = await getData(getNewRecordIDQuery)
					const recordId = await responseId[0].id
					console.log(recordId)
				
					// Update activity log
					updateActivityLog("requests", recordId, appData.user.email, "New request submitted")
		
					}catch(error){
					//console.log(error)
					}
				}

				const addNewRequestToDb = async (formData)=>{
					
					let stringifiedFormData = {}
					Object.entries(formData).map(([key,value])=>{
						//console.log(key)
						let db_key = formData[key].db_field_name
						let db_value = value.value
						if(typeof db_value =="object"){
							db_value = JSON.stringify(db_value)
						}
						stringifiedFormData = {...stringifiedFormData,...{[db_key]:db_value}}
					})

					stringifiedFormData = {...stringifiedFormData,
						...{["requester_user_id"]:userData.id},
						...{["requester"]:userData.full_name},
						...{["request_type"]: toProperCase(requestType.replaceAll("_"," "))},
						...{["request_date"]: UTCToLocalDate((new Date()).toString())},
						...{["stage"]:"Draft"},
						...{["status"]:"Open"}
					}
					//console.log(stringifiedFormData)

					try {
						const submitResponse = await addRecord("requests",stringifiedFormData)
						//console.log(submitResponse)
					
						getRecordId()
					}catch(error){
						//console.log(error)
					}
				}

				if(attachments.length>0){
					const response = await uploadFiles()
					let formDataWithAttachments = await response.formDataWithAttachments
					//console.log(formDataWithAttachments)
				
					addNewRequestToDb(formDataWithAttachments)
				}else{
					//console.log(formData)
					addNewRequestToDb(formData)
				}

				// setFormClassList('form-group was-validated')
				setFormName(nextPage)
			}else{
				setFormName(nextPage)
			}
		}
		

	const iconStyle = {
		maxHeight: 30,
		maxWidth: 30,
		cursor: "pointer",
		marginLeft: 5,
	};


	const handleChange = (e) => {
		
		const { name, value } = e.target;
		const elementName = name.name;
		//console.log(elementName)
		setUpdatedData({...updatedData, [elementName]: {...formData[elementName],["value"]: value}});
		//console.log({...updatedData, [elementName]: {...formData[elementName],["value"]: value}})

		setFormData({...formData, [elementName]: {...formData[elementName],["value"]: value}});
		//console.log({...formData, [elementName]: {...formData[elementName],["value"]: value}})

		let updatedFormData = {...formData, [elementName]: {...formData[elementName],["value"]: value}};
		calculateForm(formInputElements, updatedFormData);
	};

	const editProps = () => {
		if (allowEdit) {
			setInputFill("white");
			setValueColor("#5B9BD5");
			setBorder("1px solid rgb(235,235,235)");
		} else {
			setInputFill("#F8F9FA");
			setValueColor("black");
			setBorder("none");
		}
	};

	const sectionTitle = {
		fontSize: 20,
		marginBottom: 10,
	};

	const sectionStyle = {
		padding: 10,
		marginBottom: 5,
	};

	const navSectionStyle = {
		padding: 10,
	};

	const titleStyle = {
		fontSize: 24,
		fontWeight: "bold",
	};

	const subTitleStyle = {
		fontSize: 18,
		fontWeight: "normal",
	};

	useEffect(() => {
		editProps();
	}, [allowEdit]);

	const pageStyle = {
		width: "100%",
	};

	return (

        <div className="d-flex flex-column bg-light p-3" style={pageStyle}>

			<div style={titleStyle}>{pageTitle}</div>
			<div style={subTitleStyle}>{pageSubTitle}</div>
			
			<form name='form' id="form" onSubmit={handleSubmit} noValidate>
			
                {initialValues && (
					<div
						className="d-flex flex-column bg-white rounded-3 animate__animated fade-in"
						style={{ height: "70vh"}}
					>
						
						{sections.map((section, sectionIndex) =>
							section.name == "navigation" && section.visible ? 
								<div className="d-flex justify-content-center mb-3 p-3">
									{
										formElements.map((item, index)=>(
											item.ui_form_section === section.name &&
											item.ui_component_visible &&
											item.ui_component_type === "button" &&
												<button 
													key={index}
													id={item.ui_id}
													name={item.ui_name}
													onClick = {eval(item.ui_onclick)}
													className={item.ui_classname}
													>
														{item.ui_label}
												</button>	
										))
									}
								</div>	
							:
							section.name !== null && section.name !== "navigation" && section.visible ? (

								<div
									key={sectionIndex}
									className={section.name==="navigation"?  "d-flex justify-content-end": "d-flex flex-column"}
									style={section.name==="navigation"? navSectionStyle : sectionStyle}
								>
									{section.title_visible &&
										<div style={sectionTitle}>
											{toProperCase(section.name.replaceAll("_", " "))}
										</div>
									}
									{formElements.map((item, index) =>
										item.ui_form_section === section.name &&
										item.ui_component_visible &&
										(item.ui_component_type === "input" ||
											item.ui_component_type == "select") &&
										item.ui_input_type !== "file" ? (
											<div key={index} className="d-flex flex-column mb-3">
												<MultiInput
													id={{ id: item.ui_id, section: item.ui_form_section }}
													name={{
														name: item.ui_name,
														section: item.ui_form_section,
													}}
													className={item.ui_classname}
													label={item.ui_label}
													type={item.ui_input_type}
													value={formData[item.ui_id].value}
													valueColor={item.ui_color}
													inputFill={item.ui_backgroundColor}
													fill={item.ui_backgroundColor}
													border={border}
													readonly={eval(item.ui_readonly) || !allowEdit}
													disabled={eval(item.ui_disabled) || !allowEdit}
													onClick={eval(item.ui_onclick)}
													onChange={eval(item.ui_onchange)}
													onBlur={eval(item.ui_onblur)}
													onMouseOver={eval(item.ui_onmouseover)}
													onMouseLeave={eval(item.ui_mouseLeave)}
													list={
														dropdownLists.filter(
															(l) => l.name === `${item.ui_id}_list`
														).length > 0 &&
														dropdownLists.filter(
															(l) => l.name === `${item.ui_id}_list`
														)[0].listItems
													}
													allowAddData={item.ui_allow_add_data}
												/>
											</div>
										) : item.ui_form_section === section.name &&
										  item.ui_component_visible &&
										  item.ui_input_type == "file" ? (
											<div key={index} className="d-flex flex-column mb-3">
												<Attachments
													id={{ id: item.ui_id, section: item.ui_form_section }}
													name={{
														name: item.ui_name,
														section: item.ui_form_section,
													}}
													onChange={(e) => handleChange(e)}
													valueColor={item.ui_color}
													currentAttachments={formData[item.ui_id].value}
													prepareAttachments={prepareAttachments}
													userData={userData}
													readonly={eval(item.ui_readonly) || !allowEdit}
													disabled={eval(item.ui_disabled) || !allowEdit}
												/>
											</div>
										) : item.ui_form_section === section.name &&
										  item.ui_component_visible &&
										  item.ui_component_type == "table" ? (
											<div key={index} className="d-flex flex-column mb-3">
												<TableInput
													id={{ id: item.ui_id, section: item.ui_form_section }}
													name={{
														name: item.ui_name,
														section: item.ui_form_section,
													}}
													onChange={(e) => handleChange(e)}
													valueColor={item.ui_color}
													valueSize={item.ui_font_size}
													valueWeight={item.ui_font_weight}
													valueFill={item.ui_background_color}
													initialTableData={formData[item.ui_id].value}
													list={
														dropdownLists.filter(
															(l) => l.name === `${item.ui_id}_list`
														).length > 0 &&
														dropdownLists.filter(
															(l) => l.name === `${item.ui_id}_list`
														)[0].listItems
													}
													readonly={eval(item.ui_readonly) || !allowEdit}
													disabled={eval(item.ui_disabled) || !allowEdit}
												/>
											</div>
										) 
										:
										item.ui_form_section === section.name &&
										item.ui_component_visible &&
										item.ui_component_type == "img"?
										<div className={item.ui_classname}>
											<img src={`${appIcons}/${item.ui_default_value}`} alt={item.label} style={JSON.parse(item.ui_style)}></img>
											{item.ui_className}
										</div>
										:
										
										item.ui_form_section === section.name &&
										item.ui_component_visible &&
										item.ui_input_type=="output" &&
										item.ui_component_type == "title"?
										<div className={item.ui_classname} style={item.style}>{item.ui_default_value}</div>

										:

										item.ui_form_section === section.name &&
										item.ui_component_visible &&
										item.ui_input_type == "output"&&
										item.ui_component_type == "json_table"?
										
										<div className="flex-container" style={JSON.parse(item.ui_style)}>
											{
												Object.entries(eval(item.ui_default_value)).map(([key,value],fieldIndex)=>(
													value.value !=null &&
														<div key={fieldIndex} className="row">
														<div className="col-3 text-left" style={{color: "gray"}}>{toProperCase(key.replaceAll("_"," "))}: </div>
														{
															typeof value.value == "string"?
															<div className="col text-left" style={{color: "black"}}>{value.value}</div>
															:
															typeof value.value =="object" && Array.isArray(value.value) && key =="attachments"?
															<div className="col-8" style={{color: "black"}}>
																{(value.value).map((row, rowIndex)=>(
																	<div>
																		<a key={rowIndex} style={{color: "blue"}} href={row.url}>{row.name}</a>
																	</div>
																))}
															</div>
															:
															typeof value.value =="object" && Array.isArray(value.value)?
															<div className="col-8" style={{color: "black"}}>
																
																<table className="table table-bordered table-striped text-center">
																	<tr>
																		{Object.keys((value.value)[0]).map((header,headerIndex)=>(
																			<th scope="col" className="w-50">{toProperCase(header.replaceAll("_"," "))}</th>
																		))}
																	</tr>
																	{(value.value).map((row, rowIndex)=>(
																		(Object.values(row))[0].length>0 &&
																			<tr key={rowIndex}>
																				{Object.values(row).map((val,itemIndex)=>(
																					<td key={itemIndex}>{val}</td>
																				))
																		}	
																		</tr>
																	))}
																</table>
															</div>
															:
															typeof value.value =="object" ?
															<div> {JSON.stringify(value.value)}</div>
															:
															null
														}
														
													</div>
												))
											}
											
										</div>

										:

										item.ui_form_section === section.name &&
										item.ui_component_visible &&
										item.ui_input_type=="output" &&
										item.ui_component_type == "html"?
										<div
											dangerouslySetInnerHTML={{__html: formData[item.ui_id]}}
										/>
																			
										: null
									)}
									
								</div>
							) : null
						)}
					</div>
					
				)}
			</form>
		</div>
        
	);
};

export default RequestIntakeForm;


