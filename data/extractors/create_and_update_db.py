import sqlite3
import pandas as pd
import sqlalchemy as db



filename = "full_database" #Name of file for conversion

con=sqlite3.connect(r'data/db//'+filename+".db")

c = con.cursor() # The database will be saved in the location where your 'py' file is saved

# Create table - INSTITUTION
c.execute('''CREATE TABLE IF NOT EXISTS INSTITUTION(
            [NAME] TEXT,
            [YEAR] INTEGER,
            [GRADES] TEXT,
            [ABSENCE] TEXT,
            [STUDENTS] TEXT,
            [PLANNED_HOURS] INTEGER,
            PRIMARY KEY (NAME, YEAR)
            )''')
        
# Create table - GRADES
c.execute('''CREATE TABLE IF NOT EXISTS GRADES(
            [ID] INTEGER PRIMARY KEY, 
            [MEAN] INTEGER, 
            [FEMALE] INTEGER, 
            [MALE] INTEGER, 
            [DISTRIBUTION] INTEGER, 
            [PARENTAL STATUS] TEXT
            )''')

con.commit()

#TODO KØR ALLE EXTRACTORS HER


con.close()

