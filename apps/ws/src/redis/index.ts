import Redis from 'ioredis'

export class RedisManager {
    private redis: Redis;

    constructor() {
        this.redis = new Redis({
            host: 'localhost',
            port: 6379,
            password: ''
        })

        // connecting
        this.redis.on('connect', () => {
            console.log("Redis connection initiated!");
        })

        // onError
        this.redis.on('error', (e) => {
            console.log("Error occured", e);
        })

        // onMessage
        this.redis.on('message', (m: any) => {
            console.log(m);
        })
    }

    async createMusicSession(sessionId: string, trackData: any): Promise<void> {
        await this.redis.hset(`music-session:${sessionId}`, {
            ...trackData,
            createdAt: Date.now()
        })
        await this.redis.expire(`music-session: ${sessionId}`, 24 * 60 * 60)
    }


    // get a particular session
    async getSession(sessionId: string): Promise<void> {
        await this.redis.hgetall(`music-session: ${sessionId}`)
        return;
    }

    // active user management
    async addActiveUser(sessionId: string, userId: string): Promise<void> {
        await this.redis.sadd(`active users: ${sessionId}`, userId)
        return;
    }

    // pub/sub for real time events
    async publishEvent(channel: string, event: string): Promise<void> {
        await this.redis.publish(channel, JSON.stringify(event));
    }

    async subscribe(channel: string, callback: (m: any) => void): Promise<void> {
        const subscriber = this.redis.duplicate();
        await subscriber.subscribe(channel);
        subscriber.on('message', (channel, message) => {
            callback(message);
        });
        return;
    }
    // getTrack state 
    

    // cleannup/ close
}