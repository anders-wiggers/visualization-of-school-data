import sqlite3
import pandas as pd
filename = "meanGradesAll"
con=sqlite3.connect(filename+".db")
wb=pd.read_excel(filename+'.xlsx')
wb.to_sql('Mean', con)