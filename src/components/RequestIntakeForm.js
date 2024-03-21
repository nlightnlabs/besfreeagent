import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import React, {
	useState,
	useEffect,
	useContext,
	useRef,
	createRef,
} from "react";
import { Context } from "./Context.js";
import {
	toProperCase,
	UTCToLocalDate,
	escapeQuotes,
} from "./functions/formatValue.js";
import * as crud from "./apis/crud.js";
import * as fileServer from "./apis/fileServer.js";
import * as nlightnApi from "./apis/nlightn.js";
import * as arrayFunctions from "./functions/arrayFunctions.js";
import { formatDateInput } from "./functions/formatValue.js";
import { arrayObjectToString } from "./functions/arrayFunctions.js";

import Attachments from "./Attachments.js";
import MultiInput from "./MultiInput.js";
import TableInput from "./TableInput.js";
import AIInput from "./AIInput.js";

const RequestIntakeForm = (props) => {
	const {
		user,
		setUser,
		users,
		setUsers,
		userLoggedIn,
		setUserLoggedIn,
		appIcons,
		setAppIcons,
		apps,
		setApps,
		selectedApp,
		setSelectedApp,
		page,
		setPage,
		pages,
		setPages,
		pageName,
		setPageName,
		requestType,
		setRequestType,
		appData,
		setAppData,
		pageList,
		setPageList,
		requestTypes,
		setRequestTypes,
		initialFormData,
		setInitialFormData,
		tableName,
		setTableName,
		tables,
		setTables,
		currency,
		setCurrency,
		language,
		setLanguage,
		currencySymbol,
		setCurrencySymbol,
	} = useContext(Context);

	const environment = window.environment;
	const setRequestStype = props.setRequestStype;
	const formData = props.formData;
	const setFormData = props.setFormData;
	const setShowRequestIntakeModal = props.setShowRequestIntakeModal;

	const [requestTypeData, setRequestTypeData] = useState([]);
	const [requestSections, setRequestSections] = useState([]);
	const [currentRequestSection, setCurrentRequestSection] = useState("");

	const [formName, setFormName] = useState(props.formName);

	const [outputData, setOutputData] = useState({});

	const [pageTitle, setPageTitle] = useState("");
	const [pageSubTitle, setPageSubTitle] = useState("");

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
	const [lineItems, setLineItems] = useState([]);
	const [uiTriggerFields, setUiTriggerFields] = useState([]);
	const [refresh, setRefresh] = useState(0);

	const [renderPage, setRenderPage] = useState(false);
	const [formClassList, setFormClassList] = useState("form-group");

	const [lastPage, setLastPage] = useState(false);

	const { spendCategories, businessUnits, businesses, products, dbFieldData } =
		props.appData;
	const [uiRefreshTriggers, setUIRefreshTriggers] = useState({});

	const [attachments, setAttachments] = useState([]);

	const [transcription, setTranscription] = useState("");

	useEffect(() => {
		const getRequestTypeSections = async () => {
			const query = `SELECT * FROM request_flow_forms where "request_type" = '${requestType}';`;

			try {
				const response = await nlightnApi.getData(query);
				console.log("request_flow_forms", response);
				setRequestTypeData(response);

				let fieldSet = new Set();
				response.map((item) => {
					fieldSet.add(item.ui_form_description);
				});
				let requestSectionList = Array.from(fieldSet);
				setRequestSections([...requestSectionList, "Request Summary"]);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		getRequestTypeSections();
	}, []);

	useEffect(() => {
		getFormFields();
	}, [formName]);

	const getFormFields = async () => {
		console.log(formName);
		const query = `SELECT * FROM request_flow_forms where "ui_form_name" = '${formName}';`;

		try {
			const formFields = await nlightnApi.getData(query);
			console.log("formFields", formFields);

			setPageTitle(
				formFields.find((item) => item.ui_form_name == formName).name
			);
			setPageSubTitle(
				formFields.find((item) => item.ui_form_name == formName)
					.ui_form_description
			);
			console.log(
				"last page?",
				formFields.find((item) => item.ui_form_name == formName)
					.ui_last_input_page
			);
			setLastPage(
				formFields.find((item) => item.ui_form_name == formName)
					.ui_last_input_page
			);

			// Saving the state.  This is always consistent.
			setFormElements(formFields);

			// Create drop down lists
			getDropDownLists(formFields);

			// Setup form sections
			getSections(formFields);

			// Update the current request section (page) every time a form is loaded
			setCurrentRequestSection(
				formFields.find((item) => item.ui_form_name === formName)
					.ui_form_description
			);

			//Create refs for the form
			createRefs(formFields);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	// Function to dynamically create refs based on the names or IDs
	const refs = useRef({});
	const createRefs = async (formFields) => {
		console.log(formFields);
		const refList = {};
		formFields.forEach((item) => {
			refList[item.ui_name] = createRef();
		});
		refs.current = refList;
	};

	const getDropDownLists = async (formFields) => {
		if (formFields.length > 0) {
			let tempDropdownLists = [];
			let listData = {};

			await Promise.all(
				formFields.map(async (item) => {
					if (
						item.ui_component_type === "select" ||
						item.ui_component_type === "table"
					) {
						if (item.ui_query != null && item.ui_query != "") {
							const query = item.ui_query;
							console.log("dropdown query for ", item.ui_name, item.ui_query);

							const response = await crud.getData(query);
							console.log("response for ", item.ui_name, response);

							let listItems = [];
							response.map((item) => {
								listItems.push(item.option);
							});

							// Storing each drop down list in an object
							listData = {
								name: `${item.ui_id}_list`,
								listItems: listItems,
							};

							//Add each list to the array of dropdown lists
							if (tempDropdownLists.find((i) => i.name === listData.name)) {
								tempDropdownLists.find(
									(i) => i.name === listData.name
								).listItems = listData.listItems;
							} else {
								tempDropdownLists.push(listData);
							}
						} else {
							let conditionalValue = item.ui_reference_data_conditional_value;
							console.log("conditionalValue", conditionalValue);

							console.log(item.ui_reference_data_conditional_value);

							if (conditionalValue != null && conditionalValue != "") {
								console.log(conditionalValue);

								if (conditionalValue.includes(".")) {
									conditionalValue = eval(conditionalValue);
									console.log("conditionalValue", conditionalValue);
								} else {
									conditionalValue = conditionalValue;
								}
							}

							if (
								item.ui_reference_data_table != null &&
								item.ui_reference_data_table != "" &&
								item.ui_reference_data_field != null &&
								item.ui_reference_data_field != ""
							) {
								let dataTable = item.ui_reference_data_table;
								if (item.ui_reference_data_table.search("()=>") > 0) {
									dataTable = eval(item.ui_reference_data_table)();
								}

								if (
									item.ui_reference_data_conditional_field != null &&
									item.ui_reference_data_conditional_field != "" &&
									conditionalValue != null &&
									conditionalValue != ""
								) {
									const response = await crud.getConditionalList(
										dataTable,
										item.ui_reference_data_field,
										item.ui_reference_data_conditional_field,
										conditionalValue
									);

									// Storing each drop down list in an object
									listData = {
										name: `${item.ui_id}_list`,
										listItems: response,
									};

									//Add each list to the array of dropdown lists
									if (tempDropdownLists.find((i) => i.name === listData.name)) {
										tempDropdownLists.find(
											(i) => i.name === listData.name
										).listItems = listData.listItems;
									} else {
										tempDropdownLists.push(listData);
									}
								} else {
									const response = await crud.getList(
										dataTable,
										item.ui_reference_data_field
									);
									const listItems = await response;

									// Storing each drop down list in an object
									listData = {
										name: `${item.ui_id}_list`,
										listItems: listItems,
									};
									if (tempDropdownLists.find((i) => i.name === listData.name)) {
										tempDropdownLists.find(
											(i) => i.name === listData.name
										).listItems = listData.listItems;
									} else {
										tempDropdownLists.push(listData);
									}
								}
							}
						}
					}
				})
			);
			// console.log("tempDropdownLists",tempDropdownLists)
			setDropdownLists(tempDropdownLists);
			setUpFormData(formFields, tempDropdownLists);
		}
	};

	const setUpFormData = async (formFields, dropdownLists) => {
		let tempFormData = formData;
		let formInputElements = [];

		if (formFields && formFields.length > 0) {
			await Promise.all(
				formFields.map((item) => {
					if (
						item.ui_input_type != "output" &&
						item.ui_input_type != "navigation"
					) {
						formInputElements.push(item);
					}
				})
			);
			setFormInputElements(formInputElements);

			await Promise.all(
				formInputElements.map(async (item) => {
					let value = item.ui_default_value;
					try {
						if (item.ui_input_type == "table") {
							value = JSON.parse(value);
						} else if (item.ai_prompt != null && item.ai_prompt != "") {
							let api = nlightnApi;
							let textString = item.ai_prompt;
							console.log(textString);
							value = await eval(textString);
							console.log("Value after eval:", value); // Add this line to check the value after eval
						} else {
							value = eval(value);
						}

						console.log("Final value:", value); // Add this line to check the final value assigned
					} catch (error) {
						console.error("Error during evaluation:", error); // Add this line to log any errors
						value = item.ui_default_value;
					}
					tempFormData = {
						...tempFormData,
						...{ [item.ui_name]: value },
					};
				})
			);
		}

		setFormData(tempFormData);
		calculateForm(formFields, formInputElements, tempFormData);
	};

	const calculateForm = async (formFields, formInputElements, formData) => {
		let updatedFormData = formData;

		console.log(formData);

		// Use Promise.all to await all async operations in map function
		await Promise.all(
			formInputElements.map(async (item) => {
				let value = formData[item.ui_name];

				try {
					if (item.ui_calculation_type === "formula") {
						value = eval(item.ui_formula);
					}

					if (item.ui_calculation_type === "fetch") {
						const tableName = item.ui_reference_data_table;
						const fieldName = item.ui_reference_data_field;
						const conditionalField = item.ui_reference_data_conditional_field;
						const conditionalValue = eval(
							item.ui_reference_data_conditional_value
						);
						value = await crud.getValue(
							tableName,
							fieldName,
							conditionalField,
							conditionalValue
						);
					}

					updatedFormData = {
						...updatedFormData,
						...{ [item.ui_name]: value },
					};
				} catch (error) {
					console.log(error);
					value = formData[item.ui_name];
				}
			})
		);

		// Run after all async operations in map function are completed
		console.log("formData", updatedFormData);
		setInitialFormData(updatedFormData);
		setFormData(updatedFormData);
	};

	const getSections = (formFields) => {
		//   console.log("getting sections with formFields for", formName)
		let sectionSet = new Set();
		formFields.map((items) => {
			sectionSet.add(items.ui_form_section);
		});

		let sectionList = [];
		sectionSet.forEach((item) => {
			let visible = formFields.filter((r) => r.ui_form_section == item)[0]
				.ui_section_visible;
			sectionList.push({ name: item, visible: visible });
		});

		//   console.log("sectionList: ",sectionList)
		setSections(sectionList);
		setRenderPage(true);
	};

	useEffect(() => {
		//   console.log(uiRefreshTriggers)
		calculateForm(formElements, formInputElements, formData);
	}, [uiRefreshTriggers]);

	// Handle changes to standard input elements
	const handleChange = (e) => {
		const { name, value } = e.target;
		let updatedFormData = { ...formData, ...{ [name]: value } };
		// console.log(updatedFormData)
		setFormData(updatedFormData);

		calculateForm(formElements, formInputElements, updatedFormData);
	};

	// Temporarily hold any attachments until they need submittal later
	const prepareAttachments = (e) => {
		const fieldName = e.name;
		const fileData = e.fileData;
		setAttachments([
			...attachments,
			{ ui_name: fieldName, fileData: fileData },
		]);
	};

	// Create urls in AWS S3 buckets for attachments and then upload them before submittal
	const getAttachments = async () => {
		let formDataWithAttachments = formData;
		let updatedAttachments = attachments;

		await Promise.all(
			attachments.map(async (item, index) => {
				// console.log(attachments)
				let updatedFileData = item.fileData;

				await Promise.all(
					updatedFileData.map(async (file, fileIndex) => {
						let filePath = user
							? `${fileServer.fileServerRootPath}/${tableName}/user_${user.id}_${user.first_name}_${user.last_name}/${file.name}`
							: `${fileServer.fileServerRootPath}/${tableName}/general_user/${file.name}`;
						const url = await fileServer.uploadFile(filePath, file);

						let updatedFile = { ...file, ...{ ["url"]: url } };
						delete updatedFile.data;
						// console.log(updatedFile)
						updatedFileData[fileIndex] = updatedFile;
					})
				);

				updatedAttachments[index] = updatedFileData;

				formDataWithAttachments = {
					...formData,
					...{ [item.ui_name]: updatedFileData },
				};
				// console.log("formDataWithAttachments",formDataWithAttachments)
			})
		);

		return formDataWithAttachments;
	};

	// Execute save upon final submmittal by adding the record in the data base
	const handleSave = async () => {
		if (JSON.stringify(initialData) !== JSON.stringify(formData)) {
			let finalFormData = formData;
			console.log("finalFormData", finalFormData);

			//Get urls for any attachments and upload attachments to the file server
			if (attachments.length > 0) {
				finalFormData = await getAttachments();
			}
			console.log("finalFormData with attachments", finalFormData);

			let recordToSendToDb = finalFormData;

			// Stringify all fields that hold arrays or javascript objects to flatting the data
			await Promise.all(
				Object.keys(recordToSendToDb).map((fieldName) => {
					let val = recordToSendToDb[fieldName];
					if (typeof val === "object" && val != null) {
						if (environment === "freeagent") {
							recordToSendToDb = {
								...recordToSendToDb,
								...{ [fieldName]: arrayObjectToString(val) },
							};
						} else {
							recordToSendToDb = {
								...recordToSendToDb,
								...{ [fieldName]: JSON.stringify(val) },
							};
						}
					}
				})
			);
			recordToSendToDb["request_date"] = formatDateInput(new Date());
			recordToSendToDb["request_type"] = requestType;
			recordToSendToDb["requester_user_id"] = user.id;
			recordToSendToDb["requester"] = user.full_name;
			recordToSendToDb["status"] = "Open";
			recordToSendToDb["stage"] = "Reviewing";
			delete recordToSendToDb.transcription;

			console.log("recordToSendToDb", recordToSendToDb);

			//update database table with updated record data
			let appName = "";
			if (environment === "freeagent") {
				appName = "custom_app_52";

				delete recordToSendToDb.requester_user_id;
				recordToSendToDb["requester"] = user.id;

				if (
					recordToSendToDb.subcategory &&
					recordToSendToDb.subcategory != null &&
					recordToSendToDb.subcategory != ""
				) {
					try {
						recordToSendToDb.subcategory = spendCategories.find(
							(i) => i.subcategory === recordToSendToDb.subcategory
						).id;
					} catch (e) {
						delete recordToSendToDb.subcategory;
					}
				}

				if (
					recordToSendToDb.supplier &&
					recordToSendToDb.supplier != null &&
					recordToSendToDb.supplier != ""
				) {
					try {
						recordToSendToDb.supplier = businesses.find(
							(i) => i.registered_name === recordToSendToDb.supplier
						).id;
					} catch (e) {
						delete recordToSendToDb.supplier;
					}
				}

				if (
					recordToSendToDb.subcategory &&
					recordToSendToDb.subcategory != null &&
					recordToSendToDb.subcategory != ""
				) {
					try {
						recordToSendToDb.business_unit = businessUnits.find(
							(i) => i.name === recordToSendToDb.business_unit
						).id;
					} catch (e) {
						delete recordToSendToDb.business_unit;
					}
				}

				if (
					recordToSendToDb.product &&
					recordToSendToDb.product != null &&
					recordToSendToDb.product != ""
				) {
					try {
						recordToSendToDb.product = products.find(
							(i) => i.item_name === recordToSendToDb.product
						).id;
					} catch (e) {
						delete recordToSendToDb.product;
					}
				}
			} else {
				appName = "requests";
			}

			console.log(appName);
			console.log("recordToSendToDb", recordToSendToDb);
			const newRecordInDb = await crud.addRecord(appName, recordToSendToDb);
			console.log("newRecordInDb", newRecordInDb);

			let successfullyAdded = false;
			if (newRecordInDb.id !== null && newRecordInDb.id !== "") {
				successfullyAdded = true;
			}

			if (successfullyAdded) {
				setFormData(finalFormData);
				if (environment != "freeagent") {
					// Update activity log
					const activityUpdateResponse = await nlightnApi.updateActivityLog(
						"requests",
						newRecordInDb.id,
						user.email,
						"Request submitted"
					);
					console.log(activityUpdateResponse);
				}
			} else {
				alert("Unable to update record. Please check inputs.");
			}
		} else {
			alert("Nothing to save.  Form is not was not edited");
		}
	};

	// Saves form data and navigates to next page, prior page, or final page
	const handleSubmit = async (e, nextPage) => {
		console.log(formData, formData);
		console.log("nextPage:", nextPage);
		e.preventDefault();

		if (lastPage) {
			console.log("lastpage is true");
			await handleSave();
			setFormName(nextPage);
		} else {
			setFormName(nextPage);
		}
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

	useEffect(() => {
		editProps();
	}, [allowEdit]);

	const pageStyle = {
		width: "100%",
	};

	const [showAttachment, setShowAttachment] = useState(false);
	const [selectedAttachment, setSelectedAttachment] = useState(null);
	const handleShowAttachment = (e, attachment) => {
		setSelectedAttachment(attachment);
		setShowAttachment(true);
	};

	return (
		<div className="d-flex" style={pageStyle}>
			<div
				className="d-flex flex-column bg-light p-3"
				style={{ width: "25%", minWidth: "200px", height: "100%" }}
			>
				{requestSections.length > 0 &&
					requestSections.map((item, index) => (
						<div
							className="d-flex flex-column p-2"
							style={{
								color:
									currentRequestSection === item ? "rgb(0,200,0)" : "lightgray",
								fontWeight: currentRequestSection === item ? "bold" : "normal",
								border:
									currentRequestSection === item
										? "1px solid lightgray"
										: "none",
								borderRadius: currentRequestSection === item ? "5px" : "0",
								backgroundColor:
									currentRequestSection === item
										? "rgba(235,255,200,0.5)"
										: "rgba(235,255,200,0)",
							}}
							key={index}
						>
							{item}
						</div>
					))}
			</div>

			<div className="d-flex" style={{ height: "100%", width: "75%" }}>
				{/* <form className= "w-100" name='form' id="form" noValidate> */}

				{renderPage && (
					<div
						className="d-flex flex-column bg-white animate__animated fade-in"
						style={{ height: "100%", width: "100%" }}
					>
						{sections.map((section, sectionIndex) =>
							section.name == "navigation" && section.visible ? (
								<div
									key={sectionIndex}
									className="d-flex justify-content-end mb-3 p-3"
								>
									{formElements.map(
										(item, index) =>
											item.ui_form_section === section.name &&
											item.ui_component_visible &&
											item.ui_component_type === "button" && (
												<button
													key={index}
													id={item.ui_id}
													name={item.ui_name}
													onClick={eval(item.ui_onclick)}
													className={item.ui_classname}
												>
													{item.ui_label}
												</button>
											)
									)}
								</div>
							) : section.name !== null &&
							  section.name !== "navigation" &&
							  section.visible ? (
								<div
									key={sectionIndex}
									className={
										section.name === "navigation"
											? "d-flex justify-content-end"
											: "d-flex flex-column"
									}
									style={
										section.name === "navigation"
											? navSectionStyle
											: sectionStyle
									}
								>
									{section.title_visible && (
										<div style={sectionTitle}>
											{toProperCase(section.name.replaceAll("_", " "))}
										</div>
									)}
									{formElements.map((item, index) =>
										// Standard Input or select element
										item.ui_form_section === section.name &&
										item.ui_component_visible &&
										(item.ui_component_type === "input" ||
											item.ui_component_type == "select") &&
										item.ui_input_type !== "file" &&
										item.ui_input_type !== "image" ? (
											<div
												key={index}
												ref={refs.current[item.ui_name]}
												className="d-flex flex-column mb-3"
											>
												<MultiInput
													id={item.ui_id}
													name={item.ui_name}
													className={item.ui_classname}
													label={item.ui_label}
													type={item.ui_input_type}
													value={formData[item.ui_name]}
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
														dropdownLists.find(
															(l) => l.name === `${item.ui_id}_list`
														) != null
															? dropdownLists.find(
																	(l) => l.name === `${item.ui_id}_list`
															  ).listItems
															: null
													}
													allowAddData={item.ui_allow_add_data}
												/>
											</div>
										) : // File attachment
										item.ui_form_section === section.name &&
										  item.ui_component_visible &&
										  item.ui_component_type == "input" &&
										  item.ui_input_type == "file" ? (
											<div
												key={index}
												ref={refs.current[item.ui_name]}
												className="d-flex flex-column mb-3"
											>
												<Attachments
													id={item.ui_id}
													name={item.ui_name}
													onChange={prepareAttachments}
													valueColor={item.ui_color}
													currentAttachments={formData[item.ui_name]}
													user={user}
													readonly={eval(item.ui_readonly) || !allowEdit}
													disabled={eval(item.ui_disabled) || !allowEdit}
												/>
											</div>
										) : // Image attachment with preview up on upload
										item.ui_form_section === section.name &&
										  item.ui_component_visible &&
										  item.ui_component_type == "input" &&
										  item.ui_input_type == "image" ? (
											<div
												key={index}
												ref={refs.current[item.ui_name]}
												className="d-flex flex-column mb-3"
											>
												{JSON.parse(formData[item.ui_name]) &&
												formData[item.ui_name] != "" &&
												formData[item].value != null ? (
													<div
														className="d-flex w-100 p-1"
														style={{
															height: "fit-content",
															width: "90%",
															overflowX: "auto",
														}}
													>
														{JSON.parse(formData[item.ui_name]).map(
															(att, index) => (
																<img
																	key={index}
																	src={att.url}
																	alt={`${att.name} icon`}
																	style={{ height: "100px", width: "auto" }}
																></img>
															)
														)}
													</div>
												) : null}
												<Attachments
													id={item.ui_id}
													name={item.ui_name}
													className={item.ui_classname}
													label={item.ui_label}
													onChange={prepareAttachments}
													valueColor={item.ui_color}
													currentAttachments={formData[item.ui_name]}
													user={user}
													readonly={eval(item.ui_readonly) || !allowEdit}
													disabled={eval(item.ui_disabled) || !allowEdit}
												/>
											</div>
										) : // Table input
										item.ui_form_section === section.name &&
										  item.ui_component_visible &&
										  item.ui_component_type == "table" &&
										  initialFormData[item.ui_id] != null &&
										  initialFormData[item.ui_id] != "" ? (
											<div
												key={index}
												ref={refs.current[item.ui_name]}
												className="d-flex flex-column mb-3"
											>
												<TableInput
													id={item.ui_id}
													name={item.ui_name}
													onChange={handleChange}
													valueColor={item.ui_color}
													valueSize={item.ui_font_size}
													valueWeight={item.ui_font_weight}
													valueFill={item.ui_background_color}
													initialTableData={formData[item.ui_id]}
													list={
														dropdownLists.find(
															(l) => l.name === `${item.ui_id}_list`
														) != null
															? dropdownLists.find(
																	(l) => l.name === `${item.ui_id}_list`
															  ).listItems
															: null
													}
													readonly={eval(item.ui_readonly) || !allowEdit}
													disabled={eval(item.ui_disabled) || !allowEdit}
												/>
											</div>
										) : // Title Output
										item.ui_form_section === section.name &&
										  item.ui_component_visible &&
										  item.ui_input_type == "output" &&
										  item.ui_component_type == "title" ? (
											<div
												className={item.ui_classname}
												style={JSON.parse(item.ui_style)}
											>
												{item.ui_default_value}
											</div>
										) : // Title Output
										item.ui_form_section === section.name &&
										  item.ui_component_visible &&
										  item.ui_input_type == "output" &&
										  item.ui_component_type == "image" ? (
											<div className={item.ui_classname}>
												<img
													src={
														appIcons.find(
															(i) => i.name === item.ui_default_value
														).image
													}
													style={JSON.parse(item.ui_style)}
												></img>
											</div>
										) : // Tabular output based json data
										item.ui_form_section === section.name &&
										  item.ui_component_visible &&
										  item.ui_input_type == "output" &&
										  item.ui_component_type == "json_table" ? (
											<div
												key={index}
												className="flex-container"
												style={{ position: "relative" }}
											>
												{Object.entries(eval(item.ui_default_value)).map(
													([key, value], fieldIndex) =>
														value != null && (
															<div key={fieldIndex} className="row">
																{typeof value == "string" ? (
																	<div
																		className="d-flex "
																		style={JSON.parse(item.ui_style)}
																	>
																		<div
																			className="col-3 text-left"
																			style={{ color: "gray" }}
																		>
																			{toProperCase(key.replaceAll("_", " "))}:{" "}
																		</div>
																		<div
																			className="col text-left"
																			style={{ color: "black" }}
																		>
																			{value}
																		</div>
																	</div>
																) : typeof value == "object" &&
																  Array.isArray(value) &&
																  key == "attachments" ? (
																	<div
																		className="d-flex "
																		style={JSON.parse(item.ui_style)}
																	>
																		<div
																			className="col-3 text-left"
																			style={{ color: "gray" }}
																		>
																			{toProperCase(key.replaceAll("_", " "))}:{" "}
																		</div>
																		<div
																			className="col-8"
																			style={{ color: "black" }}
																		>
																			{value.map((row, rowIndex) => (
																				<div
																					title="Click to preview"
																					key={rowIndex}
																					name={row.name}
																					style={{
																						color: "blue",
																						cursor: "pointer",
																					}}
																					onClick={(e) =>
																						handleShowAttachment(e, row)
																					}
																				>
																					{row.name}
																				</div>
																			))}
																			{showAttachment && (
																				<div className="d-flex justify-content-center p-3 bg-light flex-column">
																					<div className="d-flex p-1">
																						<div>
																							Preview of{" "}
																							{selectedAttachment.name}
																						</div>
																						<img
																							src={
																								appIcons.find(
																									(i) => i.name === "close"
																								).image
																							}
																							style={{
																								height: "30px",
																								width: "30px",
																								cursor: "pointer",
																							}}
																							onClick={(e) =>
																								setShowAttachment(false)
																							}
																							title="Close Preview"
																						></img>
																					</div>
																					<img
																						src={selectedAttachment.url}
																					></img>
																				</div>
																			)}
																		</div>
																	</div>
																) : typeof value == "object" &&
																  Array.isArray(value) &&
																  !arrayFunctions.arrayIsEmpty(value) ? (
																	<div
																		className="d-flex "
																		style={JSON.parse(item.ui_style)}
																	>
																		<div
																			className="col-3 text-left"
																			style={{ color: "gray" }}
																		>
																			{toProperCase(key.replaceAll("_", " "))}:{" "}
																		</div>
																		<div
																			className="col-8"
																			style={{ color: "black" }}
																		>
																			<table className="table table-bordered table-striped text-center">
																				<thead>
																					<tr>
																						{Object.keys(value[0]).map(
																							(header, headerIndex) => (
																								<th
																									scope="col"
																									className="w-50"
																								>
																									{toProperCase(
																										header.replaceAll("_", " ")
																									)}
																								</th>
																							)
																						)}
																					</tr>
																				</thead>
																				<tbody>
																					{value.map(
																						(row, rowIndex) =>
																							Object.values(row)[0].length >
																								0 && (
																								<tr key={rowIndex}>
																									{Object.values(row).map(
																										(val, itemIndex) => (
																											<td key={itemIndex}>
																												{val}
																											</td>
																										)
																									)}
																								</tr>
																							)
																					)}
																				</tbody>
																			</table>
																		</div>
																	</div>
																) : null}
															</div>
														)
												)}
											</div>
										) : // Rendered output based on html code
										item.ui_form_section === section.name &&
										  item.ui_component_visible &&
										  item.ui_input_type == "output" &&
										  item.ui_component_type == "html" ? (
											<div
												key={index}
												dangerouslySetInnerHTML={{
													__html: formData[item.ui_id],
												}}
											/>
										) : // AI Input tool
										item.ui_form_section === section.name &&
										  item.ui_component_visible &&
										  item.ui_input_type == "AIInput" ? (
											<div
												key={index}
												className="d-flex justify-content-center mb-3"
											>
												<AIInput
													transcription={transcription}
													setTranscription={setTranscription}
												/>
											</div>
										) : null
									)}
								</div>
							) : null
						)}
					</div>
				)}
				{/* </form> */}
			</div>
		</div>
	);
};

export default RequestIntakeForm;
