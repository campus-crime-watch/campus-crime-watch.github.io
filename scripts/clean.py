import csv
import pandas as pd
import os

pd.set_option("display.max_columns", 10)
pd.set_option("display.max_rows", 50)

from pathlib import Path
base_dir = Path(__file__).parents[1]
path = os.path.join(base_dir, "data/raw/stanford_crime.csv")
df = pd.read_csv(path)

df.columns = [col.lower().replace(" ", "_") for col in df.columns]

df.insert(3, "date", None, allow_duplicates = True)
df.insert(4, "time", None, allow_duplicates = True)

for empty_row in df["nature"]:
    if df["case_#"] and df["reported"] and df["occured"] and df["location"] and df["disposition"] and df["on_campus?"] and df["area"] == None:
        df = 

from datetime import datetime
for entry in df["reported"]:
    if type(entry) != type(0.0):
        try: 
            date_object = datetime.strptime(entry, "%m/%d/%y %H:%M")
        except ValueError:
            date_object = datetime.strptime(entry, "%m/%d/%y")
        else:
            time = date_object.strftime("%H:%M")
            date = date_object.strftime("%m/%d/%y")
    else:
        df["date"] = date
        df["time"] = time

#whitespace trim for all data
#append not in the right scope, needs to be after every entry 
#need to make sure rows are not skipped when entering data into columns
    #solution: add empty rows with crime into the one with full rows above it

print(df)