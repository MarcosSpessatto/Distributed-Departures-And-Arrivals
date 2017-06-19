import { v1 as neo4j } from 'neo4j-driver'

let driver;

class DatabaseHelper {

    static init() {
        driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "ironmaiden"));

        driver.onCompleted = () => {
        };

        driver.onError = (error) => {
            console.log('Driver instantiation failed', error);
        };

        const session = driver.session();

        session
            .run('RETURN 1')
            .then(() => driver.close())
    }

    static executeQuery(statement){
        return new Promise((resolve, reject) => {
            const session = driver.session();

            session
                .run(statement)
                .then((results) => resolve(results))
                .catch((err) => reject(err));
        });
    }
}
export default DatabaseHelper;

