import { AlertTriangle } from "lucide-react";

export default function FatalAlertPopup({ data }) {
  const { values, reason } = data;

  return (
    <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 shadow-lg rounded-md z-50 max-w-sm">
      <div className="flex items-start gap-2">
        <AlertTriangle className="text-red-600 mt-1" size={24} />
        <div>
          <p className="font-bold">⚠️ Fatal Health Alert</p>
          <p className="text-sm">{reason}</p>
          <ul className="mt-2 text-sm list-disc pl-5">
            {Object.entries(values).map(([key, value]) => (
              <li key={key}>
                {key}: <strong>{value}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
