# main.py - Cross-platform Tofu Timer
# Created in loving memory of Tofu, a special cat who inspired this app
# Compatible with Windows, Mac, and Linux

import warnings
warnings.filterwarnings("ignore", category=UserWarning, module="eel")

import eel
import time
import threading
import os
import sys
import socket
import platform
import subprocess

# Initialize Eel with web directory
eel.init('web')

# Global timer variables
timer_running = False
timer_thread = None
timer_paused = False
timer_completed = False
current_countdown = 0

def find_free_port():
    """Find a free port to use"""
    for port in range(8000, 8010):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('localhost', port))
                print(f"🌐 Port {port} available")
                return port
        except OSError:
            print(f"⚠️ Port {port} busy")
            continue
    return 8000  # fallback

@eel.expose
def start_timer(seconds):
    """Start the focus timer"""
    global timer_running, timer_thread, timer_paused, timer_completed, current_countdown

    if timer_running and timer_thread and timer_thread.is_alive():
        print("⚠️ Timer already running, stopping previous...")
        stop_timer()
        time.sleep(0.2)

    print(f"🚀 Starting timer for {seconds} seconds...")
    timer_running = True
    timer_paused = False
    timer_completed = False
    current_countdown = seconds

    def run_timer():
        global timer_running, timer_paused, timer_completed, current_countdown
        countdown = seconds

        try:
            print(f"⏰ Timer started with {countdown} seconds")
            
            while countdown > 0 and timer_running:
                if not timer_paused:
                    countdown -= 1
                    current_countdown = countdown
                    
                    if countdown % 10 == 0:
                        print(f"⏳ {countdown} seconds remaining")
                    
                    try:
                        eel.update_timer_display(countdown)
                    except:
                        pass

                time.sleep(1)

                if not timer_running:
                    print("❌ Timer cancelled during execution!")
                    return

            if timer_running and countdown <= 0:
                print("🎉 Timer completed naturally!")
                timer_completed = True
                timer_running = False
                current_countdown = 0

                try:
                    print("📞 Sending timer_finished signal to JavaScript...")
                    eel.timer_finished()
                    print("✅ Signal sent successfully!")
                except Exception as e:
                    print(f"❌ Error sending timer_finished: {e}")

        except Exception as e:
            print(f"❌ Timer error: {e}")
            timer_running = False

    timer_thread = threading.Thread(target=run_timer)
    timer_thread.daemon = True
    timer_thread.start()
    print("✅ Timer thread started")

@eel.expose
def stop_timer():
    """Stop the timer"""
    global timer_running, timer_paused, timer_completed, current_countdown
    print("⏹️ Stopping timer...")
    timer_running = False
    timer_paused = False
    timer_completed = False
    current_countdown = 0
    
    if timer_thread and timer_thread.is_alive():
        timer_thread.join(timeout=1.0)
    
    print("✅ Timer stopped")

@eel.expose
def pause_timer():
    """Pause the timer"""
    global timer_paused
    if timer_running:
        timer_paused = True
        print("⏸️ Timer paused")

@eel.expose
def resume_timer():
    """Resume the timer"""
    global timer_paused
    if timer_running:
        timer_paused = False
        print("▶️ Timer resumed")

@eel.expose
def get_timer_status():
    """Get current timer status"""
    status = {
        'running': timer_running,
        'paused': timer_paused,
        'completed': timer_completed,
        'countdown': current_countdown
    }
    print(f"📊 Status requested: {status}")
    return status

@eel.expose
def confirm_timer_finished():
    """Confirm timer completion from JavaScript"""
    global timer_completed, timer_running
    print("✅ JavaScript confirmed timer completion")
    timer_completed = True
    timer_running = False

