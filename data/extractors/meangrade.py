import sqlite3
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
excelFilename = "Resultater - Folkeskolens Afgangseksamen.xlsx"

filepath = os.getcwd()
baseDataDir = goUpDir(filepath, 1)

con = sqlite3.connect(baseDataDir + "/db/" + filename+".db")

c = con.cursor()  # The database will be saved in the location where your 'py' file is saved

pd.read_excel(baseDataDir + "/excel/" + excelFilename, index_col=0)
