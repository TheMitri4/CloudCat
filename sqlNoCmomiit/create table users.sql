-- SQLite
CREATE TABLE users (
 id INTEGER PRIMARY KEY,
 login TEXT NOT NULL,
 password TEXT NOT NULL,
 token TEXT NOT NULL,
 fname TEXT NOT NULL,
 lname TEXT NOT NULL,
 isAdmin INTEGER NOT NULL,
 enterprise TEXT NOT NULL
);