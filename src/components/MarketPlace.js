import React, {useState, useEffect, useContext} from 'react'
import {Context } from './Context.js';
import "bootstrap/dist/css/bootstrap.min.css"
import * as crud from "./apis/crud.js"
import Cart from "./Cart.js"
import Filter from "./Filter.js"
import CatalogItem from "./CatalogItem.js"
import OrderForm from "./OrderForm.js"
import FloatingPanel from "./FloatingPanel.js"
import Spinner from './Spinner.js'


function MarketPlace() {

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
    attachments,
    setAttachments,
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
    setCurrencySymbol
  } = useContext(Context)

  // const [appData, setAppData] = useState({
  //   user:user,
  //   users:{},
  //   employees:{},
  //   icons: appIcons,
  //   facilities:{},
  //   businessUnits:{},
  //   countries:{},
  //   businesses:{},
  //   filterCriteria:[],
  //   filteredItems: [],
  //   totalAmount:0,
  //   totalItems:0,
  //   appHomePage:"",
  //   cart:[],
  //   catalogItems:[],
  //   items:[],
  //   currencySymbol: "$",
  //   iconButtonStyle: {height: "30px", width: "30px", cursor: "pointer"}
  // });

  // Set up local states for this app
  const windowSize = useState({width: window.innerWidth, height: window.innerHeight});
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [cart, setCart] = useState([])
  const [items, setItems] = useState([])
  const [filterCriteria, setFilterCriteria] = useState([])
  const [position, setPosition] = useState({ x: 0.5*window.innerWidth, y: 0.5*window.innerHeight });
  const [loading,setLoading] = useState(false)
  const [filteredItems, setFilteredItems] = useState([])

//   const getEmployeeData = async () => { 
//     const environment = window.environment
//     let appName = ""
//     if(environment =="freeagent"){
//       appName = "custom_app_35"
//     }else{
//       appName = "users" 
//     }
//     const data = await crud.getData(appName)
  
//     let fieldSet = new Set()
//     data.map(item=>{
//       fieldSet.add(item.full_name)
//     })
//     let fieldList = Array.from(fieldSet).sort();
//     let result = { data: data, list: fieldList};
  
//     setAppData(prevAppData => ({
//       ...prevAppData,
//       employees: result
//     }));
//   };


//   const getUserData = async () => {

//     let fieldSet = new Set()
//     users.map(item=>{
//       fieldSet.add(item.full_name)
//     })
//     let fieldList = Array.from(fieldSet).sort();
//     let result = { data: users, list: fieldList};
 
//     setAppData(prevAppData => ({
//       ...prevAppData,
//       user: user,
//       users: result
//     }));
// };

// const getCurrencies = async ()=>{
//   const environment = window.environment

//   let appName = ""
//   if(environment =="freeagent"){
//     appName = "custom_app_10"
//   }else{
//     appName = "countries" 
//   }
//   const data = await crud.getData(appName)

//   setAppData(prevAppData => ({
//     ...prevAppData,
//     countries: data
//   }));
// }

// const getBusinessUnits = async ()=>{

//   const environment = window.environment

//   let appName = ""
//   if(environment =="freeagent"){
//     appName = "business_unit"
//   }else{
//     appName = "business_units" 
//   }
//   const data = await crud.getData(appName)

//   let fieldSet = new Set()
//   data.map(item=>{
//     fieldSet.add(item.name)
//   })
//   let fieldList = Array.from(fieldSet).sort();
//   let result = { data: data, list: fieldList};

//   setAppData(prevAppData => ({
//     ...prevAppData,
//     businessUnits: result
//   }));

// }
    
// const getFacilities = async ()=>{
//   const environment = window.environment

//   let appName = ""
//   if(environment =="freeagent"){
//     appName = "custom_app_51"
//   }else{
//     appName = "facilities" 
//   }
//   const data = await crud.getData(appName)

//   let fieldSet = new Set()
//   data.map(item=>{
//     fieldSet.add(item.name)
//   })
//   let fieldList = Array.from(fieldSet).sort();
//   let result = { data: data, list: fieldList};

//   setAppData(prevAppData => ({
//     ...prevAppData,
//     facilities: result
//   }));
// }

