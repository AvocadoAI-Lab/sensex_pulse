import {NextResponse} from 'next/server';
import fs from 'fs';
import path from 'path';
import type {Hit, Root} from '../../../types/alerts';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const group = searchParams.get('group');

  if (!group) {
    return NextResponse.json({ error: 'Group parameter is required' }, { status: 400 });
  }

  try {
    // 構建group目錄路徑
    const groupPath = path.join(process.cwd(), 'public', 'data', group);

    // 讀取該group下的所有alerts文件
    const files = fs.readdirSync(groupPath)
      .filter(file => file.startsWith('alerts_') && file.endsWith('.json'));

    // 合併所有alerts數據
    const allAlerts: Root = {
      took: 0,
      timed_out: false,
      _shards: {
        total: 0,
        successful: 0,
        skipped: 0,
        failed: 0
      },
      hits: {
        total: {
          value: 0,
          relation: "eq"
        },
        max_score: null,
        hits: [] as Hit[]
      }
    };

    for (const file of files) {
      const filePath = path.join(groupPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const alertData = JSON.parse(fileContent) as Root;

      // 合併hits數據
      allAlerts.hits.hits = [...allAlerts.hits.hits, ...alertData.hits.hits];
      allAlerts.hits.total.value += alertData.hits.total.value;
    }

    return NextResponse.json(allAlerts);
  } catch (error) {
    console.error('Error reading alerts:', error);
    return NextResponse.json(
      { error: 'Failed to read alerts data' },
      { status: 500 }
    );
  }
}
