
import React from 'react';

export const TruckIcon = ({ className }: { className?: string }) => (
  <span className={className} role="img" aria-label="truck">🚛</span>
);

export const RobotIcon = ({ className }: { className?: string }) => (
  <span className={className} role="img" aria-label="robot">🤖</span>
);

export const MicrophoneIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 14a2 2 0 0 0 2-2V6a2 2 0 0 0-4 0v6a2 2 0 0 0 2 2ZM17 12a5 5 0 0 1-10 0V6a5 5 0 0 1 10 0v6ZM20 12a1 1 0 0 0-1 1a7 7 0 0 1-14 0a1 1 0 0 0-2 0a9 9 0 0 0 8 8.94V24h-2a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.06A9 9 0 0 0 21 13a1 1 0 0 0-1-1Z"/>
    </svg>
);

export const SpeakIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4.382l-4.293 4.293a1 1 0 0 1-1.414-1.414L9.618 16H5a2 2 0 0 1-2-2V4Zm8.333 4H18v2h-6.667V8ZM7 12v-2h2v2H7Z"/>
    </svg>
);

export const LockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a6 6 0 0 0-6 6v3H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2V8a6 6 0 0 0-6-6Zm0 2a4 4 0 0 1 4 4v3H8V8a4 4 0 0 1 4-4Zm-2 9a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1Z"/>
    </svg>
);

export const DatabaseIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 4.239 2 7v10c0 2.761 4.477 5 10 5s10-2.239 10-5V7c0-2.761-4.477-5-10-5Zm0 2c4.411 0 8 1.791 8 4s-3.589 4-8 4-8-1.791-8-4 3.589-4 8-4Zm-8 8h16a8.03 8.03 0 0 1-8 4c-4.411 0-8-1.791-8-4Z"/>
    </svg>
);
