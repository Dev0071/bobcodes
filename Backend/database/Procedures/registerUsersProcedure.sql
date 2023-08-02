CREATE OR ALTER PROCEDURE registerUsersProcedure(
    @UserID NVARCHAR(255),
    @Username NVARCHAR(255),
    @Email NVARCHAR(100),
    @Password NVARCHAR(500),
    @isAdmin BIT
)
AS
BEGIN
    IF EXISTS (SELECT Email FROM Users WHERE Email = @Email)
        BEGIN
            THROW 50000, 'Email is already registered.', 1;
            RETURN;
        END

    IF @isAdmin = 1 AND EXISTS (SELECT UserID FROM Users WHERE isAdmin = 1)
        BEGIN
            THROW 50001, 'An admin user already exists. Cannot create another admin.', 1;
            RETURN;
        END

    INSERT INTO Users (UserID, Username, Email, Password, isAdmin)
    VALUES (@UserID, @Username, @Email, @Password, @isAdmin);
END
