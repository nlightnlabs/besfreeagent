import React, {useState, useEffect} from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import { appIcons } from './apis/icons.js';

const CatalogItem = (props) => {

    const id = props.id || ""
    const name = props.name || ""
    const [item, setItem] = useState(props.item || {})
    const [cart, setCart] = useState(props.cart || [])
    const [quantity, setQuantity] = useState(Number(props.quantity) || "")

    useEffect(()=>{
      setCart(props.cart)
    },[props])
    
    const [value, setValue] = useState("")

    const handleQuantityChange = (inputValue)=>{
        setValue(Number(inputValue))
        let quantity = Number(inputValue)
        let item_amount =  Number(quantity*Number(item.price)).toFixed(2)
        setItem({...item,...{['quantity']:quantity},...{['item_amount']:item_amount}})
    }

    const handleAddToCart = (e)=>{
        console.log(item)
        props.handleAddToCart(item)
    }

    const itemCardStyle = {
        width: "30%",
        minWidth: "250px",
        margin: "5px",
        border: "1px solid lightgray",
        borderRadius: "10px",
        padding: "15px"
      }
    
      const itemImageStyle = {
        maxHeight: "100%",
        maxWidth: "100%"
      }
    
      const itemNameStyle = {
        fontSize: "18px",
        fontWeight: "bold"
      }
    
      const itemSupplierStyle = {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#5B9BD5"
      }
    
      const itemPriceStyle = {
        fontSize: "18px",
        fontWeight: "bold",
        color: "black"
      }
    
      const itemSavingsStyle = {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#70AD47"
      }
    
    
      const itemRatingStyle = {
        fontSize: "12px",
        color: "orange"
      }
    
    
      const itemQuantityInStockStyle = {
        fontSize: "14px",
        color: "black"
      }
    
      const itemLeadTimeStyle = {
        fontSize: "14px",
        color: "black"
      }
    
      const iconButtonStyle = {
        maxHeight: "30px",
        maxWidth: "30px",
        cursor: "pointer"
      }
    
      const quantityInputStyle={
        fontSize: "12px",
        color: "gray",
        border: "1px solid lightgray",
        borderRadius: "5px",
        width: "75px",
        outline: "none",
        color: "blue",
        textAlign: "center",
        marginRight: "10px"
      }

      
  return (
    <div id={id} name={name} className="d-flex flex-column bg-white shadow-sm" style={itemCardStyle}>
        <div className="d-flex bg-light justify-content-end">
        <label htmlFor={`item_${item.id}_quantity`} className="d-flex"  style={{height: "30px", paddingTop:"7px", fontSize: "10px", color: "gray"}} >Quantity:</label>
        <input id={`item_${item.id}_quantity`} name={`item_${item.id}_quantity`} style={quantityInputStyle} type="number" value={value} onChange={(e)=>handleQuantityChange(e.target.value)}></input>
        
        <label className="d-flex"  style={{height: "30px", paddingTop:"7px", fontSize: "10px", color: "gray"}} >Add to cart: </label>
        <img src={`${appIcons}/add_icon.png`} style={iconButtonStyle} onClick={(e)=>handleAddToCart(e)}/>
        </div>
    
    <div style={{height: "100px", width:"100%", overflow: "hidden"}}>
        { item.image? 
        <img src={item.image} style={itemImageStyle}></img>
        : 
        <span style={{fontSize: "12px", color: "gray"}}>No image available</span>
        }
    </div>              
    <div style={itemNameStyle} >{item.item_name}</div>
    <div style={itemSupplierStyle} >
        {item.supplier}
    </div>
    
    <div style={itemPriceStyle} >${item.price} 
        <span style={{color: "gray", fontSize:"12px", fontWeight: "normal"}}> /{item.unit_of_measure}</span>
    </div>
    <div style={itemSavingsStyle} >{(Number(item.savings_percent)*100).toFixed(1)}%
        <span style={{color: "gray", fontSize:"12px", fontWeight: "normal"}}> negotiated savings</span>
    </div>
    <div style={itemRatingStyle}>
        {item.star_rating}
        <span style={{color: "gray", fontSize:"12px", fontWeight: "normal"}}> average community rating</span>
    </div>
    <div style={itemQuantityInStockStyle}>{item.quantity_in_stock} in stock</div>
    <div style={itemLeadTimeStyle}>
        {item.lead_time} {item.lead_time > 1 ? "days" : "day"}
        <span style={{color: "gray", fontSize:"12px", fontWeight: "normal"}}> estimated lead time</span>
    </div>
</div>
  )
}

export default CatalogItem