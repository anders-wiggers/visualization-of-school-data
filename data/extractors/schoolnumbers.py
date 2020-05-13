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
excelFilename = "Skoletal.xlsx"

filepath = os.path.realpath(__file__)
baseDataDir = goUpDir(filepath, 2)

con = sqlite3.connect(baseDataDir + "/db/" + filename+".db")

c = con.cursor()  # The database will be saved in the location where your 'py' file is saved

data = pd.read_excel(baseDataDir + "/excel/" +
                     excelFilename, skiprows=1)

try:
    c.execute('''
        ALTER TABLE students
        ADD COLUMN classratio REAL;
    ''')
except:
    print("Cannot Create column, column is there")

try:
    c.execute('''
        ALTER TABLE INSTITUTION
        ADD COLUMN COMPETENCE_COVERAGE REAL;
    ''')
except:
    print("Cannot Create column, column is there")

try:
    c.execute('''
        ALTER TABLE INSTITUTION
        ADD COLUMN ATTENT_HIGHER_EDU REAL;
    ''')
except:
    print("Cannot Create column, column is there")


def checkExistance(values):
    sqlCheckInstitutionQuery = '''
    SELECT STUDENTS
    FROM INSTITUTION
    WHERE NAME = ? AND YEAR = ? and COMMUNE = ?
    '''
    c.execute(sqlCheckInstitutionQuery, values)
    fetchData = c.fetchall()
    if not fetchData:
        return False, None
    else:
        idd = fetchData[0][0]
        # print(idd)
        return True, idd


print(data.head())


print("Starting Inserstion")

i = 1

Wait.printProgressBar(i, len(data),
                      prefix='Progress:', suffix='Complete', length=50)


schoolCol = 'Unnamed: 0'
dataCol = 'Unnamed: 1'
year = ""
curSchool = ""
curCommune = ""
classRatio = 'Unnamed: 5'
competence = 'Unnamed: 6'
attentent = 'Unnamed: 7'

while i < len(data):
    preb = data[dataCol][i]

    if str(preb) == 'nan':
        i += 1
        continue

    try:
        year = str(preb).split("/")[1]
    except:
        i += 1
        curCommune = preb
        continue

    ratio = data[classRatio][i]
    comp = data[competence][i]
    att = data[attentent][i]
    school = data[schoolCol][i]

    try:
        c.execute('''
            UPDATE INSTITUTION
            SET COMPETENCE_COVERAGE = ?,
                ATTENT_HIGHER_EDU = ?
            WHERE NAME = ? AND YEAR = ? AND COMMUNE = ?
        ''', (comp, att, school, year, curCommune))
    except Error as e:
        print("error in first")
        print(e)

    try:
        _, idd = checkExistance((school, year, curCommune))
        c.execute('''
            UPDATE students
            SET classratio = ?
            WHERE id = ?
        ''', (ratio, idd))
    except Error as e:
        print("error second")
        print(e)

    i += 1

    Wait.printProgressBar(i, len(data),
                          prefix='Progress:', suffix='Complete', length=50)

print("\n Done inserting")

print("Insertion finished")

con.commit()
con.close()
