const path = require('path');
const express = require('express'); //regular express server

const app = express();

//set static folder
app.use(express.static(path.join(__dirname,'public')));

const PORT = 3000 || process.env.PORT;
//checks if we have an environment variable called port and use that, otherwise use 3000
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`)); 
