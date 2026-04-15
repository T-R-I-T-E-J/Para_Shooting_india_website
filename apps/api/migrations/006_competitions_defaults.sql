-- Add default values to NOT NULL columns that TypeORM entity does not populate yet

ALTER TABLE competitions 
ALTER COLUMN competition_type SET DEFAULT 'CHAMPIONSHIP',
ALTER COLUMN level SET DEFAULT 'NATIONAL';
