import {addRecord} from "./apis/nlightn.js"

const updateActivity = async (req,res)=>{
    const {app, record, user, description} = req
    const formData = {
        app:app,
        record_id: record,
        user: user,
        description: description
    }
    await addRecord("activities",formData)
}

export default updateActivity