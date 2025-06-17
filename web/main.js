// main.js - Tofu Timer Frontend Logic
// Created in loving memory of Tofu, a special cat who inspired this app
// A heartfelt focus timer with interactive pet companion

console.log('🐱 Tofu Timer loaded!');

// Control variables
let timerStartedManually = false;
let timerCompletedFlag = false;
let lastButtonClick = 0;

// DOM elements cache
const elements = {
  timeInput: null,
  message: null,
  speechBubble: null,
  tofuImage: null,
  startButton: null,
  timerDisplay: null
};

// Timer state management
let timerState = {
  isRunning: false,
  currentSeconds: 0,
  totalSeconds: 0
};

// Tofu mood system
let tofuMood = {
  current: 'idle',
  petCount: 0,
  lastPetTime: 0,
  clickTimeout: null
};

// Statistics system
let studyStats = {
  totalHours: parseFloat(localStorage.getItem('tofu_total_hours') || '0'),
  totalSessions: parseInt(localStorage.getItem('tofu_total_sessions') || '0'),
  giftsEarned: parseInt(localStorage.getItem('tofu_gifts_earned') || '0'),
  lastStudyDate: localStorage.getItem('tofu_last_study') || '',
  receivedGifts: JSON.parse(localStorage.getItem('tofu_received_gifts') || '[]')
};

// Photos array - Add your own meaningful photos here!
// Instructions: 
// 1. Create a 'personal_photos' folder in the web directory
// 2. Add your photos named: photo1.jpg, photo2.jpg, etc.
// 3. Update this array with your photo filenames
const photoFiles = [
  'personal_photos/photo1.jpg',
  'personal_photos/photo2.jpg', 
  'personal_photos/photo3.jpg',
  'personal_photos/photo4.jpg',
  'personal_photos/photo5.jpg',
  'personal_photos/photo6.jpg',
  'personal_photos/photo7.jpg',
  'personal_photos/photo8.jpg',
  'personal_photos/photo9.jpg',
  'personal_photos/photo10.jpg',
  // Add more photos as you like!
  // Example: 'personal_photos/my_pet.jpg',
  //          'personal_photos/family.jpg',
  //          'personal_photos/goal.jpg'
];

// Encouraging messages for completed focus sessions
// Feel free to customize these messages to match your goals!
const encouragementMessages = [
  "💕 First hour! You're doing amazing! 💕",
  "🌟 Second hour! Keep up the fantastic work! 🌟", 
  "💖 Third hour! Your dedication is inspiring! 💖",
  "😊 Fourth hour! You're on fire today! 😊",
  "🥰 Fifth hour! Absolutely incredible focus! 🥰",
  "💝 Another hour! You're making great progress! 💝",
  "🌹 Such dedication! You should be proud! 🌹",
  "💕 Amazing focus session! 💕",
  "⭐ What concentration! You're crushing your goals! ⭐",
  "🎯 Tenth hour! You're absolutely unstoppable! 🎯",
  "🏆 Incredible dedication! You're a focus champion! 🏆",
  "💖 Each hour brings you closer to your dreams! 💖",
  "🌸 Your persistence is beautiful to see! 🌸",
  "✨ Your determination lights up the day! ✨",
  "💫 Keep going, you're doing something amazing! 💫",
  "🦋 You inspire others with your commitment! 🦋",
  "🌟 What an incredible achievement! 🌟",
  "💕 Every hour of focus is a victory! 💕",
  "🎊 Congratulations on another focused hour! 🎊",
  "💖 You're building something wonderful! 💖"
];

// TO-DO System with motivational messages
let todoSystem = {
  tasks: JSON.parse(localStorage.getItem('tofu_todo_tasks') || '[]'),
  motivationalMessages: [
    "💕 Time to take a well-deserved break!",
    "😊 Remember to stay hydrated and stretch!",
    "🥰 You're making real progress today!",
    "💖 Don't forget to celebrate small wins!",
    "🌟 Take a moment to appreciate how far you've come!",
    "💌 You're building something amazing!",
    "🎀 Keep up the wonderful work!",
    "💝 You've got this - one step at a time!",
    "🦋 Believe in yourself and your journey!",
    "✨ You are exactly where you need to be!",
    "🌹 Plan something nice for yourself today!",
    "💕 Your efforts are making a real difference!"
  ]
};

