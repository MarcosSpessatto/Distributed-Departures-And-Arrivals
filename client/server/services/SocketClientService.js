import net from 'net'
import ResponseMessages from '../constants/ResponseMessages.json'

class SocketClientService {

    static init() {
        global.connection = {};
    }

    static execute(query) {
        return new Promise((resolve, reject) => {
            const connection = SocketClientService.getConnection();

            connection.write(`${query}\n`);

            let chunks = [];

            connection.on('data', (data) => {
                chunks.push(data);

                if (data.toString().includes('\n')) {
                    let response = JSON.parse(Buffer.concat(chunks).toString().replace('\n', ' '));
                    chunks = [];
                    resolve(response);
                }
            });

            connection.on('error', () => {
                reject();
            })
        })
    }


    static connect(ip, port) {
        return new Promise((resolve, reject) => {
            let client = new net.Socket();

            client.connect(port, ip, () => {
                global.connection = client;
                resolve();
            });

            client.on('error', () => {
                global.connection = {};
                reject();
            });

            client.on('close', () => {
                global.connection = {};
            });
        })
    }

    static getConnection() {
        return global.connection;
    }

}

export default SocketClientService