import net from 'net'

class SocketClientService {

    static execute(query, ip, port) {
        return new Promise((resolve, reject) => {
            SocketClientService
                .connect(ip, port)
                .then((connection) => {
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
                .catch((err) => reject(err));
        })
    }


    static connect(ip, port) {
        return new Promise((resolve, reject) => {
            let client = new net.Socket();

            client.connect(port, ip, () => {
                resolve(client);
            });

            client.setTimeout(2000, () => {
               
            });

            client.on('error', () => {
                reject();
            });

            client.on('close', () => {
            });
        })
    }

}

export default SocketClientService