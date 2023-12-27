import WSInstance from "./wsInstance";

class InventorizationChannel {
    constructor(stockId) {
        this.stockId = stockId;
        this.connectionCheckingInterval = null;
    }

    buildConnection() {
        this.ws = new WSInstance(`/inventorization/?stock_id=${this.stockId}`)
    }

    startConnection(doSth = () => null) {
        this.buildConnection();
        this.initOpenEventHandler(doSth);
        this.initCloseEventHandler(doSth);
        this.initOnErrorHandler(doSth);
    }

    closeConnection(doSth = () => null) {
        this.ws.close();
		doSth('Процесс инвентаризации завершен!');
    }

    checkConnectionStatus() {
        this.ws.send({ action: 'ping' });
    }

    registerChannelEvents(doSth) {
        this.ws.onmessage = (event) => {
            console.log(event);
            const data = JSON.parse(event.data)
            if ('message' in data) {
                switch (data.message) {
                    case 'pong':
						doSth('Connection is ok!');
                        console.log('Connection is ok!');
                        break;
                    default:
						doSth(data.message);
                        console.log(data.message);
                        break;
                }
                return;
            }
            if ('log_message' in data) {
                if (data.log_message === 'Процесс инвентаризации завершен!' && (this.ws.readyState !== this.ws.CLOSING && this.ws.readyState !== this.ws.CLOSED)) {
                    this.closeConnection(doSth);
                } else {
                    // need to return data (with event-bus component or vuex store or RxJs)
                }
            }
        };
    }

    initOpenEventHandler(doSth) {
        this.ws.onopen = (e) => {
            console.log("[open] Connected!");
            console.log("Check connection every 12 seconds");
            this.connectionCheckingInterval = window.setInterval(this.checkConnectionStatus.bind(this), 12 * 1000);
            this.registerChannelEvents(doSth);
			doSth('Процесс инвентаризации запущен!');
        }
    }

    initCloseEventHandler(doSth) {
        this.ws.onclose = (event) => {
            if (event.wasClean) {
                console.log(`[close] Connection closed, code=${event.code} reason=${event.reason}`);
            } else {
                // for example, server kill the proccess or network access failed
                // event.code 1006
                console.log('[close] Connection failed');
            }
            clearInterval(this.connectionCheckingInterval);
			doSth('Процесс инвентаризации завершен!');
        }
    }

    initOnErrorHandler() {
        this.ws.onerror = (error) => {
            console.log(error);
			doSth(error);
        };
    }
}

export default InventorizationChannel;
