import React, {useState, useEffect, useContext, useRef, createRef} from 'react'
import { Context } from "./Context.js"
import {getTable} from './apis/axios.js'
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import SuperInput from './SuperInput.js'


const Budget = () => {

  const {
    user,
    setUser,
    userLoggedIn,
    setUserLoggedIn,
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
    attachments,
    setAttachments,
    pageList,
    setPageList,
    requestTypes,
    setRequestTypes,
    initialFormData,
    setInitialFormData
} = useContext(Context)


useEffect(()=>{
  setPage(pages.filter(x=>x.name===pageName)[0])
  setPageList([...pageList,pageName])
  getBusinessUnits()
  initializeUsers()
},[])
  

  let formData = {}
  const productRef = useRef()
  const supplierRef = useRef()

  const [businessUnitData, setBusinessUnitData] = useState([])
  const [businessUnits, setBusinessUnits] = useState([])
  const [currencySymbol, setCurrencySymbol] = useState("$")

  const [formClassList, setFormClassList] = useState("form-group")

  const [budgetItems, setBudgetItems] = useState([
    {description: "", amount:""},
    {description: "", amount:""},
    {description: "", amount:""}
  ])

  const initializeUsers = ()=>{
    console.log("initialize users check")
    let x = JSON.stringify(Object.values(appData))
    if(x.search("budget_items")>0){
      console.log("budget_items found")
      budgetItems(appData[page.data]["budget_items"])
    }
  }

  const budgetItemRefs = useRef([]);
  budgetItemRefs.current = budgetItems.map(
      (ref, index) =>   budgetItemRefs.current[index] = createRef(index)
    )


  const getBusinessUnits = async ()=>{
    const response = await getTable('business_units')
    const data = await response.data
    setBusinessUnitData(data)

    let businessUnitSet = new Set()
      await data.forEach(item=>{
        businessUnitSet.add(item.name)
      })
      
      let businessUnitList = [...businessUnitSet]
      setBusinessUnits(businessUnitList.sort())
  }

  const handleChange = (e)=>{
    const {name, value} = e.target
    let new_data = {[name]: value}
    formData = {...appData[`${page.data}`],...new_data}
    setInitialFormData(formData)
    setAppData({...appData,[`${page.data}`]:formData})
  }

  let budgetItemData = budgetItems
  const handleUserInput = (e, index)=>{
    let {name, value} = e.target
    if(name.search("description")>0){
      name = "description"
    }else if(e.target.id.search("amount")>0)(
      name = "amount"
    )
    let new_data = {[name]: value}
    budgetItemData[index] =  {...budgetItemData[index],...new_data}
    setBudgetItems(budgetItemData)
    let request_details = {...appData[`${page.data}`],["budget_items"]:budgetItemData}
    setAppData({...appData, request_details})
  }

  const handleSubmit = async (e)=>{
    
    e.preventDefault();
    const form = e.target

    if(e.nativeEvent.submitter.name==="backButton"){
      setFormClassList("form-group")
      let pageListCopy = pageList
      let thisPage = pageListCopy.splice(-1)
      let nextPage = pageListCopy[pageListCopy.length-1]
      setPageList(pageListCopy)
      setPage(pages.filter(x=>x.name===nextPage)[0])
      setPageName(nextPage)

    }else{
        if(!form.checkValidity()){
          e.preventDefault();
        }else{

          let header_data = {
            subject: appData[`${page.data}`].subject,
            request_details: appData[`${page.data}`].details
          }
        
          let request_summary = {...appData.request_summary,...header_data}
          setAppData({...appData, request_summary})

          let nextPage = "Additional Info"
          setPage(pages.filter(x=>x.name===nextPage)[0])
          setPageList([...pageList,nextPage])
          setPageName(nextPage)
        }
        setFormClassList('form-group was-validated')
    }
}

const handleReset = ()=>{
  formData={}
  setAppData({...appData, [`${page.data}`]:formData})
}

  const addIconStyle = {
    height: 30,
    width: 30,
    cursor: "pointer"
  }

  const removeIconStyle = {
    height: 30,
    width: 30,
    cursor: "pointer"
  }

  const addItem = () =>{
    const newRow={name:"",email:""}
    setBudgetItems([...budgetItems,newRow])
  }

  const removeItem = (e, index) =>{
    if(index>0){
      setBudgetItems(
        budgetItems.filter(user => budgetItems.indexOf(user) !== index)
      );
    }

  }

  

  const inputRequired = (index)=>{
    if(index==0){
      return {required: true}
    }
  }

  const addIcon = "https://nlightnlabs01.s3.us-west-1.amazonaws.com/icons/add_icon.png"
  const removeIcon = "https://nlightnlabs01.s3.us-west-1.amazonaws.com/icons/delete_icon.png"

  const [pageClass, setPageClass] = useState("container mt-5 animate__animated animate__fadeIn animate__duration-0.5s")
  

  return (
    <div className = {pageClass}>
      <div className="row">
        <div className="col"></div>

        <div className="col-lg-6">
          
          <h1 className="text-left mb-3 border-bottom border-5">{pageName} Request</h1>
          
          <div className="d-flex flex-column bg-light border shadow p-3 rounded-2 justify-content-center">
          
          <form name='form' id="form" onSubmit={handleSubmit} className = "form-group" noValidate>
            
            {/* Button Group */}
            <div className="d-flex justify-content-center mb-3">
              <div className="d-flex w-100 justify-content-between">
                <button name= "backButton" className="btn btn-outline-secondary" style={{width:"100px"}} data-bs-toggle="button" type="submit">Back</button>
                <button name="nextButton" className="btn btn-primary" style={{width:"100px"}} data-bs-toggle="button" type="submit">Next</button>
              </div>
            </div>

            <div className="form-floating mb-3">
              <input 
              id = "subject" 
              name= "subject" 
              className="form-control form-control text-primary" 
              onChange={handleChange} 
              placeholder="Provide a subject or headline for this request" 
              value={initialFormData.subject}
              required
              ></input>
              <label htmlFor="subject" className="form-label text-body-tertiary small">Provide a subject name for this budget request</label>
            </div>

            <div className="form-floating mb-3">
              <SuperInput
                id = "business_unit" 
                name="business_unit"
                list={businessUnits}
                value={initialFormData.business_unit}
                valueColor="#2C7BFF"
                onChange={handleChange} 
                label={"Select the business unit for this budget"}
                required={true}
                />
            </div>

            <div className="form-group mb-3">

             <h5>Describe the items you need budget for</h5>
              <table className="table w-100 border rounded rounded-2">
                <thead>
                  <tr className="text-center text-small">
                    <th>Item Description</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                  <tr className="table-group-divider"></tr>
                </thead>
                <tbody className="table-group-divider text-small">
                  {budgetItems.map((user, index)=>(
                    <tr key={index} id={`budget_item_${index}`} ref={budgetItemRefs.current[index]}>
                      <td><input id={`budget_item_${index}_description`} name={`budget_item_${index}_description`} className="form-control text-primary" onChange={(e)=>handleUserInput(e, index)} value={budgetItems[index].name}{...inputRequired(index)}></input></td>
                      <td><input id={`budget_item_${index}_amount`} name={`budget_item_${index}_amount`} className="form-control text-primary" type="number" onChange={(e)=>handleUserInput(e, index)} value={budgetItems[index].email} {...inputRequired(index)}></input></td>
                      <td id={`remove_budget_item_${index}`} className="small bg-second"><img src={removeIcon} style={removeIconStyle} onClick={(e)=>removeItem(e, index)}></img></td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="2" className="small bg-second" style={{background:"none"}}><img src={addIcon} style={addIconStyle} onClick={(e)=>addItem(e)}></img>Add budget item</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* <div className="d-flex justify-content-center">
              <div className="btn-group">
                <button name= "backButton" className="btn btn-outline-secondary w-25" data-bs-toggle="button">Back</button>
                <button name="nextButton" className="btn btn-primary w-25" data-bs-toggle="button" type="submit">Next</button>
              </div>
            </div> */}
          </form>

          </div>
        </div>
        
        <div className="col"></div> 
      </div>
    </div>
  )
}

export default Budget