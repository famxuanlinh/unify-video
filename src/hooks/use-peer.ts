'use client';

import { MEDIA_STATUS } from '@/constants';
import {
  useMainStore,
  useMessagingStore,
  usePeerStore,
  useSocketStore
} from '@/store';
import { MESSAGE_EVENTS } from '@/types';
import { log } from '@/utils';
import Peer, { MediaConnection } from 'peerjs';
import { useEffect, useState } from 'react';

import { peerConfig } from '@/lib';

import { useGetProfile } from './use-get-profile';

export function usePeer() {
  const {
    setError,
    setLoading,
    setReady,
    setStarted,
    setOnlineUsersCount,
    setWaitingForMatch,
    setIncomingUserInfo,
    setIsIncomingCameraOn,
    setIsIncomingMicOn,
    ready
  } = useMainStore();
  const { addMessage, clearMessages } = useMessagingStore();
  const {
    setLocalStream,
    setRemoteStream,
    localStream,
    setDataConnection,
    setMediaConnection,
    setPeerConnection,
    setPeer,
    clearPeer
  } = usePeerStore();
  const { socket: socketInit } = useSocketStore();
  const { handleGetProfile } = useGetProfile();

  const [myPeerId, setMyPeerId] = useState<string | null>(null);

  useEffect(() => {
    const socket = useSocketStore.getState().socket;
    if (!socket || socket?.connected) return;

    log('Setting up socket listeners');

    socket.on(
      MESSAGE_EVENTS.MATCH,
      ({
        peerId,
        userId,
        isCaller
      }: {
        peerId: string;
        userId: string;
        isCaller: boolean;
      }) => {
        log('Matched with peer:', peerId);
        handleGetProfile(userId);
        setWaitingForMatch(false);
        if (isCaller) {
          connectToPeer(peerId);
        }
      }
    );

    socket.on(MESSAGE_EVENTS.WAITING, () => {
      log('Waiting for a match...');
      setRemoteStream(null);
      setWaitingForMatch(true);
    });

    socket.on(MESSAGE_EVENTS.ONLINE, ({ count }: { count: number }) => {
      setOnlineUsersCount(count);
    });

    socket.on(MESSAGE_EVENTS.END, () => {
      log('Call ended');

      // end();
    });

    socket.on(MESSAGE_EVENTS.ERROR, ({ message }: { message: string }) => {
      if (message === 'No current match to skip') {
        setWaitingForMatch(true);

        return;
      }
      log('Error:', message);
      setError('Socket error');
    });

    return () => {
      log('Cleaning up socket listeners');
      Object.values(MESSAGE_EVENTS).forEach(event => socket.off(event));
    };
  }, [socketInit]);

  useEffect(() => {
    const socket = useSocketStore.getState().socket;

    if (!socket || socket?.connected) return;
    log('Socket is connected, setting up PeerJS');
    const peer = usePeerStore.getState().peer;
    if (peer) return;

    setPeer(peerConfig);

    peerConfig.on('open', id => {
      log('Peer open with ID:', id);
      setMyPeerId(id);
      setReady(true);
    });

    peerConfig.on('connection', conn => {
      setPeerConnection(conn);
      conn.on('data', rawData => {
        const data = rawData as {
          type?: MEDIA_STATUS;
          isCameraOn?: boolean;
          isMicOn?: boolean;
          text?: string;
        };

        if (
          data?.type === MEDIA_STATUS.CAMERA_STATUS &&
          data.isCameraOn !== undefined
        ) {
          setIsIncomingCameraOn(data.isCameraOn);

          return;
        }

        if (
          data?.type === MEDIA_STATUS.MIC_STATUS &&
          data.isMicOn !== undefined
        ) {
          setIsIncomingMicOn(data.isMicOn);

          return;
        }

        if (data?.text) {
          addMessage({ text: data.text, isMine: false });
        }
      });
      conn.on('close', () => {
        log('Data connection closed');

        clearMessages();
      });
    });

    peerConfig.on('call', call => {
      log('Incoming call from:', call.peer);
      answerCall(call);
    });

    peerConfig.on('error', err => {
      log('Peer error:', err);
      setError('Peer error');
    });

    return () => {
      if (peer && socket.connected) {
        console.log('Destroying Peer instance...');
        (peer as Peer).destroy();
        clearPeer();
      }
    };
  }, [socketInit]);

  const connectToPeer = (peerId: string) => {
    const peer = usePeerStore.getState().peer;
    if (!peer) return;

    try {
      const conn = peer.connect(peerId);
      setDataConnection(conn);

      // conn.on('open', () => log('Data connection opened'));
      // conn.on('data', data => {
      //   addMessage({ text: data as string, isMine: false });
      // });

      // conn.on('close', () => {
      //   log('Connection closed');
      //   clearMessages();
      // });

      makeCall(peerId);
    } catch (err) {
      log('Error connecting to peer:', err);
      setError('Error connecting to peer');
    }
  };

  const makeCall = (peerId: string) => {
    const socket = useSocketStore.getState().socket;
    const peer = usePeerStore.getState().peer;
    const stream = localStream?.id
      ? localStream
      : usePeerStore.getState().localStream;

    if (!stream?.id) {
      log('makeCall Local stream not available');
      setError('makeCall Local stream not available');

      return;
    }

    const call = peer?.call(peerId, stream);
    if (!call) return;

    call.on('stream', stream => {
      log('Remote stream received');
      setRemoteStream(stream);
    });

    call.on('close', () => {
      log('Remote stream received');
      socket?.emit(MESSAGE_EVENTS.SKIP);
      setIncomingUserInfo(null);
      clearMessages();
    });
    call.on('error', err => log('Call error:', err));

    setMediaConnection(call);
  };

  const answerCall = (call: MediaConnection) => {
    const socket = useSocketStore.getState().socket;
    const stream = localStream?.id
      ? localStream
      : usePeerStore.getState().localStream;

    if (!stream?.id) {
      log('Local stream not available');
      setError('makeCall Local stream not available');

      return;
    }

    call.answer(stream);

    call.on('stream', stream => {
      log('Remote stream received from answer');
      setRemoteStream(stream);
    });

    call.on('close', () => {
      log('Remote Call closed');
      socket?.emit(MESSAGE_EVENTS.SKIP);
      setIncomingUserInfo(null);
      clearMessages();
    });
    call.on('error', err => {
      log('Call error:', err);
    });
    setMediaConnection(call);
  };

  const startVideoStream = async (): Promise<boolean> => {
    setLoading(true);
    try {
      log('Requesting user media...');
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(videoStream);

      log('User media obtained successfully');
      setLoading(false);
      setStarted(true);

      return true;
    } catch (error) {
      log('Error getting user media:', error);
      setError('Error getting user media');
      setLoading(false);

      return false;
    }
  };

  const join = async () => {
    const socket = useSocketStore.getState().socket;
    if (!ready || !socket?.connect || !socket) {
      log('Not ready to join');
      setError('Not ready to join');

      return;
    }

    const streamInitialized = await startVideoStream();

    if (streamInitialized) {
      log('Joining with peer ID:', myPeerId);
      socket.emit('JOIN', { peerId: myPeerId });
    } else {
      log('Failed to join - stream not initialized');
      setError('Failed to join - stream not initialized');
    }
  };

  const skip = () => {
    setIncomingUserInfo(null);
    const dataConnection = usePeerStore.getState().dataConnection;
    const mediaConnection = usePeerStore.getState().mediaConnection;
    const peerConnection = usePeerStore.getState().peerConnection;

    if (dataConnection) {
      log('Closing data connection...');
      dataConnection.close();
      setDataConnection(null);
    }
    if (peerConnection) {
      log('Closing peer connection...');
      peerConnection.close();
      setPeerConnection(null);
    }

    if (mediaConnection) {
      log('Closing media connection...');
      mediaConnection.close();
      setMediaConnection(null);
    }
  };

  const send = (data: {
    type?: MEDIA_STATUS;
    isCameraOn?: boolean;
    isMicOn?: boolean;
    text?: string;
  }) => {
    const peerConnection = usePeerStore.getState().peerConnection;
    const dataConnection = usePeerStore.getState().dataConnection;

    if (data.text) {
      addMessage({ text: data.text, isMine: true });
    }

    if (dataConnection) {
      dataConnection.send(data);
    }
    if (peerConnection) {
      peerConnection.send(data);
    }
  };

  const end = () => {
    window.location.reload();
    // const socket = useSocketStore.getState().socket;
    // socket?.emit(MESSAGE_EVENTS.END);

    // const peer = usePeerStore.getState().peer;
    // socket?.emit(MESSAGE_EVENTS.END);

    // if (peer) {
    //   peer.destroy(); // Close WebRTC connection
    // }

    // if (localStream) {
    //   localStream.getTracks().forEach(track => track.stop());
    // }

    // setLoading(false);
    // setStarted(false);
    // setWaitingForMatch(false);
    // setRemoteStream(null);
    // setLocalStream(null);
  };

  return {
    join,
    skip,
    send,
    end
  };
}
