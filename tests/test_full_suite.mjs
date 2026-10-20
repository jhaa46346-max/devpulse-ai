// tests/test_full_suite.mjs - Comprehensive End-to-End Suite for DevPulse AI
const BASE_URL = "http://localhost:3000";

let sessionCookie = "";
let sampleProjectId = "";

async function run() {
  console.log("=================================================");
  console.log("🚀 STARTING DEVPULSE AI FULL TEST SUITE");
  console.log("=================================================");

  // 1. Landing Page Test
  console.log("\n[Test 1] Testing Public Landing Page (GET /)...");
  const landingRes = await fetch(`${BASE_URL}/`);
  if (landingRes.status === 200) {
    const html = await landingRes.text();
    console.log(`✅ Landing Page returned HTTP 200 (Length: ${html.length} chars)`);
  } else {
    throw new Error(`Failed to fetch landing page: HTTP ${landingRes.status}`);
  }

  // 2. Authentication Test
  console.log("\n[Test 2] Testing User Authentication (POST /api/auth/login)...");
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "developer@devpulse.ai",
      password: "DevPulse2026!",
    }),
  });

  const loginData = await loginRes.json();
  if (loginRes.status === 200 && loginData.success) {
    console.log(`✅ Login successful: User ID: ${loginData.user.id}, Email: ${loginData.user.email}`);
    const setCookie = loginRes.headers.get("set-cookie");
    if (setCookie) {
      sessionCookie = setCookie.split(";")[0];
      console.log(`✅ Session cookie captured: ${sessionCookie.slice(0, 30)}...`);
    }
  } else {
    throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
  }

  // 3. Auth Me Validation
  console.log("\n[Test 3] Testing Session Validation (GET /api/auth/me)...");
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: sessionCookie },
  });
  const meData = await meRes.json();
  if (meRes.status === 200 && (meData.success || meData.authenticated)) {
    console.log(`✅ User verified: ${meData.user.name} (${meData.user.role})`);
  } else {
    throw new Error(`Session validation failed: ${JSON.stringify(meData)}`);
  }

  // 4. Dashboard Metrics Test
  console.log("\n[Test 4] Testing Live Metrics (GET /api/dashboard)...");
  const dashRes = await fetch(`${BASE_URL}/api/dashboard`, {
    headers: { Cookie: sessionCookie },
  });
  const dashData = await dashRes.json();
  if (dashRes.status === 200 && dashData.success) {
    const { metrics, recentProjects } = dashData.data;
    console.log(`✅ Dashboard stats: ${metrics.totalProjects} Projects, Issues: ${metrics.totalIssues}, Avg Health: ${metrics.overallHealth}%`);
    console.log(`✅ Recent projects count: ${recentProjects.length}`);
  } else {
    throw new Error(`Dashboard fetch failed: ${JSON.stringify(dashData)}`);
  }

  // 5. Projects Listing
  console.log("\n[Test 5] Testing Project Inventory (GET /api/projects)...");
  const projRes = await fetch(`${BASE_URL}/api/projects`, {
    headers: { Cookie: sessionCookie },
  });
  const projData = await projRes.json();
  if (projRes.status === 200 && projData.success) {
    console.log(`✅ Retrieved ${projData.projects.length} registered projects.`);
    sampleProjectId = projData.projects[0].id;
    console.log(`   Sample: "${projData.projects[0].name}" [Health: ${projData.projects[0].healthScore}%, Files: ${projData.projects[0].fileCount}]`);
  } else {
    throw new Error(`Projects fetch failed: ${JSON.stringify(projData)}`);
  }

  // 6. Code Analyzer API
  console.log("\n[Test 6] Testing Dual-Engine Code Analyzer (POST /api/analyzer)...");
  const sampleCode = `
const express = require('express');
const app = express();
const AWS_SECRET_KEY = "AKIAIOSFODNN7EXAMPLESECRET";

app.get('/users', async (req, res) => {
  const query = "SELECT * FROM users WHERE id = '" + req.query.id + "'";
  const results = await db.query(query);
  res.json(results);
});
`;
  const analyzerRes = await fetch(`${BASE_URL}/api/analyzer`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: sessionCookie },
    body: JSON.stringify({
      code: sampleCode,
      language: "javascript",
      filename: "server.js",
    }),
  });
  const analyzerData = await analyzerRes.json();
  if (analyzerRes.status === 200 && analyzerData.success) {
    const res = analyzerData.data;
    console.log(`✅ Code Analyzer executed successfully.`);
    console.log(`   Quality Score: ${res.codeQualityScore}%, Security Score: ${res.securityScore}%`);
    console.log(`   Bugs detected: ${res.bugs.length}, Security Findings: ${res.securityFindings.length}`);
    console.log(`   Unit tests generated: ${res.generatedTests?.code ? 'YES' : 'NO'}`);
  } else {
    throw new Error(`Code analyzer failed: ${JSON.stringify(analyzerData)}`);
  }

  // 7. Security SAST Scan API
  console.log("\n[Test 7] Testing Static SAST Security Engine (POST /api/security/scan)...");
  const scanRes = await fetch(`${BASE_URL}/api/security/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: sessionCookie },
    body: JSON.stringify({
      code: sampleCode,
      fileName: "server.js",
      language: "javascript",
    }),
  });
  const scanData = await scanRes.json();
  if (scanRes.status === 200 && scanData.success) {
    const s = scanData.data;
    console.log(`✅ SAST Scan executed successfully.`);
    console.log(`   Score: ${s.score}%`);
    console.log(`   Severity counts: Critical=${s.summary.critical}, High=${s.summary.high}, Medium=${s.summary.medium}`);
    console.log(`   Findings count: ${s.findings.length}`);
    for (const f of s.findings) {
      console.log(`     - [${f.severity.toUpperCase()}] ${f.cwe}: ${f.title} (Line ${f.lineStart})`);
    }
  } else {
    throw new Error(`Security scan failed: ${JSON.stringify(scanData)}`);
  }

  // 8. AI Assistant Chat API
  console.log("\n[Test 8] Testing Contextual AI Assistant (POST /api/assistant/chat)...");
  const chatRes = await fetch(`${BASE_URL}/api/assistant/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: sessionCookie },
    body: JSON.stringify({
      projectId: sampleProjectId,
      message: "Explain the security risk of string concatenation in database queries and give a safe parameterized query example.",
    }),
  });
  const chatData = await chatRes.json();
  if (chatRes.status === 200 && chatData.success) {
    console.log(`✅ AI Assistant replied successfully.`);
    console.log(`   Message ID: ${chatData.message.id}`);
    console.log(`   Response preview: ${chatData.message.content.slice(0, 120)}...`);
  } else {
    throw new Error(`AI assistant chat failed: ${JSON.stringify(chatData)}`);
  }

  // 9. Reports JSON Export
  console.log("\n[Test 9] Testing Reports JSON Export (GET /api/reports/export?format=json)...");
  const reportJsonRes = await fetch(`${BASE_URL}/api/reports/export?format=json`, {
    headers: { Cookie: sessionCookie },
  });
  const reportJsonData = await reportJsonRes.json();
  if (reportJsonRes.status === 200 && reportJsonData.platform) {
    console.log(`✅ JSON Report generated: Platform "${reportJsonData.platform}"`);
    console.log(`   Overall Health: ${reportJsonData.executiveSummary.averageHealthScore}`);
    console.log(`   Projects included: ${reportJsonData.monitoredProjects.length}`);
  } else {
    throw new Error(`Report JSON export failed: ${JSON.stringify(reportJsonData)}`);
  }

  // 10. Reports Markdown Export
  console.log("\n[Test 10] Testing Reports Markdown Export (GET /api/reports/export?format=markdown)...");
  const reportMdRes = await fetch(`${BASE_URL}/api/reports/export?format=markdown`, {
    headers: { Cookie: sessionCookie },
  });
  if (reportMdRes.status === 200) {
    const md = await reportMdRes.text();
    console.log(`✅ Markdown Report generated (${md.length} bytes). Starts with: ${md.slice(0, 40).replace(/\\n/g, ' ')}...`);
  } else {
    throw new Error(`Report Markdown export failed: HTTP ${reportMdRes.status}`);
  }

  console.log("\n=================================================");
  console.log("🎉 ALL 10 TESTS PASSED SUCCESSFULLY! 100% OPERATIONAL");
  console.log("=================================================\n");
}

run().catch((err) => {
  console.error("❌ Test suite failed:", err);
  process.exit(1);
});