// const getBusinesses = async ()=>{
//   const environment = window.environment

//   let appName = ""
//   if(environment =="freeagent"){
//     appName = "custom_app_44"
//   }else{
//     appName = "businesses" 
//   }
//   const data = await crud.getData(appName)

//   let fieldSet = new Set()
//   data.map(item=>{
//     fieldSet.add(item.company_name)
//   })
//   let fieldList = Array.from(fieldSet).sort();
//   let result = { data: data, list: fieldList};

//   setAppData(prevAppData => ({
//     ...prevAppData,
//     businesses: result
//   }));
// }



const setupFilters = async (data)=>{
  let items = data
  const createListFromTableData = (tableData, fieldName)=>{
    if(tableData.length>0 && fieldName !=null && fieldName !=""){
      let set = new Set()
      tableData.map(item=>{
        set.add(item[fieldName])
        })
      let list = Array.from(set)
      return list.sort()
    }
  }
  const filterData = [
    {id: 1, name: "category", label: "Category", reference_data_name:"category", operator:"===", value:"", data_type: "text", convertedValue: (value)=>{return value.toString();}, list: createListFromTableData(items, "category"), color:"rgb(0,0,0)", width:200},
    {id: 2, name: "subcategory", label: "Subcategory", reference_data_name:"subcategory", operator:"===", data_type: "text",value:"",convertedValue: (value)=>{return value.toString();}, list:createListFromTableData(items, "subcategory"), color:"rgb(0,0,0)", width:200},
    {id: 3, name: "supplier", label: "Supplier", reference_data_name:"supplier", operator:"===", data_type: "text",value:"", convertedValue: (value)=>{return value.toString();}, list:createListFromTableData(items, "supplier"), color:"rgb(0,0,0)", width:200},
    {id: 4, name: "min_price",label: "Min Price", reference_data_name:"price", operator:">=", data_type: "number",value:"", convertedValue: (value)=>{return Number(value);},list: null, filterList: null, color:"rgb(0,0,0)", width:100},
    {id: 5, name: "max_price", label: "Max Price", reference_data_name:"price", operator:"<=", data_type: "number",value:"",convertedValue: (value)=>{return Number(value);},  formlistList: null, filterList: null, color:"rgb(0,0,0)", width:100},
    {id: 6, name: "rating", label: "Min Rating", reference_data_name:"rating", operator:">=",data_type: "number", value:"",  convertedValue: (value)=>{return Number(value.toString().length);},list:createListFromTableData(items, "star_rating"),color:"rgb(255,200,0)", width:150},
    {id: 7, name: "quantity_in_stock", label: "Min Qty in Stock", reference_data_name:"quantity_in_stock", data_type: "number",value:"", convertedValue: (value)=>{return Number(value);}, operator:">=",  list:null, filterList:null,color:"rgb(0,0,0)", width:150},
    {id: 8, name: "lead_time", label: "Max Lead Time", reference_data_name:"lead_time", operator:"<=", data_type: "number",value:"", convertedValue: (value)=>{return Number(value);},list:null, filterList:null,color:"rgb(0,0,0)", width:150},
  ]
  setFilterCriteria(filterData)
  setAppData(prevAppData => ({
    ...prevAppData,
    filterCriteria: filterData
  }));
}


