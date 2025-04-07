'use client';

import { usePeer } from '@/hooks';
import { useGetProfile } from '@/hooks/use-get-profile';
import {
  useAuthStore,
  useMainStore,
  usePeerStore,
  useSocketStore
} from '@/store';
import { MESSAGE_EVENTS } from '@/types';
import { log } from '@/utils';
import { useRouter } from 'next/navigation';
import Peer from 'peerjs';
import React, { useEffect } from 'react';

import { peerConfig } from '@/lib';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { initSocket } = useSocketStore();
  const socket = useSocketStore.getState().socket;
  const me = useAuthStore.getState().me;
  const { getProfile } = useGetProfile();
  const { setMyPeerId } = usePeerStore();
  const router = useRouter();
  const { connectToPeer, answerCall, getData } = usePeer();

  const {
    setError,
    setReady,
    setOnlineUsersCount,
    setWaitingForMatch,
    incomingUserInfo
  } = useMainStore.getState();

  const { setRemoteStream, setPeerConnection, setPeer, clearPeer } =
    usePeerStore();

  useEffect(() => {
    getProfile();
  }, []);
  useEffect(() => {
    if (!socket) {
      initSocket();
    }
  }, []);

  useEffect(() => {
    if (me) {
      if (!me.fullName || !me.dob) {
        router.push('/setup-profile');
      } else {
        router.push('/');
      }
    }
  }, [me]);

  useEffect(() => {
    // const socket = useSocketStore.getState().socket;

    if (!socket || !socket?.connected) return;

    log('Setting up socket listeners', socket.id);

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
        if (!incomingUserInfo) {
          getProfile(userId);
        }
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
  }, [socket, socket?.connected]);

  useEffect(() => {
    // const socket = useSocketStore.getState().socket;

    // if (!socket || socket?.connected) return;

    // log('Socket is connected, setting up PeerJS');
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
        getData(rawData);
      });
      // conn.on('close', () => {
      //   log('Data connection closed');

      //   clearMessages();
      // });
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
  }, []);

  return <>{children}</>;
};
