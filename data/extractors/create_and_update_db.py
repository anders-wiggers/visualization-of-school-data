import sqlite3
import pandas as pd



filename = "full_database" #Name of file for conversion

con=sqlite3.connect(r'data\db\\'+filename+".db")

c = con.cursor() # The database will be saved in the location where your 'py' file is saved

# Create table - YEAR
c.execute('''CREATE TABLE YEAR
             ([YEAR] INTEGER PRIMARY KEY,[INSTITUTION] TEXT)''')
          
# Create table - INSTITUTION
c.execute('''CREATE TABLE INSTITUTION
             ([NAME] TEXT PRIMARY KEY,[GRADES] TEXT, [STUDENTS] TEXT)''')
        
# Create table - SPECIFIC GRADE
c.execute('''CREATE TABLE SPECIFIC GRADE
             ([GRADE_ID] TEXT PRIMARY KEY, [MEAN] INTEGER, [FEMALE] INTEGER, [MALE] INTEGER, [DISTRIBUTION] INTEGER, [PARENTAL STATUS] TEXT)''')

con.commit()


#TODO KALD ALLE DE FORSKELLIGE EXTRACTORS DER PUSHER DERES DATA TIL DB'EN

