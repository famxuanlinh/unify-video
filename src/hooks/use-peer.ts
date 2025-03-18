import { useMainStore, useMessagingStore, usePeerStore } from '@/store';
import { MESSAGE_EVENTS } from '@/types';
import { log } from '@/utils';
import Peer, { MediaConnection } from 'peerjs';
import { useEffect, useRef, useState } from 'react';

import { peer } from '@/lib';

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
    setLocalStreamRef,
    setRemoteStreamRef,
    localStreamRef,
    setDataConnectionRef,
    setMediaConnectionRef,
    setPeerConnectionRef
  } = usePeerStore();

  const [myPeerId, setMyPeerId] = useState<string | null>(null);

  const peerRef = useRef<Peer | null>(null);

  const { socket, isConnected } = useSocketIO();

  useEffect(() => {
    if (!socket) return;
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
  }, [socket]);

  useEffect(() => {
    if (!isConnected) return;
    log('Socket is connected, setting up PeerJS');

    peerRef.current = peer;

    peer.on('open', id => {
      log('Peer open with ID:', id);
      setMyPeerId(id);
      setReady(true);
    });

    peer.on('connection', conn => {
      setPeerConnectionRef(conn);

      conn.on('data', data => {
        addMessage({ text: data as string, isMine: false });
      });

      conn.on('close', () => {
        log('Data connection closed');
        clearMessages();
      });
    });

    peer.on('call', call => {
      log('Incoming call from:', call.peer);
      answerCall(call);
    });

    peer.on('error', err => {
      log('Peer error:', err);
      setError('Peer error');
    });

    return () => {
      log('Cleaning up PeerJS');
      peer.destroy();
    };
  }, [isConnected]);

  const connectToPeer = (peerId: string) => {
    if (!peerRef.current) return;

    try {
      const conn = peerRef.current.connect(peerId);
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
    const stream = localStreamRef?.id
      ? localStreamRef
      : usePeerStore.getState().localStreamRef;

    if (!stream?.id) {
      log('makeCall Local stream not available');
      setError('makeCall Local stream not available');

      return;
    }

    const call = peerRef.current?.call(peerId, stream);
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
      : usePeerStore.getState().localStreamRef;

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
    if (!ready || !isConnected || !socket || !peerRef.current) {
      log('Not ready to join');
      setError('Not ready to join');

      return;
    }

    const streamInitialized = await startVideoStream();

    if (streamInitialized) {
      log('Joining with peer ID:', myPeerId);
      socket.emit('JOIN', { peerId: myPeerId });
    } else {
      log('Failed to   join - stream not initialized');
      setError('Failed to   join - stream not initialized');
    }
  };

  const skip = () => {
    const dataConnection = usePeerStore.getState().dataConnectionRef;
    const mediaConnection = usePeerStore.getState().mediaConnectionRef;
    const peerConnection = usePeerStore.getState().peerConnectionRef;

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
    const peerConnectionRef = usePeerStore.getState().peerConnectionRef;
    const dataConnectionRef = usePeerStore.getState().dataConnectionRef;

    const input = e.currentTarget.elements[0] as HTMLInputElement;
    if (!input.value) return;

    addMessage({ text: input.value, isMine: true });

    if (dataConnectionRef) {
      dataConnectionRef.send(input.value);
    }
    if (peerConnectionRef) {
      peerConnectionRef.send(input.value);
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
