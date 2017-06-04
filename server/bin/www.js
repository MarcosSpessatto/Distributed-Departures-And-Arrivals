import app from '../app'
import config from 'config';

const server = app.listen(config.get('portListen'), () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Server is running on port ' + port + '...');
});
