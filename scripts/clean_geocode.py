import csv
import json
import time

import requests

# old function that cleaned up results from manual. storing here in case of future use.
def geocode_old():
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

# Key: Standard name expected by ArcGIS
# Val: Name of field as it appears in source data
DEFAULT_FIELD_MAPPING = {
    'Address': 'location',
    'City': 'City',
    'Region': 'Region',
    'Postal': 'Postal'
}

class GeocodingError(Exception):
    pass

class ArcGIS:

    def __init__(self):
        self.endpoint = "https://locator.stanford.edu/arcgis/rest/services/Geocode/NorthAmerica_Composite/GeocodeServer/geocodeAddresses"

    def geocode_csv(self, csv_path, field_mapping=DEFAULT_FIELD_MAPPING):
        rows_by_id = {}
        to_geocode = []
        print("Preparing data for geocoding...")
        with open(csv_path, 'r', newline='') as infile:
            reader = csv.DictReader(infile)
            # Object ID is a unique row ID required by ArcGIS
            # It allows us to more easily join the geocoded data returned by the
            # API back up with the original source data rows
            object_id = 1
            for row in reader:
                # Prepare a geocodable payload for the API
                to_geocode.append(
                    self._prepare_row(row, object_id, field_mapping)
                )
                # Also store the original row data using the object_id.
                # This will let us merge the geocoded data to the row downstream
                rows_by_id[object_id] = row
                object_id += 1
        # Now we geocode
        print(f"Geocoding {len(to_geocode)} rows of data...")
        results = self.geocode(
            self.endpoint,
            to_geocode,
            results=[],
            batch_size=1000,
            throttle=1
        )
        # And write our data to a new CSV
        self._write_geocoded_data(csv_path, rows_by_id, results)

    def _write_geocoded_data(self, csv_path, orig_data, geo_data):
        # Create a new file that contains geocoded data
        new_csv = csv_path.replace('.csv', '_geocoded.csv')
        print(f"Generating {new_csv}")
        to_write = []
        for row in geo_data:
            attrs = row['attributes']
            object_id = attrs['ResultID']
                        # Update original row with data points
            output_row = orig_data[object_id]
            output_row.update({
                'match_score':attrs['Score'],
                'y_lat': attrs['Y'],
                'x_long': attrs['X'],
                'place_addr': attrs['Place_addr'],
            })
            to_write.append(output_row)
        with open(new_csv, 'w') as outfile:
            headers = to_write[0].keys()
            writer = csv.DictWriter(outfile, fieldnames=headers)
            writer.writeheader()
            writer.writerows(to_write)

    def _prepare_row(self, row, object_id, field_mapping):
        address_key = field_mapping['Address']
        city_key = field_mapping['City']
        region_key = field_mapping['Region']
        data = {
            'attributes': {
                'OBJECTID': object_id,
                'Address': row[address_key].strip(),
                'City': 'Stanford',
                'Region': 'California'
            }
        }
        try:
            # Postal not required, but use it if present
            postal_key = field_mapping['Postal']
            data['attributes']['Postal'] =  row[postal_key]
        except KeyError:
            pass
        return data

    @classmethod
    def geocode(cls, url, addresses, results=[], batch_size=1000, throttle=1):
        payload = {
            'f': 'json',
            'addresses': json.dumps({'records': addresses[0:batch_size]})
        }
        response = requests.post(url, data=payload)
        data = response.json()
        try:
            results.extend(data['locations'])
        except KeyError:
            raise GeocodingError(data)
        # If records remain to process, perform a recursive call
        remaining_addresses = addresses[batch_size:]
        if remaining_addresses:
            time.sleep(throttle)
            cls.geocode(
                url, remaining_addresses,
                results=results,
                batch_size=batch_size,
                throttle=throttle
            )
        return results

def geocode_pipeline():
    input_file = 'data/processed/stanford_crime_clean.csv'
    mapping = DEFAULT_FIELD_MAPPING
    geocoder = ArcGIS()
    results = geocoder.geocode_csv(input_file, field_mapping=mapping)

if __name__ == '__main__':
    geocode_pipeline()