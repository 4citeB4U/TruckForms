
export interface McpLog {
  id: number;
  command: string;
  output: string;
  timestamp: string;
}

export type MessageType = 'success' | 'error' | 'info';
