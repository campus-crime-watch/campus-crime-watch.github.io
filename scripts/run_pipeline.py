from extract import grab_data
from pre_process import merge, clean_date
from clean_geocode import geocode

"""
1: grab data
2: merge empty rows where nature is related to an entry above
3: clean the date and time (separate them into different columns)
4: geocode the locations
"""

def main():
    grab_data()
    merge()
    clean_date()
    geocode()

if __name__ == "__main__":
    main()