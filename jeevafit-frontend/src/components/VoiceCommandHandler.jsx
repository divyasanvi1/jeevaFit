import React, { useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import commandMap from "../locales/HindiEnglishVocals";
import vitalRanges from "../utils/vitalRanges";

const VoiceCommandHandler = ({ latest,gender }) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  useEffect(() => {
    console.log("Latest vitals received:", latest);
    console.log("Gender received:", gender);
  }, [latest, gender]);

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
        const genderKey = gender?.toLowerCase() === "female" ? "female" : "male";
        const range = vitalRanges[vital]?.[genderKey];
        const unit = vitalRanges[vital]?.unit || "";
        const isHindiCommand = matchedLabel.match(/[अ-ह]/) || matchedLabel.includes("batao");
        alert(`${matchedVital.label}: ${matchedVital.value}`);
        let message = `${vital} is ${matchedVital.value} ${unit}.`;

        if (range) {
          const genderWord = genderKey === "female" ? "mahila" : "purush";
          if (isHindiCommand) {
            message += `. Saamaanya maan ${genderWord} k liye ${range.min} se ${range.max} ${unit} ke beech hona chahiye.`;
          } else {
            message += `. Normal range for ${genderKey} is ${range.min} to ${range.max} ${unit}.`;
          }
        }

        alert(message);
        console.log("Speaking:", message);
        
        console.log("Speaking:", message);
        
        const utterance = new SpeechSynthesisUtterance(message);
       

utterance.lang = isHindiCommand ? "hi-IN" : "en-IN";

  window.speechSynthesis.speak(utterance);
        resetTranscript();
      }
    }
  }, [transcript, latest]);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md mt-6">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">
    🎤 Voice Command Assistant
  </h3>
  <button
    onClick={SpeechRecognition.startListening}
    className="px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-200 shadow"
  >
    🎤 Start Voice Command
  </button>
  <div className="mt-4 text-sm text-gray-700">
    <p className="mb-1">
      {listening ? (
        <span className="text-green-600 font-medium">Listening...</span>
      ) : (
        "Click the mic to start speaking"
      )}
    </p>
    <p>
      <span className="font-medium text-gray-900">Heard:</span> {transcript}
    </p>
  </div>
</div>

  );
};

export default VoiceCommandHandler;
