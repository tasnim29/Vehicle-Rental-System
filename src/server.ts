import express, { Request, Response } from "express"
import initDB from "./config/dataBase"
import config from "./config";
import { authRoutes } from "./modules/auth/auth.route";
import { vehicleRoutes } from "./modules/vehicles/vehicles.route";
import { userRoutes } from "./modules/users/user.route";
import { bookingRoutes } from "./modules/bookings/bookings.route";

const port = config.port
const app = express()
// parser
app.use(express.json());

// initialize database
initDB()

// auth CRUD
app.use("/api/v1/auth",authRoutes)

// vehicle CRUD
app.use("/api/v1/vehicles",vehicleRoutes)

// user CRUD
app.use("/api/v1/users",userRoutes)

// bookings crud
app.use("/api/v1/bookings",bookingRoutes)

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
