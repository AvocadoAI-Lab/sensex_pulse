import {NextResponse} from 'next/server';
import puppeteer, {Browser, Page} from 'puppeteer';

interface RequestBody {
  url: string;
}

export async function POST(request: Request) {
  let browser: Browser | null = null;
  
  try {
    const { url }: RequestBody = await request.json();

    // Launch puppeteer
    browser = await puppeteer.launch({
      headless: true // Use boolean instead of 'new'
    });

    // Create a new page
    const page: Page = await browser.newPage();

    // Set viewport to ensure all content is captured
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 1,
    });

    // Navigate to the URL
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });

    // Wait for charts to render
    await page.waitForSelector('canvas');

    // Get all external stylesheets
    const stylesheets = await page.evaluate(() => {
      return Array.from(document.styleSheets)
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch {
            return '';
          }
        })
        .join('\n');
    });

    // Get the page content
    const content = await page.evaluate((inlineStyles: string) => {
      // Remove the download button
      const downloadButton = document.querySelector('[data-download-button]');
      if (downloadButton) {
        downloadButton.remove();
      }

      // Convert canvas elements to images
      const canvases = document.querySelectorAll('canvas');
      canvases.forEach(canvas => {
        const img = document.createElement('img');
        img.src = (canvas as HTMLCanvasElement).toDataURL('image/png');
        img.style.width = '100%';
        img.style.height = 'auto';
        canvas.parentNode?.replaceChild(img, canvas);
      });

      // Create the final HTML
      return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ransomware Attack Analysis Report</title>
    <style>
      ${inlineStyles}
      body {
        margin: 0;
        padding: 0;
        background-color: rgb(243 244 246);
      }
      * {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }
      img {
        max-width: 100%;
        height: auto;
      }
      @media print {
        body {
          background-color: white;
        }
        @page {
          margin: 2cm;
        }
      }
    </style>
</head>
<body>
    ${document.body.innerHTML}
    <script>
      // Remove any remaining interactive elements
      document.querySelectorAll('button, [role="button"]').forEach(el => el.remove());
      // Remove any script tags
      document.querySelectorAll('script').forEach(script => {
        if (script !== document.currentScript) {
          script.remove();
        }
      });
    </script>
</body>
</html>`;
    }, stylesheets);

    // Close the browser
    await browser.close();
    browser = null;

    // Return the static HTML
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': 'attachment; filename="ransomware-attack-report.html"'
      },
    });

  } catch (error) {
    console.error('Error generating static HTML:', error);
    return new NextResponse('Error generating report', { status: 500 });
  } finally {
    // Ensure browser is closed even if an error occurs
    if (browser) {
      await browser.close();
    }
  }
}
