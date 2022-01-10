let express = require("express");
let mysql=require("mysql");
let fs=require("fs");
let ejs=require("ejs");
let bodyParser=require("body-parser");

let app = express();
app.use(express.static(__dirname+"/")); //정적자원의 루트 지정
app.use(bodyParser.json());  //사용등록
app.use(express.urlencoded({extended:false}));  //false- querystirng, false - qs 

//mysql 커넥션풀 생성 
let pool=mysql.createPool({
    host:"localhost",
    user:"root",
    password:"1234",
    database:"jsp",
    connectionLimit:20
});


app.get("/notice/list", function(request, response){
    pool.getConnection(function(error, con){
        if(error){
            console.log("접속 얻기 실패");
        }else{
            console.log("접속 얻기 성공");
            var sql="select * from notice order by notice_id desc";

            con.query(sql, function(err, rs, fields){
                let view=fs.readFileSync("notice/list.ejs","utf-8");

                response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                response.end(ejs.render(view, {
                    noticeList:rs
                }));                
            });
        };        
    });
});


app.post("/notice/regist", function(request, response){
    //URLSearchParams 이용할 필요 없이 express가 지원하는 방식으로..
    let title=request.body.title;
    let writer=request.body.writer;
    let content=request.body.content;
    
    console.log(title, writer, content);
    
    pool.getConnection(function(error, con){
        var sql="insert into notice(title, writer ,content) values(?,?,?)";
        con.query(sql, [title, writer, content], function(err,  result){
            

            if(err){
                console.log("등록실패");
            }else{
                console.log("등록성공");
                response.redirect("/notice/list");
            }                     
        });
    });

});


app.listen(8888, function(){
    console.log("Server is running at 8888 port...");
});
