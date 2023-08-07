

-- SELECT * FROM Projects

CREATE TABLE Projects (
    ProjectID UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL ,
    EndDate DATE NOT NULL ,
    IsComplete BIT NOT NULL DEFAULT 0
);


--DELETE Projects

-- SELECT * FROM Projects WHERE Name = "js"
ALTER TABLE Projects
ADD IsComplete BIT NOT NULL DEFAULT 0;


SELECT * FROM Projects;