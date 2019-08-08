DROP PROCEDURE IF EXISTS `testLookup`;

DELIMITER $$
CREATE PROCEDURE `testLookup`
(
    test_date DATE,
    test_grade INT
)
BEGIN
    SELECT subject_name AS subject, type, prepare, CONCAT(first_name, ' ', last_name) AS teacher
    FROM subjects, tests, teachers
    WHERE date = test_date AND
          tests.grade = test_grade AND
          tests.subject_id = subjects.subject_id AND
          tests.teacher = teachers.username;
END;
$$
