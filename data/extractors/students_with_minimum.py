import sqlite3
from sqlite3 import Error
import pandas as pd
import os
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
excelFilename = "Andel elever med mindst 2 i baade dansk og matematik.xlsx"

filepath = os.path.realpath(__file__)
baseDataDir = goUpDir(filepath, 2)
print(baseDataDir)

con = sqlite3.connect(baseDataDir + "/db/" + filename+".db")

c = con.cursor()  # The database will be saved in the location where your 'py' file is saved

data = pd.read_excel(baseDataDir + "/excel/" + excelFilename)

try:
    c.execute('''CREATE TABLE IF NOT EXISTS grades(
            id INTEGER PRIMARY KEY,
            mean REAL,
            female REAL,
            male REAL,
            distribution INTEGER,
            students_with_2 REAL,
            parental_status INTEGER

            )''')
except Error as e:
    print(e)


def insertIntoTable(name, year, students_with_2):
    sqlCheckIfShcoolAndYearHasGrades = '''
    SELECT GRADES
    FROM `INSTITUTION`
    WHERE NAME = ? and YEAR = ?;
    '''
    c.execute(sqlCheckIfShcoolAndYearHasGrades, (name, year))
    fetchData = c.fetchall()
    if not fetchData or None in fetchData[0]:
        # If nothing is here insert
        # print("insert")
        c.execute(''' 
            INSERT INTO grades(students_with_2)
            VALUES(?) ''', (students_with_2,))
        curid = c.lastrowid
        insertIntoInstructions(curid, name, year)
    else:
        # If record is here update
        # print("update")
        grade_id = fetchData[0][0]
        c.execute(''' 
            UPDATE grades
            SET students_with_2 = ?
            WHERE id = ?;
            ''', (students_with_2, grade_id))


def checkExistance(values):
    sqlCheckInstitutionQuery = '''
    SELECT NAME, YEAR
    FROM `INSTITUTION`
    WHERE NAME = ? and YEAR = ?;
    '''
    c.execute(sqlCheckInstitutionQuery, values)
    fetchData = c.fetchall()
    if not fetchData:
        return False
    else:
        return True


def insertIntoInstructions(id, school, year):
    sqlInsitutionInsertQuery = '''
    INSERT INTO INSTITUTION (NAME, YEAR, GRADES)
    VALUES (?,?,?)
    '''
    sqlUpdateInstitutionsQuery = '''
    UPDATE INSTITUTION
    SET GRADES = ?
    WHERE NAME = ? and YEAR = ?;
    '''

    if checkExistance((school, year)):
        # print("updating")
        c.execute(sqlUpdateInstitutionsQuery, (id, school, year))
        con.commit()
    else:
        # print("inserting")
        c.execute(sqlInsitutionInsertQuery, (school, year, id))
        con.commit()


print(data.head())


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

    print(rowWithYear)
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
            print("not a year")

    return years


years = findYears(data)
counter = 0


try:
    c.execute('''
        ALTER TABLE INSTITUTION
        ADD COLUMN students_with_2 REAL;
    ''')
except:
    print("Cannot Create column, column is there")


print("Starting Inserstion")


i = 7

Wait.printProgressBar(i, len(data)-1,
                      prefix='Progress:', suffix='Complete', length=50)

while i < len(data)-1:
    school = data['Unnamed: 0'][i]
    if str(school) != "nan":
        for year in years:
            for speceficClass in years[year]:
                insertIntoTable(school, year, data[speceficClass][i])

    i = i + 1

    Wait.printProgressBar(i, len(data)-1,
                          prefix='Progress:', suffix='Complete', length=50)

con.commit()
