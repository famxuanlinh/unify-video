'use client';

import { MEDIA_STATUS } from '@/constants';
import {
  useMainStore,
  useMessagingStore,
  usePeerStore,
  useSocketStore,
  useTimerStore
} from '@/store';
import { MESSAGE_EVENTS } from '@/types';
import { log } from '@/utils';
import { useRouter } from 'next/navigation';
import { MediaConnection } from 'peerjs';

export function usePeer() {
  const {
    setError,
    setLoading,
    setStarted,
    setIncomingUserInfo,
    setIsIncomingCameraOn,
    setIsIncomingMicOn,
    ready
  } = useMainStore.getState();
  const { addMessage, clearMessages } = useMessagingStore();
  const {
    setLocalStream,
    setRemoteStream,
    localStream,
    setDataConnection,
    setMediaConnection,
    setPeerConnection,
    myPeerId
  } = usePeerStore();
  const router = useRouter();

  const connectToPeer = (peerId: string) => {
    const peer = usePeerStore.getState().peer;
    if (!peer) return;

    try {
      const conn = peer.connect(peerId);
      setDataConnection(conn);

      // conn.on('open', () => log('Data connection opened'));
      conn.on('data', rawData => {
        getData(rawData);
      });

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
      startStreamingTimer();
      log('Remote stream received');
      setRemoteStream(stream);
    });

    call.on('close', () => {
      handleCloseStream();
    });
    call.on('error', err => log('Call error:', err));

    setMediaConnection(call);
  };

  const answerCall = (call: MediaConnection) => {
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
      startStreamingTimer();
      log('Remote stream received from answer');
      setRemoteStream(stream);
    });

    call.on('close', () => {
      handleCloseStream();
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
      socket.emit(MESSAGE_EVENTS.JOIN, { peerId: myPeerId });
    } else {
      router.push('/allow-access');
      log('Failed to join - stream not initialized');
      setError('Failed to join - stream not initialized');
    }
  };

  const handleCloseStream = () => {
    const socket = useSocketStore.getState().socket;
    const timeStreaming = useMainStore.getState().timeStreaming;
    const isEndCall = useMainStore.getState().isEndCall;
    const setIsEndCall = useMainStore.getState().setIsEndCall;
    // setIncomingUserInfo(null);

    if (timeStreaming > 1) {
      router.push(`/review`);
    } else if (isEndCall) {
      setIncomingUserInfo(null);
      setLocalStream(null);
      setStarted(false);
      setIsEndCall(false);
      socket?.emit(MESSAGE_EVENTS.END);
      router.push('/');
    } else {
      socket?.emit(MESSAGE_EVENTS.SKIP);
    }

    log('Remote Call closed');
    stopStreamingTimer();
    clearMessages();
  };

  const handleEndCall = () => {
    const setIsEndCall = useMainStore.getState().setIsEndCall;

    setIsEndCall(true);
    handleDisconnectPeer();
  };

  const startStreamingTimer = () => {
    const startTimer = useTimerStore.getState().startTimer;
    startTimer(() => {
      const timeStreaming = useMainStore.getState().timeStreaming;
      useMainStore.setState({ timeStreaming: timeStreaming + 1 });
    });
  };

  const stopStreamingTimer = () => {
    const stopTimer = useTimerStore.getState().stopTimer;
    stopTimer();
  };

  const getData = (rawData: unknown) => {
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

    if (data?.type === MEDIA_STATUS.MIC_STATUS && data.isMicOn !== undefined) {
      setIsIncomingMicOn(data.isMicOn);

      return;
    }

    if (data?.text) {
      addMessage({ text: data.text, isMine: false, isNewest: true });
    }
  };

  const handleDisconnectPeer = () => {
    const waitingForMatch = useMainStore.getState().waitingForMatch;
    const isEndCall = useMainStore.getState().isEndCall;
    const setIsEndCall = useMainStore.getState().setIsEndCall;
    const socket = useSocketStore.getState().socket;

    setRemoteStream(null);
    // setIncomingUserInfo(null);

    // For message
    const dataConnection = usePeerStore.getState().dataConnection;

    //For call receiver
    const mediaConnection = usePeerStore.getState().mediaConnection;

    // For call sender
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

    if (waitingForMatch && isEndCall) {
      // setIncomingUserInfo(null);
      setLocalStream(null);
      setStarted(false);
      setIsEndCall(false);
      router.push('/');
    }
    socket?.emit(MESSAGE_EVENTS.END);
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

  const handleReturnToHome = () => {
    const isEndCall = useMainStore.getState().isEndCall;
    const socket = useSocketStore.getState().socket;
    if (!isEndCall) {
      socket?.emit(MESSAGE_EVENTS.SKIP);
    } else {
      setStarted(false);
      setLocalStream(null);
      setStarted(false);
      setIncomingUserInfo(null);
    }
    router.push('/');
  };

  return {
    join,
    send,
    handleEndCall,
    handleNextCall: handleDisconnectPeer,
    connectToPeer,
    answerCall,
    getData,
    startVideoStream,
    handleReturnToHome
  };
}
