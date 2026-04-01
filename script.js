fetch("https://newsapi.org/v2/everything?q=keyword&apiKey=343c66a344734376a0e964a8edb3e27b")
    .then((response) => response.json())
    .then((data) => {
    console.log(data);
    const root = document.getElementById("root");

    data.articles.forEach((art) => {
    const div = document.createElement("div");
    div.id = "article";

    div.innerHTML = `
    <p><strong>Title:</strong> ${art.title}</p>
    <p><strong>Description:</strong> ${art.description}</p>
    <p><strong>Content:</strong> ${art.content}</p>
    <a href="${art.url}" target="_blank">Read Full Article</a>
    <p><strong>Date of Publication:</strong> ${art.publishedAt}</p>
    p><strong>Source:</strong> ${art.source.name}</p>
    `;

    root.appendChild(div);
    });
})
.catch((error) => {
    console.error("Error fetching news:", error);
});