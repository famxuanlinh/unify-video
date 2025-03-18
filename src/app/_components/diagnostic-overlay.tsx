'use client';

import { useSocketIO } from '@/hooks/use-socket-io';
import { useMainStore, usePeerStore } from '@/store';
import React, { useState, useEffect } from 'react';

export const DiagnosticOverlay = () => {
  const { onlineUsersCount, waitingForMatch } = useMainStore();

  const [isVisible, setIsVisible] = useState(false);
  const { isConnected } = useSocketIO();
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
      setDiagnosticInfo(prev => ({
        ...prev,
        browserInfo: navigator.userAgent,
        webRTCSupport: !!window.RTCPeerConnection,
        mediaDevicesSupport: !!navigator.mediaDevices
      }));
    }
  }, []);

  const { localStreamRef, remoteStreamRef } = usePeerStore();

  useEffect(() => {
    // Update diagnostic info every second
    const interval = setInterval(() => {
      setDiagnosticInfo(prev => ({
        ...prev,
        localStreamStatus: localStreamRef ? 'Active' : 'Not initialized',
        remoteStreamStatus: remoteStreamRef ? 'Connected' : 'Not connected'
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [localStreamRef, remoteStreamRef]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="absolute top-16 right-2 z-999 cursor-pointer rounded bg-blue-500 px-2 py-1 text-xs text-white md:top-2"
      >
        Show Diagnostics
      </button>
    );
  }

  return (
    <div className="bg-opacity-80 absolute top-0 right-0 z-9999 m-2 max-w-md rounded bg-black p-4 text-white">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-bold">Connection Diagnostics</h3>
        <div className="flex gap-2">
          <button
            onClick={toggleVisibility}
            className="rounded bg-red-500 px-2 py-1 text-xs text-white"
          >
            Close
          </button>
        </div>
      </div>

      <div className="space-y-1 text-sm">
        <p>
          <strong>Socket IO Ready:</strong> {isConnected ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Online Users:</strong> {onlineUsersCount}
        </p>
        <p>
          <strong>Waiting for Match:</strong> {waitingForMatch ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>WebRTC Support:</strong>{' '}
          {diagnosticInfo.webRTCSupport ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Media Devices:</strong>{' '}
          {diagnosticInfo.mediaDevicesSupport ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Local Stream:</strong> {diagnosticInfo.localStreamStatus}
        </p>
        <p>
          <strong>Remote Stream:</strong> {diagnosticInfo.remoteStreamStatus}
        </p>
        <p className="mt-2 text-xs break-all text-gray-400">
          <strong>Browser:</strong> {diagnosticInfo.browserInfo}
        </p>
      </div>
    </div>
  );
};
