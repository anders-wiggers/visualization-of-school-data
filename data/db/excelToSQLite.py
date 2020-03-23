import sqlite3
import pandas as pd
filename = "meanGradesAll" #Name of file for conversion
con=sqlite3.connect(filename+".db")
wb=pd.read_excel(filename+'.xlsx') #read excel file
wb.to_sql('Mean', con) #Convert