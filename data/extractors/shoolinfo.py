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
excelFilename = "filename=InstReg-udtraek05-05-2020.xlsx"

filepath = os.path.realpath(__file__)
baseDataDir = goUpDir(filepath, 2)

con = sqlite3.connect(baseDataDir + "/db/" + filename+".db")

c = con.cursor()  # The database will be saved in the location where your 'py' file is saved

data = pd.read_excel(baseDataDir + "/excel/" +
                     excelFilename)


try:
    c.execute('''
        ALTER TABLE INSTITUTION
        ADD COLUMN INFORMATION INTEGER;
    ''')
except:
    print("Cannot Create column, column is there")


try:
    c.execute('''
            CREATE TABLE IF NOT EXISTS information(
            id INTEGER PRIMARY KEY,
            address TEXT,
            zip INTEGER,
            phone TEXT,
            mail TEXT,
            website TEXT,
            principal TEXET,
            latitude REAL,
            longitude REAL
            )''')
except Error as e:
    print(e)


def prebCommune(commune):
    commune = str(commune).split(" ")
    del commune[-1]
    commune = "".join(commune)

    c.execute('''SELECT COMMUNE FROM INSTITUTION WHERE COMMUNE = ?''', (commune,))
    fetch = c.fetchall()
    if not fetch:
        return commune[:-1]
    return commune


def isSchoolContainedInDatabase(school):
    sqlCheckInstitutionQuery = '''
    SELECT SOCIOECONOMIC
    FROM INSTITUTION
    WHERE NAME = ?
    '''
    c.execute(sqlCheckInstitutionQuery, (school,))
    fetchData = c.fetchall()
    if not fetchData:
        return False
    else:
        # print(idd)
        return True


def alterTables(idd, school):

    pass


print(data.head())

longCol = "GEO_LAENGDE_GRAD"
latCol = "GEO_BREDDE_GRAD"

i = 0

print("Starting Inserstion")

Wait.printProgressBar(i, len(data)-1,
                      prefix='Progress:', suffix='Complete', length=50)

while i < len(data):

    school = data["INST_NAVN"][i]

    # Test if school is contain in db
    if isSchoolContainedInDatabase(school) == False:
        i += 1
        continue

    commune = prebCommune(str(data["BEL_KOMMUNE_NAVN"][i]))
    address = data["INST_ADR"][i]
    zipp = data["POSTNR"][i]
    phone = data["TLF_NR"][i]
    mail = data["E_MAIL"][i]
    website = data["WEB_ADR"][i]
    pricipal = data["INST_LEDER"][i]
    lat = data[latCol][i]
    lon = data[longCol][i]

    try:
        lat = lat.replace(",", ".")
        lon = lon.replace(",", ".")
    except:
        pass

    # Add infomation to db
    c.execute('''
        INSERT INTO information (address, zip, phone, mail, website, principal, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (address, str(zipp), phone, mail, website, pricipal, lat, lon))
    curid = c.lastrowid

    # Alter school tables to include details
    c.execute('''
        UPDATE INSTITUTION
        SET INFORMATION = ?
        WHERE NAME = ? AND COMMUNE = ?
    ''', (curid, school, commune))

    i += 1
    Wait.printProgressBar(i, len(data)-1,
                          prefix='Progress:', suffix='Complete', length=50)


con.commit()
con.close()
