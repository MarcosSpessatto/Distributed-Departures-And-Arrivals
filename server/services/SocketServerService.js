import ResponseFactory from '../helpers/ResponseFactory'
import Messages from '../constants/ResponseMessages.json'
import MemcachedHelper from '../helpers/MemcachedHelper'
import ServerController from '../controllers/ServerController'
import net from 'net'
import config from '../config.json'

class SocketServerService {

    static listen() {
        net.createServer({
            allowHalfOpen: false
        }, (connection) => {

            let chunks = [];

            connection.on('data', (data) => {
                chunks.push(data);

                if (data.toString().includes('\n')) {
                    let command = chunks.toString('utf-8').replace('\n', ' ').trim();

                    ServerController
                        .executeCommand(command)
                        .then((result) => {
                            connection.write(`${JSON.stringify(result)}\n`);
                            chunks = [];
                            command = undefined;
                        })
                        .catch((err) => {
                            connection.write(`${JSON.stringify(err)}\n`);
                            chunks = [];
                            command = undefined;
                        });
                }
            });

            connection.on('end', () => {
            });

            connection.on('close', () => {
            });

            connection.on('error', (error) => {

            });

        }).listen(config.portListen);

    }
}

export default SocketServerService;