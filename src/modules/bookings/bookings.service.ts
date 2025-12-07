import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/dataBase";

const createBookings = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleRes = await pool.query(`SELECT * FROM Vehicles WHERE id=$1`, [
    vehicle_id,
  ]);
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
  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const total_price = days * vehicle.daily_rent_price;

  const result = await pool.query(
    `INSERT INTO Bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      "active",
    ]
  );

  await pool.query(
    `UPDATE Vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );
  return { result, vehicle };
};

const getAllBookings = async (loggedUser: JwtPayload) => {
  if (loggedUser.role === "customer") {
    const bookingRes = await pool.query(
      `SELECT * FROM Bookings WHERE customer_id=$1`,
      [loggedUser.id]
    );

    if (bookingRes.rows.length === 0) {
      return [];
    }

    const finalResult = [];
    for (const booking of bookingRes.rows) {
      const vehicleRes = await pool.query(
        `SELECT vehicle_name, registration_number, type FROM Vehicles WHERE id=$1`,
        [booking.vehicle_id]
      );
      finalResult.push({ ...booking, vehicle: vehicleRes.rows[0] || null });
    }

    return finalResult;
  }
  if (loggedUser.role === "admin") {
    const bookingRes = await pool.query(`SELECT * FROM Bookings`);

    const finalResult = [];

    for (const booking of bookingRes.rows) {
      const vehicleRes = await pool.query(
        `SELECT vehicle_name, registration_number FROM Vehicles WHERE id=$1`,
        [booking.vehicle_id]
      );
      const customerRes = await pool.query(
        `SELECT name, email FROM Users WHERE id=$1`,
        [booking.vehicle_id]
      );
      finalResult.push({
        ...booking,
        customer: customerRes.rows[0] || null,
        vehicle: vehicleRes.rows[0] || null,
      });
    }

    return finalResult;
  }
};

const updateBookings = async (
  status: string,
  loggedUser: JwtPayload,
  id: string
) => {

  // customer
  if (loggedUser.role === "customer") {
    const bookingRes = await pool.query(`SELECT * FROM Bookings WHERE id=$1`, [
      id,
    ]);

    if (bookingRes.rowCount === 0) {
      throw new Error("Booking not found.");
    }

    const booking = bookingRes.rows[0];

    if (booking.customer_id !== loggedUser.id) {
      throw new Error("You are not allowed to update this booking.");
    }

    if (status !== "cancelled") {
      throw new Error("Customers can only cancel their bookings.");
    }

    if (booking.status === "returned") {
      throw new Error("This booking has already been completed.");
    }

    if (booking.status === "cancelled") {
      throw new Error("This booking is already cancelled.");
    }

    const updatedRes = await pool.query(
      `UPDATE Bookings SET status=$1 WHERE id=$2 RETURNING *`,
      [status, id]
    );
    
    await pool.query(
      `UPDATE Vehicles SET availability_status='available' WHERE id=$1`,
      [booking.vehicle_id]
    );
    return updatedRes;
  }
  
  // admin
  if (loggedUser.role === "admin") {
    const bookingRes = await pool.query(`SELECT * FROM Bookings WHERE id=$1`, [
      id,
    ]);

    if (bookingRes.rowCount === 0) {
      throw new Error("Booking not found.");
    }

    const booking = bookingRes.rows[0];

    if (booking.customer_id !== loggedUser.id) {
      throw new Error("You are not allowed to update this booking.");
    }

    if (status !== "returned") {
      throw new Error("Admin can only return their bookings.");
    }

    if (booking.status === "returned") {
      throw new Error("This booking has already been completed.");
    }

    if (booking.status === "cancelled") {
      throw new Error("This booking is already cancelled.");
    }

    const updatedRes = await pool.query(
      `UPDATE Bookings SET status=$1 WHERE id=$2 RETURNING *`,
      [status, id]
    );
   
    const vehicleRes = await pool.query(
      `UPDATE Vehicles SET availability_status='available' WHERE id=$1 RETURNING *`,
      [booking.vehicle_id]
    );
    return {updatedRes,vehicleRes};
  }
};

export const bookingServices = {
  createBookings,
  getAllBookings,
  updateBookings,
};
