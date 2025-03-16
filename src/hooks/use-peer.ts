import { useEffect, useRef, useState } from 'react';
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import { log } from '@/utils/helpers';
import { MESSAGE_EVENTS } from '@/utils/constants';
import { useMainStore, useMessagingStore, usePeerStore } from '@/store';
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
  const { setLocalStreamRef, setRemoteStreamRef, localStreamRef } =
    usePeerStore();

  const [myPeerId, setMyPeerId] = useState<string | null>(null);

  const peerRef = useRef<Peer | null>(null);
  const dataConnectionRef = useRef<DataConnection | null>(null);
  const mediaConnectionRef = useRef<MediaConnection | null>(null);

  const { socket, isConnected } = useSocketIO();

  if (!localStreamRef) {
    console.log('localStreamRef >>>>>>>>>>> ');
  }

  useEffect(() => {
    if (!socket) return;
    console.log('usePeer: Setting up socket listeners');

    socket.on('MATCH', ({ peerId }: { peerId: string }) => {
      console.log('usePeer: Matched with peer:', peerId);
      setWaitingForMatch(false);
      debugger;
      connectToPeer(peerId);
    });

    socket.on('WAITING', () => {
      console.log('usePeer: Waiting for a match...');
      setRemoteStreamRef(null);
      setWaitingForMatch(true);
    });

    socket.on('ONLINE', ({ count }: { count: number }) => {
      setOnlineUsersCount(count);
    });

    socket.on('END', () => {
      console.log('usePeer: Call ended');
      end();
    });

    socket.on('ERROR', ({ message }: { message: string }) => {
      console.log('usePeer: Error:', message);
      setError('default');
    });

    return () => {
      console.log('usePeer: Cleaning up socket listeners');
      socket.off('MATCH');
      socket.off('WAITING');
      socket.off('ONLINE');
      socket.off('END');
      socket.off('ERROR');
    };
  }, [socket]);

  useEffect(() => {
    if (!isConnected) return;
    console.log('usePeer: Socket is connected, setting up PeerJS');

    const peer = new Peer();
    peerRef.current = peer;

    peer.on('open', id => {
      console.log('usePeer: Peer open with ID:', id);
      setMyPeerId(id);
      setReady(true);
    });

    peer.on('connection', conn => {
      console.log('usePeer: Peer connected with:', conn.peer);
      dataConnectionRef.current = conn;

      conn.on('data', data => {
        addMessage({ text: data as string, isMine: false });
      });

      conn.on('close', () => {
        console.log('usePeer: Data connection closed');
        clearMessages();
      });
    });

    peer.on('call', call => {
      console.log('usePeer: Incoming call from:', call.peer);
      debugger;
      answerCall(call);
    });

    peer.on('error', err => {
      console.log('usePeer: Peer error:', err);
      setError('default');
    });

    return () => {
      console.log('usePeer: Cleaning up PeerJS');
      peer.destroy();
    };
  }, [isConnected]);

  const connectToPeer = (peerId: string) => {
    debugger;
    if (!peerRef.current) return;

    try {
      const conn = peerRef.current.connect(peerId);
      dataConnectionRef.current = conn;

      conn.on('open', () => console.log('usePeer: Data connection opened'));
      conn.on('data', data =>
        addMessage({ text: data as string, isMine: false })
      );
      conn.on('close', () => {
        console.log('usePeer: Connection closed');
        clearMessages();
        socket?.emit('SKIP');
      });

      makeCall(peerId);
    } catch (err) {
      console.log('usePeer: Error connecting to peer:', err);
      setError('default');
    }
  };

  const makeCall = (peerId: string) => {
    debugger;
    if (!localStreamRef?.id) {
      console.log('usePeer: makeCall  Local stream not available for answer');
      setError('makeCall  Local stream not available for answer');
      return;
    }

    const call = peerRef.current?.call(peerId, localStreamRef);
    if (!call) return;

    call.on('stream', stream => {
      console.log('usePeer: Remote stream received');
      setRemoteStreamRef(stream);
    });

    call.on('close', () => console.log('usePeer: Call closed'));
    call.on('error', err => console.log('usePeer: Call error:', err));

    mediaConnectionRef.current = call;
  };

  const answerCall = (call: MediaConnection) => {
    if (!localStreamRef) {
      console.log('usePeer: answerCall Local stream not available for answer');
      setError('answerCall Local stream not available for answer');
      return;
    }

    call.answer(localStreamRef);

    call.on('stream', stream => {
      console.log('usePeer: Remote stream received from answer');
      setRemoteStreamRef(stream);
    });

    call.on('close', () => console.log('usePeer: Remote Call closed'));
    call.on('error', err => console.log('usePeer: Call error:', err));
  };

  const startVideoStream = async (): Promise<boolean> => {
    setLoading(true);
    try {
      console.log('usePeer: Requesting user media...');
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      setLocalStreamRef(videoStream);
      debugger;

      console.log('usePeer: User media obtained successfully');
      setLoading(false);
      setStarted(true);
      return true;
    } catch (error) {
      console.log('usePeer: Error getting user media:', error);
      setError('default');
      setLoading(false);
      return false;
    }
  };

  const join = async () => {
    if (!ready || !isConnected || !socket || !peerRef.current) {
      console.log('usePeer: Not ready to join');
      setError('default');
      return;
    }

    const streamInitialized = await startVideoStream();

    if (streamInitialized) {
      console.log('usePeer: Joining with peer ID:', myPeerId);
      socket.emit('JOIN', { peerId: myPeerId }, (response: any) => {
        console.log('usePeer: Response from server:', response);
      });
    } else {
      console.log('usePeer: Failed to   join - stream not initialized');
      setError('default');
    }
  };

  const skip = () => {
    dataConnectionRef.current?.close();
    mediaConnectionRef.current?.close();
    socket?.emit('SKIP');
    console.log('usePeer: Skipped');
  };

  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements[0] as HTMLInputElement;
    if (!input.value) return;

    addMessage({ text: input.value, isMine: true });
    dataConnectionRef.current?.send(input.value);
    input.value = '';
  };

  const end = () => {
    socket?.emit('END');
    window.location.reload();
  };

  return {
    join,
    skip,
    send,
    end
  };
}
