-- ============================================================================
-- PathFinder System — Analytical & Application SQL Views
-- ============================================================================

-- 1. High-Level Network Analytics View (Admin Dashboard)
CREATE OR REPLACE VIEW v_network_analytics AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE is_active = TRUE) AS active_users,
    (SELECT COUNT(*) FROM connection_requests WHERE status = 'accepted') AS total_accepted_connections,
    (SELECT COUNT(*) FROM connection_requests WHERE status = 'pending') AS total_pending_requests,
    (SELECT COUNT(*) FROM companies) AS total_companies,
    (SELECT COUNT(*) FROM skills) AS total_skills,
    ROUND(
        COALESCE(
            (SELECT AVG(conn_count) FROM (
                SELECT COUNT(*) AS conn_count 
                FROM connection_requests 
                WHERE status = 'accepted' 
                GROUP BY sender_id
            ) sub), 
            0
        )::NUMERIC, 
        2
    ) AS avg_connections_per_user;

-- 2. User Connections Detail View (Bidirectional mapping)
CREATE OR REPLACE VIEW v_user_connections AS
SELECT 
    cr.id AS connection_id,
    cr.sender_id AS user_id,
    cr.receiver_id AS partner_id,
    p.full_name AS partner_name,
    p.headline AS partner_headline,
    p.location AS partner_location,
    p.avatar_url AS partner_avatar,
    cr.rel_type,
    cr.status,
    'outgoing' AS direction,
    cr.created_at,
    cr.updated_at
FROM connection_requests cr
JOIN profiles p ON cr.receiver_id = p.user_id
UNION ALL
SELECT 
    cr.id AS connection_id,
    cr.receiver_id AS user_id,
    cr.sender_id AS partner_id,
    p.full_name AS partner_name,
    p.headline AS partner_headline,
    p.location AS partner_location,
    p.avatar_url AS partner_avatar,
    cr.rel_type,
    cr.status,
    'incoming' AS direction,
    cr.created_at,
    cr.updated_at
FROM connection_requests cr
JOIN profiles p ON cr.sender_id = p.user_id;

-- 3. Industry Demographics View
CREATE OR REPLACE VIEW v_industry_distribution AS
SELECT 
    i.id AS industry_id,
    i.name AS industry_name,
    COUNT(DISTINCT c.id) AS company_count,
    COUNT(DISTINCT e.user_id) AS professional_count
FROM industries i
LEFT JOIN companies c ON i.id = c.industry_id
LEFT JOIN experiences e ON c.id = e.company_id
GROUP BY i.id, i.name
ORDER BY professional_count DESC;
