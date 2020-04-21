import sqlite3
from sqlite3 import Error
import pandas as pd
import os
import time
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
excelFilename = "Trivsel - differentierede indikatorer - skole - koen - klassetrin.xlsx"

filepath = os.path.realpath(__file__)
baseDataDir = goUpDir(filepath, 2)
print(baseDataDir)

con = sqlite3.connect(baseDataDir + "/db/" + filename+".db")

c = con.cursor()  # The database will be saved in the location where your 'py' file is saved

data = pd.read_excel(baseDataDir + "/excel/" + excelFilename)

try:
    c.execute('''CREATE TABLE IF NOT EXISTS wb_class(
            id INTEGER PRIMARY KEY,
            fouth_grade INTEGER,
            fifth_grade INTEGER,
            sixth_grade INTEGER,
            seventh_grade INTEGER,
            eigth_grade INTEGER,
            ninth_grade INTEGER,
            mean REAL
            )''')
except Error as e:
    print(e)

try:
    c.execute('''CREATE TABLE IF NOT EXISTS wb_gender(
            id INTEGER PRIMARY KEY,
            boy INTEGER,
            girl INTEGER,
            mean REAL
            )''')
except Error as e:
    print(e)

try:
    c.execute('''CREATE TABLE IF NOT EXISTS wb_attributes(
            id INTEGER PRIMARY KEY,
            one_two REAL,
            two_three REAL,
            tree_four REAL,
            four_five REAL,
            mean REAL
            )''')
except Error as e:
    print(e)


def calculateMeans():
    sqlCheckInstitutionQuery = '''
            SELECT id, tenth_grade, preb_school, middle_school, grad_school
            FROM `absence`
            '''
    insertMeanAbs = '''
        UPDATE absence
        SET mean = ?
        WHERE id = ?
    '''
    fetchSpecAbs = '''
        SELECT id, legal, illegal, sickleave
        FROM specific_absence
        WHERE id = ?
    '''
    insertSpecAbs = '''
        UPDATE specific_absence
        SET mean = ?
        WHERE id = ?
    '''
    fetchDetail = '''
        SELECT mean
        FROM detailed_absence
        WHERE id = ?
    '''
    c.execute(sqlCheckInstitutionQuery)
    fetchData = c.fetchall()

    # Fetch all schools
    for data in fetchData:
        idd = data[0]
        data = iter(data)
        next(data)
        specMeans = []
        # Handle all grades
        for value in data:

            if value != None:
                # Calc mean for each legal illegal and sickleave
                c.execute(fetchSpecAbs, (value,))
                specific_abs = c.fetchall()
                tempMeans = []
                sid = specific_abs[0][0]
                specific_abs = iter(specific_abs[0])
                # print(sid)
                next(specific_abs)
                specMean = 0.0
                for detailed in specific_abs:
                    c.execute(fetchDetail, (detailed,))
                    detailedMean = c.fetchall()
                    if detailedMean[0][0] != None:
                        # print(detailedMean)
                        tempMeans.append(detailedMean[0][0])
                if not tempMeans:
                    continue
                for t in tempMeans:
                    specMean += t
                specMean = specMean / len(tempMeans)
                # print(specMean)
                # Insert mean back into the db
                c.execute(insertSpecAbs, (specMean, sid))
                specMeans.append(specMean)

        if not specMeans:
            continue
        mean = 0.0
        for m in specMeans:
            mean += m
        mean = mean / len(specMeans)
        # print("school mean:")
        # print(specMeans)
        # print(mean)
        # print("=====\n\n")
        c.execute(insertMeanAbs, (mean, idd))


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

print(years)
print(rowWithYear)

print("Starting Inserstion")

sex = "All"
i = rowWithYear + 1
# i = 60
# Wait.printProgressBar(i, len(data)-1,
#                       prefix='Progress:', suffix='Complete', length=50)

dataCol = 'Unnamed: 0'

curType = None
curClass = None

while i < len(data)-1:
    curDataPoint = str(data[dataCol][i])
    # print(school)

    # CHECKING EMPTY ENTRY
    if curDataPoint == "nan":
        i += 1
        continue

    # SKIP IF TOTAL ROW
    try:
        if curDataPoint.split(".")[1] == " klasse":
            curClass = curDataPoint
    except:
        pass
        # DETERMENTING BOY OR GIRL
    if curDataPoint == "Dreng":
        curType = "boy"
    if curDataPoint == "Pige":
        curType = "girl"

    # DETERMENT CURRENT CLASS
    try:
        if curDataPoint.split(".")[1] == " klasse":
            curClass = curDataPoint
    except:
        pass

    i += 1
    # con.commit()
    # Wait.printProgressBar(i, len(data)-1,
    #                       prefix='Progress:', suffix='Complete', length=50)

# con.commit()
