
import express from 'express'
import { config } from "dotenv";
import connectToDatabase from './config/databaseConnection';
config()
const app = express();
connectToDatabase();
const Port = process.env.PORT || 3000;
app.use(express.json());

app.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`)
})