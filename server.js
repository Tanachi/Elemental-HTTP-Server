var http = require('http');
var fs = require('fs');
var server = http.createServer(function (req, res){
req.on('data', function(chunk){
  var elementSymbol = '';
  var elementNumber = '';
  var elementName = '';
  var elementDesc = '';
  var stuff = chunk.toString().split('&');
  stuff.forEach(function(element, index, value){

    var keySplit = element.split('=');
    if(keySplit[0] === 'elementName'){
      elementName = keySplit[1];
    }
    if(keySplit[0] === 'elementSymbol'){
      elementSymbol = keySplit[1];
    }
    if(keySplit[0] === 'elementAtomicNumber'){
      elementNumber = keySplit[1];
    }
    if(keySplit[0] === 'elementDescription'){
      var plusSplit = keySplit[1].split('+');
      elementDesc= plusSplit.join(' ');
    }

  });
  var elementPage ='<!DOCTYPE html>\n' +
  '<html lang="en">\n' +
  '<head>\n' +
    '<meta charset="UTF-8">\n' +
    '<title>The Elements - '+ elementName +'</title>\n' +
    '<link rel="stylesheet" href="/css/styles.css">\n' +
  '</head>\n' +
  '<body>\n' +
    '<h1>'+ elementName + '</h1>\n' +
    '<h2>'+ elementSymbol + '</h2>\n' +
    '<h3>Atomic number '+ elementNumber + '</h3>\n' +
    '<p>' + elementDesc + '</p>\n' +
    '<p><a href="/">back</a></p>\n' +
  '</body>\n' +
  '</html>';
  fs.writeFile('./public/'+elementName + '.html', elementPage, 'utf8', function(err){
    if(err)
      throw err;
  });
  res.end();
});

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

