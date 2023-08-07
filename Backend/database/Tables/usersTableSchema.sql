
CREATE TABLE Users (
    UserID NVARCHAR(255) PRIMARY KEY,
    Username NVARCHAR(255) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    Password NVARCHAR(500) NOT NULL,
    isAdmin BIT DEFAULT 0
);

