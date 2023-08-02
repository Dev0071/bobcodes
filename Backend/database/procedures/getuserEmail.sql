CREATE OR ALTER PROCEDURE getUserEmail
    @projectId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT u.email
    FROM Users u
    INNER JOIN UserProjects up ON u.UserID = up.UserID
    WHERE up.ProjectID = @projectId;
END
