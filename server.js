let express = require("express");
let mysql=require("mysql");
console.log(mysql);

let app = express();

app.use(express.static(__dirname+"/")); //정적자원의 루트 지정

app.get("/board/list", function(request, response){
    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
    response.end("test");
});

app.listen(8888, function(){
    console.log("Server is running at 8888 port...");
});
