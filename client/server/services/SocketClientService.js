import net from 'net'
import stream from 'stream'
import ResponseMessages from '../constants/ResponseMessages.json'

const Readable = stream.Readable;

class SocketClientService {

    static init() {
        global.connection = {};
    }

    static execute(query) {
        return new Promise((resolve, reject) => {
            const connection = SocketClientService.getConnection();

            let chunks = [];

            let readable = new Readable();
            readable._read = (data) => {

            };

            connection.write(`${query}\n`);

            connection.on('data', (data) => {
                let str = data.toString();
                if (!str.includes('\n')) {
                    readable.push(data)
                } else {
                    data = data.toString().replace('\n', ' ');
                    readable.push(data);
                    readable.push(null);
                    connection.destroy();
                }
            });

            readable.on('data', (data) => {
                chunks.push(data)
            });

            readable.on('end', () => {
                const allData = Buffer.concat(chunks);

                resolve(JSON.parse(allData.toString()))
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