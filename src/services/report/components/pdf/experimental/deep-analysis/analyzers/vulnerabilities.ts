import type {Hit} from '@/types/wql';
import {VulnerabilityAnalysis} from "@/services/report/components/pdf/experimental/deep-analysis/types";

export const analyzeVulnerabilities = (alerts: Hit[]): VulnerabilityAnalysis => {
  const vulnsByCVSS = new Map<number, number>();
  const vulnsByPackage = new Map<string, {
    cves: Set<string>;
    maxCVSS: number;
    criticalVectors: Set<string>;
  }>();
  const recentVulns = new Set<string>();

  alerts.forEach(alert => {
    const vuln = alert._source.data?.vulnerability;
    if (vuln) {
      const cvss3 = vuln.cvss?.cvss3;
      const cvss2 = vuln.cvss?.cvss2;
      const cvssScore = parseFloat(cvss3?.base_score || cvss2?.base_score || '0');
      
      // Track CVSS scores
      const scoreRange = Math.floor(cvssScore);
      vulnsByCVSS.set(scoreRange, (vulnsByCVSS.get(scoreRange) || 0) + 1);

      // Enhanced package vulnerability tracking
      const pkg = `${vuln.package.name}@${vuln.package.version}`;
      const current = vulnsByPackage.get(pkg) || {
        cves: new Set<string>(),
        maxCVSS: 0,
        criticalVectors: new Set<string>()
      };
      
      current.cves.add(vuln.cve);
      current.maxCVSS = Math.max(current.maxCVSS, cvssScore);
      
      // Track critical attack vectors
      if (cvss3?.vector) {
        Object.entries(cvss3.vector).forEach(([key, value]) => {
          if (value === 'high' || value === 'critical') {
            current.criticalVectors.add(`${key}: ${value}`);
          }
        });
      }
      
      vulnsByPackage.set(pkg, current);

      // Track recent vulnerabilities (last 30 days)
      const publishDate = new Date(vuln.published);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (publishDate >= thirtyDaysAgo) {
        recentVulns.add(vuln.cve);
      }
    }
  });

  return {
    cvssDistribution: Array.from(vulnsByCVSS.entries())
      .sort((a, b) => a[0] - b[0]),
    criticalPackages: Array.from(vulnsByPackage.entries())
      .sort((a, b) => b[1].maxCVSS - a[1].maxCVSS)
      .slice(0, 5),
    recentVulnsCount: recentVulns.size,
  };
};
