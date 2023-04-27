import pdfplumber
import csv
import os

for (root, dirs, files) in os.walk(".", topdown = True):
    for iterate in files:
        file_path = os.path.join(root, iterate)
        file_name, file_extension = os.path.splitext(iterate)
        if file_extension == ".pdf":
            with pdfplumber.open(file_path) as pdf:
                for index, page in enumerate(pdf.pages): 
                    width = page.width
                    height = page.height
                    page = page.crop((0, 120, width, height - 30), relative = True)
                    table_settings = {"vertical_strategy": "lines",
                                       "horizontal_strategy": "text",
                                       "snap_y_tolerance": 2,
                                       "intersection_x_tolerance": 3, 
                                       "explicit_vertical_lines": [20, width - 20]}
                    extracted_data = page.extract_table(table_settings)
                    if extracted_data == None:
                        print(file_path, index + 1)
                        #TO DO TUESDAY: 
                        #1: if it errors on page one, have it ignore the page or skip it
                        #2: if it errors on page 2 or more, then have it implement a table 
                        # // extraction method specified for pages without lines
                        # side note: create this extraction method in jupyter notebook with visual debugger
                    else:
                        with open("berkeley__crime_data.csv", "a") as file:
                            writer = csv.writer(file)
                            writer.writerows(extracted_data)