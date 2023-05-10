import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

csv_file = 'data/stanford_crime_clean.csv'  # Replace with the path to your CSV file
data = pd.read_csv(csv_file)

data = data.rename(columns={'x':'longitude','y':'latitude'})

geometry = [Point(xy) for xy in zip(data.longitude, data.latitude)]

geo_data = gpd.GeoDataFrame(data, geometry=geometry)

output_geojson = 'data/stanford_crime.geojson'  # Replace with the desired output file path
geo_data.to_file(output_geojson, driver='GeoJSON')


geo_data.keys()