
import { useState, useCallback, useEffect, useRef } from 'react';
import type { McpLog } from '../types';

// Fallback for SpeechRecognition if it's not available in all browsers.
// Cast to `any` to avoid TypeScript errors for these non-standard properties.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useAgentLee = () => {
  const [mcpLogs, setMcpLogs] = useState<McpLog[]>([]);
  const [isListening, setIsListening] = useState(false);
  // Use useRef to hold the recognition instance, as it's a mutable object that doesn't need to trigger re-renders.
  const recognitionRef = useRef<any | null>(null);

  const runMcpCommand = useCallback(async (command: string) => {
    let output = '';
    switch (command.toLowerCase().trim()) {
      case 'git sync':
        output = 'Syncing with remote repository...\nFetch successful.\nMerged 3 commits.';
        break;
      case 'auth check':
        output = 'Checking authentication status...\nFirebase Auth: Ready\nStripe API: Ready';
        break;
      case 'db status':
        output = 'Database Status:\nFirestore: Connected\nState Management: Online';
        break;
      case 'help':
        output = 'Available commands:\n- auth check\n- db status\n- git sync\n- help';
        speak('I can run diagnostic commands like auth check, or db status. You can also ask for help.');
        break;
      default:
        output = `Unknown command: "${command}"\nType 'help' for a list of commands.`;
    }
    
    const newLog: McpLog = {
      id: Date.now(),
      command,
      output,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMcpLogs(prev => [newLog, ...prev]);
    return output;
  }, []);

  const processVoiceCommand = useCallback((command: string) => {
      if (command.toLowerCase().includes('login')) {
          speak('Please fill out the login form to continue.');
      } else {
          runMcpCommand(command);
      }
  }, [runMcpCommand]);

  const speak = (message: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Emma') || v.name.includes('Zira'));
      utterance.voice = femaleVoice || voices[0];
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported in this browser.');
    }
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      speak("Sorry, your browser doesn't support voice commands.");
      return;
    }
    if (isListening) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript;
      console.log(`Voice command received: ${command}`);
      processVoiceCommand(command);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
    }
  };
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      speechSynthesis.cancel();
    }
  }, []);

  return { mcpLogs, isListening, runMcpCommand, speak, startListening, stopListening };
};
