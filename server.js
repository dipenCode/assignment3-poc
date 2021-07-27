const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const DB_URL = 'mongodb+srv://Dipen:N1eJrkjrWK035jnW@cluster0.f5vbx.mongodb.net/myFirstDatabase?retryWrites=true';


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()); 

MongoClient.connect(DB_URL, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('form_poc');
    const myTbl = db.collection('form_attributes');

    app.post('/saveFields', (req, res) => {
        try {
            myTbl.insertOne(req.body)
                .then(result => {
                    res.status(200).json({
                        status: "success",
                        message: "Test success",
                        data : result.insertedId
                    });
                })
                .catch(error => console.error(error))
        }
        catch(err) {
            res.status(400).json({
                status: "fail",
                message: err.message,
            });
        }  
    });

    app.post('/updateFields', (req, res) => {
        try {
            var id = req.body._id;
            var body = req.body;
            delete body._id;

            myTbl.updateOne({ '_id' : ObjectId(id)  } , {$set: body} , {upsert : true})(req.body)
                .then(result => {
                    
                    res.status(200).json({
                        status: "success",
                        message: "Test success",
                        data : result.insertedId
                    });
                })
                .catch(error => console.error(error))
        }
        catch(err) {
            res.status(405).json({
                status: "",
                message: "",
            });
        }  
    });
  })


app.listen(3000, function() {
    console.log('listening on 3000')
})
  
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

