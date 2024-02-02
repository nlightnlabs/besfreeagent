import React, {useState, useEffect, useContext, useRef} from 'react'
import axios from './apis/axios.js'
import { Context } from "./Context.js"
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';

const AdditionalInfo = () => {

  const {
    user,
    setUser,
    userLoggedIn,
    setUserLoggedIn,
    page,
    setPage,
    pages,
    setPages,
    pageName,
    setPageName,
    requestType,
    setRequestType,
    appData,
    setAppData,
    attachments,
    setAttachments,
    pageList,
    setPageList,
    requestTypes,
    setRequestTypes
  } = useContext(Context)

  const [formClassList, setFormClassList] = useState("form-group")

  let formData={}

  useEffect(()=>{
    console.log(appData)
    console.log(page)
    console.log(pageList)
  },[])

  const handleChange = (e)=>{

    const {name, value} = e.target
    let new_data = {[name]: value}
    formData = {...appData[`${page.data}`],...new_data}
    setAppData({...appData,[`${page.data}`]:formData})

  }

  let fileData=[]
  const gatherAttachments = async (e)=>{ 

    attachments.forEach(file=>{
      // console.log(file)

      let fileName = file.name
      const filePath=`spendFlow/intake/attachments/${appData["user_info"].email}/${fileName}`
      console.log(filePath)


      const uploadFiles = async (req, res)=>{

        //get secure url from our server
        const response = await axios.post(`/getS3FolderUrl`,{filePath: filePath})
        const url = await response.data

        const fileURL = await url.split('?')[0]

        //Post file directly to s3 bucket
        await fetch(url, {
          method: "PUT",
            headers: {
              "Content-Type": file.data.type
            },
            body: file.data
        })

      fileData = attachments
      fileData.filter(record=>record.name===fileName)[0].url = fileURL
      // console.log(`file data: ${JSON.stringify(fileData)}`)

      setAttachments(fileData)

      let request_summary = {...appData.request_summary,["attachments"]:fileData}
      setAppData({...appData, request_summary})
      // console.log(`formData: ${JSON.stringify(formData)}`)
      }
      uploadFiles()
    })
}

  const handleSubmit =async (e)=>{

    e.preventDefault();

    const form = e.target
    if(e.nativeEvent.submitter.name==="backButton"){
      setFormClassList("form-group")
      let pageListCopy = pageList
      let thisPage = pageListCopy.splice(-1)
      let nextPage = pageListCopy[pageListCopy.length-1]
      setPageList(pageListCopy)
      setPage(pages.filter(x=>x.name===nextPage)[0])
      setPageName(nextPage)
    }
    else{   

      if(!form.checkValidity()){
        e.preventDefault();
      }
      else{

        let appDataCopy = appData

        if(attachments.length>0){
          await gatherAttachments()
        }else{
          let request_summary = {...appDataCopy.request_summary,["attachments"]:[]}
          appDataCopy = {...appData, request_summary}
          setAppData({...appData, request_summary})
        }

        const addNewRequestToDb = async ()=>{
          const insertNewRequestQuery = `INSERT INTO requests (
            requester, 
            request_type, 
            subject, 
            request_details,
            need_by, 
            attachments,
            stage,
            status,
            request_date,
            requester_user_id
            )
            values(
              '${appDataCopy.request_summary.requester || "No requester on record"} ',
               '${appDataCopy.request_summary.request_type || "No reuquest types selected"}',
               '${appDataCopy.request_summary.subject || "No subject on record"}',
               '${appDataCopy.request_summary.request_details || "No request details provided"}',
              '${(new Date(appDataCopy.request_summary.need_by)).toLocaleDateString('en-US') || " No date on record"}',
              '${JSON.stringify(appDataCopy.request_summary.attachments).replace(/"/g,'') || "No attachments"}',
              'Draft',
              'Open',
              '${((new Date()).toLocaleDateString('en-US')) || " "}',
              '${appDataCopy.user_info.id}'
            );`
          
            console.log(insertNewRequestQuery)
            try {
                const submitResponse = await axios.post(`/db/query`,{query: insertNewRequestQuery})
                const data = submitResponse.data
                getRecordId()
            }catch(error){
                console.log(error)
            }
        }
        addNewRequestToDb()


        const getRecordId = async (req, res)=>{
            const getNewRecordIDQuery = `Select id from requests where requester_user_id ='${appData.user_info.id}' order by id desc limit 1;`
            console.log(getNewRecordIDQuery)
  
            try{  
              const responseId = await axios.post(`/db/query`,{query: getNewRecordIDQuery})
              console.log(responseId)
  
              const id = await responseId.data[0]
              console.log(id)
  
              let request_summary = {...appDataCopy.request_summary,...id}
              setAppData({...appData, request_summary})

              let nextPage = "Request Summary"
              setPage(pages.filter(x=>x.name===nextPage)[0])
              setPageList([...pageList,nextPage])
              setPageName(nextPage)
            }catch(error){
              console.log(error)
            }
        }
      }
      setFormClassList('form-group was-validated')
    }
  }

  const handleAttachment = (e)=>{

    const filesToUpload = e.target.files
    // console.log(filesToUpload)

    const fileList = Array.from(filesToUpload)
    fileList.forEach(item=>{
      // console.log(item)
      let att = {name: item.name, data: item, url: ""}
      fileData.push(att)
    })
    console.log(fileData)
    setAttachments(fileData)
    
    let request_summary = {...appData.request_summary,["attachments"]:fileData}
    setAppData({...appData, request_summary})

    if(e.target.value !== null){
      e.target.className="form-control text-primary"
    }else{
      e.target.className="form-control text-body-tertiary"
    }
  }

  const handleReset = ()=>{
    let resetData = appData
    for (const key in formData) {
      resetData[key] = ""
    }
    console.log(resetData)
    setAppData(resetData)
  }


  const [pageClass, setPageClass] = useState("container mt-5 animate__animated animate__fadeIn animate__duration-0.5s")

  return (
    <div className = {pageClass}>

      <div className="row">
        <div className="col"></div>

        <div className="col-lg-6">
          
          <h1 className="text-left mb-5 border-bottom border-5">Additional Info</h1>

          <div className="d-flex flex-column bg-light shadow border border-2 rounded p-3">

          <form name='form' id="form" onSubmit = {handleSubmit} className = {formClassList} noValidate>
              
              <div className="form-floating mb-3">
                <input id = "need_by" name= "need_by" type="date" className="form-control form-control text-primary" onBlur={handleChange} placeholder="When do you need this by?" required></input>
                <label htmlFor="need_by" className="form-label text-body-tertiary small">When do you need this by?</label>
              </div>
              
              <div className="form-floating mb-3">
                <textarea id="additional_notes" name="additional_notes" className="form-control form-control text-primary" rows="5" style={{height:"100%"}} onChange={handleChange} placeholder="Provide any other comments"></textarea>
                <label htmlFor="additional_notes" className="form-label text-body-tertiary small">Provide any other comments</label>
              </div>
              
              <div className="form-group mb-5">
                <label htmlFor = "attachments" className="form-label text-body-tertiary small">Attachments</label>
                <input 
                  id="attachments" 
                    name="attachments" 
                    className="form-control text-body-tertiary" 
                    type = "file" 
                    multiple
                    onKeyUp={handleChange} 
                    onChange={(e)=>handleAttachment(e)}
                  ></input>
              </div>

              <div className="d-flex flex-column justify-content-center">
              <div className="d-flex justify-content-center">
                <div className="btn-group">
                  <button name= "backButton" className="btn btn-outline-secondary" data-bs-toggle="button" >Back</button>
                  <button name="nextButton" className="btn btn-primary" data-bs-toggle="button">Next</button>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <button className="btn btn-light text-center mt-1 text-body-secondary d-block" style={{cursor: "pointer"}} onClick={handleReset}>Reset</button>
              </div>
            </div>

            </form>
          </div>
        
        </div>
        <div className="col"></div> 
      </div>
    </div>
  )
}

export default AdditionalInfo