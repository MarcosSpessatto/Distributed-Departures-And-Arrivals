import ResponseFactory from '../helpers/ResponseFactory'
import Messages from '../constants/ResponseMessages.json'
import fs from 'fs'
import net from 'net'
import config from 'config'
import stream from 'stream'

class SocketServerService {

    static listen() {
        net.createServer({
            allowHalfOpen: false
        }, (connection) => {

            const Readable = stream.Readable;

            let chunks = [];

            let readable = new Readable();
            readable._read = (data) => {

            };

            connection.on('data', (data) => {
                let str = data.toString();
                if (!str.includes('\n')) {
                    readable.push(data)
                } else {
                    readable.push(data);
                    readable.push(null)
                }
            });

            readable.on('data', (chunk) => chunks.push(chunk));

            readable.on('end', () => {
                const data = Buffer.concat(chunks);
                const stringData = data.toString('utf8').replace('\n', ' ');
            });

            connection.on('end', () => {
            });

            connection.on('close', () => {
            });

            connection.on('error', (error) => {

            });

        }).listen(config.get('portListen'));

    }

    //
    // static socketServer;
    // static sockets = [];
    // static response = new ResponseFactory();
    //
    // static init(app) {
    //     const myAddress = `${global.ip}:${global.port}`;
    //
    //     let sockets = [];
    //
    //     for (let manager of global.managers) {
    //         sockets.push(io.connect(manager, {
    //             reconnect: true,
    //             query: `name=${myAddress}`
    //         }));
    //     }
    //
    //     SocketService.connect(sockets, myAddress);
    // }
    //
    // static connect(sockets, myAddress) {
    //     for (let socket of sockets) {
    //         //upload
    //         socket.on('upload', (data, callback) => {
    //             if (data.server === myAddress) {
    //                 let filename = data.name;
    //                 let bitmap = Buffer.from(data.file, 'base64');
    //                 let basePath = fs.realpathSync('.') + '/uploads/';
    //                 if (!fs.existsSync(basePath)) {
    //                     fs.mkdirSync(basePath, 0o766, (err) => {
    //                     });
    //                 }
    //                 let path = `${basePath}${filename}`;
    //                 fs.writeFile(path, bitmap, (err) => {
    //                     if (err) {
    //                         callback(500);
    //                     }
    //                     callback(Messages.ok);
    //                 });
    //             }
    //         });
    //
    //         //download
    //         socket.on('download', (data, callback) => {
    //             if (data.server === myAddress) {
    //                 let basePath = fs.realpathSync('.') + '/uploads/';
    //                 let path = `${basePath}${data.name}`;
    //                 fs.readFile(path, (err, data) => {
    //                     if (err) {
    //                         callback(500);
    //                     }
    //                     callback(SocketService.response.makeresponse(Messages.ok.code, Messages.ok.status, new Buffer(data).toString('base64')));
    //                 });
    //             }
    //         });
    //
    //         socket.on('getFileNames', (data, callback) => {
    //             let files = [];
    //             if (data.server === myAddress) {
    //                 let basePath = fs.realpathSync('.') + '/uploads/';
    //                 if (fs.existsSync(basePath)) {
    //                     if (fs.statSync(basePath).isDirectory()) {
    //                         files = FileHelper.walkSync(basePath);
    //                         callback(files)
    //                     }
    //                 }
    //                 callback(500)
    //             }
    //         });
    //
    //
    //         //delete
    //         socket.on('delete', (data, callback) => {
    //             if (data.server === myAddress) {
    //                 let basePath = fs.realpathSync('.') + '/uploads/';
    //                 let path = `${basePath}${data.name}`;
    //                 fs.exists(path, (exists) => {
    //                     if (exists) {
    //                         fs.unlinkSync(path);
    //                         callback(SocketService.response.makeresponse(Messages.ok.code, Messages.ok.status));
    //                     }
    //                     callback(500);
    //                 });
    //             }
    //         });
    //     }
    // }
}

export default SocketServerService;