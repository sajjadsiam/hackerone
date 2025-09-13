@echo off
echo Starting HackerOne Reports Website...
echo This website is intentionally slow for demonstration purposes.
echo.
echo Opening in development mode...
cd /d "c:\Users\siam\Desktop\hackerone-reports\website"
echo.
echo Installing dependencies if needed...
npm install
echo.
echo Starting development server...
echo Website will be available at: http://localhost:3000
echo.
npm run dev