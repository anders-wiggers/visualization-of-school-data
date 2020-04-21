-- SQLite
SELECT i.NAME, i.YEAR, a.mean as "TOTAL MEAN", d.mean AS "SickLeave Mean" 
FROM INSTITUTION i 

-- Join absence and insitution where Abscense id = instution.ABSENCE
INNER JOIN absence a
ON i.ABSENCE = a.id

-- Join specific absence where id match
INNER JOIN specific_absence s
ON a.tenth_grade = s.id

-- Join detailed_absence
INNER JOIN detailed_absence d
ON s.sickleave = d.id

WHERE i.NAME = "Brøndagerskolen, Helhedstilbudet"


