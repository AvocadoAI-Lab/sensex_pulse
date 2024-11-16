import puppeteer from 'puppeteer';
import {GroupSummary} from './summary';
import {ReportTemplateService} from './template';

export class ReportPdfService {
    public static async generatePdf(summary: GroupSummary, outputPath: string): Promise<void> {
        const html = ReportTemplateService.generateTemplate(summary);
        
        const browser = await puppeteer.launch({
            headless: true
        });
        
        try {
            const page = await browser.newPage();
            
            // Set viewport to A4 size
            await page.setViewport({
                width: 1240,
                height: 1754,
                deviceScaleFactor: 1
            });

            // Set content and wait for network idle to ensure all resources are loaded
            await page.setContent(html, {
                waitUntil: 'networkidle0'
            });

            // Generate PDF with A4 format
            await page.pdf({
                path: outputPath,
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20px',
                    right: '20px',
                    bottom: '20px',
                    left: '20px'
                }
            });
        } finally {
            await browser.close();
        }
    }
}
