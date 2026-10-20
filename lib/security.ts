export interface RawSecurityFinding {
  severity: "critical" | "high" | "medium" | "low" | "info";
  category: "static" | "potential" | "informational";
  cwe: string;
  title: string;
  description: string;
  location: string;
  lineStart: number;
  lineEnd: number;
  risk: string;
  remediation: string;
}

export interface SecurityAuditResult {
  score: number;
  findings: RawSecurityFinding[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
    total: number;
  };
}

interface SecurityRule {
  id: string;
  cwe: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  category: "static" | "potential" | "informational";
  patterns: RegExp[];
  description: string;
  risk: string;
  remediation: string;
}

// Enterprise Static Security Rules (Semgrep & SAST equivalent patterns)
const SECURITY_RULES: SecurityRule[] = [
  // 1. SQL Injection (CWE-89)
  {
    id: "RULE-SQLI-001",
    cwe: "CWE-89",
    title: "SQL Injection via String Concatenation or Interpolation",
    severity: "critical",
    category: "static",
    patterns: [
      /(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE).*?(\+\s*[\w.]+|\`.*?\$[\w.]+.*?\`)/i,
      /\.rawQuery\(["'`].*?\$\{/i,
      /db\.query\(["'`].*?\+\s*[\w.]+/i,
      /execute\(["'].*?%s["']\s*%/i,
    ],
    description:
      "Direct string concatenation or template literal interpolation into a database query string allows attackers to manipulate SQL semantics.",
    risk: "Attackers can bypass authentication, read unauthorized database records, modify tables, or execute administrative commands.",
    remediation:
      "Use parameterized queries, prepared statements, or ORM parameter binding (e.g. Prisma `db.$queryRaw` with tagged template literals).",
  },

  // 2. Hardcoded Credentials & Secrets (CWE-798)
  {
    id: "RULE-SECRET-001",
    cwe: "CWE-798",
    title: "Hardcoded API Key, Secret Token, or Private Key",
    severity: "critical",
    category: "static",
    patterns: [
      new RegExp("sk_" + "live_[0-9a-zA-Z]{24,}"),
      new RegExp("AK" + "IA[0-9A-Z]{16}"),
      new RegExp("gh" + "p_[0-9a-zA-Z]{36}"),
      /-----BEGIN (RSA|EC|OPENSSH|PGP) PRIVATE KEY-----/,
      /(password|secret|apiKey|api_key)\s*[:=]\s*["'][a-zA-Z0-9_\-!@#$%^&*]{8,}["']/i,
    ],
    description:
      "Hardcoded secrets or private keys embedded directly in source code will be committed to version control and exposed to unauthorized parties.",
    risk: "Compromised credentials permit immediate unauthorized access to external cloud providers, payment gateways, and data stores.",
    remediation:
      "Extract the secret to an environment variable (`process.env.SECRET_KEY`) and immediately revoke and rotate the exposed credential.",
  },

  // 3. Cross-Site Scripting (CWE-79)
  {
    id: "RULE-XSS-001",
    cwe: "CWE-79",
    title: "Reflected or Stored Cross-Site Scripting (XSS)",
    severity: "high",
    category: "potential",
    patterns: [
      /dangerouslySetInnerHTML\s*=\s*\{\s*\{\s*__html\s*:\s*[\w.]+\s*\}\s*\}/,
      /\.innerHTML\s*=\s*[\w.]+/,
      /document\.write\(/,
      /res\.send\(.*?<.*?\$\{/i,
    ],
    description:
      "Rendering unsanitized user-controlled input directly into the browser DOM executes arbitrary script code within the victim's session.",
    risk: "Attacker can hijack active user sessions, exfiltrate cookies/tokens, or alter web content displayed to users.",
    remediation:
      "Avoid raw HTML insertion. Use DOMPurify before rendering HTML or use standard React text rendering which auto-escapes special characters.",
  },

  // 4. Command Injection (CWE-78)
  {
    id: "RULE-CMDI-001",
    cwe: "CWE-78",
    title: "OS Command Injection via Shell Execution",
    severity: "critical",
    category: "static",
    patterns: [
      /child_process\.(exec|execSync)\(.*?(\+|`.*?\$)/,
      /os\.system\(.*?(\+|%|f["'])/,
      /subprocess\.Popen\(.*?,.*shell\s*=\s*True/i,
    ],
    description:
      "Passing user input into shell commands without strict sanitization allows attackers to append and execute arbitrary system commands.",
    risk: "Complete remote server compromise, host filesystem deletion, or pivot into internal infrastructure networks.",
    remediation:
      "Use `execFile` or `spawn` with an array of arguments rather than executing through a shell, or avoid running system commands.",
  },

  // 5. Path Traversal (CWE-22)
  {
    id: "RULE-PATH-001",
    cwe: "CWE-22",
    title: "Path Traversal / Arbitrary File Read",
    severity: "medium",
    category: "potential",
    patterns: [
      /path\.join\(.*?req\.(query|params|body)[\w.]*\)/,
      /fs\.(readFile|readFileSync|createReadStream)\(.*?req\./,
      /open\(os\.path\.join\(.*?user_path\)/,
    ],
    description:
      "Joining user-supplied path components without verifying that the resolved path remains inside the target directory enables directory traversal (e.g. `../../etc/passwd`).",
    risk: "Attackers can read sensitive system files, configuration files, and private keys from the host filesystem.",
    remediation:
      "Normalize and verify that the target path begins with the allowed root directory using `path.resolve` and strict prefix checks.",
  },

  // 6. Insecure Cryptography & Deprecated Hashes (CWE-327)
  {
    id: "RULE-CRYPTO-001",
    cwe: "CWE-327",
    title: "Use of Weak or Broken Cryptographic Algorithm",
    severity: "low",
    category: "informational",
    patterns: [
      /crypto\.createHash\(["'](md5|sha1)["']\)/i,
      /hashlib\.(md5|sha1)\(/i,
      /DES|RC4|TripleDES/i,
    ],
    description:
      "MD5 and SHA-1 have known collision attacks and are broken for digital signatures and secure cryptographic hashing.",
    risk: "Collision attacks allow attackers to forge certificates or bypass integrity verification checks.",
    remediation:
      "Migrate to SHA-256 / SHA-512 for cryptographic checksums, and use Argon2id or bcrypt for password hashing.",
  },

  // 7. Server-Side Request Forgery (CWE-918)
  {
    id: "RULE-SSRF-001",
    cwe: "CWE-918",
    title: "Server-Side Request Forgery (SSRF) Risk",
    severity: "high",
    category: "potential",
    patterns: [
      /fetch\(\s*req\.(query|body|params)[\w.]*\s*\)/,
      /axios\.(get|post)\(\s*req\.(query|body|params)[\w.]*\s*\)/,
      /urllib\.request\.urlopen\(\s*[\w.]*\s*\)/,
    ],
    description:
      "Making HTTP requests to user-supplied URLs without an IP whitelist allows attackers to target internal cloud metadata services (e.g. `http://169.254.169.254`) or internal ports.",
    risk: "Leakage of cloud instance identity credentials and unauthorized access to internal microservices.",
    remediation:
      "Enforce an allowlist of domain names and block private RFC-1918 and loopback IP ranges before dispatching outbound requests.",
  },

  // 8. Missing Input Validation (CWE-20)
  {
    id: "RULE-VALIDATION-001",
    cwe: "CWE-20",
    title: "Missing Input Validation on Request Payload",
    severity: "low",
    category: "informational",
    patterns: [
      /req\.json\(\).*?;[\s\S]{1,100}(db\.query|db\.\w+\.create)/,
    ],
    description:
      "Request body is unpacked and forwarded to database operations without schema validation.",
    risk: "Malformed or oversized payloads can trigger unhandled runtime errors or mass assignment vulnerabilities.",
    remediation:
      "Validate all input objects with a schema validator like Zod, Joi, or Yup before invoking business logic.",
  },
];

export function runStaticSecurityAudit(code: string, fileName = "source"): SecurityAuditResult {
  const findings: RawSecurityFinding[] = [];
  const lines = code.split("\n");

  for (const rule of SECURITY_RULES) {
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const lineContent = lines[lineIndex];

      for (const pattern of rule.patterns) {
        if (pattern.test(lineContent)) {
          // Avoid duplicate findings on the same line for the same rule
          const alreadyFound = findings.some(
            (f) => f.cwe === rule.cwe && f.lineStart === lineIndex + 1
          );

          if (!alreadyFound) {
            findings.push({
              severity: rule.severity,
              category: rule.category,
              cwe: rule.cwe,
              title: rule.title,
              description: rule.description,
              location: `${fileName}:${lineIndex + 1}`,
              lineStart: lineIndex + 1,
              lineEnd: lineIndex + 1,
              risk: rule.risk,
              remediation: rule.remediation,
            });
          }
        }
      }
    }
  }

  // Calculate summary counts
  const summary = {
    critical: findings.filter((f) => f.severity === "critical").length,
    high: findings.filter((f) => f.severity === "high").length,
    medium: findings.filter((f) => f.severity === "medium").length,
    low: findings.filter((f) => f.severity === "low").length,
    info: findings.filter((f) => f.severity === "info").length,
    total: findings.length,
  };

  // Calculate Transparent Security Score (100 base - penalty points)
  let score = 100;
  score -= summary.critical * 30;
  score -= summary.high * 15;
  score -= summary.medium * 7;
  score -= summary.low * 2;
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    findings,
    summary,
  };
}
