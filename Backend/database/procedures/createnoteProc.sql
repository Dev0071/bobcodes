CREATE OR ALTER PROCEDURE createNote
    @id NVARCHAR(36),
    @content NVARCHAR(MAX),
    @title NVARCHAR(255),
    @createdAt DATETIME2
AS
BEGIN
    INSERT INTO notes (id,content, title, createdAt)
    VALUES (@id ,@content, @title, @createdAt);
END
