import React, { useState } from 'react';
import { FaMicrophone, FaPlay, FaStop } from 'react-icons/fa';

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
      // Stop all tracks on the active stream
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-lg mb-4">{prompt}</p>
      <div className="flex justify-between items-center">
        <button
          onClick={playTTS}
          disabled={!promptAudio || isLoading}
          className={`${!promptAudio || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white p-2 rounded-full`}
        >
          {isLoading ? '...' : isPlaying ? <FaStop /> : <FaPlay />}
        </button>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`${
            isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          } text-white p-4 rounded-full`}
        >
          {isRecording ? <FaStop /> : <FaMicrophone />}
        </button>
      </div>
    </div>
  );
};

export default PromptCard;
