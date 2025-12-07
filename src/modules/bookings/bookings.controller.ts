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
const getAllBookings = async (req: Request, res: Response) => {
  try {

    await bookingServices.autoReturn ()

    const results = await bookingServices.getAllBookings(req.user!);

    res.status(200).json({
      success: true,
      message: "Booking retrieved  successfully",
      data:results
      
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateBookings = async (req: Request, res: Response) => {
  const status =req.body.status
  try {
    const results = await bookingServices.updateBookings(status,req.user!,req.params.bookingId!);
    console.log(results)

    res.status(200).json({
      success: true,
      message: "Booking updated  successfully",
      data:results
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const bookingControllers = {
  createBookings,getAllBookings,updateBookings
};
