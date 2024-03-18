let express = require('express');
let app = express();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
//const mongoUrl = "mongodb://localhost:27017";
const mongoUrl="mongodb+srv://test:test123@cluster0.uy8eapv.mongodb.net/Mydata?retryWrites=true&w=majority&appName=Cluster0"
const dotenv = require('dotenv')
dotenv.config()
const bodyparser = require('body-parser')
const cors  = require('cors')
let port = process.env.PORT || 8200;
var db;



app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json());
 app.use(cors())


app.get('/',(req,res) => {
  res.send(<center><h2>Hii Guys.. This is Lakshman Reddy</h2></center>)
})

// we use this to get the restaurant data
app.get('/menu',(req,res) => {
  db.collection('RestaurantsData') .find().toArray((err,result) =>{
      if(err) throw err;
      res.send(result)
  })
})

// here i have used post to update or add  data in the mongodb
app.post('/placeoder', (req, res) => {
  db.collection('orders').insertOne(req.body, (err, result) => {
    if (err) throw err;
    res.send('data added');
  });
});
// we are giving the values using postman
app.post('/menuItem',(req,res) =>{
  console.log(req.body)
  db.collection('mealtype').find({mealtype_id:{$in:req.body}}).toArray((err,result) =>{
      if(err) throw err;
         res.send(result)
})
})

// update
app.put('/updateOrder/:id',(req,res) => {
  let oId = mongo.ObjectId(req.params.id)
  let status = req.query.status?req.query.status:'Pending'
  db.collection('orders').updateOne(
      {_id:oId},
      {$set:{
          "status":status,
          "bank_name":req.body.bank_name,
          "bank_status":req.body.bank_status
      }},(err,result)=>{
          if(err) throw err;
          res.send(`Status Updated to ${status}`)
      }
  )
})




MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, connection) => {
  if (err) {
    console.log("Error While Connecting:", err); // Log the error
    return;
  }
  db = connection.db('Mydata');
  app.listen(port, () => {
    console.log(`Listening to port no ${port}`)
  })
})

