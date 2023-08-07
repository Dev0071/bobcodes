CREATE OR ALTER PROCEDURE GetUserProjects
@UserID NVARCHAR(255)
AS
BEGIN
    SELECT up.UserProjectID, up.ProjectID, p.Name AS ProjectName, p.Description AS ProjectDescription, p.EndDate AS ProjectEndDate
    FROM UserProjects up
             INNER JOIN Projects p ON up.ProjectID = p.ProjectID
    WHERE up.UserID = @UserID;
END
