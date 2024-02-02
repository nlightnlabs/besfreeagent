import 'bootstrap/dist/css/bootstrap.min.css';
import axios, {getData} from 'axios';
import { useState, useEffect, useRef, createRef } from 'react';
import SuperInput from './SuperInput';


const Card = (props) => {

  const data = props.data || []
  const fields = props.fields || []

  const [cardSettings, setCardSettings] = useState([
    {field_id: "title", selected_field:"subject"},
    {field_id: "sub_title", selected_field:"requester"},
    {field_id: "field_1", selected_field:"request_date"},
    {field_id: "field_2", selected_field:"need_by"},
    {field_id: "field_3", selected_field:"status"},
    {field_id: "field_4", selected_field:"stage"}
  ])


  const pageStyle={
    height: "100vh",
    overflowY: 'auto'
  }

  const titleStyle={
    display: "block",
    overflow: "auto",
    border: "none",
    width: "100%",
    fontSize: 20,
    fontWeight: 'bold',
    color: "black",
    padding: 2
  }

  const subTitleStyle={
    border: "none",
    width: "100%",
    fontSize: 18,
    color: "black",
    background: "none",
    padding: 2
  }

  const labelStyle={
    border: "none",
    width: "100%",
    fontSize: 16,
    color: "black",
    background: "none",
    marginTop: 5,
    padding: 2
  }

  const handleChange=(props)=>{ 
      let new_data  = {field_id: props.id, selected_field: fields[props.selectedIndex]}
      let row_to_update = cardSettings.findIndex(row=>row.field_id===props.id)
      let new_card_settings_data = [...cardSettings.slice(0,row_to_update), new_data,...cardSettings.slice(row_to_update + 1)]
      setCardSettings(new_card_settings_data)
  }

  useEffect(()=>{

  },[props])

  const cardStyle = {
    border: "1px solid lightgray",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    boxShadow: "2px 2px 8px rgba(0,0,0,0.25)"
  }


  return (
    <div className="flex justify-content-center" style={pageStyle}>
        {data.map((item,index)=>(
          <div key={index} className="d-flex flex-column" style={cardStyle}>
            <div className="d-flex">
                <SuperInput 
                  id ={cardSettings[0]['field_id']}
                  name={cardSettings[0]['field_id']}
                  list={fields} 
                  valueSize={14}
                  valueColor={"gray"} 
                  value={cardSettings[0]['selected_field']}
                  onChange={(props)=>handleChange(props)}
                  padding={0}
                />
            </div>
            <div style={titleStyle}>{item[cardSettings[0].selected_field]}</div>

            <div className="d-flex">
                <SuperInput 
                  id ={cardSettings[1]['field_id']}
                  name={cardSettings[1]['field_id']}
                  list={fields} 
                  valueSize={12}
                  valueColor={"gray"} 
                  value={cardSettings[1]['selected_field']}
                  onChange={(props)=>handleChange(props)}
                  padding={0}
                />
            </div>
        
            
            <table className="">
              <thead>
                <tr>
                  <th scope="col" className="w-50 p-0"></th>
                  <th scope="col" className="w-50 p-0"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                      <SuperInput 
                        id ={cardSettings[2]['field_id']}
                        name={cardSettings[2]['field_id']}
                        list={fields} 
                        valueSize={12}
                        valueColor={"gray"} 
                        value={cardSettings[2]['selected_field']}
                        onChange={(props)=>handleChange(props)}
                        padding={0}
                      />
            
                  </td>
                  <td>
                      <SuperInput 
                        id ={cardSettings[4]['field_id']}
                        name={cardSettings[4]['field_id']}
                        list={fields} 
                        valueSize={12}
                        valueColor={"gray"} 
                        value={cardSettings[4]['selected_field']}
                        onChange={(props)=>handleChange(props)}
                        padding={0}
                      />
                  </td>
                </tr>

                <tr>
                  <td>
                      <SuperInput 
                        id ={cardSettings[3]['field_id']}
                        name={cardSettings[3]['field_id']}
                        list={fields} 
                        valueSize={12}
                        valueColor={"gray"} 
                        value={cardSettings[3]['selected_field']}
                        onChange={(props)=>handleChange(props)}
                        padding={0}
                      />
                  </td>
                  <td>
                      <SuperInput 
                        id ={cardSettings[5]['field_id']}
                        name={cardSettings[5]['field_id']}
                        list={fields} 
                        valueSize={12}
                        valueColor={"gray"} 
                        value={cardSettings[5]['selected_field']}
                        onChange={(props)=>handleChange(props)}
                        padding={0}
                      />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
  )
}

export default Card