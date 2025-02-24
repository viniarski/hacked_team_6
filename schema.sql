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
    plant_id INT REFERENCES plants(id),
    user_id INT REFERENCES users(clerk_id)
);

CREATE TABLE pi_plants (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tag VARCHAR(25),
    space_id INT REFERENCES spaces(id),
    watered TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
