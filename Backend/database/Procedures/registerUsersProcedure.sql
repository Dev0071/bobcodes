    CREATE OR ALTER PROCEDURE registerUsersProcedure(@UserID NVARCHAR(255),
    @Username NVARCHAR(255), @Email NVARCHAR(100),
                                                     @Password NVARCHAR(500), @isAdmin BIT)
    AS
    BEGIN
        INSERT INTO Users(UserID, Username, Email, Password, isAdmin)
        VALUES (@UserID, @Username, @Email, @Password, @isAdmin)
    END

