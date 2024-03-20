import React, { useState, useEffect, useContext } from 'react';
import {Context} from "./Context.js"
import { askGPT,getList } from './apis/nlightn.js'
import {toProperCase} from './functions/formatValue.js'
import Spinner from './Spinner.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';

import { Document, Page, pdfjs } from 'react-pdf';
import MultiInput from './MultiInput.js';
import GenAISummarizeDocument from './GenAISummarizeDocument.js';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const GenAICreateSalesPitch = (props) => {

    const {user, users, appData} = useContext(Context)
    
    const [prompt, setPrompt] = useState("")
    const [response, setResponse] = useState("")
    const [waiting, setWaiting] = useState(false)
    const [formData, setFormData] = useState([])
    const [sections, setSections] = useState([])
    const [characterLimit, setCharacterLimit] = useState(300)
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [file, setFile] = useState(null)
    const [pdfText, setPdfText] = useState('');
    const [fileType, setFileType] = useState(null);


    const[businesses, setBusinesses] = useState([])
    const [pitchParams, setPitchParams] = useState({})

    const [documentText, setDocumentText] = useState("")


const getBusinesses = async ()=>{
  try{
      const response = await getList("businesses","registered_name")
      return(response.sort())
  }catch(error){
      console.log(error)
  }
}


const prepareFormData = async ()=>{

    let business_names = await getBusinesses()
    setBusinesses(business_names)

    const tones=[
      "Excited","Aggressive","Funny","Youthful","Diplomatic","Polite","Southern Hospitality","Conservative","Hip Hop","Surfer","Bro","Mafia"
    ]

    const generations=[
      "The Silent Generation (Born 1928-1945)",
      "Baby Boomers (Born 1946-1964)",
      "Generation X (Born 1965-1980)",
      "Millennials or Generation Y (Born 1981-1996)",
      "Generation Z or Zoomers (Born 1997-2012)",
      "Generation Alpha (Born after 2013)"
    ]

    const personalities =[
      "Jordan Belfort", 
      "Tony Robbins",
      "Kevin Hart",
      "Ellen DeGeneres",
      "Oprah Winfrey",
      "Barak Obama",
      "Suzie Orman",
      "Dwayne The Rock Johnson",
      "Kim Kardashian",
      "Leonardo DiCaprio",
      "Rob Dyrdek",
      "Donald Trump",
      "Snoop Dogg",
      "Joe Girard",
      "Zig Ziglar",
      "Dale Carnegie",
      "Brian Tracy", 
      "Tom Hopkins", 
      "Grant Cardone", 
      "David Ogilvy", 
      "Elmer Wheeler",
      "Frank Bettger",
    ]

    let form_data = [
        {id: 1, section: "style_and_approach", name: "use_the_following_tone", label: "What tone do you want to use?", list: tones, value:"Exited", type:"text"},
        {id: 2, section: "style_and_approach", name: "speak_like_a_person_in_this_generation", label: "What generational language style do you want to use?", list: generations, value:"Baby Boomer", type:"text"},
        {id: 3, section: "style_and_approach", name: "speak_like_this_famous_person", label: "What celebrity personality do you want to emulate", list: personalities, value:"Jordan Belford", type:"text"},
        {id: 3, section: "style_and_approach", name: "use_temperature_setting_in_chat_gpt", label: "Creativity Level (temperature setting for chatGPT)", list: null, value:40, type:"number"},
        {id: 4, section: "deal_info", name: "what_is_being_sold", label: "What are you trying to sell?", list: null, value:"", type:"text"},
        {id: 5, section: "deal_info", name: "main_differentiator_for_our_offerings", label: "What are the main differentiators in your offering?", list: null, value:"",  type:"text"},
        {id: 6, section: "deal_info", name: "measurable_business_value_the_we_can_deliver", label: "What are the key measurable business values you can deliver?", list: null, value:"",  type:"test"},
        {id: 7, section: "deal_info", name: "why_the_prospect_should_buy_now", label: "Why is now a good time to buy?", list: null, value:"",  type:"test"},
        {id: 8, section: "deal_info", name: "additional_points_about_why_the_prospect_should_buy", label: "Provide additional arguments for why the prospect should buy", list: null, value:"",  type:"textarea"},
        {id: 9, section: "prospect_info", name: "potential_customers_company_name", label: "Prospect's company name", list: business_names, value:"",  type:"text"},
        {id: 10, section: "prospect_info", name: "contact_name_of_potential_customer", label: "Name of contact at the prospect", list: null, value:"", type:"text"},
        {id: 11, section: "prospect_info", name: "job_title_of_potential_customer", label: "Job title of the contact at the prospect", list: null, value:"", type:"text"},
        {id: 12, section: "my_company_info", name: "my_company_name", label: "Your company's name", list: null, value: user.company_name,  type:"text"},
        {id: 13, section: "my_company_info", name: "my_name", label: "Your name", list: null, value:user.full_name, type:"text"},
        {id: 14, section: "my_company_info", name: "my_job_title", label: "Your job title", list: null, value:user.job_title, type:"text"},
      ]
      setFormData(form_data)

      let sectionSet = new Set()
      form_data.map(item=>{
        sectionSet.add(item.section)
      })
      let sectionList = Array.from(sectionSet);
      setSections(sectionList)
}

  useEffect(()=>{
    console.log(user)
    prepareFormData()
  },[props])

  function handleFileChange(event) {
    event.preventDefault()
    
    const selectedFile = event.target.files[0];
    setFileType(selectedFile.type)

    if(selectedFile.type == "application/pdf"){
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = async function (event) {
        const typedArray = new Uint8Array(event.target.result);
        const pdf = await pdfjs.getDocument(typedArray).promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const textItems = textContent.items.map((item) => item.str);
          const pageText = textItems.join(' ');
          fullText += pageText + '\n';
        }
        setPdfText(fullText);
        setNumPages(pdf.numPages);
      };
    reader.readAsArrayBuffer(selectedFile);
    }else{
      alert(`Can not read ${fileType} file type. Please upload a PDF file only.`)
      setFile(null)
    }
  }


  const createPitch = async(e)=>{
    
    e.preventDefault()
    setResponse("")
    setWaiting(true)

    let conditionList = ""
    Object.entries(pitchParams).map(([key,value], index)=>{
      if(index==0){
        conditionList = `${key.replaceAll("_"," ")}:${value}`
      }else{
        conditionList = `${conditionList}, ${key.replaceAll("_"," ")}:${value}`
      }
    })
    console.log(conditionList)

    let prompt = ""
    if (pdfText !=="" && pdfText !=null){
      prompt = `Generate a sales pitch based on the following conditions: ${conditionList} and the following information: ${pdfText}`
    }else{
      prompt = `Generate a sales pitch based on the following conditions: ${conditionList}`
    }
    
    console.log(prompt)
    
    try{
        const result = await askGPT(prompt)
        console.log(result)
        setResponse(result)
        setWaiting(false)
    }catch(error){
      console.log(error)
    }

  }

  const waitingModalStyle={
    position: "fixed", 
    top: '50%',
    left: '50%',
    translate: "-50% -50%",
    height: "300px", 
    width: "25vw", 
    top: "30vh",
    fontSize: "24px",
    fontWeight: "bold",
    zIndex: 999,
    cursor: "grab",
  }

