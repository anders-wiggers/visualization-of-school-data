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
excelFilename = "Trivsel - differentierede indikatorer - skole - koen - klassetrin.xlsx"

filepath = os.path.realpath(__file__)
baseDataDir = goUpDir(filepath, 2)
print(baseDataDir)

con = sqlite3.connect(baseDataDir + "/db/" + filename+".db")

c = con.cursor()  # The database will be saved in the location where your 'py' file is saved

data = pd.read_excel(baseDataDir + "/excel/" + excelFilename)

try:
    c.execute('''CREATE TABLE IF NOT EXISTS well_being(
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

try:
    c.execute('''
        ALTER TABLE INSTITUTION
        ADD COLUMN WELL_BEING TEXT;
    ''')
except:
    print("Cannot Create column, column is there")


def cascadeMean():
    fetchGrades = '''
            SELECT id, fouth_grade, fifth_grade, sixth_grade, seventh_grade, eigth_grade, ninth_grade
            FROM `well_being`
            '''
    insertMeanAbs = '''
        UPDATE well_being
        SET mean = ?
        WHERE id = ?
    '''
    fetchGender = '''
        SELECT id, boy, girl
        FROM wb_gender
        WHERE id = ?
    '''
    insertSpecAbs = '''
        UPDATE wb_gender
        SET mean = ?
        WHERE id = ?
    '''
    fetchDetail = '''
        SELECT mean
        FROM wb_attributes
        WHERE id = ?
    '''
    c.execute(fetchGrades)
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
                c.execute(fetchGender, (value,))
                specific_abs = c.fetchall()
                tempMeans = []
                sid = specific_abs[0][0]
                # print(specific_abs)
                specific_abs = iter(specific_abs[0])
                # print(sid)
                next(specific_abs)
                specMean = 0.0
                for detailed in specific_abs:
                    c.execute(fetchDetail, (detailed,))
                    detailedMean = c.fetchall()
                    # print("dt mean: " + str(detailedMean))
                    try:
                        if detailedMean[0][0] != None:
                            # print(detailedMean)
                            tempMeans.append(detailedMean[0][0])
                    except:
                        pass
                if not tempMeans:
                    continue
                for t in tempMeans:
                    specMean += t
                specMean = specMean / len(tempMeans)
                # print("Spec mean " + str(specMean))
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


def translateGrade(string):
    if string == "4. klasse":
        return "fouth_grade"
    if string == "5. klasse":
        return "fifth_grade"
    if string == "6. klasse":
        return "sixth_grade"
    if string == "7. klasse":
        return "seventh_grade"
    if string == "8. klasse":
        return "eigth_grade"
    if string == "9. klasse":
        return "ninth_grade"


def checkExistance(values):
    sqlCheckInstitutionQuery = '''
    SELECT WELL_BEING
    FROM `INSTITUTION`
    WHERE NAME = ? and YEAR = ?;
    '''
    c.execute(sqlCheckInstitutionQuery, values)
    fetchData = c.fetchall()
    if not fetchData:
        return False, None
    else:
        idd = fetchData[0][0]
        # print(idd)
        return True, idd


def createEmptyWB(school, year):
    createEmptyWB = '''
    INSERT INTO well_being (fouth_grade)
    VALUES (NULL)
    '''
    insertToInstitution = '''
    INSERT INTO INSTITUTION (NAME, YEAR, WELL_BEING)
    VALUES (?,?,?)
    '''
    updateToInstitution = '''
    UPDATE INSTITUTION
    SET WELL_BEING = ?
    WHERE NAME = ? and YEAR = ?;
    '''
    c.execute(createEmptyWB)
    curid = c.lastrowid
    try:
        c.execute(insertToInstitution, (school, year, curid))
    except:
        c.execute(updateToInstitution, (curid, school, year))


def checkWBClass(iddd, wclass):
    sqlCheckInstitutionQuery = '''
    SELECT ''' + wclass + '''
    FROM `well_being`
    WHERE id = ?;
    '''
    c.execute(sqlCheckInstitutionQuery, (iddd,))
    fetchData = c.fetchall()
    # print(wclass)
    # print(fetchData)
    if not fetchData:
        return False, None
    else:
        idd = fetchData[0][0]
        return True, idd


def createEmptyWBGender(idd, curClass):
    createEmptyDetailedAbsense = '''
    INSERT INTO wb_gender (mean) 
    VALUES (NULL)
    '''
    updateToAbsence = '''
    UPDATE well_being
    SET ''' + curClass + ''' = ?
    WHERE id = ?
    '''
    c.execute(createEmptyDetailedAbsense)
    curid = c.lastrowid
    c.execute(updateToAbsence, (curid, idd))


def calcMean(points):
    meansOfPoints = [1.55, 2.55, 3.55, 4.55]
    mean = 0
    i = -1
    for p in points:
        i += 1
        if str(p) == "nan":
            pass
        else:
            mean = mean + (p * meansOfPoints[i])
    return mean


def insertWBAtt(idd, gender, concreteID):
    updateDetailed = '''
    UPDATE wb_gender
    SET ''' + gender + ''' = ?
    WHERE id = ?
    '''
    c.execute(updateDetailed, (concreteID, idd))


def cascadeUpdate(school, year, gender, curClass, concreteID):
    isThere, idd = checkExistance((school, year))
    if isThere and idd != None:
        # Table exist
        # print("school and year here id: " + str(idd))
        isThere, didd = checkWBClass(idd, curClass)
        if isThere and didd != None:
            # print("now it here :)")
            insertWBAtt(didd, gender, concreteID)
        else:
            # print("is not here xd")
            createEmptyWBGender(idd, curClass)
            cascadeUpdate(school, year, gender, curClass, concreteID)
    else:
        # Create Absense Entry
        # print("not here :(")
        createEmptyWB(school, year)
        cascadeUpdate(school, year, gender, curClass, concreteID)


def insertIntoTable(school, year, gender, curClass, dataPoints):
    insertIntoAttributes = '''
    INSERT INTO wb_attributes (one_two, two_three, tree_four, four_five, mean)
    VALUES(?,?,?,?,?)
    '''
    mean = calcMean(dataPoints)

    # print("%s %s with type: %s and %s has DATAPOINTS: %s" %
    #       (school, year, curType, curClass, str(dataPoints)))

    c.execute(insertIntoAttributes, dataPoints + (mean,))
    curid = c.lastrowid
    cascadeUpdate(school, year, gender, curClass, curid)


def containTotal(string):
    for s in string.split(" "):
        if s == "Total":
            return True
    return False


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

print(years)
print(rowWithYear)

print("Starting Inserstion")

sex = "All"
i = rowWithYear + 1

Wait.printProgressBar(i, len(data)-1,
                      prefix='Progress:', suffix='Complete', length=50)

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
    if containTotal(curDataPoint):
        i += 1
        continue

    # DETERMENTING BOY OR GIRL
    if curDataPoint == "Dreng":
        curType = "boy"
        i += 1
        continue
    if curDataPoint == "Pige":
        curType = "girl"
        i += 1
        continue

    # DETERMENT CURRENT CLASS
    try:
        if curDataPoint.split(".")[1] == " klasse":
            curClass = translateGrade(curDataPoint)
            i += 1
            continue
    except:
        pass

    # PASS REGIONS
    if curDataPoint in CONSTANTS.REGIONS:
        i += 1
        continue

    # print(curDataPoint)
    for year in years:
        yh_data = ()
        for specificData in years[year]:
            yh_data = yh_data + (data[specificData][i],)

        insertIntoTable(curDataPoint, year, curType, curClass, yh_data)

    i += 1
    # con.commit()
    Wait.printProgressBar(i, len(data)-1,
                          prefix='Progress:', suffix='Complete', length=50)


print("\n Done inserting")
print("Calculating means...")

cascadeMean()


print("Insertion finished")

con.commit()
con.close()
