import WSInstance from "./wsInstance";

class InventorizationChannel {
    constructor(stockId) {
        this.stockId = stockId;
        this.connectionCheckingInterval = null;
    }

    buildConnection() {
        this.ws = new WSInstance(`/inventorization/?stock_id=${this.stockId}`)
    }

    startConnection(addLogs = () => null, checkStatistic = () => null) {
        this.buildConnection();
        this.initOpenEventHandler(addLogs, checkStatistic);
        this.initCloseEventHandler(addLogs);
        this.initOnErrorHandler(addLogs);
    }

    closeConnection(addLogs = () => null) {
        this.ws.close();
		addLogs({ log: 'Процесс инвентаризации завершен!', type: 'error' });
    }

    checkConnectionStatus() {
        this.ws.send({ action: 'ping' });
    }

    registerChannelEvents(addLogs, checkStatistic) {
        this.ws.onmessage = (event) => {
            console.log(event);
            const data = JSON.parse(event.data)
            if ('message' in data) {
                switch (data.message) {
                    case 'pong':
						// addLogs('Connection is ok!');
                        // console.log('Connection is ok!');
                        break;
                    default:
						addLogs({ log: data.message, type: data.log_type });
                        console.log(data.message);
                        break;
                }
                return;
            }
            if ('log_message' in data) {
                if (data.log_message === 'Процесс инвентаризации завершен!' && (this.ws.readyState !== this.ws.CLOSING && this.ws.readyState !== this.ws.CLOSED)) {
                    this.closeConnection(addLogs);
                } else {
					addLogs({ log: `${data.time}: ${data.log_message}`, type: data.log_type});
					checkStatistic(data.totals)
                    // need to return data (with event-bus component or vuex store or RxJs)
                }
            }
        };
    }

    initOpenEventHandler(addLogs, checkStatistic) {
        this.ws.onopen = (e) => {
            console.log("[open] Connected!");
            console.log("Check connection every 12 seconds");
            this.connectionCheckingInterval = window.setInterval(this.checkConnectionStatus.bind(this), 12 * 1000);
            this.registerChannelEvents(addLogs, checkStatistic);
        }
    }

    initCloseEventHandler(addLogs) {
        this.ws.onclose = (event) => {
            if (event.wasClean) {
                console.log(`[close] Connection closed, code=${event.code} reason=${event.reason}`);
            } else {
                // for example, server kill the proccess or network access failed
                // event.code 1006
                console.log('[close] Connection failed');
            }
            clearInterval(this.connectionCheckingInterval);
			addLogs({ log: 'Процесс инвентаризации завершен!', type: 'error' });
        }
    }

    initOnErrorHandler() {
        this.ws.onerror = (error) => {
            console.log(error);
        };
    }
}

export default InventorizationChannel;