def get_icon_path():
    """Find the correct icon path"""
    possible_paths = [
        'web/tofu_icon.ico',
        'tofu_icon.ico',
        'web/tofu.ico',
        'tofu.ico',
        'web/icon.ico',
        'icon.ico'
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            abs_path = os.path.abspath(path)
            print(f"✅ Icon found: {path} -> {abs_path}")
            return abs_path
    
    print("⚠️ Icon not found in paths:")
    for path in possible_paths:
        print(f"   ❌ {os.path.abspath(path)}")
    return None

def get_browser_mode():
    """Get appropriate browser mode based on platform"""
    system = platform.system()
    if system == "Darwin":  # macOS
        # Try different modes for Mac to get a dedicated window
        return 'chrome-app'  # App mode creates dedicated window
    elif system == "Windows":
        return 'chrome'   # Use Chrome on Windows
    else:  # Linux
        return 'default'  # Use default browser on Linux

def start_app_with_fallback(free_port):
    """Start the app with fallback browser modes"""
    system = platform.system()
    
    if system == "Darwin":  # macOS specific handling
        print("🍎 macOS detected - trying to open as dedicated window...")
        
        # Try Chrome in app mode first (best option)
        chrome_paths = [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Chrome.app/Contents/MacOS/Chrome',
            '/usr/bin/google-chrome',
            '/usr/local/bin/chrome'
        ]
        
        chrome_found = False
        chrome_path = None
        for path in chrome_paths:
            if os.path.exists(path):
                chrome_found = True
                chrome_path = path
                print(f"✅ Found Chrome at: {chrome_path}")
                break
        
        if chrome_found:
            try:
                print("🌍 Manually launching Chrome in app mode...")
                
                # Launch Chrome manually first
                chrome_cmd = [
                    chrome_path,
                    f'--app=http://localhost:{free_port}',
                    '--disable-web-security',
                    '--disable-features=TranslateUI',
                    '--disable-extensions',
                    '--disable-plugins',
                    f'--window-size=550,700',
                    '--window-position=100,100',
                    '--no-first-run',
                    '--disable-default-apps'
                ]
                
                print(f"🚀 Launching: {' '.join(chrome_cmd)}")
                subprocess.Popen(chrome_cmd)
                
                # Small delay to let Chrome start
                time.sleep(1)
                
                # Start Eel server without opening browser
                print("🖥️ Starting Eel server...")
                eel.start('index.html', 
                         mode=None,  # Don't auto-open browser
                         size=(550, 700),
                         port=free_port,
                         block=True)
                return
                
            except Exception as e:
                print(f"❌ Manual Chrome launch failed: {e}")
        
        # If Chrome didn't work, try other browsers
        print("⚠️ Chrome app mode failed, trying alternatives...")
        
        # Try Firefox if available
        firefox_paths = [
            '/Applications/Firefox.app/Contents/MacOS/firefox',
            '/usr/bin/firefox',
            '/usr/local/bin/firefox'
        ]
        
        for firefox_path in firefox_paths:
            if os.path.exists(firefox_path):
                try:
                    print(f"🦊 Launching Firefox from: {firefox_path}")
                    subprocess.Popen([
                        firefox_path,
                        f'http://localhost:{free_port}',
                        '--new-window',
                        '--width=550',
                        '--height=700'
                    ])
                    
                    time.sleep(1)
                    
                    eel.start('index.html', 
                             mode=None,
                             size=(550, 700),
                             port=free_port,
                             block=True)
                    return
                except Exception as e:
                    print(f"❌ Firefox failed: {e}")
                    break
        
        # Try to force Safari to open in new window
        print("🍎 Trying Safari with new window...")
        try:
            # Use AppleScript to force new window
            applescript_cmd = f'''
            tell application "Safari"
                make new document with properties {{URL:"http://localhost:{free_port}"}}
                activate
            end tell
            '''
            
            subprocess.Popen([
                'osascript', '-e', applescript_cmd
            ])
            
            time.sleep(1)
            
            eel.start('index.html', 
                     mode=None,
                     size=(550, 700),
                     port=free_port,
                     block=True)
            return
            
        except Exception as e:
            print(f"❌ Safari AppleScript failed: {e}")
        
        # Final fallback
        print("⚠️ All browser attempts failed, using default mode")
        print(f"📱 Please manually open: http://localhost:{free_port}")
        
        eel.start('index.html', 
                 mode='default',
                 size=(550, 700),
                 port=free_port,
                 block=True)
    
    else:
        # For Windows/Linux, use original logic
        browser_mode = get_browser_mode()
        eel.start('index.html', 
                 mode=browser_mode,
                 size=(550, 700),
                 port=free_port,
                 block=True)

def main():
    """Main application entry point"""
    try:
        print("🐱 Starting Tofu Timer...")
        print("💕 Created in loving memory of Tofu, a special cat")
        print(f"🖥️ Platform: {platform.system()}")
        
        # Find icon
        icon_path = get_icon_path()
        
        if icon_path:
            print(f"🖼️ Icon found: {icon_path}")
            print("ℹ️ Icon will be used when compiling executable")
        
        # Find free port
        free_port = find_free_port()
        print(f"🌐 Using port: {free_port}")
        
        # Get browser mode based on platform
        browser_mode = get_browser_mode()
        print(f"🌍 Browser mode: {browser_mode}")
        
        # Start the application
        print("🚀 Starting application...")
        print(f"📱 App URL: http://localhost:{free_port}")
        
        # Use smart browser mode selection with fallbacks
        start_app_with_fallback(free_port)
        
    except KeyboardInterrupt:
        print("🔌 Closing due to Ctrl+C...")
        timer_running = False
    except SystemExit:
        print("🔌 Closing application...")
        timer_running = False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        print("💡 Tip: Close all browser windows related to Tofu Timer")
        print("💡 Or restart your terminal/IDE completely")
        
        # Don't ask for input if running as executable
        if hasattr(sys, 'frozen'):
            time.sleep(3)  # Give user time to read the message
        else:
            try:
                input("Press Enter to exit...")
            except:
                pass

if __name__ == '__main__':
    main()