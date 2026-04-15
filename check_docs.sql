SELECT *
FROM shooter_documents;
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'shooters'
    AND column_name LIKE '%url%'
    OR (
        table_name = 'shooters'
        AND column_name LIKE '%photo%'
    )
    OR (
        table_name = 'shooters'
        AND column_name LIKE '%signature%'
    )
    OR (
        table_name = 'shooters'
        AND column_name LIKE '%doc%'
    );