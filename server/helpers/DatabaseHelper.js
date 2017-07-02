import Mongo from '../db/mongo';

class DatabaseHelper {

    constructor() {
        this.mongo = new Mongo().getConnection();
    }

    findOne(name) {
        return new Promise((resolve, reject) => {
            let query = {'name':  name};
            this.mongo.collection('files').findOne(query, (err, result) => (err ? reject(err) : resolve(result)));
        });
    }
}

export default DatabaseHelper