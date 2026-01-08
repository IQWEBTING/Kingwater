export interface UserProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export enum CallStatus {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  RINGING = 'RINGING',
  CONNECTED = 'CONNECTED',
  FAILED = 'FAILED',
  ENDED = 'ENDED'
}

export interface PeerConfig {
  host: string;
  port: number;
  path: string;
  secure: boolean;
  debug: number;
}