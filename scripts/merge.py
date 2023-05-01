import csv

def merge():
    # file = "data/raw/stanford_crime.csv"
    # nf = "data/processed/stanford_crime_merge.csv"

    # turn csv into a dictionary
    all_data = []
    # Create a reader
    reader = csv.DictReader(open('data/raw/stanford_crime.csv'))
    for row in reader:
        # if row is empty, add data to past row
        if (row['Reported'] == ''):
            added_info = " \n" + row['Nature'] + ""
            all_data[-1]['Nature'] += added_info
        else:
            all_data.append(row)
    
    with open('data/processed/stanford_crime_merged.csv', 'w') as csvfile:
        fieldnames = ['Nature','Case #','Reported','Occurred','Location','Disposition','On Campus?','Area', 'City', 'State', 'Country']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for row in all_data:
            row['City'] = 'Stanford'
            row['State'] = 'California'
            row['Country'] = 'United States of America'
            writer.writerow(row)

merge()