-- ============================================================
-- Quorum Dashboard — Full Database Setup
-- Run this ONCE in the Supabase Dashboard SQL Editor
-- ============================================================

-- ── 1. Country Fraud Data ────────────────────────────────────
CREATE TABLE IF NOT EXISTS country_fraud_data (
  id          text PRIMARY KEY,          -- ISO 3166-1 numeric code
  name        text NOT NULL,
  iso2        text NOT NULL,
  loss_m      numeric NOT NULL,          -- annual fraud loss in $M
  fraud_rate  numeric NOT NULL,          -- as fraction of TPV
  app_pct     integer NOT NULL,          -- APP fraud %
  unauth_pct  integer NOT NULL,
  fp_pct      integer NOT NULL,          -- first-party %
  ato_pct     integer NOT NULL
);

ALTER TABLE country_fraud_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_country_fraud" ON country_fraud_data FOR SELECT USING (true);

-- ── 2. Alert Trends ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alert_trends (
  id        serial PRIMARY KEY,
  day_label text NOT NULL,
  alerts    integer NOT NULL,
  blocked   integer NOT NULL
);

ALTER TABLE alert_trends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_alert_trends" ON alert_trends FOR SELECT USING (true);

-- ── 3. Fraud By Type ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fraud_by_type (
  id         serial PRIMARY KEY,
  type_name  text NOT NULL,
  count      integer NOT NULL
);

ALTER TABLE fraud_by_type ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_fraud_by_type" ON fraud_by_type FOR SELECT USING (true);

-- ── 4. Fraud Cases ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fraud_cases (
  id         text PRIMARY KEY,
  type       text NOT NULL,
  amount     numeric NOT NULL,
  risk_score integer NOT NULL,
  status     text NOT NULL,
  account    text NOT NULL,
  timestamp  timestamptz NOT NULL,
  region     text NOT NULL
);

ALTER TABLE fraud_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_fraud_cases" ON fraud_cases FOR SELECT USING (true);

-- ── 5. Attack Agents ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attack_agents (
  id            text PRIMARY KEY,
  name          text NOT NULL,
  vector        text NOT NULL,
  status        text NOT NULL,
  target_region text NOT NULL,
  intensity     text NOT NULL,
  progress      integer NOT NULL DEFAULT 0,
  findings      integer NOT NULL DEFAULT 0,
  started_at    timestamptz
);

ALTER TABLE attack_agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_attack_agents" ON attack_agents FOR SELECT USING (true);

-- ── 6. Simulated Systems ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS simulated_systems (
  id                text PRIMARY KEY,
  name              text NOT NULL,
  region            text NOT NULL,
  fraud_weaknesses  text[] NOT NULL,
  firewall_strength integer NOT NULL,
  is_online         boolean NOT NULL DEFAULT true
);

ALTER TABLE simulated_systems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_simulated_systems" ON simulated_systems FOR SELECT USING (true);

-- ── 7. Network Participants ──────────────────────────────────
CREATE TABLE IF NOT EXISTS network_participants (
  id                  text PRIMARY KEY,
  name                text NOT NULL,
  type                text NOT NULL,
  jurisdiction        text NOT NULL,
  contributed_signals integer NOT NULL DEFAULT 0,
  queries_used        integer NOT NULL DEFAULT 0,
  credits             integer NOT NULL DEFAULT 0,
  tier                text NOT NULL DEFAULT 'full'
);

ALTER TABLE network_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_network_participants" ON network_participants FOR SELECT USING (true);


-- ============================================================
-- SEED DATA
-- ============================================================

