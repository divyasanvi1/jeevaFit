// utils/bluetoothUtils.js
import { SERVICE_UUID, CHARACTERISTIC_UUIDS } from './bluetoothUUID';

export async function connectAndReadVitals() {
    console.log("SERVICE_UUID",SERVICE_UUID);
    if (!navigator.bluetooth) {
        alert('Web Bluetooth API is not supported on this device/browser.');
        return;
      }
      
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [SERVICE_UUID] }],
    });
    console.log('Device selected:', device.name);
    const server = await device.gatt.connect();
    console.log('Connected to GATT server.');
    const service = await server.getPrimaryService(SERVICE_UUID);

    const vitals = {};

    for (const [key, uuid] of Object.entries(CHARACTERISTIC_UUIDS)) {
      try {
        const characteristic = await service.getCharacteristic(uuid);
        const value = await characteristic.readValue();
        const rawArray = new Uint8Array(value.buffer);
        console.log(`📡 [${key}] Raw bytes:`, rawArray);

        // Safe string decoding
        const decoded = new TextDecoder().decode(value.buffer).trim();
        if (!decoded) {
          console.warn(`⚠️ Skipping ${key} — empty value received`);
          continue;
        }

        switch (key) {
          case 'heartRate':
          case 'respiratoryRate':
          case 'oxygenSaturation':
          case 'systolicBP':
          case 'diastolicBP':
            vitals[key] = parseFloat(decoded);
            break;

          case 'bodyTemperature':
          case 'derived_HRV':
            vitals[key] = parseFloat(decoded);
            break;

          default:
            console.warn(`🔍 Unknown vital key: ${key}`);
        }
      } catch (charErr) {
        console.error(`❌ Failed to read characteristic for ${key}:`, charErr.message);
      }
    }

    // Optional: compute derived values here or in backend
    if (vitals.systolicBP != null && vitals.diastolicBP != null) {
      vitals.derived_MAP = parseFloat(
        ((2 * vitals.diastolicBP + vitals.systolicBP) / 3).toFixed(2)
      );
      vitals.derived_Pulse_Pressure = parseFloat(
        (vitals.systolicBP - vitals.diastolicBP).toFixed(2)
      );
    }
    return vitals;

  } catch (error) {
    if (error.name === 'NotFoundError') {
        alert('No Bluetooth device selected.');
      } else {
        alert('Failed to connect to Bluetooth device.');
      }
      throw error;
  }
}

