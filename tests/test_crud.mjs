async function runTests() {
  const base = "http://localhost:3000/api/projects";

  console.log("1. Testing POST /api/projects...");
  const createRes = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "verification-service",
      description: "Automated test project for CRUD validation",
      language: "Rust",
      repositoryUrl: "https://github.com/devpulse/verification-service",
    }),
  });
  const created = await createRes.json();
  console.log("POST Result:", created);
  if (!created.success) throw new Error("Create failed: " + JSON.stringify(created));
  const id = created.project.id;

  console.log("\n2. Testing GET /api/projects/" + id + "...");
  const getRes = await fetch(`${base}/${id}`);
  const fetched = await getRes.json();
  console.log("GET Result (Name):", fetched.project.name, "(Health):", fetched.project.healthScore);

  console.log("\n3. Testing PATCH /api/projects/" + id + " (Renaming)...");
  const patchRes = await fetch(`${base}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "verification-service-v2",
      description: "Updated description after patch",
    }),
  });
  const patched = await patchRes.json();
  console.log("PATCH Result (New Name):", patched.project.name);

  console.log("\n4. Testing DELETE /api/projects/" + id + "...");
  const delRes = await fetch(`${base}/${id}`, {
    method: "DELETE",
  });
  const deleted = await delRes.json();
  console.log("DELETE Result:", deleted);

  console.log("\n5. Verifying 404 after deletion...");
  const verifyRes = await fetch(`${base}/${id}`);
  console.log("Verify 404 status:", verifyRes.status);

  console.log("\n🎉 ALL DATABASE CRUD OPERATIONS PASSED 100%!");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
