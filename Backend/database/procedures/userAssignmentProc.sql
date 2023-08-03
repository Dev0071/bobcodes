CREATE OR ALTER PROCEDURE AssignProjectToUser
    @UserProjectID UNIQUEIDENTIFIER,
    @UserID NVARCHAR ,
    @Username NVARCHAR(255),
    @ProjectID UNIQUEIDENTIFIER,
    @ProjectName NVARCHAR(255)
AS
BEGIN
   
    -- Insert the assignment into the UserProjects table
    INSERT INTO UserProjects (UserProjectID, UserID, Username,ProjectID, ProjectName)
    VALUES (@UserProjectID, @UserID, @Username,@ProjectID, @ProjectName);
END
