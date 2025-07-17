
import React, { useState } from 'react';
import McpLogView from './McpLogView';
import type { McpLog } from '../types';
import { RobotIcon, MicrophoneIcon, SpeakIcon, LockIcon, DatabaseIcon } from './icons';

interface AgentPanelProps {
  isListening: boolean;
  onListen: () => void;
  onSpeak: (message: string) => void;
  onRunCommand: (command: string) => void;
  logs: McpLog[];
}

const AgentPanel: React.FC<AgentPanelProps> = ({ isListening, onListen, onSpeak, onRunCommand, logs }) => {
  const [showLogs, setShowLogs] = useState(false);

  return (
    <div className="w-full max-w-md mt-6">
      <div className="agent-card rounded-2xl p-6 text-white border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-2xl">
              <RobotIcon />
            </div>
            <div>
              <h3 className="font-semibold">Agent Lee</h3>
              <p className="text-xs opacity-75">System Orchestrator</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onListen}
              title={isListening ? 'Listening...' : 'Activate voice command'}
              className={`p-2 rounded-full transition-all duration-300 ${isListening ? 'bg-red-500 listening-anim' : 'bg-green-500 hover:bg-green-600'}`}>
              <MicrophoneIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onSpeak('Hello! I am Agent Lee, ready to assist with your login or system diagnostics.')}
              title="Agent introduction"
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-all">
              <SpeakIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => onRunCommand('auth check')}
            className="flex items-center justify-center space-x-2 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-xs font-medium transition-transform hover:scale-105">
            <LockIcon className="w-4 h-4" />
            <span>Auth Check</span>
          </button>
          <button
            onClick={() => onRunCommand('db status')}
            className="flex items-center justify-center space-x-2 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-xs font-medium transition-transform hover:scale-105">
            <DatabaseIcon className="w-4 h-4" />
            <span>DB Status</span>
          </button>
        </div>

        <button
          onClick={() => setShowLogs(!showLogs)}
          className="w-full py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-xs font-medium transition-all">
          {showLogs ? 'Hide MCP Logs' : 'Show MCP Logs'}
        </button>

        {showLogs && <McpLogView logs={logs} />}
      </div>
    </div>
  );
};

export default AgentPanel;
