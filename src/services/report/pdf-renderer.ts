import React from 'react';
import {Document, renderToFile} from '@react-pdf/renderer';
import {GroupSummary} from "@/services/report/summary";
import {Report} from "@/components/pdf/Document";

export class ReportPdfRenderer {
  public static async generatePdf(summary: GroupSummary, outputPath: string): Promise<void> {
    try {
      const doc = React.createElement(
        Document,
        {},
        React.createElement(Report, { summary })
      );

      await renderToFile(doc, outputPath);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
}
