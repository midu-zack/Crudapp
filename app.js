const express = require("express");
const app = express();
const path = require('path');
const ejs = require('ejs');
const bodyparser = require('body-parser');
const fs = require('fs');
const { send, exit } = require("process");
const { get } = require("http");
const { isUtf8 } = require("buffer");
const { error } = require("console");


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
            res.status(200)
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

 app.get("/getdetails",(req,res)=>{
  fs.readFile("./data/data.json","utf-8",(err,data)=>{
    
      if(err){
        console.error("Error, not show in table", )
        res.status(500)
        res.send("Error, not show in table")

      }else{
        try{
          const existingdata = JSON.parse(data)
          res.status(200).json(existingdata)
        }catch(error){
          console.error("Unexpected error , show in table");
          res.status(500)

        }
      
      }
    
  })
 });


//  modifyd
 


// delete section
app.delete("/deleteuser/:id",(req,res)=>{
  const userid = parseInt(req.params.id);

  fs.readFile("./data/data.json","utf-8",(err,data)=>{
    if(err){
      console.error("error reading database for deleting user");
      res.status(500)
    }else{
      try{
        let existingdata = JSON.parse(data)
        
        console.log(existingdata);
        const userid = 1;
        const testid = existingdata.find((users)=> users.id === userid)
        
        // console.log( "are you working now");


        if(testid !== -1){
          existingdata.splice(testid,1)

          existingdata = existingdata.map((object,testid)=>{
            object.id = testid +1
            return object;
          });

         

          fs.writeFile("./data/data.json",JSON.stringify(existingdata,null,2),(err)=>{
            if(err){
              console.error("database deletion not possible ");
              res.status(500)
              res.send("not possible deletion")
              
            }else{
              console.log("delete successfully");
              res.status(200)
              res.send(" deleted datas ")
            }
          });

        }else{
          console.log(`given ${userid}`);
          res.status(404)
        }

      }catch(err){
        console.error("unexpectedrror in delete ");
        res.status(500)
        res.send("Unexpected Errror in deletion section ")

      }
    }

  })
})
 

 
const PORT = process.env.PORT || 4030;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
