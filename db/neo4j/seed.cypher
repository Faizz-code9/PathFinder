// ============================================================================
// PathFinder System — Neo4j Graph Seed Data (Mirrors PostgreSQL 16)
// ============================================================================

// 1. Clear Existing Graph Data
MATCH (n) DETACH DELETE n;

// 2. Create Companies
UNWIND [
  {companyId: 1, name: 'Google', industry: 'Cloud & AI Infrastructure'},
  {companyId: 2, name: 'OpenAI', industry: 'Cloud & AI Infrastructure'},
  {companyId: 3, name: 'Microsoft', industry: 'Cloud & AI Infrastructure'},
  {companyId: 4, name: 'Stripe', industry: 'Fintech & Digital Banking'},
  {companyId: 5, name: 'Meta', industry: 'Cloud & AI Infrastructure'},
  {companyId: 6, name: 'Snowflake', industry: 'Enterprise Software & SaaS'},
  {companyId: 7, name: 'Databricks', industry: 'Cloud & AI Infrastructure'},
  {companyId: 8, name: 'Apple', industry: 'E-Commerce & Consumer Tech'},
  {companyId: 9, name: 'Amazon Web Services', industry: 'Cloud & AI Infrastructure'},
  {companyId: 10, name: 'Netflix', industry: 'E-Commerce & Consumer Tech'},
  {companyId: 11, name: 'Spotify', industry: 'E-Commerce & Consumer Tech'},
  {companyId: 12, name: 'Goldman Sachs', industry: 'Fintech & Digital Banking'},
  {companyId: 13, name: 'McKinsey & Company', industry: 'Management Consulting & Strategy'},
  {companyId: 14, name: 'Genentech', industry: 'Healthcare & Biotechnology'},
  {companyId: 15, name: 'Uber', industry: 'E-Commerce & Consumer Tech'}
] AS row
MERGE (c:Company {companyId: row.companyId})
SET c.name = row.name, c.industry = row.industry;

// 3. Create Skills
UNWIND [
  {skillId: 1, name: 'PostgreSQL'},
  {skillId: 2, name: 'Neo4j & Cypher'},
  {skillId: 3, name: 'TypeScript'},
  {skillId: 4, name: 'Next.js & React'},
  {skillId: 5, name: 'Distributed Systems'},
  {skillId: 6, name: 'Machine Learning & LLMs'},
  {skillId: 7, name: 'Cloud Architecture (GCP/AWS)'},
  {skillId: 8, name: 'Database Optimization'},
  {skillId: 9, name: 'System Design'},
  {skillId: 10, name: 'Python & PyTorch'},
  {skillId: 11, name: 'Docker & Kubernetes'},
  {skillId: 12, name: 'GraphQL & REST APIs'},
  {skillId: 13, name: 'Financial Engineering'},
  {skillId: 14, name: 'Data Engineering & ETL'},
  {skillId: 15, name: 'Product Strategy'}
] AS row
MERGE (s:Skill {skillId: row.skillId})
SET s.name = row.name;

