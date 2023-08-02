CREATE OR ALTER PROCEDURE checkExistingUser
@Email NVARCHAR(100)
AS
    BEGIN
        SELECT * FROM Users WHERE Email = @Email
    end