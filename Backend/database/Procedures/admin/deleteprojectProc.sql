CREATE OR ALTER PROCEDURE DeleteProject
    @ProjectName NVARCHAR(255) -- Assuming the Name can be up to 255 characters long
AS
BEGIN
    
    BEGIN TRANSACTION;

    DELETE FROM UserProjects WHERE ProjectID = (SELECT ProjectID FROM Projects WHERE Name = @ProjectName);

    DELETE FROM Projects WHERE Name = @ProjectName;

    COMMIT TRANSACTION;

    SELECT 'Project deleted successfully' AS Message;
END
