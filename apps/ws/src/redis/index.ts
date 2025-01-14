import Redis from 'ioredis'

// const redis = new Redis({
//     host:  'localhost',
//     port: 6379,
//     password: ''
// })

// redis.ping().then((e) => {
//     console.log(e);
// }).catch((e) => {
//     console.log(e)
// })

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
    // active user management
    // pub/sub for real time events
    // 
}