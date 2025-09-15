'use client';

import { useState, useRef, useEffect } from 'react';

type RecordingState = 'inactive' | 'recording' | 'paused' | 'stopped';

export const useRecorder = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>('inactive');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // MediaRecorder is a browser API, check for availability
    if (typeof window !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        setIsReady(true);
    }
  }, []);

  const startRecording = async () => {
    if (recordingState !== 'inactive' && recordingState !== 'stopped') return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setRecordingState('stopped');
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setRecordingState('recording');
    } catch (err) {
      console.error('Error starting recording:', err);
      setRecordingState('inactive');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };
  
  const resetRecording = () => {
    setAudioBlob(null);
    setRecordingState('inactive');
    audioChunksRef.current = [];
  }

  return { startRecording, stopRecording, resetRecording, audioBlob, recordingState, isReady };
};
