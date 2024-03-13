export const arrayIsEmpty = (arr)=> {    
    for (let i = 0; i < arr.length; i++) {
        const obj = arr[i];
        const values = Object.values(obj);
        const allEmpty = values.every(value => value === null || value === undefined || value === "");
        if (!allEmpty) {
            return false; // At least one object has a non-empty value
        }
    }
    return true; // All objects have empty values
}

export const arrayObjectToString = (arrayObj)=>{
    console.log(arrayObj)
    let str=""
    arrayObj.map((item, index)=>{
      let itemString = ""
      Object.entries(item).map(([key,value],kevalueindex)=>{
        console.log("value",value)
        let updatedValue =value
        if(value !=null & value!="" & typeof value !="object"){
            updatedValue = value.toString().replace( /["'"]/g,"\\'").replace( /['"']/g,'\\"')
        }else{
            updatedValue=null
        }
        let keyValueString = `${key}:${updatedValue}`
        if(kevalueindex ==0){
            itemString = keyValueString
        }else{
            itemString = `${itemString},${keyValueString}`
        }    
    })
    itemString = `{${itemString}}`
    if(index ==0){
            str = itemString
        }else{
            str = `${str},${itemString}`
        }
    })
    let result = `[${str}]`
    return result
    
  }

