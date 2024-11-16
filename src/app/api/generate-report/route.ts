import {NextRequest, NextResponse} from 'next/server';
import {Types3} from '@/types/wql';
import {ReportSummaryService} from '@/services/report/summary';
import {ReportPdfService} from '@/services/report/pdf';
import path from 'path';
import fs from 'fs/promises';

interface AgentResult {
    agent_name: string;
    data: Types3;
}

interface GroupResponse {
    group: string;
    results: AgentResult[];
}

interface GenerateReportRequest {
    group_name: string;
    wql_data: GroupResponse;
}

// New route segment config format
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes timeout

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as GenerateReportRequest;
        
        // Validate request body
        if (!body.group_name || !body.wql_data) {
            return NextResponse.json(
                { error: 'Missing required fields: group_name or wql_data' },
                { status: 400 }
            );
        }

        // Generate summary using the group response
        const summary = ReportSummaryService.generateGroupSummaryFromResponse(body.wql_data);

        // Create reports directory if it doesn't exist
        const reportsDir = path.join(process.cwd(), 'public', 'reports');
        await fs.mkdir(reportsDir, { recursive: true });

        // Generate unique filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${body.group_name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.pdf`;
        const outputPath = path.join(reportsDir, filename);

        // Generate PDF
        await ReportPdfService.generatePdf(summary, outputPath);

        // Return the URL to download the PDF
        const pdfUrl = `/reports/${filename}`;
        
        return NextResponse.json({
            success: true,
            url: pdfUrl,
            summary: {
                total_agents: summary.totalAgents,
                total_alerts: summary.totalAlerts,
                critical_vulnerabilities: summary.criticalVulnerabilities.length
            }
        });

    } catch (error) {
        console.error('Error generating report:', error);
        return NextResponse.json(
            { error: 'Failed to generate report' },
            { status: 500 }
        );
    }
}
