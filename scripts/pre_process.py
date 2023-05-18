import csv
import pandas as pd
import os

def merge():
    all_data = []
    reader = csv.DictReader(open('data/raw/stanford_crime.csv'))
    for row in reader:
        # if row is empty, add data to past row
        if (row['Reported'] == ''):
            added_info = " \n" + row['Nature'] + ""
            all_data[-1]['Nature'] += added_info
        else:
            all_data.append(row)
    
    with open('data/processed/stanford_crime_merged.csv', 'w') as csvfile:
        fieldnames = ['Nature','Case #','Reported','Occurred','Location','Disposition','On Campus?','Area']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for row in all_data:
            writer.writerow(row)

def clean_date():
    pd.set_option("display.max_columns", 10)
    pd.set_option("display.max_rows", 50)

    from pathlib import Path
    base_dir = Path(__file__).parents[1]
    path = os.path.join(base_dir, "data/processed/stanford_crime_merged.csv")
    df = pd.read_csv(path)

    df.columns = [col.lower().replace(" ", "_") for col in df.columns]

    df.insert(3, "date", None, allow_duplicates = True)
    df.insert(4, "time", None, allow_duplicates = True)

    from datetime import datetime
    for iterate, row in df.iterrows():
        entry = row["reported"]
    # for iterate, entry in df["reported"].iteritems():
        try: 
            date_object = datetime.strptime(entry, "%m/%d/%Y %H:%M")
            df.loc[iterate, "date"] = date_object.strftime("%m/%d/%Y")
            df.loc[iterate, "time"] = date_object.strftime("%H:%M")
        except ValueError:
            df.loc[iterate, "date"] = datetime.strptime(entry, "%m/%d/%Y").strftime("%m/%d/%Y")
        else:
            clean_time = date_object.strftime("%H:%M")
            clean_date = date_object.strftime("%m/%d/%Y")
            df.loc[iterate, "date"] = clean_date
            df.loc[iterate, "time"] = clean_time

    df.to_csv("data/processed/stanford_crime_clean.csv")

if __name__ == "__main__":
    merge()
    clean_date()