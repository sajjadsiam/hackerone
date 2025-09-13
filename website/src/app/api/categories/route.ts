import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let cachedCategories: any = null;
let lastModified: number = 0;

const loadCategoriesOnly = () => {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'hackerone_reports.json');
    const stats = fs.statSync(filePath);
    
    // Check if file has been modified since last cache
    if (cachedCategories && stats.mtimeMs === lastModified) {
      return cachedCategories;
    }
    
    console.log('Loading categories data from file...');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const fullData = JSON.parse(jsonData);
    
    // Extract lookup tables and create categories structure
    const programs: string[] = fullData.programs || [];
    const vulnTypes: string[] = fullData.vulnTypes || [];
    
    // Create categories structure from the compressed format
    cachedCategories = {
      categories: {
        tops_by_bug_type: vulnTypes.map((type: string, index: number) => ({
          bug_type: type,
          filename: `vuln_${index}`,
          content: `Vulnerability type: ${type}. This category contains security reports related to ${type} vulnerabilities.`
        })),
        tops_by_program: programs.map((program: string, index: number) => ({
          program: program,
          filename: `program_${index}`,
          content: `Bug bounty program: ${program}. This category contains security reports submitted to the ${program} bug bounty program.`
        }))
      },
      grouped_data: {}
    };
    
    lastModified = stats.mtimeMs;
    console.log('Categories data loaded into cache');
    return cachedCategories;
  } catch (error) {
    console.error('Error loading categories data:', error);
    return null;
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'bug_type';

  try {
    const data = loadCategoriesOnly();
    if (!data) {
      return NextResponse.json(
        { error: 'Failed to load data' },
        { status: 500 }
      );
    }

    let categories = [];

    if (type === 'bug_type') {
      categories = data.categories.tops_by_bug_type.map((item: any) => ({
        name: item.bug_type,
        filename: item.filename,
        preview: item.content.substring(0, 200) + '...'
      }));
    } else if (type === 'program') {
      categories = data.categories.tops_by_program.map((item: any) => ({
        name: item.program,
        filename: item.filename,
        preview: item.content.substring(0, 200) + '...'
      }));
    }

    const response = NextResponse.json({
      type,
      categories
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