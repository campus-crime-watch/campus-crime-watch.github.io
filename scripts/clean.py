import csv
import pandas as pd
import os

pd.set_option("display.max_columns", 10)
pd.set_option("display.max_rows", 50)

from pathlib import Path
base_dir = Path(__file__).parents[1]
path = os.path.join(base_dir, "data/processed/stanford_crime_geocoded.csv")
df = pd.read_csv(path)

df.columns = [col.lower().replace(" ", "_") for col in df.columns]

df.insert(3, "date", None, allow_duplicates = True)
df.insert(4, "time", None, allow_duplicates = True)

from datetime import datetime
for iterate, entry in df["reported"].iteritems():
    try: 
        date_object = datetime.strptime(entry, "%m/%d/%y %H:%M")
        df.loc[iterate, "date"] = date_object.strftime("%m/%d/%y")
        df.loc[iterate, "time"] = date_object.strftime("%H:%M")
    except ValueError:
        df.loc[iterate, "date"] = datetime.strptime(entry, "%m/%d/%y").strftime("%m/%d/%y")
    else:
        clean_time = date_object.strftime("%H:%M")
        clean_date = date_object.strftime("%m/%d/%y")
        df.loc[iterate, "date"] = clean_date
        df.loc[iterate, "time"] = clean_time

df.to_csv("stanford_crime_clean.csv")