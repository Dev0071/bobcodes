-- CREATE OR ALTER PROCEDURE getProjectByID
-- @ProjectID UNIQUEIDENTIFIER
-- AS
-- BEGIN
--     SELECT *
--     FROM Projects
--     WHERE ProjectID = @ProjectID;
-- END


-- CREATE OR ALTER PROCEDURE getProjectByID
-- @ProjectID UNIQUEIDENTIFIER
-- AS
-- BEGIN
--     -- Check if the project exists
--     IF EXISTS (SELECT 1 FROM Projects WHERE ProjectID = @ProjectID)
--     BEGIN
--         -- Project exists, retrieve its information
--         SELECT *
--         FROM Projects
--         WHERE ProjectID = @ProjectID;
--     END
--     ELSE
--     BEGIN
--         -- Project doesn't exist, raise an error
--         THROW 50000, 'Project not found', 1;
--     END
-- END;

-- CREATE OR ALTER PROCEDURE getProjectByID
-- @ProjectID UNIQUEIDENTIFIER
-- AS
-- BEGIN
--     -- Check if the project exists
--     IF EXISTS (SELECT 1 FROM Projects WHERE ProjectID = @ProjectID)
--     BEGIN
--         -- Project exists, retrieve its information
--         SELECT *
--         FROM Projects
--         WHERE ProjectID = @ProjectID;
--     END
-- END;

--calvince
-- CREATE OR ALTER PROCEDURE getProjectByID(@ProjectID UNIQUEIDENTIFIER)

-- AS

--     BEGIN

--         SELECT * FROM Projects WHERE ProjectID = @ProjectID

--     END

-- paul
CREATE OR ALTER PROCEDURE getProjectByID

   (@ProjectID VARCHAR(200))

AS

BEGIN

    SELECT * FROM Projects WHERE ProjectID = @ProjectID

END

GO