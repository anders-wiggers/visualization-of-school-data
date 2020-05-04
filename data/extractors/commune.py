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
excelFilename = "Elevtal (1).xlsx"

filepath = os.path.realpath(__file__)
baseDataDir = goUpDir(filepath, 2)
print(baseDataDir)

con = sqlite3.connect(baseDataDir + "/db/" + filename+".db")

c = con.cursor()  # The database will be saved in the location where your 'py' file is saved

data = pd.read_excel(baseDataDir + "/excel/" + excelFilename)

try:
    c.execute('''CREATE TABLE IF NOT EXISTS students(
            id INTEGER PRIMARY KEY,
            total_students INTEGER
            )''')
except Error as e:
    print(e)

try:
    c.execute('''
        ALTER TABLE INSTITUTION
        ADD COLUMN REGION TEXT;
    ''')
except:
    print("Cannot Create column, column is there")


try:
    c.execute('''
        ALTER TABLE INSTITUTION
        ADD COLUMN COMMUNE TEXT;
    ''')
except:
    print("Cannot Create column, column is there")

print(data.head())

def createStidenEntry(data):
    c.execute('''
        INSERT INTO students (total_students)
        VALUES (?)
    ''',(data,))
    curid = c.lastrowid
    return curid
    


def findYears(data):
    years = {}
    rowWithYear = 0
    rightRow = False
    while rightRow == False:
        for col in data:
            try:
                str(data[col][rowWithYear]).split("/")[1]
                rightRow = True
                break
            except:
                pass
            rowWithYear = rowWithYear + 1

    # print(rowWithYear)
    # preb data
    for col in data:
        year = data[col][rowWithYear]
        try:
            year = str(year).split("/")[1]

            arr = [col]
            if year in years:
                arr = years[year]
                arr.append(col)

            years.update({
                year: arr
            })
        except:
            # print("not a year")
            pass

    return years, rowWithYear


years, rowWithYear = findYears(data)



print("Starting Inserstion")
print(years)
print(rowWithYear)


regionRow = "Unnamed: 0"
communeRow = "Unnamed: 1"
institution = "Unnamed: 2"
i = rowWithYear + 1


Wait.printProgressBar(i, len(data)-1,
                    prefix='Progress:', suffix='Complete', length=50)
while i < len(data)-1:
    school = data[institution][i]
    region = data[regionRow][i]
    commune = data[communeRow][i]


    # Check for total or empty row
    if(str(school) == "nan"):
        i += 1
        continue


    for y in years:
        studentNumber = data[years[y][0]][i]

        if(str(studentNumber) == "nan"):
            try:
                c.execute('''
                UPDATE INSTITUTION 
                SET REGION = ?,
                    COMMUNE = ?,
                    STUDENTS = ?
                WHERE 
                    NAME = ? AND
                    YEAR = ?
                ''',(region,commune,None,school,y))
            except:
                c.execute('''
                    INSERT INTO INSTITUTION (NAME, YEAR, STUDENTS, REGION, COMMUNE)
                    VALUES (?,?,?,?,?)
                ''',(school,y,None,region,commune))
        else:
            idd = createStidenEntry(studentNumber)

            
            try:
                c.execute('''
                    INSERT INTO INSTITUTION (NAME, YEAR, STUDENTS, REGION, COMMUNE)
                    VALUES (?,?,?,?,?)
                ''',(school,y,idd,region,commune))
            except:
                c.execute('''
                UPDATE INSTITUTION 
                SET REGION = ?,
                    COMMUNE = ?,
                    STUDENTS = ?
                WHERE 
                    NAME = ? AND
                    YEAR = ?
                ''',(region,commune,idd,school,y))

    i += 1
    Wait.printProgressBar(i, len(data)-1,
                        prefix='Progress:', suffix='Complete', length=50)


print("Insertion finished")
con.commit()
con.close()

