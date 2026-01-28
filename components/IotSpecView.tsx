
import React from 'react';

const IotSpecView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <i className="fas fa-microchip"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800">ESP32 Firmware Logic</h3>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-slate-300 overflow-x-auto max-h-[500px] overflow-y-auto">
            <pre>{`// GreenPoints Smart Bin Firmware v1.0
#include <WiFi.h>
#include <HTTPClient.h>
#include <ESP32Servo.h>

const int IR_SENSOR_PIN = 34;
const int SERVO_PIN = 18;
const int TRIGGER_PIN = 5;
const int ECHO_PIN = 17;

Servo bottleGate;

void setup() {
  Serial.begin(115200);
  setupWiFi();
  bottleGate.attach(SERVO_PIN);
  bottleGate.write(0); // Closed
}

void loop() {
  if (detectBottle()) {
    if (validateBottleWeight()) {
      acceptBottle();
      sendBottleDataToCloud();
    } else {
      rejectBottle();
    }
  }
  delay(100);
}

bool detectBottle() {
  // Ultrasonic/IR check
  return analogRead(IR_SENSOR_PIN) < 500;
}

void acceptBottle() {
  bottleGate.write(90); // Open
  delay(2000);
  bottleGate.write(0);  // Close
}

void sendBottleDataToCloud() {
  HTTPClient http;
  http.begin("https://api.greenpoints.edu/v1/collect");
  http.addHeader("Content-Type", "application/json");
  http.POST("{\\"machineId\\":\\"BIN-01\\",\\"status\\":\\"success\\"}");
  http.end();
}`}</pre>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
             <i className="fas fa-cogs mr-3 text-slate-400"></i> Hardware Schematic
          </h3>
          <div className="space-y-4">
            <HardwareItem 
              title="Microcontroller" 
              desc="ESP32-WROOM-32" 
              details="Dual-core, WiFi, BT, low-power mode for sleep cycles."
            />
            <HardwareItem 
              title="Sensors" 
              desc="Ultrasonic (HC-SR04) + Load Cell" 
              details="Ultrasonic detects proximity. Load cell (HX711) validates weight (prevents fake objects)."
            />
            <HardwareItem 
              title="Identification" 
              desc="QR Scanner / RFID RC522" 
              details="Allows students to scan their digital ID from the Flutter app before insertion."
            />
             <HardwareItem 
              title="Actuators" 
              desc="MG996R High Torque Servo" 
              details="Controls the heavy-duty flap to accept or reject objects."
            />
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
            <div className="flex items-center space-x-2 text-yellow-800 font-bold mb-2">
              <i className="fas fa-shield-alt"></i>
              <span>Anti-Cheat Logic</span>
            </div>
            <ul className="text-xs text-yellow-700 space-y-2 list-disc ml-4">
              <li>Weight profiling: Only objects between 15g and 50g are accepted.</li>
              <li>Dual-Sensor Verification: IR and Ultrasonic must both trigger within 200ms.</li>
              <li>Rate Limiting: Maximum 5 bottles per minute per user.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

const HardwareItem: React.FC<{title: string; desc: string; details: string}> = ({title, desc, details}) => (
  <div className="border-l-4 border-slate-100 pl-4 py-1">
    <div className="flex justify-between items-baseline">
      <span className="text-sm font-bold text-slate-800">{title}</span>
      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{desc}</span>
    </div>
    <p className="text-xs text-slate-500 mt-1">{details}</p>
  </div>
);

export default IotSpecView;
