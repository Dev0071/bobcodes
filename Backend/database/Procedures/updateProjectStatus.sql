CREATE OR ALTER PROCEDURE updateProjectStatus
    @ProjectID UNIQUEIDENTIFIER,
    @IsComplete BIT
AS
BEGIN
    UPDATE Projects
    SET IsComplete = @IsComplete
    WHERE ProjectID = @ProjectID;
END
