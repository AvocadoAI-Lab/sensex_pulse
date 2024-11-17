import {GroupSummary} from './summary';
import {generateExecutiveSummary} from './components/executive-summary';
import {generateVulnerabilityAnalysis} from './components/vulnerability-analysis';
import {generateMitreAnalysis} from './components/mitre-analysis';
import {generateAgentDetails} from './components/agent-details';
import fs from 'fs';
import path from 'path';

export class ReportTemplateService {
    private static getReportStyles(): string {
        const cssPath = path.join(process.cwd(), 'src/services/report/styles/report.css');
        const css = fs.readFileSync(cssPath, 'utf8');
        return `<style>${css}</style>`;
    }

    private static generateBackToTocButton(): string {
        return `
        <a href="#table-of-contents" class="back-to-toc">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
        </a>`;
    }

    private static generateCoverPage(): string {
        return `
        <div class="logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e40af" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        </div>
        <div>
            <h1>Security Analysis Report</h1>
            <h2>Comprehensive Security Assessment</h2>
            <div class="analysis-cards">
                <div class="analysis-card">
                    <div class="icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    </div>
                    <h3>Threat Analysis</h3>
                    <p>Comprehensive security assessment and risk evaluation</p>
                </div>
                <div class="analysis-card">
                    <div class="icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                    </div>
                    <h3>Impact Analysis</h3>
                    <p>Detailed evaluation of security incidents and vulnerabilities</p>
                </div>
                <div class="analysis-card">
                    <div class="icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                    </div>
                    <h3>Recommendations</h3>
                    <p>Actionable insights and security improvement strategies</p>
                </div>
            </div>
        </div>
        <div class="footer">
            <div>Generated on<br>${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            <div>Powered by<br>Sensex Analytics</div>
        </div>`;
    }

    public static generateTemplate(summary: GroupSummary): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${summary.groupName} Security Report</title>
            ${this.getReportStyles()}
        </head>
        <body>
            <!-- Cover Page -->
            <div class="page cover-page">
                ${this.generateCoverPage()}
            </div>

            <!-- Table of Contents -->
            <div id="table-of-contents" class="page">
                <div class="page-content">
                    <div class="toc-container">
                        <h2 class="toc-header">Table of Contents</h2>
                        <div class="toc-section">
                            <div class="toc-item">
                                <a href="#executive-summary">
                                    <span>Executive Summary</span>
                                    <span class="page-number">3</span>
                                </a>
                            </div>
                            <div class="toc-item">
                                <a href="#vulnerability-analysis">
                                    <span>Vulnerability Analysis</span>
                                    <span class="page-number">4</span>
                                </a>
                            </div>
                            <div class="toc-item">
                                <a href="#mitre-analysis">
                                    <span>MITRE ATT&CK Analysis</span>
                                    <span class="page-number">5</span>
                                </a>
                            </div>
                        </div>
                        <div class="toc-section">
                            <h3>Agent Details</h3>
                            ${summary.agentSummaries.map((agent, index) => `
                            <div class="toc-item">
                                <a href="#agent-${index}">
                                    <span>${agent.name}</span>
                                    <span class="page-number">${6 + index}</span>
                                </a>
                            </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Executive Summary -->
            <div id="executive-summary" class="page">
                <div class="page-content">
                    <div class="content-wrapper">
                        ${generateExecutiveSummary(summary)}
                    </div>
                </div>
                ${this.generateBackToTocButton()}
            </div>

            <!-- Vulnerability Analysis -->
            <div id="vulnerability-analysis" class="page">
                <div class="page-content">
                    <div class="content-wrapper">
                        ${generateVulnerabilityAnalysis(summary)}
                    </div>
                </div>
                ${this.generateBackToTocButton()}
            </div>

            <!-- MITRE Analysis -->
            <div id="mitre-analysis" class="page">
                <div class="page-content">
                    <div class="content-wrapper">
                        ${generateMitreAnalysis(summary)}
                    </div>
                </div>
                ${this.generateBackToTocButton()}
            </div>

            <!-- Agent Details -->
            ${summary.agentSummaries.map((agent, index) => `
                <!-- Agent: ${agent.name} -->
                <div id="agent-${index}" class="page new-agent-page">
                    <div class="page-content">
                        ${generateAgentDetails(agent)}
                    </div>
                    ${this.generateBackToTocButton()}
                </div>
            `).join('\n')}
        </body>
        </html>`;
    }
}
