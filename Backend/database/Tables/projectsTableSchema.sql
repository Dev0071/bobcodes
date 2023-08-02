
-- SELECT * FROM Projects

CREATE TABLE Projects (
    ProjectID UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    EndDate DATE
);


--DELETE Projects

-- SELECT * FROM Projects WHERE Name = "js"
ALTER TABLE Projects
ADD IsComplete BIT NOT NULL DEFAULT 0;