-- ── Country Fraud Data (48 countries, ~$1.7B total) ──────────
INSERT INTO country_fraud_data (id, name, iso2, loss_m, fraud_rate, app_pct, unauth_pct, fp_pct, ato_pct) VALUES
  ('840','United States','US',612,0.060,35,25,25,15),
  ('124','Canada','CA',42.5,0.055,30,28,27,15),
  ('484','Mexico','MX',34,0.090,22,35,18,25),
  ('826','United Kingdom','GB',136,0.110,40,20,25,15),
  ('276','Germany','DE',102,0.075,25,30,25,20),
  ('250','France','FR',68,0.080,28,27,28,17),
  ('380','Italy','IT',42.5,0.085,24,30,26,20),
  ('724','Spain','ES',34,0.078,26,28,28,18),
  ('528','Netherlands','NL',25.5,0.065,30,25,30,15),
  ('616','Poland','PL',17,0.095,20,35,22,23),
  ('752','Sweden','SE',12.75,0.060,32,22,32,14),
  ('056','Belgium','BE',8.5,0.062,28,25,30,17),
  ('756','Switzerland','CH',8.5,0.045,30,22,32,16),
  ('372','Ireland','IE',8.5,0.070,35,22,28,15),
  ('040','Austria','AT',8.5,0.058,26,28,30,16),
  ('578','Norway','NO',6.8,0.055,34,20,32,14),
  ('208','Denmark','DK',6.8,0.052,33,21,32,14),
  ('620','Portugal','PT',5.1,0.072,24,30,28,18),
  ('642','Romania','RO',5.1,0.105,18,38,20,24),
  ('203','Czech Republic','CZ',5.1,0.068,25,28,30,17),
  ('300','Greece','GR',3.4,0.088,22,32,26,20),
  ('348','Hungary','HU',3.4,0.092,20,34,24,22),
  ('246','Finland','FI',3.4,0.048,35,18,34,13),
  ('643','Russia','RU',25.5,0.130,15,40,15,30),
  ('804','Ukraine','UA',5.1,0.140,12,42,16,30),
  ('156','China','CN',42.5,0.070,18,35,20,27),
  ('392','Japan','JP',25.5,0.050,22,28,32,18),
  ('410','South Korea','KR',17,0.055,24,26,30,20),
  ('356','India','IN',42.5,0.120,20,32,22,26),
  ('586','Pakistan','PK',5.1,0.150,12,42,14,32),
  ('702','Singapore','SG',17,0.075,28,24,28,20),
  ('360','Indonesia','ID',17,0.130,15,38,18,29),
  ('608','Philippines','PH',12.75,0.125,16,36,20,28),
  ('764','Thailand','TH',10.2,0.085,20,32,24,24),
  ('458','Malaysia','MY',6.8,0.080,22,30,26,22),
  ('704','Vietnam','VN',6.8,0.110,15,38,20,27),
  ('036','Australia','AU',51,0.095,38,22,25,15),
  ('554','New Zealand','NZ',3.4,0.065,35,22,28,15),
  ('792','Turkey','TR',17,0.100,18,35,22,25),
  ('784','UAE','AE',12.75,0.068,30,28,24,18),
  ('376','Israel','IL',8.5,0.058,32,24,28,16),
  ('682','Saudi Arabia','SA',8.5,0.072,25,30,25,20),
  ('566','Nigeria','NG',25.5,0.180,12,45,10,33),
  ('710','South Africa','ZA',10.2,0.115,18,35,20,27),
  ('818','Egypt','EG',3.4,0.095,15,38,18,29),
  ('076','Brazil','BR',51,0.120,20,35,20,25),
  ('032','Argentina','AR',12.75,0.110,18,36,20,26),
  ('170','Colombia','CO',12.75,0.105,18,34,22,26),
  ('152','Chile','CL',5.1,0.075,24,28,28,20),
  ('604','Peru','PE',3.4,0.100,18,34,22,26)
ON CONFLICT (id) DO NOTHING;

-- ── Alert Trends ─────────────────────────────────────────────
INSERT INTO alert_trends (day_label, alerts, blocked) VALUES
  ('Mon',320,280),('Tue',410,350),('Wed',380,340),
  ('Thu',520,460),('Fri',490,430),('Sat',280,250),('Sun',240,210)
ON CONFLICT DO NOTHING;

-- ── Fraud By Type ────────────────────────────────────────────
INSERT INTO fraud_by_type (type_name, count) VALUES
  ('APP',1247),('Unauth',892),('1st Party',634),('Collusion',421)
ON CONFLICT DO NOTHING;

