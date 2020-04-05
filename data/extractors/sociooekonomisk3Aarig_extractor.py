import sqlite3
import pandas as pd

filename = "Sociooekonomisk3Aarig" #Name of file for conversion


con=sqlite3.connect(r'data\db\\'+filename+".db")


dataframe=pd.read_excel(r'data\excel\Sociooekonomisk3Aarig.xlsx',skiprows=6) #read excel file
dataframe.drop(["Row Labels"],axis = 1, inplace = True) #Drop the column named Row Labels and use the change in the main dataframe
dataframe.rename(columns={'Afdeling' : 'Institution'},inplace=True)


dataframe.to_sql(''+filename, con,if_exists='replace') #Convert