// INITIALIZE DOM ELEMENTS
function initializeElements() {
  console.log('🔍 Initializing DOM elements...');
  
  elements.timeInput = document.getElementById("timeInput");
  elements.message = document.getElementById("message");
  elements.speechBubble = document.getElementById("speechBubble");
  elements.tofuImage = document.getElementById("tofuImage");
  elements.startButton = document.getElementById("startButton");
  elements.timerDisplay = document.getElementById("timerDisplay");
  
  const missingElements = [];
  for (const [key, element] of Object.entries(elements)) {
    if (!element) {
      missingElements.push(key);
    }
  }
  
  if (missingElements.length > 0) {
    console.error('❌ DOM elements not found:', missingElements);
    return false;
  }
  
  console.log('✅ All DOM elements found!');
  return true;
}

// FORCE GIF RELOAD FOR CONTINUOUS ANIMATION
function setupGifLoop() {
  const tofuImg = document.getElementById('tofuImage');
  if (!tofuImg) return;
  
  function reloadGif() {
    const currentSrc = tofuImg.src.split('?')[0];
    tofuImg.src = currentSrc + '?t=' + new Date().getTime();
  }
  
  // Reload GIF every 10 seconds if not showing petted animation
  setInterval(() => {
    if (!tofuImg.src.includes('tofu_petted.gif')) {
      reloadGif();
    }
  }, 10000);
}

// MAIN FOCUS FUNCTION
function startFocus() {
  console.log('🚀 startFocus() called!');
  
  // Prevent double/multiple clicks
  const now = Date.now();
  if (now - lastButtonClick < 1000) {
    console.log('⚠️ Click too fast, ignoring...');
    return;
  }
  lastButtonClick = now;
  
  try {
    if (timerState.isRunning) {
      console.log('⏹️ Timer running, stopping...');
      stopTimer();
      return;
    }

    const minutes = parseInt(elements.timeInput.value);
    console.log('⏰ Minutes entered:', minutes);
    
    if (minutes <= 0 || isNaN(minutes)) {
      console.log('❌ Invalid time:', minutes);
      showMessage("Please enter a valid time!");
      return;
    }

    // MARK AS MANUALLY STARTED
    timerStartedManually = true;
    timerCompletedFlag = false;
    console.log('✅ Timer marked as manually started');
    
    startTimer(minutes);
    
  } catch (error) {
    console.error('❌ Error in startFocus():', error);
    showMessage("Error starting timer: " + error.message);
  }
}

function startTimer(minutes) {
  console.log('🎯 startTimer() called with', minutes, 'minutes');
  
  try {
    const totalSeconds = minutes * 60;
    console.log('⏱️ Total seconds:', totalSeconds);
    
    // Configure state
    timerState.isRunning = true;
    timerState.currentSeconds = totalSeconds;
    timerState.totalSeconds = totalSeconds;
    
    console.log('✅ Timer state configured:', timerState);
    
    // Update interface
    updateInterface('running');
    
    // Setup progress bar
    initializeProgressBar();
    
    // Setup couple GIF
    setupCoupleGif();
    
    // Show initial time
    updateTimerDisplay(totalSeconds);
    
    showMessage("Focus time! You can do it! ");
    changeTofuMessage("focusing!<br>💪");
    
    console.log('🎨 Interface updated');
    
    // Notify Python - WITH DELAY TO AVOID CONFLICTS
    setTimeout(() => {
      if (typeof eel !== 'undefined') {
        try {
          console.log('📞 Calling Python...');
          eel.start_timer(totalSeconds);
          console.log('✅ Python notified');
        } catch (error) {
          console.error('❌ Error communicating with Python:', error);
        }
      }
    }, 100);
    
  } catch (error) {
    console.error('❌ Error in startTimer():', error);
    showMessage("Error: " + error.message);
  }
}

function stopTimer() {
  console.log('⏹️ stopTimer() called');
  
  if (!timerState.isRunning) {
    console.log('❌ Timer is not running');
    return;
  }
  
  try {
    // Notify Python FIRST
    if (typeof eel !== 'undefined') {
      try {
        eel.stop_timer();
        console.log('📞 Python notified to stop');
      } catch (error) {
        console.log('❌ Error stopping Python timer:', error);
      }
    }
    
    // Reset state
    timerState.isRunning = false;
    timerState.currentSeconds = 0;
    timerState.totalSeconds = 0;
    
    // Reset interface
    updateInterface('stopped');
    resetProgressBar();
    hideCoupleGif();
    
    showMessage("Timer stopped");
    changeTofuMessage("you can<br>do it");
    showTotalHours();
    
    console.log('✅ Timer stopped successfully');
    
  } catch (error) {
    console.error('❌ Error stopping timer:', error);
  }
}

