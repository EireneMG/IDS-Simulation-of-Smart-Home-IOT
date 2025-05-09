# Smart IoT IDS Simulation

A web-based simulation of a Smart IoT Intrusion Detection System (IDS) that demonstrates the interaction between various IoT devices and security features.

## Features

### IoT Devices
- **Smart CCTV**
  - Live camera feed
  - Recording capability
  - Motion-triggered activation
- **Smart Light**
  - On/Off control
  - Schedule-based automation
  - Motion-triggered activation
- **Motion Detector**
  - Motion detection simulation
  - Triggers for CCTV and Light
  - Configurable triggers

### Security Features
- **Authentication & Access Control**
  - Username/password authentication
  - Session management
  - Maximum login attempts
  - Session timeout
- **Security Logging**
  - Real-time event logging
  - Different log levels (info, warning, error, success)
  - Timestamp tracking
- **Data Protection**
  - Basic encryption/decryption simulation
  - Password hashing simulation
  - Secure session management

## Implementation Details

### Development Tools
- HTML5
- CSS3
- JavaScript (ES6+)
- Web APIs (MediaRecorder, getUserMedia)

### Security Technologies
1. **Cryptography**
   - Basic encryption/decryption simulation
   - Password hashing simulation
   - Secure key management

2. **Authentication & Access Control**
   - Role-based access control (Admin access)
   - Session-based authentication
   - Login attempt limiting

3. **Network Security**
   - Secure data transmission simulation
   - Session timeout implementation
   - Access control validation

4. **Data Integrity**
   - Event logging with timestamps
   - State management
   - Secure data storage simulation

5. **Intrusion Detection**
   - Motion detection simulation
   - Automated response system
   - Security event logging

## Getting Started

1. Clone the repository
2. Open `index.html` in a modern web browser
3. Login with the following credentials:
   - Username: `admin`
   - Password: `admin123`

## Usage

1. **Smart CCTV**
   - Click "Toggle CCTV" to start/stop the camera feed
   - Use "Start Recording" to begin recording
   - Use "Stop Recording" to save the recording

2. **Smart Light**
   - Click "Toggle Light" to turn the light on/off
   - Set schedule using the time inputs
   - Click "Set Schedule" to apply the schedule

3. **Motion Detector**
   - Click "Toggle Motion Detector" to activate/deactivate
   - Configure triggers using checkboxes
   - Monitor the security log for motion events

## Browser Compatibility

The simulation works best in modern browsers that support:
- MediaRecorder API
- getUserMedia API
- ES6+ features

## License

This project is for educational purposes only. 