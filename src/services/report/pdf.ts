import type {Browser, Page} from 'puppeteer';
import puppeteer from 'puppeteer';
import {GroupSummary} from './summary';
import {ReportTemplateService} from './template';

export class ReportPdfService {
    public static async generatePdf(summary: GroupSummary, outputPath: string): Promise<void> {
        const html = ReportTemplateService.generateTemplate(summary);
        
        const browser: Browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        try {
            const page = await browser.newPage();
            
            // Set viewport to A4 size (in pixels)
            await page.setViewport({
                width: 794, // A4 width at 96 DPI
                height: 1123, // A4 height at 96 DPI
                deviceScaleFactor: 2, // Higher resolution for better quality
            });

            // Set content and wait for all resources to load
            await page.setContent(html, {
                waitUntil: ['networkidle0', 'load', 'domcontentloaded']
            });

            // Wait for any charts or dynamic content to render
            await page.evaluate(() => new Promise(resolve => {
                // Add a small delay to ensure all content is properly rendered
                setTimeout(resolve, 1000);
            }));

            // Generate PDF with proper A4 format and styling
            await page.pdf({
                path: outputPath,
                format: 'A4',
                printBackground: true,
                preferCSSPageSize: true,
                margin: {
                    top: '0',
                    right: '0',
                    bottom: '0',
                    left: '0'
                },
                displayHeaderFooter: false,
            });

        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        } finally {
            await browser.close();
        }
    }

    private static async waitForChartsToRender(page: Page): Promise<void> {
        // Add any specific waiting logic for charts or dynamic content
        await page.evaluate(() => new Promise(resolve => {
            const checkForCharts = () => {
                // Check if all chart canvases are rendered
                const charts = document.querySelectorAll('canvas');
                const allChartsReady = Array.from(charts).every(canvas => {
                    const context = canvas.getContext('2d');
                    return context && context.getImageData(0, 0, 1, 1).data.some(channel => channel !== 0);
                });

                if (allChartsReady) {
                    resolve(undefined);
                } else {
                    setTimeout(checkForCharts, 100);
                }
            };

            checkForCharts();
        }));
    }
}
