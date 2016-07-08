var userName = 'Kikiyo';
var passWord = 'Konoe';
var http = require('http');
var fs = require('fs');
var server = http.createServer(function (req, res){
  if(req.method === 'POST'){
    securityCheck(req.headers.authorization, res);
    req.on('data', function(chunk){
      var fileName = getName(chunk);
      fs.access('./public/' + fileName.toLowerCase() + '.html', function(err){
        if(err){
          writeElement(chunk, req.method, res);
      var elementCount = -1;
      fs.readdir('./public', function(err, files){
        var totalList = '';
        files.forEach(function(element, index, array){
          var linkSplit = element.split('.');
          if(linkSplit.length > 1){
            if(linkSplit[0] !== '404' && linkSplit[0] !== 'index' && linkSplit[1] !== 'keep'){
              elementCount++;
              totalList += '<li>\n' +
              '<a href="/' + linkSplit[0] + '.html">' + linkSplit[0].charAt(0).toUpperCase() + linkSplit[0].slice(1) +'</a>\n' +
              '</li>\n';
            }
          }
        });
        var indexPage = '<!DOCTYPE html>\n' +
        '<html lang="en">\n' +
        '<head>\n' +
        '<meta charset="UTF-8">\n' +
        '<title>The Elements</title>\n' +
        '<link rel="stylesheet" href="/css/styles.css">\n' +
        '</head>\n' +
        '<body>\n' +
        '<h1>The Elements</h1>\n' +
        '<h2>These are all the known elements.</h2>\n' +
        '<h3>These are ' + elementCount +'</h3>\n' +
        '<ol>\n' +
        totalList +
        '</ol>\n' +
        '</body\n>' +
        '</html>';
        fs.writeFile('./public/index.html', indexPage, 'utf8', function(err){
          if(err)
            throw err;
        });
      });
      res.end();
        }
        else{
          res.writeHead(200);
          res.end();
        }
      });
    });
  }
  if(req.method === 'PUT'){
    securityCheck(req.headers.authorization, res);
    req.on('data', function(chunk){
      var fileName = getName(chunk);
      fs.access('./public/' + fileName.toLowerCase() + '.html', fs.F_OK, function(err){
        if(!err){
          writeElement(chunk);
          res.end();
        }
        else{
          res.writeHead(404);
          res.end();
        }
      });
    });
  }

  if(req.method === 'DELETE'){
    securityCheck(req.headers.authorization, res);
    fs.access('./public' + req.url, function(err) {
      if(err) {
        res.writeHead(404);
        res.end();
      }
      else {
        fs.unlink('./public' + req.url);
        res.writeHead(200);
        res.end();
      }
    });
  }
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


function writeElement(chunk){
  var elementSymbol = '';
  var elementNumber = '';
  var elementName = '';
  var elementDesc = '';
  var elementList = '';
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
    '<title>The Elements - '+ elementName.charAt(0).toUpperCase() + elementName.slice(1) +'</title>\n' +
    '<link rel="stylesheet" href="/css/styles.css">\n' +
  '</head>\n' +
  '<body>\n' +
    '<h1>'+ elementName.charAt(0).toUpperCase() + elementName.slice(1) + '</h1>\n' +
    '<h2>'+ elementSymbol + '</h2>\n' +
    '<h3>Atomic number '+ elementNumber + '</h3>\n' +
    '<p>' + elementDesc + '</p>\n' +
    '<p><a href="/">back</a></p>\n' +
  '</body>\n' +
  '</html>';
  fs.writeFile('./public/'+elementName.toLowerCase() + '.html', elementPage, 'utf8', function(err){
    if(err)
      throw err;
  });
}

function securityCheck(auth, res){
  var pass = auth.split(' ');
  var word = pass[1];
  var base64Buffer = new Buffer(word, 'base64');
  var decodedString = base64Buffer.toString();
  var userPass = decodedString.split(':');
  if(userPass[0] !== userName && userPass[1] !== passWord){
    res.writeHead(401, {
    'WWW-Authenticate': 'Basic realm="My Server"',
    'Content-Length':0});
    res.write('<html><body>Not Authorized</body></html>');
    res.end();
  }
}

function getName(chunk){
  var elementName = '';
  var stuff = chunk.toString().split('&');
    stuff.forEach(function(element, index, value){
      var keySplit = element.split('=');
      if(keySplit[0] === 'elementName'){
        elementName = keySplit[1];
      }
    });
  return elementName;
}