function completeTimer() {
  console.log('🎉 Timer COMPLETED!');
  
  // Prevent multiple executions
  if (timerCompletedFlag) {
    console.log('⚠️ Timer already completed, ignoring...');
    return;
  }
  
  timerCompletedFlag = true;
  
  try {
    // Reset state
    timerState.isRunning = false;
    
    // COMPLETION SOUND - MULTIPLE ATTEMPTS
    playCompletionSound();
    
    // Save progress
    const hoursStudied = timerState.totalSeconds / 3600;
    saveStudyProgress(hoursStudied);
    
    // Update interface
    updateInterface('completed');
    fillProgressBar();
    hideCoupleGif();
    
    // Messages and effects
    showMessage("Complete! Hooray! 🎉");
    changeTofuMessage("well<br>done! ");
    createHeartParticles();
    
    // Confirm to Python
    if (typeof eel !== 'undefined') {
      try {
        eel.confirm_timer_finished();
        console.log('📞 Confirmation sent to Python');
      } catch (error) {
        console.log('❌ Error confirming:', error);
      }
    }
    
    // Reset after celebration
    setTimeout(() => {
      changeTofuMessage("you can<br>do it");
      showTotalHours();
      timerCompletedFlag = false;
      resetProgressBar();
    }, 5000);
    
    console.log('✅ Timer completed successfully!');
    
  } catch (error) {
    console.error('❌ Error completing timer:', error);
  }
}

// ROBUST SOUND SYSTEM
function playCompletionSound() {
  console.log('🔊 Trying to play completion sound...');
  
  // Strategy 1: HTML audio element
  const audioElement = document.getElementById('completionSound');
  if (audioElement) {
    console.log('🎵 Trying sound via HTML element...');
    audioElement.volume = 0.7;
    audioElement.currentTime = 0;
    
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('✅ Sound played via HTML element!');
        })
        .catch((error) => {
          console.log('❌ HTML element failed:', error);
          playBackupSound();
        });
    } else {
      playBackupSound();
    }
    return;
  }
  
  // Strategy 2: New Audio object
  try {
    console.log('🎵 Trying sound via Audio object...');
    const audio = new Audio('notification.mp3');
    audio.volume = 0.7;
    audio.play()
      .then(() => {
        console.log('✅ Sound played via Audio object!');
      })
      .catch(() => {
        console.log('❌ Audio object failed, trying backup...');
        playBackupSound();
      });
  } catch (e) {
    console.log('❌ Error in Audio object:', e);
    playBackupSound();
  }
}

function playBackupSound() {
  console.log('🔊 Playing backup sound...');
  
  // Strategy 3: Web Audio API
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Happy note sequence
    const notes = [
      { freq: 523.25, time: 0, duration: 0.2 },     // C5
      { freq: 659.25, time: 0.15, duration: 0.2 },  // E5
      { freq: 783.99, time: 0.3, duration: 0.3 },   // G5
      { freq: 1046.50, time: 0.5, duration: 0.4 }   // C6
    ];
    
    notes.forEach(note => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = note.freq;
      oscillator.type = 'sine';
      
      const startTime = audioContext.currentTime + note.time;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + note.duration);
    });
    
    console.log('✅ Sound played via Web Audio API!');
    
  } catch (error) {
    console.log('❌ Web Audio API failed:', error);
    
    // Strategy 4: Vibration as last resort
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 300]);
      console.log('📳 Vibration activated as final backup!');
    } else {
      console.log('❌ No sound/vibration method available');
    }
  }
}

// PROGRESS BAR SYSTEM
const PROGRESS_SEGMENTS = 15;

function initializeProgressBar() {
  const progressBar = document.querySelector('.progress-bar');
  if (!progressBar) return;
  
  progressBar.innerHTML = '';
  
  const segmentsContainer = document.createElement('div');
  segmentsContainer.className = 'progress-segments';
  
  for (let i = 0; i < PROGRESS_SEGMENTS; i++) {
    const segment = document.createElement('div');
    segment.className = 'progress-segment';
    segment.dataset.index = i;
    segmentsContainer.appendChild(segment);
  }
  
  progressBar.appendChild(segmentsContainer);
}

