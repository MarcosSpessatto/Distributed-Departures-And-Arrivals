import app from '../app'
import config from 'config';

const server = app.listen(3051, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server is running on ${config.get('portListen')} ...`);
});
