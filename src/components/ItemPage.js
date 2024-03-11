import React from "react"
import { toProperCase } from "./functions/formatValue"

const ItemPage = (props)=>{

    const environment = window.environment
    
    const item = props.item

    const headerStyle={
      fontWeight: "bold",
      padding: "2px",
    }

    return(
      <div className="flex-container flex-column bg-white p-3" style={{width:"100%", fontSize: "14px"}}>
        {
          Object.entries(item).map(([key,value],index)=>(
              value !=null && value !="" && 
                <div key={key} className="row p-3" style={{borderBottom: "1px solid lightgray"}}>
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
                    key ==="image" && value !="" && value !=null?
                    <div className="d-flex w-100 p-1" style={{height:"fit-content", width:"90%", overflowX: "auto"}}>
                        {environment ==="freeagent" ?
                          <img 
                            src={value} 
                            alt={"item image"} 
                            style={{height: "100px", width: "auto"}}>
                          </img>
                        :
                        JSON.parse(value) ? 
                          JSON.parse(value).map((image,index)=>(
                            <img 
                            key={index}
                            src={image.url} 
                            alt={`${image.name} icon`} 
                            style={{height: "100px", width: "auto"}}>
                          </img>
                          ))
                          :
                          null
                        }
                        
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