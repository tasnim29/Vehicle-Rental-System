import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/dataBase";

const getAllUsers = async () => {
  const result = await pool.query(`SELECT * FROM Users`);
  return result;
};
const updateUser = async (
  loggedUser: JwtPayload,
  id: string,
  payload: Record<string, unknown>
) => {
  const { name, email, phone, role } = payload;
  // check the user
  if (loggedUser.role !== "admin" && Number(loggedUser.id) !== Number(id)) {
    throw new Error("You are not allowed to update this profile");
  }
  // not allowing the user to update his own role
  if (loggedUser.role !== "admin" && payload.role !==loggedUser.role) {
    throw new Error("You are not allowed to update your role");
  }

  const result = await pool.query(
    `UPDATE Users SET name=$1, email=$2, phone=$3,role=$4 WHERE id=$5 RETURNING *`,
    [name, email, phone, role, id]
  );
  return result;
};
const deleteUser=async(id:string)=>{
  const bookingRes = await pool.query(`SELECT * FROM Bookings WHERE  customer_id=$1 AND status = 'active'`,[id])
  const hasActiveBookings = bookingRes.rows.length;

   if(hasActiveBookings){
    throw new Error("This User has booking.You can not delete him")
  }
  const result = await pool.query(`DELETE FROM Users WHERE id=$1`, [id])
  return result

}
export const userServices = {
  getAllUsers,
  updateUser,
  deleteUser
};
