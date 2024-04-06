// components/ui/VoicePermissionAlert.tsx
"use client"
import React, { useEffect,useState } from 'react';
import './VoicePermissionAlertStyle.css';

interface VoicePermissionAlertProps {
  requestMicPermission: () => void;
}

interface VoicePermissionAlertProps {
  requestMicPermission: () => void;
  onClose: () => void; // Handler for closing the alert
}

const VoicePermissionAlert: React.FC<VoicePermissionAlertProps> = ({
  requestMicPermission,
  onClose
}) => {
  const fullText =
    'Hello, I am iBrain, and this website is enhanced with voice. I want to talk with you to introduce myself. Please see the button to enable your microphone and allow us to communicate.';
  const [index, setIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false); // State to control button visibility

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((currentIndex) => {
        if (currentIndex < fullText.length) {
          return currentIndex + 1;
        } else {
          clearInterval(interval);
          setShowButtons(true); // Show buttons after the text animation completes
          return currentIndex;
        }
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 fade-in">
      <div className="bg-blue-600 text-white p-6 rounded-lg w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto">
        <div className="space-y-4">
          <p className="text-justify text-lg md:text-xl lg:text-2xl">
            {fullText.substring(0, index)}
          </p>
        </div>
        {showButtons && (
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={requestMicPermission}
              className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-lg md:text-xl fade-in"
            >
              Enable Microphone
            </button>
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded text-lg md:text-xl fade-in"
            >
              Refuse
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoicePermissionAlert;
