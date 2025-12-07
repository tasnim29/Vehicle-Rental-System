import { Router } from "express";
import auth from "../../middleware/auth";
import { bookingControllers } from "./bookings.controller";

const router = Router()
router.post("/",auth("admin","customer"),bookingControllers.createBookings)
router.get("/",auth("admin","customer"),bookingControllers.getAllBookings)

export const bookingRoutes = router;