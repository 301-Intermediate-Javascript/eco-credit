-- address the profiles table
-- single insert command with a username, this way it'll generate the first serial id number (by defulat it'll be 1)
-- make fake insert commands using 1
-- go table by table, one at a time, inserting fake info... in the username column, need to enter 1 because it's refrenceing the 1 from the profiles table
-- each time I think I have an insert working, SELECT * FROM table to see if it looks right
INSERT INTO profiles (username) VALUES ('fakeuser#1');

INSERT INTO location (username, zipcode) VALUES ('1', '90210');

INSERT INTO surveyinfo (username, ecoscore, energy, shower, car_travel) VALUES ('1', '98', '37', '5', '37');

INSERT INTO carboninfo (username, ecoscore, energy, shower, car_travel) VALUES ('1', '98', '37', '5', '37');


INSERT INTO profiles (username) VALUES ('fakeuser#2');

INSERT INTO location (username, zipcode) VALUES ('2', '90210');

INSERT INTO surveyinfo (username, ecoscore, energy, shower, car_travel) VALUES ('2', '96', '38', '4', '35');

INSERT INTO carboninfo (username, ecoscore, energy, shower, car_travel) VALUES ('2', '96', '38', '4', '35');


INSERT INTO profiles (username) VALUES ('fakeuser#3');

INSERT INTO location (username, zipcode) VALUES ('3', '90210');

INSERT INTO surveyinfo (username, ecoscore, energy, shower, car_travel) VALUES ('3', '99', '39', '7', '30');

INSERT INTO carboninfo (username, ecoscore, energy, shower, car_travel) VALUES ('3', '99', '39', '7', '30');