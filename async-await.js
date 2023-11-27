/********************************************************************************* * 
 * ITE5315 – Assignment 4 * 
 * I declare that this assignment is my own work in accordance with Humber Academic Policy. *
 *  No part of this assignment has been copied manually or electronically from any other source * 
 * (including web sites) or distributed to other students. * *
 *  Name: Aditya Joshi Student ID: n01545536 Date: November 26, 2023 * 
 * * ********************************************************************************/

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

async function findAll() {
    let client;

    try {
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        console.log('1');

        const db = client.db("mydb");
        console.log('2');

        const collection = db.collection('customers');
        console.log('3');

        const cursor = collection.find({}).limit(10);
        console.log('4');

        await cursor.forEach(doc => console.log(doc));
        console.log('5');
    } catch (err) {
        console.log("Error:", err);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

setTimeout(() => {
    findAll().then(() => console.log('Task complete'));
}, 5000);
