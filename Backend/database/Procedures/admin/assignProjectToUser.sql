CREATE OR ALTER PROCEDURE AssignProjectToUser
    @UserProjectID UNIQUEIDENTIFIER,
    @UserID NVARCHAR(255),
    @Username NVARCHAR(255),
    @ProjectID NVARCHAR(255),
    @ProjectName NVARCHAR(255)
AS
BEGIN
    BEGIN TRANSACTION


    INSERT INTO UserProjects (UserProjectID, UserID, Username, ProjectID, ProjectName)
    VALUES (@UserProjectID, @UserID, @Username, @ProjectID, @ProjectName);


    UPDATE Users SET IsAssigned = 1 WHERE UserID = @UserID;

    COMMIT TRANSACTION;

    SELECT 'Project assigned to user successfully' AS Message;
END

-- DECLARE @ProjectID NVARCHAR(255);
--     SET @ProjectID = '4a735f6e-9734-46d2-bc32-fee9540ee7a3'; -- Replace with the actual project ID

-- -- Query to retrieve users under the specified project
-- SELECT UserID, Username
-- FROM UserProjects
-- WHERE ProjectID = @ProjectID;