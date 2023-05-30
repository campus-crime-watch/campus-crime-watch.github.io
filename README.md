# How we created Campus Crimewatch

Below, we'll walk you through how we developed the different components of Campus Crimewatch and its web page. You can use our guide to create this web app for your college campus, too! 

## Setup

> Before using this project, please ensure all dependencies are installed. See the [project home page][] for details.

[project home page]: https://github.com/stanfordjournalism/cookiecutter-stanford-progj#requirements--setup

After creating this project:

* `cd campus-crimewatch`
* `pipenv install`

After creating or modifying files in your text editor of choice,
you should use these tasks to save your changes locally and push them to GitHub.

> It's good to get in the habit of running these commands whenever you wrap up a coding session.

```
cd campus-crimewatch

# Activate the virtual environment
pipenv shell

# Save the work and push to GitHub
invoke code.save
invoke code.push
```

## Installing Python libraries

* data analysis and viz - [jupyter][], [pandas][], [altair][]

The standard workflow is:

```
cd campus-crimewatch
# make a note of the libraries to be installed before starting
# Install one or libraries, e.g. requests and BeautifulSoup
pipenv install requests beautifulsoup4
```

## Files & Directories

Below is an overview of the project structure:

```   
├── Pipfile
├── Pipfile.lock
├── README.md
├── data
│   ├── processed (Raw data that has been transformed)
│   └── raw  (Copy of original source data)
├── lib (Re-usable Python code in .py files)
│   ├── __init__.py
│   └── utils.py
├── notebooks (Jupyter notebooks)
├── scripts (Number-prefixed data processing scripts)
│   └── 1-etl.py
└── tasks (invoke task definitions)
    ├── __init__.py
    └── code.py
        
```

## Reference

* [Hitchhiker's Guide to Python](https://docs.python-guide.org/)
* [Python Standard Library](https://docs.python.org/3.7/library/index.html). A few especially useful libraries:
  * csv - reading/writing CSV files
  * json - reading/writing JSON
  * os - working with OS, e.g. getting environment variables and walking directory/file trees


[BeautifulSoup]: https://www.crummy.com/software/BeautifulSoup/bs4/doc/
[invoke]: https://www.pyinvoke.org/
[jupyter]: https://jupyter.org/
[altair]: https://altair-viz.github.io/
[pandas]: https://pandas.pydata.org/pandas-docs/stable/
[pipenv]: https://pipenv.readthedocs.io/en/latest/
[requests]: https://2.python-requests.org/en/master/
[selenium]: https://selenium-python.readthedocs.io/
