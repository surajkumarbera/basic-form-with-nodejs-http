const http = require('http')
const fs = require('fs')
const qs = require('querystring')
const path = require('path')
const url = require('url')



const port = 80
const IP = '127.0.0.1'



var listenSuccessMessage = () => {
    console.log('Server start listening '+IP+':'+port)
}

var sendClientFile = (response, fileName, headStatus, headMessage) => {
    response.writeHead(headStatus, headMessage)
    response.end(fs.readFileSync(path.join(__dirname, '../client', fileName)))
}

var route = (request, response) => {
    if(request.method == 'GET'){
        let filename = path.parse(url.parse(request.url).pathname).base
        switch(filename){
            case '':
                //break
                filename = 'form.html'
            case 'form.html': sendClientFile(response, filename, 200, {'Content-Type': 'text/html'})
                break
            case 'success.html': sendClientFile(response, filename, 200, {'Content-Type': 'text/html'})
                break
            case 'script.js': sendClientFile(response, filename, 200, {'Content-Type': 'text/javascript'})
                break
            case 'data.json': sendClientFile(response, filename, 200, {'Content-Type': 'application/json'})
                break
            default: sendClientFile(response, 'error.html', 400, {'Content-Type': 'text/html'})
                break
        }
    }
    else if(request.method == 'POST'){
        let filename = path.parse(url.parse(request.url).pathname).base
        switch(filename){
            case 'result.html': let data = ''
                                 request.on('data', (chunk) => {
                                     data = data + chunk.toString()
                                 })
                                 request.on('end', () => {
                                    data = qs.parse(data)
                                    fs.writeFileSync(path.join(__dirname, '../client/data.json'),JSON.stringify(data))
                                    sendClientFile(response, filename, 200, {'Content-Type': 'text/html'})
                                 })
                                 
                break
            default: sendClientFile(response, 'error.html', 400, {'Content-Type': 'text/html'})
                break
        }
    }
    else{
        sendClientFile(response, 'error.html', 400, {'Content-Type': 'text/html'})
    }
}





var server = http.createServer(route)
server.listen(port, IP, listenSuccessMessage)



