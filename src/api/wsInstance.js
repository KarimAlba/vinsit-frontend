class WSInstance extends WebSocket {
    constructor(wsUrl) {
        super(`ws://${process.env.VUE_APP_API_IP}/ws${wsUrl}`);
    }

    send(data) {
        super.send(typeof data === 'object' ? JSON.stringify(data) : data);
    }
}

export default WSInstance;