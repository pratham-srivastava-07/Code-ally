import {redisService} from '../redis'

interface MusicSession {
    sessionId: string;
    trackId: string;
    clients: Set<WebSocket>;
    currentState: {
        isPlaying: boolean;
        currentTime: number;
        bpm: number;
    };
    activeNotes: Map<string, NoteEvent>; // Keep track of currently playing notes
}

interface NoteEvent {
    pitch: number;
    velocity: number;
    timestamp: number;
    instrumentId: string;
}

class MusicManager {
    private sessions: Map<string, MusicSession>

    constructor() {
        this.sessions = new Map()
    }

    

}