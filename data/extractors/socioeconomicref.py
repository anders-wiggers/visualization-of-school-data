import sqlite3
from sqlite3 import Error
import pandas as pd
import os
import time
import assets.CONSTANTS as CONSTANTS
from terminalOutput import Wait


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
excelFilename = "Sociooekonomisk3Aarig.xlsx"

filepath = os.path.realpath(__file__)
baseDataDir = goUpDir(filepath, 2)

con = sqlite3.connect(baseDataDir + "/db/" + filename+".db")

c = con.cursor()  # The database will be saved in the location where your 'py' file is saved

data = pd.read_excel(baseDataDir + "/excel/" +
                     excelFilename, skiprows=6, index_col=0)

try:
    c.execute('''CREATE TABLE IF NOT EXISTS socioeconomic(
            id INTEGER PRIMARY KEY
            course TEXT,
            subject TEXT,
            grade_period REAL,
            soc_period REAL,
            dif_period REAL,
            significant_period INTEGER,
            grade_real REAL,
            soc_real REAL,
            dif_real REAL,
            significant_real INTEGER
            )''')
except Error as e:
    print(e)


try:
    c.execute('''
        ALTER TABLE INSTITUTION
        ADD COLUMN SOCIOECONOMIC_REF TEXT;
    ''')
except:
    print("Cannot Create column, column is there")


print(data.head())


print("Starting Inserstion")

i = 0

# Wait.printProgressBar(i, len(data)-1,
#                       prefix='Progress:', suffix='Complete', length=50)

schoolCol = 'Row Labels'
year = 2019
curSchool = ""

fag = []
while i < len(data):
    temp = ()

    for row in data:
        curDataPoint = str(data[row][i])
        temp = temp + (curDataPoint,)
    # print(temp)
    curFag = str(data["Fag"][i])
    if curFag not in fag:
        fag.append(curFag)

    # CHECKING EMPTY ENTRY
    if curDataPoint == "nan":
        i += 1
        continue

    i += 1
    print(str(i) + str(len(data)))
    # Wait.printProgressBar(i, len(data)-1,
    #                       prefix='Progress:', suffix='Complete', length=50)

print(fag)

print("\n Done inserting")

print("Insertion finished")

# con.commit()
con.close()
