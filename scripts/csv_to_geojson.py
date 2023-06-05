import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

def to_geojson():
    csv_file = 'data/processed/stanford_crime_clean_geocoded_categorized.csv'  
    data = pd.read_csv(csv_file)

    # renames x_long, y_lat
    data = data.rename(columns={'x_long':'longitude','y_lat':'latitude'})

    geometry = [Point(xy) for xy in zip(data.longitude, data.latitude)]

    geo_data = gpd.GeoDataFrame(data, geometry=geometry)

    output_geojson = 'docs/data/stanford_crime.geojson'  
    geo_data.to_file(output_geojson, driver='GeoJSON')


if __name__ == '__main__':
    to_geojson()