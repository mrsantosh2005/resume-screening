@echo off
echo Setting up Resume Screening Frontend...

REM Create public folder and files
if not exist public mkdir public

REM Create index.html
echo ^<!DOCTYPE html^> > public/index.html
echo ^<html lang="en"^> >> public/index.html
echo   ^<head^> >> public/index.html
echo     ^<meta charset="utf-8" /^> >> public/index.html
echo     ^<link rel="icon" href="%%PUBLIC_URL%%/favicon.ico" /^> >> public/index.html
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1" /^> >> public/index.html
echo     ^<meta name="theme-color" content="#4F46E5" /^> >> public/index.html
echo     ^<meta name="description" content="AI-Powered Resume Screening System" /^> >> public/index.html
echo     ^<title^>ResumeAI - Smart Resume Screening^</title^> >> public/index.html
echo   ^</head^> >> public/index.html
echo   ^<body^> >> public/index.html
echo     ^<noscript^>You need to enable JavaScript to run this app.^</noscript^> >> public/index.html
echo     ^<div id="root"^>^</div^> >> public/index.html
echo   ^</body^> >> public/index.html
echo ^</html^> >> public/index.html

REM Create manifest.json
echo { > public/manifest.json
echo   "short_name": "ResumeAI", >> public/manifest.json
echo   "name": "AI Resume Screening System", >> public/manifest.json
echo   "start_url": ".", >> public/manifest.json
echo   "display": "standalone", >> public/manifest.json
echo   "theme_color": "#4F46E5", >> public/manifest.json
echo   "background_color": "#ffffff" >> public/manifest.json
echo } >> public/manifest.json

REM Create robots.txt
echo User-agent: * > public/robots.txt
echo Disallow: >> public/robots.txt

echo.
echo Frontend structure created successfully!
echo.
echo Installing dependencies...
npm install

echo.
echo Setup complete! Run 'npm start' to start the development server.
pause