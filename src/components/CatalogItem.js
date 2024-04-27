import React, {useRef, useState, useEffect} from "react"
import FloatingPanel from "./FloatingPanel.js";
import ItemPage from "./ItemPage.js"
import {limitText} from "./functions/formatValue.js"

const CatalogItem = (props)=>{

    const environment = window.environment

    let item = props.item
    const appData = props.appData;
    const setAppData = props.setAppData;

    const countries = appData.countries
    const businesses = appData.businesses
    const icons = appData.icons
    const appHomePage = appData.appHomePage
    const FAClient = appData.FAClient

    const [showItemPage, setShowItemPage] = useState(false)
    const [quantity, setQuantity] = useState(item.quantity || "")
    const addToCart = props.addToCart

    const [itemAmount, setItemAmount] = useState(0)

    
    const handleInputChange = (e)=>{
      const {value} = e.target;
      setQuantity(value);
      item.quantity = Number(value)
      item.item_amount = Number((item.price * value).toFixed(2))
      setItemAmount(item.item_amount)
    }

    const handleAddToCart = ()=>{
      addToCart(item)
    }

    const handleItemClick = (item)=>{
        setShowItemPage(true)
    }

 
     const cardDetails=[
          {order: 1, name:"image", type:"image", value: item.image, label:"", color:"rgb(0,0,0)", fontSize:"18px", fontWeight: "bold", section:"header"},
          {order: 2, name:"item_name", type:"text", value: item.item_name, label:"", color:"rgb(0,0,0)", fontSize:"18px",fontWeight: "bold", section:"header"},
          {order: 3, name:"supplier", type:"text", value: item.supplier, label: "", color:"rgb(0,150,200)", fontSize:"16px", fontWeight: "normal", section:"header"},
          {order: 4, name:"price", type:"text", value: `${countries.length>0 && countries.find(r=>r.currency_name===item.currency).currency_symbol}${Number(item.price).toLocaleString()}`, label:`/${item.unit_of_measure}`, color:"rgb(0,0,0)", fontSize:"14px",fontWeight: "bold", section:"body"},
          {order: 5, name:"savings", type:"text", value: `${item.savings}%`, label:"negotiated savings", color:"rgb(0,200,0)", fontSize:"14px", fontWeight: "bold", section:"body"},
          {order: 6, name:"star_rating", type:"text", value: item.star_rating, label:"community rating", color:"rgb(255,200,0)", fontSize:"14px", section:"body"},
          {order: 7, name:"quantity_in_stock", type:"text", value: item.quantity_in_stock, label:"in stock", color:"rgb(0,0,0)", fontSize:"14px", section:"body"},
          {order: 8, name:"lead_time", type:"text", value: item.lead_time, label:"estimated lead time", color:"rgb(0,0,0)", fontSize:"14px", section:"body"},
      ]
        

    const itemContainerStyle = {
      width: "300px",
      cursor: "pointer",
      maxHeight:"400px"
    }

    const itemImageStyle = {
      maxHeight: "75px",
      maxWidth: "100%"
    }

    const subLabelStyle = {
      color: "gray", 
      fontSize: "12px"
    }

    const iconButtonStyle = {
      height: "30px",
      width: "30px",
      cursor: "pointer"
  }

      return(
      
        <div className="d-flex flex-column border border-1 p-1 bg-white shadow-sm rounded-3 m-1" style={itemContainerStyle}>
          <div 
            className="d-flex align-items-center justify-content-between p-2"
            style={{borderBottom: "1px solid lightgray"}}
            >
            <div className="d-flex align-items-center w-75">
              <div className="d-flex me-2">Quantity: </div>
              <input id="quantity" name="quantity" className="form-control" value={quantity} onChange={(e)=>handleInputChange(e)}></input>
            </div>

            {appData.icons.length>0 && 
              <div className="d-flex align-items-center w-25 justify-content-end">
                  <img 
                    src={icons.find(i=>i.name==="add").image} 
                    style={iconButtonStyle} 
                    onClick={(e)=>handleAddToCart()}
                    title="Add to cart"
                    alt="Add icon"
                  >
                  </img>
              </div>
            }
          </div>
          <div className="d-flex w-100 flex-column p-1"  onClick={(e)=>handleItemClick(e)}>
            {cardDetails.map((obj,index)=>(
              obj.type==="image" && obj.value !="" && obj.value !=null?
                <div key={index} className="d-flex w-100">
                  <img src={environment === "freeagent"? obj.value : obj.value} style={itemImageStyle}></img>
                </div>
              :
                <div key={index} >
                  <span style={{color: obj.color, fontSize: obj.fontSize, fontWeight: obj.fontWeight, padding:"2px"}}>{limitText(obj.value,50)}</span>
                  <span style={subLabelStyle}> {limitText(obj.label,50)}</span>
                </div>
            ))}
          </div>

          {showItemPage && 
          <div className="d-flex" style={{height:"100vh", width: "100vw", backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", top: 0, left:0, zIndex:999}}>
            <FloatingPanel 
              title = {item.item_name}
              top ="50vh"
              left="50vh"
              height="80%"
              width="50%"
              item ={item}
              appData={appData}
              displayPanel={setShowItemPage}
            >
                <ItemPage item = {item} appData={appData}/>
            </FloatingPanel>
          </div>
          }
        </div>
      )
  }

  export default CatalogItem