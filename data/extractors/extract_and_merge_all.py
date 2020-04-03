import sqlite3
import pandas as pd



filename = "full_database" #Name of file for conversion

con=sqlite3.connect(r'data\db\\'+filename+".db")



#TODO KALD ALLE DE FORSKELLIGE EXTRACTORS HER SÅ VI VED ALLE DATABASERNE ER DER


#TODO LOAD EN DATABASE IND OG LAV DEN TIL EN DATAFRAME
karaktergennemsnit_dataframe = pd.read_sql_table(r'data\db\\'+"Karaktergennemsnit.db",con)
sociooekonomisk3aarig_dataframe = pd.read_sql_table(r'data\db\\'+"Sociooekonomisk3Aarig.db",con)


#TODO TAG DE KOLONNER FRA DATAFRAMEN VI SKAL BRUGE OG APPEND DEM TIL FULL_DB





full_database_dataframe.to_sql(''+filename, con,if_exists='replace') #Convert


