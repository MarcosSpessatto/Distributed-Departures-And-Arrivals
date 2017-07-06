# Distributed-Departures-And-Arrivals

cd client/  <br/>
npm install <br/>
npm start // rodará na porta 3050 <br/>

cd server/ <br/>
npm install <br/>
npm start //rodará na porta 3053 o HTTP e o socket na porta especifica no arquivo config.json <br/>


MONGODB <br/>
AIRPORTS<br/>
mongoimport --db distributed-arrivals-and-departures -c airports --file CAMINHO DO ARQUIVO airports.csv --type csv
--headerline --verbose <br/>
CARRIERS <br/>
mongoimport --db distributed-arrivals-and-departures -c carriers --file CAMINHO DO ARQUIVO carriers.csv --type csv
--headerline --verbose

IMPORTAR OS ANOS DE 1993 E 1994 <br/>
mongoimport --db distributed-arrivals-and-departures -c 1993 --file CAMINHO DO ARQUIVO 1993.csv --type csv
--headerline --verbose <br/>
mongoimport --db distributed-arrivals-and-departures -c 1994 --file CAMINHO DO ARQUIVO 1994.csv --type csv
--headerline --verbose

db.getCollection('1993').createIndex({Year: 1})
db.getCollection('1993').createIndex({Month: 1})
db.getCollection('1993').createIndex({DayofMonth: 1})
db.getCollection('1993').createIndex({Cancelled: 1})
db.getCollection('1993').createIndex({Origin: 1})
db.getCollection('1993').createIndex({Dest: 1})
db.getCollection('1993').createIndex({UniqueCarrier: 1})

db.getCollection('1994').createIndex({Year: 1})
db.getCollection('1994').createIndex({Month: 1})
db.getCollection('1994').createIndex({DayofMonth: 1})
db.getCollection('1994').createIndex({Cancelled: 1})
db.getCollection('1994').createIndex({Origin: 1})
db.getCollection('1994').createIndex({Dest: 1})
db.getCollection('1994').createIndex({UniqueCarrier: 1})
