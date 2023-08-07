CREATE OR ALTER PROCEDURE GetUsersUnderProject
@ProjectID NVARCHAR(255)
AS
BEGIN
    SELECT UserID, Username
    FROM UserProjects
    WHERE ProjectID = @ProjectID;
END;

