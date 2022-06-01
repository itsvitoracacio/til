// mkdir new-folder
// cd new-folder
// npm init
// npm install express --save (remember to add 'node_modules' to .gitignore)
// npm install nodemon --save-dev
// to run: npm run dev (if 'dev' is 'nodemon server.js' inside 'scripts' on package.json)

const express = require('express')
const app = express()
const PORT = 8000

app.get('/', (_, res) => res.sendFile(__dirname + '/index.html'))
app.get('/api:param', (req, res) => res.json(`You queried ${req.params.param}`))

app.listen(PORT, (_, _) => console.log(`Server running on port ${PORT}`))
