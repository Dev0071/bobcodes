CREATE OR ALTER PROCEDURE AssignProjectToUser
    @UserProjectID UNIQUEIDENTIFIER,
    @UserID NVARCHAR(255),
    @Username NVARCHAR(255),
    @ProjectID NVARCHAR(255),
    @ProjectName NVARCHAR(255)
AS
BEGIN
    BEGIN TRANSACTION;

    -- Insert the assignment into the UserProjects table
    INSERT INTO UserProjects (UserProjectID, UserID, Username, ProjectID, ProjectName)
    VALUES (@UserProjectID, @UserID, @Username, @ProjectID, @ProjectName);

    -- Update IsAssigned to 1 in the Users table
    UPDATE Users SET IsAssigned = 1 WHERE UserID = @UserID;

    COMMIT TRANSACTION;

    SELECT 'Project assigned to user successfully' AS Message;
END

