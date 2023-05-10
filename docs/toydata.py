import pandas
all_data = pandas.read_csv('data/stanford_crime_clean.csv')
toy_data = all_data.head(100)
toy_data = toy_data.rename(columns= {'x':'lng','y':'lat'})
toy_data.to_csv('data/toy_data.csv')