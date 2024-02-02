import React, {useState, useContext, useEffect, useRef, useLayoutEffect} from 'react'
import {Context} from "./Context.js"
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import { appIcons, generalIcons } from './apis/icons.js';
import MultiInput from './MultiInput.js';
import { getTable, getData, addRecord, getRecords, getValue, filterTable, runFilter, updateActivityLog } from './apis/axios.js';
import CatalogItem from './CatalogItem.js';
import Cart from './Cart.js';
import NewRecordForm from './NewRecordForm.js'

const Catalog = (props) => {

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
    tableName,
    setTableName,
    users,
    setUsers,
    requestTypes,
    setRequestTypes,
    icons,
    apps,
    setApps,
    selectedApp,
    setSelectedApp
  } = useContext(Context)

  // const [formData, setFormData] = useState({})
  const [ads, setAds] = useState([])
  const [highlightedAd, setHighlightedAd] = useState({});

  const [catalogItems, setCatalogItems] = useState([]);
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState("")
  const [subCategories, setSubcategories] = useState([])
  const [starRatings, setStarRatings] = useState([
    `${String.fromCharCode(9733)}`,
    `${String.fromCharCode(9733)}${String.fromCharCode(9733)}`,
    `${String.fromCharCode(9733)}${String.fromCharCode(9733)}${String.fromCharCode(9733)}`,
    `${String.fromCharCode(9733)}${String.fromCharCode(9733)}${String.fromCharCode(9733)}${String.fromCharCode(9733)}`,
    `${String.fromCharCode(9733)}${String.fromCharCode(9733)}${String.fromCharCode(9733)}${String.fromCharCode(9733)}${String.fromCharCode(9733)}`
  ])
  const [orderItems, setOrderItems] = useState([])
  const [cart, setCart] = useState([])
  const [totalAmount, setTotalAmount] = useState("")
  const [totalItems, setTotalItems] = useState("")
  const [orderForm, setOrderForm] = useState({})
  const [orderData, setOrderData] = useState({})
  const [showItems, setShowItems] = useState(true)

  const formName = "new_catalog_order"

  const uploadFilesRef = useRef()

  const getAds = async (req, res)=>{
    try{
        const response = await getTable("ads")
        if(response.data.length>0){
          setAds(response.data)
          setHighlightedAd(response.data[0]);
        }
    }catch(error){
        // console.log(error)
        setAds([])
    }
  }

  const getCatalogItems = async (req, res)=>{
    try{
      const response = await getTable("catalog_items")
      if(response.data.length>0){
        let catalogData = response.data
        setCatalogItems(catalogData)
        setUpOrderItems(catalogData)
        getFilterLists(catalogData)      
      }
    }catch(error){
        // console.log(error)
        setCatalogItems([])
    }
  }

  const setUpOrderItems = (catalogItems)=>{
    let orderItemsWithQuantity = []
      catalogItems.map(item=>{
        orderItemsWithQuantity.push({...item,...{["quantity"]:0},...{["item_amount"]:0}})
      })
      setOrderItems(orderItemsWithQuantity)
  }

  const getFilterLists = (catalogData)=>{

    if (catalogData.length>0){
      let categorySet = new Set()
      catalogData.map(row=>{
          categorySet.add(row["category"])
      })
      let categoryList = [...categorySet]
      setCategories(categoryList.sort())

      let subCategorySet = new Set()
      catalogData.map(row=>{
        subCategorySet.add(row["subcategory"])
      })
      let subcategoryList = [...subCategorySet]
      setSubcategories(subcategoryList.sort())

      let supplierSet = new Set()
      catalogData.map(row=>{
        supplierSet.add(row["supplier"])
      })
      let supplierList = [...supplierSet]
      setSuppliers(supplierList.sort())
    }
  }


  const [facilities, setFacilities] = useState([])
  const getFacilitiyData = async(req, res)=>{
    const response = await getTable('facilities')
    setFacilities(response.data)
  }
  
  useEffect(()=>{
    getAds()
    getCatalogItems()
    getFacilitiyData()
},[])


  // const handleSelect=(e)=>{
  //   const seletectedRequest=e.target.id
  //   const selectedRequestData = requestTypes.filter(x=>x.name===seletectedRequest)[0]
  //   setRequestType(selectedRequestData)

  //   let new_data = {
  //     requester: user,
  //     request_type: selectedRequestData.name
  //   }
    
  //   let formData = {...appData[`${page.data}`],...new_data}
  //   setAppData({...appData,[`${page.data}`]:formData})
    
  //   const nextPage = seletectedRequest
  //   setPage(pages.filter(x=>x.name===nextPage)[0])
  //   setPageList([...pageList,nextPage])
  //   setPageName(nextPage)
  // }

  const handleAddToCart = (item)=>{
  
    let updatedCart = cart
    if(cart.find(record=>record.id===item.id)){
      let indexToUpdate = updatedCart.indexOf(updatedCart.find(record=>record.id===item.id))
      if(updatedCart[indexToUpdate].quantity == item.quantity){
        alert("This item is already in the cart. Please update quantity or add another item.")
      }else if(updatedCart[indexToUpdate].quantity <=0){
        alert("Please provide valid quantity")
      }else{
        updatedCart[indexToUpdate] = item
      }
    }else{
      updatedCart = [...cart,item]
    }

    let total = 0;
    let suppliers=[]
    updatedCart.forEach((item, index) => {
      total = (Number(total) + Number(item.item_amount)).toFixed(2);
      suppliers.push(`${item.supplier} `)
    });
    suppliers = suppliers.toString()
    setTotalAmount(total)
    setCart(prevCart => updatedCart)
    setTotalItems(updatedCart.length)
    setSuppliers(suppliers);

    console.log(updatedCart)

    setOrderData(prevOrderForm => ({
      ...orderData,
        ["number_of_items"]: updatedCart.length,
        ["total_amount"]: total,
        ['suppliers']: suppliers,
        ['items']: updatedCart
    }));
  }

  const handleSelectedAd =(adId)=>{
    console.log(adId)
    const supplierWebsite = ads.filter(ad=>ad.id===adId)[0].supplier_website

    if (adId>0){
      setAppData({...appData,...{["selected_ad_id"]:adId}})
      // window.location.href = `https://${ads[adId].supplier_website}`
      const externalSiteURL = `https://${supplierWebsite}`
      const windowFeatures = 'width=800,height=600,resizable,scrollbars=yes';
  
      // Open the new window
      window.open(externalSiteURL, '_blank', windowFeatures);
    }
  }
  

 // Effect to rotate images at equal intervals
 useEffect(() => {
    let intervalId;
    if (ads.length > 0) {
      let index = 0;
  
      const rotateImages = () => {
        index = (index + 1) % ads.length; // Increment index and reset to 0 when reaching the end  
        setHighlightedAd(ads[index]);
      };

      // Set an interval to rotate images at 3-second intervals
      intervalId = setInterval(rotateImages, 3000);
    }

    // Clean up the interval when the component unmounts or when newsData changes
    return () => clearInterval(intervalId);
  }, [ads]);



  // Update filter parameters
  const[filterConditions, setFilterConditions] = useState([
    {form_name:"category", db_name:"category", condition: "=", value:"", get db_value(){return this.value}},
    {form_name:"subcategory", db_name:"subcategory",condition: "=", value:"", get db_value(){return this.value}},
    {form_name:"supplier", db_name:"supplier", condition: "=", value:"", get db_value(){return this.value}},
    {form_name:"low_price", db_name:"price", condition: ">=", value: "", get db_value(){return parseFloat(this.value)}},
    {form_name:"high_price", db_name:"price", condition: "<=", value:"", get db_value(){return parseFloat(this.value)}},
    {form_name:"star_rating", db_name:"rating", condition: ">=", value:"", get db_value(){return Number((this.value).length)}},
    {form_name:"quantity_in_stock", db_name:"quantity_in_stock", condition: ">=", value:"", get db_value(){return Number(this.value)}},
    {form_name:"lead_time", db_name:"lead_time", condition: "<=", value:"", get db_value(){return Number(this.value)}}
  ])

  const handleFilterChange = async (e)=>{

    const {name, value} = e.target

    console.log(filterConditions)
    let updatedFilterConditions = filterConditions
    updatedFilterConditions.filter(obj => obj.form_name == name)[0].value = value ;
    setFilterConditions(updatedFilterConditions)

    const tableName = "catalog_items"
    const filterList = updatedFilterConditions.filter(item=>item.value!="")
    console.log(filterList)
    const response = await runFilter(tableName,filterList)
    const filteredData = response.data
    console.log(filteredData)
    setUpOrderItems(filteredData)
  }

  // const runFilter = async (tableName,updatedFilterConditions) =>{

  //     let filterString = "" 
  //     let filteredList = updatedFilterConditions.filter(item=>item.value!="")
  //     console.log(filteredList)
  //     const numberOfFilters = filteredList.length
  //     console.log(numberOfFilters)

  //     filteredList.map((item,index)=>{  
  //       if(item.value.length !=0 || item.value !=""){
  //           let conditionString = `"${item.db_name}"${item.condition}'${item.db_value}'`
  //           console.log(index)
  //           if(index == 0 || index < numberOfFilters-1){
  //             filterString = `${filterString}${conditionString}`
  //           }else{
  //             filterString = `${filterString} and ${conditionString}`
  //           }
  //       }      
  //     })
  //     let query = ""      
  //     if(filterString.length>0 && filterString !=""){
  //       query = `SELECT * FROM ${tableName} WHERE ${filterString};`
  //       console.log(query)
  //     }else{
  //       query = `SELECT * FROM ${tableName};`
  //       console.log(query)
  //     }
  // }
        
    

  const [checkoutWindow, setCheckoutWindow] = useState(false)
  const [orderSummaryWindow, setOrderSummaryWindow] = useState(false)
  
  const handleSubmitOrder = async(req, res)=>{

    console.log(orderData)

    const uploadAttachments = async () => {
      if (uploadFilesRef.current) {
        // Call the uploadfiles function in the newRecordForm  component
        const result = await uploadFilesRef.current()
        return(result)
      }
    }
    const updatedFormData = await uploadAttachments()
    console.log(updatedFormData)
    
    let dbData = await {...updatedFormData.formDataWithAttachments,...orderData}
    console.log(dbData)

    Object.keys(dbData).forEach(key=>{
      if(typeof dbData[key] =="object" || Array.isArray(dbData[key])){
          dbData[key] = JSON.stringify(dbData[key]).replace(/'/g, " ")
      }
    })
    
    console.log(dbData)

    const addRecordResponse = await addRecord("orders",dbData)
    console.log(addRecordResponse)
    
    console.log(user)
    const recordId = await addRecordResponse.id
    updateActivityLog("orders", recordId, user, "New record created")

    setOrderData(prevOrderData => ({...prevOrderData,...dbData}));
    setCheckoutWindow(false)
    setOrderSummaryWindow(true)

  }

  const handleCheckOut = ()=>{
    setCheckoutWindow(true)
  }

  const handleReviewOrders=(e)=>{
    setOrderSummaryWindow(false)
    resetCart()
    setSelectedApp("orders")
    setTableName("orders")
    let nextPage = "Records"
    setPageList([nextPage])
    setPage(pages.filter(x=>x.name===nextPage)[0])
    setPageName(nextPage)
  }

  
  const resetCart= ()=>{
    setCart([])
    setTotalAmount("")
    setTotalItems("")
    setOrderForm({})
    setCheckoutWindow(false)
    setOrderSummaryWindow(false)
    setShowItems(false)
    setTimeout(()=>{setShowItems(true)},10)
    setUpOrderItems(catalogItems)
  }

  const handleOrderAgain=(e)=>{
    resetCart()
  }

  const bannerRef = useRef()
  const [bannerWidth, setBannerWidth] = useState("100%")
  const [contentWidth, setContentWidth] = useState("100%")
  useEffect(()=>{
    if(showAdds){
      setBannerWidth(bannerRef.current.clientWidth)
    }
  },[bannerRef, ads])


  useEffect(()=>{
    setContentWidth(bannerWidth)
  },[bannerWidth])


  const iconStyle={
    maxHeight: 30,
    maxWidth: 30,
    cursor: "pointer"
  }
  
  const cartInputStyle={
    border: "1px solid lightgray",
    maxWidth: "50px",
    outline: "none",
    textAlign: 'right',
    color: 'blue',
    borderRadius: "5px"
  }

  const cartCellStyle={
    textAlign: 'right'
  }


  // This segment auto sizes the content height according to the window height

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const contentContainerRef = useRef();
    const [contentContainerHeight, setContentContainerHeight] = useState('');
    
    const itemsContainerRef = useRef()
    const [itemsContainerWidth, setItemsContainerWidth] = useState("80%")
    useEffect(()=>{
      setItemsContainerWidth(itemsContainerRef.current.clientWidth)
    },[itemsContainerRef])
  
    const checkoutWindowRef = useRef()
    const [checkoutWindowWidth, setCheckoutWindowWidth] = useState(windowWidth*0.75)
    const [checkoutWindowLeft, setCheckoutWindowLeft] = useState(Number(windowWidth)/2-Number(checkoutWindowWidth)/2)
    useEffect(()=>{
      setCheckoutWindowWidth(windowWidth*0.75)
      setCheckoutWindowLeft(Number(windowWidth)/2-Number(checkoutWindowWidth)/2)
    },[windowWidth,checkoutWindowRef])

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    };
    
    const handleContainerResize = () => {
      if (contentContainerRef.current) {
        const { top } = contentContainerRef.current.getBoundingClientRect();
        setContentContainerHeight(windowHeight - top);
      }
    };

    useEffect(() => {
    
      // Listen for window resize events
      window.addEventListener('resize', handleResize);

      handleResize()
      handleContainerResize()
  
      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    useLayoutEffect(() => {

      // Recalculate container height on window resize
      window.addEventListener('resize', handleContainerResize);

      handleResize()
  
      // Call initially to calculate height after render
      handleContainerResize(); 
  
      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleContainerResize);
      };
    }, [windowHeight, contentContainerRef]);


