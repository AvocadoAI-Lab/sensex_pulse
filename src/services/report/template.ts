import {GroupSummary} from './summary';
import {generateHeader} from './components/header';
import {generateExecutiveSummary} from './components/executive-summary';
import {generateVulnerabilityAnalysis} from './components/vulnerability-analysis';
import {generateMitreAnalysis} from './components/mitre-analysis';

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
                height: 1123px;
                overflow: hidden;
                position: relative;
                page-break-after: always;
                background-color: white;
            }

            .page:last-child {
                page-break-after: avoid;
            }

            /* Content container */
            .content {
                padding: 48px;
                height: 100%;
            }

            /* Grid system */
            .grid {
                display: grid;
                grid-template-columns: repeat(12, 1fr);
                gap: 24px;
            }

            .col-span-3 { grid-column: span 3; }
            .col-span-4 { grid-column: span 4; }
            .col-span-6 { grid-column: span 6; }
            .col-span-8 { grid-column: span 8; }
            .col-span-12 { grid-column: span 12; }

            /* Card styles */
            .card {
                background: white;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                overflow: hidden;
            }

            /* Typography */
            h1 { font-size: 32px; font-weight: 700; margin-bottom: 24px; }
            h2 { font-size: 24px; font-weight: 600; margin-bottom: 20px; }
            h3 { font-size: 20px; font-weight: 600; margin-bottom: 16px; }
            h4 { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
            p { font-size: 14px; margin-bottom: 12px; }

            /* Tables */
            table {
                width: 100%;
                border-collapse: collapse;
                table-layout: fixed;
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

            /* Charts and visualizations */
            .chart-container {
                width: 100%;
                height: 300px;
                position: relative;
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

            /* Print-specific styles */
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }

                .page {
                    break-after: page;
                }

                .no-break {
                    break-inside: avoid;
                }

                .card {
                    box-shadow: none;
                    border: 1px solid #e5e7eb;
                }
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
            <div class="page">
                ${generateHeader(summary.groupName)}
            </div>

            <!-- Executive Summary -->
            <div class="page">
                <div class="content">
                    ${generateExecutiveSummary(summary)}
                </div>
            </div>

            <!-- Vulnerability Analysis -->
            <div class="page">
                <div class="content">
                    ${generateVulnerabilityAnalysis(summary)}
                </div>
            </div>

            <!-- MITRE Analysis -->
            <div class="page">
                <div class="content">
                    ${generateMitreAnalysis(summary)}
                </div>
            </div>
        </body>
        </html>`;
    }
}
