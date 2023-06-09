# How We Created Campus Crimewatch

**We are not actively maintaining this site. Pull requests are not accepted. Please fork this repo and create your own site!**

This project is protected by copyright. See our LICENSE. 

The data on Campus Crimewatch consists of daily crime incident reports from from January 1, 2019 to April 18, 2023 at Stanford University. 

Below, we'll walk you through how we developed the different components of Campus Crimewatch and its web page. You can use our guide to create this web app for your college campus, too! 

### Table of Contents  
* [Installing Python Libraries](#installing-python-libraries)
* [Getting Started](#getting-started)
* [Data Cleaning & Analysis](#data-cleaning--analysis)
* [Files & Directories](#files--directories)
* [Making The Web App Go Live](#making-the-web-app-go-live)
* [Building The Map](#building-the-map)
* [Creating The News Ticker](#creating-the-news-ticker)
* [Building The Histogram](#building-the-histogram)
* [Creating The Summary Statistic Sentences](#creating-the-summary-statistic-sentences)
* [Github Actions](#github-actions)
* [Disclaimers](#disclaimers)

## Installing Python libraries

Campus Crimewatch was created using Python, HTML, CSS, and JavaScript. If you're new to Python, here's some helpful guides that will help you nail the basics needed to execute this project. 
* [Hitchhiker's Guide to Python](https://docs.python-guide.org/)
* [Python Standard Library](https://docs.python.org/3.7/library/index.html). 

Libraries that we use in this project:
  * [pdfplumber](https://pypi.org/project/pdfplumber/#visual-debugging) - extracting data from pdf files 
  * csv - reading/writing CSV files
  * json - reading/writing JSON
  * os - working with OS, e.g. getting environment variables and walking directory/file trees
  * data analysis and viz - [jupyter](https://jupyter-notebook.readthedocs.io/en/stable/), [pandas](https://pandas.pydata.org/pandas-docs/stable/), [altair](https://altair-viz.github.io/)
  * [feedparser](https://feedparser.readthedocs.io/en/latest/) - grabs from RSS feeds
  * [shapely](https://pypi.org/project/shapely/) - manipulating geometric objects
  * [geopandas](https://geopandas.org/en/stable/) -  working with geospatial data in Python
  * <em>JavaScript:</em> [ScrollReveal](https://scrollrevealjs.org/guide/hello-world.html) -  animates elements as they enter or leave the viewport
  * <em>JavaScript:</em> [Mapbox](https://www.mapbox.com/mapbox-gljs) - web map
  * <em>JavaScript:</em> [Flatpickr](https://flatpickr.js.org/) - datetime picker for customized time filter

## Getting Started

Spend some time reading through our files/scripts which have comments describing the purpose of each code block and how you can personalize our code for your specific dataset. 

After you've obtained the daily crime log dataset from your university, make sure to drop it in the data/raw folder to get started. 

## Data Cleaning & Analysis

Cleaning your dataset will be the step you should spend the most time and headaches on. We recommend using a Jupyter Notebook to play with the data and see the gaps or inconsistencies that you would need to solve. 

This is a good time to check and possibly fix the data types. You want your date values and crime/incident descriptions to be strings for ease of display on the website. Column headers should be all lowercase and snakecase. 

You can create a data pipeline that will:
  1: grab crime data
  2: clean the data for inconsistencies & standardize the date column
  3. geocode the locations so you can display exact locations on the map
  4. standardize the crime categories so that you can show summary statistics for each type of crime
  5. create sentences for these summary statistics
  6. export all this data to a geojson file for the interactive map

**How the data pipeline works**
* `extract.py` extracts the crime data from the pdf file using a Python module called pdfplumber. If your school gave you data in another format, like a csv file or an API, you will have to grab the data another way. Regardless, this is a step and script that you must have in the pipeline. 

* `pre_process.py` cleans the extracted data. Column headers will be edited to snakecase. We will seperate the date and time from the reported date column into their own seperate columns. 

* `clean_geocode.py` creates exact, standardized addresses that can be used in the map. NOTE: We use a Stanford ArcGIS tool to get the addresses. For your university, you will have to find your own geocoding methods. 

* `crime_category.py` uses the geocoded crime dataset to create counts of the general categories of crime from the Clery Act. This is our way of standardizing the incident names to get general counts of each crime without going through the massive pain and headache of editing each incident name. Then, sentences are created that describe the percent change in each crime category from year to year. These sentences are written to a json file to be displayed on the web app. 

* `csv_to_geojson.py` takes the crime categories created above and the geo locations and writes them to a json file in the docs/data folder to be used in the map. 

## Files & Directories

Below is an overview of the project structure:

```   
├── Pipfile
├── Pipfile.lock
├── README.md
├── data
│   ├── processed (Raw data that has been transformed)
        ├── e.g. daily_crime_clean.csv
        └── ready_for_json.csv
│   └── raw (Copy of original source data)
        └── e.g. daily_crime_raw.pdf
├── docs (All the files that generate the web app - HTML, CSS, JavaScript)
    └── data (json files full of data used by JavaScript files)
        ├── news_feed.json
        ├── stat_sentences.json
        └── crime.geojson
    ├── index.html
    ├── about_page.html
    ├── clery_act.html
    ├── main_page.css
    ├── data_viz.js
    ├── histogram.js
    ├── map.js
    ├── news_ticker.js
    └── sentences.js
├── notebooks (Jupyter notebooks checking the quality of our dataset)
    └── data_quality.ipynb
├── scripts (Number-prefixed data processing scripts)
│   ├── extract.py
    ├── pre_process.py
    ├── clean_geocode.py
    ├── crime_category.py
    ├── csv_to_geojson.py
    ├── feed.py
    └── run_pipeline.py
```

## Making The Web App Go Live

We found it the easiest to host the web app through [GitHub Pages](https://pages.github.com/) so that the app is hosted directly from the existing GitHub repository, reflecting the latest changes and commits.

For a step-by-step guide and more information, please consult the [official documentation](https://docs.github.com/en/pages). The following are some crucial points for the app to go live:
* Make sure the name of the repository from which the web app is deployed is ***organization_name.github.io*** where ***organization_name*** matches the name of your organization precisely. In our case, since our organization name is `campus-crime-watch`, we named the repo `campus-crime-watch.github.io`. This way, you'll have a nice and clean URL. 
* To keep it clean, our web app is deployed from a folder in the main branch of the repo called [`docs`](https://github.com/campus-crime-watch/campus-crime-watch.github.io/tree/main/docs). This folder holds all the HTML, CSS and JS files, as well as the finalized GeoJSON data (product of the data pipeline) that would be later added as the underlying data source of the map.  

## Building The Map

The map is created using [Mapbox GL JS](https://www.mapbox.com/mapbox-gljs), a JavaScript library for customizable interactive web map.

For more instructions on installation, please refer to the [quick start guide](https://docs.mapbox.com/mapbox-gl-js/guides/install/). You will need a Mapbox account and a unique Mapbox access token to get started. 
 
How to display the crime data on the map:

* In your HTML file, include a `<div>` container and give it a unique `id`. This id will be refered to when initializing the map.
* `map.js` contains where all of our code for initialization, jittering and plotting the data points, filtering through dropdown menu, as well as tooltips and legend. Please refer to different sections of the file for specific features and functions. 
* The GeoJSON file containing the data points (the output of `csv_to_geojson.py`) is added via a `"data"` property when accessing the `map.addSource` method. The value of the `"data"` property is a URL of the GeoJson file, should have already been written into `docs/data` as an output of the data pipeline. In our case, the URL is '(https://campus-crime-watch.github.io/data/stanford_crime.geojson)'

For more information, see [Mapbox GL JS guides](https://docs.mapbox.com/mapbox-gl-js/guides/) for detailed documentation of options. 

## Creating The News Ticker

The News Ticker displays as a black strip on top of the site if you customize the process for accquiring crime related news for your campus. A good place to look for pre-exisitng news feeds would be your school paper, or a local news outlet that covers crime on or near campus. Its possible that you want to pull data in from multiple sources and combine them into a single news feed. 

All this is possible by customizing `scripts/feed.py`. This script can be run using GitHub Actions ([GitHub Actions documention](https://palewi.re/docs/first-github-scraper/)) via the `.github/workflows/feed.yml` file.

For example, Stanford has a daily police blotter and sometimes has 'Crime & Safety' articles. The Stanford news ticker checks the Stanford Daily's news feed every 2 hours and updates the ticker if there are new relevant articles.

How it works: 
* the `ticker` element in `index.html` has the html for the ticker, and `main_page.css` gives the scrolling animation.
* `feed.py` takes from a RSS news feed (e.g. https://stanforddaily.com/feed/), parses it using `feedparser`, iterates the entries to find relevant news (e.g. news with "Crime & Safety" tag), and takes the `title`, `date`, and `link` to create a dictionary: 
  ```
  {news: [
           {title: 'Example Title 1',
            date: '04/02/2023',
            link: 'unversitydaily.com/exampletitle1'},
           {title: 'Example Title 2',
            date: '04/03/2023',
            link: 'unversitydaily.com/exampletitle2'}
         ]
   }
  ```
  It writes this data to `docs/data/news_feed.json`.
* `news_ticker.js` adds news from `news_feed.json` to the `ticker` element.
* `.github/workflows/feed.yml` allows GitHub to run `feed.py` on schedule (e.g. every two hours, see `cron: '0 */2 * * *'` in `feed.yml`).

Make your own:
* Find your RSS feed(s), and replace the https://stanforddaily.com/feed/ link in `feed.py`. Here's some [tips](https://help.socialbee.com/article/78-how-can-i-find-the-rss-feed-of-a-website) on how to find a site's RSS feed.
* Each RSS feed is formatted differently. Adjust the `feed.py` script to scrape for relevant articles. It should ideally take the `title`, `date` and `link`.
* Adjust the `cron` of `feed.yml` to run on your preffered schedule. This [tool](https://crontab.guru/) creates a cron schedule.

## Building The Histogram
The histogram uses d3.js to shows crime counts by year and month. It relies on the fact that the `.geojson` data has date related inforamtion to help sort.

How it works: 
* the `#my_dataviz` element in `index.html` creates a histogram placehodler and option buttons (e.g. Per Year, Per Month). 
* `histogram.js` builds the histogram on the client-side (organizes crime data in realtime), depending on what option is clicked. Here's a rundown of what's going on:
  * lines 28-32 sets event listeners to the buttons so if an option is changed, it calles `updateOption()`
  * `updateOption()` gets the `.geojson` file of crime data and calls `buildHistogramData()`
  * `buildHistogramData()` creates an object for the histogram to display based on the view option. For example, if a user picks 'Per Year', then the `cateogry` is `year`, so `buildHistogramData()` creates an object like:
   ```
   histogram_data = {
     2019: 1369,
     2020: 764,
     2021: 698,
     2022: 1007,
     2023: 281,
   }
   ```
   depending on how your `.geojson` is formatted, creating this object will have different code.
  * `updateHistogram()` creates the graph, including axis labels, bars, and tooltip. The code defaults to x-axis labels for each bar, but can be customized (e.g. for the `month` option, our code shows each January)

## Creating The Summary Statistic Sentences 
These sentences are meant to give a quick overall view of crime on Stanford's campus from year to year. It displays the crime category from each year that had the highest number of reported crimes. 

How it works:
* the `create_sentences()` function from `crime_category.py` write sentences for the type of crime with the highest count for each year. It writes these sentences to `docs/data/stat_sentences.json`
* create a JavaScript file (`sentences.js`)
* `sentences.js` takes the sentences from `stat_sentences.json` and splits them into different parts (crime count, crime category, the rest of the sentence) so you can use CSS to add emphasis to the different sections of the sentences when they display. This code then uses the JavaScript library ScrollReveal to have the sentences and histogram appear on the viewpoint in a delayed manner that depends on when the user scrolls down. 

You can modify the code in `create_sentences()` to display different aspects of the data. For instance, if you have 5+ years of data, you can display the percent increase or increase in reported crime over the years, the number of active cases, the locations with the highest reported crimes, etc. 

## Github Actions

You can automate both the data pipeline and news ticker using [Github Actions](https://docs.github.com/en/actions). You can set a frequency for your code to run and you don't have to manually run it yourself. This is how our news ticker automatically updates itself when new articles are posted!

Check out `.github/workflows` to see our automation of the map (`map_data.yml) and news ticker (`feed.yml`). 

## Disclaimers
Remember that our code is made to fit the structure of Stanford's daily crime dataset. If your dataset is formatted differently (e.g. you need to make modifications to pdfplumber because the format is not standardized, there's extra or missing columns in your data, etc.), you should be mindful to modify our code to account for the differences in your dataset. 

There's quite a bit of manual labor to be done in the data cleaning process (e.g. scanning the dataset to make flags for the crime categories). Do not skip out on this work -- it's important for ensuring your work is accurate. 

If your school does not have an RSS feed or newspaper that reports on crime and safety you can find another way to incorporate the news ticker. Perhaps you could pull from Twitter conversations about public safety on your campus. 

There's an option to include a tip button where students can submit tips or comments on public safety on your campus. Perhaps this feature could be a moderated discussion board on the site. 

If you have to manually ask for data every six months or year, you cannot automatically update the dataset every few weeks since there's nothing it can automatically pull from. If you do have an API you can pull from, automating the dataset's updates is a crucial feature that you should implement. 
