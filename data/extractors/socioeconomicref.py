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
            id INTEGER PRIMARY KEY,
            Dansk INTEGER
            )''')
except Error as e:
    print(e)

try:
    c.execute('''CREATE TABLE IF NOT EXISTS soc_spec(
            id INTEGER PRIMARY KEY,
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
        ADD COLUMN SOCIOECONOMIC TEXT;
    ''')
except:
    print("Cannot Create column, column is there")


def CreateEmptySocEco(school, year):
    createEmptyWB = '''
    INSERT INTO socioeconomic (Dansk)
    VALUES (NULL)
    '''
    insertToInstitution = '''
    INSERT INTO INSTITUTION (NAME, YEAR, SOCIOECONOMIC)
    VALUES (?,?,?)
    '''
    updateToInstitution = '''
    UPDATE INSTITUTION
    SET SOCIOECONOMIC = ?
    WHERE NAME = ? and YEAR = ?;
    '''
    c.execute(createEmptyWB)
    curid = c.lastrowid
    try:
        c.execute(insertToInstitution, (school, year, curid))
    except:
        c.execute(updateToInstitution, (curid, school, year))


def checkSocEco(curId, fag):
    print("checkSocEco with fag: " + fag + " And curId: " + str(curId))
    try:
        c.execute('''
        ALTER TABLE socioeconomic
        ADD COLUMN ''' + fag + ''' INTEGER;
    ''')
    except:
        # print("Cannot Create column, column is there")
        pass

    sqlCheckInstitutionQuery = '''
    SELECT ''' + fag + '''
    FROM socioeconomic
    WHERE id = ?
    '''
    c.execute(sqlCheckInstitutionQuery, (curId,))
    fetchData = c.fetchall()
    if not fetchData:
        return False, None
    else:
        idd = fetchData[0][0]
        # print(idd)
        return True, idd


def checkExistance(values):
    sqlCheckInstitutionQuery = '''
    SELECT SOCIOECONOMIC
    FROM INSTITUTION
    WHERE NAME = ? AND YEAR = ?
    '''
    c.execute(sqlCheckInstitutionQuery, values)
    fetchData = c.fetchall()
    if not fetchData:
        return False, None
    else:
        idd = fetchData[0][0]
        # print(idd)
        return True, idd


def InsertIntoSocSpec(socId, course, insertId):
    c.execute('''
        UPDATE socioeconomic
        SET ''' + course + ''' = ?
        WHERE id = ?;
    ''', (insertId, socId))


def cascadeUpdate(school, year, curId, fag):
    isThere, idd = checkExistance((school, year))
    # Check if School and Year has socioeco_ref
    if isThere and idd != None:
        # print("Its Here")
        # Check if soceco table is in grades table
        isThere, didd = checkSocEco(idd, fag)
        if isThere and didd != None:
            # print("now it here :)")
            pass
        else:
            InsertIntoSocSpec(idd, fag, curId)

    else:
        # Create Emptry SocEco Entry
        # print("not here :(")
        CreateEmptySocEco(school, year)
        cascadeUpdate(school, year, curId, fag)


def addSocSpec(values):
    insertSocSpecStatement = '''
        INSERT into soc_spec (grade_period, soc_period, dif_period, significant_period, grade_real, soc_real, dif_real, significant_real)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    '''

    c.execute(insertSocSpecStatement, values[3:])
    curid = c.lastrowid
    courseType = values[1] + "_" + values[2]
    cascadeUpdate(values[0], "2019", curid, courseType)

    # print(values)


print(data.head())


print("Starting Inserstion")

i = 0

Wait.printProgressBar(i, len(data),
                      prefix='Progress:', suffix='Complete', length=50)

schoolCol = 'Row Labels'
year = 2019
curSchool = ""

while i < len(data):
    temp = ()

    for row in data:
        curDataPoint = str(data[row][i])
        if curDataPoint == "Ja":
            temp = temp + (1,)
        elif curDataPoint == "Nej":
            temp = temp + (0,)
        elif curDataPoint == "Fællesprøve i fysik/kemi, biologi og geografi":
            temp = temp + ("Fysik_Kemi_Biologi_Geografi",)
        elif curDataPoint == "Praktisk/mundtlig":
            temp = temp + ("Praktisk_mundtlig",)
        elif curDataPoint == "Matematik med hjælpemidler":
            temp = temp + ("Uden_hjælpemidler",)
        elif curDataPoint == "Matematik uden hjælpemidler":
            temp = temp + ("Uden_hjælpemidler",)
        else:
            temp = temp + (curDataPoint,)

    # CHECKING EMPTY ENTRY
    if curDataPoint == "nan":
        i += 1
        continue

    print(temp)
    addSocSpec(temp)

    i += 1

    Wait.printProgressBar(i, len(data),
                          prefix='Progress:', suffix='Complete', length=50)


print("\n Done inserting")

print("Insertion finished")

con.commit()
con.close()