function updateProgressBar(currentSeconds, totalSeconds) {
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;
  const filledSegments = Math.floor((progress / 100) * PROGRESS_SEGMENTS);
  
  const segments = document.querySelectorAll('.progress-segment');
  const remainingSeconds = currentSeconds;
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  
  let segmentState = 'filled';
  if (remainingMinutes <= 1 && remainingSeconds > 30) {
    segmentState = 'filled warning';
  } else if (remainingSeconds <= 30 && remainingSeconds > 0) {
    segmentState = 'filled danger';
  }
  
  segments.forEach((segment, index) => {
    if (index < filledSegments) {
      segment.className = `progress-segment ${segmentState}`;
    } else {
      segment.className = 'progress-segment';
    }
  });
  
  // Update couple GIF position
  updateCoupleGifPosition(progress);
}

function resetProgressBar() {
  const segments = document.querySelectorAll('.progress-segment');
  segments.forEach(segment => {
    segment.className = 'progress-segment';
  });
}

function fillProgressBar() {
  const segments = document.querySelectorAll('.progress-segment');
  segments.forEach(segment => {
    segment.className = 'progress-segment filled';
  });
}

function showPixelLoadingAnimation() {
  const segments = document.querySelectorAll('.progress-segment');
  
  segments.forEach((segment, index) => {
    setTimeout(() => {
      segment.classList.add('loading');
      setTimeout(() => {
        segment.classList.remove('loading');
      }, 200);
    }, index * 30);
  });
}

// COUPLE GIF SYSTEM
function setupCoupleGif() {
  const coupleGif = document.getElementById('progressCoupleGif');
  if (!coupleGif) return;
  
  coupleGif.classList.add('active');
  coupleGif.style.display = 'block';
  coupleGif.style.left = '0px';
}

function updateCoupleGifPosition(progress) {
  const coupleGif = document.getElementById('progressCoupleGif');
  if (!coupleGif || !coupleGif.classList.contains('active')) return;
  
  requestAnimationFrame(() => {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;
    
    const barRect = progressBar.getBoundingClientRect();
    const containerRect = progressBar.parentElement.getBoundingClientRect();
    
    const barOffset = barRect.left - containerRect.left;
    const barInternalWidth = 194;
    const progressPosition = (progress / 100) * barInternalWidth;
    const finalPosition = barOffset + 3 + progressPosition;
    
    coupleGif.style.left = `${finalPosition}px`;
  });
}

function hideCoupleGif() {
  const coupleGif = document.getElementById('progressCoupleGif');
  if (!coupleGif) return;
  
  coupleGif.style.opacity = '0';
  setTimeout(() => {
    coupleGif.classList.remove('active');
    coupleGif.style.display = 'none';
    coupleGif.style.opacity = '1';
    coupleGif.style.left = '0px';
  }, 200);
}

// INTERFACE FUNCTIONS
function updateInterface(state) {
  console.log('🎨 Updating interface:', state);
  
  try {
    if (state === 'running') {
      elements.startButton.textContent = "STOP";
      elements.startButton.className = "stop-button";
      elements.timeInput.disabled = true;
      elements.timerDisplay.className = "timer-display running";
      showPixelLoadingAnimation();
    } else if (state === 'stopped') {
      elements.startButton.textContent = "START";
      elements.startButton.className = "";
      elements.timeInput.disabled = false;
      elements.timerDisplay.className = "timer-display";
      elements.timerDisplay.textContent = "00:00";
    } else if (state === 'completed') {
      elements.startButton.textContent = "START";
      elements.startButton.className = "";
      elements.timeInput.disabled = false;
      elements.timerDisplay.className = "timer-display completed";
    }
    
    console.log('✅ Interface updated');
  } catch (error) {
    console.error('❌ Error updating interface:', error);
  }
}

function updateTimerDisplay(seconds) {
  try {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    
    elements.timerDisplay.textContent = display;
    
    // Update style based on remaining time
    elements.timerDisplay.classList.remove("warning", "danger");
    
    const remainingMinutes = Math.floor(seconds / 60);
    if (remainingMinutes <= 1 && seconds > 30) {
      elements.timerDisplay.classList.add("warning");
    } else if (seconds <= 30 && seconds > 0) {
      elements.timerDisplay.classList.add("danger");
    }
    
  } catch (error) {
    console.error('❌ Error updating display:', error);
  }
}

