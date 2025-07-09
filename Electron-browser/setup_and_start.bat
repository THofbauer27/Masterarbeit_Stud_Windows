@echo off
title MIBP Setup und Start
echo 🔧 Starte Setup (npm & pip) für MIBP-Browser...

REM Wechsle ins Verzeichnis dieser Datei
cd /d "%~dp0"

REM Prüfe, ob Node.js installiert ist
where npm >nul 2>&1
if errorlevel 1 (
    echo ❌ Fehler: Node.js/npm ist nicht installiert.
    pause
    exit /b
)

REM Prüfe, ob Python installiert ist
where python >nul 2>&1
if errorlevel 1 (
    echo ❌ Fehler: Python ist nicht installiert.
    pause
    exit /b
)

echo 📦 Installiere Node-Abhängigkeiten...
call npm install

echo 🐍 Installiere Python-Abhängigkeiten...
if exist requirements.txt (
    python -m pip install -r requirements.txt
) else (
    echo ⚠️ Keine requirements.txt gefunden – überspringe Python-Installation.
)

echo ✅ Setup abgeschlossen. Starte jetzt den Browser...
timeout /t 1 >nul
start "" start_browser.bat

