-- Fix existing article slugs to ensure they work properly
UPDATE articles 
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    ),
    '^-+|-+$', '', 'g'
  )
)
WHERE slug IS NULL OR slug = '' OR slug NOT SIMILAR TO '[a-z0-9-]+';

-- Ensure all articles have unique slugs
WITH numbered_articles AS (
  SELECT 
    id, 
    title,
    slug,
    ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at) as rn
  FROM articles
  WHERE slug IS NOT NULL
)
UPDATE articles 
SET slug = CONCAT(articles.slug, '-', numbered_articles.rn)
FROM numbered_articles
WHERE articles.id = numbered_articles.id 
  AND numbered_articles.rn > 1;
