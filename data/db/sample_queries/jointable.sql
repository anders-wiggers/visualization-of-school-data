-- SQLite
SELECT INSTITUTION.NAME, INSTITUTION.YEAR, grades.students_with_2, grades.male, grades.female, grades.mean
FROM 
INSTITUTION 
INNER JOIN grades
ON INSTITUTION.GRADES = grades.id
WHERE NAME LIKE "Rosenvangskolen%" 