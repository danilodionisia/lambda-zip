const express = require('express');
const app = express();
const port = process.env.port || 3000;
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
AWS.config.update({
    accessKeyId: 'default',
    secretAccessKey: 'default',
    region: 'us-east-1',
    endpoint: 'http://localhost:4566'
});

const S3 = new AWS.S3({ apiVersion: '2006-03-01'});
const dynamoDbSdk = new AWS.DynamoDB();


app.get('/s3', async (req, res) => {

    try {
        
        let bucketName = await S3.listBuckets().promise();

        var bucketParams = {
            Bucket: 'bucketzip',
        };
        
        S3.listObjects(bucketParams, function (err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data);
            }
        });
        

        return res.status(200).json({ BucketName: bucketName.Buckets[0].Name});

    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
    
});


app.post('/client', async (req, res) => {


    try {
        
        const { cpf, rg, name, phone, address } = req.body;

        const params = {
            TableName: 'Clients',
            Item: {
                cpf: { "S": cpf },
                rg: { "S": rg },
                name: { "S": name },
                phone: { "S": phone },
                address: { "S": address },
            },
        };

        await dynamoDbSdk.putItem(params).promise();

        return res.status(200).json('success');

    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }

});


app.listen(port, () => {
    console.log(`Running on port: ${port}`);
});