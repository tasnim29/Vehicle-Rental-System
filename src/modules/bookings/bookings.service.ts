import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/dataBase"

const createBookings = async(payload:Record<string,unknown>)=>{
    const {customer_id,vehicle_id,rent_start_date,rent_end_date} = payload;

    const vehicleRes  = await pool.query(`SELECT * FROM Vehicles WHERE id=$1`,[vehicle_id]);
     if (vehicleRes.rows.length === 0) {
    throw new Error("Vehicle not found");
  }
    const vehicle = vehicleRes.rows[0];

    if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available for booking");
  }
   const start = new Date(rent_start_date as string);
  const end = new Date(rent_end_date as string);

  if (start >= end) {
    throw new Error("Invalid date range");
  }
   const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
   const total_price = days * vehicle.daily_rent_price;

   const result = await pool.query(`INSERT INTO Bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *`,[customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,"active"])

    await pool.query(
    `UPDATE Vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );
  return {result,vehicle}
}
const getAllBookings = async(loggedUser:JwtPayload)=>{
  if(loggedUser.role === "customer"){
    const bookingRes = await pool.query(`SELECT * FROM Bookings WHERE customer_id=$1`,[loggedUser.id]);

    if (bookingRes.rows.length === 0) {
      return [];
    }

    const vehicleId = bookingRes.rows[0]. vehicle_id
    const vehicleRes= await pool.query(`SELECT * FROM Vehicles WHERE id=$1`,[vehicleId])
    return {bookingRes,vehicleRes};
  }else if(loggedUser.role ==="admin"){
    const result = await pool.query(`SELECT * FROM Bookings`);
    return result;

  }
  
}



export const bookingServices = {
    createBookings,getAllBookings
}