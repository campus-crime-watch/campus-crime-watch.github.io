import pdfplumber
import csv

def grab_data():
    file_path = "data/raw/stanford_crime.pdf"

    with open("data/raw/stanford_crime.csv", "w") as file:
        writer = csv.writer(file)

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            table_settings = {"vertical_strategy": "lines", "horizontal_strategy": "lines"}
            extracted_data = page.extract_table(table_settings)

            with open("data/raw/stanford_crime.csv", "a+") as file:
                writer = csv.writer(file)
                writer.writerows(extracted_data)

if __name__ == "__main__":
    grab_data()