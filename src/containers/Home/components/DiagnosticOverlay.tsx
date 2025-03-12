'use client';

import useMainStore from '@/store/mainProvider';
import usePeerStore from '@/store/peerProvider';
import React, { useState, useEffect } from 'react';

import LoginButton from '@/components/LoginButton';

export const DiagnosticOverlay = () => {
  const { ready, onlineUsersCount, waitingForMatch } = useMainStore();
  const [isVisible, setIsVisible] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState({
    browserInfo: '',
    webRTCSupport: false,
    mediaDevicesSupport: false,
    wsStatus: 'Unknown',
    peerStatus: 'Unknown',
    localStreamStatus: 'Not initialized',
    remoteStreamStatus: 'Not connected'
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDiagnosticInfo((prev) => ({
        ...prev,
        browserInfo: navigator.userAgent,
        webRTCSupport: !!window.RTCPeerConnection,
        mediaDevicesSupport: !!navigator.mediaDevices
      }));
    }
  }, []);

  const { localStream, remoteStream } = usePeerStore();

  useEffect(() => {
    // Update diagnostic info every second
    const interval = setInterval(() => {
      setDiagnosticInfo((prev) => ({
        ...prev,
        localStreamStatus: localStream ? 'Active' : 'Not initialized',
        remoteStreamStatus: remoteStream ? 'Connected' : 'Not connected'
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [localStream, remoteStream]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="absolute top-2 z-999 cursor-pointer right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
      >
        Show Diagnostics
      </button>
    );
  }

  return (
    <div className="absolute top-0 right-0 bg-black bg-opacity-80 text-white p-4 m-2 rounded max-w-md z-9999">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">Connection Diagnostics</h3>
        <div className="flex gap-2">
          <button
            onClick={toggleVisibility}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
          >
            Close
          </button>
          <LoginButton />
        </div>
      </div>

      <div className="text-sm space-y-1">
        <p>
          <strong>WebSocket Ready:</strong> {ready ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Online Users:</strong> {onlineUsersCount}
        </p>
        <p>
          <strong>Waiting for Match:</strong> {waitingForMatch ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>WebRTC Support:</strong> {diagnosticInfo.webRTCSupport ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Media Devices:</strong> {diagnosticInfo.mediaDevicesSupport ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Local Stream:</strong> {diagnosticInfo.localStreamStatus}
        </p>
        <p>
          <strong>Remote Stream:</strong> {diagnosticInfo.remoteStreamStatus}
        </p>
        <p className="text-xs mt-2 text-gray-400 break-all">
          <strong>Browser:</strong> {diagnosticInfo.browserInfo}
        </p>
      </div>
    </div>
  );
};
