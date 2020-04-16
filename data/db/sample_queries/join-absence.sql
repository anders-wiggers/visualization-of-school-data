-- SQLite
SELECT i.NAME, i.YEAR, a.tenth_grade, s.mean, d.mean 
FROM INSTITUTION i 

INNER JOIN absence a
ON i.ABSENCE = a.id

INNER JOIN specific_absence s
ON a.tenth_grade = s.id

INNER JOIN detailed_absence d
ON s.sickleave = d.id

WHERE i.NAME = "Brøndagerskolen, Helhedstilbudet"


