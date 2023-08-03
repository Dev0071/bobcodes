


-- SELECT * FROM UserProjects

DROP TABLE UserProjects
SELECT * FROM UserProjects;
DELETE UserProjects

CREATE TABLE UserProjects (
    UserProjectID UNIQUEIDENTIFIER PRIMARY KEY,
    UserID NVARCHAR(255) NOT NULL,
    Username NVARCHAR(255) NOT NULL,
    ProjectID UNIQUEIDENTIFIER NOT NULL,
    ProjectName NVARCHAR(255) NOT NULL,
    CONSTRAINT FK_UserProjects_User FOREIGN KEY (UserID) REFERENCES Users (UserID),
    CONSTRAINT FK_UserProjects_Project FOREIGN KEY (ProjectID) REFERENCES Projects (ProjectID)
);
