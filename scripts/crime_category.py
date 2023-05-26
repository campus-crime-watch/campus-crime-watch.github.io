import csv
import pandas as pd
import os
from datetime import datetime 
from pathlib import Path
import json

def standardize_crimes():
    base_dir = Path(__file__).parents[1]
    path = os.path.join(base_dir, "data/processed/stanford_crime_clean_geocoded.csv")
    df = pd.read_csv(path)

    df.insert(5, "year", None, allow_duplicates = True)
    df.insert(6, "month", None, allow_duplicates = True)
    df.insert(7, "week", None, allow_duplicates = True)
    df.insert(8, "day", None, allow_duplicates = True)

    for iterate, date in df["date"].items():
        date_object = datetime.strptime(date, "%m/%d/%Y")
        clean_year = int(date_object.strftime("%Y"))
        clean_month = date_object.strftime("%b")
        clean_week = int(date_object.strftime("%U"))
        clean_day = int(date_object.strftime("%-d"))
        df.loc[iterate, "year"] = clean_year
        df.loc[iterate, "month"] = clean_month
        df.loc[iterate, "week"] = clean_week
        df.loc[iterate, "day"] = clean_day

    df["nature"] = df["nature"].str.replace(r'[/\:]',' ').str.lower()

    crime_flags = {"Homicide": ["homicide", "manslaughter"],
                "Sexual assault": ["lewd", "child", "peek in hole", "indecent exposure", 
                                    "peek", "sodomy", "oral", "sexual", "rape", "underwear", "sex"], 
                    "Burglary": ["burglary", "burg", "robbery"], 
                    "Assault": ["assault", "battery", "aggrevated", "injury", "false imprisonment"],
                    "Theft": ["lost property", "grand theft", "grnd thft",
                            "carjacking", "theft",  "stolen"],
                    "Arson": ["fire"], 
                    "Destruction of property": ["vandl", "vandalism", "deface", "damage"],
                    "Domestic violence": ["battery spouse", "spouse", "dom violence"],
                    "Stalking": ["stalking"],
                    "Weapons law violations": ["deadly weapon", "firearm", "weapon", "pos wpn", "exhibit"],
                    "Drug abuse violations": ["paraphernalia", "dui", "alcohol", "drug", "controlled substance",
                                            "cntl sub", "marijuana", "heroin", "smoking", "nitrous oxide"],
                    "Liquor law violations": ["liquor", "alcohol", "open container"], 
                    "Hate crime": ["swastika", "vio civil rghts", "noose", "hate"], 
                    "Non-Clery Act": ["animal bite", "abandoned vehicle", "cruelty to animals", "fire", "dis cndct", 
                                    "disord conduct", "disorderly conduct", "leash", "loiter", "loud", "drive",
                                    "tresspass", "trspss", "eavesdropping", "warrant", "wilfl dschrg", "offensive words", 
                                    "no id", "display unauth placard", "contempt", "false re", "nuisance", "unlawful",
                                    "disrupt", "disturb", "disturbance", "enter", "evading", "false bomb", "false id",
                                    "terrorize", "fail to", "obstruct", "reckless", "annoy", "petty theft",
                                    "shoplifting", "hit", "defraud", "false pretenses", "identity theft",
                                    "impersonation", "extortion", "fraud", "embez"]}

    crime_count = {}
    category_column = []


    for index, row in df.iterrows():
        year = row["year"]
        nature = row["nature"]

        if year not in crime_count:
            crime_count[year] = {key: 0 for key in crime_flags.keys()}
        
        categories = []
        for key, value in crime_flags.items():
            if any(word.lower() in nature.lower() for word in value):
                crime_count[year][key] += 1
                categories.append(key)
        
        category_column.append(categories)

    # Counts
    count_df = pd.DataFrame.from_dict(crime_count, orient = "index")
    count_df = count_df.rename_axis("Year")
    count_df.columns = crime_flags.keys()

    count_df.to_csv("data/processed/crime_categories.csv") 

    # Category column
    df["category"] = category_column
    df.to_csv("data/processed/stanford_crime_clean_geocoded_categorized.csv")


def create_sentences():
    base_dir = Path(__file__).parents[1]
    path = os.path.join(base_dir, "data/processed/crime_categories.csv")
    df = pd.read_csv(path)

    prev_year = None
    prev_data = None
    sentences = []

    for index, row in df.iterrows():
        year = row["Year"]
        data = {category: int(row[category]) for category in df.columns if category != "Year"}

        if prev_year is not None:
            for category, value in data.items():
                prev_value = prev_data.get(category)
                if prev_value is not None:
                    if prev_value != 0:
                        pct_change = ((value - prev_value) / prev_value) * 100
                    else:
                        pct_change = 0
                    change_type = "increase" if pct_change > 0 else "decrease"
                    stat_sentence = f"{year}: {pct_change: .2f}% {change_type} in {category}"  
                    sentences.append(stat_sentence)  
            
        prev_year = year
        prev_data = data

    output_file = os.path.join(base_dir, "docs/data/stat_sentences.json")
    with open(output_file, "w") as f:
        json.dump(sentences, f)

if __name__ == "__main__":
    standardize_crimes()
    create_sentences()