const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
// fronted code is inside merncrud folder name is fcrud
app.use(cors());
app.use(express.json());
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/crud', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.log(err);
});

const MyCrudSchema = new mongoose.Schema({
  name: String,
  email:  {
      type:String,
        unique:true,        
  },
  password: String
});
const MyCrudModel = mongoose.model("crud", MyCrudSchema);
app.post('/api/data', async (req, res) => {
  const { name, email, password } = req.body;
 if(!name || !email || !password){
   res.send('please enter data first');
    return;
 }
  else {
 console.log('failed to updated ');     
  }
  try {
    const data = await MyCrudModel.create({ name, email, password });
    res.send({message:"Account Created"});
    console.log(data);
  } catch (err) {
    console.log(err);
  }
});
// get data
app.get('/getdata', async (req, res) => {
  try {
    const mydata = await MyCrudModel.find();
    res.send(mydata);
    console.log(mydata);
  } catch (err) {
    console.log(err);
  }
});
 // delete 
app.delete('/DeleteData/:id', async (req,res)=>{
  const id=req.params.id;
  try {
    const mydata= await MyCrudModel.findByIdAndDelete({_id:id})
    console.log(mydata);    
    res.send('deleted Data'+mydata);
  } catch (error) {
    console.log(error);
  }
});
app.put('/UpdateData/:id', async (req, res) => {
  const { id } = req.params; // Get the ID from request params
  const { name, email, password } = req.body; // Get the updated data from request body
  try {
    // Find the record in the database by ID and update it
    const updatedData = await MyCrudModel.findByIdAndUpdate(id, { name, email, password }, { new: true });
    if (!updatedData) { 
      return res.status(404).json({ message: 'Record not found' });
    }
    return res.status(200).json({ message: 'Account Updated', data: updatedData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update account', error });
  }
});
app.listen(2000, () => {
  console.log('Server is listening on port 2000');
});
