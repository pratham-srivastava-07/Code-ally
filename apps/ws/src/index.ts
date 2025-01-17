import {WebSocket, WebSocketServer}  from 'ws'
import { CodeManager } from './manager/Manager.js'
import {Request} from 'express'
import authenticateSocket from './auth.js'
import { Room } from './manager/Room.js'

const wss = new WebSocketServer({port: 8080})

// const room = new Room("")

const codeManager = new CodeManager

wss.on('connection', async (ws: WebSocket, req: Request) => {
    console.log('Connected')

    ws.on('error',()=> console.error('error'))
    const url = new URL(req.url || "", `http://${req.headers.host}`);

    const sessionId = url.searchParams.get('sessionId')

    if(!sessionId) return;

    if(sessionId && await authenticateSocket(req, ws)) {
        codeManager.joinRoom(sessionId, ws)
    }
    ws.on('close', () => codeManager.leaveRoom(sessionId, ws))
})