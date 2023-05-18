import csv
import pandas as pd
import os
from datetime import datetime 
from pathlib import Path

def standardize_crimes():
    base_dir = Path(__file__).parents[1]
    path = os.path.join(base_dir, "data/processed/stanford_crime_clean.csv")
    df = pd.read_csv(path)

    df.insert(5, "year", None, allow_duplicates = True)

    for iterate, date in df["date"].iteritems():
        date_object = datetime.strptime(date, "%m/%d/%Y")
        clean_year = date_object.strftime("%Y")
        df.loc[iterate, "year"] = clean_year

    df["nature"] = df["nature"].str.replace(r'[/\:]',' ').str.lower()

    crime_flags = {"Homicide": ["homicide", "manslaughter"],
                "Sexual assault": ["lewd", "child", "peek in hole", "indecent exposure", 
                                    "peek", "sodomy", "oral", "sexual", "rape", "underwear", "sex"], 
                    "Burglary": ["burglary", "burg", "robbery"], 
                    "Assault": ["assault", "battery", "aggrevated", "injury", "false imprisonment"],
                    "Theft": ["petty theft", "lost property", "grand theft", "grnd thft",
                            "carjacking", "theft", "shoplifting", "stolen"],
                    "Arson": ["fire"], 
                    "Destruction of property": ["vandl", "vandalism", "deface", "damage"],
                    "Domestic violence": ["battery spouse", "spouse", "dom violence"],
                    "Stalking": ["stalking"],
                    "Weapons law violations": ["deadly weapon", "firearm", "weapon", "pos wpn", "exhibit"],
                    "Drug abuse violations": ["paraphernalia", "dui", "alcohol", "drug", "controlled substance",
                                            "cntl sub", "marijuana", "heroin", "smoking", "nitrous oxide"],
                    "Liquor law violations": ["liquor", "alcohol", "open container"], 
                    "Fraud": ["defraud", "false pretenses", "identity theft", "impersonation", "extortion", "fraud", "embez"],
                    "Annoying phone calls": ["annoy"],
                    "Hit and Run": ["hit"],
                    "Hate crime": ["swastika", "vio civil rghts", "noose", "hate"], 
                    "Non-Clery Act": ["animal bite", "abandoned vehicle", "cruelty to animals", "fire", "dis cndct", 
                                    "disord conduct", "disorderly conduct", "leash", "loiter", "loud", "drive",
                                    "tresspass", "trspss", "eavesdropping", "warrant", "wilfl dschrg", "offensive words", 
                                    "no id", "display unauth placard", "contempt", "false re", "nuisance", "unlawful",
                                    "disrupt", "disturb", "disturbance", "enter", "evading", "false bomb", "false id",
                                    "terrorize", "fail to", "obstruct", "reckless"]}

    crime_count = {}

    for index, row in df.iterrows():
        year = row["year"]
        nature = row["nature"]

        if year not in crime_count:
            crime_count[year] = {key: 0 for key in crime_flags.keys()}
        
        for key, value in crime_flags.items():
            if any(word.lower() in nature.lower() for word in value):
                crime_count[year][key] += 1
        
    count_df = pd.DataFrame.from_dict(crime_count, orient = "index")
    count_df = count_df.rename_axis("Year")
    count_df.columns = crime_flags.keys()

    count_df.to_csv("data/processed/crime_categories.csv")

if __name__ == "__main__":
    standardize_crimes()
