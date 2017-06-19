import app from '../app'
import config from '../config.json';

const server = app.listen(3053, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server is running on ${config.portListen} ...`);
});
