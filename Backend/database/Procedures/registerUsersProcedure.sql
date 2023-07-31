    CREATE OR ALTER PROCEDURE registerUsersProcedure(@UserID NVARCHAR(200), @Username NVARCHAR(50), @Email NVARCHAR(100),
                                                     @Password NVARCHAR(100), @isAdmin BIT)
    AS
    BEGIN
        INSERT INTO Users(UserID, Username, Email, Password, isAdmin)
        VALUES (@UserID, @Username, @Email, @Password, @isAdmin)
    end

