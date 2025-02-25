CREATE TABLE pi_data (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    temperature REAL,
    pressure REAL,
    humidity REAL,
    collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    brightness INT
);

CREATE TABLE pi_users (
    clerk_id TEXT PRIMARY KEY
);

CREATE TABLE pi_spaces (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tag VARCHAR(25),
    plant_id INT,
    user_id TEXT REFERENCES pi_users(clerk_id),
    color TEXT,
    icon TEXT
);

ALTER TABLE pi_spaces
ADD CONSTRAINT fk_plant
FOREIGN KEY (plant_id)
REFERENCES pi_plants(id);

CREATE TABLE pi_plants (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tag VARCHAR(25),
    space_id INT REFERENCES pi_spaces(id),
    watered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    temperature FLOAT,
    brightness INT,
    image_url TEXT,
    name TEXT
);