// 4. Create Person Nodes (50 Users)
UNWIND [
  {userId: 1, name: 'System Administrator', headline: 'PathFinder Operations & Security', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'},
  {userId: 2, name: 'Alice Chen', headline: 'Principal Distributed Systems Engineer at Google', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'},
  {userId: 3, name: 'Bob Martinez', headline: 'Research Scientist — Graph Intelligence at OpenAI', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'},
  {userId: 4, name: 'Carol Taylor', headline: 'Head of Payments Architecture at Stripe', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'},
  {userId: 5, name: 'David Kim', headline: 'Staff Data Architect at Databricks', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'},
  {userId: 6, name: 'Elena Rostova', headline: 'VP of Engineering at Snowflake', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'},
  {userId: 7, name: 'Frank Wright', headline: 'Director of Infrastructure at Meta', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'},
  {userId: 8, name: 'Grace Hopper', headline: 'Distinguished Architect at AWS', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'},
  {userId: 9, name: 'Hassan Ali', headline: 'Lead Recommendation Systems Architect at Netflix', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'},
  {userId: 10, name: 'Isabella Rossi', headline: 'Principal Audio DSP & ML Engineer at Spotify', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150'},
  {userId: 11, name: 'James Wilson', headline: 'Managing Director, Quant Strategies at Goldman Sachs', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'},
  {userId: 12, name: 'Kavita Patel', headline: 'VP of Mobility Platform at Uber', avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150'},
  {userId: 13, name: 'Liam O\'Connor', headline: 'Core OS Performance Architect at Apple', avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150'},
  {userId: 14, name: 'Maya Lin', headline: 'Computational Biology Lead at Genentech', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'},
  {userId: 15, name: 'Noah Schmidt', headline: 'Azure Cloud Core Lead at Microsoft', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'},
  {userId: 16, name: 'Olivia Brown', headline: 'Partner — Digital Enterprise at McKinsey', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'},
  {userId: 17, name: 'Priya Sharma', headline: 'Staff Database Reliability Engineer at Google', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'},
  {userId: 18, name: 'Quinn Murphy', headline: 'Frontier Alignment Engineer at OpenAI', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'},
  {userId: 19, name: 'Rachel Adams', headline: 'Staff Full-Stack Engineer at Stripe', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'},
  {userId: 20, name: 'Samuel Jackson', headline: 'Llama Open Source Lead at Meta', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'},
  {userId: 21, name: 'Tara Singh', headline: 'Data Streaming Specialist at Databricks', avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150'},
  {userId: 22, name: 'Umar Farooq', headline: 'Database Query Optimization Lead at Snowflake', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'},
  {userId: 23, name: 'Victor Hugo', headline: 'CDN & Edge Streaming Engineer at Netflix', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'},
  {userId: 24, name: 'Wendy Zhao', headline: 'Data Product Manager at Spotify', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150'},
  {userId: 25, name: 'Xavier Dupont', headline: 'Algorithmic Trading Lead at Goldman Sachs', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'},
  {userId: 26, name: 'Yasmin Khan', headline: 'Marketplace Dispatch Architect at Uber', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'},
  {userId: 27, name: 'Zachary Levin', headline: 'Apple Silicon Hardware Verification Engineer', avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150'},
  {userId: 28, name: 'Amara Okafor', headline: 'Cloud Security Architect at Google', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'},
  {userId: 29, name: 'Brandon Cole', headline: 'Inference Optimization Lead at OpenAI', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'},
  {userId: 30, name: 'Cynthia Morgan', headline: 'Risk & Fraud Graph ML Lead at Stripe', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'},
  {userId: 31, name: 'Dmitri Ivanov', headline: 'PyTorch Core Kernel Developer at Meta', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'},
  {userId: 32, name: 'Emily Watson', headline: 'Serverless Compute Architect at AWS', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'},
  {userId: 33, name: 'Felix Muller', headline: 'Delta Lake Core Maintainer at Databricks', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'},
  {userId: 34, name: 'Gina Torres', headline: 'Enterprise Security Officer at Snowflake', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'},
  {userId: 35, name: 'Haruto Tanaka', headline: 'Media Encoding Pipeline Lead at Netflix', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'},
  {userId: 36, name: 'Ines Gomez', headline: 'Growth Engineering Lead at Spotify', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150'},
  {userId: 37, name: 'Jordan Bell', headline: 'TypeScript Compiler Team at Microsoft', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'},
  {userId: 38, name: 'Karen Page', headline: 'Management Consultant at McKinsey', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'},
  {userId: 39, name: 'Lucas Silva', headline: 'Geospatial Engineering Lead at Uber', avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150'},
  {userId: 40, name: 'Monica Geller', headline: 'iOS Frameworks Architect at Apple', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'},
  {userId: 41, name: 'Nathan Drake', headline: 'Kubernetes Core Contributor at Google', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'},
  {userId: 42, name: 'Ophelia Frost', headline: 'Safety Systems Lead at OpenAI', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'},
  {userId: 43, name: 'Patrick Bateman', headline: 'Risk Modeling VP at Goldman Sachs', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'},
  {userId: 44, name: 'Quincy Jones', headline: 'Audio Streaming Infrastructure at Spotify', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'},
  {userId: 45, name: 'Rosa Diaz', headline: 'VR Rendering Pipeline Lead at Meta', avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150'},
  {userId: 46, name: 'Stefan Salvatore', headline: 'Billing Engine Lead at Stripe', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'},
  {userId: 47, name: 'Tracy McGrady', headline: 'Live Video Streaming Architect at Netflix', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'},
  {userId: 48, name: 'Ursula Corbero', headline: 'Data Sharing Lead at Snowflake', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150'},
  {userId: 49, name: 'Valerie Pierce', headline: 'Bioinformatics Lead at Genentech', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'},
  {userId: 50, name: 'William Riker', headline: 'Principal Solutions Architect at AWS', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
] AS row
MERGE (p:Person {userId: row.userId})
SET p.name = row.name, p.headline = row.headline, p.avatarUrl = row.avatarUrl;

// 5. Connect Person to Company (:WORKS_AT)
UNWIND [
  {userId: 2, companyId: 1, title: 'Principal Distributed Systems Engineer', isCurrent: true},
  {userId: 2, companyId: 4, title: 'Senior Backend Engineer', isCurrent: false},
  {userId: 3, companyId: 2, title: 'Research Scientist', isCurrent: true},
  {userId: 3, companyId: 1, title: 'AI Research Resident', isCurrent: false},
  {userId: 4, companyId: 4, title: 'Head of Payments Architecture', isCurrent: true},
  {userId: 5, companyId: 7, title: 'Staff Data Architect', isCurrent: true},
  {userId: 6, companyId: 6, title: 'VP of Engineering', isCurrent: true},
  {userId: 7, companyId: 5, title: 'Director of Infrastructure', isCurrent: true},
  {userId: 8, companyId: 9, title: 'Distinguished Architect', isCurrent: true},
  {userId: 9, companyId: 10, title: 'Lead Recommendation Architect', isCurrent: true},
  {userId: 10, companyId: 11, title: 'Principal Audio DSP Engineer', isCurrent: true},
  {userId: 11, companyId: 12, title: 'Managing Director', isCurrent: true},
  {userId: 12, companyId: 15, title: 'VP of Mobility Platform', isCurrent: true},
  {userId: 13, companyId: 8, title: 'Core OS Architect', isCurrent: true},
  {userId: 14, companyId: 14, title: 'Computational Biology Lead', isCurrent: true},
  {userId: 15, companyId: 3, title: 'Azure Cloud Core Lead', isCurrent: true},
  {userId: 16, companyId: 13, title: 'Partner', isCurrent: true},
  {userId: 17, companyId: 1, title: 'Staff Database Reliability Engineer', isCurrent: true},
  {userId: 18, companyId: 2, title: 'Frontier Alignment Engineer', isCurrent: true},
  {userId: 19, companyId: 4, title: 'Staff Full-Stack Engineer', isCurrent: true},
  {userId: 20, companyId: 5, title: 'Llama Open Source Lead', isCurrent: true}
] AS row
MATCH (p:Person {userId: row.userId})
MATCH (c:Company {companyId: row.companyId})
MERGE (p)-[r:WORKS_AT {title: row.title}]->(c)
SET r.isCurrent = row.isCurrent;

// 6. Connect Person to Skill (:HAS_SKILL)
UNWIND [
  {userId: 2, skillId: 1}, {userId: 2, skillId: 5}, {userId: 2, skillId: 7}, {userId: 2, skillId: 8}, {userId: 2, skillId: 9},
  {userId: 3, skillId: 2}, {userId: 3, skillId: 6}, {userId: 3, skillId: 10}, {userId: 3, skillId: 5},
  {userId: 4, skillId: 1}, {userId: 4, skillId: 3}, {userId: 4, skillId: 4}, {userId: 4, skillId: 13},
  {userId: 5, skillId: 1}, {userId: 5, skillId: 8}, {userId: 5, skillId: 14}, {userId: 5, skillId: 5},
  {userId: 6, skillId: 1}, {userId: 6, skillId: 7}, {userId: 6, skillId: 8}, {userId: 6, skillId: 5},
  {userId: 7, skillId: 5}, {userId: 7, skillId: 7}, {userId: 7, skillId: 11},
  {userId: 8, skillId: 5}, {userId: 8, skillId: 7}, {userId: 8, skillId: 9},
  {userId: 9, skillId: 2}, {userId: 9, skillId: 6}, {userId: 9, skillId: 10},
  {userId: 10, skillId: 6}, {userId: 10, skillId: 10},
  {userId: 11, skillId: 13}, {userId: 11, skillId: 10},
  {userId: 12, skillId: 5}, {userId: 12, skillId: 9}, {userId: 12, skillId: 7},
  {userId: 13, skillId: 5}, {userId: 13, skillId: 9},
  {userId: 14, skillId: 6}, {userId: 14, skillId: 10},
  {userId: 15, skillId: 7}, {userId: 15, skillId: 11},
  {userId: 16, skillId: 15}, {userId: 16, skillId: 13},
  {userId: 17, skillId: 1}, {userId: 17, skillId: 8},
  {userId: 18, skillId: 6}, {userId: 18, skillId: 10},
  {userId: 19, skillId: 3}, {userId: 19, skillId: 4},
  {userId: 20, skillId: 6}, {userId: 20, skillId: 10}
] AS row
MATCH (p:Person {userId: row.userId})
MATCH (s:Skill {skillId: row.skillId})
MERGE (p)-[:HAS_SKILL]->(s);

// 7. Create Connections Graph (:KNOWS) - Bidirectional
UNWIND [
  {u1: 2, u2: 3, relType: 'colleague', strength: 0.95},
  {u1: 2, u2: 6, relType: 'colleague', strength: 0.85},
  {u1: 2, u2: 17, relType: 'mentor', strength: 0.90},
  {u1: 2, u2: 28, relType: 'colleague', strength: 0.80},
  {u1: 2, u2: 7, relType: 'classmate', strength: 0.75},
  {u1: 3, u2: 4, relType: 'mentor', strength: 0.88},
  {u1: 3, u2: 18, relType: 'colleague', strength: 0.92},
  {u1: 3, u2: 20, relType: 'friend', strength: 0.70},
  {u1: 3, u2: 29, relType: 'colleague', strength: 0.85},
  {u1: 4, u2: 5, relType: 'colleague', strength: 0.90},
  {u1: 4, u2: 19, relType: 'mentor', strength: 0.86},
  {u1: 4, u2: 30, relType: 'colleague', strength: 0.82},
  {u1: 4, u2: 46, relType: 'colleague', strength: 0.80},
  {u1: 5, u2: 12, relType: 'friend', strength: 0.75},
  {u1: 5, u2: 21, relType: 'colleague', strength: 0.88},
  {u1: 5, u2: 33, relType: 'colleague', strength: 0.84},
  {u1: 6, u2: 22, relType: 'mentor', strength: 0.87},
  {u1: 6, u2: 34, relType: 'colleague', strength: 0.80},
  {u1: 6, u2: 48, relType: 'colleague', strength: 0.82},
  {u1: 7, u2: 8, relType: 'colleague', strength: 0.85},
  {u1: 7, u2: 20, relType: 'mentor', strength: 0.89},
  {u1: 7, u2: 31, relType: 'colleague', strength: 0.83},
  {u1: 8, u2: 15, relType: 'mentor', strength: 0.92},
  {u1: 8, u2: 32, relType: 'colleague', strength: 0.86},
  {u1: 8, u2: 50, relType: 'colleague', strength: 0.84},
  {u1: 9, u2: 10, relType: 'colleague', strength: 0.80},
  {u1: 9, u2: 23, relType: 'colleague', strength: 0.88},
  {u1: 9, u2: 35, relType: 'colleague', strength: 0.82},
  {u1: 9, u2: 47, relType: 'colleague', strength: 0.85},
  {u1: 10, u2: 24, relType: 'colleague', strength: 0.84},
  {u1: 10, u2: 36, relType: 'colleague', strength: 0.81},
  {u1: 10, u2: 44, relType: 'colleague', strength: 0.86},
  {u1: 11, u2: 16, relType: 'colleague', strength: 0.85},
  {u1: 11, u2: 25, relType: 'colleague', strength: 0.89},
  {u1: 11, u2: 43, relType: 'mentor', strength: 0.90},
  {u1: 12, u2: 16, relType: 'friend', strength: 0.78},
  {u1: 12, u2: 26, relType: 'colleague', strength: 0.87},
  {u1: 12, u2: 39, relType: 'mentor', strength: 0.89},
  {u1: 13, u2: 27, relType: 'colleague', strength: 0.85},
  {u1: 13, u2: 40, relType: 'colleague', strength: 0.82},
  {u1: 14, u2: 49, relType: 'colleague', strength: 0.91},
  {u1: 15, u2: 37, relType: 'mentor', strength: 0.87},
  {u1: 16, u2: 38, relType: 'colleague', strength: 0.80},
  {u1: 17, u2: 41, relType: 'colleague', strength: 0.84},
  {u1: 18, u2: 42, relType: 'colleague', strength: 0.86}
] AS row
MATCH (p1:Person {userId: row.u1})
MATCH (p2:Person {userId: row.u2})
MERGE (p1)-[r1:KNOWS {relType: row.relType}]->(p2)
SET r1.strength = row.strength
MERGE (p2)-[r2:KNOWS {relType: row.relType}]->(p1)
SET r2.strength = row.strength;
