import { createRoot } from "react-dom/client"

fetch("https://newsapi.org/v2/everything?q=keyword&apiKey=343c66a344734376a0e964a8edb3e27b")
.then((response)=>response.json())
.then((data)=>{
    console.log(data)
    let a=data.articles.map((art)=>{
        return <div key={art.url} id="article">
            <p>Title: {art.title}</p>
            <p>Description: {art.description}</p>
            <p>Content: {art.content}</p>
            <a href={art.url} target="_blank">Read Full Article</a>
            <p>Date of Publication: {art.publishedAt}</p>
            <p>Source: {art.source.name}</p>
        </div>
    })
    createRoot(document.getElementById("root")).render(a)
})