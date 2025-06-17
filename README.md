# 🐱 Tofu Timer - A Heartfelt Focus Timer

<div align="center">
  <img src="web/tofu_idle.gif" width="200" alt="Tofu the Cat">
  <h3>Stay focused with Tofu the cat! 🐾</h3>
  
  <p><em>Created in loving memory of Tofu, a special cat who brought joy and inspiration</em></p>
</div>

## 💝 The Story Behind Tofu Timer

This app was born from the memory of **Tofu**, a beloved cat who was incredibly special to me. After Tofu passed away, I wanted to create something that would honor his memory while helping people stay productive and motivated. 

The reward system with photos was designed so you can add pictures of your own pets, loved ones, or anything that motivates you - creating a personal connection that makes focusing more meaningful.

Tofu taught me about patience, routine, and finding joy in small moments. This timer embodies those lessons, encouraging gentle productivity with a companion who's always cheering you on.

## ✨ Features

- **🎯 Focus Timer**: Set custom study/work sessions (1-120 minutes)
- **🐱 Interactive Pet**: Click on Tofu for different reactions and moods
- **📊 Progress Tracking**: Visual progress bar with pixelated design
- **🎁 Personal Reward System**: Earn photo rewards every hour - add your own meaningful pictures!
- **📝 Todo List**: Built-in task management with motivational surprises
- **🔊 Sound Notifications**: Multiple audio fallbacks for completion alerts
- **💾 Progress Persistence**: Your stats and gifts are saved locally
- **🎨 Retro Aesthetic**: Pixel art design with Press Start 2P font

## 🚀 Quick Start

### Prerequisites
- Python 3.7 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/tofu-timer.git
cd tofu-timer
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Run the application**
```bash
python main.py
```

The app will open in your default browser automatically! 🎉

## 🖥️ Cross-Platform Support

Tofu Timer works on:
- ✅ **Windows** (Chrome mode)
- ✅ **macOS** (Safari/default browser)
- ✅ **Linux** (default browser)

## 🎮 How to Use

1. **Set Timer**: Enter minutes (1-120) in the input field
2. **Start Focus**: Click "START" button or press Enter
3. **Watch Progress**: See the pixelated progress bar fill up
4. **Pet Tofu**: Click on Tofu during breaks for cute reactions
5. **Earn Rewards**: Complete 1-hour sessions to unlock photo gifts
6. **Track Progress**: Double-click Tofu to see your statistics
7. **Manage Tasks**: Click the clipboard button for todo list

## 🎁 Personal Reward System

The heart of Tofu Timer is its reward system:

- Complete **1 hour** of focused work = **1 personal photo reward**
- **Add your own photos**: Pictures of pets, family, goals, or anything that motivates you
- Each reward comes with an encouraging message
- Your progress and photo collection are saved automatically
- Create a gallery of meaningful moments that inspire you to keep going

### 📸 Adding Your Own Photos

1. Create a folder called `personal_photos` in the `web` directory
2. Add your photos (JPG, PNG, GIF supported)
3. Name them: `photo1.jpg`, `photo2.jpg`, etc.
4. The app will cycle through them as you earn rewards
5. Recommended size: 400x400px or smaller for best performance

**Photo Ideas:**
- Your pets or Tofu's memory
- Family and friends
- Goals and dreams
- Places you want to visit
- Achievements you're proud of
- Anything that makes you smile! 😊

## 🛠️ Building Executables

### For Current Platform
```bash
chmod +x build.sh
./build.sh
```

### Manual Build with PyInstaller

**Windows:**
```bash
pyinstaller --onefile --windowed --name "TofuTimer" --icon="web/tofu_icon.ico" --add-data "web;web" main.py
```

**macOS:**
```bash
pyinstaller --onefile --windowed --name "TofuTimer" --icon="web/tofu_icon.icns" --add-data "web:web" main.py
```

**Linux:**
```bash
pyinstaller --onefile --name "TofuTimer" --add-data "web:web" main.py
```

## 📁 Project Structure

```
tofu-timer/
├── main.py              # Main Python backend
├── requirements.txt     # Python dependencies
├── build.sh            # Build script for executables
├── web/                # Frontend files
│   ├── index.html      # Main HTML page
│   ├── main.js         # JavaScript logic
│   ├── style.css       # Pixel art styling
│   ├── tofu_idle.gif   # Main Tofu animation
│   ├── tofu_petted.gif # Petted Tofu animation
│   ├── couple.gif      # Progress indicator
│   ├── sample_photos/  # Sample gift photos
│   └── sounds/         # Audio files
└── README.md           # This file
```

## 🎨 Customization

### Adding Your Own Photos
Replace files in `web/personal_photos/` with your own meaningful images:
- Supported formats: JPG, PNG, GIF
- Recommended size: 400x400px or smaller
- Name them: `photo1.jpg`, `photo2.jpg`, etc.
- Update the `photoFiles` array in `main.js` with your filenames

### Changing Tofu's Messages
Edit the encouragement messages in `main.js`:
- `encouragementMessages` - Reward messages
- `todoSystem.motivationalMessages` - Todo list surprises

### Audio Customization
Replace `web/notification.mp3` with your preferred completion sound.

## 🐛 Troubleshooting

### Port Issues
If you get port errors, the app will automatically try ports 8000-8009.

### Browser Not Opening
The app will print the URL in terminal. Copy and paste it manually:
```
http://localhost:8000
```

### Audio Not Playing
The app has multiple audio fallbacks:
1. HTML audio element
2. JavaScript Audio object
3. Web Audio API synthesized tones
4. Device vibration (mobile)

### Build Issues
Make sure you have all dependencies:
```bash
pip install eel pyinstaller
```

## 🤝 Contributing

Contributions are welcome! Here are some ideas:
- 🎵 More sound effects
- 🎨 Additional Tofu animations
- 🌍 Internationalization
- 📱 Mobile optimizations
- 🎮 New interactive features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 💕 Credits

- **Inspiration**: Created in loving memory of Tofu, a special cat who taught me about patience, routine, and finding joy in small moments
- **Art Style**: Retro pixel art aesthetic
- **Font**: Press Start 2P (Google Fonts)
- **Framework**: Python Eel for desktop app functionality
- **Philosophy**: Gentle productivity with meaningful rewards

---

<div align="center">
  <img src="web/real_tofu.png" width="200" alt="The real Tofu" style="border-radius: 10px;">
  <p><em>The real Tofu (2018-2023) - Forever in our hearts 🌈</em></p>
  
  <p>Made with 💖 for productivity and in memory of a very special cat</p>
  <p>⭐ Star this repo if Tofu's spirit helped you focus! ⭐</p>
</div>