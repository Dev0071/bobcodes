CREATE OR ALTER PROCEDURE checkUserAssignment
    @UserID NVARCHAR(36)
AS
BEGIN
    
    SELECT * FROM UserProjects WHERE UserID = @UserID;
END
