'use client';

import { useMainStore, useMessagingStore, usePeerStore } from '@/store';
import { MESSAGE_EVENTS } from '@/types';
import { log } from '@/utils';
import Peer, { MediaConnection } from 'peerjs';
import { useEffect, useState } from 'react';

import { peerConfig } from '@/lib';

import { useSocketIO } from './use-socket-io';

export function usePeer() {
  const {
    setError,
    setLoading,
    setReady,
    setStarted,
    setOnlineUsersCount,
    setWaitingForMatch,
    ready
  } = useMainStore();
  const { addMessage, clearMessages } = useMessagingStore();
  const {
    setLocalStream: setLocalStreamRef,
    setRemoteStream: setRemoteStreamRef,
    localStream: localStreamRef,
    setDataConnection: setDataConnectionRef,
    setMediaConnection: setMediaConnectionRef,
    setPeerConnection: setPeerConnectionRef,
    setPeer,
    clearPeer
  } = usePeerStore();
  const { socket, isConnected } = useSocketIO();

  const [myPeerId, setMyPeerId] = useState<string | null>(null);

  useEffect(() => {
    if (!socket || !isConnected) return;

    log('Setting up socket listeners');

    socket.on(MESSAGE_EVENTS.MATCH, ({ peerId }: { peerId: string }) => {
      log('Matched with peer:', peerId);
      setWaitingForMatch(false);
      connectToPeer(peerId);
    });

    socket.on(MESSAGE_EVENTS.WAITING, () => {
      log('Waiting for a match...');
      setRemoteStreamRef(null);
      setWaitingForMatch(true);
    });

    socket.on(MESSAGE_EVENTS.ONLINE, ({ count }: { count: number }) => {
      setOnlineUsersCount(count);
    });

    socket.on(MESSAGE_EVENTS.END, () => {
      log('Call ended');
      end();
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
  }, [socket, isConnected]);

  useEffect(() => {
    if (!isConnected || !socket) return;
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
      setPeerConnectionRef(conn);
      conn.on('data', data =>
        addMessage({ text: data as string, isMine: false })
      );
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
      if (peer) {
        console.log('Destroying Peer instance...');
        (peer as Peer).destroy();
        clearPeer();
      }
    };
  }, [isConnected, socket]);

  const connectToPeer = (peerId: string) => {
    const peer = usePeerStore.getState().peer;
    if (!peer) return;

    try {
      const conn = peer.connect(peerId);
      setDataConnectionRef(conn);

      conn.on('open', () => log('Data connection opened'));
      conn.on('data', data => {
        addMessage({ text: data as string, isMine: false });
      });

      conn.on('close', () => {
        log('Connection closed');
        clearMessages();
      });

      makeCall(peerId);
    } catch (err) {
      log('Error connecting to peer:', err);
      setError('Error connecting to peer');
    }
  };

  const makeCall = (peerId: string) => {
    const peer = usePeerStore.getState().peer;
    const stream = localStreamRef?.id
      ? localStreamRef
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
      setRemoteStreamRef(stream);
    });

    call.on('close', () => {
      log('Remote stream received');
      socket?.emit(MESSAGE_EVENTS.SKIP);
    });
    call.on('error', err => log('Call error:', err));

    setMediaConnectionRef(call);
  };

  const answerCall = (call: MediaConnection) => {
    const stream = localStreamRef?.id
      ? localStreamRef
      : usePeerStore.getState().localStream;

    if (!stream?.id) {
      log('Local stream not available');
      setError('makeCall Local stream not available');

      return;
    }

    call.answer(stream);

    call.on('stream', stream => {
      log('Remote stream received from answer');
      setRemoteStreamRef(stream);
    });

    call.on('close', () => {
      log('Remote Call closed');
      socket?.emit(MESSAGE_EVENTS.SKIP);
    });
    call.on('error', err => {
      log('Call error:', err);
    });
    setMediaConnectionRef(call);
  };

  const startVideoStream = async (): Promise<boolean> => {
    setLoading(true);
    try {
      log('Requesting user media...');
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStreamRef(videoStream);

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
    if (!ready || !isConnected || !socket) {
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
    const dataConnection = usePeerStore.getState().dataConnection;
    const mediaConnection = usePeerStore.getState().mediaConnection;
    const peerConnection = usePeerStore.getState().peerConnection;

    if (dataConnection) {
      log('Closing data connection...');
      dataConnection.close();
      setDataConnectionRef(null);
    }
    if (peerConnection) {
      log('Closing peer connection...');
      peerConnection.close();
      setPeerConnectionRef(null);
    }

    if (mediaConnection) {
      log('Closing media connection...');
      mediaConnection.close();
      setMediaConnectionRef(null);
    }
  };

  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const peerConnection = usePeerStore.getState().peerConnection;
    const dataConnection = usePeerStore.getState().dataConnection;

    const input = e.currentTarget.elements[0] as HTMLInputElement;
    if (!input.value) return;

    addMessage({ text: input.value, isMine: true });

    if (dataConnection) {
      dataConnection.send(input.value);
    }
    if (peerConnection) {
      peerConnection.send(input.value);
    }
    input.value = '';
  };

  const end = () => {
    socket?.emit(MESSAGE_EVENTS.END);
    window.location.reload();
  };

  return {
    join,
    skip,
    send,
    end
  };
}
