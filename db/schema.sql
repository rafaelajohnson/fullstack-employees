DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
  id        SERIAL PRIMARY KEY,
  name      TEXT NOT NULL CHECK (char_length(name) > 0),
  birthday  DATE NOT NULL,
  salary    INTEGER NOT NULL CHECK (salary >= 0)
);
