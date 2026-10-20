async function runAuthTests() {
  const base = "http://localhost:3000";

  console.log("1. Testing POST /api/auth/signup (New User)...");
  const randomSuffix = Math.floor(Math.random() * 10000);
  const testEmail = `engineer_${randomSuffix}@devpulse.ai`;
  const testPassword = "ComplexPassword2026!";

  const signupRes = await fetch(`${base}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test Engineer",
      email: testEmail,
      password: testPassword,
    }),
  });

  const signupData = await signupRes.json();
  console.log("Signup Response Status:", signupRes.status);
  console.log("Signup Response Body:", signupData);
  if (!signupData.success) throw new Error("Signup failed: " + JSON.stringify(signupData));

  // Extract set-cookie header
  const setCookie = signupRes.headers.get("set-cookie");
  console.log("Received Set-Cookie on Signup:", !!setCookie);

  console.log("\n2. Testing Duplicate Signup Prevention...");
  const dupRes = await fetch(`${base}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Duplicate User",
      email: testEmail,
      password: testPassword,
    }),
  });
  console.log("Duplicate Signup Status (Expected 409):", dupRes.status);
  if (dupRes.status !== 409) throw new Error("Expected 409 on duplicate signup, got " + dupRes.status);

  console.log("\n3. Testing Login with Wrong Password...");
  const wrongLoginRes = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      password: "WrongPassword123!",
    }),
  });
  console.log("Wrong Password Status (Expected 401):", wrongLoginRes.status);
  if (wrongLoginRes.status !== 401) throw new Error("Expected 401, got " + wrongLoginRes.status);

  console.log("\n4. Testing Login with Correct Password (Seeded default user)...");
  const loginRes = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "developer@devpulse.ai",
      password: "DevPulse2026!",
    }),
  });
  const loginData = await loginRes.json();
  console.log("Login Status (Expected 200):", loginRes.status);
  console.log("Logged In User:", loginData.user.name, `(${loginData.user.email})`);
  if (!loginData.success) throw new Error("Login failed: " + JSON.stringify(loginData));

  const authCookie = loginRes.headers.get("set-cookie");
  console.log("Received Session Cookie:", !!authCookie);

  console.log("\n5. Testing GET /api/auth/me with Session Cookie...");
  const meRes = await fetch(`${base}/api/auth/me`, {
    headers: {
      Cookie: authCookie || "",
    },
  });
  const meData = await meRes.json();
  console.log("/api/auth/me Status:", meRes.status);
  console.log("Current Authenticated User:", meData.user?.email);
  if (!meData.success || meData.user?.email !== "developer@devpulse.ai") {
    throw new Error("Failed to verify authenticated session");
  }

  console.log("\n6. Testing POST /api/auth/logout...");
  const logoutRes = await fetch(`${base}/api/auth/logout`, {
    method: "POST",
    headers: {
      Cookie: authCookie || "",
    },
  });
  console.log("Logout Status:", logoutRes.status);

  console.log("\n7. Testing Protected Route Middleware (/dashboard without cookie)...");
  const dashRes = await fetch(`${base}/dashboard`, {
    redirect: "manual",
  });
  console.log("Dashboard response status (Expected 307 Redirect):", dashRes.status);
  const locationHeader = dashRes.headers.get("location");
  console.log("Redirect destination:", locationHeader);
  if (dashRes.status !== 307 || !locationHeader?.includes("/login")) {
    throw new Error("Expected redirect to /login for unauthenticated request, got " + dashRes.status);
  }

  console.log("\n🎉 ALL AUTHENTICATION TESTS PASSED 100%!");
}

runAuthTests().catch((err) => {
  console.error("Auth test failed:", err);
  process.exit(1);
});
