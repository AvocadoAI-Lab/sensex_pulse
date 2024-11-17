import type {Browser, Page} from 'puppeteer';
import puppeteer from 'puppeteer';
import {GroupSummary} from './summary';
import {ReportTemplateService} from './template';

export class ReportPdfService {
    // A4 dimensions in mm
    private static readonly PAGE_WIDTH_MM = 210;
    private static readonly PAGE_HEIGHT_MM = 297;
    
    // Convert mm to pixels at 300 DPI (300 pixels per inch, 1 inch = 25.4mm)
    private static readonly DPI = 300;
    private static readonly MM_TO_PIXELS = this.DPI / 25.4;
    private static readonly PAGE_WIDTH = Math.round(this.PAGE_WIDTH_MM * this.MM_TO_PIXELS);  // 2480 pixels
    private static readonly PAGE_HEIGHT = Math.round(this.PAGE_HEIGHT_MM * this.MM_TO_PIXELS); // 3508 pixels

    public static async generatePdf(summary: GroupSummary, outputPath: string): Promise<void> {
        const browser: Browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                `--window-size=${this.PAGE_WIDTH},${this.PAGE_HEIGHT}`,
                '--font-render-hinting=medium',
                '--disable-gpu',
                '--force-device-scale-factor'
            ]
        });
        
        try {
            const page = await browser.newPage();
            
            // Set viewport to A4 size at 300 DPI
            await page.setViewport({
                width: this.PAGE_WIDTH,
                height: this.PAGE_HEIGHT,
                deviceScaleFactor: 3.125, // For 300 DPI (96 * 3.125 = 300)
                isLandscape: false
            });

            // Generate the template
            const html = ReportTemplateService.generateTemplate(summary);

            // Add custom styles for PDF rendering
            const pdfStyles = `
                @page {
                    size: A4;
                    margin: 0;
                }
                html {
                    width: 210mm !important;
                    height: 297mm !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                body {
                    width: 210mm !important;
                    min-height: 297mm !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    -webkit-font-smoothing: antialiased !important;
                    -moz-osx-font-smoothing: grayscale !important;
                    text-rendering: optimizeLegibility !important;
                }
                .page {
                    width: 210mm;
                    min-height: 297mm;
                    position: relative;
                    overflow: hidden;
                    page-break-after: always;
                    break-after: page;
                }
                .page:last-child {
                    page-break-after: avoid;
                    break-after: avoid;
                }
                .cover-page {
                    background: #1e40af !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                @media print {
                    html, body {
                        width: 210mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    body {
                        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
                    }
                    .cover-page {
                        background: #1e40af !important;
                    }
                    img, svg {
                        image-rendering: high-quality;
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
                        setTimeout(resolve, 1000);
                    }
                });
            });

            // Wait for any animations to complete
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));

            // Handle progressive page breaks
            await this.handlePageLayout(page);

            // Generate PDF with enhanced settings for 300 DPI
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
                timeout: 60000, // Increased timeout for high-quality rendering
                omitBackground: false,
                landscape: false,
                pageRanges: '', // All pages
                width: '210mm',
                height: '297mm',
                tagged: true // Enable PDF tagging for accessibility
            });

        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        } finally {
            await browser.close();
        }
    }

    private static async handlePageLayout(page: Page): Promise<void> {
        await page.evaluate((pageHeight) => {
            function createNewPage(content: HTMLElement): HTMLElement {
                const newPage = document.createElement('div');
                newPage.className = 'page';
                
                const pageContent = document.createElement('div');
                pageContent.className = 'page-content';
                
                const container = document.createElement('div');
                container.className = 'content-wrapper';
                
                pageContent.appendChild(container);
                newPage.appendChild(pageContent);
                content.parentElement?.insertBefore(newPage, content.nextSibling);
                return container;
            }

            function handleContainer(container: HTMLElement, items: NodeListOf<Element>) {
                let currentPage = container;
                let lastBottom = 0;

                items.forEach((item) => {
                    const itemRect = (item as HTMLElement).getBoundingClientRect();
                    const itemHeight = itemRect.height;
                    const itemTop = itemRect.top;
                    
                    // If this item would overflow the page
                    if (lastBottom > 0 && (itemTop + itemHeight - lastBottom) > pageHeight) {
                        // Create a new page and move this and subsequent items to it
                        currentPage = createNewPage(currentPage);
                        currentPage.appendChild(item);
                        lastBottom = itemTop + itemHeight;
                    } else {
                        lastBottom = itemTop + itemHeight;
                    }
                });
            }

            // Ensure each agent starts on a new page
            document.querySelectorAll('.new-agent-page').forEach((agentPage) => {
                const element = agentPage as HTMLElement;
                element.style.breakBefore = 'page';
                element.style.pageBreakBefore = 'always';
            });

            // Handle alert items within each agent page
            document.querySelectorAll('.alert-container').forEach(container => {
                const items = container.querySelectorAll('.alert-item');
                handleContainer(container as HTMLElement, items);
            });

            // Handle rule items within each agent page
            document.querySelectorAll('.rule-container').forEach(container => {
                const items = container.querySelectorAll('.rule-item');
                handleContainer(container as HTMLElement, items);
            });

            // Handle metric items within each agent page
            document.querySelectorAll('.content-section').forEach(section => {
                const items = section.querySelectorAll('.metric-item');
                if (items.length > 0) {
                    handleContainer(section as HTMLElement, items);
                }
            });

            // Ensure all pages have proper height
            document.querySelectorAll('.page').forEach((page) => {
                const element = page as HTMLElement;
                element.style.minHeight = '297mm';
            });
        }, this.PAGE_HEIGHT);
    }
}
