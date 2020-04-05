import sqlite3
import pandas as pd



filename = "full_database" #Name of file for conversion

con=sqlite3.connect(r'data\db\\'+filename+".db")

c = con.cursor() # The database will be saved in the location where your 'py' file is saved

# Create table - YEARS
c.execute('''CREATE TABLE "2013"([INSTITUTION] TEXT PRIMARY KEY)''')

c.execute('''CREATE TABLE "2014"([INSTITUTION] TEXT PRIMARY KEY)''')

c.execute('''CREATE TABLE "2015"([INSTITUTION] TEXT PRIMARY KEY)''')

c.execute('''CREATE TABLE "2016"([INSTITUTION] TEXT PRIMARY KEY)''')

c.execute('''CREATE TABLE "2017"([INSTITUTION] TEXT PRIMARY KEY)''')

c.execute('''CREATE TABLE "2018"([INSTITUTION] TEXT PRIMARY KEY)''')

c.execute('''CREATE TABLE "2019"([INSTITUTION] TEXT PRIMARY KEY)''')

# Create table - INSTITUTION
c.execute('''CREATE TABLE INSTITUTION(
            [NAME] TEXT PRIMARY KEY,
            [GRADES] TEXT, [STUDENTS] TEXT
            )''')
        
# Create table - SPECIFIC GRADE
c.execute('''CREATE TABLE SPECIFIC_GRADE(
            [GRADE_ID] TEXT PRIMARY KEY, 
            [MEAN] INTEGER, [FEMALE] INTEGER, 
            [MALE] INTEGER, [DISTRIBUTION] INTEGER, 
            [PARENTAL STATUS] TEXT
            )''')

con.commit()

#konstanter
all_tables_in_database = c.execute("SELECT * FROM information_schema.tabes")

#Insert institution names
df = pd.read_sql_table(r'data\db\Resultater_Folkeskolens_Afgangseksamen', con)
institutions = df['Instition'].toList()
values = pd.Series(institutions)

for table in all_tables_in_database:
    if table = #HVIS TABLE ER ET YEAR-TABLE:
    c.execute("INSERT INTO " +table+"(INSTITUTION) VALUES ("+institutions+")")



con.close()

