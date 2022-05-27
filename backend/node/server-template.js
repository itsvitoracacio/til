const http = require('http')
const fs = require('fs')
const url = require('url')
const querystring = require('querystring')
const figlet = require('figlet')

const server = http.createServer((req, res) => {
	//
	// Serve files depdending on the url accessed
	const page = url.parse(req.url).pathname
	function serveFile(fileAddress, contentType) {
		fs.readFile(fileAddress, function (err, data) {
			res.writeHead(200, { 'Content-Type': `text/${contentType}` })
			res.write(data)
			res.end()
		})
	}
	//
	// Requests for auxiliary files
	if (page === '/css/style.css') serveFile('css/style.css', 'css')
	else if (page === '/js/main.js') serveFile('js/main.js', 'javascript')
	//
	// Regular page requests
	else if (page === '/') serveFile('index.html', 'html')
	else if (page === '/otherpage') serveFile('otherpage.html', 'html')
	else if (page === '/otherotherpage') serveFile('otherotherpage.html', 'html')
	//
	// API requests
	else if (page === '/api') {
		const params = querystring.parse(url.parse(req.url).query)
		//
		// API request parameters
		if ('student' in params) {
			const studentsList = [
				{
					name: 'leon',
					status: 'Boss Man',
					currentOccupation: 'Baller',
				},
			]
			const unknownStudent = {
				name: 'unknown',
				status: 'unknown',
				currentOccupation: 'unknown',
			}

			function serveStudentAsJson() {
				res.writeHead(200, { 'Content-Type': 'application/json' })
				const student = studentsList.find(s => s.name === params['student'])
				const objToJson = student || unknownStudent
				res.end(JSON.stringify(objToJson))
			}

			serveStudentAsJson()
		}
	}
	//
	// 404 requests
	else {
		figlet('404!!', function (err, data) {
			if (err) {
				console.log('Something went wrong...')
				console.dir(err)
				return
			}
			res.write(data)
			res.end()
		})
	}
})

server.listen(8000)
