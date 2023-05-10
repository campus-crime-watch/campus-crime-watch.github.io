import csv
import pandas as pd
import os
from datetime import datetime 
import re

from pathlib import Path
base_dir = Path(__file__).parents[1]
path = os.path.join(base_dir, "data/processed/stanford_crime_clean.csv")
df = pd.read_csv(path)

df.insert(5, "year", None, allow_duplicates = True)

for iterate, date in df["date"].iteritems():
    date_object = datetime.strptime(date, "%m/%d/%y")
    clean_year = date_object.strftime("%Y")
    df.loc[iterate, "year"] = clean_year

clean_df = pd.DataFrame(columns = ["crime", "year", "crime_count"])
crime_categories = []
pattern = re.compile(rf"{crime_categories}", flags = re.IGNORECASE)
years = ["2019", "2020", "2021", "2022", "2023"]
counter = 0

for index, row in df.iterrows():
    if pattern.search(row["crime"]):
        counter += 1

df.to_csv('data/processed/crime_categories.csv', index = False)


# dictionary of list of regex, everytime it hits it, it adds a counter to that category, you 
# then take that counter and categories and create a csv file from it that can be analyzed 
# and displayed on site