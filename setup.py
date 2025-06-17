#!/usr/bin/env python3
"""
Tofu Timer - Setup and Installation Script
A cute focus timer with an interactive pet companion
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 7):
        print("❌ Python 3.7 or higher is required!")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    return True

def install_dependencies():
    """Install required Python packages"""
    print("📦 Installing dependencies...")
    
    try:
        # Install eel
        subprocess.check_call([sys.executable, "-m", "pip", "install", "eel>=0.14.0"])
        print("✅ Eel installed successfully")
        
        # Install PyInstaller (optional, for building executables)
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "pyinstaller>=4.0"])
            print("✅ PyInstaller installed (for building executables)")
        except subprocess.CalledProcessError:
            print("⚠️ PyInstaller installation failed (optional feature)")
        
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def create_sample_photos():
    """Create sample photos directory with placeholder images"""
    sample_dir = Path("web/sample_photos")
    sample_dir.mkdir(exist_ok=True)
    
    # Create a simple placeholder image (text file for now)
    placeholder_content = """
# Sample Photo Placeholder
# Replace this directory with your own photos!
# 
# Supported formats: JPG, PNG, GIF
# Recommended size: 400x400px or smaller
# 
# Name your files: sample1.jpg, sample2.jpg, etc.
# The app will automatically cycle through them as rewards.
"""
    
    readme_path = sample_dir / "README.txt"
    if not readme_path.exists():
        with open(readme_path, 'w') as f:
            f.write(placeholder_content)
    
    print("✅ Sample photos directory created")
    print(f"📁 Add your photos to: {sample_dir.absolute()}")

def check_web_files():
    """Check if required web files exist"""
    required_files = [
        "web/index.html",
        "web/main.js", 
        "web/style.css",
        "web/tofu_idle.gif"
    ]
    
    missing_files = []
    for file in required_files:
        if not Path(file).exists():
            missing_files.append(file)
    
    if missing_files:
        print("❌ Missing required files:")
        for file in missing_files:
            print(f"   - {file}")
        return False
    
    print("✅ All required web files found")
    return True

def create_desktop_shortcut():
    """Create desktop shortcut (platform-specific)"""
    try:
        if sys.platform == "win32":
            # Windows shortcut
            import winshell
            from win32com.client import Dispatch
            
            desktop = winshell.desktop()
            path = os.path.join(desktop, "Tofu Timer.lnk")
            target = os.path.join(os.getcwd(), "main.py")
            
            shell = Dispatch('WScript.Shell')
            shortcut = shell.CreateShortCut(path)
            shortcut.Targetpath = sys.executable
            shortcut.Arguments = f'"{target}"'
            shortcut.WorkingDirectory = os.getcwd()
            shortcut.IconLocation = os.path.join(os.getcwd(), "web", "tofu_icon.ico")
            shortcut.save()
            
            print("✅ Desktop shortcut created (Windows)")
            
        elif sys.platform == "darwin":
            # macOS - create simple shell script
            desktop = Path.home() / "Desktop"
            script_path = desktop / "Tofu Timer.command"
            
            script_content = f"""#!/bin/bash
cd "{os.getcwd()}"
python3 main.py
"""
            with open(script_path, 'w') as f:
                f.write(script_content)
            
            os.chmod(script_path, 0o755)
            print("✅ Desktop launcher created (macOS)")
            
        else:
            # Linux - create .desktop file
            desktop = Path.home() / "Desktop"
            desktop_file = desktop / "tofu-timer.desktop"
            
            desktop_content = f"""[Desktop Entry]
Version=1.0
Type=Application
Name=Tofu Timer
Comment=A cute focus timer with pet companion
Exec=python3 "{os.path.join(os.getcwd(), 'main.py')}"
Icon={os.path.join(os.getcwd(), 'web', 'tofu_icon.png')}
Path={os.getcwd()}
Terminal=false
StartupNotify=false
"""
            with open(desktop_file, 'w') as f:
                f.write(desktop_content)
            
            os.chmod(desktop_file, 0o755)
            print("✅ Desktop launcher created (Linux)")
            
    except Exception as e:
        print(f"⚠️ Could not create desktop shortcut: {e}")
        print("💡 You can manually run: python main.py")

def main():
    """Main setup function"""
    print("🐱 Tofu Timer Setup")
    print("=" * 40)
    
    # Check Python version
    if not check_python_version():
        return False
    
    # Check required files
    if not check_web_files():
        print("💡 Make sure you have all the required files!")
        return False
    
    # Install dependencies
    if not install_dependencies():
        return False
    
    # Create sample photos directory
    create_sample_photos()
    
    # Create desktop shortcut
    create_desktop_shortcut()
    
    print("\n🎉 Setup complete!")
    print("\n🚀 To start Tofu Timer:")
    print("   python main.py")
    print("\n📖 For more info, check README.md")
    print("\n💕 Enjoy focusing with Tofu!")
    
    return True

if __name__ == "__main__":
    success = main()
    
    if not success:
        print("\n❌ Setup failed!")
        sys.exit(1)
    
    # Ask if user wants to run the app now
    try:
        run_now = input("\n🎯 Run Tofu Timer now? (y/n): ").lower().strip()
        if run_now in ['y', 'yes', '']:
            print("\n🐱 Starting Tofu Timer...")
            subprocess.call([sys.executable, "main.py"])
    except KeyboardInterrupt:
        print("\n👋 Goodbye!")
        sys.exit(0)