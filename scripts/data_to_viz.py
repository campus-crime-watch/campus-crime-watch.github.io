import csv
import pandas as pd
import os
import altair as alt
from pathlib import Path

def vizualize():
    base_dir = Path(__file__).parents[1]
    path = os.path.join(base_dir, "data/processed/crime_categories.csv")
    df = pd.read_csv(path)

    df = df.melt(id_vars = "Year", var_name = "Crime", value_name = "Count")

    chart = alt.Chart(df).mark_bar().encode(
            x = "Year:O",
            y = "Count:Q",
            color = "Crime:N",
            tooltip = ["Year", "Crime", "Count"]
        ).properties(
            width = 600,
            height = 400,
            title = "Crime Counts at Stanford by Year"
        ).configure_axisX(
            labelAngle = 0
    )

## need to figure out how to have this visual appear on the site (i figure i 
# need to go to the front end repo and do some stuff there?)

if __name__ == "__main__":
    vizualize()