CREATE OR ALTER PROCEDURE getProjectByID
@ProjectID UNIQUEIDENTIFIER
AS
BEGIN
    SELECT *
    FROM Projects
    WHERE ProjectID = @ProjectID;
END