const [pageClass, setPageClass] = useState("flex-container animate__animated animate__fadeIn animate__duration-0.5s p-3")

const modalBackdropStyle= {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0, 0, 0, 0.5)",
}

const [showAdds,setShowAdds] = useState(false)

return(
    <div className={pageClass} style={{width: "100%", overflowX: "hidden"}}>
        
      {/* Ad Container */}
      {showAdds &&
      <div className="d-flex justify-content-center mb-3" style={{width:"100%"}}>
        <div ref={bannerRef} className="carousel p-0 border border-1 rounded-3 bg-white shadow justify-content-center" 
        style={{width:"100%", height:"auto", overflowY: "hidden", cursor: "pointer"}}>
            {ads.length > 0 && (
                <img
                    src={highlightedAd.image_url}
                    alt={highlightedAd.headline}
                    className={highlightedAd}
                    style={{ width: "100%", height: "auto", cursor: "pointer"}}
                    onClick={(e)=>handleSelectedAd(highlightedAd.id)}
                />
            )}
        </div>
      </div>
      }

      <div ref={contentContainerRef} className="d-flex justify-content-center" style={{width: "100%", height:contentContainerHeight}}>
        <div className="d-flex flex-column" style={{width: "100%", height:"100%", overflowY:"hidden"}}>
            {/* Filter container */}
            <div 
              className="d-flex justify-content-center bg-light border border-1 rounded-3 shadow mb-3 p-3"
              style={{width: "100%", fontSize: "12px"}}
              > 
                  <div className="d-flex m-2">
                      <img src={`${generalIcons}/filter_icon.png`}  style={{...iconStyle,...{['marginTop']:"15px"}}} alt="Shopping Cart Icon"></img>
                  </div>
                  <div className="d-flex flex-column m-2" style={{width:"200px"}}>
                      <span style={{color: "gray"}}>Category</span>
                      <MultiInput id="category" name="category" value={filterConditions.filter(o=>o.form_name==="category")[0].value} valueColor="#5B9BD5" valueSize="12px" valueWeight="bold" list={categories} onChange={(e)=>handleFilterChange(e)}/>
                  </div>

                  <div className="d-flex flex-column m-2" style={{width:"200px"}}>
                      <span style={{color: "gray"}}>Subcategory</span>
                      <MultiInput id="subcategory" name="subcategory" value={filterConditions.filter(o=>o.form_name==="subcategory")[0].value} valueColor="#5B9BD5" valueSize="12px" valueWeight="bold" list={subCategories} onChange={(e)=>handleFilterChange(e)}/>
                  </div>

                  <div className="d-flex flex-column m-2" style={{width:"200px"}}>
                      <span style={{color: "gray"}}>Supplier</span>
                      <MultiInput id="supplier" name="supplier" value={filterConditions.filter(o=>o.form_name==="supplier")[0].value}  valueColor="#5B9BD5" valueSize="12px" valueWeight="bold" list={suppliers} onChange={(e)=>handleFilterChange(e)}/>
                  </div>

                  <div className="d-flex flex-column ms-2 me-2">
                    <span className="ps-2" style={{color: "gray"}}>Price</span> 
                    <div className="d-flex justify-content-between border border-1 rounded-3 p-1">
                        
                        <span className="d-flex justify-content-between m-2" style={{color: "gray", width:"150px"}}>
                        <span style={{color: "gray", margin: "6px"}}>Low: </span> 
                          <MultiInput id="low_price" name="low_price" type="number" value={filterConditions.filter(o=>o.form_name==="low_price")[0].value} valueColor="#5B9BD5" valueSize="12px" valueWeight="bold" onChange={(e)=>handleFilterChange(e)}/>  
                        </span>
                        
                        <span className="d-flex justify-content-between m-2" style={{color: "gray", width:"150px"}}>
                          <span style={{color: "gray", margin: "6px"}}>High: </span> 
                          <MultiInput id="high_price" name="high_price" type="number" value={filterConditions.filter(o=>o.form_name==="high_price")[0].value} valueColor="#5B9BD5" valueSize="12px" valueWeight="bold" onChange={(e)=>handleFilterChange(e)}/>
                        </span>
                    
                    </div>
                  </div>

                  <div className="d-flex flex-column m-2" style={{width: "150px"}}>
                      <span style={{color: "gray"}}>Minimm Rating</span> 
                      <MultiInput id="star_rating" name="star_rating" list={starRatings} value={filterConditions.filter(o=>o.form_name==="star_rating")[0].value} valueColor="orange" valueSize="12px" valueWeight="bold" onChange={(e)=>handleFilterChange(e)}/>
                  </div>

                  <div className="d-flex flex-column m-2" style={{width: "150px"}}>
                      <span style={{color: "gray"}}>Quantity In Stock</span> 
                      <MultiInput id="quantity_in_stock" name="quantity_in_stock" value={filterConditions.filter(o=>o.form_name==="quantity_in_stock")[0].value} type="number" valueColor="#5B9BD5" valueSize="12px" valueWeight="bold" onChange={(e)=>handleFilterChange(e)}/>
                  </div>

                  <div className="d-flex flex-column m-2" style={{width: "150px"}}>
                      <span style={{color: "gray"}}>Lead Time (Days)</span> 
                      <MultiInput id="lead_time" name="lead_time" value={filterConditions.filter(o=>o.form_name==="lead_time")[0].value} valueColor="#5B9BD5" type="number" valueSize="12px" valueWeight="bold" onChange={(e)=>handleFilterChange(e)}/>
                  </div>
              
            </div>
            
            {/* Contents container */}
            <div className="d-flex justify-content-between" style={{width: "100%", height:"100%", overflowY:"hidden"}}>
              
              {/* Catalog Items */}
              <div 
                ref={itemsContainerRef}
                className="d-flex w-100 p-3 justify-content-around bg-light border border-1 rounded-3 shadow flex-wrap"
                style={{fontSize: "12px", height:"auto", minWidth: "300px", overflowY:"auto"}}
                > 
                
                {showItems && orderItems.length>0 ?
                  orderItems.map((item,index)=>(
                    <CatalogItem
                      key={item.id}
                      item = {item}
                      id = {item.id}
                      name={item.name}
                      quantity = {item.quantity}
                      cart = {cart}
                      handleAddToCart = {handleAddToCart}                 
                    />
                  ))
                  :
                  <div className="d-flex text-center text-secondary mt-5"><h3>No items available. Please adjust filter criteria</h3></div>
                }
              </div>

              {/* cart */}
              <div className="d-flex flex-column bg-light border border-1 rounded-3 shadow ms-3 p-3" style={{width: "30%", minWidth: "400px", height:contentContainerHeight, overflowY:"auto"}}>
                <Cart
                  cart = {cart}
                  setCart = {setCart}
                  totalItems = {totalItems}
                  totalAmount = {totalAmount}
                  handleCheckOut = {handleCheckOut}
                />
              </div>

            </div>
        </div>
      </div>
      
      {checkoutWindow && <div style={modalBackdropStyle}></div>}
      {checkoutWindow && 
        <div 
          ref={checkoutWindowRef}
          className="d-flex flex-column position-absolute border border-5 rounded-3 shadow bg-light" 
          style={{width:checkoutWindowWidth, height:"80vh", overflow: "hidden", left: Number(windowWidth)/2 - checkoutWindowWidth/2, top: 100}}
          >
               <div className="d-flex justify-content-end p-1" style={{backgroundColor: "rgb(50,100,255"}}>
                <img src={`${appIcons}/close_icon.png`} style={iconStyle} onClick={(e)=>setCheckoutWindow(false)}></img>
              </div>
              {cart.length>0 ?
              <div className="d-flex flex-column p-3">
                
                  <div className="d-flex justify-content-between mb-3 p-1">
                  <h4>Please review your order</h4>
                    <button className="btn btn-primary" onClick={(e)=>handleSubmitOrder()}>Submit</button>
                  </div>
                  <div className="d-flex p-1">
                    
                    <div className="d-flex w-50">
                      <NewRecordForm 
                        setUploadFilesRef={(ref) => (uploadFilesRef.current = ref)}
                        formName = {formName}
                        initialFormData = {orderForm}
                        appData = {{user: appData.user_info}}
                        updateParent = {setOrderForm}
                      />
                    </div>
                    <div className="d-flex flex-column w-50 p-2" style={{height: "", overflowY: "auto"}}>
                    
                      <table className="table table-striped table-white table-border p-0" style={{fontSize:"12px"}}>
                        <thead>
                            <tr className="fw-bold text-center">
                                <td>Item</td>
                                <td>Price</td>
                                <td>Quantity</td>
                                <td>Amount</td>
                              </tr>
                        </thead>
                      <tbody>
                      {cart.map((item,index)=>(
                            <tr>
                                <td >{item.item_name}</td>
                                <td style={cartCellStyle}>${Number(item.price).toLocaleString('en-US')}</td>
                                <td style={cartCellStyle}>{Number(item.quantity).toLocaleString('en-US')}</td>
                                <td style={cartCellStyle}>${Number(item.item_amount).toLocaleString('en-US')}</td>
                              </tr>
                      ))}
                        <tr className="fw-bold" style={{borderTop:"2px solid gray"}}>
                          <td colSpan="3">Grand Total</td>
                          <td className="text-end">${Number(totalAmount).toLocaleString('en-US')}</td>
                        </tr>
                      </tbody>
                      </table>
                    </div>
                  </div>   

                </div>
                :
                <div className="d-flex justify-content-center align-items-center" style={{color: "gray", height:"100%"}}>
                  <h3 className="text-center">Nothing in cart</h3>
                </div>
            }
        </div>
      }

{orderSummaryWindow && 
        <div 
          className="d-flex flex-column position-absolute border border-5 rounded-3 shadow bg-light" 
          style={{height: "auto", minHeight:"300px", overflow: "hidden", width:"800px", left: windowWidth/2-250, top: windowHeight/2-250}}
          >
              <div className="d-flex w-100 justify-content-end mb-3" style={{borderBottom: "1px solid lightgray"}}>
                <img src={`${appIcons}/close_icon.png`} style={iconStyle} onClick={(e)=>setCheckoutWindow(false)}></img>
              </div>
              <div className="d-flex flex-column p-3">
                <div className="text-center text-success fw-bold" style={{fontSize:"20px"}}>{`${String.fromCharCode(9989)} Order submitted`}</div>
                  <div className="d-flex justify-content-center mt-3">
                    <button className="btn btn-primary m-1" onClick={(e)=>handleReviewOrders(e)}>Review Orders</button>
                    <button className="btn btn-primary m-1" onClick={(e)=>handleOrderAgain(e)}>Another Order</button>
                    <button className="btn btn-secondary m-1" onClick={(e)=>resetCart(e)}>Exit</button>
                  </div>
                </div>
        </div>
      }
    </div>
)
}

export default Catalog