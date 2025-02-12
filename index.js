const express = require('express')
const app = express()
const authRoute=require('./routes/auth.js');
const trainRoute=require('./routes/train.js');
const bookingRoute=require('./routes/booking.js')



require('dotenv').config();

const port=process.env.PORT;
app.use(express.json());
app.use('/auth',authRoute);
app.use('/train',trainRoute);
app.use('/booking',bookingRoute);

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(` Irctc listening on port ${port}`)
  })
