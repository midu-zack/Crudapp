const express = require("express");
const app = express();

// Serve static files from the "crudapp" folder

app.use(express.static("pages"));

const name = "Muhammed midlaj"
const age = 18


app.post('/submit',(req,res)=>{
  console.log(req.body);
  
})





// Define your routes or other middleware here

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);

});

