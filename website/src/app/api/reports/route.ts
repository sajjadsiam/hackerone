import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Report {
  program: string;
  title: string;
  link: string;
  upvotes: number;
  bounty: number;
  vuln_type: string;
}

interface HackerOneData {
  metadata: any;
  all_reports: Report[];
  categories: any;
  rankings: any;
  grouped_data: any;
}

let cachedReports: Report[] | null = null;
let cachedMetadata: any = null;
let lastModified: number = 0;

const loadReportsData = () => {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'hackerone_reports.json');
    const stats = fs.statSync(filePath);
    
    // Check if file has been modified since last cache
    if (cachedReports && cachedMetadata && stats.mtimeMs === lastModified) {
      return { reports: cachedReports, metadata: cachedMetadata };
    }
    
    console.log('Loading reports data from file...');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const fullData = JSON.parse(jsonData);
    
    // Extract lookup tables for decompression
    const programs: string[] = fullData.programs || [];
    const vulnTypes: string[] = fullData.vulnTypes || [];
    
    // Decompress reports array format back to objects
    cachedReports = (fullData.reports || []).map((item: any[]) => ({
      program: programs[item[0]] || 'Unknown',
      title: item[1],
      link: `https://hackerone.com/reports/${item[2]}`,
      upvotes: item[3],
      bounty: item[4],
      vuln_type: vulnTypes[item[5]] || 'Unknown'
    }));
    
    cachedMetadata = fullData.meta?.stats || {};
    lastModified = stats.mtimeMs;
    
    console.log(`Loaded ${cachedReports?.length || 0} reports into cache`);
    return { reports: cachedReports || [], metadata: cachedMetadata };
  } catch (error) {
    console.error('Error loading reports data:', error);
    return { reports: [], metadata: {} };
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const program = searchParams.get('program');
  const vulnType = searchParams.get('vuln_type');
  const minBounty = parseFloat(searchParams.get('min_bounty') || '0');
  const search = searchParams.get('search');

  try {
    const { reports: allReports, metadata } = loadReportsData();
    let reports = [...allReports];

    // Apply filters
    if (program) {
      // Try exact match first, then fallback to partial match
      const exactMatches = reports.filter(report => 
        report.program.toLowerCase() === program.toLowerCase()
      );
      
      if (exactMatches.length > 0) {
        reports = exactMatches;
      } else {
        // Fallback to partial match for search functionality
        reports = reports.filter(report => 
          report.program.toLowerCase().includes(program.toLowerCase())
        );
      }
    }

    if (vulnType) {
      reports = reports.filter(report => 
        report.vuln_type && report.vuln_type.toLowerCase().includes(vulnType.toLowerCase())
      );
    }

    if (minBounty > 0) {
      reports = reports.filter(report => report.bounty >= minBounty);
    }

    if (search) {
      reports = reports.filter(report => 
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.program.toLowerCase().includes(search.toLowerCase()) ||
        (report.vuln_type && report.vuln_type.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReports = reports.slice(startIndex, endIndex);

    const response = NextResponse.json({
      reports: paginatedReports,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(reports.length / limit),
        total_reports: reports.length,
        per_page: limit
      }
    });
    
    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
    return response;

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load reports' },
      { status: 500 }
    );
  }
}