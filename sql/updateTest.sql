DROP PROCEDURE IF EXISTS `updateTest`;

CREATE PROCEDURE `updateTest`
(
    date DATE,
    subject_id INT,
    grade INT,
    type ENUM('T', 'Q', 'B'),
    prepare VARCHAR(512),
    id INT
)
BEGIN
    UPDATE tests
    SET
        date = date,
        subject_id = subject_id,
        grade = grade,
        type = type,
        prepare = prepare
    WHERE
        test_id = id;
END
