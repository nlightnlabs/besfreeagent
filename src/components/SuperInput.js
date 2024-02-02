import React, {useState, useEffect, forwardRef, useRef} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

const SuperInput = forwardRef((props, ref) => {

        let target = {}

        const list = props.list || []
        const label = props.label
        const type = props.type
        const id = props.id
        const name =props.name
        const onChange= props.onChange 
        const onBlur= props.onBlur
        const onHover= props.onHover
        const valueColor= props.valueColor 
        const labelColor= props.labelColor 
        const valueSize= props.valueSize 
        const labelSize= props.labelSize 
        const valueBold=  props.valueBold
        const labelBold= props.lableBold
        const optionColor = props.optioncolor
        const optionSize = props.optioncolor
        const optionWeight = props.optionWeight
        const layout= props.layout
        const border= props.border
        const fill= props.fill 
        const labelFill = props.labelFill
        const padding= props.padding
        const rounded= props.rounded
        const readonly= props.readonly
        const disabled= props.disabled
        const required = props.required
        const showLookupValue = props.showLookupValue || false
        const width = props.width
        const height = props.height
        const dropDownFill = props.dropDownFill

        const [options, setOptions] = useState([])
        
        const getOptions = (list)=>{
          if(list && list.length>0 && options.length ==0){
            setOptions(list.filter(e=>e))
          }
        } 

        useEffect(()=>{
          getOptions(props.list)
        },[props.list])


        const [value, setValue] = useState(props.value)
        const [dropDownDisplay, setDropDownDisplay] = useState("none")
        const [selectedIndex, setSelectedIndex] = useState(props.list ? props.list.indexOf(props.value) : 0)

        const containerRef = useRef("")
        const inputRef = useRef("")
    
        const containerstyle={
          display: "flex",
          position: "relative",
          top: 0,
          left: 0,
          get display(){if(layout=="stacked"){return "block"}else{return "flex"}},
          width: "100%",
          height: height || 58
        }
      
        const inputStyle ={
          cursor: "pointer",
          fontSize: valueSize || 16,
          fontWeight: valueBold || "normal",
          color: valueColor || "black",
          backgroundColor: fill || "white",
          outline: "none",
          width: width || "100%",
          height: height || "100%",
          border: border|| "1px solid rgb(235,235,235)"
        }
      
        const labelStyle ={
          fontSize: labelSize || inputStyle.fontSize-1,
          fontWeight: labelBold || "normal",
          color: labelColor || "rgb(145, 145, 145)",
          backgroundColor: "rgba(145, 145, 145,0)",
        }
      
      
        const dropDownStyle = {
          display: dropDownDisplay,
          position: "absolute",
          top: containerstyle.top+containerstyle.height,
          left: inputStyle.left,
          width: "100%",
          minHeight: 300,
          maxHeight: 300,
          overflowY: "auto",
          overflowX: "hidden",
          padding: padding || 5,
          display: dropDownDisplay,
          backgroundColor: dropDownFill || "rgba(255,255,255,0.95)",
          boxShadow: "5px 5px 5px lightgray",
          border: "1px solid lightgray",
          borderRadius: "0px 0px 5px 10px",
          color: valueColor || "black",
          zIndex: 999999
        }
      
        const optionsStyle = {
          display: "block",
          width: "100%",
          cursor: "pointer",
          fontSize: inputStyle.fontSize,
          fontWeight: optionWeight || "normal",
          padding: padding || 5,
          color: optionColor || "black",
          backgroundColor: fill || "rgb(255,255,255,0)",
        }
      
        const handleOptionClick=(e)=>{

          console.log(e)

          let selectedIndex = e.target.id
          let value = props.list[selectedIndex]

          setValue(value)
          setSelectedIndex(selectedIndex)
          setDropDownDisplay("none")
          
          let updatedEvent = e
          const selectedValue = {['value']:value}
          updatedEvent['target'] = {...e['target'],...selectedValue}
          console.log(updatedEvent)
          handleInputChange(updatedEvent)

          handleChange(value,updatedEvent)
        }
      
        const handleOptionHover = (event)=>{
          if(event.type == "mouseover") {
            event.target.style.backgroundColor = "rgb(235,245,255)";
            event.target.style.fontWeight = "bold";
            event.target.style.color = "#2C7BFF";
          }else{
            event.target.style.backgroundColor = optionsStyle.backgroundColor;
            event.target.style.fontWeight = optionsStyle.fontWeight;
            event.target.style.color = optionsStyle.color;
          }
        }
      
        const handleDropDownToggle=(event)=>{
          if(dropDownDisplay =="none"){
            setDropDownDisplay("block")
          }else{
            setDropDownDisplay("none")
          }
        }
      
        const handleChange=(value,e)=>{

          if(typeof onChange =="function"){
            target = {
              ...props,
              value: value,
              selectedIndex,
              action: e.type
            }

            onChange({target})
          }
        }
      
        const handleBlur=()=>{
  
        }
        
        const handleHover=(e)=>{
            if(e.type =="mouseleave"){
                setDropDownDisplay("none")
            }
        }
      
        const inputProps = {
          readOnly: readonly || false,
          disabled: disabled || false,
          required: required || false
        }
      
        const handleInputChange=(e)=>{
          
          console.log(e)

          let inputText = e.target.value;
          console.log(inputText)

          setValue(inputText)
          console.log(list.length)
          console.log(inputText.length)

          if(list.length>0){
            // filter the options based on the text user has inputted
            if(inputText.length>0){
              console.log(inputText.length)
              setOptions(options.filter(item=>item.toLowerCase().includes((inputText).toLowerCase())))
            }else{
              console.log(props.list)
              setOptions(props.list)
            }
          }
          handleChange(inputText,e)
        }

        

        return (
          <div 
            ref = {ref}
            id={id}
            name={name} 
            style={containerstyle}
            onBlur={(e)=>handleBlur(e)}
            onMouseOver={(e)=>handleHover(e)}
            onMouseLeave={(e)=>handleHover(e)}
          >
            {/* label */}
            {label ?
                <div className="form-floating w-100">
                  <input 
                      className="form-control"
                      style={inputStyle}
                      ref = {inputRef}
                      onClick={(e)=>handleDropDownToggle(e)}
                      value={value}
                      onChange={(e)=>handleInputChange(e)}
                      onBlur={(e)=>handleInputChange(e)}
                      {...inputProps}
                      >
                  </input>
                  <label className="form-label text-body-tertiary small" style={labelStyle}>{label}</label>
                </div>
              :

                <div className="form-group w-100">
                  <input 
                      className="form-control"
                      style={inputStyle}
                      ref = {inputRef}
                      onClick={(e)=>handleDropDownToggle(e)}
                      value={value}
                      onChange={(e)=>handleInputChange(e)}
                      {...inputProps}
                      >
                  </input>
                </div>
              }
               {props.list && 
                  <div style={dropDownStyle}>
                    {options.map((item,index)=>(
                      <div
                        key={index}
                        id={props.list.indexOf(item)}
                        name={item}
                        style={optionsStyle}
                        onClick={(e)=>handleOptionClick(e)}
                        onMouseOver={(e)=>handleOptionHover(e)}
                        onMouseLeave={(e)=>handleOptionHover(e)}
                      >
                        {item}
                      </div>
                    ))}
                  </div>  
              }
          </div>
        )
      })

export default SuperInput