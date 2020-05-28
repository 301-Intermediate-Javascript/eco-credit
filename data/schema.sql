DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS location CASCADE;
DROP TABLE IF EXISTS surveyinfo CASCADE;
DROP TABLE IF EXISTS carboninfo CASCADE;

DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS location CASCADE;
DROP TABLE IF EXISTS surveyinfo CASCADE;
DROP TABLE IF EXISTS carboninfo CASCADE;

CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  ecoscore INT,
  username VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE location (
  id SERIAL PRIMARY KEY,
  username INT NOT NULL,
  zipcode INT,
  ecoscore INT,
  FOREIGN KEY (username) REFERENCES profiles (id)  
);

CREATE TABLE surveyinfo (
  id SERIAL PRIMARY KEY,
  username INT NOT NULL,
  ecoscore INT,
  energy FLOAT,
  shower INT,
  car_travel FLOAT,
  FOREIGN KEY (username) REFERENCES profiles (id)
);

CREATE TABLE carboninfo (
  id SERIAL PRIMARY KEY,
  username INT NOT NULL,
  ecoscore INT,
  energy FLOAT,
  shower FLOAT,
  car_travel FLOAT,
  FOREIGN KEY (username) REFERENCES profiles (id)
);

SELECT * FROM location JOIN profiles ON location.username = profiles.id;
SELECT * FROM surveyinfo JOIN profiles ON surveyinfo.username = profiles.id;
SELECT * FROM carboninfo JOIN profiles ON carboninfo.username = profiles.id;