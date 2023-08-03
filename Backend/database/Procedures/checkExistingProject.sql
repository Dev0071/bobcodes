CREATE OR ALTER PROCEDURE getProjectsByName
    @Name NVARCHAR(255)
AS
BEGIN
    SELECT * FROM Projects WHERE Name = @Name;
END
        