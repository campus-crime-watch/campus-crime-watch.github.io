import pdfplumber
import csv
import os

def grab_data():
    for (root, dirs, files) in os.walk(".", topdown = True):
        for iterate in files:
            file_path = os.path.join(root, iterate)
            file_name, file_extension = os.path.splitext(iterate)
            if file_extension == ".pdf":
                with pdfplumber.open(file_path) as pdf:
                    page = pdf.pages[0]
                    width = page.width
                    height = page.height
                    page = page.crop((0, 120, width, height - 30), relative = True)
                    table_settings = {"vertical_strategy": "lines",
                                        "horizontal_strategy": "text",
                                        "snap_y_tolerance": 2,
                                        "intersection_x_tolerance": 3, 
                                        "explicit_vertical_lines": [20, width - 20]}
                    extracted_data = page.extract_table(table_settings)
                    with open("data/raw/stanford_crime.csv", "a") as file:
                        writer = csv.writer(file)
                        writer.writerows(extracted_data)

if __name__ == "__main__":
    grab_data()