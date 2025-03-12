'use client';

import { useMainStore, useMessagingStore, usePeerStore } from '@/store';
import { HEARTBEAT, MESSAGE_EVENTS, peer, log } from '@/utils';
import { DataConnection, MediaConnection } from 'peerjs';
import { FormEvent, useEffect, useRef, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export function usePeer() {
  const { addMessage, clearMessages } = useMessagingStore();
  const {
    setError,
    setLoading,
    setReady,
    setStarted,
    setOnlineUsersCount,
    setWaitingForMatch,
    ready
  } = useMainStore();
  const { setLocalStream, setRemoteStream } = usePeerStore();
  const [myPeerId, setMyPeerId] = useState('');

  const peerConnectionRef = useRef<DataConnection>(undefined);
  const dataConnectionRef = useRef<DataConnection>(undefined);
  const mediaConnectionRef = useRef<MediaConnection>(undefined);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    'http://localhost:5001/',
    {
      heartbeat: HEARTBEAT,
      onError: _e => {
        setError('Initial error');
      }
    }
  );

  useEffect(() => {
    peer.on('open', id => {
      log('Peer open with ID:', id);

      setMyPeerId(id);

      if (readyState !== ReadyState.CLOSED) {
        setReady(true);
      } else {
        setError('Peer open error');
      }
    });

    peer.on('connection', conn => {
      log('Peer Connected with:', conn.peer);

      if (peerConnectionRef.current) {
        peerConnectionRef.current = conn;
      }
    });

    peer.on('close', () => {
      log('Peer closed');
    });

    peer.on('error', err => {
      log('Peer error:', err.type, err.message);
      setError('Peer connection error');
    });
  }, []);

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);
        const { event, id, isCaller, onlineUsersCount } = data;

        log('WebSocket message received:', data);

        if (onlineUsersCount) {
          setOnlineUsersCount(onlineUsersCount);

          return;
        }

        if (event === MESSAGE_EVENTS.MATCH) {
          setWaitingForMatch(false);
          log('Match found with peer ID:', id);

          try {
            const dataConnection = peer.connect(id);

            dataConnection.on('error', err => {
              log('Data connection error:', err);
            });

            if (isCaller) {
              log('Calling peer:', id);
              try {
                const localStream = usePeerStore.getState().localStream;
                if (!localStream) {
                  log('Local stream not available for call');
                  setError('Local stream not available for call');

                  return;
                }

                const call = peer.call(id, localStream);

                call.on('stream', stream => {
                  log('Remote stream received');
                  setRemoteStream(stream);
                });

                call.on('close', () => {
                  log('Call closed');
                });

                call.on('error', err => {
                  log('Media connection error:', err);
                });

                mediaConnectionRef.current = call;
              } catch (err) {
                log('Error making call:', err);
                setError('Error making call');
              }
            }

            peer.on('call', call => {
              log('Received call from:', call.peer);
              try {
                const localStream = usePeerStore.getState().localStream;
                if (!localStream) {
                  log('Local stream not available for answer');
                  setError('Local stream not available for answer');

                  return;
                }

                call.answer(localStream);

                call.on('stream', stream => {
                  log('Remote stream received from answer');
                  setRemoteStream(stream);
                });

                call.on('close', () => {
                  log('Remote Call closed');
                });

                call.on('error', err => {
                  log('Call error:', err);
                });
              } catch (err) {
                log('Error answering call:', err);
                setError('Error answering call');
              }
            });

            dataConnection.on('open', () => {
              log('Connection open');
            });

            dataConnection.on('data', data => {
              const message = {
                text: data as string,
                isMine: false
              };
              addMessage(message);
            });

            dataConnection.on('close', () => {
              log('Connection closed');
              clearMessages();
              sendMessage(
                JSON.stringify({ event: MESSAGE_EVENTS.SKIP, id: myPeerId })
              );
            });

            dataConnectionRef.current = dataConnection;
          } catch (err) {
            log('Error connecting to peer:', err);
            setError('Error connecting to peer');
          }
        }

        if (event === MESSAGE_EVENTS.WAITING) {
          log('Waiting for a match...');
          setRemoteStream(null);
          setWaitingForMatch(true);
        }
      } catch (err) {
        log('Error parsing message:', err);
        setError('Error parsing message');
      }
    }
  }, [lastMessage]);

  async function startVideoStream() {
    setLoading(true);
    try {
      log('Requesting user media...');
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      log('User media obtained successfully');
      setLocalStream(videoStream);

      return new Promise(resolve => {
        // Wait a short time to ensure the stream is properly initialized
        setTimeout(() => {
          if (videoStream) {
            log('Local stream initialized successfully');
            setLoading(false);
            setStarted(true);
            resolve(true);
          } else {
            log('Failed to initialize local stream');
            setError('Error getting user media');
            resolve(false);
          }
        }, 1000);
      });
    } catch (error) {
      log('Error getting user media:', error);
      setError('Error getting user media');
      setLoading(false);
    }
  }

  const join = async () => {
    if (!ready) {
      log('Not ready to join - WebSocket or Peer not initialized');
      setError('Not ready to join - WebSocket or Peer not initialized');

      return;
    }

    const streamInitialized = await startVideoStream();

    if (streamInitialized && readyState === ReadyState.OPEN) {
      log('Joining with peer ID:', myPeerId);
      sendMessage(JSON.stringify({ event: MESSAGE_EVENTS.JOIN, id: myPeerId }));
    } else {
      log('Failed to join - WebSocket not open');
      setError('Failed to join - WebSocket not open');
    }
  };

  const skip = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (mediaConnectionRef?.current) {
      mediaConnectionRef.current.close();
    }
    if (dataConnectionRef.current) {
      dataConnectionRef.current?.close();
    }

    log('Skipped');
  };

  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements[0] as HTMLInputElement;

    if (!input.value) return;

    const message = {
      text: input.value,
      isMine: true
    };

    input.value = '';

    if (!peerConnectionRef.current) return;
    peerConnectionRef.current?.send(message.text);
    addMessage(message);
  };

  const end = () => {
    window.location.reload();
  };

  return { join, skip, send, end };
}
