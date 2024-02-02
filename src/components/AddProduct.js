import React, {useState, useEffect, useContext, useRef, createRef} from 'react'
import { Context } from "./Context.js"
import axios, {getTable} from './apis/axios.js'
import "bootstrap/dist/css/bootstrap.min.css"

import 'animate.css';

const AddProduct = () => {

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

  let formData={}


  const [categoryData, setCategoryData] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [businessData, setBusinessData] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [unitOfMeasuresData, setUnitOfMeasuresData] = useState([])
  const [unitOfMeasures, setUnitOfMeasures] = useState([])
  const [currencySymbol, setCurrencySymbol] = useState("$")

  const [formClassList, setFormClassList] = useState("form-group")

  const categoryRef = useRef()


  const getCategories = async ()=>{
    const response = await getTable('spend_categories')
    const data = await response.data
    setCategoryData(data)

    let categorySet = new Set()
      await data.forEach(item=>{
        categorySet.add(item.category)
      })
      
      let categoryList = [...categorySet]
      setCategories(categoryList.sort())

  }

  const getSubcategories = async (category)=>{
    const response = await axios.get(`/db/subList/spend_categories/subcategory/category/${category}`)
    const data = await response.data.data

    let subcategorySet = new Set()
    await data.forEach(item=>{
      subcategorySet.add(item)
    })

    let subcategoryList = [...subcategorySet]
    setSubcategories(subcategoryList.sort())
  }


  const getBusinesses = async ()=>{
    const response = await getTable('businesses')
    const data = await response.data
    setBusinessData(data)

    let businessSet = new Set()
      await data.forEach(item=>{
        businessSet.add(item.name)
      })
      
      let businessList = [...businessSet]
      setBusinesses(businessList.sort())

  }

  const getUnitsOfMeasures = async ()=>{
    const response = await getTable('units_of_measures')
    const data = await response.data
    setUnitOfMeasuresData(data)

    let uomSet = new Set()
      await data.forEach(item=>{
        uomSet.add(item.unit_of_measure)
      })
      
      let uomList = [...uomSet]
      setUnitOfMeasures(uomList.sort())

  }

  const handleChange = (e)=>{
    const {name, value} = e.target
    let new_data = {[name]: value}
    formData = {...appData[`${page.data}`],...new_data}
    console.log({...appData,[`${page.data}`]:formData})
    setAppData({...appData,[`${page.data}`]:formData})

    if(name=="category" && categoryRef.current.value !==""){
      const category = categoryRef.current.value
      getSubcategories(category)
    }
  }

  let fileData=[]
  const gatherAttachments = async (e)=>{ 

    attachments.forEach(file=>{
      // console.log(file)

      let fileName = file.name
      const filePath=`spendFlow/intake/attachments/${fileName}`
      // console.log(filePath)


      const uploadFiles = async (req, res)=>{

        //get secure url from our server
        const response = await axios.post(`/getS3FolderUrl`,{filePath: filePath})

        const url = await response.data.data
        // console.log(url)

        const fileURL = await url.split('?')[0]
        // console.log(fileURL)

        //Post file directly to s3 bucket
        await fetch(url, {
          method: "PUT",
            headers: {
              "Content-Type": file.data.type
            },
            body: file.data
        })

      fileData = attachments
      fileData.filter(record=>record.name===fileName)[0].url = fileURL
      // console.log(`file data: ${JSON.stringify(fileData)}`)

      setAttachments(fileData)

      let request_summary = {...appData.request_summary,["attachments_urls"]:fileData}
      setAppData({...appData, request_summary})
      // console.log(`formData: ${JSON.stringify(formData)}`)
      }
      uploadFiles()
    })
}

  
const handleSubmit =async (e)=>{
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
    }
    else{

      console.log(JSON.stringify(Object.values(appData["new_product_data"])))

      // let appDataCopy = appData

      // if(attachments.length>0){
      //   await gatherAttachments()
      // }else{
      //   let request_summary = {...appDataCopy.request_summary,["attachments"]:[]}
      //   appDataCopy = {...appData, request_summary}
      //   setAppData({...appData, request_summary})
      // }

      const updateDataBase = async (req,res)=>{ 
          
        const columns = Object.keys(appData["new_product_data"])
        const values = Object.values(appData["new_product_data"])
    
        const params = {
          table: "products",
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
      await updateDataBase()
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

  const handleAttachment = (e)=>{

    const filesToUpload = e.target.files
    // console.log(filesToUpload)

    const fileList = Array.from(filesToUpload)
    fileList.forEach(item=>{
      // console.log(item)
      let att = {name: item.name, data: item, url: ""}
      fileData.push(att)
    })
    console.log(fileData)
    setAttachments(fileData)
    
    let request_summary = {...appData.request_summary,["attachments"]:fileData}
    setAppData({...appData, request_summary})

    if(e.target.value !== null){
      e.target.className="form-control text-primary"
    }else{
      e.target.className="form-control text-body-tertiary"
    }
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

  const addSupplier = () =>{
    setPage("Add Supplier")
  }

  const addUnitOfMeasure = () =>{
    console.log("start modal")
  }

  useEffect(()=>{
    getBusinesses()
    getCategories()
    getUnitsOfMeasures()
  },[])

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
          
          <h1 className="text-left mb-3 border-bottom border-5">Add Product</h1>
          
          <div className="d-flex flex-column bg-light border shadow p-3 rounded-2 justify-content-center">
          
          <form name='form' id="form" onSubmit={handleSubmit} className = "form-group" noValidate>
            
            <div className="form-floating mb-3">
              <input id = "product_name" name= "product_name" className="form-control form-control text-primary" onKeyUp={handleChange} placeholder="Provide a product name" required></input>
              <label htmlFor="product_name" className="form-label text-body-tertiary small">Product Name</label>
            </div>
            
            <div className="form-floating mb-3">
              <select 
                id = "supplier" 
                name = "supplier" 
                className="form-select text-primary" 
                placeholder="Select a supplier for this product"
                onChange={handleChange} 
                defaultValue=""
                required>
                <option value="" style={{color: "lightgray"}}></option>
                {businesses.map(item=>(
                  <option className="option light " key={businesses.indexOf(item)+1}>{item}</option>
                ))}
              </select>
              <label htmlFor="supplier" className="form-label text-body-tertiary">Supplier</label>
              <div className="text-secondary small"><img src={addIcon} style={addIconStyle} onClick={(e)=>addSupplier(e)}></img>Add suppplier</div>
            </div>

            <div className="form-floating mb-3">
              <input id = "supplier_part_number" name= "supplier_part_number" className="form-control form-control text-primary" onKeyUp={handleChange} placeholder="Manufacturer part number (e.g., SKU)" required></input>
              <label htmlFor="supplier_part_number" className="form-label text-body-tertiary small">Supplier Part Number or SKU</label>
            </div>

            <div className="form-floating mb-3 has-validation">
              <select 
                ref = {categoryRef}
                id = "category" 
                name="category"
                className="form-select text-primary"
                placeholder = "Select a Category This Product Falls Under" 
                onChange={handleChange}
                required>
                <option value="" style={{color: "lightgray"}}></option>
                {categories.map(item=>(
                  <option className="option light" key={categories.indexOf(item)+1}>{item}</option>
                ))}
              </select>
              <label htmlFor="category" className="form-label text-body-tertiary">Category</label>
            </div>

            <div className="form-floating mb-3 has-validation">
              <select 
                id = "subcategory" 
                name="subcategory"
                className="form-select text-primary"
                placeholder = "Select as subcategory" 
                onChange={handleChange}
                required>
                <option value="" style={{color: "lightgray"}}></option>
                {subcategories.map(item=>(
                  <option className="option light" key={subcategories.indexOf(item)+1}>{item}</option>
                ))}
              </select>
              <label htmlFor="sub_category" className="form-label text-body-tertiary">Subcategory</label>
            </div>

            <div className="form-floating mb-3 has-validation">
              <select 
                id = "unit_of_measure" 
                name="unit_of_measure"
                className="form-select text-primary"
                placeholder = "Select as unit of measure the product is delivered by" 
                onChange={handleChange}
                defaultValue=""
                required>
                <option value="" style={{color: "lightgray"}}></option>
                {unitOfMeasures.map(item=>(
                  <option className="option light" key={unitOfMeasures.indexOf(item)+1}>{item}</option>
                ))}
              </select>
              <label htmlFor="unit_of_measure" className="form-label text-body-tertiary">Unit of Measure</label>
              <div className="text-secondary small"><img src={addIcon} style={addIconStyle} onClick={(e)=>addUnitOfMeasure(e)}></img>Add Unit of Measure</div>
            </div>

            <div className="input-group mb-3">
                <div className="input-group-text">{currencySymbol}</div>
                  <div className="form-floating">
                  <input id = "price" name="price" className="form-control text-primary" type = "number" placeholder="Provide an estimated total cost if known" onKeyUp={handleChange}></input>
                  <label htmlFor="price" className="form-label text-body-tertiary small">Average Price</label>
               </div>
              </div>

            <div className="form-floating mb-3">
              <textarea id="description" name="details" className="form-control form-control text-primary" rows="3" style={{height:"100%"}} onKeyUp={handleChange} placeholder="Provide a detailed description" required></textarea>
              <label htmlFor="description" className="form-label text-body-tertiary small">Provide a detailed description</label>
            </div>

            <div className="form-group mb-3">
                <label htmlFor = "attachments" className="form-label text-body-tertiary small">Attachments</label>
                <input 
                  id="attachments" 
                    name="attachments" 
                    className="form-control text-body-tertiary" 
                    type = "file" 
                    multiple
                    onKeyUp={handleChange} 
                    onChange={(e)=>handleAttachment(e)}
                  ></input>
              </div>

            <div className="d-flex justify-content-center">
              <div className="btn-group">
                <button name= "backButton" className="btn btn-outline-secondary w-25" data-bs-toggle="button">Back</button>
                <button name="nextButton" className="btn btn-primary w-25" data-bs-toggle="button" type="submit">Next</button>
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

export default AddProduct