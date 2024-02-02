import React, {useState, useEffect} from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import { appIcons, generalIcons } from './apis/icons.js';


const Cart = (props) => {

    const cart = props.cart
    const setCart = props.setCart
    const [totalItems, setTotalItems] = useState(props.totalItems || 0)
    const [totalAmount, setTotalAmount] = useState(props.totalAmount || 0)
    const handleCheckOut = props.handleCheckOut

    const summarizeCart = ()=>{

        setTotalItems(cart.length)
        
        let total = 0
        cart.map((item)=>{
            total = (Number(total)+Number(item.item_amount)).toFixed(2)
        })
        setTotalAmount(total)
    }

    useEffect(()=>{
        setCart(props.cart)
        summarizeCart();
    },[props])

    const handleQuantityChange = (cartIndex, inputValue)=>{
        let quantity = inputValue
        let price = cart[cartIndex].price
        let item_amount = quantity*price

        let tempCart = cart
        tempCart[cartIndex].quantity = inputValue
        tempCart[cartIndex].item_amount = item_amount
        setCart(tempCart)

        summarizeCart()
    }

    const handleDelete = (cartIndex)=>{
        setCart(cart.filter(item => cart.indexOf(item) !== cartIndex));
    }

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

  return (
    <div className="flex-container flex-column">
        <img src={`${appIcons}/shopping_icon.png`} style={iconStyle} alt="Shopping Cart Icon"></img>
        <div className="d-flex w-100 flex-column justify-content-between">
        {totalItems > 0 ? <div className="d-flex justify-content-end fw-bold" style={{fontSize: "16px"}}>{totalItems} item{totalItems>1?"s":""}</div> : null }
        {totalAmount > 0 ? <div className="d-flex justify-content-end fw-bold" style={{fontSize: "16px"}}>${totalAmount} total</div> : null }
        <button className="btn btn-primary" onClick={(e)=>handleCheckOut()}>Check Out</button>
        <div className="d-flex flex-column" style={{overflow:"hidden", fontSize: "12px"}}>  
            {cart.length>0 ?
            <table className="table table-striped table-light table-border p-0">
            <thead>
                <tr className="fw-bold text-center">
                    <td>Item</td>
                    <td>Price</td>
                    <td>Quantity</td>
                    <td>Amount</td>
                    <td></td>
                    </tr>
            </thead>
            <tbody>
            {cart.map((item,cartIndex)=>(
                <tr key={cartIndex} className="animate__animated animate__fadeIn animate__duration-0.5s">
                    <td >{item.item_name}</td>
                    <td style={cartCellStyle}>${Number(item.price).toFixed(2)}</td>
                    <td style={cartCellStyle}><input style={cartInputStyle} value={item.quantity} onChange={(e)=>handleQuantityChange(cartIndex, e.target.value)}></input></td>
                    <td style={cartCellStyle}>${Number(item.item_amount).toFixed(2)}</td>
                    <td style={{...cartCellStyle,['fontWeight']:'bold'}}><img style={{height: 25, width: 25}} src={`${appIcons}/delete_icon.png`} onClick={(e)=>{handleDelete(cartIndex)}}></img></td>
                </tr>
            ))}
            </tbody>
            </table>
            :
            <div className="text-center" style={{color: "gray"}}>Nothing in cart</div>
            }
        </div>
        </div>
    </div>
  )
}

export default Cart