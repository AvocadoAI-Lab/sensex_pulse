import type {Browser, Page} from 'puppeteer';
import puppeteer from 'puppeteer';
import {GroupSummary} from './summary';
import {ReportTemplateService} from './template';

export class ReportPdfService {
    private static readonly PAGE_WIDTH_MM = 210;
    private static readonly PAGE_HEIGHT_MM = 297;
    private static readonly DPI = 300;
    private static readonly MM_TO_PIXELS = this.DPI / 25.4;
    private static readonly PAGE_WIDTH = Math.round(this.PAGE_WIDTH_MM * this.MM_TO_PIXELS);
    private static readonly PAGE_HEIGHT = Math.round(this.PAGE_HEIGHT_MM * this.MM_TO_PIXELS);
    private static readonly CONTENT_HEIGHT_MM = 277; // 保留 20mm 邊距

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
            await page.setViewport({
                width: this.PAGE_WIDTH,
                height: this.PAGE_HEIGHT,
                deviceScaleFactor: 3.125,
                isLandscape: false
            });

            const html = ReportTemplateService.generateTemplate(summary);
            const pdfStyles = `
                @page {
                    size: A4;
                    margin: 0;
                }
                html, body {
                    width: 210mm !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                .page {
                    width: 210mm;
                    min-height: 297mm;
                    padding: 10mm;
                    position: relative;
                    page-break-after: always;
                    break-after: page;
                }
                .page:last-child {
                    page-break-after: avoid;
                    break-after: avoid;
                }
                .page-content {
                    max-height: ${this.CONTENT_HEIGHT_MM}mm;
                    overflow: hidden;
                }
                .cover-page {
                    background: #1e40af !important;
                    padding: 0 !important;
                }
                @media print {
                    html, body {
                        width: 210mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .page {
                        break-after: page;
                    }
                }
            `;

            await page.setContent(html);
            await page.addStyleTag({ content: pdfStyles });

            await page.evaluate(() => {
                return new Promise<void>((resolve) => {
                    if (document.fonts && document.fonts.ready) {
                        document.fonts.ready.then(() => resolve());
                    } else {
                        setTimeout(resolve, 1000);
                    }
                });
            });

            await this.handlePageLayout(page);

            await page.pdf({
                path: outputPath,
                format: 'A4',
                printBackground: true,
                preferCSSPageSize: true,
                displayHeaderFooter: false,
                margin: {
                    top: '10mm',
                    right: '10mm',
                    bottom: '10mm',
                    left: '10mm'
                },
                scale: 1,
                timeout: 60000,
                omitBackground: false,
                landscape: false,
                pageRanges: '',
                width: '210mm',
                height: '297mm',
                tagged: true
            });

        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        } finally {
            await browser.close();
        }
    }

    private static async handlePageLayout(page: Page): Promise<void> {
        await page.evaluate(() => {
            const contentHeight = 277 * 3.779527559; // 277mm in pixels at 96 DPI

            function createNewPage(element: Element): HTMLElement {
                const newPage = document.createElement('div');
                newPage.className = 'page';
                const pageContent = document.createElement('div');
                pageContent.className = 'page-content';
                newPage.appendChild(pageContent);
                element.parentElement?.insertBefore(newPage, element.nextSibling);
                return pageContent;
            }

            function processContent(container: Element) {
                let currentHeight = 0;
                let currentContainer = container;

                Array.from(container.children).forEach((child) => {
                    const element = child as HTMLElement;
                    const elementHeight = element.offsetHeight;

                    if (currentHeight + elementHeight > contentHeight) {
                        // Create new page and move content
                        currentContainer = createNewPage(currentContainer);
                        currentContainer.appendChild(element);
                        currentHeight = elementHeight;
                    } else {
                        currentHeight += elementHeight;
                    }
                });
            }

            // Process each major section
            document.querySelectorAll('.report-page').forEach(section => {
                processContent(section);
            });

            // Ensure each agent starts on a new page
            document.querySelectorAll('[id^="agent-"]').forEach(agentSection => {
                const prevElement = agentSection.previousElementSibling;
                if (prevElement && !prevElement.classList.contains('page')) {
                    const pageContent = createNewPage(agentSection);
                    pageContent.appendChild(agentSection);
                }
            });

            // Process individual components within each page
            document.querySelectorAll('.page-content').forEach(pageContent => {
                const components = pageContent.querySelectorAll('.metrics-grid, .alert-timeline, .rule-distribution, .mitre-overview');
                components.forEach(component => {
                    const htmlComponent = component as HTMLElement;
                    if (htmlComponent.offsetHeight > contentHeight) {
                        processContent(component);
                    }
                });
            });
        });
    }
}