function showMessage(text) {
  try {
    if (elements.message) {
      elements.message.textContent = text;
      console.log('💬 Message:', text);
    }
  } catch (error) {
    console.error('❌ Error showing message:', error);
  }
}

function changeTofuMessage(message) {
  try {
    if (elements.speechBubble) {
      elements.speechBubble.innerHTML = message;
    }
  } catch (error) {
    console.error('❌ Error changing Tofu message:', error);
  }
}

function createHeartParticles() {
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.className = 'heart-particle';
      heart.textContent = ['💕', '💖', '💗', '❤️'][Math.floor(Math.random() * 4)];
      heart.style.left = Math.random() * window.innerWidth + 'px';
      heart.style.top = Math.random() * window.innerHeight + 'px';
      document.body.appendChild(heart);
      
      setTimeout(() => heart.remove(), 2000);
    }, i * 150);
  }
}

function showTotalHours() {
  if (studyStats.totalHours > 0) {
    showMessage(`Focus time: ${studyStats.totalHours.toFixed(1)}h`);
  }
}

// TOFU GIF ANIMATION CONTROL
function setTofuGif(mood) {
  if (mood === 'idle' || mood === 'focusing') {
    tofuMood.current = mood;
    return;
  }
  
  if (mood === 'petted') {
    elements.tofuImage.src = 'tofu_petted.gif';
    tofuMood.current = mood;
    
    setTimeout(() => {
      elements.tofuImage.src = 'tofu_idle.gif';
      tofuMood.current = 'idle';
    }, 3000);
    return;
  }
  
  tofuMood.current = mood;
}

// REWARDS SYSTEM
function saveStudyProgress(hours) {
  const oldTotalHours = studyStats.totalHours;
  studyStats.totalHours += hours;
  studyStats.totalSessions += 1;
  studyStats.lastStudyDate = new Date().toLocaleDateString();
  
  const oldGifts = Math.floor(oldTotalHours);
  const newGifts = Math.floor(studyStats.totalHours);
  
  if (newGifts > oldGifts) {
    const giftsToGive = newGifts - oldGifts;
    for (let i = 0; i < giftsToGive; i++) {
      studyStats.giftsEarned++;
      
      const giftData = {
        id: studyStats.giftsEarned,
        photo: photoFiles[(studyStats.giftsEarned - 1) % photoFiles.length],
        message: encouragementMessages[Math.min(studyStats.giftsEarned - 1, encouragementMessages.length - 1)],
        receivedAt: new Date().toLocaleDateString()
      };
      studyStats.receivedGifts.push(giftData);
      
      showGiftNotification();
    }
  }
  
  // Save to localStorage
  localStorage.setItem('tofu_total_hours', studyStats.totalHours.toString());
  localStorage.setItem('tofu_total_sessions', studyStats.totalSessions.toString());
  localStorage.setItem('tofu_gifts_earned', studyStats.giftsEarned.toString());
  localStorage.setItem('tofu_last_study', studyStats.lastStudyDate);
  localStorage.setItem('tofu_received_gifts', JSON.stringify(studyStats.receivedGifts));
}

function showGiftNotification() {
  const giftNotification = document.getElementById('giftNotification');
  if (giftNotification) {
    giftNotification.classList.add('show');
    createHeartParticles();
    changeTofuMessage("Gift<br>for you! 🎁");
    
    setTimeout(() => {
      if (!timerState.isRunning) {
        changeTofuMessage("you can<br>do it");
      } else {
        changeTofuMessage("focusing!<br>💪");
      }
    }, 3000);
  }
}

// TO-DO LIST FUNCTIONS
function addTask() {
  console.log('📝 addTask() called');
  try {
    const taskInput = document.getElementById('taskInput');
    if (!taskInput) return;
    
    const taskText = taskInput.value.trim();
    if (taskText === '') return;
    
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
      createdAt: new Date().toLocaleDateString(),
      isMotivational: false
    };
    
    todoSystem.tasks.unshift(newTask);
    taskInput.value = '';
    saveTasks();
    renderTasks();
    
    // Chance to add motivational message
    if (Math.random() < 0.2) {
      setTimeout(() => addMotivationalMessage(), 2000);
    }
    
    console.log('✅ Task added:', taskText);
  } catch (error) {
    console.error('❌ Error adding task:', error);
  }
}

