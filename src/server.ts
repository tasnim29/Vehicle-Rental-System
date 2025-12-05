import express, { Request, Response } from "express"
import initDB from "./config/dataBase"
import config from "./config";
const app = express()
const port = config.port


// parser
app.use(express.json());




initDB()

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
