import React, {useEffect, useState} from 'react';
import { Bar} from 'react-chartjs-2';
import {getData} from './apis/axios.js'
import {toProperCase} from './functions/formatValue.js'
import {formatValue} from './functions/formatValue.js'

import "bootstrap/dist/css/bootstrap.min.css"


const ParetoChart = ({props}) => {

    

    const chartTitle = props.chartTitle
    const categoryLabels = props.categoryLabels
    const tableName = props.tableName
    const aggregationMethod = props.aggregationMethod
    const fieldToAggregate = props.fieldToAggregate
    const valueColors = props.valueColors
    const barColors = props.barColors
    const barValueColors = props.barValueColors
    const barDataTitle = props.barDataTitle
    const lineColors = props.lineColors
    const lineValueColors = props.lineValueColors
    const lineDataTitle = props.lineDataTitle

    const primaryTextFormat = props.primaryTextformat || "quantity"
    const primaryTextCurrencySymbol = props.primaryTextformat || "$"
    const primaryTextDigits = props.primaryTextDigits || 1
    const primaryTextAbbreviate = props.primaryTextAbbreviate || true

    const secondaryTextFormat = props.secondaryTextFormat || "percent"
    const secondaryTextCurrencySymbol = props.secondaryTextCurrencySymbol || "$"
    const secondaryTextDigits = props.secondaryTextDigits || 1
    const secondaryTextAbbreviate = props.secondaryTextAbbreviate || false
    
    const inputQuery = props.query

    const xLimit = props.xLimit

    const [data, setData] = useState({})
    const [options, setOptions] = useState({})

    const prepareData = async ()=>{

      let query = ""
      if (inputQuery !=""){
        query = inputQuery;
      }else if(aggregationMethod == "sum"){
        query = `SELECT "${categoryLabels}" as label, sum("${fieldToAggregate}") as value from ${tableName} group by "${categoryLabels}" order by sum("${fieldToAggregate}") desc`
      }else{
        query = `SELECT "${categoryLabels}" as label, count(distinct "id") as value from ${tableName} group by "${categoryLabels}" order by count(distinct "id") desc;`
      }
      
        try{
          const response = await getData(query)

          let totalRecords = response.length

          // get total
          let total=0
            response.map(item=>{
              total += parseFloat(item.value)
            })

        
          // Additional fields needed for pareto chart
            var pareto_data =[]
            var running_total = 0
            let running_pct_of_total = 0
            let tail_value = 0
            let tail_pct_of_total = 0
            let tail_running_total = 0
            let tail_running_pct_of_total = 0

            await response.forEach((item,index)=>{
              if(index<=(xLimit-1)){
                var value = Number(item.value)
                var pct_of_total = Number((100*value / total).toFixed(2))
                running_total = Number(parseFloat(running_total + value).toFixed(0))
                running_pct_of_total = Number(parseFloat(100*(running_total / total)).toFixed(2))
                var new_data = {pct_of_total, running_total,running_pct_of_total}
                var updated_item = {...item,...new_data}
                pareto_data.push(updated_item)
              }
              else{
                tail_value = tail_value + Number(item.value)
                tail_pct_of_total = Number((100*tail_value / total).toFixed(2))
                tail_running_total = Number(parseFloat(running_total + tail_value).toFixed(0))
                tail_running_pct_of_total = Number(parseFloat(100*(tail_running_total / total)).toFixed(2))
              }
              
            })
            
            //Create Tail Bar
            if(totalRecords > (xLimit-1)){
              let tail_item = {
                label: "Others",
                value: tail_value, 
                pct_of_total: tail_pct_of_total, 
                running_total: tail_running_total,
                running_pct_of_total: tail_running_pct_of_total
              }
              pareto_data.push(tail_item)
            }

            //console.log(pareto_data)
        
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
                    label: barDataTitle,
                    data: barData,
                    backgroundColor: barColors || "rgba(0,100,200,0.25)",
                    order: 0,
                    datalabels: 
                      {
                        color: barValueColors || "rgb(0,100,200)",
                        display: 12,
                        anchor: "end",
                        align: "top",
                        offset: "1",
                        font: {
                          weight: 'bold',
                          size: 10
                        },
                        formatter: function(value) {
                          return formatValue(value,primaryTextFormat,primaryTextCurrencySymbol,primaryTextDigits,primaryTextAbbreviate);
                        }
                      },
                },
                { 
                    type: 'line',
                    label: 'Running % of Total',
                    data: lineData,
                    borderColor: lineColors || "rgba(200,200,200,0.5)",
                    backgroundColor: lineColors || "rgba(200,200,200,0.5)",
                    order: 1,
                    pointStyle: 'circle',
                    pointRadius: 4,
                    datalabels: 
                      {
                        color: lineValueColors || "rgb(200,200,200)",
                        display: 12,
                        anchor: "end",
                        align: "top",
                        offset: "1",
                        font: {
                          weight: 'bold',
                          size: 10
                        },
                        formatter: function(value) {
                          return formatValue(value,secondaryTextFormat,secondaryTextCurrencySymbol,secondaryTextDigits,secondaryTextAbbreviate);
                        }
                      }
                }
                ]
            }
            setData(d)
            prepareOptions(d)
        }catch(error){
            //console.log(error)
        }
    }    
        
    

    const prepareOptions = (data) => {
      const numberOfCategories = data.labels.length;
    
      let fontSize = 12;
      let xRotation = 0;
    
      if (numberOfCategories > 5) {
        fontSize = 10;
        xRotation = 90;
      }
    
      const options = {
        maintainAspectRatio: false,
        layout: {
          padding: {
            bottom: 0,
          },
          legend: {
            position: "bottom",
          },
        },
        scales: {
          x: {
            type: 'category',
            position: 'bottom',
            grid: {
              display: false,
            },
            align: 'center',
            ticks: {
              autoSkip: false,
              minRotation: xRotation,
              maxRotation: xRotation,
              font: {
                size: fontSize,
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              display: false,
            },
            display: false,
          },
        },
        plugins: {
          title: {
            text: chartTitle,
            display: true,
            color: 'black',
            font: {
              size: 20,
            },
          },
        },
      };
    
      // Custom plugin for label wrapping
      options.plugins = {
        ...options.plugins,
        customLabels: {
          formatter: (value, context) => {
            const label = data.labels[context.dataIndex];
            return label.split("_").join(" "); // Replace underscores with spaces
          },
        },
      };
    
      setOptions(options);
    };

   

    useEffect(()=>{
      prepareData()
  },[props])

    
  return (
    <div className="container p-3">
      {Object.keys(data).length>0 && Object.keys(options).length>0 && 
          <Bar data={data} options={options} />
      }
    </div>
  );
};

export default ParetoChart;