-- ── Fraud Cases ──────────────────────────────────────────────
INSERT INTO fraud_cases (id, type, amount, risk_score, status, account, timestamp, region) VALUES
  ('TXN-8A2F9B','APP Fraud',4230,92,'critical','usr_7291a','2025-05-15T09:23:00Z','UK'),
  ('TXN-3C7D1E','Unauthorised',1850,78,'warning','usr_4812b','2025-05-15T08:45:00Z','US East'),
  ('TXN-6F4A2D','Collusion',12400,95,'critical','usr_9103c','2025-05-15T07:12:00Z','EU West'),
  ('TXN-1B8E3F','First-Party',320,45,'review','usr_5527d','2025-05-15T06:58:00Z','APAC'),
  ('TXN-9D5C7A','APP Fraud',8900,88,'critical','usr_3346e','2025-05-15T05:30:00Z','UK'),
  ('TXN-2E6B4C','Unauthorised',560,32,'cleared','usr_8891f','2025-05-15T04:15:00Z','US West'),
  ('TXN-7G3H1I','Collusion',6750,87,'warning','usr_2204g','2025-05-15T03:48:00Z','EU West'),
  ('TXN-4J8K2L','First-Party',1100,55,'review','usr_6678h','2025-05-15T02:22:00Z','LATAM')
ON CONFLICT (id) DO NOTHING;

-- ── Attack Agents ────────────────────────────────────────────
INSERT INTO attack_agents (id, name, vector, status, target_region, intensity, progress, findings, started_at) VALUES
  ('agt-001','APP Fraud Prober','app_fraud','completed','UK','high',100,14,'2025-05-15T08:00:00Z'),
  ('agt-002','Account Takeover Bot','unauthorised','running','US East','medium',67,8,'2025-05-15T09:15:00Z'),
  ('agt-003','Refund Abuse Scanner','first_party','idle','EU West','low',0,0,NULL),
  ('agt-004','Ring Detection Stress','collusion','running','APAC','high',34,3,'2025-05-15T09:30:00Z')
ON CONFLICT (id) DO NOTHING;

-- ── Simulated Systems ────────────────────────────────────────
INSERT INTO simulated_systems (id, name, region, fraud_weaknesses, firewall_strength, is_online) VALUES
  ('sys-uk-01','PayPal UK Gateway','UK',ARRAY['app_fraud','unauthorised'],72,true),
  ('sys-us-east-01','PayPal US East Hub','US East',ARRAY['unauthorised','first_party'],85,true),
  ('sys-eu-west-01','PayPal EU West Node','EU West',ARRAY['collusion','app_fraud'],68,true),
  ('sys-apac-01','PayPal APAC Relay','APAC',ARRAY['first_party','collusion'],60,false),
  ('sys-latam-01','PayPal LATAM Gateway','LATAM',ARRAY['app_fraud','unauthorised','first_party'],55,true),
  ('sys-us-west-01','PayPal US West Hub','US West',ARRAY['collusion'],90,true)
ON CONFLICT (id) DO NOTHING;

-- ── Network Participants ─────────────────────────────────────
INSERT INTO network_participants (id, name, type, jurisdiction, contributed_signals, queries_used, credits, tier) VALUES
  ('barclays','UK Bank Alpha','bank','UK',847,312,535,'full'),
  ('stripe_uk','PSP Beta (UK)','psp','UK',623,580,43,'full'),
  ('jpmorgan','US Bank Gamma','bank','US',1203,445,758,'full'),
  ('square','US PSP Delta','psp','US',392,390,2,'probation'),
  ('nubank','BR Bank Epsilon','bank','BR',534,201,333,'full'),
  ('vodafone','UK Telco Zeta','telco','UK',289,150,139,'full'),
  ('meta','Social Platform Eta','platform','US',156,420,-264,'restricted'),
  ('vivo','BR Telco Theta','telco','BR',198,95,103,'full')
ON CONFLICT (id) DO NOTHING;

-- ── Done ─────────────────────────────────────────────────────
-- All tables created and seeded. The app can now read from Supabase.
