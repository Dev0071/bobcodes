CREATE TABLE Users (
    UserID  NVARCHAR(200) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    Password NVARCHAR(100) NOT NULL,
    isAdmin BIT DEFAULT 0
);
--- admin registerUsersProcedure.sql project, delette project, get all users from users projwcts table, get all usrs. get all projects, get projects in users projects ttable


select * from Users;