const connectToMongo = require('./db');
const express = require('express');

const authRoute=require('./routes/auth');
const notesRoute=require('./routes/notes');

const app = express()
var cors = require('cors')

const port = 5000

connectToMongo();

app.use(cors())
app.use(express.json())

app.use('/api/auth',authRoute)
app.use('/api/notes',notesRoute)

app.listen(port, () => {
  console.log(`Backend Project is listening on port ${port}`)
})
