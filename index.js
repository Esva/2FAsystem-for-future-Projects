const express = require('express');                                         //: Express JS for running server
const speakeasy = require('speakeasy');                                     //: to generated random string keys
const uuid = require('uuid');                                               //: to generate unique user identification strings
const {JsonDB} = require('node-json-db');                                   //: store UUID and Speakeasy strings
const {config, Config} = require('node-json-db/dist/lib/JsonDBConfig')              //: config for Json DB


const app = express();                                                      //: Defining the app as an express js Server 
const port = 5000;                                      //: set the port that ExpressJS will listen too
const db = new JsonDB(new Config('myDatabase', true, false, '/'))



app.get('/api', (req, res) => {
    res.json({message:'Welcome TESTS have passed'})           //: Sets a welcome message on opening localhost:3000
})


/*
REMEMBER TO POST!!!!! to localhost:5000/api/register to get respons and populate DB.
Spent over na hour trying to GET info and wasted time figuring out why it wouldnt work. Google saved my ass on this one 
*/


//register the user and create a temp Auth Key..
app.post('/api/register', (req, res) => {
    const id = uuid.v4()  //creates a random unique user identification number

    try {
        const path = `/user/${id}` // path to generate temp credentials
        const temp_secret = speakeasy.generateSecret() // this generates temp credentials
        db.push(path, {id, temp_secret}) // add's temp secret to DB
        res.json({id, secret: temp_secret.base32}) // add both User ID and temp secret to the db in base 32 (.base32, .hex. .ascii types)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: `error cant generate secret`}) // If any errors show this
    }
})


app.listen(port, () => console.log(`Server is currently running and listening on port ${port}`));   //: Sets a message in the console if server is up and running and port is open