import React, {useState, useEffect, useContext, useRef} from 'react'
import { Context } from "./Context.js"
import {getTable} from './apis/axios.js'
import axios from './apis/axios.js'
import "bootstrap/dist/css/bootstrap.min.css"

import 'animate.css';

const AddBusiness = () => {

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
    setRequestTypes
  } = useContext(Context)

  let formData = {}
  
  const [industryData, setIndustryData] = useState([])
  const [industries, setIndustries] = useState([])
  const [currencySymbol, setCurrencySymbol] = useState("$")
  const [formClassList, setFormClassList] = useState("form-group")

  const formRef = useRef()

  const getIndustryData = async ()=>{
    const response = await getTable("business_types")
    const data = await response.data
    setIndustryData(data)

    let industrySet = new Set()
    
      await data.forEach(item=>{
        industrySet.add(item.business_type_level_3)
      })
      
      let industryList = [...industrySet]
      setIndustries(industryList.sort())
  }


  const handleChange = (e)=>{
    const {name, value} = e.target
    let new_data = {[name]: value}
    formData = {...appData[`${page.data}`],...new_data}
    console.log({...appData,[`${page.data}`]:formData})
    setAppData({...appData,[`${page.data}`]:formData})
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()

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
        
        const addBusinessToDb = async (req,res)=>{ 

          const columns = Object.keys(appData["new_business_data"])
          const values = Object.values(appData["new_business_data"])

          const params = {
            table: "businesses",
            columns: columns,
            values: values
          }
            try{
              const response = await axios.post("/db/addRecord",{params})
              const responseData = await response.data.data
              console.log(response)
              if(response.statusText=="OK"){
                alert("Business has been added.  Thank you.")
              }
            }catch(error){
              console.log(error)
            }
        }
        await addBusinessToDb()
        
        let pageListCopy = pageList
        let thisPage = pageListCopy.splice(-1)
        let nextPage = pageListCopy[pageListCopy.length-1]
        setPageList(pageListCopy)
        setPage(pages.filter(x=>x.name===nextPage)[0])
        setPageName(nextPage)
      }
      setFormClassList('form-group was-validated')
    }
}

  useEffect(()=>{
    getIndustryData()
  },[])

  const [pageClass, setPageClass] = useState("container mt-5 animate__animated animate__fadeIn animate__duration-0.5s")
  
  return (
    <div className = {pageClass}>
      <div className="row">
        <div className="col"></div>

        <div className="col-lg-6">
          
          <h1 className="text-left mb-3 border-bottom border-5">Add Business</h1>
          
          <div className="d-flex flex-column bg-light border shadow p-3 rounded-2 justify-content-center">
          
          <form name='form' id="form" onSubmit={handleSubmit} className={formClassList} noValidate>
            
            <div className="form-floating mb-3">
              <input id = "name" name= "name" className="form-control form-control text-primary" onChange={handleChange} placeholder="Provide a name for this supplier" required></input>
              <label htmlFor="name" className="form-label text-body-tertiary small">Business Name</label>
            </div>

            <div className="form-floating mb-3">
              <input id = "website" name= "website" type="url" className="form-control form-control text-primary" onChange={handleChange} placeholder="Provide a name for this supplier" required></input>
              <label htmlFor="website" className="form-label text-body-tertiary small">Website</label>
            </div>

            <div className="form-floating mb-3">
              <input id = "government_id" name= "government_id" className="form-control form-control text-primary" onChange={handleChange} placeholder="Provide a name for this supplier" required></input>
              <label htmlFor="government_id" className="form-label text-body-tertiary small">Government ID (e.g. Tax ID, EIN, VAT ID, etc.)</label>
            </div>

             
            <div className="form-floating mb-3">
              <select 
                id = "industry" 
                name = "industry" 
                className="form-select text-primary" 
                placeholder="Select a primary industry this business serves"
                onChange={handleChange} 
                defaultValue=""
                >
                <option value="" style={{color: "lightgray"}}></option>
                {industries.map(item=>(
                  <option className="option light" key={industries.indexOf(item)+1}>{item}</option>
                ))}
              </select>
              <label htmlFor="industry" className="form-label text-body-tertiary">Primary Industry Served</label>
            </div>

            <div className="input-group mb-3">
                <div className="input-group-text">{currencySymbol}</div>
                  <div className="form-floating">
                  <input id = "revenue" name="revenue" className="form-control text-primary" type = "number" placeholder="Provide an estimated annual revenue" onChange={handleChange}></input>
                  <label htmlFor="revenue" className="form-label text-body-tertiary small">Annual Revenue</label>
                </div>
              </div>

              <div className="input-group mb-3">
                  <div className="form-floating">
                  <input id = "employees" name="employees" className="form-control text-primary" type = "number" placeholder="Provide an estimated number of employees" onChange={handleChange}></input>
                  <label htmlFor="employees" className="form-label text-body-tertiary small">Number of Employees</label>
                </div>
              </div>

            <h6>Primary Contact Info</h6>
            <div className="form-group mb-3">
            <div className="input-group mb">
              <span className="input-group-text w-25" id="first_name">First Name</span>
              <input typeName="text" className="form-control text-primary" placeholder="" aria-label="first_name" aria-describedby="basic-addon1"></input>
            </div>
            <div className="input-group mb">
              <span className="input-group-text w-25" id="last_name">Last Name</span>
              <input typeName="text" className="form-control text-primary" placeholder="" aria-label="first_name" aria-describedby="basic-addon1"></input>
            </div>
            <div className="input-group mb">
              <span className="input-group-text w-25" id="last_name">Job Title</span>
              <input typeName="text" className="form-control text-primary" placeholder="" aria-label="job_title" aria-describedby="basic-addon1"></input>
            </div>
            <div className="input-group mb">
              <span className="input-group-text w-25" id="email">Email</span>
              <input typeName="email" className="form-control text-primary" placeholder="" aria-label="email" aria-describedby="basic-addon1"></input>
            </div>
            <div className="input-group mb">
              <span className="input-group-text w-25" id="first_name">Phone</span>
              <input typeName="phone" className="form-control text-primary" placeholder="" aria-label="phone" aria-describedby="basic-addon1"></input>
            </div>
            </div>

           
            <div className="d-flex justify-content-center">
              <div className="btn-group">
                <button name= "backButton" className="btn btn-outline-secondary w-25" data-bs-toggle="button" type="submit">Back</button>
                <button name="submitButton" className="btn btn-primary w-25" data-bs-toggle="button" type="submit">Submit</button>
              </div>
            </div>
          </form>

          </div>
        </div>
        
        <div className="col"></div> 
      </div>
    </div>
  )
}

export default AddBusiness