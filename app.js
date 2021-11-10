//var fs = require('fs');
// var rawData = fs.readFileSync("users.json");
//var proData = fs.readFileSync("products.json");
//var jsonData = JSON.parse(rawData);
//var proDatas = JSON.parse(proData);
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
const session = require("express-session");
const cookieParser = require('cookie-parser');
app.use(session({secret:"some secret message"}));
var ObjectId = require('mongodb').ObjectID;
var exprhbs = require('express-handlebars');

app.engine('.hbs',exprhbs({
    extname: '.hbs',
    defaultLayout:'main'
}));
app.set('view engine','hbs');
var sess;
var long = 0;


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(express.static('public'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/'+'Anasayfa.html');
});

app.get('/login',function(req,res){
    res.sendFile(__dirname+"/"+"Login.html");
});

app.get('/register',function(req,res){
    res.sendFile(__dirname+"/"+"Register.html");
});

app.get('/products',function(req,res){
    
    MongoClient.connect(url,function(err,db){
        if(err) throw err;
    db.db('mydb').collection("prods").find({}).toArray(function(err,result){
            if(err) throw err;
            if(req.session.sc){
                res.render("prodss",{prods:result, sc:req.session.sc, oturum:req.session.fn,mesaj:req.session.ef});
                for(var i=0; i<result.length; i++){
                     req.session.StokS.push(result[i].stok);
                }
            }
            else
                res.render("prodss",{prods:result, oturum:req.session.fn,mesaj:req.session.ef});
        });
    });
});

app.get('/SignOut',function(req,res){
    res.sendFile(__dirname+"/"+"Anasayfa.html");
})

app.get('/prodDetail',function(req,res){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
     
        dbo.collection("prods").findOne({_id:new ObjectId(req.query.id)},
        function(err, result) { 
          if(err) throw err;
      res.render("prodDetails",{prod:result,oturum:req.session.fn});
     //  console.log(result.ürün);
        });
    });
});


app.get('/shoping',function(req,res){
     // var query = {_id:ObjectId(req.session.sc)};
        var items = [];
        var total = [];
        var sayı = 0;
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            dbo.collection("prods").find({}).toArray(function(err, result) {
              if (err) throw err;

                for(var i=0; i<result.length; i++){
                    for(var j=0; j<long; j++){
                        if(result[i]._id == req.session.sc[j]){
                        items.push(result[i]);
                        total.push(result[i].fiyat);
                        if(result[i].id==0){
                            req.session.id0++;
                        }
                        if(result[i].id==1){
                            req.session.id1++;
                        }
                        if(result[i].id==2){
                            req.session.id2++;
                        }
                        }
                    }
                }
                for(var i=0; i<total.length; i++){
                   sayı += total[i];
                }
                res.render("shopping",{shop:items,tot:sayı,oturum:req.session.fn});
            });
          });   
});

app.get('/tebrik',function(req,res){
    
  //  req.session.ef = "tebrikler alışveriş tamamlandı...";
     MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = { ürün: "Phone" };
    var newvalues = { $set: {stok: req.session.StokS[2]-req.session.id2} };
    dbo.collection("prods").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      db.close();
    });
  }); 
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = { ürün: "Computer" };
    var newvalues = { $set: {stok: req.session.StokS[0]-req.session.id0} };
    dbo.collection("prods").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      db.close();
    });
  }); 
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = { ürün: "Television" };
    var newvalues = { $set: {stok: req.session.StokS[1]-req.session.id1} };
    dbo.collection("prods").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      db.close();
    });
  }); 
    
    long=0;
    req.session.sc = [];
    res.redirect('/products');
});



app.get("/addToSC",function(req,res){
    if(req.session.sc){
        long++;
        req.session.sc.push(req.query.id);
        res.redirect('/products');
    }
})


app.post('/log',urlencodedParser,function(req,res){
        sess=req.session;
        var matchFound = false;
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            dbo.collection("user_credentials").find({}).toArray(function(err, result) {
              if (err) throw err;
                for(var i=0; i<result.length; i++)
                    if(result[i].us == req.body.user_name &&
                        result[i].pass == req.body.password){
                            matchFound = true;
                            sess.sc = [];
                            long=0;
                            sess.StokS = [];
                            sess.id0 = 0;
                            sess.id1 = 0;
                            sess.id2 = 0;
                            sess.fn = req.body.user_name;
                            break;
                        }
                        if(matchFound){
                            res.redirect(303,"/products");
                        }
                        else{
                            res.redirect("/login");
                        }
              db.close();
            });
          });
    //    for(var i=0; i<jsonData.length; i++)
    //    if(jsonData[i].us == req.body.user_name &&
    //        jsonData[i].pass == req.body.password ){
    //         matchFound = true;
    //         break;
    //     }
});

app.post('/reg',urlencodedParser,function(req,res){
    if(req.body.password == req.body.repassword){
    var regFound = true;
    let user_name = req.body.user_name;
    let password = req.body.password;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myobj = { us: user_name, pass: password };
        dbo.collection("user_credentials").insertOne(myobj, function(err, res) {
          db.close();
        });
     
        res.redirect(303,"/login");         
            });
        }
        else{
             res.redirect("/register");
        }

});

app.listen(8000,function(){
    console.log("Server Working...");
});