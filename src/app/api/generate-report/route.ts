import {NextRequest, NextResponse} from 'next/server';
import type {WQL_result} from '@/types/wql';
import {ReportSummaryService} from '@/services/report/summary';
import {ReportPdfRenderer} from '@/services/report/pdf-renderer';

interface AgentResult {
    agent_name: string;
    data: WQL_result;
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

        // Generate unique filename for reference
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${body.group_name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.pdf`;

        // Generate PDF data in memory
        const pdfData = await ReportPdfRenderer.generatePdfBuffer(summary);

        // Convert PDF buffer to base64
        const pdfBase64 = pdfData.toString('base64');
        
        return NextResponse.json({
            success: true,
            filename: filename,
            pdf_data: pdfBase64,
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
