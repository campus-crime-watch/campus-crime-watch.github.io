import csv
import pandas as pd
import os
import altair as alt

from pathlib import Path
base_dir = Path(__file__).parents[1]
path = os.path.join(base_dir, "data/processed/crime_categories.csv")
df = pd.read_csv(path)

