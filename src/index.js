const http = require("http")
const https = require("https")
const { StringDecoder } = require("string_decoder")
const url = require("url")
const config = require('./config')
const fs = require('fs')
const path = require('path')


// hander functions
const handlers = {}

// add the handler functions
handlers.ping = (data, callback) => {
    // accessing the request main data via data parameter
    // here
    callback(200, { "data": "don't worry, I'm still alive ^_^" })
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
    'ping': handlers.ping,
    'sample2': handlers.sample2
}


// create the https server
const httpsSecurityOptions = {
    "key": fs.readFileSync(`${path.resolve()}/https/key.pem`),
    "cert": fs.readFileSync(`${path.resolve()}/https/cert.pem`)
}

const httpsServer = https.createServer(httpsSecurityOptions, (req, res) => {
    unifiedServer(req, res)
})

// create the http server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res)
})


const unifiedServer = (req, res) => {

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
} 



// listening to the port

// https server
httpsServer.listen(config.httpsPort, () => {

    console.log('https server is running at port ' + config.httpsPort + 'on https://localhost:' + config.httpsPort + '/')
    console.log('environment mode: ' + config.envName)
})

httpServer.listen(config.httpPort, () => {

    console.log('http server is running at port ' + config.httpPort + 'on http://localhost:' + config.httpPort + '/')
    console.log('environment mode: ' + config.envName)
})