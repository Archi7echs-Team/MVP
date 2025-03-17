-- Creiamo il tipo ENUM per dataset_type
DO $$ BEGIN
CREATE TYPE dataset_level AS ENUM ('SMALL', 'MEDIUM', 'LARGE');
EXCEPTION
   WHEN duplicate_object THEN null;
END $$;

-- Creiamo la tabella usando ENUM invece di TEXT
CREATE TABLE IF NOT EXISTS coordinates (
                                           id SERIAL PRIMARY KEY,
                                           x_label TEXT NOT NULL,
                                           z_label TEXT NOT NULL,
                                           y_value DOUBLE PRECISION NOT NULL,
                                           dataset_type dataset_level NOT NULL
);

-- Inseriamo i dati con ENUM
INSERT INTO coordinates (x_label, z_label, y_value, dataset_type) VALUES
                                                                      ('Vicenza', 'Mele', 1.0, 'SMALL'),
                                                                      ('Vicenza', 'Pere', 3.0, 'SMALL'),
                                                                      ('Vicenza', 'Banane', 5.0, 'SMALL'),
                                                                      ('Padova', 'Mele', 2.0, 'SMALL'),
                                                                      ('Padova', 'Pere', 2.0, 'SMALL'),
                                                                      ('Padova', 'Banane', 6.0, 'SMALL'),
                                                                      ('Venezia', 'Mele', 3.0, 'SMALL'),
                                                                      ('Venezia', 'Pere', 1.0, 'SMALL'),
                                                                      ('Venezia', 'Banane', 7.0, 'SMALL'),

                                                                      ('Vicenza', 'Arance', 10.0, 'MEDIUM'),
                                                                      ('Vicenza', 'Uva', 13.0, 'MEDIUM'),
                                                                      ('Padova', 'Arance', 12.0, 'MEDIUM'),
                                                                      ('Padova', 'Uva', 12.0, 'MEDIUM'),
                                                                      ('Venezia', 'Arance', 13.0, 'MEDIUM'),
                                                                      ('Venezia', 'Uva', 11.0, 'MEDIUM'),

                                                                      ('Vicenza', 'Kiwi', 100.0, 'LARGE'),
                                                                      ('Padova', 'Kiwi', 120.0, 'LARGE'),
                                                                      ('Venezia', 'Kiwi', 130.0, 'LARGE'),
                                                                      ('Padova', 'Cocco', 126.0, 'LARGE'),
                                                                      ('Venezia', 'Cocco', 133.0, 'LARGE');
