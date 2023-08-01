CREATE OR ALTER PROCEDURE createProject

    @ProjectID NVARCHAR (500),

    @Name NVARCHAR(255),

    @Description NVARCHAR(MAX),

    @EndDate DATE

AS

BEGIN



    INSERT INTO Projects (ProjectID, Name, Description, EndDate)

    VALUES (@ProjectID, @Name, @Description, @EndDate);

END