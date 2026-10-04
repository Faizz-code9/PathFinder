# 🧭 PathFinder: Hybrid Graph-Relational Architecture for Professional Network Intelligence

> **Advanced Database Management Systems (DBMS) Final Project**  
> A Hybrid Polyglot Architecture bridging **PostgreSQL 16** (Relational Core) with **Neo4j 5.x** (Graph Traversal Engine) to solve multi-hop professional relationship pathfinding.

---

## 🌟 Executive Abstract & DBMS Motivation

Cold outreach in professional networks yields `<5%` response rates, whereas warm introductions through mutual connections boost responses by **over 400%**. 

From a DBMS perspective, discovering connection paths across 3 to 6 degrees of separation in a relational SQL database requires recursive multi-table self-joins. For an average user with $d = 150$ connections, a 3-hop query forces the relational engine to evaluate:

$$\text{Search Space} = 150^3 = 3,375,000 \text{ potential intermediate records}$$

This causes **combinatorial join explosion ($O(N^k)$)**, execution timeouts, and memory saturation. Conversely, pure Graph Databases provide **Index-Free Adjacency ($O(k)$)** pointer traversals in constant time, but lack strict 3NF multi-table constraints, ACID transactional state machines, and inverted full-text search indexing.

**PathFinder solves this via True Polyglot Persistence**:
- **PostgreSQL 16 (Relational Core):** Enforces 3NF entity integrity, bcrypt authentication, GIN full-text search, triggers for automated audit logs, and analytical views.
- **Neo4j 5.x (Graph Engine):** Executes native shortest-path traversals (Dijkstra/BFS) and Friend-of-Friend (FoF) graph aggregations in sub-milliseconds.

---

## 🚀 Key Features

1. **Interactive 2D Physics Canvas Visualizer:** HTML5 Canvas force-directed graph rendering active multi-hop paths with animated photon particles.
2. **Explainable Warm Introduction Blueprints:** Annotates every intermediate hop with rich career context (e.g., *"Alice worked with Bob at Google for 3 years"*).
3. **Semantic Warmth Scoring:** Dynamic relationship weighting (Co-founder = 1.0, Mentor = 2.0, Colleague = 3.0, Classmate = 4.0).
4. **"People You May Know" (FoF Discovery):** Real-time Cypher graph aggregations ranked by mutual connection count.
5. **PostgreSQL GIN Full-Text Search:** Instant lexical search on names, headlines, and bios ranked by `ts_rank`.
6. **Automated Audit Logging:** PostgreSQL database trigger `trg_connection_audit` capturing all connection lifecycle state transitions.
7. **Admin Analytics Hub & RBAC:** Comprehensive dashboards powered by SQL views `v_network_analytics` and `v_industry_distribution`.

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js (App Router), React, Tailwind CSS | `14+ / 19` | Modern server/client hybrid rendering and sleek dark UI |
| **Graph Visualizer** | `react-force-graph-2d` | `1.29+` | HTML5 Canvas-based force-directed physics engine |
| **Relational DB** | PostgreSQL | `16.2` | ACID source of truth, 3NF schema, GIN indexes, triggers, views |
| **Graph DB** | Neo4j Community | `5.x` | Attributed property graph, index-free adjacency traversals |
| **Auth & Security** | JWT (`jose`) + `bcryptjs` | Latest | Stateless bearer authentication with `user` and `admin` RBAC |
| **Validation** | Zod | `3.23+` | Strict schema validation |
| **Orchestration** | Docker & Docker Compose | `v2.x` | One-command database container orchestration |

---

## ⚡ Quickstart Guide

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Running)
- [Node.js](https://nodejs.org/) (v18+) & npm

### 2. Start Database Containers
```bash
docker compose up -d
```
* PostgreSQL runs on `localhost:5432` (`pathfinder_user` / `pathfinder_pass`)
* Neo4j runs on `localhost:7687` (Bolt) and `http://localhost:7474` (Browser)

### 3. Provision Schema & Seed Dataset (50+ Users)
```bash
npm run db:setup
```

### 4. Run Next.js Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Accounts

All pre-seeded demo accounts share the password: `password123`

| User | Email | Role | Highlight |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@pathfinder.io` | `admin` | Full RBAC permissions, audit trail explorer, system views |
| **Alice Chen** | `alice.chen@google.com` | `user` | Principal Engineer at Google (5-hop network reach) |
| **Bob Martinez** | `bob.martinez@openai.com` | `user` | Research Scientist at OpenAI (Graph AI) |
| **Carol Taylor** | `carol.taylor@stripe.com` | `user` | Head of Payments at Stripe |
| **Noah Schmidt** | `noah.schmidt@microsoft.com` | `user` | Azure Cloud Core Lead |

---

## 📊 Advanced DBMS Verification Checklist

| Requirement | Implementation Detail | Location |
| :--- | :--- | :--- |
| **1. Dual DB Engine** | PostgreSQL 16 (Relational) + Neo4j 5 (Graph NoSQL) | `docker-compose.yml`, `lib/db/` |
| **2. DDL Schema** | 9 3NF Tables with primary & foreign keys, cascades, unique constraints | `db/postgres/init/01_schema.sql` |
| **3. Full-Text Indexing** | GIN index on `to_tsvector` with `ts_rank` lexical scoring | `db/postgres/init/02_indexes.sql` |
| **4. Analytical Views** | `v_network_analytics` & `v_industry_distribution` | `db/postgres/init/03_views.sql` |
| **5. Stored Procedures** | `calculate_connection_strength()` & `get_hop_context()` in PL/pgSQL | `db/postgres/init/04_procedures.sql` |
| **6. Database Triggers** | `trg_connection_audit` logging to `activity_log` upon status update | `db/postgres/init/05_triggers.sql` |
| **7. Graph Traversal** | Sub-millisecond `shortestPath()` and FoF graph aggregation | `db/neo4j/queries.cypher` |
| **8. Dual-Write Sync** | Distributed transaction pipeline with automatic rollback | `app/api/connections/[id]/route.ts` |
