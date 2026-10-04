-- ============================================================================
-- PathFinder System — Stored Procedures & Scoring Functions (PL/pgSQL)
-- ============================================================================

-- 1. Compute Relational Connection Strength between Two Users
CREATE OR REPLACE FUNCTION calculate_connection_strength(u1 INT, u2 INT)
RETURNS FLOAT AS $$
DECLARE
    shared_companies INT := 0;
    shared_skills INT := 0;
    score FLOAT := 0.2; -- Baseline connection weight
BEGIN
    IF u1 = u2 THEN
        RETURN 1.0;
    END IF;

    -- Count shared companies from career history
    SELECT COUNT(DISTINCT e1.company_id) INTO shared_companies
    FROM experiences e1
    JOIN experiences e2 ON e1.company_id = e2.company_id
    WHERE e1.user_id = u1 AND e2.user_id = u2;

    -- Count shared skills
    SELECT COUNT(DISTINCT s1.skill_id) INTO shared_skills
    FROM user_skills s1
    JOIN user_skills s2 ON s1.skill_id = s2.skill_id
    WHERE s1.user_id = u1 AND s2.user_id = u2;

    -- Weighted scoring formula
    score := score + (shared_companies * 0.35) + (shared_skills * 0.15);

    -- Cap maximum score at 1.0
    RETURN ROUND(LEAST(score, 1.0)::NUMERIC, 2)::FLOAT;
END;
$$ LANGUAGE plpgsql;

-- 2. Generate Contextual Hop Annotation (Explainable Warm Path)
CREATE OR REPLACE FUNCTION get_hop_context(u1 INT, u2 INT)
RETURNS TEXT AS $$
DECLARE
    company_name VARCHAR(255);
    skill_names TEXT;
    rel_type VARCHAR(50);
    context_text TEXT := '';
BEGIN
    -- Check relationship type from connection request
    SELECT cr.rel_type INTO rel_type
    FROM connection_requests cr
    WHERE (cr.sender_id = u1 AND cr.receiver_id = u2)
       OR (cr.sender_id = u2 AND cr.receiver_id = u1)
    AND cr.status = 'accepted'
    LIMIT 1;

    -- Check for common employer
    SELECT c.name INTO company_name
    FROM experiences e1
    JOIN experiences e2 ON e1.company_id = e2.company_id
    JOIN companies c ON e1.company_id = c.id
    WHERE e1.user_id = u1 AND e2.user_id = u2
    LIMIT 1;

    -- Check for common skills
    SELECT STRING_AGG(s.name, ', ') INTO skill_names
    FROM user_skills us1
    JOIN user_skills us2 ON us1.skill_id = us2.skill_id
    JOIN skills s ON us1.skill_id = s.id
    WHERE us1.user_id = u1 AND us2.user_id = u2;

    IF rel_type IS NOT NULL THEN
        context_text := INITCAP(rel_type);
    ELSE
        context_text := 'Professional Peer';
    END IF;

    IF company_name IS NOT NULL THEN
        context_text := context_text || ' at ' || company_name;
    END IF;

    IF skill_names IS NOT NULL THEN
        context_text := context_text || ' • Shared Skills: ' || skill_names;
    END IF;

    RETURN context_text;
END;
$$ LANGUAGE plpgsql;
