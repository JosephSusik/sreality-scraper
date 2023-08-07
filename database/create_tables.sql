-- Creation of product table
CREATE TABLE IF NOT EXISTS inzerat (
  inzerat_id INT NOT NULL,
  title varchar(250) NOT NULL,
  location varchar(250) NOT NULL,
  price varchar(250) NOT NULL,
  img_arr text[],
  PRIMARY KEY (inzerat_id)
);