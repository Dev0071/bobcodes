CREATE TABLE Projects
(

    ProjectID   UNIQUEIDENTIFIER PRIMARY KEY,

    Name        NVARCHAR(255) NOT NULL,

    Description NVARCHAR(MAX),

    EndDate     DATE

);