function addMotivationalMessage() {
  const recentTasks = todoSystem.tasks.slice(0, 3);
  if (recentTasks.some(task => task.isMotivational)) return;
  
  const motivationalText = todoSystem.motivationalMessages[
    Math.floor(Math.random() * todoSystem.motivationalMessages.length)
  ];
  
  const motivationalTask = {
    id: Date.now(),
    text: motivationalText,
    completed: false,
    createdAt: 'Motivational message 💖',
    isMotivational: true
  };
  
  todoSystem.tasks.unshift(motivationalTask);
  saveTasks();
  renderTasks();
  
  setTimeout(() => {
    changeTofuMessage("A<br>surprise! 💕");
    createHeartParticles();
  }, 500);
}

function toggleTask(taskId) {
  const task = todoSystem.tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    
    if (task.completed && Math.random() < 0.3) {
      setTimeout(() => addMotivationalMessage(), 1000);
    }
    
    saveTasks();
    renderTasks();
    console.log('✅ Task toggled:', task.text);
  }
}

function deleteTask(taskId) {
  todoSystem.tasks = todoSystem.tasks.filter(t => t.id !== taskId);
  saveTasks();
  renderTasks();
  console.log('🗑️ Task deleted');
}

function saveTasks() {
  localStorage.setItem('tofu_todo_tasks', JSON.stringify(todoSystem.tasks));
}

