# How We Created Campus Crimewatch

Below, we'll walk you through how we developed the different components of Campus Crimewatch and its web page. You can use our guide to create this web app for your college campus, too! 

## Installing Python libraries

Campus Crimewatch was created using Python, HTML, CSS, and JavaScript. If you're new to Python, here's some helpful guides that will help you nail the basics needed to execute this project. 
* [Hitchhiker's Guide to Python](https://docs.python-guide.org/)
* [Python Standard Library](https://docs.python.org/3.7/library/index.html). A few especially useful libraries:
  * csv - reading/writing CSV files
  * json - reading/writing JSON
  * os - working with OS, e.g. getting environment variables and walking directory/file trees
  * data analysis and viz - [jupyter](https://jupyter-notebook.readthedocs.io/en/stable/), [pandas](https://pandas.pydata.org/pandas-docs/stable/), [altair](https://altair-viz.github.io/)

The standard workflow is:

```
cd campus-crimewatch
# make a note of the libraries to be installed before starting
# Install libraries, e.g. jupyter and altair
pipenv install jupyter altair
```
## Getting Started

We will assume that you know how to create a Github project and repository. Once you've created one for this project and cloned it to your local machine, make sure you have the directories listed in the Files & Directories section below. 

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

## Files & Directories

Below is an overview of the project structure:

```   
├── Pipfile
├── Pipfile.lock
├── README.md
├── data
│   ├── processed (Raw data that has been transformed)
│   └── raw  (Copy of original source data)
├── docs (All the files that generate the web app - HTML, CSS, JavaScript)
    └── data (json files full of data used by JavaScript files)
├── notebooks (Jupyter notebooks checking the quality of our dataset)
├── scripts (Number-prefixed data processing scripts)
│   └── 1-etl.py

```

## Making The Web App Go Live

## Building The Map

## Creating The News Ticker

This feature is only possible if your university or the university's newspaper reports  

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
