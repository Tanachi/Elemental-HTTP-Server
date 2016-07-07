var http = require('http');
var fs = require('fs');

var server = http.createServer(function (request, response){
  fs.readFile('./public/index.html', 'utf8', function(err, data){
    if(err)
      throw err;
    response.write(data);
    response.end();
  });
});

server.on('clientError', function (err, socket){
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);