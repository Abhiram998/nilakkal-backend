CREATE TABLE zones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  zone_name VARCHAR(50),
  capacity INT NOT NULL
);

CREATE TABLE occupancy (
  id INT AUTO_INCREMENT PRIMARY KEY,
  zone_id INT,
  occupied INT DEFAULT 0,
  FOREIGN KEY (zone_id) REFERENCES zones(id)
);
