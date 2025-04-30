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
      const characteristic = await service.getCharacteristic(uuid);
      console.log(`Characteristic for ${key} found:`, characteristic);
      const value = await characteristic.readValue();
      console.log(`Raw value for ${key}:`, value);
      const rawData = value; // The DataView for diastolicBP
const rawArray = new Uint8Array(rawData.buffer);
console.log(`Raw bytes for diastolicBP:`, rawArray);
console.log("Decoded value using getUint16(0, true):", rawData.getUint16(0, true)); // Little-endian

      // Parse based on expected data size/type per vital
      switch (key) {
        case 'heartRate':
        case 'respiratoryRate':
        case 'oxygenSaturation':
        case 'systolicBP':
        case 'diastolicBP':
          // All are ASCII-encoded integers
          {
            const strValue = new TextDecoder().decode(value.buffer);
            vitals[key] = parseInt(strValue, 10);
          }
          break;
      
        case 'bodyTemperature':
            case 'derived_HRV':
          // ASCII-encoded float like "36.5"
          {
            const strValue = new TextDecoder().decode(value.buffer);
            vitals[key] = parseFloat(strValue);
          }
          break;
      
        default:
          console.warn(`Unknown characteristic key: ${key}`);
      }
      
    }

    // Optional: compute derived values here or in backend
    vitals.derived_MAP = parseFloat(((vitals.systolicBP + 2 * vitals.diastolicBP) / 3).toFixed(2));
vitals.derived_Pulse_Pressure = parseFloat((vitals.systolicBP - vitals.diastolicBP).toFixed(2));

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

