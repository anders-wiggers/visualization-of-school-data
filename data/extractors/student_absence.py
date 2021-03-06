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
excelFilename = "Elevfravaer - Skole - Skoletrin.xlsx"

filepath = os.path.realpath(__file__)
baseDataDir = goUpDir(filepath, 2)
print(baseDataDir)

con = sqlite3.connect(baseDataDir + "/db/" + filename+".db")

c = con.cursor()  # The database will be saved in the location where your 'py' file is saved

data = pd.read_excel(baseDataDir + "/excel/" + excelFilename)

try:
    c.execute('''CREATE TABLE IF NOT EXISTS absence(
            id INTEGER PRIMARY KEY,
            tenth_grade INTEGER,
            preb_school INTEGER,
            middle_school INTEGER,
            grad_school INTEGER,
            mean REAL
            )''')
except Error as e:
    print(e)

try:
    c.execute('''CREATE TABLE IF NOT EXISTS detailed_absence(
            id INTEGER PRIMARY KEY,
            mean REAL,
            native REAL,
            immigrant REAL,
            dec_immigrant REAL
            )''')
except Error as e:
    print(e)

try:
    c.execute('''CREATE TABLE IF NOT EXISTS specific_absence(
            id INTEGER PRIMARY KEY,
            legal INTEGER,
            illegal INTEGER,
            sickleave INTEGER,
            mean REAL
            )''')
except Error as e:
    print(e)


def insertIntoAbsence(name, year, tenth, preb, middle, grad):
    sqlCheckIfShcoolAndYearHasAbsence = '''
    SELECT ABSENCE
    FROM `INSTITUTION`
    WHERE NAME = ? and YEAR = ?;
    '''
    c.execute(sqlCheckIfShcoolAndYearHasAbsence, (name, year))
    fetchData = c.fetchall()
    if not fetchData or None in fetchData[0]:
        # If nothing is here insert
        # print("insert")
        c.execute('''
            INSERT INTO absence(tenth_grade,preb_school,middle_school,grad_school)
            VALUES(?,?,?,?) ''', (tenth, preb, middle, grad))
        curid = c.lastrowid
        insertIntoInstitution(curid, name, year)
    else:
        # If record is here update
        # print("update")
        absence_id = fetchData[0][0]
        c.execute('''
            UPDATE absence
            SET tenth_grade = ?,
                preb_school = ?,
                middle_school = ?,
                grad_school = ?
            WHERE id = ?;
            ''', (tenth, preb, middle, grad, absence_id))


def insertIntoDetailedAbsence(mean, native, immigrant, decImmigrant):
    c.execute('''
        INSERT INTO detailed_absence(mean,native,immigrant,dec_immigrant)
        VALUES(?,?,?,?) ''', (mean, native, immigrant, decImmigrant))
    curid = c.lastrowid
    return curid


def checkExistance(values):
    sqlCheckInstitutionQuery = '''
    SELECT ABSENCE
    FROM `INSTITUTION`
    WHERE NAME = ? and YEAR = ? and COMMUNE = ?;
    '''
    c.execute(sqlCheckInstitutionQuery, values)
    fetchData = c.fetchall()
    if not fetchData:
        return False, None
    else:
        idd = fetchData[0][0]
        # print(idd)
        return True, idd


def insertIntoInstitution(id, school, year):
    sqlInsitutionInsertQuery = '''
    INSERT INTO INSTITUTION (NAME, YEAR, ABSENCE)
    VALUES (?,?,?)
    '''
    sqlUpdateInstitutionsQuery = '''
    UPDATE INSTITUTION
    SET ABSENCE = ?
    WHERE NAME = ? and YEAR = ?;
    '''

    if checkExistance((school, year)):
        # print("updating")
        c.execute(sqlUpdateInstitutionsQuery, (id, school, year))

    else:
        # print("inserting")
        c.execute(sqlInsitutionInsertQuery, (school, year, id))


def checkAbsence(iddd, level):
    sqlCheckInstitutionQuery = '''
    SELECT ''' + level + '''
    FROM `absence`
    WHERE id = ?;
    '''
    c.execute(sqlCheckInstitutionQuery, (iddd,))
    fetchData = c.fetchall()
    # print(level)
    # print(fetchData)
    if not fetchData:
        return False, None
    else:
        idd = fetchData[0][0]
        return True, idd


def createEmptyAbsense(school, year, commune):
    createEmptyAbsense = '''
    INSERT INTO absence (grad_school) 
    VALUES (NULL)
    '''
    insertToInstitution = '''
    INSERT INTO INSTITUTION (NAME, YEAR, COMMUNE, ABSENCE)
    VALUES (?,?,?,?)
    '''
    updateToInstitution = '''
    UPDATE INSTITUTION
    SET ABSENCE = ?
    WHERE NAME = ? AND YEAR = ? AND COMMUNE = ?;
    '''
    c.execute(createEmptyAbsense)
    curid = c.lastrowid
    try:
        c.execute(insertToInstitution, (school, year, commune, curid))
    except:
        c.execute(updateToInstitution, (curid, school, year, commune))


