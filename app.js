
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
​
var validUrl = require('valid-url');
const shortid = require('shortid');
var Schema = mongoose.Schema;
var cors = require('cors');
​
var app = express();
​
​
// Basic Configuration 
var port = process.env.PORT || 3000;
​
/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
​
mongoose.connect(process.env.MONGO_URI)
.then(
  () => {
    console.log("mongo opened")
    
  },
  err => {
    console.error("### error starting mongo")
    console.error(err)
  }
);
​
var urlSchema = new mongoose.Schema({
      orig_url: { type: String, required: true },
      short_url: String
  });
var URL = mongoose.model('URL', urlSchema);
​
app.use(cors());
​
​
app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());
​
app.use('/public', express.static(process.cwd() + '/public'));
​
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});
​
  
// your first API endpoint... 
app.post("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});
​
app.post('/api/shorturl/new',(req, res, next) => {
  var longurl = req.body.url;
  
  if (validUrl.isUri(longurl)){
          
     let shortCode = shortid.generate();
         shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');     
          
     var data = new URL({
          orig_url: longurl,
           short_url: shortCode });
         
     data.save(err=>{
             if(err){
             res.send(err)}    
          });
      }
    else{
       res.json({"error":"invalid URL"});            
       }
          return res.json(data);
     }
   );

app.get('/:urlToForward',(req, res, next) =>{
var shorterurl = req.params.urlToForward;
 URL.findOne({'short_url': shorterurl}, (err,data)=>{
 if(err) { res.send("error reading database");}
   else{
 res.redirect(301, data.orig_url);
   }
 });
}
);


app.use(function(req, res, next){
 res.status(404);
 res.type('txt').send('Not founded');
});

app.listen(port, function () {
 console.log('Node.js listening ...');
});