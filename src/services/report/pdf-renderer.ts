import React from 'react';
import {Document, renderToBuffer} from '@react-pdf/renderer';
import {GroupSummary} from '@/services/report/summary';
import {Report} from '@/components/pdf/Document';

export class ReportPdfRenderer {
  public static async generatePdfBuffer(summary: GroupSummary): Promise<Buffer> {
    try {
      const doc = React.createElement(
        Document,
        {},
        React.createElement(Report, { summary })
      );

      return await renderToBuffer(doc);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
}
