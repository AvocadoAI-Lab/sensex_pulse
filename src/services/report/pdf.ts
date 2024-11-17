import type {Browser, Page} from 'puppeteer';
import puppeteer from 'puppeteer';
import {GroupSummary} from './summary';
import {ReportTemplateService} from './template';

export class ReportPdfService {
    // A4 size in pixels at 96 DPI
    private static readonly PAGE_WIDTH = 794;  // 210mm
    private static readonly PAGE_HEIGHT = 1123; // 297mm
    private static readonly PAGE_PADDING = 48;  // Padding inside pages
    private static readonly CONTENT_HEIGHT = 1123 - (48 * 2); // Available content height

    public static async generatePdf(summary: GroupSummary, outputPath: string): Promise<void> {
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

            // Generate the template
            const html = ReportTemplateService.generateTemplate(summary);

            // Add custom styles for PDF rendering
            const pdfStyles = `
                @page {
                    size: A4;
                    margin: 0;
                }
                body {
                    width: ${this.PAGE_WIDTH}px !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                .page {
                    width: ${this.PAGE_WIDTH}px;
                    min-height: ${this.PAGE_HEIGHT}px;
                    position: relative;
                    overflow: hidden;
                }
                .report-page {
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                }
                .cover-page {
                    background: #1e40af;
                }
                .page-content {
                    position: relative;
                    min-height: ${this.PAGE_HEIGHT}px;
                }
                @media print {
                    html, body {
                        width: ${this.PAGE_WIDTH}px !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .page {
                        page-break-after: always;
                        break-after: page;
                    }
                    .page:last-child {
                        page-break-after: avoid;
                        break-after: avoid;
                    }
                    .report-page {
                        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .cover-page {
                        background: #1e40af !important;
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
                        setTimeout(resolve, 1000);
                    }
                });
            });

            // Wait for any animations to complete
            await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));

            // Handle progressive page breaks and ensure full-height backgrounds
            await this.handlePageLayout(page);

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

    private static async handlePageLayout(page: Page): Promise<void> {
        await page.evaluate((pageHeight) => {
            function createNewPage(content: HTMLElement): HTMLElement {
                const newPage = document.createElement('div');
                newPage.className = 'page report-page';
                
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

            // Ensure all pages have full height background
            document.querySelectorAll('.page').forEach((page) => {
                const element = page as HTMLElement;
                element.style.minHeight = `${pageHeight}px`;
                if (element.classList.contains('report-page')) {
                    element.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
                } else if (element.classList.contains('cover-page')) {
                    element.style.background = '#1e40af';
                }
            });
        }, this.PAGE_HEIGHT);
    }
}