const getCatalogItems = async ()=>{

  const environment = window.environment

  let appName = ""
  if(environment =="freeagent"){
    appName = "custom_app_22"
  }else{
    appName = "catalog_items" 
  }
  const data = await crud.getData(appName)
  console.log(`data retreived from ${environment} api: `, data)
  setAppData(prev=>({...prev,catalogItems:data}))

  let items = []
  data.map(item=>{
    items.push({...item,...{["quantity"]:""},...{["item_amount"]:""}})
  })

  setFilteredItems(data) 

  setAppData(prev=>({...prev,items:items}))
  setItems(items);  
  
  setupFilters(data) 
}


  ///Run function to get initial data
  useEffect(() => {
    const environment = window.environment 

    const loadData = async () => {
      try {
        await getCatalogItems();
        // await getEmployeeData();
        // await getUserData();
        // await getCurrencies();
        // await getBusinessUnits();
        // await getFacilities();
        // await getBusinesses();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    if(environment !="freeagent"){
      loadData()
    }else{
      setTimeout(()=>{
        loadData()
      },100)
    }
  }, []);
  

  const addToCart = (item)=>{ 
    
    let updatedCart = cart
    console.log("updated cart: ", updatedCart)
    console.log("item: ", item)

    if(item.quantity =="" || item.quantity ==null){
      alert("Please enter a quantity")
      return
    }
    if(updatedCart.find(i=>i.id===item.id) != null){
       updatedCart.find(i=>i.id===item.id).quantity = item.quantity
    }else{
      updatedCart = [...cart,item ]
      console.log(updatedCart)
      setCart([...cart,item ]);
    }
  
    let totalItems = updatedCart.length
    let totalAmount = appData.totalAmount + Number((Number(item.price)*Number(item.quantity)).toFixed(2))
    setAppData(prev=>({...prev,...{["totalAmount"]: totalAmount},...{["totalItems"]: totalItems},...{["cart"]: updatedCart}}))
 }

 const resetCart = ()=>{
  setCart([])
  setAppData(prevAppData => ({
    ...prevAppData,
    cart: [],
    totalAmount: 0,
    totalItems: 0
  }));
  getCatalogItems()
 }


  const loadingModalStyle={
    position: "fixed",
    height: "300px",
    width: "400px",
    top: "50vh",
    left: "50vw",
    transform: "translate(-50%, -50%)",
    cursor: "move",
    zIndex: 9999,
    fontSize: "24px",
    fontWeight: "bold",
    zIndex: 999,
    cursor: "grab",
  }

  return(
    <div className="flex-container" style={{height:"95%", width:"100%", overflowY:"hidden"}}>

        {/* Filter */}
        {filterCriteria.length>0 &&
          <div className="d-flex shadow-sm w-100">
            <Filter 
              appData = {appData}
              setAppData = {setAppData}
              setFilteredItems = {setFilteredItems}
            />
          </div>
        }

        <div  className="d-flex justify-content-center p-1" style={{height:"95%", width:"100%", overflowY:"hidden"}}>
              
              {/* Catalog Items */}
              <div className="d-flex justify-content-center" style={{height:"95%", overflowY:"auto"}}>

              
                  <div className="d-flex flex-column">
                    {filteredItems.length>0 &&  <div className="d-flex justify-content-center">{`${filteredItems.length} Item${filteredItems.length>1?"s":""}`}</div>}
                    <div className="d-flex justify-content-center flex-wrap">
                    {filteredItems.length>0 && filteredItems.map((item, index)=>(
                      <CatalogItem 
                        key={index}
                        item = {item}
                        appData={appData}
                        setAppData={setAppData}
                        addToCart={addToCart}
                        
                      />
                    ))}
                    {filteredItems.length===0 && <div className="d-flex align-items-center" style={{fontSize: 20, color: "gray", height:"500px"}}>No items found.  Please adjust filter</div>}
                    </div>
                  </div>
             
              {/* Cart */}
              {cart.length>0 && 
                <div className="d-flex bg-light shadow rounded-3" style={{minWidth: "450px", height: "100%", marginRight:0}}>
                <Cart
                  cart = {cart}
                  setCart = {setCart}
                  appData = {appData}
                  setAppData = {setAppData}
                  setShowOrderForm = {setShowOrderForm}
                  resetCart = {resetCart}
                />
                </div>
              }
          </div>
        </div>

      {/* Checkout Order Form */}
      {showOrderForm && 
        <FloatingPanel
            title="Check Out"
            top="50vh"
            left="50vw"
            height="80vh"
            width="60vw"
            appData={appData}
            displayPanel={setShowOrderForm}
        >
          <OrderForm appData={appData} setAppData={setAppData} setShowOrderForm={setShowOrderForm} cart={cart} resetCart={resetCart}/>
        </FloatingPanel>
      }

      {loading &&
        <div className="d-flex flex-column justify-content-center bg-light shadow p-3 text-center border border-3 rounded-3" 
        style={{...loadingModalStyle,left: position.x + "px", top: position.y + "px"}}>
            <Spinner/>
        </div>
      }

    </div>
  )
}
export default MarketPlace