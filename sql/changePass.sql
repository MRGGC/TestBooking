DROP PROCEDURE IF EXISTS `changePass`;

CREATE PROCEDURE `changePass`
(
    user CHAR(40),
    pass CHAR(60)
)
BEGIN
    UPDATE accounts
    SET password = pass
    WHERE username = user;
END
