export type SeverityLevel = "critical" | "high" | "medium" | "low" | "info";

export type FindingCategory = "static" | "potential" | "informational";

export interface Issue {
  id: string;
  severity: SeverityLevel;
  title: string;
  description: string;
  location: string;
  recommendation: string;
}

export interface SecurityFinding {
  id: string;
  severity: SeverityLevel;
  category: FindingCategory;
  cwe?: string;
  title: string;
  description: string;
  location: string;
  risk: string;
  remediation: string;
}

export interface CodeImprovement {
  id: string;
  category: "performance" | "readability" | "maintainability" | "refactor";
  title: string;
  description: string;
  diffSnippet?: string;
}

export interface AnalysisSummary {
  id: string;
  projectId: string;
  projectName: string;
  timestamp: string;
  codeQualityScore: number;
  securityScore: number;
  issuesCount: number;
  vulnerabilitiesCount: number;
  criticalCount: number;
  status: "completed" | "processing" | "failed";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  fileCount: number;
  healthScore: number;
  securityScore: number;
  lastAnalysis: string;
  issuesCount: number;
  vulnerabilitiesCount: number;
  repositoryUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  codeSnippets?: Array<{
    language: string;
    code: string;
  }>;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  badge?: string;
}
