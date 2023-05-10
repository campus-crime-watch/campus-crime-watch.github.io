from extract import grab_data
from pre_process import merge, clean_date
from clean_geocode import geocode_pipeline

"""
1: grab data
2: merge empty rows where nature is related to an entry above
3: clean the date and time (separate them into different columns)
4: geocode the locations
"""

def main():
    # input: pdf
    # outpu: stanford_crime.csv in data/raw
    grab_data()

    # input: stanford_crime.csv in data/raw
    # ouput: stanofrd_crime_merged.csv in data/processed
    merge()

    # input: stanford_crime_merged.csv in data/processed
    # output: stanford_crime_clean.csv in data/processed
    clean_date()

    # input: stanford_crime_clean.csv in data/processed
    # output: stanford_crime_clean_geocoded.csv in data/processed
    geocode_pipeline()

    #TODO: turn data into json file

if __name__ == "__main__":
    main()