import React, {useState, useEffect, useRef, createRef} from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import MultiInput from './MultiInput.js';
import { generalIcons } from './apis/icons.js';
import { toProperCase } from './functions/formatValue.js';

const TableInput = (props) => {

  const id=props.id
  const name = props.name
  const onChange = props.onChange
  const valueColor = props.valueColor
  const valueSize = props.valueSize
  const list = props.list || []
  const readonly = props.readonly
  const disabled= props.disabled
  const required = props.required

  const [updatedData, setUpdatedData] = useState({})

  const [lineItems, setLineItems] = useState([
    {item_name:"", detail:""},
    {item_name:"", detail:""},
    {item_name:"", detail:""},
  ])

  const [optionsWindow, setOptionsWindow] = useState(false)

  const getInititalData=(initialTableData)=>{
  
    if(typeof initialTableData == "string" && initialTableData.length>0){
      if(Array.isArray(JSON.parse(props.initialTableData))){
        console.log(JSON.parse(props.initialTableData))
        setLineItems(JSON.parse(props.initialTableData))
      }
    }else{
      setLineItems(initialTableData)
    }
  }

  useEffect(()=>{
    const initialTableData = props.initialTableData
    getInititalData(initialTableData)
  },[props.initialTableData])

  useEffect(() => {
    if (tableRef.current) {
      // Accessing the width after the component has been rendered
      const width = tableRef.current.clientWidth;
      setTableWidth(width);
    }
  }, []);

  const [showAddItemError, setShowAddItemError] = useState(false)

  const tableRef = useRef(null);
  const [tableWidth, setTableWidth] = useState(0);

  const usernameRefs = useRef([]);
  usernameRefs.current = lineItems.map(
      (ref, index) =>   usernameRefs.current[index] = createRef(index)
    )

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

  const handleChange = async (e)=>{ 
      
    const {name, value} = e.target
    const item = name.item
    const field = name.field

    const updatedLineItem = {...lineItems[item],[field]:value}
    setUpdatedData({...updatedData,...updatedLineItem})

    let lineItemsTemp = lineItems
    lineItemsTemp[item] = updatedLineItem
    setLineItems(lineItemsTemp)

    updateParent()
}


  const addItem = (e, row_index) =>{
    let newItem = {}
    for (let key in lineItems[0]) {
      newItem[key] = "";
    }
    setLineItems([...lineItems,newItem])
    updateParent()
  }

  const removeItem = (e, row_index) =>{
    const updatedLineItems = [...lineItems];
    updatedLineItems.splice(row_index, 1)
    setLineItems(updatedLineItems)
    updateParent()
  }


  const updateParent = ()=>{
    if(typeof onChange =="function"){
      let target = {
        ...props,
        value: lineItems,
      }
      onChange({target})
    }
  }

  const inputRequired = (row_index)=>{
    if(row_index==0){
      return {required: true}
    }
  }

  const addIcon = `${generalIcons}/add_icon.png`
  const removeIcon = `${generalIcons}/delete_icon.png`  


  const tableCellStyle = {
    fontSize: valueSize || 12,
    padding: 2,
    color: valueColor || "black",
    // width: Number(`${Math.ceil(Math.ceil(1/(Object.keys(lineItems[0]).length)*100))}%`),
    width: "auto",
    minWidth: "100px",
    maxWidth: "200px",
    backgroundColor: "rgba(250,250,250,0)",
    get height(){return this.fontSize+2*this.padding}
  }

  const headerCellStyle = {
    fontSize: valueSize || 12,
    padding: 2,
    color: "black",
    width: Math.ceil(tableWidth/(Object.keys(lineItems[0]).length),150),
    minHeight: 20,
    backgroundColor: "rgba(250,250,250,0)"
  }

  const rowStyle = {
    fontSize: valueSize || 12,
    padding: 2,
    color: valueColor || "black",
    get height(){return this.fontSize+2*this.padding}
  }


  return (
    <div className="d-flex flex-column mb-3">
        <table ref={tableRef} 
        className="table w-100 table-borderless" 
        style={{fontSize: valueSize || 12}}>
          <thead>
            <tr className="text-center">
            {Object.keys(lineItems[0]).map((field, col_index)=>(
              <th 
                key={col_index} 
                scope="col"
                style={headerCellStyle}
                >{toProperCase(field.replaceAll("_"," "))}
              </th>
            ))
            }
            </tr>
            <tr style={{borderBottom: "2px solid gray"}}></tr>
          </thead>
          <tbody className="table-group-divider">
          {lineItems.map((item, row_index) => (
              <tr key={row_index} id={`item_${row_index}`} ref={usernameRefs.current[row_index]} style={rowStyle}>
                {Object.keys(lineItems[0]).map((field, col_index) => (
                  <td key={`${row_index}_${field}`} style={tableCellStyle}>
                    <MultiInput
                      id={{item: row_index,field: field}}
                      name={{item: row_index,field: field}}
                      style={tableCellStyle}
                      value={lineItems[row_index][field]}
                      valueSize={tableCellStyle.fontSize}
                      valueColor={tableCellStyle.color}
                      padding={0}
                      onChange={(e) => handleChange(e)}
                      required={inputRequired(row_index)}
                      readonly = {readonly}
                      disabled = {disabled}
                      list={col_index==0? list : null}
                    />
                  </td>
                ))}
                <td id={`remove_item_${row_index}`} style={{background:"none", fontSize: valueSize || 14}}>
                  <img src={removeIcon} style={removeIconStyle} onClick={(e) => removeItem(e, row_index)} alt={`Remove ${row_index}`} />
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="2" className="small bg-second" style={{background:"none", fontSize: valueSize || 14}}>
                <img src={addIcon} style={addIconStyle} onClick={(e)=>addItem(e)}></img>Add item
              </td>
            </tr>
          </tbody>
        </table>
    </div>
  )
}

export default TableInput