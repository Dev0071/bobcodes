CREATE OR ALTER PROCEDURE userLoginProcedure(@email NVARCHAR(100))
AS
    BEGIN
        SELECT * FROM Users where Email = @email
    END

