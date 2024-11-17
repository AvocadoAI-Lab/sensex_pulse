import {GroupSummary} from './summary';
import {generateHeader} from './components/header';
import {generateExecutiveSummary} from './components/executive-summary';
import {generateVulnerabilityAnalysis} from './components/vulnerability-analysis';
import {generateMitreAnalysis} from './components/mitre-analysis';
import {generateAgentDetails} from './components/agent-details';

export class ReportTemplateService {
    private static generateStyles(): string {
        return `
        <style>
            /* Reset and base styles */
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            @page {
                size: A4;
                margin: 0;
            }
            
            html, body {
                width: 794px !important;
                margin: 0 !important;
                padding: 0 !important;
                font-family: system-ui, -apple-system, sans-serif;
                line-height: 1.5;
                color: #1f2937;
                background-color: white;
            }

            /* Page container */
            .page {
                width: 794px;
                min-height: 1123px;
                position: relative;
                background-color: white;
            }

            /* Content sections */
            .content-section {
                break-inside: avoid;
                page-break-inside: avoid;
                margin-bottom: 24px;
            }

            /* Individual items */
            .alert-item, .rule-item, .metric-item {
                break-inside: avoid;
                page-break-inside: avoid;
            }

            /* Container styles */
            .alert-container, .rule-container {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            /* Content container */
            .content {
                padding: 48px;
            }

            /* Print-specific styles */
            @media print {
                body {
                    background-color: white;
                }

                * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }

                /* Ensure backgrounds print */
                .bg-gradient-to-br,
                .bg-gradient-to-r {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
            }

            /* Table styles */
            table {
                width: 100%;
                border-collapse: collapse;
                table-layout: fixed;
                break-inside: avoid;
                page-break-inside: avoid;
            }

            th, td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #e5e7eb;
            }

            th {
                font-weight: 600;
                background-color: #f9fafb;
            }

            /* Progress bars */
            .progress-bar {
                height: 8px;
                border-radius: 4px;
                background-color: #e5e7eb;
                overflow: hidden;
            }

            .progress-bar-fill {
                height: 100%;
                border-radius: 4px;
                transition: width 0.5s ease;
            }

            /* Section spacing */
            .section + .section {
                margin-top: 48px;
            }

            /* Ensure headings don't break from their content */
            h1, h2, h3, h4, h5, h6 {
                break-after: avoid;
                page-break-after: avoid;
            }

            /* Cover page specific styles */
            .cover-page {
                height: 1123px;
                break-after: page;
                page-break-after: always;
            }

            /* Agent header styles */
            .agent-header {
                break-after: avoid;
                page-break-after: avoid;
            }

            /* Metrics grid */
            .agent-metrics {
                break-inside: avoid;
                page-break-inside: avoid;
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 24px;
                margin-bottom: 48px;
            }
        </style>`;
    }

    public static generateTemplate(summary: GroupSummary): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${summary.groupName} Security Report</title>
            ${this.generateStyles()}
        </head>
        <body>
            <!-- Cover Page -->
            <div class="page cover-page">
                ${generateHeader(summary.groupName)}
            </div>

            <!-- Executive Summary -->
            <div class="page">
                ${generateExecutiveSummary(summary)}
            </div>

            <!-- Vulnerability Analysis -->
            <div class="page">
                ${generateVulnerabilityAnalysis(summary)}
            </div>

            <!-- MITRE Analysis -->
            <div class="page">
                ${generateMitreAnalysis(summary)}
            </div>

            <!-- Agent Details -->
            ${summary.agentSummaries.map(agent => `
                <!-- Agent: ${agent.name} -->
                ${generateAgentDetails(agent)}
            `).join('\n')}

            <!-- Table of Contents -->
            <div class="page">
                <div class="content-section" style="padding: 48px; background: white;">
                    <div style="max-width: 800px; margin: 0 auto;">
                        <h2 style="font-size: 32px; font-weight: 700; color: #1f2937; margin-bottom: 48px;">
                            Table of Contents
                        </h2>
                        <div style="display: flex; flex-direction: column; gap: 16px;">
                            <div style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 16px;
                                background: #f9fafb;
                                border-radius: 8px;
                            ">
                                <span style="font-size: 16px; font-weight: 500; color: #111827;">Executive Summary</span>
                                <span style="color: #6b7280;">Page 2</span>
                            </div>
                            <div style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 16px;
                                background: #f9fafb;
                                border-radius: 8px;
                            ">
                                <span style="font-size: 16px; font-weight: 500; color: #111827;">Vulnerability Analysis</span>
                                <span style="color: #6b7280;">Page 3</span>
                            </div>
                            <div style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 16px;
                                background: #f9fafb;
                                border-radius: 8px;
                            ">
                                <span style="font-size: 16px; font-weight: 500; color: #111827;">MITRE ATT&CK Analysis</span>
                                <span style="color: #6b7280;">Page 4</span>
                            </div>
                            <div class="section" style="margin-top: 24px;">
                                <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 16px;">
                                    Agent Details
                                </h3>
                                ${summary.agentSummaries.map((agent, index) => `
                                <div style="
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    padding: 16px;
                                    background: #f9fafb;
                                    border-radius: 8px;
                                    margin-bottom: 8px;
                                ">
                                    <span style="font-size: 16px; font-weight: 500; color: #111827;">
                                        ${agent.name}
                                    </span>
                                    <span style="color: #6b7280;">Page ${5 + index}</span>
                                </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>`;
    }
}
