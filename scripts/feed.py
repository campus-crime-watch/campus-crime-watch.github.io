import feedparser
from datetime import datetime
import json

NewsFeed = feedparser.parse("https://stanforddaily.com/feed/")
entries = NewsFeed.entries

news_dict = {"news" : []}

for entry in entries:
    for tag in entry["tags"]:
        if 'Crime & Safety' in tag.values():
            title = entry["title"]
            link = entry["link"]
            date_object = datetime.strptime(entry["published"], "%a, %d %b %Y %X %z")
            date_string = date_object.strftime("%a, %b %-d")
            news_dict["news"].append(
                {
                    "title": title,
                    "date" : date_string,
                    "link": link
                }
            )

# Serializing json
json_object = json.dumps(news_dict, indent=4)
 
# Writing to sample.json
with open("docs/data/news_feed.json", "w") as outfile:
    outfile.write(json_object)

# for (let i = 0; i < feed.items.length; i++) {
#     const item = feed.items[i];
#     if (item.categories.includes("Crime & Safety")) {
#         date = new Date(item.pubDate);
#         date_string = date.toLocaleDateString("en-US", options);
#         month = date.getMonth()+1;

#         const a = document.createElement("a");
#         const li = document.createElement("li");
#         a.textContent = "[" + date_string + "] " + item.title;
#         a.setAttribute('href', item.link);
#         li.appendChild(a);
#         ticker.appendChild(li);
#     }
#   }