-- start a transaction
BEGIN TRANSACTION;
 
-- Here you can drop column or rename column
CREATE TABLE IF NOT EXISTS temp_table(
            NAME TEXT,
            YEAR INTEGER,
            GRADES TEXT,
            ABSENCE TEXT,
            STUDENTS TEXT,
            PLANNED_HOURS INTEGER,
            PRIMARY KEY (NAME, YEAR)
);
-- copy data from the table to the new_table
INSERT INTO temp_table(NAME, YEAR, GRADES, ABSENCE, STUDENTS, PLANNED_HOURS)
SELECT NAME, YEAR, GRADES, ABSENCE, STUDENTS, PLANNED_HOURS
FROM INSTITUTION;
 
-- drop the table
DROP TABLE INSTITUTION;
 
-- rename the new_table to the table
ALTER TABLE temp_table RENAME TO INSTITUTION; 
 
-- commit the transaction
COMMIT;