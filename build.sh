# build.sh - Cross-platform build script
#!/bin/bash

echo "🐱 Building Tofu Timer for multiple platforms..."

# Detect platform
if [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="macos"
    EXTENSION=""
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    PLATFORM="windows"
    EXTENSION=".exe"
else
    PLATFORM="linux"
    EXTENSION=""
fi

echo "🖥️ Detected platform: $PLATFORM"

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Build with PyInstaller
echo "🔨 Building executable..."
if [ "$PLATFORM" = "macos" ]; then
    # macOS specific build
    pyinstaller --onefile \
        --windowed \
        --name "TofuTimer" \
        --icon="web/tofu_icon.icns" \
        --add-data "web:web" \
        --hidden-import="engineio.async_drivers.threading" \
        main.py
elif [ "$PLATFORM" = "windows" ]; then
    # Windows specific build
    pyinstaller --onefile \
        --windowed \
        --name "TofuTimer" \
        --icon="web/tofu_icon.ico" \
        --add-data "web;web" \
        --hidden-import="engineio.async_drivers.threading" \
        main.py
else
    # Linux specific build
    pyinstaller --onefile \
        --name "TofuTimer" \
        --add-data "web:web" \
        --hidden-import="engineio.async_drivers.threading" \
        main.py
fi

echo "✅ Build completed! Check the 'dist' folder for your executable."

# Create distribution package
echo "📦 Creating distribution package..."
mkdir -p "TofuTimer-$PLATFORM"
cp "dist/TofuTimer$EXTENSION" "TofuTimer-$PLATFORM/"
cp -r web "TofuTimer-$PLATFORM/"
cp README.md "TofuTimer-$PLATFORM/" 2>/dev/null || echo "README.md not found"

if [ "$PLATFORM" = "macos" ]; then
    # Create .dmg for macOS (requires create-dmg)
    if command -v create-dmg &> /dev/null; then
        create-dmg \
            --volname "Tofu Timer" \
            --window-pos 200 120 \
            --window-size 600 300 \
            --icon-size 100 \
            --app-drop-link 425 120 \
            "TofuTimer-$PLATFORM.dmg" \
            "TofuTimer-$PLATFORM/"
    else
        echo "⚠️ create-dmg not found. Creating zip instead."
        zip -r "TofuTimer-$PLATFORM.zip" "TofuTimer-$PLATFORM/"
    fi
else
    zip -r "TofuTimer-$PLATFORM.zip" "TofuTimer-$PLATFORM/"
fi

echo "🎉 Distribution package created: TofuTimer-$PLATFORM.zip"