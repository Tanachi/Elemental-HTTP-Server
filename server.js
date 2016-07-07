var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res){


});



server.on('clientError', function (err, socket){
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.on('request', function(req, res){
  if(req.method === 'GET'){
    if(req.url === '/') {
      fs.readFile('./public/index.html', 'utf8', function(err, data){
        if(err)
          throw err;
        res.write(data);
        res.end();
      });
    }
    else{
      fs.readFile('./public' + req.url, 'utf8', function(err, data){
        if(err)
          throw err;
        res.write(data);
        res.end();
      });
    }
  }
});
server.listen(8080, '127.0.0.1' ,  function(){

});

