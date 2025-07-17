
import React, { useState, useCallback } from 'react';
import LoginForm from './components/LoginForm';
import AgentPanel from './components/AgentPanel';
import { useAgentLee } from './hooks/useAgentLee';
import { signInWithEmailAndPassword } from './services/firebaseService';
import type { MessageType } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('info');

  const agent = useAgentLee();

  const handleLogin = useCallback(async (email: string, password: string, company: string) => {
    setIsLoading(true);
    setMessage('');
    setMessageType('info');
    agent.runMcpCommand('auth check');

    try {
      await signInWithEmailAndPassword(email, password);
      
      setMessageType('success');
      setMessage('Login successful! Redirecting to dashboard...');
      agent.speak(`Authentication successful. Welcome to Truck Forms, ${company || 'guest'}.`);
      
      // Simulate redirect after a short delay
      setTimeout(() => {
        // In a real app, this would be a router navigation
        console.log('Redirecting to dashboard...');
        // window.location.href = '/dashboard';
      }, 2000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setMessageType('error');
      setMessage(`Login failed: ${errorMessage}`);
      agent.speak('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [agent]);

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gray-900 text-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <LoginForm 
        onLogin={handleLogin}
        isLoading={isLoading}
        message={message}
        messageType={messageType}
      />
      <AgentPanel
        isListening={agent.isListening}
        onListen={agent.startListening}
        onSpeak={agent.speak}
        onRunCommand={agent.runMcpCommand}
        logs={agent.mcpLogs}
      />
    </main>
  );
};

export default App;
