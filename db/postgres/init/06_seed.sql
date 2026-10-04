-- ============================================================================
-- PathFinder System — Seed Dataset (50+ Users & Professional Network Graph)
-- Password for all seed users: password123
-- Hash: $2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe
-- ============================================================================

-- 1. Industries
INSERT INTO industries (id, name) VALUES
(1, 'Cloud & AI Infrastructure'),
(2, 'Enterprise Software & SaaS'),
(3, 'Fintech & Digital Banking'),
(4, 'Healthcare & Biotechnology'),
(5, 'E-Commerce & Consumer Tech'),
(6, 'Management Consulting & Strategy')
ON CONFLICT (id) DO NOTHING;

SELECT setval('industries_id_seq', (SELECT MAX(id) FROM industries));

-- 2. Companies
INSERT INTO companies (id, name, industry_id, size, location, website) VALUES
(1, 'Google', 1, '10,000+ employees', 'Mountain View, CA', 'https://google.com'),
(2, 'OpenAI', 1, '500-1000 employees', 'San Francisco, CA', 'https://openai.com'),
(3, 'Microsoft', 1, '10,000+ employees', 'Redmond, WA', 'https://microsoft.com'),
(4, 'Stripe', 3, '5,000-10,000 employees', 'San Francisco, CA', 'https://stripe.com'),
(5, 'Meta', 1, '10,000+ employees', 'Menlo Park, CA', 'https://meta.com'),
(6, 'Snowflake', 2, '5,000-10,000 employees', 'Bozeman, MT', 'https://snowflake.com'),
(7, 'Databricks', 1, '5,000-10,000 employees', 'San Francisco, CA', 'https://databricks.com'),
(8, 'Apple', 5, '10,000+ employees', 'Cupertino, CA', 'https://apple.com'),
(9, 'Amazon Web Services', 1, '10,000+ employees', 'Seattle, WA', 'https://aws.amazon.com'),
(10, 'Netflix', 5, '5,000-10,000 employees', 'Los Gatos, CA', 'https://netflix.com'),
(11, 'Spotify', 5, '5,000-10,000 employees', 'Stockholm, Sweden', 'https://spotify.com'),
(12, 'Goldman Sachs', 3, '10,000+ employees', 'New York, NY', 'https://goldmansachs.com'),
(13, 'McKinsey & Company', 6, '10,000+ employees', 'New York, NY', 'https://mckinsey.com'),
(14, 'Genentech', 4, '10,000+ employees', 'South San Francisco, CA', 'https://gene.com'),
(15, 'Uber', 5, '10,000+ employees', 'San Francisco, CA', 'https://uber.com')
ON CONFLICT (id) DO NOTHING;

SELECT setval('companies_id_seq', (SELECT MAX(id) FROM companies));

-- 3. Skills Catalog
INSERT INTO skills (id, name) VALUES
(1, 'PostgreSQL'),
(2, 'Neo4j & Cypher'),
(3, 'TypeScript'),
(4, 'Next.js & React'),
(5, 'Distributed Systems'),
(6, 'Machine Learning & LLMs'),
(7, 'Cloud Architecture (GCP/AWS)'),
(8, 'Database Optimization'),
(9, 'System Design'),
(10, 'Python & PyTorch'),
(11, 'Docker & Kubernetes'),
(12, 'GraphQL & REST APIs'),
(13, 'Financial Engineering'),
(14, 'Data Engineering & ETL'),
(15, 'Product Strategy')
ON CONFLICT (id) DO NOTHING;

SELECT setval('skills_id_seq', (SELECT MAX(id) FROM skills));

