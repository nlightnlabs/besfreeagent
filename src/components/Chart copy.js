import React, {useEffect, useState} from 'react';
import { Bar} from 'react-chartjs-2';
import {getData} from './apis/axios.js'
import {toProperCase} from './functions/formatValue.js'


const Chart = (props) => {

    const chartTitle = props.chartTitle
    const tableName = props.tableName
    const categoryLabels = props.categoryLabels
    const aggregationMethod = props.aggregationMethod
    const fieldToAggregate = props.fieldToAggregate
    const [data, setData] = useState({})
    const [options, setOptions] = useState({})

    useEffect(()=>{
        fetchData()
    },[props])

    const fetchData = async (req, res)=>{

        let query = `SELECT "${categoryLabels}" as label, count(distinct "id") as value from ${tableName} group by "${categoryLabels}" order by count(distinct "id") desc;`

        if (aggregationMethod == "sum"){
          query = `SELECT "${categoryLabels}" as label, sum("${fieldToAggregate}") as value from requests group by "${categoryLabels}" order by sum("${fieldToAggregate}") desc`
        }

        try{
          const response = await getData(query)
          console.log(response)

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

            console.log(pareto_data)
        
            let labels = []
            pareto_data.map((item)=>{
                labels.push(toProperCase((item.label).replaceAll("_"," ")))
            })
            console.log(labels)

          let barData = []
          pareto_data.map((item)=>{
            barData.push(Number(item.value))
          })
          console.log(barData)

          let lineData = []
          pareto_data.map((item)=>{
            lineData.push(Number(item.running_pct_of_total))
          })
          console.log(lineData)

            setData({
                labels: ["1","2","3"],
                datasets: [
                {
                    label: 'Total Quantity',
                    data: [50,30,20],
                    backgroundColor: "rgba(0,100,200,0.25)",
                    order: 0,
                },
                {
                    label: 'Running Pct of Total',
                    data: [50,80,100],
                    borderColor: "rgb(200,200,200)",
                    backgroundColor: "rgb(200,200,200)",
                    type: 'line',
                    order: 1,
                    pointStyle: 'circle',
                    pointRadius: 4,
                }
            ]})
            
            setOptions({
                scales: {
                  x: {
                    type: 'category', // Use linear scale for the x-axis
                    position: 'bottom',
                    grid:{
                        display: false
                    }
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
                        display: true,
                        text: chartTitle,
                        color: 'black', // You can customize the color of the title
                        font: {
                            size: 16, // You can customize the font size of the title
                        },
                    },
                    datalabels:{
                        display: true
                    }
                  }
                })
        }catch(error){
          console.log(error)
        }
    }
 
  return (
    <div className="container">
      <Bar data={data} options={options} />
    </div>
  );
};

export default Chart;


