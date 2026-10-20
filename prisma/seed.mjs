import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding DevPulse AI Database...");

  // Clear existing records to ensure idempotent seed
  await prisma.chatMessage.deleteMany();
  await prisma.chatSession.deleteMany();
  await prisma.securityFinding.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.file.deleteMany();
  await prisma.analysis.deleteMany();
  await prisma.project.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Default Developer User with hashed password (DevPulse2026!)
  const passwordHash = await bcrypt.hash("DevPulse2026!", 10);
  const defaultUser = await prisma.user.create({
    data: {
      email: "developer@devpulse.ai",
      name: "Lead Architect",
      passwordHash,
      role: "developer",
      avatarUrl: "https://avatar.vercel.sh/developer",
    },
  });

  // 2. Project: auth-gateway-service
  const authProject = await prisma.project.create({
    data: {
      name: "auth-gateway-service",
      description: "OAuth2, JWT authentication and session management microservice",
      language: "TypeScript",
      repositoryUrl: "https://github.com/devpulse/auth-gateway-service",
      healthScore: 92,
      securityScore: 88,
      userId: defaultUser.id,
      files: {
        create: [
          {
            path: "src/api/auth/login.ts",
            name: "login.ts",
            language: "typescript",
            sizeBytes: 1042,
            content: `export async function handleLogin(req: Request) {\n  const { email, password } = await req.json();\n  // VULNERABLE: Direct string interpolation\n  const query = \`SELECT * FROM users WHERE email = '\${email}' AND password = '\${password}'\`;\n  const user = await db.rawQuery(query);\n  return Response.json(user);\n}`,
          },
          {
            path: "src/crypto/hasher.ts",
            name: "hasher.ts",
            language: "typescript",
            sizeBytes: 680,
            content: `import crypto from "crypto";\nexport function hashPassword(plain: string) {\n  return crypto.createHash("sha1").update(plain).digest("hex");\n}`,
          },
          {
            path: "src/auth/jwt.ts",
            name: "jwt.ts",
            language: "typescript",
            sizeBytes: 1540,
            content: `export function signToken(payload: object) {\n  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });\n}`,
          },
          {
            path: "src/middleware/rateLimit.ts",
            name: "rateLimit.ts",
            language: "typescript",
            sizeBytes: 890,
            content: `export async function checkRateLimit(ip: string) {\n  const hits = await redis.incr(ip);\n  return hits <= 100;\n}`,
          },
        ],
      },
    },
  });

  // Create Analysis for auth-gateway-service
  const authAnalysis = await prisma.analysis.create({
    data: {
      projectId: authProject.id,
      status: "completed",
      summary: "Dual AST and neural review identified 1 critical SQL injection vulnerability and 1 deprecated hash function.",
      codeQualityScore: 92,
      securityScore: 88,
      totalIssues: 3,
      criticalIssues: 1,
      durationMs: 1420,
      userId: defaultUser.id,
    },
  });

  await prisma.issue.createMany({
    data: [
      {
        projectId: authProject.id,
        analysisId: authAnalysis.id,
        severity: "critical",
        category: "bug",
        title: "SQL Injection in User Authentication Query",
        description: "Direct string interpolation of untrusted email and password parameters in db.rawQuery.",
        location: "src/api/auth/login.ts:4",
        lineStart: 4,
        lineEnd: 5,
        recommendation: "Use parameterized queries or prepared statements via Prisma.",
        status: "open",
      },
      {
        projectId: authProject.id,
        analysisId: authAnalysis.id,
        severity: "medium",
        category: "smell",
        title: "Hardcoded Expiration Fallback",
        description: "Token expiry defaults to 1h without dynamic refresh rotation token family check.",
        location: "src/auth/jwt.ts:2",
        lineStart: 2,
        lineEnd: 2,
        recommendation: "Implement rotating refresh tokens with Redis revocation.",
        status: "open",
      },
      {
        projectId: authProject.id,
        analysisId: authAnalysis.id,
        severity: "low",
        category: "maintainability",
        title: "Missing Error Boundary in JSON Parse",
        description: "req.json() can throw unhandled SyntaxError on malformed payloads.",
        location: "src/api/auth/login.ts:2",
        lineStart: 2,
        lineEnd: 2,
        recommendation: "Wrap in try-catch and return HTTP 400 Bad Request.",
        status: "open",
      },
    ],
  });

  await prisma.securityFinding.createMany({
    data: [
      {
        projectId: authProject.id,
        analysisId: authAnalysis.id,
        severity: "critical",
        category: "static",
        cwe: "CWE-89",
        title: "SQL Injection via String Concatenation",
        description: "Direct string concatenation into SQL query execution call without parameterized binding.",
        location: "src/api/auth/login.ts:4",
        lineStart: 4,
        lineEnd: 5,
        risk: "Attacker can dump credentials and bypass authorization completely.",
        remediation: "Use parameterized query: db.query('SELECT * FROM users WHERE email = $1', [email])",
        status: "active",
      },
      {
        projectId: authProject.id,
        analysisId: authAnalysis.id,
        severity: "low",
        category: "informational",
        cwe: "CWE-327",
        title: "Use of Deprecated Cryptographic Hash (SHA-1)",
        description: "crypto.createHash('sha1') is insecure against collision attacks.",
        location: "src/crypto/hasher.ts:3",
        lineStart: 3,
        lineEnd: 3,
        risk: "Vulnerable to hash collisions and rainbow table attacks.",
        remediation: "Migrate to Argon2id or bcrypt for password hashing.",
        status: "active",
      },
    ],
  });

  // 3. Project: payment-processing-engine
  const paymentProject = await prisma.project.create({
    data: {
      name: "payment-processing-engine",
      description: "Stripe & internal ledger transaction pipeline with idempotency guarantees",
      language: "Go",
      repositoryUrl: "https://github.com/devpulse/payment-processing-engine",
      healthScore: 74,
      securityScore: 68,
      userId: defaultUser.id,
      files: {
        create: [
          {
            path: "config/stripe.go",
            name: "stripe.go",
            language: "go",
            sizeBytes: 1200,
            content: `package config\nconst StripeLiveKey = "mock_stripe_secret_token_example_12345"`,
          },
          {
            path: "handlers/checkout.go",
            name: "checkout.go",
            language: "go",
            sizeBytes: 2400,
            content: `package handlers\nfunc ProcessPayment() { /* payment processor */ }`,
          },
        ],
      },
    },
  });

  const paymentAnalysis = await prisma.analysis.create({
    data: {
      projectId: paymentProject.id,
      status: "completed",
      summary: "Found hardcoded live payment secrets in source code and unhandled channel races.",
      codeQualityScore: 74,
      securityScore: 68,
      totalIssues: 4,
      criticalIssues: 1,
      durationMs: 980,
      userId: defaultUser.id,
    },
  });

  await prisma.securityFinding.create({
    data: {
      projectId: paymentProject.id,
      analysisId: paymentAnalysis.id,
      severity: "critical",
      category: "static",
      cwe: "CWE-798",
      title: "Hardcoded API Secret Key",
      description: "Payment production secret mock_secret_... discovered in source file AST.",
      location: "config/stripe.go:2",
      lineStart: 2,
      lineEnd: 2,
      risk: "Attacker can issue unauthorized refunds and drain merchant account funds.",
      remediation: "Remove key from source code, revoke on Stripe dashboard, load via STRIPE_SECRET_KEY env var.",
      status: "active",
    },
  });

  // 4. Project: telemetry-stream-worker
  const telemetryProject = await prisma.project.create({
    data: {
      name: "telemetry-stream-worker",
      description: "Kafka & Redis pub/sub real-time aggregator for developer telemetry",
      language: "Python",
      repositoryUrl: "https://github.com/devpulse/telemetry-stream-worker",
      healthScore: 81,
      securityScore: 85,
      userId: defaultUser.id,
      files: {
        create: [
          {
            path: "workers/report.py",
            name: "report.py",
            language: "python",
            sizeBytes: 1800,
            content: `import os\ndef download_report(user_path):\n  return open(os.path.join('/reports', user_path)).read()`,
          },
        ],
      },
    },
  });

  const telemetryAnalysis = await prisma.analysis.create({
    data: {
      projectId: telemetryProject.id,
      status: "completed",
      summary: "Potential path traversal risk identified in report export handler.",
      codeQualityScore: 81,
      securityScore: 85,
      totalIssues: 3,
      criticalIssues: 0,
      durationMs: 1150,
      userId: defaultUser.id,
    },
  });

  await prisma.securityFinding.create({
    data: {
      projectId: telemetryProject.id,
      analysisId: telemetryAnalysis.id,
      severity: "medium",
      category: "potential",
      cwe: "CWE-22",
      title: "Potential Path Traversal in Report Downloader",
      description: "os.path.join() with unvalidated user filename parameter.",
      location: "workers/report.py:3",
      lineStart: 3,
      lineEnd: 3,
      risk: "Attacker can supply ../ sequences to read arbitrary files from server disk.",
      remediation: "Validate path against safe root directory using os.path.commonpath.",
      status: "active",
    },
  });

  // 5. Project: admin-analytics-frontend
  const frontendProject = await prisma.project.create({
    data: {
      name: "admin-analytics-frontend",
      description: "Internal operations portal and developer metrics dashboard",
      language: "TypeScript",
      repositoryUrl: "https://github.com/devpulse/admin-analytics-frontend",
      healthScore: 89,
      securityScore: 94,
      userId: defaultUser.id,
      files: {
        create: [
          {
            path: "components/UserGreeting.tsx",
            name: "UserGreeting.tsx",
            language: "typescript",
            sizeBytes: 1100,
            content: `export function UserGreeting({ rawHtml }: { rawHtml: string }) {\n  return <div dangerouslySetInnerHTML={{ __html: rawHtml }} />;\n}`,
          },
        ],
      },
    },
  });

  const frontendAnalysis = await prisma.analysis.create({
    data: {
      projectId: frontendProject.id,
      status: "completed",
      summary: "Reflected XSS risk detected in user greeting component.",
      codeQualityScore: 89,
      securityScore: 94,
      totalIssues: 2,
      criticalIssues: 0,
      durationMs: 780,
      userId: defaultUser.id,
    },
  });

  await prisma.securityFinding.create({
    data: {
      projectId: frontendProject.id,
      analysisId: frontendAnalysis.id,
      severity: "high",
      category: "potential",
      cwe: "CWE-79",
      title: "Potential Reflected Cross-Site Scripting (XSS)",
      description: "dangerouslySetInnerHTML invoked with unescaped HTML content.",
      location: "components/UserGreeting.tsx:2",
      lineStart: 2,
      lineEnd: 2,
      risk: "Execution of arbitrary malicious JavaScript in victim administrator browser context.",
      remediation: "Sanitize user HTML using DOMPurify or render standard React text nodes.",
      status: "active",
    },
  });

  // 6. Project: encryption-kms-vault
  await prisma.project.create({
    data: {
      name: "encryption-kms-vault",
      description: "Cryptographic envelope key derivation and vault rotation agent",
      language: "Rust",
      repositoryUrl: "https://github.com/devpulse/encryption-kms-vault",
      healthScore: 98,
      securityScore: 99,
      userId: defaultUser.id,
    },
  });

  console.log("✅ Seed completed successfully! Created 5 projects, files, analyses, issues, and security findings.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
