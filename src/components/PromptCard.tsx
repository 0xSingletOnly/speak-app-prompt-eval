import React, { useState } from 'react';
import { FaMicrophone, FaPlay, FaStop } from 'react-icons/fa';
import '../styles/main.css';

interface PromptCardProps {
  prompt: string;
  promptAudio: string | null;
  isLoading: boolean;
  onRecordingComplete: (audioBlob: Blob) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, promptAudio, isLoading, onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        onRecordingComplete(audioBlob);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const playTTS = async () => {
    if (!promptAudio) return;

    if (!audioElement) {
      const audio = new Audio(promptAudio);
      audio.onended = () => setIsPlaying(false);
      setAudioElement(audio);
      audio.play();
    } else {
      if (isPlaying) {
        audioElement.pause();
        audioElement.currentTime = 0;
      } else {
        audioElement.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="prompt-card">
      <div className="relative">
        <h2 className="prompt-title">{prompt}</h2>

        <div className="buttons-container">
          {/* Play button section */}
          {promptAudio && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button
                onClick={playTTS}
                disabled={!promptAudio || isLoading}
                className={`play-button ${!promptAudio || isLoading ? 'button-disabled' : ''}`}
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : isPlaying ? (
                  <FaStop style={{ width: '1.25rem', height: '1.25rem' }} />
                ) : (
                  <FaPlay style={{ width: '1.25rem', height: '1.25rem' }} />
                )}
              </button>
              <p className="button-label">Listen to prompt</p>
            </div>
          )}

          {/* Microphone button section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`record-button ${isRecording ? 'recording' : ''}`}
            >
              {isRecording ? <FaStop className="w-6 h-6" /> : <FaMicrophone style={{ width: '2rem', height: '2rem', animation: isRecording ? 'pulse 2s infinite' : 'none' }} />}
            </button>
            <p className="button-label">{isRecording ? 'Stop recording' : 'Start recording'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
