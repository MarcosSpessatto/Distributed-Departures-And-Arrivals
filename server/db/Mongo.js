import mongojs from 'mongojs'
import db from './db.json';

'use strict';

class Mongo {

    constructor() {
        this.username = db.mongo.username;
        this.password = db.mongo.password;
        this.server = db.mongo.server;
        this.port = db.mongo.port;
        this.database = db.mongo.database;
        this.auth = this.username ? this.username + ':' + this.password + '@' : '';
    }

    connection(){
        return 'mongodb://' + this.server + ':' + this.port + '/' + this.database;
    }

    getConnection(){
        const db = mongojs(this.connection());
        db.on('error', function (err) {
            console.log(err);
        });
        return db;
    }
}

export default Mongo;