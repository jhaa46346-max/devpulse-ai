import { execSync } from "child_process";

// Ensure fallback environment variables for Vercel/CI builds
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}
if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = "devpulse_super_secret_session_encryption_key_min_32_characters";
}

console.log("==========================================");
console.log("🚀 Starting DevPulse AI Production Build");
console.log("==========================================");

console.log("\n[1/2] Generating Prisma client...");
try {
  execSync("npx prisma generate", { stdio: "inherit", env: process.env });
} catch (err) {
  console.error("Prisma generate error:", err);
  process.exit(1);
}

console.log("\n[2/2] Running Next.js build...");
try {
  execSync("npx next build", { stdio: "inherit", env: process.env });
} catch (err) {
  console.error("Next build error:", err);
  process.exit(1);
}

console.log("\n==========================================");
console.log("✅ DevPulse AI Build Completed Successfully!");
console.log("==========================================");
