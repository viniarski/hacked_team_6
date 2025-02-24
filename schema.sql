CREATE TABLE pi_data (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    temperature REAL,
    pressure REAL,
    humidity REAL,
    collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    brightness INT
);

CREATE TABLE hacked_user (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    spaces JSONB, 
    plants JSONB,
);
