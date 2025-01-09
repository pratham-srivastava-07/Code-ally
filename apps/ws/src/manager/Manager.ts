import {WebSocket} from 'ws'

interface CodeEditorSession {
    sessionId: string;
    content: string;
    clients: Set<WebSocket>;
}

export class CodeManager {
    private sessions: Map<string, CodeEditorSession>

    constructor() {
        this.sessions = new Map()
    }

    createSession(sessionId: string, initContent: string): void {
        if(!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, {
                sessionId,
                content: initContent,
                clients: new Set(),
            })
            console.log(`Session created with id ${sessionId}`);
        }
    }

    joinRoom(sessionId: string, ws: WebSocket): void {
        const session = this.sessions.get(sessionId)

        if(!session) {
            console.error(`No session found for document: ${sessionId}`);
            ws.send(JSON.stringify({ type: "error", message: "Session not found" }));
            return;
        }
        // add client to session 
        session.clients.add(ws)
        // send msg to joined client
        ws.send(JSON.stringify({ type: "init", content: session.content }))
        // onMessage of any client
        ws.on('message', (data: any) => this.handleMessage(sessionId, ws, data.toString()))

        // when someone leaves the room
        ws.on('close', () => {
            console.log("Client left");
            
        })
    }

    handleMessage(sessionId: string, ws: WebSocket, data: any): void {
        const session = this.sessions.get(sessionId)

        if(!session) {
            console.log("no sessionId found")
            ws.send(JSON.stringify({type: 'error', message: 'session not found'}))
            return
        }

        // from where msg is coming
       try {
        const {type, content} = JSON.parse(data)

        switch(type) {
            case "edit":
                session.content = content

                session.clients.forEach((client: WebSocket) => {
                    if(client != ws || client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({type: "update", content}))
                    }
                })
        }
       } catch(e) {
        console.log(e);
       }
    }
}