import { Request, Response } from "express";
import { bookingServices } from "./bookings.service";

const createBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBookings(req.body);
    // console.log(result.result.rows[0]);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        ...result.result.rows[0],
        vehicle: {
          vehicle_name: result.vehicle.vehicle_name,
          daily_rent_price: result.vehicle.daily_rent_price,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const bookingControllers = {
  createBookings,
};
