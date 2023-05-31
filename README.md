# How We Created Campus Crimewatch

The data on Campus Crimewatch consists of daily crime incident reports from from January 1, 2019 to April 18, 2023 at Stanford University. 

Below, we'll walk you through how we developed the different components of Campus Crimewatch and its web page. You can use our guide to create this web app for your college campus, too! 

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
  * geopandas
  * [shapely](https://pypi.org/project/shapely/) - manipulating geometric objects
  * [geopandas](https://geopandas.org/en/stable/) -  working with geospatial data in Python

## Getting Started

We will assume that you know how to create a Github project and repository. Once you've created one for this project and cloned it to your local machine, make sure that you create the directories listed in the Files & Directories section below. 

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
* [`extract.py`] extracts the crime data from the pdf file using a Python module called pdfplumber. If your school gave you data in another format, like a csv file or an API, you will have to grab the data another way. Regardless, this is a step and script that you must have in the pipeline. 

* [`pre_process.py`] cleans the extracted data. Column headers will be edited to snakecase. We will seperate the date and time from the reported date column into their own seperate columns. 

* [`clean_geocode.py`] creates exact, standardized addresses that can be used in the map.

* [`crime_category.py`] uses the geocoded crime dataset to create counts of the general categories of crime from the Clery Act. This is our way of standardizing the incident names to get general counts of each crime without going through the massive pain and headache of editing each incident name. Then, sentences are created that describe the percent change in each crime category from year to year. These sentences are written to a json file to be displayed on the web app. 

* [`csv_to_geojson.py`] takes the crime categories created above and the geo locations and writes them to a json file in the docs/data folder to be used in the map. 

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
│   └── raw  (Copy of original source data)
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
    ├── map1.js
    ├── map2.js
    ├── news_ticker.js
    ├── scroll.js
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
* To keep it clean, our web app is deployed from a folder in the main branch of the repo called [`docs`](https://github.com/campus-crime-watch/campus-crime-watch.github.io/tree/main/docs). This folder holds all the HTML, CSS and JS files, as well as the finalized geojson data (product of the data pipeline) that would be later added as the underlying data source of the map.  


## Building The Map

## Creating The News Ticker

This feature is only possible if your university or the university's newspaper reports on crime on and near the university. Stanford has a daily police blotter, but if your school has reports every other week or so, you will have to adjust your code for that. 

How it works: takes from feed, makes a json, js file takes from json file and shows on the ticker

How to makea news ticker:
* find your universities RSS feed
* in code that scrapes from the RSS feed, formats crime and safety data into json data
* turn into a github action

## Building The Histogram

## Creating The Summary Statistic Sentences 

## Disclaimers
I think here we'll talk about roadblocks (features that cannot be implemented if data is or isn't a certain way, that they'll need to heavily customize based on what their dataset looks like)

We are journalists first and programmers second —— so our code might not be the most efficient or concise. We hope that collaboration from people with more coding skills and experience can bring Campus Crimewatch to its fullest potential. 

## Useful Libraries

[Jupyter notebooks are useful for seeing your altair charts before inserting them into your script.]: https://jupyter.org/
[Altair is a useful for creating data viz.]: https://altair-viz.github.io/
[Pandas is a powerful Python module that we used for data cleaning and analysis.]: https://pandas.pydata.org/pandas-docs/stable/
[pipenv]: https://pipenv.readthedocs.io/en/latest/
[requests]: https://2.python-requests.org/en/master/
