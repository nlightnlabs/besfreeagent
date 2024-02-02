import React, {useState, useEffect, useContext, useRef} from 'react'
import { Context } from "./Context.js"
import axios from './apis/axios.js'
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import SuperInput from './SuperInput.js'


const PurchaseRequest = () => {

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
    getBusinessData()
    getCategories()
  },[])
  
  let formData = appData

  const [categoryData, setCategoryData] = useState([])
  const [categories, setCategories] = useState([])
  const [businessData, setBusinessData] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [currencySymbol, setCurrencySymbol] = useState("$")
  const [files, setFiles] = useState(null)
  const [formClassList, setFormClassList] = useState("form-group")

  const formRef = useRef()
  const categoryRef = useRef()

  const getBusinessData = async ()=>{
    const response = await axios.get("/db/table/businesses")
    const data = await response.data.data
    setBusinessData(data)

    let businessseSet = new Set()
    
      await data.forEach(item=>{
        businessseSet.add(item.name)
      })
      
      let businessList = [...businessseSet]
      setBusinesses(businessList.sort())
  }

  const getCategories = async ()=>{
    const response = await axios.get("/db/table/spend_categories")
    const data = await response.data.data
    setCategoryData(data)

    let categorySet = new Set()
      await data.forEach(item=>{
        categorySet.add(item.category)
      })
      
      let categoryList = [...categorySet]
      setCategories(categoryList.sort())
      console.log(categoryList)
  }

  const getSubcategories = async (category)=>{
    try{
      const response = await axios.get(`/db/subList/spend_categories/subcategory/category/${category}`)
      const data = await response.data
      console.log(data)
      let subcategorySet = new Set()
      data.forEach(item=>{
        subcategorySet.add(item)
      })
      let subcategoryList = [...subcategorySet]
      setSubcategories(subcategoryList.sort())
      console.log(subcategoryList.sort())
    }catch(error){
      console.log(error)
    }
  }

  const handleChange = (e)=>{
    console.log(e)
      const {name, value} = e.target
      let new_data = {[name]: value}
      formData = {...appData[`${page.data}`],...new_data}
      setInitialFormData(formData)
      setAppData({...appData,[`${page.data}`]:formData})
      if(name=="category"){
        let selectedCategory = value
        if(categories.find(record=>record===selectedCategory)){
          setSubcategories([""])
          getSubcategories(value)
        }
      }
  }

  const handleSubmit = async (e)=>{

    e.preventDefault();
    const form = e.target

    if(e.nativeEvent.submitter.name==="backButton"){
      formData = {}
      setInitialFormData(formData)
      setAppData({...appData,[`${page.data}`]:formData})

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

  const addIcon = "https://nlightnlabs01.s3.us-west-1.amazonaws.com/icons/add_icon.png"

  const iconStyle = {
    height: 30,
    width: 30,
    cursor: "pointer"
  }

  const addSupplier = ()=>{
    let nextPage = "Add Business"
    setPage(pages.filter(x=>x.name===nextPage)[0])
    setPageList([...pageList,nextPage])
    setPageName(nextPage)
  }

  


  const [pageClass, setPageClass] = useState("container mt-5 animate__animated animate__fadeIn animate__duration-0.25s")
  

  return (
    <div className = {pageClass}>
      <div className="row">
        <div className="col"></div>

        <div className="col-lg-6">
          
          <h1 className="text-left mb-3 border-bottom border-5">{pageName}</h1>
          
          <div className="d-flex flex-column bg-light border shadow shadow p-3 rounded-2 justify-content-center mb-3">
          
          <form ref={formRef} name='form' id="form" onSubmit={handleSubmit} className={formClassList} noValidate>
            
            {/* Button Group */}
            <div className="d-flex justify-content-center mb-3">
              <div className="d-flex w-100 justify-content-between">
                <button name= "backButton" className="btn btn-outline-secondary" style={{width:"100px"}} data-bs-toggle="button" type="submit">Back</button>
                <button name="nextButton" className="btn btn-primary" style={{width:"100px"}} data-bs-toggle="button" type="submit">Next</button>
              </div>
            </div>

            <div className="form-floating mb-3">
              <input id = "subject" name= "subject" className="form-control text-primary" value={initialFormData.subject} onChange={handleChange} placeholder="Provide a subject or headline for this request" required></input>
              <label htmlFor="subject" className="form-label text-body-tertiary small">Summarize what you need</label>
            </div>
            
            <div className="form-floating mb-3">
              <SuperInput
                id = "supplier" 
                name = "supplier" 
                list={businesses}
                value={initialFormData.supplier}
                valueColor="#2C7BFF"
                onChange={handleChange} 
                label={"Select a preferred supplier if known"}
                required={true}
                />
              <div className="text-secondary small"><img src={addIcon} style={iconStyle} onClick={(e)=>addSupplier(e)}></img>Add supplier</div>
            </div>

            <div className="form-floating mb-3 has-validation">
              <SuperInput
                ref={categoryRef}
                id = "category" 
                name="category" 
                list={categories}
                value={initialFormData.categories}
                valueColor="#2C7BFF"
                onChange={handleChange} 
                onBlur={handleChange}
                label={"Select spend category"}
                required={true}
                />
            </div>

            {subcategories.length>0 &&
            <div className="form-floating mb-3 has-validation animate__animated animate__slideInDown animate__duration-0.5s" style={{zIndex:99999}}>
              <SuperInput
                id = "subcategory" 
                name="subcategory" 
                list={subcategories}
                value={initialFormData.subcategory}
                valueColor="#2C7BFF"
                onChange={handleChange} 
                label={"Select spend subcategory"}
                required={true}
                />
            </div>
            }
            
            
            <div className="form-floating mb-3">
              <textarea 
                id="details" 
                name="details" 
                className="form-control form-control text-primary z-0" 
                rows="5" style={{height:"100%"}} 
                onChange={handleChange}
                value={initialFormData.details}
                placeholder="Please provide specific details for your request" 
                required>
              </textarea>
              <label htmlFor="details" className="form-label text-body-tertiary small">Describe what you need in detail</label>
            </div>

            <div className="input-group mb-3 z-1">
                <div className="input-group-text">{currencySymbol}</div>
                  <div className="form-floating">
                  <input id = "amount" name="amount" className="form-control text-primary" type = "number" value={initialFormData.amount} placeholder="Provide an estimated total cost if known" onChange={handleChange}></input>
                  <label htmlFor="amount" className="form-label text-body-tertiary small">Provide an estimated amount if known</label>
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

export default PurchaseRequest