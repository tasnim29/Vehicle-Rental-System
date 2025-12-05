import express, { Request, Response } from "express"
import initDB from "./config/dataBase"
import config from "./config";
import { authRoutes } from "./modules/auth/auth.route";

const port = config.port
const app = express()
// parser
app.use(express.json());

// initialize database
initDB()

// auth CRUD
app.use("/api/v1/auth",authRoutes)



app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
