DROP PROCEDURE IF EXISTS `bookTest`;

CREATE PROCEDURE `bookTest`
(
    date DATE,
    subject_id INT,
    grade INT,
    type ENUM('T', 'Q', 'B'),
    prepare VARCHAR(512),
    teacher CHAR(40)
)
BEGIN
    INSERT INTO tests VALUE(
        date,
        subject_id,
        grade,
        type,
        prepare,
        teacher,
        NULL
    );
END
