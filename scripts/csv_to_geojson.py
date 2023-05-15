import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

def to_json():
    csv_file = 'data/processed/stanford_crime_clean_geocoded.csv'  
    data = pd.read_csv(csv_file)

    data = data.rename(columns={'x':'longitude','y':'latitude'})

    geometry = [Point(xy) for xy in zip(data.longitude, data.latitude)]

    geo_data = gpd.GeoDataFrame(data, geometry=geometry)

    output_geojson = 'docs/data/stanford_crime.geojson'  
    geo_data.to_file(output_geojson, driver='GeoJSON')


if __name__ == '__main__':
    to_json()