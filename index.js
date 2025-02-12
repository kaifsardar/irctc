const express = require('express')
const app = express()
const authRoute=require('./routes/auth.js');
const adminRoute=require('./routes/admin.js');
const bookingRoute=require('./routes/booking.js')
const trainRoute=require('./routes/trains.js')



require('dotenv').config();

const port=process.env.PORT;
app.use(express.json());
app.use('/auth',authRoute);
app.use('/admin',adminRoute)
app.use('/trains',trainRoute);
app.use('/booking',bookingRoute);

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(` Irctc listening on port ${port}`)
  })
