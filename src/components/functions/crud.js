import * as nlightnApi from "../apis/nlightn"
import * as freeAgentApi from "../apis/freeAgent"

export const getData = async (appName) => {

    const environment  = window.environment 

    let response = []
    if(environment==="freeagent"){
        const FAClient = window.FAClient;
        response = await freeAgentApi.getFAAllRecords(FAClient, appName);
        console.log("data retrieved: ", response)
    }else{
        
        response = await nlightnApi.getTable(appName)
        return response.data
    }
    console.log(response)
    return response
};

export const updateRecord = async (appName, selectedRecordId, updatedForm) => {

    const environment  = window.environment 

    if(environment === "freeagent"){
        try {
            const FAClient = window.FAClient;
            await freeAgentApi.updateFARecord(FAClient, appName, selectedRecordId, updatedForm)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }else{
        await nlightnApi.updateRecord(appName,"id", selectedRecordId,updatedForm)
        const updatedData = await getData(appName)
    }
}


export const addRecord = async (appName, updatedForm) => {
    
    const environment  = window.environment 

    if(environment == "freeagent"){
        try {
            const FAClient = window.FAClient;
            delete updatedForm.id
            delete updatedForm.seq_id
            await freeAgentApi.addFARecord(FAClient, appName, updatedForm)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }else{
        await nlightnApi.addRecord(appName, updatedForm)
    }
}


export const deleteRecord = async (appName, selectedRecordId) => {

    const environment  = window.environment 
    
    if(environment == "freeagent"){
        try {
            const FAClient = window.FAClient;
            await freeAgentApi.updateFARecord(FAClient, appName, selectedRecordId)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }else{
        await nlightnApi.deleteRecord(appName,"id",selectedRecordId)
        const updatedData = await getData(appName)
    }
}