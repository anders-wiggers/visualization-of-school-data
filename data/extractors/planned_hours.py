import sqlite3
from sqlite3 import Error
import pandas as pd
import os


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
excelFilename = "Planlagte timer - Skoleaarets laengde.xlsx"

filepath = os.path.realpath(__file__)
baseDataDir = goUpDir(filepath, 2)
print(baseDataDir)

con = sqlite3.connect(baseDataDir + "/db/" + filename+".db")

c = con.cursor()  # The database will be saved in the location where your 'py' file is saved

data = pd.read_excel(baseDataDir + "/excel/" + excelFilename, index_col=0)

try:
    c.execute('''CREATE TABLE IF NOT EXISTS planned_hours (
                id INTEGER PRIMARY KEY, kinder_grade INTEGER,
                first_grade INTEGER, second_grade INTEGER,
                third_grade INTEGER, fouth_grade INTEGER,
                fifth_grade INTEGER, sixth_grade INTEGER,
                seventh_grade INTEGER, eighth_grade INTEGER,
                ninth_grade INTEGER, tenth_grade INTEGER
                )''')
except Error as e:
    print(e)


def insertIntoTable(values):
    try:
        c.execute(''' INSERT INTO planned_hours(id, kinder_grade, first_grade, second_grade, third_grade,
                        fouth_grade, fifth_grade, sixth_grade, seventh_grade,
                        eighth_grade, ninth_grade, tenth_grade)
              VALUES(?,?,?,?,?,?,?,?,?,?,?,?) ''', values)
        con.commit()
    except Error as e:
        print(e)


"""
id = 1000
values = (id, 20, 10, 123, 456, 783, 42, 86, 145, 78, 321)
insertIntoTable(values)

"""
print(data.head())

years = {}
counter = 0

# preb data
for col in data:
    year = data[col][7]
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

i = 40
while i < 40+1:
    school = data['Unnamed: 1'][i]
    if str(school) != "nan":
        print(str(data['Unnamed: 1'][i]))
        idd = 1
        for year in years:
            idd = idd + 1
            queryData = (idd,)
            for speceficClass in years[year]:
                queryData = queryData + (data[speceficClass][i],)
            insertIntoTable(queryData)
    break
    i = i + 1


"""
for i in range(50):
    print(str(data['Unnamed: 1'][i]) + " med: " + str(data['Unnamed: 2'][i]))
"""
