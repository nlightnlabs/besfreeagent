import React, {useState, useEffect, useContext, useRef, createRef} from 'react'
import { Context } from "./Context.js"
import {getTable} from './apis/axios.js'
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import SuperInput from './SuperInput.js'

const SoftwareAccess = () => {

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
  getProducts()
  initializeUsers()
},[])

  let formData = {}
  const productRef = useRef()
  const supplierRef = useRef()

  const [productData, setProductData] = useState([])
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [currencySymbol, setCurrencySymbol] = useState("$")

  const [formClassList, setFormClassList] = useState("form-group")

  const [softwareUsers, setSoftwareUsers] = useState([
    {name: "", email:""},
    {name: "", email:""},
    {name: "", email:""}
  ])

  const initializeUsers = ()=>{
    console.log("initialize users check")
    let x = JSON.stringify(Object.values(appData))
    if(x.search("software_users")>0){
      console.log("software_users found")
      setSoftwareUsers(appData[page.data]["software_users"])
    }
  }

  const usernameRefs = useRef([]);
  usernameRefs.current = softwareUsers.map(
      (ref, index) =>   usernameRefs.current[index] = createRef(index)
    )


  const getProducts = async ()=>{
    const response = await getTable('products')
    const data = await response.data
    setProductData(data)

    let productSet = new Set()
      await data.forEach(item=>{
        productSet.add(item.product_name)
      })
      
      let productList = [...productSet]
      setProducts(productList.sort())

      let supplierSet = new Set()
      await data.forEach(item=>{
        supplierSet.add(item.supplier)
      })

      let supplierList = [...supplierSet]
      setSuppliers(supplierList.sort())
  }

  const handleChange = (e)=>{
    const {name, value} = e.target
    let new_data = {[name]: value}
    formData = {...appData[`${page.data}`],...new_data}
    setInitialFormData(formData)
    setAppData({...appData,[`${page.data}`]:formData})

    if(name=="product" && value !==""){

      const supplier = productData.filter(x=>x.product_name===value)[0].supplier
      console.log(supplier)

      let new_data = {["supplier"]: supplier}
      formData = {...appData[`${page.data}`],...new_data}
      setInitialFormData(formData)
      setAppData({...appData,[`${page.data}`]:formData})
    }
  }

  let userData = softwareUsers
  const handleUserInput = (e, index)=>{
    let {name, value} = e.target
    if(name.search("name")>0){
      name = "name"
    }else if(e.target.id.search("email")>0)(
      name = "email"
    )
    let new_data = {[name]: value}
    userData[index] =  {...userData[index],...new_data}
    console.log(userData)
    setSoftwareUsers(userData)
    let request_details = {...appData[`${page.data}`],["software_users"]:userData}
    setAppData({...appData, request_details})
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
          alert(nextPage)
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

  const addSupplier = () =>{
    let nextPage = "Add Business"
    setPage(pages.filter(x=>x.name===nextPage)[0])
    setPageList([...pageList,nextPage])
    setPageName(nextPage)
  }

  const addProduct = () =>{
    let nextPage = "Add Product"
    setPage(pages.filter(x=>x.name===nextPage)[0])
    setPageList([...pageList,nextPage])
    setPageName(nextPage)
  }


  const addUser = () =>{
    const newRow={name:"",email:""}
    setSoftwareUsers([...softwareUsers,newRow])
  }

  const removeUser = (e, index) =>{
    if(index>0){
      setSoftwareUsers(
        softwareUsers.filter(user => softwareUsers.indexOf(user) !== index)
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
  const pageClass = "flex-container animate__animated animate__fadeIn animate__duration-0.5s"
  

  const contentContainerRef = useRef()
  const [contentContainerTop,setContentContainerTop] = useState("")
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(()=>{
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    // Listen for window resize events
    window.addEventListener('resize', handleResize);
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  },[])

  useEffect(()=> {
    if (contentContainerRef.current) {
      const { top } = contentContainerRef.current.getBoundingClientRect();
      setContentContainerTop(top)
      
    }
  },[contentContainerRef])

  return (
    <div className = {pageClass} style={{height:"100%", overflow:"hidden"}}>
      
      <div className="row" style={{height:"100%", overFlow: "hidden"}}>
        <div className="d-none d-lg-inline-flex col-lg-3" style={{height:"100%"}}></div>

        <div className="col-12 col-lg-6" style={{height: "100%"}}>
          
          <div className="text-left mb-3 border-bottom border-5" style={{fontSize:"32px"}}>{pageName} Request</div>
          
          <form style={{height: "100%", overflowY:"auto"}}
            name='form' id="form" 
            onSubmit={handleSubmit} 
            className="d-flex flex-column bg-light border shadow rounded-3 p-3 mb-3" 
            noValidate>
            
            {/* Button Group */}
            <div className="d-flex justify-content-center mb-3">
              <div className="d-flex w-100 justify-content-between">
                <button name= "backButton" className="btn btn-outline-secondary" style={{width:"100px"}} data-bs-toggle="button" type="submit">Back</button>
                <button name="nextButton" className="btn btn-primary" style={{width:"100px"}} data-bs-toggle="button" type="submit">Next</button>
              </div>
            </div>
            
            {/* Form inputs */}
            <div className="d-flex flex-column mt-2" ref={contentContainerRef} style={{height: windowHeight-contentContainerTop-50, overflowY:"auto"}}>
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
                <label htmlFor="subject" className="form-label text-body-tertiary small">Summarize what you need</label>
              </div>

              <div className="form-floating mb-3">
                <SuperInput
                  key={productRef}
                  id = "product" 
                  name="product"
                  list={products}
                  value={initialFormData.product}
                  valueColor="#2C7BFF"
                  onChange={handleChange} 
                  label={"Select a preferred supplier if known"}
                  required={true}
                  />
                <div className="text-secondary small"><img src={addIcon} style={addIconStyle} onClick={(e)=>addProduct(e)}></img>Add product</div>
              </div>

              <div className="form-floating mb-3">
                <SuperInput
                  key={supplierRef}
                  id = "supplier" 
                  name = "supplier" 
                  list={suppliers}
                  value={initialFormData.supplier}
                  valueColor="#2C7BFF"
                  onChange={handleChange} 
                  label={"Select a preferred supplier if known"}
                  required={true}
                  />
                <div className="text-secondary small"><img src={addIcon} style={addIconStyle} onClick={(e)=>addSupplier(e)}></img>Add supplier</div>
              </div>

              <div className="form-group mb-3">

              <h5>List the users that need access</h5>
                <table className="table w-100 border rounded rounded-2">
                  <thead>
                    <tr className="text-center text-small">
                      <th>Full Name</th>
                      <th>Email</th>
                      <th></th>
                    </tr>
                    <tr className="table-group-divider"></tr>
                  </thead>
                  <tbody className="table-group-divider text-small">
                    {softwareUsers.map((user, index)=>(
                      <tr key={index} id={`user_${index}`} ref={usernameRefs.current[index]}>
                        <td><input id={`user_${index}_name`} name={`user_${index}_name`} className="form-control text-primary" onChange={(e)=>handleUserInput(e, index)} value={softwareUsers[index].name}{...inputRequired(index)}></input></td>
                        <td><input id={`user_${index}_email`} name={`user_${index}_email`} className="form-control text-primary" type="email" onChange={(e)=>handleUserInput(e, index)} value={softwareUsers[index].email} {...inputRequired(index)}></input></td>
                        <td id={`remove_user_${index}`} className="small bg-second"><img src={removeIcon} style={removeIconStyle} onClick={(e)=>removeUser(e, index)}></img></td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="2" className="small bg-second" style={{background:"none"}}><img src={addIcon} style={addIconStyle} onClick={(e)=>addUser(e)}></img>Add user</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </form>
      
        </div>
        
        <div className="d-none d-lg-inline-flex col-lg-3" style={{height:"100%"}}></div>
      </div>
    </div>
  )
}

export default SoftwareAccess