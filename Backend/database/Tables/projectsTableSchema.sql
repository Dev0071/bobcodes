CREATE TABLE Projects (
    ProjectID NVARCHAR(200) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    EndDate DATE
);