def createEmptySpecificAbsense(idd, level):
    createEmptyDetailedAbsense = '''
    INSERT INTO specific_absence (mean) 
    VALUES (NULL)
    '''
    updateToAbsence = '''
    UPDATE absence
    SET ''' + level + ''' = ?
    WHERE id = ?
    '''
    c.execute(createEmptyDetailedAbsense)
    curid = c.lastrowid
    c.execute(updateToAbsence, (curid, idd))


def insertDetailed(idd, absenceType, concreteID):
    updateDetailed = '''
    UPDATE specific_absence
    SET ''' + absenceType + ''' = ?
    WHERE id = ?
    '''
    c.execute(updateDetailed, (concreteID, idd))


def insertIntoSpecificAbsence(school, year, commune, level, absenceType, concreteID):
    isThere, idd = checkExistance((school, year, commune))
    if isThere and idd != None:
        # Table exist
        #print("school and year here id: " + str(idd))
        isThere, didd = checkAbsence(idd, level)
        if isThere and didd != None:
            #print("now it here :)")
            insertDetailed(didd, absenceType, concreteID)
        else:
            #print("is not here xd")
            createEmptySpecificAbsense(idd, level)
            insertIntoSpecificAbsence(
                school, year, commune, level, absenceType, concreteID)
    else:
        # Create Absense Entry
        #print("not here :(")
        createEmptyAbsense(school, year, commune)
        insertIntoSpecificAbsence(
            school, year, commune, level, absenceType, concreteID)


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

            except:
                pass
        if(rightRow):
            break
        rowWithYear = rowWithYear + 1

    # preb data
    for col in data:
        year = data[col][rowWithYear]
        print(year)
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
            pass

    return years, rowWithYear


years, rowWithYear = findYears(data)
counter = 0


print(years)
print(rowWithYear)


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
# i = 60
Wait.printProgressBar(i, len(data)-1,
                      prefix='Progress:', suffix='Complete', length=50)

decentdentCol = 'Unnamed: 6'
typeCol = 'Unnamed: 4'
gradeLevel = 'Unnamed: 3'


while i < len(data)-1:
    school = data["Unnamed: 5"][i]
    commune = data["Unnamed: 2"][i]

    if str(school) == "nan":
        i += 1
        continue

    # FINDING GRADELEVEL
    curLevel = str(data[gradeLevel][i])
    level = None
    if curLevel == "10. klasse mv.":
        level = "tenth_grade"
    if curLevel == "Indskoling":
        level = "preb_school"
    if curLevel == "Mellemtrin":
        level = "middle_school"
    if curLevel == "Udskoling":
        level = "grad_school"

    # FINDING CATEGORIES
    findStudents = True
    amountOfCategories = 0
    while findStudents:
        if str(data[decentdentCol][i+amountOfCategories]) == "nan":
            findStudents = False
        amountOfCategories += 1

    # print(amountOfCategories)

    # FINDING Type of abesence
    absType = str(data[typeCol][i])
    absenceType = None
    if absType == "Fravær med tilladelse":
        absenceType = "legal"
    if absType == "Sygefravær":
        absenceType = "sickleave"
    if absType == "Ulovligt fravær":
        absenceType = "illegal"
    if absType == "nan":
        i += 1
        continue

    # RUNNING THROUGH YEARS
    for year in years:
        col = years[year][0]
        curCat = 0
        native = None
        imi = None
        dec = None
        avage = None
        while curCat < amountOfCategories:
            dataType = str(data[decentdentCol][i+curCat])
            if(dataType == "Dansk"):
                native = data[col][i+curCat]
            if(dataType == "Efterkommer"):
                imi = data[col][i+curCat]
            if(dataType == "Indvandrer"):
                dec = data[col][i+curCat]
            if(dataType == "nan"):
                avage = data[col][i+curCat]
            curCat += 1
        # print(str(school) + " has in year " + year + " navtive:" + str(native) +
        #       " imi:" + str(imi) + " dec:" + str(dec) + " and avage:" + str(avage) + " was " + absenceType + " in the " + level)

        curID = insertIntoDetailedAbsence(avage, native, imi, dec)
        insertIntoSpecificAbsence(
            school, year, commune, level, absenceType, curID)

    i += amountOfCategories

    Wait.printProgressBar(i, len(data)-1,
                          prefix='Progress:', suffix='Complete', length=50)

con.commit()

print("Caltulating Means...")

calculateMeans()

print("Done")

con.commit()
