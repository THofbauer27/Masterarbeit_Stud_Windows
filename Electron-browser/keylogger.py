import os
import json
from datetime import datetime
from pynput import keyboard, mouse
import pygetwindow as gw  


def read_user_id():
    try:
        with open("user_id.txt", "r", encoding="utf-8") as f:
            return f.read().strip()
    except Exception as e:
        print(f"⚠️ Fehler beim Lesen der user_id.txt: {e}")
        return "UnknownUser"
    

# === Konfiguration ===
USER_ID = read_user_id()
KEYLOG_FILE = "keylog.jsonl"
MOUSELOG_FILE = "mouselog.jsonl"
CURRENT_URL_FILE = "current_url.txt"
ACTIVE_WINDOW_TITLE = "Custom Browser"  

# === Hilfsfunktionen ===
def get_current_url():
    try:
        with open(CURRENT_URL_FILE, "r", encoding="utf-8") as f:
            url = f.read().strip()
            if url.startswith("http"):
                return url
    except Exception:
        pass
    return ""

def is_custom_browser_active():
    try:
        active_window = gw.getActiveWindow()
        return active_window and ACTIVE_WINDOW_TITLE in active_window.title
    except:
        return False

# === Initialisierung ===
current_word = ""

# === Tastatureingaben ===
def on_press(key):
    pass  # wird nicht verwendet

def on_release(key):
    global current_word

    if not is_custom_browser_active():
        return

    try:
        if key == keyboard.Key.space or key == keyboard.Key.enter:
            word = current_word.strip()
            if word:
                log_entry = {
                    "user_id": USER_ID,
                    "timestamp": datetime.utcnow().isoformat() + "Z",
                    "word": word,
                    "url": get_current_url()
                }
                with open(KEYLOG_FILE, "a", encoding="utf-8") as f:
                    f.write(json.dumps(log_entry, ensure_ascii=False) + "\n")
                print(f"💾 Wort gespeichert: {log_entry}")
            current_word = ""

        elif key == keyboard.Key.backspace:
            current_word = current_word[:-1]

        elif hasattr(key, 'char') and key.char is not None:
            current_word += key.char

    except Exception as e:
        print(f"⚠️ Fehler beim Verarbeiten der Taste: {e}")

# === Mausklicks & Scroll ===
def on_click(x, y, button, pressed):
    if not is_custom_browser_active():
        return

    log_entry = {
        "user_id": USER_ID,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "event": "click" if pressed else "release",
        "x": x,
        "y": y,
        "button": str(button),
        "url": get_current_url()
    }
    with open(MOUSELOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(log_entry) + "\n")

def on_scroll(x, y, dx, dy):
    if not is_custom_browser_active():
        return

    log_entry = {
        "user_id": USER_ID,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "event": "scroll",
        "x": x,
        "y": y,
        "dx": dx,
        "dy": dy,
        "url": get_current_url()
    }
    with open(MOUSELOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(log_entry) + "\n")

# === Hauptfunktion ===
def start_logger():
    print("🖱️ Maus- und ⌨️ Tastatur-Logger gestartet – nur aktiv, wenn 'Custom Browser' im Vordergrund ist.")
    keyboard_listener = keyboard.Listener(on_press=on_press, on_release=on_release)
    mouse_listener = mouse.Listener(on_click=on_click, on_scroll=on_scroll)

    keyboard_listener.start()
    mouse_listener.start()

    keyboard_listener.join()
    mouse_listener.join()

# === Start ===
if __name__ == "__main__":
    start_logger()