-- 4. Users (50 Users with hashed password 'password123')
INSERT INTO users (id, email, password_hash, role, is_active) VALUES
(1, 'admin@pathfinder.io', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'admin', TRUE),
(2, 'alice.chen@google.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(3, 'bob.martinez@openai.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(4, 'carol.taylor@stripe.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(5, 'david.kim@databricks.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(6, 'elena.rostova@snowflake.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(7, 'frank.wright@meta.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(8, 'grace.hopper@aws.amazon.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(9, 'hassan.ali@netflix.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(10, 'isabella.rossi@spotify.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(11, 'james.wilson@goldmansachs.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(12, 'kavita.patel@uber.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(13, 'liam.o_connor@apple.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(14, 'maya.lin@genentech.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(15, 'noah.schmidt@microsoft.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(16, 'olivia.brown@mckinsey.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(17, 'priya.sharma@google.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(18, 'quinn.murphy@openai.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(19, 'rachel.adams@stripe.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(20, 'samuel.jackson@meta.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(21, 'tara.singh@databricks.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(22, 'umar.farooq@snowflake.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(23, 'victor.hugo@netflix.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(24, 'wendy.zhao@spotify.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(25, 'xavier.dupont@goldmansachs.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(26, 'yasmin.khan@uber.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(27, 'zachary.levin@apple.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(28, 'amara.okafor@google.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(29, 'brandon.cole@openai.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(30, 'cynthia.morgan@stripe.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(31, 'dmitri.ivanov@meta.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(32, 'emily.watson@aws.amazon.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(33, 'felix.muller@databricks.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(34, 'gina.torres@snowflake.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(35, 'haruto.tanaka@netflix.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(36, 'ines.gomez@spotify.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(37, 'jordan.bell@microsoft.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(38, 'karen.page@mckinsey.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(39, 'lucas.silva@uber.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(40, 'monica.geller@apple.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(41, 'nathan.drake@google.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(42, 'ophelia.frost@openai.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(43, 'patrick.bateman@goldmansachs.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(44, 'quincy.jones@spotify.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(45, 'rosa.diaz@meta.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(46, 'stefan.salvatore@stripe.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(47, 'tracy.mcgrady@netflix.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(48, 'ursula.corbero@snowflake.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(49, 'valerie.pierce@genentech.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE),
(50, 'william.riker@aws.amazon.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ekEY5oHG07PU6nFpe', 'user', TRUE)
ON CONFLICT (id) DO NOTHING;

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 5. Profiles (50 Profiles)
INSERT INTO profiles (id, user_id, full_name, headline, bio, location, avatar_url, linkedin_url) VALUES
(1, 1, 'System Administrator', 'PathFinder Platform Operations & Security', 'Overseeing dual-database replication, system health, and role-based policies.', 'San Francisco, CA', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'https://linkedin.com'),
(2, 2, 'Alice Chen', 'Principal Distributed Systems Engineer at Google', 'Building planet-scale distributed consensus engines and high-throughput query kernels.', 'Mountain View, CA', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'https://linkedin.com'),
(3, 3, 'Bob Martinez', 'Research Scientist — Graph Intelligence & LLMs at OpenAI', 'Exploring neuro-symbolic reasoning, knowledge graphs, and multi-hop inference.', 'San Francisco, CA', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'https://linkedin.com'),
(4, 4, 'Carol Taylor', 'Head of Payments Architecture at Stripe', 'Leading real-time ledger settlement and multi-region database replication.', 'San Francisco, CA', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'https://linkedin.com'),
(5, 5, 'David Kim', 'Staff Data Architect at Databricks', 'Optimizing Lakehouse storage engines, delta tables, and query execution planning.', 'Seattle, WA', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'https://linkedin.com'),
(6, 6, 'Elena Rostova', 'VP of Engineering at Snowflake', 'Architecting cloud data warehousing and serverless elastic compute clusters.', 'San Jose, CA', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'https://linkedin.com'),
(7, 7, 'Frank Wright', 'Director of Infrastructure at Meta', 'Managing global datacenter fabric, custom silicon accelerators, and network graphs.', 'Menlo Park, CA', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'https://linkedin.com'),
(8, 8, 'Grace Hopper', 'Distinguished Architect at AWS', 'Compiler designer, distributed cloud pioneer, and asynchronous event mesh designer.', 'Seattle, WA', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 'https://linkedin.com'),
(9, 9, 'Hassan Ali', 'Lead Recommendation Systems Architect at Netflix', 'Building real-time graph embeddings and contextual bandit recommendation engines.', 'Los Gatos, CA', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'https://linkedin.com'),
(10, 10, 'Isabella Rossi', 'Principal Audio DSP & ML Engineer at Spotify', 'Developing real-time acoustic neural networks and personalized music graph clusters.', 'Stockholm, Sweden', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', 'https://linkedin.com'),
(11, 11, 'James Wilson', 'Managing Director, Quantitative Strategies at Goldman Sachs', 'High-frequency algorithmic market-making and low-latency financial graph analysis.', 'New York, NY', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 'https://linkedin.com'),
(12, 12, 'Kavita Patel', 'VP of Mobility Platform at Uber', 'Dynamic spatial indexing, routing algorithms, and multi-agent dispatch systems.', 'San Francisco, CA', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150', 'https://linkedin.com'),
(13, 13, 'Liam O''Connor', 'Core OS Performance Architect at Apple', 'Microkernel optimization, unified memory synchronization, and Swift runtime.', 'Cupertino, CA', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', 'https://linkedin.com'),
(14, 14, 'Maya Lin', 'Computational Biology Lead at Genentech', 'Molecular dynamics simulations, protein folding graph models, and genomic search.', 'South San Francisco, CA', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'https://linkedin.com'),
(15, 15, 'Noah Schmidt', 'Azure Cloud Core Lead at Microsoft', 'Virtualization hypervisors, distributed consensus, and confidential computing.', 'Redmond, WA', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', 'https://linkedin.com'),
(16, 16, 'Olivia Brown', 'Partner — Digital Enterprise Transformation at McKinsey', 'Advising Fortune 50 executives on AI modernization and database migrations.', 'New York, NY', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'https://linkedin.com'),
(17, 17, 'Priya Sharma', 'Staff Database Reliability Engineer at Google', 'Managing 100k+ node Spanner and PostgreSQL fleets with zero-downtime failover.', 'Sunnyvale, CA', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'https://linkedin.com'),
(18, 18, 'Quinn Murphy', 'Frontier Alignment Engineer at OpenAI', 'Reinforcement learning from human feedback and mechanistic interpretability.', 'San Francisco, CA', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'https://linkedin.com'),
(19, 19, 'Rachel Adams', 'Staff Full-Stack Engineer at Stripe', 'Crafting developer-first checkout primitives with Next.js, React, and TypeScript.', 'Austin, TX', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'https://linkedin.com'),
(20, 20, 'Samuel Jackson', 'Llama Open Source Lead at Meta', 'Optimizing tensor parallelism, FlashAttention kernels, and open weights distribution.', 'Menlo Park, CA', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'https://linkedin.com'),
(21, 21, 'Tara Singh', 'Data Streaming Specialist at Databricks', 'Real-time structured streaming, Kafka pipelines, and graph analytics.', 'San Francisco, CA', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150', 'https://linkedin.com'),
(22, 22, 'Umar Farooq', 'Database Query Optimization Lead at Snowflake', 'Cost-based query planners, vectorized execution, and metadata pruning.', 'Bellevue, WA', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'https://linkedin.com'),
(23, 23, 'Victor Hugo', 'CDN & Edge Streaming Engineer at Netflix', 'Global video distribution mesh, BPF networking, and edge cache warming.', 'Los Gatos, CA', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'https://linkedin.com'),
(24, 24, 'Wendy Zhao', 'Data Product Manager at Spotify', 'Building the music knowledge graph connecting 100M songs and artist nodes.', 'New York, NY', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', 'https://linkedin.com'),
(25, 25, 'Xavier Dupont', 'Algorithmic Trading Lead at Goldman Sachs', 'Ultra low latency order books and stochastic volatility graph models.', 'London, UK', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 'https://linkedin.com'),
(26, 26, 'Yasmin Khan', 'Marketplace Dispatch Architect at Uber', 'Dynamic surge pricing graph models, geospatial clustering, and driver dispatch.', 'San Francisco, CA', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'https://linkedin.com'),
(27, 27, 'Zachary Levin', 'Apple Silicon Hardware Verification Engineer', 'Formal verification of neural engine pipelines and high-speed memory interconnects.', 'San Diego, CA', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', 'https://linkedin.com'),
(28, 28, 'Amara Okafor', 'Cloud Security Architect at Google', 'Zero-trust workload identity, confidential VMs, and cryptographic key meshes.', 'Sunnyvale, CA', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'https://linkedin.com'),
(29, 29, 'Brandon Cole', 'Inference Optimization Lead at OpenAI', 'Quantization kernels, speculative decoding, and distributed KV-cache serving.', 'San Francisco, CA', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'https://linkedin.com'),
(30, 30, 'Cynthia Morgan', 'Risk & Fraud Graph ML Lead at Stripe', 'Graph neural networks for money laundering detection and synthetic ID prevention.', 'Seattle, WA', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'https://linkedin.com'),
(31, 31, 'Dmitri Ivanov', 'PyTorch Core Kernel Developer at Meta', 'Writing high-performance CUDA/Triton kernels for tensor contractions.', 'Menlo Park, CA', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'https://linkedin.com'),
(32, 32, 'Emily Watson', 'Serverless Compute Architect at AWS', 'Lambda microVM isolation with Firecracker and ultra-fast cold start mitigation.', 'Austin, TX', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 'https://linkedin.com'),
(33, 33, 'Felix Muller', 'Delta Lake Core Maintainer at Databricks', 'ACID transaction protocols on object storage and time-travel querying.', 'Munich, Germany', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'https://linkedin.com'),
(34, 34, 'Gina Torres', 'Enterprise Security Officer at Snowflake', 'Data governance, column-level masking, and end-to-end homomorphic encryption.', 'Denver, CO', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'https://linkedin.com'),
(35, 35, 'Haruto Tanaka', 'Media Encoding Pipeline Lead at Netflix', 'AV1 codec hardware encoding and per-title video complexity optimization.', 'Tokyo, Japan', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'https://linkedin.com'),
(36, 36, 'Ines Gomez', 'Growth Engineering Lead at Spotify', 'A/B testing experimentation platforms, multi-armed bandits, and user graphs.', 'Barcelona, Spain', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', 'https://linkedin.com'),
(37, 37, 'Jordan Bell', 'TypeScript Compiler Team at Microsoft', 'Language server protocol, type-checker performance, and AST transformations.', 'Seattle, WA', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', 'https://linkedin.com'),
(38, 38, 'Karen Page', 'Management Consultant at McKinsey', 'Digital banking strategies and enterprise technology stack modernization.', 'Chicago, IL', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'https://linkedin.com'),
(39, 39, 'Lucas Silva', 'Geospatial Engineering Lead at Uber', 'H3 hexagonal hierarchical spatial indexing and real-time transit graphs.', 'Sao Paulo, Brazil', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', 'https://linkedin.com'),
(40, 40, 'Monica Geller', 'iOS Frameworks Architect at Apple', 'SwiftUI rendering engine, CoreData synchronization, and memory safety.', 'San Jose, CA', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'https://linkedin.com'),
(41, 41, 'Nathan Drake', 'Kubernetes Core Contributor at Google', 'Container runtime interfaces, kube-scheduler optimization, and eBPF tracing.', 'Mountain View, CA', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 'https://linkedin.com'),
(42, 42, 'Ophelia Frost', 'Safety Systems Lead at OpenAI', 'Guardrail evaluation harnesses and toxic output classification models.', 'San Francisco, CA', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'https://linkedin.com'),
(43, 43, 'Patrick Bateman', 'Risk Modeling VP at Goldman Sachs', 'Credit default swap pricing matrices and Monte Carlo simulations.', 'New York, NY', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'https://linkedin.com'),
(44, 44, 'Quincy Jones', 'Audio Streaming Infrastructure at Spotify', 'Low latency WebRTC streaming and multi-master Cassandra clusters.', 'Los Angeles, CA', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'https://linkedin.com'),
(45, 45, 'Rosa Diaz', 'VR Rendering Pipeline Lead at Meta', 'Foveated rendering, spatial audio shaders, and Quest runtime engines.', 'Redmond, WA', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150', 'https://linkedin.com'),
(46, 46, 'Stefan Salvatore', 'Billing & Invoicing Engine Lead at Stripe', 'High-volume recurring subscription billing and multi-currency exchange.', 'Boston, MA', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'https://linkedin.com'),
(47, 47, 'Tracy McGrady', 'Live Video Streaming Architect at Netflix', 'Real-time live sports video broadcast over HTTP chunked streaming.', 'Atlanta, GA', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'https://linkedin.com'),
(48, 48, 'Ursula Corbero', 'Data Sharing & Marketplace Lead at Snowflake', 'Zero-copy database cloning and secure multi-tenant data shares.', 'Miami, FL', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', 'https://linkedin.com'),
(49, 49, 'Valerie Pierce', 'Gene Therapy Bioinformatics Lead at Genentech', 'CRISPR off-target prediction graphs and transcriptomics pipelines.', 'San Francisco, CA', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'https://linkedin.com'),
(50, 50, 'William Riker', 'Principal Solutions Architect at AWS', 'Enterprise multi-region disaster recovery and hybrid cloud networking.', 'Washington, DC', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', 'https://linkedin.com')
ON CONFLICT (id) DO NOTHING;

SELECT setval('profiles_id_seq', (SELECT MAX(id) FROM profiles));

-- 6. User Career Experiences (linking users to companies)
INSERT INTO experiences (user_id, company_id, title, start_date, end_date, is_current) VALUES
-- User 2 (Alice Chen)
(2, 1, 'Principal Distributed Systems Engineer', '2021-03-01', NULL, TRUE),
(2, 4, 'Senior Backend Engineer', '2017-06-01', '2021-02-28', FALSE),
-- User 3 (Bob Martinez)
(3, 2, 'Research Scientist — Graph Intelligence', '2022-01-15', NULL, TRUE),
(3, 1, 'AI Research Resident', '2019-08-01', '2021-12-31', FALSE),
-- User 4 (Carol Taylor)
(4, 4, 'Head of Payments Architecture', '2020-04-01', NULL, TRUE),
(4, 12, 'Quantitative Developer', '2016-09-01', '2020-03-15', FALSE),
-- User 5 (David Kim)
(5, 7, 'Staff Data Architect', '2021-10-01', NULL, TRUE),
(5, 6, 'Data Platform Lead', '2018-05-01', '2021-09-30', FALSE),
-- User 6 (Elena Rostova)
(6, 6, 'VP of Engineering', '2019-02-01', NULL, TRUE),
(6, 1, 'Staff Infrastructure Engineer', '2014-07-01', '2019-01-15', FALSE),
-- User 7 (Frank Wright)
(7, 5, 'Director of Infrastructure', '2020-01-10', NULL, TRUE),
(7, 9, 'Principal Systems Architect', '2015-03-01', '2019-12-31', FALSE),
-- User 8 (Grace Hopper)
(8, 9, 'Distinguished Architect', '2018-06-01', NULL, TRUE),
(8, 3, 'Principal Systems Engineer', '2012-01-01', '2018-05-30', FALSE),
-- User 9 (Hassan Ali)
(9, 10, 'Lead Recommendation Architect', '2021-07-01', NULL, TRUE),
(9, 11, 'Senior ML Engineer', '2018-01-15', '2021-06-30', FALSE),
-- User 10 (Isabella Rossi)
(10, 11, 'Principal Audio DSP Engineer', '2020-08-01', NULL, TRUE),
(10, 8, 'Senior Audio Engineer', '2016-03-01', '2020-07-15', FALSE),
-- User 11 (James Wilson)
(11, 12, 'Managing Director, Quant Strategies', '2017-09-01', NULL, TRUE),
(11, 13, 'Senior Strategy Consultant', '2013-06-01', '2017-08-31', FALSE),
-- User 12 (Kavita Patel)
(12, 15, 'VP of Mobility Platform', '2020-05-01', NULL, TRUE),
(12, 1, 'Senior Engineering Manager', '2015-08-01', '2020-04-30', FALSE),
-- User 13 (Liam O'Connor)
(13, 8, 'Core OS Performance Architect', '2019-11-01', NULL, TRUE),
(13, 3, 'OS Kernel Engineer', '2015-05-01', '2019-10-15', FALSE),
-- User 14 (Maya Lin)
(14, 14, 'Computational Biology Lead', '2018-02-01', NULL, TRUE),
(14, 1, 'Bioinformatics Researcher', '2014-09-01', '2018-01-15', FALSE),
-- User 15 (Noah Schmidt)
(15, 3, 'Azure Cloud Core Lead', '2019-06-01', NULL, TRUE),
(15, 9, 'Cloud Systems Architect', '2014-04-01', '2019-05-31', FALSE),
-- User 16 (Olivia Brown)
(16, 13, 'Partner — Digital Transformation', '2018-01-01', NULL, TRUE),
(16, 12, 'Associate Director', '2013-08-01', '2017-12-31', FALSE),
-- User 17 (Priya Sharma)
(17, 1, 'Staff Database Reliability Engineer', '2020-03-01', NULL, TRUE),
(17, 6, 'Database Engineer', '2016-05-01', '2020-02-28', FALSE),
-- User 18 (Quinn Murphy)
(18, 2, 'Frontier Alignment Engineer', '2022-06-01', NULL, TRUE),
(18, 5, 'AI Safety Researcher', '2019-09-01', '2022-05-31', FALSE),
-- User 19 (Rachel Adams)
(19, 4, 'Staff Full-Stack Engineer', '2021-04-01', NULL, TRUE),
(19, 15, 'Frontend Lead', '2017-08-01', '2021-03-31', FALSE),
-- User 20 (Samuel Jackson)
(20, 5, 'Llama Open Source Lead', '2021-01-01', NULL, TRUE),
(20, 2, 'Research Engineer', '2018-04-01', '2020-12-31', FALSE),
-- Additional rich experiences
(21, 7, 'Streaming Specialist', '2020-01-01', NULL, TRUE),
(22, 6, 'Query Optimizer Lead', '2021-01-01', NULL, TRUE),
(23, 10, 'CDN Edge Engineer', '2020-01-01', NULL, TRUE),
(24, 11, 'Data PM', '2021-01-01', NULL, TRUE),
(25, 12, 'Algo Trading Lead', '2019-01-01', NULL, TRUE),
(26, 15, 'Marketplace Architect', '2020-01-01', NULL, TRUE),
(27, 8, 'Hardware Verification', '2021-01-01', NULL, TRUE),
(28, 1, 'Cloud Security Architect', '2020-01-01', NULL, TRUE),
(29, 2, 'Inference Lead', '2022-01-01', NULL, TRUE),
(30, 4, 'Risk ML Lead', '2021-01-01', NULL, TRUE);

-- 7. User Skills (M:N)
INSERT INTO user_skills (user_id, skill_id, proficiency) VALUES
-- User 2 (Alice Chen)
(2, 1, 'expert'), (2, 5, 'expert'), (2, 7, 'expert'), (2, 8, 'expert'), (2, 9, 'expert'),
-- User 3 (Bob Martinez)
(3, 2, 'expert'), (3, 6, 'expert'), (3, 10, 'expert'), (3, 5, 'intermediate'), (3, 9, 'expert'),
-- User 4 (Carol Taylor)
(4, 1, 'expert'), (4, 3, 'expert'), (4, 4, 'expert'), (4, 13, 'expert'), (4, 12, 'expert'),
-- User 5 (David Kim)
(5, 1, 'expert'), (5, 8, 'expert'), (5, 14, 'expert'), (5, 5, 'expert'), (5, 7, 'intermediate'),
-- User 6 (Elena Rostova)
(6, 1, 'expert'), (6, 7, 'expert'), (6, 8, 'expert'), (6, 5, 'expert'), (6, 9, 'expert'),
-- User 7 (Frank Wright)
(7, 5, 'expert'), (7, 7, 'expert'), (7, 11, 'expert'), (7, 9, 'expert'),
-- User 8 (Grace Hopper)
(8, 5, 'expert'), (8, 7, 'expert'), (8, 9, 'expert'), (8, 11, 'expert'),
-- User 9 (Hassan Ali)
(9, 2, 'expert'), (9, 6, 'expert'), (9, 10, 'expert'), (9, 5, 'expert'),
-- User 10 (Isabella Rossi)
(10, 6, 'expert'), (10, 10, 'expert'), (10, 15, 'intermediate'),
-- User 11 (James Wilson)
(11, 13, 'expert'), (11, 10, 'expert'), (11, 1, 'intermediate'),
-- User 12 (Kavita Patel)
(12, 5, 'expert'), (12, 9, 'expert'), (12, 7, 'expert'), (12, 15, 'expert'),
-- User 13 (Liam O'Connor)
(13, 5, 'expert'), (13, 9, 'expert'),
-- User 14 (Maya Lin)
(14, 6, 'expert'), (14, 10, 'expert'), (14, 2, 'intermediate'),
-- User 15 (Noah Schmidt)
(15, 7, 'expert'), (15, 11, 'expert'), (15, 5, 'expert'),
-- User 16 (Olivia Brown)
(16, 15, 'expert'), (16, 13, 'expert'), (16, 9, 'intermediate'),
-- User 17 (Priya Sharma)
(17, 1, 'expert'), (17, 8, 'expert'), (17, 7, 'expert'),
-- User 18 (Quinn Murphy)
(18, 6, 'expert'), (18, 10, 'expert'),
-- User 19 (Rachel Adams)
(19, 3, 'expert'), (19, 4, 'expert'), (19, 12, 'expert'),
-- User 20 (Samuel Jackson)
(20, 6, 'expert'), (20, 10, 'expert'), (20, 5, 'expert'),
-- Assign additional skills across remaining users
(21, 14, 'expert'), (21, 5, 'expert'), (22, 1, 'expert'), (22, 8, 'expert'),
(23, 7, 'expert'), (23, 11, 'expert'), (24, 15, 'expert'), (24, 2, 'intermediate'),
(25, 13, 'expert'), (25, 10, 'expert'), (26, 5, 'expert'), (26, 9, 'expert'),
(27, 9, 'expert'), (28, 7, 'expert'), (29, 6, 'expert'), (30, 6, 'expert'),
(30, 13, 'expert'), (31, 10, 'expert'), (32, 7, 'expert'), (33, 14, 'expert'),
(34, 7, 'expert'), (35, 5, 'expert'), (36, 15, 'expert'), (37, 3, 'expert'),
(38, 15, 'expert'), (39, 5, 'expert'), (40, 3, 'expert'), (41, 11, 'expert'),
(42, 6, 'expert'), (43, 13, 'expert'), (44, 5, 'expert'), (45, 9, 'expert'),
(46, 4, 'expert'), (47, 7, 'expert'), (48, 1, 'expert'), (49, 6, 'expert'), (50, 7, 'expert')
ON CONFLICT (user_id, skill_id) DO NOTHING;

-- 8. Connection Requests & Network Topology (Multi-Hop Graph)
-- Core Path Cluster 1: User 2 -> User 3 -> User 4 -> User 5 -> User 12 -> User 16
INSERT INTO connection_requests (sender_id, receiver_id, rel_type, status, message) VALUES
-- Alice Chen (2) Connections
(2, 3, 'colleague', 'accepted', 'Great collaborating on the knowledge graph paper at Google!'),
(2, 6, 'colleague', 'accepted', 'Excited to reconnect from our early Google infrastructure days.'),
(2, 17, 'mentor', 'accepted', 'Proud to have mentored you during your database reliability tenure.'),
(2, 28, 'colleague', 'accepted', 'Working together on cloud security architecture.'),
(2, 7, 'classmate', 'accepted', 'Stanford CS244B distributed systems study group memories!'),

-- Bob Martinez (3) Connections
(3, 4, 'mentor', 'accepted', 'Enjoyed reviewing Stripe''s graph database strategy.'),
(3, 18, 'colleague', 'accepted', 'Collaborating daily on frontier alignment at OpenAI.'),
(3, 20, 'friend', 'accepted', 'Met at NeurIPS graph neural networks workshop.'),
(3, 29, 'colleague', 'accepted', 'Optimizing inference kernels together.'),

-- Carol Taylor (4) Connections
(4, 5, 'colleague', 'accepted', 'Collaborating on real-time lakehouse payment transaction streaming.'),
(4, 19, 'mentor', 'accepted', 'Mentoring on frontend-backend transaction integrity.'),
(4, 30, 'colleague', 'accepted', 'Working on fraud graph ML pipelines.'),
(4, 46, 'colleague', 'accepted', 'Co-designing the next-gen billing engine.'),

-- David Kim (5) Connections
(5, 12, 'friend', 'accepted', 'Discussed graph indexing for transportation networks.'),
(5, 21, 'colleague', 'accepted', 'Co-building Delta streaming integrations.'),
(5, 33, 'colleague', 'accepted', 'Collaborating on open-source Delta Lake kernels.'),

-- Elena Rostova (6) Connections
(6, 22, 'mentor', 'accepted', 'Guiding query compiler optimization roadmap.'),
(6, 34, 'colleague', 'accepted', 'Leading enterprise governance initiatives.'),
(6, 48, 'colleague', 'accepted', 'Scaling Snowflake data sharing fabric.'),

-- Frank Wright (7) Connections
(7, 8, 'colleague', 'accepted', 'Collaborated on cloud infrastructure standards.'),
(7, 20, 'mentor', 'accepted', 'Mentoring open source infrastructure releases.'),
(7, 31, 'colleague', 'accepted', 'Accelerating PyTorch hardware kernel performance.'),

-- Grace Hopper (8) Connections
(8, 15, 'mentor', 'accepted', 'Pioneering asynchronous cloud runtime paradigms.'),
(8, 32, 'colleague', 'accepted', 'Refining serverless microVM isolation.'),
(8, 50, 'colleague', 'accepted', 'Advising enterprise multi-region resilience.'),

-- Hassan Ali (9) Connections
(9, 10, 'colleague', 'accepted', 'Discussing recommendation graphs at industry summit.'),
(9, 23, 'colleague', 'accepted', 'Streaming media graph integration at Netflix.'),
(9, 35, 'colleague', 'accepted', 'Optimizing adaptive bitrate pipelines.'),
(9, 47, 'colleague', 'accepted', 'Live streaming telemetry routing.'),

-- Isabella Rossi (10) Connections
(10, 24, 'colleague', 'accepted', 'Connecting audio embeddings to Spotify knowledge graph.'),
(10, 36, 'colleague', 'accepted', 'Growth experimentation for personalized audio.'),
(10, 44, 'colleague', 'accepted', 'Real-time WebRTC audio clustering.'),

-- James Wilson (11) Connections
(11, 16, 'colleague', 'accepted', 'Advising on fintech AI and valuation models.'),
(11, 25, 'colleague', 'accepted', 'Co-leading quantitative algorithmic strategies.'),
(11, 43, 'mentor', 'accepted', 'Mentoring risk modeling frameworks.'),

-- Kavita Patel (12) Connections
(12, 16, 'friend', 'accepted', 'Consulting on mobility network expansion.'),
(12, 26, 'colleague', 'accepted', 'Dispatch engine architecture alignment.'),
(12, 39, 'mentor', 'accepted', 'Scaling geospatial H3 hex indexing.'),

-- Liam O'Connor (13) Connections
(13, 27, 'colleague', 'accepted', 'Hardware-software co-design on Apple Silicon.'),
(13, 40, 'colleague', 'accepted', 'iOS framework memory optimization.'),

-- Maya Lin (14) Connections
(14, 49, 'colleague', 'accepted', 'Genomics graph alignment and CRISPR scoring.'),

-- Additional cross-network connections
(15, 37, 'mentor', 'accepted', 'Compiler architecture and cloud runtime.'),
(16, 38, 'colleague', 'accepted', 'Enterprise technology roadmaps.'),
(17, 41, 'colleague', 'accepted', 'Spanner on Kubernetes operations.'),
(18, 42, 'colleague', 'accepted', 'Safety harnesses and alignment evaluation.'),

-- Pending Requests (to demonstrate state machine in UI)
(2, 10, 'colleague', 'pending', 'Hi Isabella, would love to connect regarding audio embeddings.'),
(3, 11, 'friend', 'pending', 'Hi James, let''s discuss graph models in financial markets.'),
(4, 12, 'colleague', 'pending', 'Hi Kavita, interested in your dispatch graph architecture.'),
(5, 13, 'other', 'pending', 'Hi Liam, let''s connect regarding memory performance.'),

-- Rejected Request (to demonstrate history)
(7, 16, 'colleague', 'rejected', 'Connecting regarding consulting projects.')
ON CONFLICT (sender_id, receiver_id) DO NOTHING;

-- 9. Initial Activity Log
INSERT INTO activity_log (user_id, action, target_id, metadata) VALUES
(1, 'SYSTEM_INITIALIZED', NULL, '{"version": "1.0.0", "dual_db": "PostgreSQL + Neo4j"}'::jsonb),
(2, 'CONNECTION_STATUS_ACCEPTED', 3, '{"rel_type": "colleague", "note": "Connection established"}'::jsonb),
(3, 'CONNECTION_STATUS_ACCEPTED', 4, '{"rel_type": "mentor", "note": "Connection established"}'::jsonb),
(4, 'CONNECTION_STATUS_ACCEPTED', 5, '{"rel_type": "colleague", "note": "Connection established"}'::jsonb),
(5, 'CONNECTION_STATUS_ACCEPTED', 12, '{"rel_type": "friend", "note": "Connection established"}'::jsonb),
(12, 'CONNECTION_STATUS_ACCEPTED', 16, '{"rel_type": "friend", "note": "Connection established"}'::jsonb);
