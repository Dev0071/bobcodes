CREATE OR ALTER PROCEDURE updateProjectStatusProcedure
@ProjectID UNIQUEIDENTIFIER
AS
BEGIN
    BEGIN TRANSACTION;

    UPDATE Projects
    SET IsComplete = 1
    WHERE ProjectID = @ProjectID;

    COMMIT TRANSACTION;

    SELECT 'Project marked as complete' AS Message;
END


SELECT * FROM projects;
