# Masterarbeit\_Stud

# 📦 MIBP Electron Browser – Masterarbeitsprojekt



Dieses Projekt enthält einen logging-fähigen Browser zur Untersuchung des Informationssuchverhaltens. Studierende nutzen diesen Browser zur Bearbeitung von Programmieraufgaben. Dabei werden besuchte Webseiten und Tastatureingaben anonymisiert erfasst.



---



## ✅ Voraussetzungen



1\.**Windows 10 oder 11**

2\.**Python ab Version 3.10**  

&nbsp;  → Muss als System-App installiert sein (`python` im Terminal ausführbar)

3\.**Node.js (mind. Version 18)**  

&nbsp;  → Muss im PATH verfügbar sein (`node -v` und `npm -v` im Terminal ausführbar)



---



## 📥 Installation (nur beim ersten Start erforderlich)



1\.**Projekt herunterladen**  

&nbsp;  Lade das gesamte Projekt (z. B. ZIP-Datei) herunter und entpacke es an einen beliebigen Ort (z. B. Desktop).



2\. **Setup starten**  

&nbsp;  Führe die Datei `setup_and_start.bat` mit Doppelklick aus.  

&nbsp;  Sie installiert automatisch:

&nbsp;  - Alle `npm`-Abhängigkeiten (Electron etc.)

&nbsp;  - Alle `pip`-Abhängigkeiten (für den Keylogger)

&nbsp;  - Danach wird automatisch die reguläre Startdatei geöffnet



---



## 🚀 Nutzung



\- **Starte den Browser mit Keylogger:**  

&nbsp; Doppelklick auf `start_browser.bat`



🔒 Die Tastatureingaben werden lokal gespeichert und am Ende der Sitzung zur Überprüfung angezeigt. Erst nach manueller Bestätigung werden die Daten anonym an den zentralen Server übertragen.



---



## 📄 Hinweise



\- **Fenster werden automatisch minimiert** (Keylogger etc.)

\- **Beim Schließen des Browsers** wird der Keylogger automatisch beendet.

\- **Es werden keine persönlichen Daten gespeichert.**



---



## ❓ Häufige Probleme



| Problem | Lösung |



| `python` wird nicht erkannt | Stelle sicher, dass Python installiert ist und in den Umgebungsvariablen (`PATH`) verfügbar ist |

| Fenster bleiben offen | Stelle sicher, dass nur diese Version des Browsers verwendet wird. Anderen Python-Prozesse könnten stören |

| Keylogger wird nicht beendet | Starte `start\_browser.bat` nicht mehrfach. Nur ein Fenster gleichzeitig nutzen |



---

