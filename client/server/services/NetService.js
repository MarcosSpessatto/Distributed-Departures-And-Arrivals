import net from 'net'
import stream from 'stream'
import ResponseMessages from '../constants/ResponseMessages.json'

const Readable = stream.Readable;

class NetService {

    static upload(data) {
        return new Promise((resolve, reject) => {
            NetService
                .getConnection()
                .then((client) => {
                    let chunks = [];

                    let s = new Readable();
                    s._read = function (n) {

                    };

                    client.write(`PUT ${data.name} ${data.file}\n`)

                    client.on('data', (data) => {
                        let str = data.toString();
                        if (!str.includes('\n')) {
                            s.push(data)
                        } else {
                            data = data.toString().replace('\n', ' ');
                            s.push(data);
                            s.push(null);
                            client.destroy();
                        }
                    });

                    s.on('data', (data) => {
                        chunks.push(data)
                    });

                    s.on('end', () => {
                        const all = Buffer.concat(chunks);
                        resolve(JSON.parse(all.toString()))
                    })
                })
                .catch((e) => resolve({"codRetorno": 500, "descricaoRetorno": "Nenhum gerenciador ativo"}));
        })
    }


    static connect(host, port) {
        return new Promise((resolve, reject) => {
            let client = new net.Socket();

            client.connect(port, host, () => {
                global.connection = client;
                resolve();
            });

            client.on('error', (err) => {
                global.connection = {};
                reject();
            })
        })
    }

}

export default NetService