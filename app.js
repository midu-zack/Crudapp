const express = require("express");
const app = express();
const path = require('path');
const ejs = require('ejs');
const bodyparser = require('body-parser');
const fs = require('fs');
const { send } = require("process");
const { get } = require("http");


app.set("views", "./views")
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(bodyparser.json());

// home
app.get("/"|| "/home?", (req, res) => {
  const data = {
    formpage: "miduzack",
    user: null,
  };
  res.render("index", data);
});

// table
app.get('/home?', (req, res) => {
  res.render("table");
});

// index
app.get('/form?',(req,res)=>{
  res.render("index")
})


// Submit
  app.post("/submit",(req,res)=>{
  const userdata = req.body;
  

  fs.readFile("./data/data.json","utf-8",(err,data)=>{
    if(err){
      console.error("Error while reading users.json");
      res.status(500).send("Error while reading users.json");
    }else{
      try{
        const existingdata = JSON.parse(data)
        userdata.id =existingdata.length+1;
        existingdata.push(userdata)

       

        fs.writeFile("./data/data.json",JSON.stringify(existingdata,null,2),(Errorcode)=>{
          if(err){
            console.error("Error, adding data bise",Errorcode)

          }else{
            res.status(500)
            res.send("new user added ")
            console.log(data);
          }

        })
      }catch(error){
        console.error("unexpected error");
        res.status(500).send(`Unexpected error:${error}`);

      }
    }
  }
  );
});

//  app.get(getdetails)
 

 
const PORT = process.env.PORT || 4030;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
