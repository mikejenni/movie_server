const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const app = express();
const port = 3000;

const MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017";
const dbName = 'todoApp';
const collectionName = 'todos';
let db = undefined;
let collection = undefined;

/**
 * Setup express middleware
 */
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    next();
});

/**
 * Connect to database
 */
MongoClient.connect(url,{ useUnifiedTopology: true }, function(err, connection) {
    if (err) throw err;
    db = connection.db(dbName);
    collection = db.collection(collectionName);
});

/**
 * Return all todos
 */
app.get('/todos', (req, res) => {
    collection.find({}).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
    });
});

/**
 * Insert one todo
 */
app.post('/todo', (req, res) => {
    const todo = req.body;
    collection.insertOne(todo, function(err, result) {
        if (err) throw err;
        res.send({result: 'todo inserted', todo: todo});
    });
});

/**
 * Delete todo by id
 */
app.delete('/todo/:id', (req, res) => {
    const query = { _id: new mongodb.ObjectID(req.params.id) };
    collection.deleteOne(query, function(err, obj) {
        if (err) throw err;
        res.send({result: 'todo deleted'});
    });
});

/**
 * Start server
 */
app.listen(port, () => {
    console.log(`Todo app listening at http://localhost:${port}`);
});
