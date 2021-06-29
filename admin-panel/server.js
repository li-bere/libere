const path = require('path');
const express = require('express');
const http = require('http');

// import { environment } from 'client/environments/environment';

const app = express();
const port  = process.env.PORT || 3001;

let distDir = path.join(__dirname, 'dist', '@coreui');
console.log('dir', distDir);
console.log(path.join(distDir, 'index.html'));

app.use(express.static(distDir));

app.route('/*').get((req, res, next) => {
    res.sendFile(path.join(__dirname, 'dist', '@coreui', 'index.html'));
});

let server = http.createServer(app);

server.listen(port , () => {
    console.log('Express server listening on port '+ port);
});

