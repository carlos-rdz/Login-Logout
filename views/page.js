const {logoutButton, loginOrRegister} = require('./helper');

function page(content,isLoggedIn=false){
    return `<!doctype html>
    <html lang="en">
      <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
        <link rel="stylesheet" href="/stylesheets/index.css">
      </head>

      <body>
      <div class="bg">
      
      
      <div class="p-3 mb-2 bg-secondary text-white">
      ${
        isLoggedIn ? logoutButton() : loginOrRegister()
      }
      </div>
      <div class="p-3 mb-2">
      ${content}
      </div>
      

      </body>
      </html>`;  }
      
      
      module.exports = page;