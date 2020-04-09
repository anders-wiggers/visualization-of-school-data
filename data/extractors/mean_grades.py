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
excelFilename = "Resultater - Folkeskolens Afgangseksamen.xlsx"

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


def insertIntoTable(name, year, boysAvage, girlsAvage, avage):
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
            INSERT INTO grades(male,female,mean)
            VALUES(?,?,?) ''', (boysAvage, girlsAvage, avage))
        curid = c.lastrowid
        insertIntoInstructions(curid, name, year)
    else:
        # If record is here update
        # print("update")
        grade_id = fetchData[0][0]
        c.execute('''
            UPDATE grades
            SET male = ?,
                female = ?,
                mean = ?
            WHERE id = ?;
            ''', (boysAvage, girlsAvage, avage, grade_id))


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

    else:
        # print("inserting")
        c.execute(sqlInsitutionInsertQuery, (school, year, id))


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

    return years, rowWithYear


years, rowWithYear = findYears(data)
counter = 0


print(years)
print(rowWithYear)


# try:
#     c.execute('''
#         ALTER TABLE grades
#         ADD COLUMN students_with_2 REAL;
#     ''')
# except:
#     print("Cannot Create column, column is there")

def prebSchool(name):
    strArray = str(name).split(" ")
    if "(" in strArray[len(strArray)-1]:
        del strArray[-1]
        nameMinusCounty = ""
        for s in strArray:
            nameMinusCounty = nameMinusCounty + s + " "
        nameMinusCounty = nameMinusCounty.strip()
        sqlCheckInstitutionQuery = '''
            SELECT NAME
            FROM `INSTITUTION`
            WHERE NAME = ?;
            '''
        c.execute(sqlCheckInstitutionQuery, (nameMinusCounty,))
        fetchData = c.fetchall()
        if not fetchData:
            pass
        else:
            return nameMinusCounty
    return name


print("Starting Inserstion")

sex = "All"
i = rowWithYear + 1

Wait.printProgressBar(i, len(data)-1,
                      prefix='Progress:', suffix='Complete', length=50)

while i < len(data)-1:
    school = data["Skoletrin - Klassetrin"][i]
    toJump = 1
    if str(school) != "nan":
        school = prebSchool(school)
        print(school)
        for year in years:
            tempLengt = i
            schoolRunner = True
            for speceficClass in years[year]:
                boysAvage = None
                girlsAvage = None
                avage = None
                while schoolRunner:
                    if data[sex][tempLengt] == "Dreng":
                        boysAvage = data[speceficClass][tempLengt]
                        toJump = toJump + 1
                    if data[sex][tempLengt] == "Pige":
                        girlsAvage = data[speceficClass][tempLengt]
                        toJump = toJump + 1
                    if str(data[sex][tempLengt]) == "nan":
                        avage = data[speceficClass][tempLengt]
                        schoolRunner = False
                        toJump = toJump + 1

                    tempLengt = tempLengt + 1
                insertIntoTable(school, year, boysAvage, girlsAvage, avage)
    i = i + int(toJump / len(years))
    con.commit()
    Wait.printProgressBar(i, len(data)-1,
                          prefix='Progress:', suffix='Complete', length=50)

con.commit()
