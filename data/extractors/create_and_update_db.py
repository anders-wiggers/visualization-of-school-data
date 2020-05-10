import sqlite3
import os
import pandas as pd
#import sqlalchemy as db


def goUpDir(path, up):
    newPath = ""
    pathArr = str(path).split("/")
    pathArr.remove("")

    while up > 0:
        del pathArr[len(pathArr)-1]
        up = up - 1

    for p in pathArr:
        newPath += "/" + p

    return newPath


filename = "full_database"  # Name of file for conversion

filepath = os.path.realpath(__file__)
baseDataDir = goUpDir(filepath, 2)
print(baseDataDir)

con = sqlite3.connect(baseDataDir + "/db/" + filename+".db")
c = con.cursor()  # The database will be saved in the location where your 'py' file is saved

# Create table - INSTITUTION
c.execute('''CREATE TABLE IF NOT EXISTS INSTITUTION(
            [NAME] TEXT,
            [YEAR] INTEGER,
            [GRADES] INTEGER,
            [ABSENCE] INTEGER,
            [STUDENTS] INTEGER,
            [WELL_BEING] INTEGER,
            [PLANNED_HOURS] INTEGER,
            [COMMUNE] TEXT,
            [REGION] TEXT,
            PRIMARY KEY (NAME, YEAR, COMMUNE)
            )''')

# Create table - GRADES
c.execute('''CREATE TABLE IF NOT EXISTS grades(
        id INTEGER PRIMARY KEY, 
        mean REAL, 
        female REAL, 
        male REAL, 
        students_with_2 REAL
        )''')

con.commit()

# TODO KØR ALLE EXTRACTORS HER


con.close()
