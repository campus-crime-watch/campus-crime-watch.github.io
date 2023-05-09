import csv

def geocode():
    # file = "data/raw/stanford_crime.csv"
    # nf = "data/processed/stanford_crime_merge.csv"

    # turn csv into a dictionary
    cleaned_data = []
    # Create a reader
    reader = csv.DictReader(open('data/raw/stanford_crime_merged_geocoded.csv'))
    for row in reader:
        # constrcut a dict of new row
        new_row = row
        del new_row['City']
        del new_row['State']
        del new_row['Country']
        del new_row['ObjectId']

        # \ufeffNature
        nature_info = new_row['\ufeffNature']
        del new_row['\ufeffNature']
        new_row['Nature'] = nature_info
        cleaned_data.append(new_row)
    
    with open('data/processed/stanford_crime_geocoded.csv', 'w') as csvfile:
        fieldnames = ['Nature','Case #','Reported','Occurred','Location','Disposition','On Campus?','Area', 'x', 'y']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for row in cleaned_data:
            writer.writerow(row)

if __name__ == "__main__":
    geocode()