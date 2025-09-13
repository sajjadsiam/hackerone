# HackerOne Reports Database Website

A Next.js website that displays comprehensive vulnerability reports from the HackerOne platform. This website is intentionally designed to load slowly for demonstration purposes.

## Features

- 🔍 **Comprehensive Search**: Search through 13,000+ vulnerability reports
- 📊 **Statistics Dashboard**: View total bounties, upvotes, and report counts
- 🏷️ **Category Browsing**: Filter by bug type and program
- 🏆 **Rankings**: Top reports by bounty amount and community upvotes
- ⚡ **Slow Loading**: Intentionally slow for better user experience demonstration
- 🎨 **Dark Theme**: Modern dark UI with green accent colors
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

## Data Source

The website uses data from `../hackerone_reports.json` which contains:

- **13,157 reports** from 403 different programs
- **158 unique vulnerability types**
- **$4,734,762.24** in total bounties paid
- Comprehensive metadata and categorization

## Pages

- **Home** (`/`): Overview with statistics and top rankings
- **All Reports** (`/reports`): Searchable and filterable report listings
- **Categories** (`/categories`): Browse by bug type or program
- **Rankings** (`/rankings`): Top reports by bounty and upvotes

## API Endpoints

- `GET /api/stats` - Overall statistics and top rankings
- `GET /api/reports` - Paginated reports with search and filtering
- `GET /api/categories` - Category listings by type

## Performance Features (Intentionally Slow)

- Artificial delays in API responses (2-5 seconds)
- Middleware delays on all routes (1-3 seconds)
- Progressive loading animations
- Reduced caching headers
- Simulated slow data processing

## Installation

```bash
cd website
npm install
npm run dev
```

## Development

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data**: Static JSON file processing
- **Deployment**: Standalone build ready

## Environment

- Node.js 18+
- Modern browser with JavaScript enabled
- 2GB+ RAM recommended for optimal slow loading experience

---

_Note: This website is intentionally slow to demonstrate loading states and user experience patterns. In production, these delays would be removed for optimal performance._
