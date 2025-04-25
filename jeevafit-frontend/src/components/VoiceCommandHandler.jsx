import React, { useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import commandMap from "../locales/HindiEnglishVocals";

const VoiceCommandHandler = ({ latest }) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  useEffect(() => {
    console.log("Latest vitals received:", latest);
  }, [latest]);
  useEffect(() => {
    const lower = transcript.toLowerCase();
    console.log("Transcript:", lower);
    const normalize = str => str.replace(/\s/g, "").toLowerCase();

const matchedLabel = Object.keys(commandMap).find(cmd =>
  normalize(lower).includes(normalize(cmd))
);
    console.log("Matched Label:", matchedLabel);

    if (matchedLabel && latest) {
      const vital = commandMap[matchedLabel];
      console.log("Mapped Vital Label:", vital);
      const matchedVital = [
        { label: "Heart Rate", value: latest.heartRate },
        { label: "SpO₂", value: latest.oxygenSaturation },
        { label: "Temperature", value: latest.bodyTemperature },
        { label: "Respiratory Rate", value: latest.respiratoryRate },
        { label: "Systolic BP", value: latest.systolicBP },
        { label: "Diastolic BP", value: latest.diastolicBP },
        { label: "HRV", value: latest.derived_HRV },
        { label: "BMI", value: latest.derived_BMI },
        { label: "Pulse Pressure", value: latest.derived_Pulse_Pressure },
        { label: "MAP", value: latest.derived_MAP }
      ].find(v => v.label === vital);
      console.log("Matched Vital Object:", matchedVital);
      if (matchedVital) {
        alert(`${matchedVital.label}: ${matchedVital.value}`);
        const message = `${matchedVital.label} is ${matchedVital.value}`;
        console.log("Speaking:", message);
        
        const utterance = new SpeechSynthesisUtterance(message);
        const isHindiCommand = matchedLabel.match(/[अ-ह]/) || matchedLabel.includes("batao");

utterance.lang = isHindiCommand ? "hi-IN" : "en-IN";

  window.speechSynthesis.speak(utterance);
        resetTranscript();
      }
    }
  }, [transcript, latest]);

  return (
    <div>
      <button onClick={SpeechRecognition.startListening}>
        🎤 Start Voice Command
      </button>
      <p>{listening ? "Listening..." : "Click the mic to start speaking"}</p>
      <p>Heard: {transcript}</p>
    </div>
  );
};

export default VoiceCommandHandler;
