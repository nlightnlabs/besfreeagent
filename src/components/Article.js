
import { getRecord } from './apis/nlightn.js'
import * as crud from "./apis/crud.js"
import React, {useState, useContext, useEffect, useRef} from 'react'
import {Context} from "./Context.js"
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import {UTCToLocalDate} from "./functions/formatValue.js"

const Article = () => {

    const {
        appData,
      } = useContext(Context)

    
    const users = appData.users
    const [author, setAuthor] = useState({})
    const [article, setArticle] = useState({})
    
    const getArticle = async ()=>{
        
        const articleId = appData.selected_article_id
        console.log("articleId",articleId)

        const environment = window.environment;
        let appName = "announcements"
        if(environment =="freeagent"){
            appName = "announcement"
        }

        const conditionalField = "id"
        const condition = articleId
 
        const response = await crud.getRecord(appName, conditionalField, condition)
        console.log("article data",response)
        setArticle(response)
        
        const authorUserId = await response.author_user_id.toString()
        console.log("authorUserId",authorUserId)
        console.log("users",users)
        console.log("author data",users.data.find(u=>(u.id).toString()===authorUserId))
        setAuthor(users.data.find(u=>u.id.toString()===authorUserId))
    }


    useEffect(()=>{
        getArticle()
     },[])


    const imageStyle={
        width: "100%",
        maxHeight: "300px",
        borderRadius: "10px",
        boxShadow: "5px 5px 15px gray",
        marginBottom: 15,
        minWidth: "300px",
        maxWidth: "100%",
    }

    const headlineStyle={
        fontSize: "32px",
        fontWeight: "Bold",
    }

    const dateStyle={
        color: "gray",
    }

    const authorStyle={
        color: "gray",
    }

    const bodyStyle={
        fontSize: "16px"
    }

    const footNotesStyle={
        color: "gray",
        fontSize: "12px"
    }

    const pageStyle = `
        .article-text {
            color: blue;
        }
    `
  ;

  const [pageClass, setPageClass] = useState("flex-container animate__animated animate__fadeIn animate__duration-0.5s")


  return (
    <div className={pageClass}>
        
        <div className="d-flex justify-content-center">
            <div className="d-flex flex-column w-75 w-sm-100">
                <img src={article.cover_image} style={imageStyle}></img>
                <div className="mb-5">
                    <div style={headlineStyle}>{article.headline}</div>
                    <div style={authorStyle}>Posted by: <span style={{color: "#5B9BD5", fontWeight: "bold"}}>{article.author}, {author.job_title}</span></div>
                    <div style={dateStyle}>{UTCToLocalDate(article.date)}</div>
                </div>
                <div>
                    <div style={bodyStyle} dangerouslySetInnerHTML={{ __html: article.content}} />
                    {/* <p className="article-text" style={bodyStyle}>{article.content}</p> */}
                </div>
                <div>
                    <div style={footNotesStyle}>{article.footNotes}</div>
                </div>
            </div>
        </div>
        <style>{pageStyle}</style>
    </div>
  )
}

export default Article