function renderTasks() {
  const tasksList = document.getElementById('tasksList');
  if (!tasksList) return;
  
  try {
    if (todoSystem.tasks.length === 0) {
      tasksList.innerHTML = `
        <div class="no-tasks">
          <div class="no-tasks-icon">📝</div>
          <div class="no-tasks-text">No tasks yet!<br>Add one above 😊</div>
        </div>
      `;
      return;
    }
    
    tasksList.innerHTML = todoSystem.tasks.map(task => `
      <div class="task-item ${task.completed ? 'completed' : ''} ${task.isMotivational ? 'romantic' : ''}">
        <div class="task-content">
          <div class="task-text">${escapeHtml(task.text)}</div>
          <div class="task-date">${escapeHtml(task.createdAt)}</div>
        </div>
        <div class="task-actions">
          <div class="task-checkbox" onclick="toggleTask(${task.id})">
            ${task.completed ? '✅' : '⭕'}
          </div>
          <div class="task-delete" onclick="deleteTask(${task.id})">
            🗑️
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('❌ Error rendering tasks:', error);
    tasksList.innerHTML = '<div class="no-tasks"><div class="no-tasks-text">Error loading tasks</div></div>';
  }
}

function toggleTodoList() {
  const todoPopup = document.getElementById('todoPopup');
  if (!todoPopup) return;
  
  const isVisible = todoPopup.classList.contains('show');
  
  if (isVisible) {
    todoPopup.classList.remove('show');
  } else {
    todoPopup.classList.add('show');
    renderTasks();
  }
}

// SCHEDULE MOTIVATIONAL MESSAGES
function scheduleMotivationalMessage() {
  const nextMessageIn = Math.random() * 15 * 60 * 1000 + 15 * 60 * 1000; // 15-30 min
  
  setTimeout(() => {
    const todoPopup = document.getElementById('todoPopup');
    if (!todoPopup.classList.contains('show')) {
      addMotivationalMessage();
    }
    scheduleMotivationalMessage(); // Schedule next
  }, nextMessageIn);
}

// STATISTICS FUNCTIONS
function showStatsPopup() {
  const popup = document.getElementById('statsPopup');
  if (!popup) return;
  
  document.getElementById('popupTotalHours').textContent = `${studyStats.totalHours.toFixed(1)}h`;
  document.getElementById('popupTotalSessions').textContent = studyStats.totalSessions;
  document.getElementById('popupGiftsEarned').textContent = studyStats.giftsEarned;
  document.getElementById('popupLastDate').textContent = studyStats.lastStudyDate || 'Never';
  
  popup.classList.add('show');
}

function closeStats() {
  const popup = document.getElementById('statsPopup');
  if (popup) popup.classList.remove('show');
}

function showGiftsGallery() {
  const galleryPopup = document.getElementById('giftsGalleryPopup');
  const galleryGrid = document.getElementById('giftsGalleryGrid');
  
  if (!galleryPopup || !galleryGrid) return;
  
  document.getElementById('statsPopup').classList.remove('show');
  
  try {
    if (studyStats.receivedGifts.length === 0) {
      galleryGrid.innerHTML = `
        <div class="no-gifts">
          <div class="no-gifts-icon">🎁</div>
          <div class="no-gifts-text">No photos yet!<br>Focus 1 hour to earn your first reward! 💕</div>
        </div>
      `;
    } else {
      galleryGrid.innerHTML = studyStats.receivedGifts.map((gift, index) => `
        <div class="gift-item" onclick="viewGift(${gift.id})">
          <div class="gift-item-number">#${gift.id}</div>
          <img src="${gift.photo}" alt="Reward ${gift.id}" class="gift-thumbnail" 
               onerror="handlePhotoError(this)">
          <div class="gift-info">
            <div class="gift-date">${escapeHtml(gift.receivedAt)}</div>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('❌ Error showing gallery:', error);
    galleryGrid.innerHTML = '<div class="no-gifts"><div class="no-gifts-text">Error loading gallery</div></div>';
  }
  
  galleryPopup.classList.add('show');
}

function viewGift(giftId) {
  try {
    const gift = studyStats.receivedGifts.find(g => g.id === giftId);
    if (!gift) return;
    
    const giftPhotoElement = document.getElementById('giftPhoto');
    if (giftPhotoElement) {
      giftPhotoElement.src = gift.photo;
      giftPhotoElement.onerror = function() {
        handlePhotoError(this);
      };
    }
    
    const giftMessageElement = document.getElementById('giftLoveMessage');
    if (giftMessageElement) {
      giftMessageElement.textContent = gift.message;
    }
    
    const giftPopup = document.getElementById('giftPopup');
    if (giftPopup) {
      giftPopup.classList.add('show');
    }
    
    document.getElementById('giftsGalleryPopup').classList.remove('show');
  } catch (error) {
    console.error('❌ Error viewing gift:', error);
  }
}

function closeGiftsGallery() {
  const popup = document.getElementById('giftsGalleryPopup');
  if (popup) popup.classList.remove('show');
}

function openGift() {
  const giftNotification = document.getElementById('giftNotification');
  if (giftNotification) {
    giftNotification.classList.remove('show');
  }
  
  const photoIndex = (studyStats.giftsEarned - 1) % photoFiles.length;
  const selectedPhoto = photoFiles[photoIndex];
  const selectedMessage = encouragementMessages[Math.min(studyStats.giftsEarned - 1, encouragementMessages.length - 1)];
  
  const giftPhotoElement = document.getElementById('giftPhoto');
  if (giftPhotoElement) {
    giftPhotoElement.src = selectedPhoto;
    giftPhotoElement.onerror = function() {
      handlePhotoError(this);
    };
  }
  
  const giftMessageElement = document.getElementById('giftLoveMessage');
  if (giftMessageElement) {
    giftMessageElement.textContent = selectedMessage;
  }
  
  const giftPopup = document.getElementById('giftPopup');
  if (giftPopup) {
    giftPopup.classList.add('show');
  }
  
  createHeartParticles();
}

function closeGift() {
  const popup = document.getElementById('giftPopup');
  if (popup) popup.classList.remove('show');
}

// UTILITY FUNCTIONS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function handlePhotoError(imgElement) {
  // Fallback to Tofu GIF if personal photos not found
  imgElement.src = 'tofu_idle.gif';
  imgElement.alt = 'Add your personal photos to web/personal_photos/ folder';
}

function checkPhotosExist() {
  const testImage = new Image();
  testImage.onerror = function() {
    console.log('📸 No personal photos found - user needs to add their own');
    // Show helpful message to user
    setTimeout(() => {
      if (!timerState.isRunning) {
        changeTofuMessage("Add your<br>photos! 📸");
        setTimeout(() => {
          changeTofuMessage("you can<br>do it");
        }, 3000);
      }
    }, 5000);
  };
  testImage.src = photoFiles[0];
}

// FUNCTIONS EXPOSED TO PYTHON
if (typeof eel !== 'undefined') {
  try {
    console.log('🔌 Exposing functions to Python...');
    
    // Function called by Python when timer finishes
    eel.expose(timer_finished);
    function timer_finished() {
      console.log('🎉 timer_finished() called by Python');
      completeTimer();
    }
    
    // Function called by Python to update display
    eel.expose(update_timer_display);
    function update_timer_display(seconds) {
      if (timerState.isRunning && seconds >= 0) {
        timerState.currentSeconds = seconds;
        updateTimerDisplay(seconds);
        updateProgressBar(seconds, timerState.totalSeconds);
      }
    }
    
    // Function called by Python when timer is stopped
    eel.expose(timer_stopped);
    function timer_stopped() {
      console.log('⏹️ timer_stopped() called by Python');
      if (timerState.isRunning) {
        stopTimer();
      }
    }
    
    console.log('✅ Functions exposed to Python');
  } catch (error) {
    console.error('❌ Error exposing functions:', error);
  }
}

