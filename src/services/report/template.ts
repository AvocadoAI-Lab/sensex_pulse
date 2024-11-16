import {GroupSummary} from './summary';
import {generateHeader} from './components/header';
import {generateExecutiveSummary} from './components/executive-summary';
import {generateVulnerabilityAnalysis} from './components/vulnerability-analysis';
import {generateMitreAnalysis} from './components/mitre-analysis';

export class ReportTemplateService {
    private static generateStyles(): string {
        return `
        <style>
            @page {
                margin: 0;
                size: A4;
            }
            
            body {
                margin: 0;
                padding: 0;
                background-color: #f3f4f6;
                font-family: system-ui, -apple-system, sans-serif;
                line-height: 1.5;
                color: #1f2937;
            }

            .page-break {
                break-after: page;
            }

            /* Print-specific styles */
            @media print {
                body {
                    background-color: white;
                }

                .shadow-lg {
                    box-shadow: none !important;
                }

                .bg-gradient-to-r {
                    background: #1e40af !important;
                    -webkit-print-color-adjust: exact;
                }

                /* Ensure backgrounds print */
                * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
            }

            /* Tailwind-like utilities */
            .text-xs { font-size: 0.75rem; }
            .text-sm { font-size: 0.875rem; }
            .text-base { font-size: 1rem; }
            .text-lg { font-size: 1.125rem; }
            .text-xl { font-size: 1.25rem; }
            .text-2xl { font-size: 1.5rem; }
            .text-3xl { font-size: 1.875rem; }
            .text-4xl { font-size: 2.25rem; }

            .font-medium { font-weight: 500; }
            .font-semibold { font-weight: 600; }
            .font-bold { font-weight: 700; }

            .mb-1 { margin-bottom: 0.25rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mb-8 { margin-bottom: 2rem; }
            .mb-12 { margin-bottom: 3rem; }

            .mt-1 { margin-top: 0.25rem; }
            .mt-2 { margin-top: 0.5rem; }
            .mt-4 { margin-top: 1rem; }
            .mt-6 { margin-top: 1.5rem; }
            .mt-8 { margin-top: 2rem; }
            .mt-12 { margin-top: 3rem; }

            .p-4 { padding: 1rem; }
            .p-6 { padding: 1.5rem; }
            .p-8 { padding: 2rem; }
            .p-12 { padding: 3rem; }

            .rounded-lg { border-radius: 0.5rem; }
            .rounded-full { border-radius: 9999px; }

            .shadow-lg {
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                           0 4px 6px -2px rgba(0, 0, 0, 0.05);
            }

            /* Grid system */
            .grid { display: grid; }
            .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
            .gap-4 { gap: 1rem; }
            .gap-6 { gap: 1.5rem; }

            /* Flexbox utilities */
            .flex { display: flex; }
            .items-center { align-items: center; }
            .justify-between { justify-content: space-between; }
            .space-y-4 > * + * { margin-top: 1rem; }

            /* Colors */
            .bg-white { background-color: white; }
            .bg-gray-50 { background-color: #f9fafb; }
            .bg-gray-100 { background-color: #f3f4f6; }
            .text-gray-500 { color: #6b7280; }
            .text-gray-600 { color: #4b5563; }
            .text-gray-700 { color: #374151; }
            .text-gray-800 { color: #1f2937; }
            .text-gray-900 { color: #111827; }
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
            ${generateHeader(summary.groupName)}
            ${generateExecutiveSummary(summary)}
            ${generateVulnerabilityAnalysis(summary)}
            ${generateMitreAnalysis(summary)}
        </body>
        </html>`;
    }
}
