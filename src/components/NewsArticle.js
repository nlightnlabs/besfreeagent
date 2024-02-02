
import { getRecord } from './apis/axios'
import React, {useState, useContext, useEffect, useRef} from 'react'
import {Context} from "./Context.js"
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import {UTCToLocalDate} from "./functions/formatValue.js"

const NewsArticle = () => {
    const {
        appData,
      } = useContext(Context)

    
    const [article, setArticle] = useState({})
    const getArticle = async ()=>{
        const articleId = appData.selected_article_id
        const params={
            tableName: 'news',
            recordId : articleId,
            idField: 'id'
        }
        const response = await getRecord(params)
        setArticle(response)
        
        const authorUserId = await response.author_user_id
        getUserData(authorUserId)
    }

    const [author, setAuthor] = useState({})
    const getUserData = async (authorUserId)=>{
        
        const params={
            tableName: 'users',
            recordId : authorUserId,
            idField: 'id'
        }
        const response = await getRecord(params)
        setAuthor(response)
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
                <img src={article.image_url} style={imageStyle}></img>
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

export default NewsArticle