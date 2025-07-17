
import React from 'react';
import type { McpLog } from '../types';

interface McpLogViewProps {
  logs: McpLog[];
}

const McpLogView: React.FC<McpLogViewProps> = ({ logs }) => {
  return (
    <div className="mt-4 bg-black bg-opacity-60 rounded-lg p-4 max-h-48 overflow-y-auto font-mono text-sm">
      <h4 className="font-semibold mb-2 text-gray-300">MCP Command History</h4>
      {logs.length === 0 ? (
        <p className="text-xs opacity-75 text-gray-400">No commands executed yet.</p>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id}>
              <div className="text-green-400">
                <span className="text-blue-400">[{log.timestamp}]</span> $ {log.command}
              </div>
              <div className="text-gray-200 whitespace-pre-wrap pl-2 border-l-2 border-gray-700">{log.output}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default McpLogView;
