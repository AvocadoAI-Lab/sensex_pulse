// We need Hit type for documentation purposes even though it's not directly used
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export interface WindowsAnalysis {
  eventTypes: [string, number][];
  criticalServices: [string, number][];
  authFailures: [string, {
    count: number;
    lastAttempt: string;
    workstation?: string;
  }][];
  suspiciousProcesses: [string, {
    count: number;
    paths: Set<string>;
  }][];
}

export interface VulnerabilityAnalysis {
  cvssDistribution: [number, number][];
  criticalPackages: [string, {
    cves: Set<string>;
    maxCVSS: number;
    criticalVectors: Set<string>;
  }][];
  recentVulnsCount: number;
}

export interface RuleAnalysis {
  topGroups: {
    group: string;
    count: number;
    uniqueLevels: number;
    mitreCoverage: number;
  }[];
  topRules: [string, {
    count: number;
    description: string;
    level: number;
    groups: string[];
    compliance: string[];
  }][];
}

export interface DeepAnalysisData {
  windowsAnalysis: WindowsAnalysis;
  vulnAnalysis: VulnerabilityAnalysis;
  ruleAnalysis: RuleAnalysis;
}
