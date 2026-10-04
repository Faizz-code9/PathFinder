-- ============================================================================
-- PathFinder System — Relational Schema (PostgreSQL 16)
-- 3NF Normalized Relational Core Architecture
-- ============================================================================

-- 1. Users & Authentication
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active     BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Profiles (1:1 with users)
CREATE TABLE IF NOT EXISTS profiles (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name    VARCHAR(255) NOT NULL,
    headline     VARCHAR(500),
    bio          TEXT,
    location     VARCHAR(255),
    avatar_url   VARCHAR(500),
    linkedin_url VARCHAR(500)
);

-- 3. Industries
CREATE TABLE IF NOT EXISTS industries (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- 4. Companies
CREATE TABLE IF NOT EXISTS companies (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    industry_id INTEGER REFERENCES industries(id) ON DELETE SET NULL,
    size        VARCHAR(50),
    location    VARCHAR(255),
    website     VARCHAR(255)
);

-- 5. User Career Experiences (1:N with users & companies)
CREATE TABLE IF NOT EXISTS experiences (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title      VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date   DATE,
    is_current BOOLEAN DEFAULT FALSE
);

-- 6. Skills Catalog
CREATE TABLE IF NOT EXISTS skills (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- 7. User Skills Junction Table (M:N with composite PK)
CREATE TABLE IF NOT EXISTS user_skills (
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id    INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency VARCHAR(20) DEFAULT 'intermediate' CHECK (proficiency IN ('beginner', 'intermediate', 'expert')),
    PRIMARY KEY (user_id, skill_id)
);

-- 8. Connection Requests & Network Links (Self-referential M:N)
CREATE TABLE IF NOT EXISTS connection_requests (
    id          SERIAL PRIMARY KEY,
    sender_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rel_type    VARCHAR(50) DEFAULT 'colleague' CHECK (rel_type IN ('colleague', 'classmate', 'friend', 'mentor', 'other')),
    status      VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    message     TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_sender_receiver UNIQUE (sender_id, receiver_id),
    CONSTRAINT chk_different_users CHECK (sender_id <> receiver_id)
);

-- 9. Immutable Activity & Audit Log
CREATE TABLE IF NOT EXISTS activity_log (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action     VARCHAR(100) NOT NULL,
    target_id  INTEGER,
    metadata   JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
