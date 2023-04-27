import csv
import pandas as pd
import os

from pathlib import Path
base_dir = Path(__file__).parents[1]
path = os.path.join(base_dir, "data/raw/stanford_crime.csv")
df = pd.read_csv(path)

df.insert(3, "date", None, allow_duplicates = True)
df.insert(4, "time", None, allow_duplicates = True)

from datetime import datetime
for entry in df["Reported"]:
    if type(entry) != type(0.0):
        try: 
            date_object = datetime.strptime(entry, "%m/%d/%y %H:%M")
        except ValueError:
            date_object = datetime.strptime(entry, "%m/%d/%y")
        else:
            time = date_object.strftime("%H:%M")
        date = date_object.strftime("%m/%d/%y")

#append not in the right scope, needs to be after every entry
#need to make sure rows are not skipped when entering data into columns
#need to see what append() does, find different function

df["date"].append(date) 
df["time"].append(time)

print(df.head())
