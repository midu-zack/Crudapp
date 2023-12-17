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
app.get("/" || "/home?", (req, res) => {

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
app.get('/',(req,res)=>{
  res.render('index');
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
            console.error("Error, adding data base",Errorcode)

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




// readfile update

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


//  Editing readfile
app.get("/updateUser/:id",(req,res)=>{

  const userid= parseInt(req.params.id)

   

  fs.readFile("./data/data.json","utf-8",(err,data)=>{
    if(err){
      console.error("error readfile modyd ");
      res.status(500)
      res.send("error readfile modyd ")

    }else{
      try{
        const existingdata = JSON.parse(data)

        const user = existingdata.find((users)=>users.id === userid )

        // console.log(user);
         
         if(user){

          res.render("index",{user})
           

         }else{

          console.error(`${user}not found`);
          res.status(500)

         }
      }catch(err){

        console.error("Error not readfile");
        res.status("Error not readfile")
        res.send("Unexpected Error , not readfile")

      }
    }
  })
})
 

// values editing section

app.put("/updateData/:id",(req,res)=>{

  const userid = parseInt(req.params.id);
  const modifydata = req.body;

  console.log(modifydata);

 

  fs.readFile("./data/data.json","utf-8",(err,data)=>{
    if(err){

      console.error("error modify not clear ");
      res.status(500)
      res.send("error modify not clear ")

    }else{
      try{
        const existingData = JSON.parse(data);
        const modifyuser = existingData.findIndex((users)=>users.id === userid );
        
        console.log(modifyuser  );


        if(modifyuser !== -1 ){

          existingData[modifyuser] = modifydata

          

          fs.writeFile("./data/data.json",JSON.stringify(existingData,null,2),(err)=>{
            if(err){
              console.error("error modifyd not clear ");
              res.status(500)
              res.send("error modifyd not clear ")
        
            }else{
              console.log(" data modifying");
              res.status(200)
              res.send("Data modifying")
        
            }
          })

        }else{
          console.log("datas not update");
          res.send("Datas not update")
        }
      }catch(err){
        console.error("Unexpected Error in updatesection");
        res.send("Unexpected Error in updatesection")
        res.status(404)
      }

    }
  })

})






// delete section
 
app.delete('/deleteuser/:id', (req, res) => {
  const userId = parseInt(req.params.id);

  fs.readFile('./data/data.json', 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading database for deleting user');
      res.status(500).send('Internal Server Error');
    } else {
      try {
        let existingData = JSON.parse(data);
        console.log(existingData);

        const userIndex = existingData.findIndex((user) => user.id === userId);

        if (userIndex !== -1) {
          existingData.splice(userIndex, 1);

          existingData = existingData.map((user, index) => {
            user.id = index + 1;
            return user;
          });

          fs.writeFile('./data/data.json', JSON.stringify(existingData, null, 2), (err) => {
            if (err) {
              console.error('Database deletion not possible');
              res.status(500).send('Internal Server Error');
            } else {
              console.log('Delete successful');
              res.status(200).send('Deleted data');
            }
          });
        } else {
          console.log(`User with ID ${userId} not found`);
          res.status(404).send('User not found');
        }
      } catch (err) {
        console.error('Unexpected error in delete');
        res.status(500).send('Unexpected Error in deletion section');
      }
    }
  });
});




 
 

 
const PORT = process.env.PORT || 8030;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
