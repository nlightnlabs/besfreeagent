import React, { useState, useEffect } from 'react';
import { ResizableBox } from 'react-resizable';
import Draggable from 'react-draggable';
import { Bar} from 'react-chartjs-2';
import {getData} from './apis/axios.js'
import {toProperCase} from './functions/formatValue.js'

const ResizeableContainer = (props) => {
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);

  const handleResize = (e, { size }) => {
    setWidth(size.width);
    setHeight(size.height);
  };

    const chartTitle = props.chartTitle
    const categoryLabels = props.categoryLabels
    const tableName = props.tableName
    const aggregationMethod = props.aggregationMethod
    const fieldToAggregate = props.fieldToAggregate
    const barColors = props.barColors

    const [data, setData] = useState({})
    const [options, setOptions] = useState({})

    const prepareData = async ()=>{

        let query = `SELECT "${categoryLabels}" as label, count(distinct "id") as value from ${tableName} group by "${categoryLabels}" order by count(distinct "id") desc;`

        if (aggregationMethod == "sum"){
          query = `SELECT "${categoryLabels}" as label, sum("${fieldToAggregate}") as value from requests group by "${categoryLabels}" order by sum("${fieldToAggregate}") desc`
        }

        try{
          const response = await getData(query)

          // get total
          let total=0
            response.map(item=>{
              total += parseFloat(item.value)
            })

          // Additional fields needed for pareto chart
            var pareto_data =[]
            var running_total = 0
            await response.forEach((item)=>{
              var value = Number(item.value)
              var pct_of_total = Number((100*value / total).toFixed(2))
              running_total = Number(parseFloat(running_total + value).toFixed(0))
              var running_pct_of_total = Number(parseFloat(100*(running_total / total)).toFixed(2))
              var new_data = {pct_of_total, running_total,running_pct_of_total}
              var updated_item = {...item,...new_data}
              pareto_data.push(updated_item)
            })
        
            let labels = []
            pareto_data.map((item)=>{
                labels.push(toProperCase((item.label).replaceAll("_"," ")))
            })

            let barData = []
            pareto_data.map((item)=>{
                barData.push(Number(item.value))
            })

            let lineData = []
            pareto_data.map((item)=>{
                lineData.push(Number(item.running_pct_of_total))
            })

            const d = {
                labels: labels,
                datasets: [
                {
                    label: 'Total Quantity',
                    data: barData,
                    backgroundColor: barColors,
                    order: 0,
                },
                {
                    label: 'Running Pct of Total',
                    data: lineData,
                    borderColor: "rgb(200,200,200)",
                    backgroundColor: "rgb(200,200,200)",
                    type: 'line',
                    order: 1,
                    pointStyle: 'circle',
                    pointRadius: 4,
                }
                ]
            }
            setData(d)
            prepareOptions(d)
        }catch(error){
            console.log(error)
        }
    }    
        
    useEffect(()=>{
        prepareData()
    },[])

    const prepareOptions = (data)=>{
        const numberOfCategories = data.labels.length
        console.log(numberOfCategories)
        let fontSize = 12 
        let xRotation = 0
        if (numberOfCategories>5){
            fontSize = 10
            xRotation = 90
        }

        const o = {
            layout: {
                padding: {
                  bottom: 20,
                },
            },
            scales: {
              x: {
                type: 'category',
                position: 'bottom',
                grid:{
                    display: false
                },
                ticks:{
                    autoSkip: false,
                    minRotation: xRotation, 
                    maxRotation: xRotation, 
                    font:{
                        size: fontSize,
                    },
                },
              },
              y: {
                beginAtZero: true,
                grid:{
                    display: false
                },
                display: false
              },
            },
            plugins:{
                title: {
                    text: chartTitle,
                    display: true,
                    color: 'black',
                    font: {
                        size: 16,
                    },
                },
                datalabels:{
                    display: true,
                    color: 'black', // Label text color
                    anchor: 'end', // Label anchor point
                    align: 'end', // Label alignment
                    formatter: (value) => {
                      return value + '%';
                    },
                }
              }
        }
        setOptions(o)
    }

  return (
    <Draggable>
      <ResizableBox
        width={width}
        height={height}
        onResize={handleResize}
        minConstraints={[100, 100]}
        maxConstraints={[500, 500]}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid #ccc',
            resize: 'both',
            overflow: 'auto',
          }}
    className="d-flex border border-1 bg-white justify-content-center rounded-3 shadow m-3 w-md-100"

        >
          <div className="container">
            {Object.keys(data).length>0 && <Bar data={data} options={options} />}
          </div>
        </div>
      </ResizableBox>
    </Draggable>
  );
};

export default ResizeableContainer;
