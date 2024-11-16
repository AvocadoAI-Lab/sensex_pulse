import type {Browser, Page} from 'puppeteer';
import puppeteer from 'puppeteer';
import {GroupSummary} from './summary';
import {ReportTemplateService} from './template';

export class ReportPdfService {
    // A4 size in pixels at 96 DPI
    private static readonly PAGE_WIDTH = 794;  // 210mm
    private static readonly PAGE_HEIGHT = 1123; // 297mm

    public static async generatePdf(summary: GroupSummary, outputPath: string): Promise<void> {
        const html = ReportTemplateService.generateTemplate(summary);
        
        const browser: Browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                `--window-size=${this.PAGE_WIDTH},${this.PAGE_HEIGHT}`,
                '--font-render-hinting=none'
            ]
        });
        
        try {
            const page = await browser.newPage();
            
            // Set viewport to A4 size
            await page.setViewport({
                width: this.PAGE_WIDTH,
                height: this.PAGE_HEIGHT,
                deviceScaleFactor: 2, // Higher resolution
                isLandscape: false
            });

            // Add custom styles for PDF rendering
            const pdfStyles = `
                @page {
                    size: A4;
                    margin: 0;
                }
                body {
                    width: ${this.PAGE_WIDTH}px !important;
                    height: ${this.PAGE_HEIGHT}px !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                .page {
                    width: ${this.PAGE_WIDTH}px;
                    height: ${this.PAGE_HEIGHT}px;
                    page-break-after: always;
                    position: relative;
                    overflow: hidden;
                }
                .page:last-child {
                    page-break-after: avoid;
                }
                @media print {
                    html, body {
                        width: ${this.PAGE_WIDTH}px !important;
                        height: ${this.PAGE_HEIGHT}px !important;
                    }
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `;

            // Set content with custom styles
            await page.setContent(html);
            await page.addStyleTag({ content: pdfStyles });

            // Wait for fonts to load
            await page.evaluate(() => {
                return new Promise<void>((resolve) => {
                    if (document.fonts && document.fonts.ready) {
                        document.fonts.ready.then(() => resolve());
                    } else {
                        // If document.fonts is not supported, wait a bit and resolve
                        setTimeout(resolve, 1000);
                    }
                });
            });

            // Wait for any animations to complete
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));

            // Ensure correct layout
            await this.ensureCorrectLayout(page);

            // Generate PDF with specific settings
            await page.pdf({
                path: outputPath,
                format: 'A4',
                printBackground: true,
                preferCSSPageSize: true,
                displayHeaderFooter: false,
                margin: {
                    top: '0',
                    right: '0',
                    bottom: '0',
                    left: '0'
                },
                scale: 1,
                timeout: 30000,
            });

        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        } finally {
            await browser.close();
        }
    }

    private static async ensureCorrectLayout(page: Page): Promise<void> {
        await page.evaluate(() => {
            // Fix any layout issues
            document.querySelectorAll('.page').forEach((pageElement) => {
                const element = pageElement as HTMLElement;
                // Ensure each page has correct dimensions
                element.style.width = '794px';
                element.style.height = '1123px';
                element.style.overflow = 'hidden';
                element.style.position = 'relative';
                element.style.pageBreakAfter = 'always';
            });

            // Fix table layouts
            document.querySelectorAll('table').forEach((table) => {
                table.style.tableLayout = 'fixed';
                table.style.width = '100%';
            });

            // Ensure images don't overflow
            document.querySelectorAll('img').forEach((img) => {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            });

            // Fix flex layouts
            document.querySelectorAll('.flex').forEach((flex) => {
                const element = flex as HTMLElement;
                element.style.display = 'flex';
                element.style.flexWrap = 'wrap';
            });

            // Fix grid layouts
            document.querySelectorAll('.grid').forEach((grid) => {
                const element = grid as HTMLElement;
                element.style.display = 'grid';
                element.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
            });

            // Ensure proper text wrapping
            document.querySelectorAll('p, h1, h2, h3, h4, h5, h6').forEach((text) => {
                const element = text as HTMLElement;
                element.style.wordWrap = 'break-word';
                element.style.overflowWrap = 'break-word';
            });

            // Fix SVG rendering
            document.querySelectorAll('svg').forEach((svg) => {
                svg.style.overflow = 'visible';
            });

            // Ensure proper chart rendering
            document.querySelectorAll('[data-chart]').forEach((chart) => {
                const element = chart as HTMLElement;
                element.style.width = '100%';
                element.style.maxHeight = '300px';
            });
        });
    }
}
