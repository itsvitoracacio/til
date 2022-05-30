const http = require('http')
const fs = require('fs')
const url = require('url')
const querystring = require('querystring')
const figlet = require('figlet')

const server = http.createServer((req, res) => {
	//
	//
	// ---------- BUILDING THE REQUEST CLASSES TO FILTER REQUESTS BASED ON TYPE ----------
	//
	class FileToServe {
		constructor(url, fileAddress) {
			this.url = url
			this.fileAddress = fileAddress
		}
		serveFile() {
			console.log('File type not supported')
			return
		}
	}

	class PageToServe extends FileToServe {
		constructor(url, fileAddress) {
			super(url, fileAddress)
		}
		serveFile() {
			fs.readFile(this.fileAddress, function (err, data) {
				res.writeHead(200, { 'Content-Type': 'text/html' })
				res.write(data)
				res.end()
			})
		}
	}

	class CssToServe extends FileToServe {
		constructor(url, fileAddress) {
			super(url, fileAddress)
		}
		serveFile() {
			fs.readFile(this.fileAddress, function (err, data) {
				res.writeHead(200, { 'Content-Type': 'text/css' })
				res.write(data)
				res.end()
			})
		}
	}

	class JsToServe extends FileToServe {
		constructor(url, fileAddress) {
			super(url, fileAddress)
		}
		serveFile() {
			fs.readFile(this.fileAddress, function (err, data) {
				res.writeHead(200, { 'Content-Type': 'text/javascript' })
				res.write(data)
				res.end()
			})
		}
	}

	class ApiResponse {
		constructor(paramName, paramList, ifNotInParamList) {
			this.paramName = paramName
			this.paramList = paramList
			this.ifNotInParamList = ifNotInParamList
		}
		sendResponse() {
			res.writeHead(200, { 'Content-Type': 'application/json' })
			const param = this.paramList.find(s => s.name === params[this.paramName])
			const objToJson = param || this.ifNotInParamList
			res.end(JSON.stringify(objToJson))
		}
	}

	class NotFound {
		constructor() {}
		sendErr(err, data) {
			if (err) {
				console.log('Something went wrong...')
				console.dir(err)
				return
			}
			res.write(data)
			res.end()
		}
	}
	//
	//
	// ---------- CREATING THE SERVER ROUTES ----------
	//
	// Creating auxiliary files routes
	const css = new CssToServe('/css/style.css', 'css/style.css')
	const js = new JsToServe('/js/main.js', 'js/main.js')
	//
	// Creating regular page files routes
	const index = new PageToServe('/', 'index.html')
	const otherpage = new PageToServe('/otherpage', 'otherpage.html')
	const other2page = new PageToServe('/otherotherpage', 'otherotherpage.html')
	//
	// Creating API responses routes
	const student = new ApiResponse(
		'student',
		[
			{
				name: 'leon',
				status: 'Boss Man',
				currentOccupation: 'Baller',
			},
		],
		{
			name: 'unknown',
			status: 'unknown',
			currentOccupation: 'unknown',
		}
	)
	//
	// Creating the Not Found route
	const e404 = new NotFound()
	//
	//
	// ---------- WORKING WITH WHAT WAS REQUESTED ----------
	//
	// Checking details of the request made
	const page = url.parse(req.url).pathname
	const params = querystring.parse(url.parse(req.url).query)
	//
	// Setting the parameters for checking if the request is valid
	const pages = [index, otherpage, other2page]
	const auxFiles = [css, js]
	const fileRoutes = pages.concat(auxFiles)
	const apiParams = [student]
	//
	// Checking if the request is valid
	const fileRequested = fileRoutes.find(route => route.url === page)
	const requestIsForApi = page === '/api'
	const apiRequested = apiParams.find(param => param.paramName in params)
	//
	// Responding to the request depending on its type
	if (fileRequested) fileRequested.serveFile()
	else if (requestIsForApi) apiRequested.sendResponse()
	else figlet('404!!', (err, data) => e404.sendErr(err, data))
})

server.listen(8000)
