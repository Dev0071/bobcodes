CREATE OR ALTER PROCEDURE getUsernamesByProjectId
    @ProjectID UNIQUEIDENTIFIER
AS
BEGIN
    SELECT u.Username
    FROM Users u
    INNER JOIN UserProjects up ON u.UserID = up.UserID
    WHERE up.ProjectID = @ProjectID;
END;