const handlePageChange = (e)=>{
  const {name,value} = e.target
  name=="nextButton" && setPageNumber(Math.floor(pageNumber+1,numPages))
  name=="backButton" && setPageNumber(Math.ceil(pageNumber-1,1))
}

const handleInputChange = (e)=>{
    const {name,value} = e.target
    setPitchParams({...pitchParams,...{[name]:value}})
}


  return (
    <div className="d-flex justify-content-center w-100">
      {/* File Config and Preview */}
      <div className="d-flex flex-column p-3" style={{width: "40%", minWidth:500}}>
          <div className="d-flex flex-column bg-light p-3 rounded-3 shadow">
            <h6>Please complete the following information:</h6>
          <form>
            {/* Form Input */}
            <div className="d-flex flex-column" style={{height: 500, overflowY:"auto"}}>
                {sections.map((section,index)=>(
                    <div className="d-flex flex-column p-1">
                        {toProperCase(section.replaceAll("_"," "))}
                    {
                    formData && formData.map((item,index)=>(
                        item.section == section &&
                            <MultiInput 
                            key={item.id}
                            id={item.name}
                            name={item.name}
                            label={item.label}
                            value={item.value}
                            list = {item.list ? item.list : []}
                            type={item.type}
                            onChange={(e)=>handleInputChange(e)}
                        />
                    ))
                    }
                    </div>
                ))
            }
                 {/* File Config and Preview */}
          <div className="d-flex flex-column p-3" style={{minWidth: "50%"}}>
    
          <form>
            {/* File Input */}
            <div className="row align-items-center">
              <div className="form-group">
                <div className="col-sm-12">
                  <input 
                    id="file"
                    name="file"
                    className="form-control" 
                    type="file" 
                    style={{ color: "rgb(0,100,255)" }} 
                    onChange={handleFileChange} 
                    />
                </div>
                <p className="ms-1" style={{fontSize:"14px", color: "red"}}><span style={{fontWeight: "bold", color: "black"}}>Note: </span>Must be a PDF (Non Image Scan) File</p>
              </div>
            </div>

             {/* Character Limit */}
             <div className="mb-3 row align-items-center">
              <label htmlFor="character_limit" className="ms-1 col-sm-3 col-form-label">Character limit:</label>
              <div className="col-sm-3">
                <input
                  id="character_limit"
                  name="character_limit"
                  className="form-control"
                  type="number"
                  value={characterLimit}
                  onChange={(e) => setCharacterLimit(e.target.value)}
                  style={{ color: "rgb(0,100,255)" }}
                />
              </div>
            </div>
          </form>
         
            </div>


        

          {file &&
              <div className="d-flex flex-column p-3 rounded-3 shadow mt-3" style={{maxHeight:"400px", overflowY:"auto", backgroundColor: "rgba(255,255,255,0.75"}}>
                <div className="d-flex justify-content-between">
                  <h5>Preview: </h5>
                  <p>
                    Page {pageNumber} of {numPages}
                  </p>
                  <form>
                    <div className="btn-group">
                      {pageNumber>1 && <button name="backButton" className="btn text-secondary" onClick={handlePageChange}>{"Back"}</button>}
                      {pageNumber<numPages && <button name="nextButton" className="btn text-secondary" onClick={handlePageChange}>{"Next"}</button>}
                    </div>
                  </form>
                </div>
                <Document file={file}>
                    <Page pageNumber={pageNumber} />
                </Document>
              </div>
            }
        </div>


            {/* create pitch */}
            <div className="d-flex justify-content-center mt-3" style={{width: "100%"}}>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button id="createPitchButton" className="btn btn-primary" onClick={createPitch}>Create Pitch</button>
                </div>
            </div>
          </form>
          </div>
      </div>

       {/* Summary */}
       {response.length>0 && (
        <div className="d-flex flex-column p-3 animate__animated animate__fadeIn aniamte__duration-0.5s" style={{width: "60%", minWidth:400, overflowY:"auto"}}>
            <div className="d-flex flex-column p-3 border rounded rounded-3 bg-light shadow" 
            style={{height: "90%", backgroundColor: "rgba(255,255,255,0.75"}}>
                <h5>Result: </h5>
                <textarea style={{fontSize:"16px", fontFamily:"verdana"}} rows={40} className = "form-control"  readonly>{response}</textarea>
            </div>
          </div>
      )}

      {
        waiting && 
        <div className="d-flex flex-column justify-content-center bg-light shadow p-3 text-center border border-3 rounded-3" style={waitingModalStyle}>
            <Spinner/>
            <div>ChatGPT is working on a response.</div> 
            <div>Please wait...</div> 
        </div>
      }
    </div>
  );
};

export default GenAICreateSalesPitch;