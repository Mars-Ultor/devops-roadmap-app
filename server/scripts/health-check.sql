-- Health check query
SELECT
  'users_count' as metric,
  COUNT(*) as value
FROM "User"
UNION ALL
SELECT
  'certifications_count' as metric,
  COUNT(*) as value
FROM "Certification"
UNION ALL
SELECT
  'attempts_count' as metric,
  COUNT(*) as value
FROM "RecertificationAttempt";