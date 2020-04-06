import sqlite3
import pandas as pd

filename = "Resultater_Folkeskolens_Afgangseksamen" #Name of file for conversion


con=sqlite3.connect(r'data/db//'+filename+".db")
c = con.cursor()


dataframe=pd.read_excel((r'data/excel//'+filename+".xlsx") ,skiprows=6) #read excel file
#dataframe.drop(["Row Labels"],axis = 1, inplace = True) #Drop the column named Row Labels and use the change in the main dataframe
dataframe.rename(columns={'Institution Postfix' : 'Institution',
                        '2012/2013' : '2013', '2013/2014' : '2014', '2014/2015' : '2015',
                        '2015/2016' : '2016', '2016/2017' : '2017', '2017/2018' : '2018',
                        '2018/2019' : '2019',},inplace=True)

print(dataframe.columns)
print(dataframe.head)

#Open main database
filename = "full_database"
con=sqlite3.connect(r'data/db//'+filename+".db")
c = con.cursor()

#Insert institution names
institutions = dataframe['Institution']
print("printer institutions")
print(institutions)

for school in institutions:
    c.execute('''INSERT INTO INSTITUTION(NAME) VALUES ("school")''')


