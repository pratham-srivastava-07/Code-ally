import {WebSocket, WebSocketServer}  from 'ws'
import { CodeManager } from './manager/Manager.js'
import {Request} from 'express'

const wss = new WebSocketServer({port: 8080})

const codeManager = new CodeManager

wss.on('connection', (ws: WebSocket, req: Request) => {
   console.log('Connected')

    ws.on('error',()=> console.error('error'))
    const url = new URL(req.url || "", `http://${req.headers.host}`);

    const sessionId = url.searchParams.get('sessionId')

    if(sessionId) {
        codeManager.joinRoom(sessionId, ws)
    }
    ws.on('close', () => console.log("Closing connection"))
})