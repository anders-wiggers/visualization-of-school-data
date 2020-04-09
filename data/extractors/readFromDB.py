import sqlite3
import pandas as pd

dbFile = "meanGradesAll"
con=sqlite3.connect(dbFile+".db")
readDB = pd.read_sql_table("index", con)
print(readDB.head())
