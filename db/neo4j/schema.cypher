// ============================================================================
// PathFinder System — Neo4j Graph Schema, Constraints & Indexes
// ============================================================================

// 1. Uniqueness Constraints (Primary Surrogate Keys mapping to PostgreSQL)
CREATE CONSTRAINT constraint_person_userid IF NOT EXISTS
FOR (p:Person) REQUIRE p.userId IS UNIQUE;

CREATE CONSTRAINT constraint_company_id IF NOT EXISTS
FOR (c:Company) REQUIRE c.companyId IS UNIQUE;

CREATE CONSTRAINT constraint_skill_id IF NOT EXISTS
FOR (s:Skill) REQUIRE s.skillId IS UNIQUE;

// 2. Lookup Indexes for Fast Property Matching
CREATE INDEX index_person_name IF NOT EXISTS
FOR (p:Person) ON (p.name);

CREATE INDEX index_company_name IF NOT EXISTS
FOR (c:Company) ON (c.name);

CREATE INDEX index_skill_name IF NOT EXISTS
FOR (s:Skill) ON (s.name);
