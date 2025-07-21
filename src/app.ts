
import express from 'express'
import { config } from "dotenv";
import connectToDatabase from './config/databaseConnection';
import bodyParser from 'body-parser';
config()
const app = express();
connectToDatabase();
const Port = process.env.PORT || 3000;
app.use(express.json());
app.use(bodyParser.json());

import busRoutes from './routes/bus-routes';
import busStopRoutes from './routes/bus-stops';
app.use('/api/v1', busRoutes);
app.use('/api/v1/bus-stop', busStopRoutes);

app.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`)
})