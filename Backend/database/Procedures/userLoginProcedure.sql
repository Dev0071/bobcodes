CREATE OR ALTER PROCEDURE userLoginProcedure
@Email NVARCHAR(100)
AS
BEGIN
    SELECT UserID, Username, Email, Password, isAdmin
    FROM Users
    WHERE Email = @Email
END
