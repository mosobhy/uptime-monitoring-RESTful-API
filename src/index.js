const http = require("http")
const https = require("https")
const { StringDecoder } = require("string_decoder")
const url = require("url")
const config = require('./config')


// define the port
const PORT = config.port


// hander functions
const handlers = {}

// add the handler functions
handlers.sample = (data, callback) => {
    // accessing the request main data via data parameter
    // here
    callback(200, {'data': "this is the payload"})
}

handlers.sample2 = (data, callback) => {
    // accessing the request main data via data parameter
    // here handling the request
    callback(200, {'data': "the is sample2 payload"})
}

handlers.notFoundHandler = (data, callback) => {
    // accessing the request main data via data parameter
    // handling the request here 
    callback(404)
}

// define the route paths
const router = {
    'sample': handlers.sample,
    'sample2': handlers.sample2
}

// create ther server
const server = http.createServer((req, res) => {

    // parse the url
    const req_url = url.parse(req.url, true)

    // parse the pathname from that url and normalize it( removing the /)
    const url_path = req_url.pathname
    const normalizedPath = url_path.replace(/^\/+|\/*$/g, '')
    // console.log('normalizedPath: ', normalizedPath)

    // parse the request method
    const method = req.method
    // console.log('request method: ', method)

    // parse the query parameters
    const queryObject = req_url.query
    // console.log('query parameters: ', queryObject)

    // parse the request headers
    const headersObject = req.headers
    // console.log('request headers: ', headersObject)

    // parseing the payload
    const decoder = new StringDecoder('utf-8')
    let payload = ''
    req.on('data', (stream) => {    // will be executed when ther is a payload sent
        payload += decoder.write(stream)
        console.log('the user send payload: ', payload)
    })

    req.on('end', () => {           // always exectues, after the end of payload streaming

        // construct the request object 
        const data = {
            'path': normalizedPath,
            'method': method,
            'query': queryObject,
            'headers': headersObject,
            'body': payload
        }

        // get the appropriate handler for a the requested route
        const chosenHandler = typeof(router[normalizedPath]) !== 'undefined' ? router[normalizedPath] : handlers.notFoundHandler

        chosenHandler(data, (statusCode, payload) => {

            statusCode = typeof(statusCode) == 'number' ? statusCode : 200
            payload = typeof(payload) == 'object' ? payload : {}

            // returnn the response
            res.setHeader("Content-Type", "application/json")
            res.writeHead(statusCode)
            res.end(JSON.stringify(payload))
            console.log('response: ', payload, statusCode)
        })
    })
})

// listening to the port
server.listen(PORT, () => {
    console.log('server is running at port ' + config.port + 'on http://localhost:'+ config.port + '/')
    console.log('environment mode: ' + config.envName)
})