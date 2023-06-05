const ticker = document.getElementById("ticker");
const news_ticker = document.getElementsByClassName("news-ticker");

async function updateNews() {
    
    // tries to access news feed json, and calls error otherwise
    try {
        const res = await fetch('data/news_feed.json')
        data = await res.json();
        feed = data["news"]

        // remove news ticker if there's no new news
        if (feed.length == 0) {
            news_ticker[0].style.visibility = 'hidden';
        } else { // populates news ticker if thre is news
            news_ticker[0].style.visibility = 'visible';
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
    
    } catch (error) {
        // hides news ticker if there is no news feed json file
        news_ticker[0].style.visibility = 'hidden';
        console.log("No json file for news feed found. To set up a news ticker, follow the README:")
        console.log("https://github.com/campus-crime-watch/campus-crime-watch.github.io#creating-the-news-ticker")
    }
    
}

updateNews()