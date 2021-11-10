const express = require('express');
const app = express();
const fs = require("fs");
const session = require("express-session");

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(session({secret:"some secret message"}));

app.get('/',function(request,response){
 //   var reqproperties = "ip: "+request.ip+", path: "+request.path
 //   +", protocol: "+request.protocol;
 //   response.send(reqproperties);
        response.sendFile(__dirname+"/"+"index.html");
})

app.get("/index.html",function(req,res){

})

app.get("/login",function(req,res){
    
    res.sendFile(__dirname+"/"+"form.html");
})

app.get("/login2",function(req,res){
    res.sendFile(__dirname+"/"+"form2.html");
})

app.get("/checkSession",function(req,res){
    if(req.session.fn)
    res.send("You have a session")
    else
    res.send("You do NOT have a session");
})

var car = {name:"toyota"}
car.year = 2012;

app.get('/processLogin',function(req,res){
    req.session.fn = req.query.first_name;
    console.log(req.session.id);
    res.send(req.query.first_name+", "+req.query.last_name);
});

app.post("/processLogin2",urlencodedParser,function(req,res){
    req.session.fn = req.body.first_name;
    res.send(req.body.first_name+", "+req.body.last_name);
})

app.listen(9000,function(){
    console.log("Example listtenning");
})

/*
app.get('/product',function(req,res){
    var id = req.query.id;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("prods").find({}).toArray(function(err, result) { 
    var productData = "<!DOCTYPE html><html><head><title>Product Details</title></head><body>"+
        "<p> Kullanıcı isim :" +req.session.fn+"</p>"+
        "<p> Ürün : "+result[id].ürün+" </p>"+
        "<p> Fiyat : "+result[id].fiyat+" </p>"+
        "<p> Stok : "+result[id].stok+"</p>"+
        "<p><img src=\"images\\"+result[id].imgsrc+"\" alt=\"image\"></p>"+
        "<a href=/products>Products</a>" 
        +"</body></html>";
    res.send(productData);
    db.close();
});
});
});
*/