// MAIN INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM loaded, initializing...');
  
  try {
    setTimeout(() => {
      console.log('🔄 Starting initialization...');
      
      if (!initializeElements()) {
        console.error('❌ Failed to initialize DOM elements');
        return;
      }
      
      // Set initial values
      elements.timerDisplay.textContent = "00:00";
      showTotalHours();
      
      // Setup event listeners
      if (elements.timeInput) {
        elements.timeInput.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            console.log('⌨️ Enter pressed');
            startFocus();
          }
        });
      }
      
      // Event listener for Tofu - WITH PETTING SYSTEM
      if (elements.tofuImage) {
        elements.tofuImage.addEventListener('click', function(e) {
          // Prevent double execution when there's double click
          if (tofuMood.clickTimeout) {
            clearTimeout(tofuMood.clickTimeout);
          }
          
          tofuMood.clickTimeout = setTimeout(() => {
            // Increment pet counter
            tofuMood.petCount++;
            tofuMood.lastPetTime = Date.now();
            
            // Different reactions based on pet count
            const petMessages = [
              "Leave me<br>alone!",
              "Stop<br>that! 😾",
              "Ok, ok...<br>it's nice 😽",
              "Meow<br>meow! 💕",
              "More<br>pets! 🥰",
              "I love you<br>too! 💖"
            ];
            
            const messageIndex = Math.min(tofuMood.petCount - 1, petMessages.length - 1);
            const currentMessage = petMessages[messageIndex];
            
            // Pet Tofu
            changeTofuMessage(currentMessage);
            createHeartParticles();
            
            // Only change to petted GIF if many pets
            if (tofuMood.petCount >= 3) {
              setTofuGif('petted'); // Will return automatically after 3s
            }
            
            // Reset counter after 10 seconds without petting
            setTimeout(() => {
              if (Date.now() - tofuMood.lastPetTime >= 10000) {
                tofuMood.petCount = 0;
              }
            }, 10000);
            
            setTimeout(() => {
              // Return to previous state
              if (timerState.isRunning) {
                changeTofuMessage("focusing!<br>💪");
                tofuMood.current = 'focusing';
              } else {
                changeTofuMessage("you can<br>do it");
                tofuMood.current = 'idle';
              }
            }, 2000);
            
          }, 200); // 200ms delay to distinguish from double click
        });
        
        // Double click on Tofu to see detailed statistics
        elements.tofuImage.addEventListener('dblclick', function(e) {
          // Cancel pending single click
          if (tofuMood.clickTimeout) {
            clearTimeout(tofuMood.clickTimeout);
            tofuMood.clickTimeout = null;
          }
          
          // Prevent single click from executing with double click
          e.preventDefault();
          
          // Show special message before statistics
          changeTofuMessage("My<br>stats! 📊");
          
          // Small delay to show message before popup
          setTimeout(() => {
            showStatsPopup();
          }, 500);
        });
      }
      
      // Event listener for gift
      const giftNotification = document.getElementById('giftNotification');
      if (giftNotification) {
        giftNotification.addEventListener('click', openGift);
      }
      
      // Event listener for Enter in task input
      const taskInput = document.getElementById('taskInput');
      if (taskInput) {
        taskInput.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            addTask();
          }
        });
      }
      
      // Initialize systems
      scheduleMotivationalMessage();
      setupGifLoop();
      
      // Make startFocus function globally available
      window.mainStartFocus = startFocus;
      
      console.log('✅ Initialization complete!');
      
    }, 500);
    
  } catch (error) {
    console.error('❌ Error during initialization:', error);
  }
});

// Final log when page loads
window.addEventListener('load', () => {
  console.log('🌐 Page completely loaded');
  console.log('🔍 EEL available:', typeof eel !== 'undefined');
  console.log('🎯 startFocus available:', typeof startFocus === 'function');
  
  // Check for photos after full load
  setTimeout(() => {
    checkPhotosExist();
  }, 2000);
});

console.log('🐱 Tofu Timer fully loaded! Created in loving memory of a special cat 💕');