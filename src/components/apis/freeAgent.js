import axios from "axios";
console.log(`Environment: ${process.env.NODE_ENV}`);

export const baseURL = process.env.NODE_ENV==="production" ? "https://nlightnlabs.net" : "http://localhost:3001"


export default axios.create({
  baseURL,
})

export const dbUrl = axios.create({
  baseURL,
})

//General Query
export const queryFA = async (appName)=>{
    
    // query should be an object like this:
    // {query: "query{listEntityValues(entity: \"app_system_name_in_freeagent\", limit: 100){ entity_values {id, field_values} } }"}
    const query = {query: `query{listEntityValues(entity: \"${appName}\", limit: 100){ entity_values {id, field_values} } }`}

    try {
        const response = await dbUrl.post("/freeAgent/query", query);
        console.log(response);
        const data = response.data;
        return data;
    } catch (error) {
        throw new Error("Error fetching data: " + error);
    }
}


//Get Free Agent User Data
export const getFAUsers = async ()=>{

    const query = {query: "query{getTeamMembers(active: true) {agents {id, full_name, teamId, email_address, access_level, status, job_title, roles {id, name, import, export, bulk_edit, bulk_delete, task_delete, is_admin}, subteams {id, name, description}}}}"}
    
    try {
        const response = await dbUrl.post("/freeAgent/query",query);
        console.log(response);
        const data = response.data.getTeamMembers.agents;
        return data;
    } catch (error) {
        throw new Error("Error fetching data: " + error);
    }
}


//Get Free Agent Apps
export const getFAApps = async ()=>{

    const query  = {query: "query{getEntities(alphabetical_order:true) {name, display_name, label, label_plural, entity_id}}"}
    
    try {
        const response = await dbUrl.post("/freeAgent/query",query);
        console.log(response);
        const data = response.data.getEntities;
        return data;
    } catch (error) {
        throw new Error("Error fetching data: " + error);
    }
}


//Standard function to get all records from a FreeAgent App
export const getFAAAppRecords = async (appName) => {

    const query = {query: `query{listEntityValues(entity: \"${appName}\"){ entity_values {id, field_values} } }`}
    // {query: "query{listEntityValues(entity: \"app_system_name_in_freeagent\", limit: 100){ entity_values {id, field_values} } }"}

    try {
        const response = await dbUrl.post("/freeAgent/query", query);
        console.log(response);

        const data = response.data.listEntityValues.entity_values;

        const result = data.map(record => {
            let rowData = { id: record.id };
            Object.entries(record.field_values).forEach(([key, value]) => {
                let val = value.display_value;
                if (typeof val === "object") {
                    val = JSON.stringify(val);
                }
                rowData = { ...rowData, [key]: val };
            });
            return rowData;
        });

        return result;
    } catch (error) {
        throw new Error("Error fetching data: " + error);
    }
   
};


//Standard function to get specific records from a FreeAgent App
export const getFAAAppRecordsSubset = async (appName, fields, filters, order, limit, offset, pattern)=>{

    const query = {query: `query{listEntityValues(entity: \"${appName}\", filters: \"${fields}\", filters: \"${filters}\", order: \"${order}\", limit: \"${limit}\", offset: \"${offset}\", offset: \"${pattern}\"}){ entity_values {id, field_values} } }`}

    try {
        const response = await dbUrl.post("/freeAgent/query", query);
        console.log(response);

        const data = response.data.listEntityValues.entity_values;
        console.log(data)

        const result = data.map(record => {
            let rowData = { id: record.id };
            Object.entries(record.field_values).forEach(([key, value]) => {
                let val = value.display_value;
                if (typeof val === "object") {
                    val = JSON.stringify(val);
                }
                rowData = { ...rowData, [key]: val };
            });
            return rowData;
        });

        return result;
    } catch (error) {
        throw new Error("Error fetching data: " + error);
    }
}

//Standard function to add a new record in a FreeAgent App
export const addFARecord = async (appName, formData)=>{
    let record = formData
    delete record.id
    delete record.seq_id

    let updatedFormData = "";
    let i=0;
    (Object.entries(record).map(([key,val])=>{
        if(i==0){
            updatedFormData = `${key}:\"${val}\"`
        }else{
            updatedFormData = `${updatedFormData}, ${key}:\"${val}\"`
        }
        i = i+1;
    }))
    console.log(updatedFormData)

    const query = {query: `mutation{createEntity(entity: \"${appName}\",field_values: {${updatedFormData}}){entity_value {id, seq_id, field_values}}}`}
    console.log("free agent query:", query)
    
    try {
        const response = await dbUrl.post("/freeAgent/query", query);
        const data = response.data.createEntity.entity_value;
        console.log(data)
        return(data)
    } catch (error) {
        throw new Error("Error fetching data: " + error);
    }

}


// Update record in FreeAgent
export const updateFARecord = async (appName, recordId, formData) => {

    let updatedFormData = "";
    let i=0;
    (Object.entries(formData).map(([key,val])=>{
        if(i==0){
            updatedFormData = `${key}:\"${val}\"`
        }else{
            updatedFormData = `${updatedFormData}, ${key}:\"${val}\"`
        }
        i = i+1;
    }))
    console.log(updatedFormData)

    const query = {query: `mutation{updateEntity(entity: \"${appName}\", id: \"${recordId}\",field_values: {${updatedFormData}}){entity_value {id, seq_id, field_values}}}`}
    console.log(query)
    try {
        const response = await dbUrl.post("/freeAgent/query", query);
        console.log(response);
        let data = response.data.updateEntity.entity_value;
        let updatedRecord = {id: recordId}
        console.log({...updatedRecord,data})
        return(data)
    } catch (error) {
        throw new Error("Error fetching data: " + error);
    }

};


//Update or delete a record in a Free Agent app
export const deleteFARecord = async (appName, recordId) => { 
    const query = {query: `mutation{deleteEntity(entity: \"${appName}\", id: \"${recordId}\"){ entity_value {id} }}`}
    console.log(query)
    try {
        const response = await dbUrl.post("/freeAgent/query", query);
        console.log(response);
    } catch (error) {
        throw new Error("Error fetching data: " + error);
    }
}


