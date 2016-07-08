var http = require('http');
var fs = require('fs');
var server = http.createServer(function (req, res){
  if(req.method === 'POST'){
    req.on('data', function(chunk){
      var elementSymbol = '';
      var elementNumber = '';
      var elementName = '';
      var elementDesc = '';
      var elementList = '';
      var elementCount = -1;
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

      fs.access('./public/' + elementName.toLowerCase() + '.html', fs.F_OK, function(err){
        if(!err){
          res.writeHead(400);
          res.end();
        }
        else{
          elementCount++;
          var elementPage ='<!DOCTYPE html>\n' +
          '<html lang="en">\n' +
          '<head>\n' +
            '<meta charset="UTF-8">\n' +
            '<title>The Elements - '+ elementName.charAt(0).toUpperCase() + elementName.slice(1) +'</title>\n' +
            '<link rel="stylesheet" href="/css/styles.css">\n' +
          '</head>\n' +
          '<body>\n' +
            '<h1>'+ capitalizeFirstLetter(elementName) + '</h1>\n' +
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
      });
    });
  }
  if(req.method === 'PUT'){
    req.on('data', function(chunk){
      var elementSymbol = '';
      var elementNumber = '';
      var elementName = '';
      var elementDesc = '';
      var elementList = '';
      var elementCount = -1;
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
      fs.access('./public/' + elementName.toLowerCase() + '.html', fs.F_OK, function(err){
        if(!err){
          var elementPage ='<!DOCTYPE html>\n' +
          '<html lang="en">\n' +
          '<head>\n' +
            '<meta charset="UTF-8">\n' +
            '<title>The Elements - '+ elementName.charAt(0).toUpperCase() + elementName.slice(1) +'</title>\n' +
            '<link rel="stylesheet" href="/css/styles.css">\n' +
          '</head>\n' +
          '<body>\n' +
            '<h1>'+ capitalizeFirstLetter(elementName) + '</h1>\n' +
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
        }
        else{
          res.writeHead(404);
          res.end();
        }
      });
    });
    res.end();
  }

  if(req.method === 'DELETE'){
    console.log(req.url);
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


function writeElement(){

}

function writeIndex(){

}
