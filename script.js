// Security configuration
const SECURITY_CONFIG = {
    hashAlgorithm: 'SHA-256',
    encryptionKey: 'your-secret-key-here', // In production, this should be stored securely
    maxLoginAttempts: 3,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
};

// Device states
const deviceStates = {
    cctv: {
        isActive: false,
        isRecording: false,
        stream: null,
        mediaRecorder: null,
        recordedChunks: []
    },
    light: {
        isOn: false,
        schedule: {
            onTime: null,
            offTime: null
        }
    },
    motion: {
        isActive: false,
        triggers: {
            cctv: false,
            light: false
        }
    }
};

// Authentication state
let authState = {
    isAuthenticated: false,
    loginAttempts: 0,
    sessionStart: null
};

// Security log
const securityLog = [];

// Utility functions for security
function hashPassword(password) {
    // In a real application, this would use a proper hashing algorithm
    return btoa(password); // Basic encoding for demo purposes
}

function encryptData(data) {
    // In a real application, this would use proper encryption
    return btoa(JSON.stringify(data));
}

function decryptData(encryptedData) {
    // In a real application, this would use proper decryption
    return JSON.parse(atob(encryptedData));
}

function addSecurityLog(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        message,
        type
    };
    securityLog.push(logEntry);
    updateLogDisplay();
}

function updateLogDisplay() {
    const logContainer = document.getElementById('log-container');
    logContainer.innerHTML = securityLog
        .map(log => `<div class="log-entry ${log.type}">[${log.timestamp}] ${log.message}</div>`)
        .join('');
    logContainer.scrollTop = logContainer.scrollHeight;
}

// Authentication functions
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (authState.loginAttempts >= SECURITY_CONFIG.maxLoginAttempts) {
        addSecurityLog('Too many login attempts. Account locked.', 'error');
        return;
    }

    // Simple authentication for demo purposes
    if (username === 'admin' && password === 'admin123') {
        authState.isAuthenticated = true;
        authState.sessionStart = Date.now();
        authState.loginAttempts = 0;
        addSecurityLog('User logged in successfully', 'success');
        enableDeviceControls();
    } else {
        authState.loginAttempts++;
        addSecurityLog(`Failed login attempt. ${SECURITY_CONFIG.maxLoginAttempts - authState.loginAttempts} attempts remaining.`, 'warning');
    }
}

function checkSession() {
    if (!authState.isAuthenticated) return;
    
    if (Date.now() - authState.sessionStart > SECURITY_CONFIG.sessionTimeout) {
        logout();
        addSecurityLog('Session expired', 'warning');
    }
}

function logout() {
    authState.isAuthenticated = false;
    authState.sessionStart = null;
    disableDeviceControls();
    addSecurityLog('User logged out', 'info');
}

function enableDeviceControls() {
    document.querySelectorAll('.device-card button').forEach(button => {
        button.disabled = false;
    });
}

function disableDeviceControls() {
    document.querySelectorAll('.device-card button').forEach(button => {
        button.disabled = true;
    });
}

// CCTV functions
async function toggleCCTV() {
    if (!authState.isAuthenticated) return;

    deviceStates.cctv.isActive = !deviceStates.cctv.isActive;
    const statusElement = document.getElementById('cctv-status');
    
    if (deviceStates.cctv.isActive) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            document.getElementById('camera-feed').srcObject = stream;
            deviceStates.cctv.stream = stream;
            statusElement.textContent = 'Online';
            addSecurityLog('CCTV activated', 'success');
        } catch (error) {
            deviceStates.cctv.isActive = false;
            statusElement.textContent = 'Error';
            addSecurityLog('Failed to activate CCTV: ' + error.message, 'error');
        }
    } else {
        if (deviceStates.cctv.stream) {
            deviceStates.cctv.stream.getTracks().forEach(track => track.stop());
        }
        document.getElementById('camera-feed').srcObject = null;
        statusElement.textContent = 'Offline';
        addSecurityLog('CCTV deactivated', 'info');
    }
}

function startRecording() {
    if (!deviceStates.cctv.isActive || !deviceStates.cctv.stream) return;

    deviceStates.cctv.recordedChunks = [];
    deviceStates.cctv.mediaRecorder = new MediaRecorder(deviceStates.cctv.stream);
    
    deviceStates.cctv.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            deviceStates.cctv.recordedChunks.push(event.data);
        }
    };

    deviceStates.cctv.mediaRecorder.start();
    deviceStates.cctv.isRecording = true;
    addSecurityLog('CCTV recording started', 'success');
}

function stopRecording() {
    if (!deviceStates.cctv.isRecording) return;

    deviceStates.cctv.mediaRecorder.stop();
    deviceStates.cctv.isRecording = false;
    
    const blob = new Blob(deviceStates.cctv.recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording-${new Date().toISOString()}.webm`;
    a.click();
    
    addSecurityLog('CCTV recording saved', 'success');
}

// Smart Light functions
function toggleLight() {
    if (!authState.isAuthenticated) return;

    deviceStates.light.isOn = !deviceStates.light.isOn;
    const statusElement = document.getElementById('light-status');
    statusElement.textContent = deviceStates.light.isOn ? 'On' : 'Off';
    addSecurityLog(`Light ${deviceStates.light.isOn ? 'turned on' : 'turned off'}`, 'info');
}

function setLightSchedule() {
    if (!authState.isAuthenticated) return;

    const onTime = document.getElementById('light-on-time').value;
    const offTime = document.getElementById('light-off-time').value;

    if (!onTime || !offTime) {
        addSecurityLog('Invalid schedule times', 'warning');
        return;
    }

    deviceStates.light.schedule = { onTime, offTime };
    addSecurityLog(`Light schedule set: ${onTime} - ${offTime}`, 'success');
}

// Motion Detector functions
function toggleMotionDetector() {
    if (!authState.isAuthenticated) return;

    deviceStates.motion.isActive = !deviceStates.motion.isActive;
    const statusElement = document.getElementById('motion-status');
    statusElement.textContent = deviceStates.motion.isActive ? 'Active' : 'Inactive';
    addSecurityLog(`Motion detector ${deviceStates.motion.isActive ? 'activated' : 'deactivated'}`, 'info');
}

function updateMotionTriggers() {
    if (!authState.isAuthenticated) return;

    deviceStates.motion.triggers.cctv = document.getElementById('trigger-cctv').checked;
    deviceStates.motion.triggers.light = document.getElementById('trigger-light').checked;
    addSecurityLog('Motion detector triggers updated', 'info');
}

// Simulate motion detection
function simulateMotion() {
    if (!deviceStates.motion.isActive) return;

    addSecurityLog('Motion detected!', 'warning');
    
    if (deviceStates.motion.triggers.cctv && !deviceStates.cctv.isActive) {
        toggleCCTV();
    }
    
    if (deviceStates.motion.triggers.light && !deviceStates.light.isOn) {
        toggleLight();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    disableDeviceControls();
    addSecurityLog('System initialized', 'info');
    
    // Set up event listeners
    document.getElementById('trigger-cctv').addEventListener('change', updateMotionTriggers);
    document.getElementById('trigger-light').addEventListener('change', updateMotionTriggers);
    
    // Simulate random motion detection
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance of motion detection
            simulateMotion();
        }
    }, 5000);
    
    // Check session timeout
    setInterval(checkSession, 60000);
});