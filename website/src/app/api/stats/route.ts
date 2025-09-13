import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let cachedStats: any = null;
let lastModified: number = 0;

const loadStatsOnly = () => {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'hackerone_reports.json');
    const stats = fs.statSync(filePath);
    
    // Check if file has been modified since last cache
    if (cachedStats && stats.mtimeMs === lastModified) {
      return cachedStats;
    }
    
    // Stream read only the parts we need
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const fullData = JSON.parse(jsonData);
    
    // Extract lookup tables for decompression
    const programs: string[] = fullData.programs || [];
    const vulnTypes: string[] = fullData.vulnTypes || [];
    
    // Decompress and cache only what we need for stats
    cachedStats = {
      metadata: {
        stats: fullData.meta?.stats || {}
      },
      categories: {
        tops_by_bug_type: vulnTypes.map((vt: string) => ({ bug_type: vt })),
        tops_by_program: programs.map((p: string) => ({ program: p }))
      },
      rankings: {
        top_by_bounty: (fullData.rankings?.bounty || []).slice(0, 20).map((item: any[]) => ({
          program: programs[item[0]] || 'Unknown',
          title: item[1],
          link: `https://hackerone.com/reports/${item[2]}`,
          upvotes: item[3],
          bounty: item[4],
          vuln_type: vulnTypes[item[5]] || 'Unknown'
        })),
        top_by_upvotes: (fullData.rankings?.upvotes || []).slice(0, 20).map((item: any[]) => ({
          program: programs[item[0]] || 'Unknown',
          title: item[1], 
          link: `https://hackerone.com/reports/${item[2]}`,
          upvotes: item[3],
          bounty: item[4],
          vuln_type: vulnTypes[item[5]] || 'Unknown'
        }))
      }
    };
    
    lastModified = stats.mtimeMs;
    return cachedStats;
  } catch (error) {
    console.error('Error loading stats data:', error);
    return null;
  }
};

export async function GET(request: NextRequest) {
  try {
    const data = loadStatsOnly();
    if (!data) {
      return NextResponse.json(
        { error: 'Failed to load data' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      metadata: data.metadata,
      categories: data.categories,
      rankings: {
        top_by_bounty: data.rankings.top_by_bounty.slice(0, 10),
        top_by_upvotes: data.rankings.top_by_upvotes.slice(0, 10)
      }
    });
    
    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    return response;

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}