const ticker = document.getElementById("ticker");

async function updateNews() {
    
    const res = await fetch('data/news_feed.json')
    data = await res.json();
    feed = data["news"]

    for (let i = 0; i < feed.length; i++) {
        title = feed[i]["title"]
        date = feed[i]["date"]
        link = feed[i]["link"]

        const a = document.createElement("a");
        const li = document.createElement("li");
        a.textContent = "[" + date + "] " + title;
        a.setAttribute('href', link);
        li.appendChild(a);
        ticker.appendChild(li);
    }
}

updateNews()