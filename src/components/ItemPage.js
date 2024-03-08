import React, {useRef, useState, useEffect} from "react"
import { toProperCase } from "./functions/formatValue"

const ItemPage = (props)=>{
    
    const item = props.item

    const tableStyle={
      fontSize: "12px",
      padding: "2px"
    }

    const cellStyle={
      padding: "2px"
    }

    const headerStyle={
      fontWeight: "bold",
      padding: "2px",
    }

    return(
      <div className="flex-container flex-column bg-white p-3" style={{width:"100%"}}>
        {
          Object.entries(item).map(([key,value])=>(
              value !=null && value !="" && 
                <div key={key} className="row">
                  <div className="col-3 p-1" style={{color: "gray"}}>{toProperCase(key.replaceAll("_"," "))}: </div>
                  <div className="col-9 p-1">
                    {
                      Array.isArray(value)?
                      <table className="table table-striped">
                          <thead>
                            <tr>
                              {Object.keys(value).map((col,colIndex)=>(
                                <th key={colIndex} scope="col" style={headerStyle}>{col}</th>
                              ))}
                            </tr>
                      </thead>
                        <tbody>
                          {value.map((row,rowIndex)=>(
                            <tr>
                              {Object.values(row).map((value,valIndex)=>(
                                <td key={valIndex} style="cellStyle">{value}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>          
                    :
                    typeof value =="object"?
      
                        <div>{JSON.stringify(value)}</div>
                    :
                    key ==="image" && value !="" && value !=null && JSON.parse(value)?
                    <div>
                        <img src={JSON.parse(value).url} style={{maxWidth: "80%", height:"auto", maxHeight: "150px"}} alt=""></img>
                    </div>
                    : 
                    typeof value =="string"?
                        <div>{value.toString()}</div>
                    :
                    null
                    }
                  </div>
                </div>
          )
        )}
      </div>
    )
  }

export default ItemPage