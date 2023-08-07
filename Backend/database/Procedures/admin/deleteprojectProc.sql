
CREATE OR ALTER PROCEDURE DeleteProject
    @ProjectName NVARCHAR(255) 
AS
BEGIN
    DECLARE @ProjectID UNIQUEIDENTIFIER;

    -- Check if the project exists
    SELECT @ProjectID = ProjectID FROM Projects WHERE Name = @ProjectName;

    -- If project not found, return a message
    IF @ProjectID IS NULL
    BEGIN
        SELECT 'Project not found' AS Message;
        RETURN;
    END
    
    BEGIN TRANSACTION;

    -- Delete user assignments
    DELETE FROM UserProjects WHERE ProjectID = @ProjectID;

    -- Delete the project
    DELETE FROM Projects WHERE ProjectID = @ProjectID;

    COMMIT TRANSACTION;

    SELECT 'Project deleted successfully' AS Message;
END
