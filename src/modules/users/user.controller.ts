import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  const result = await userServices.getAllUsers();
  try {
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No users found",
        data: result.rows[0],
      });
    }
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateUser = async (req: Request, res: Response) => {
  const result = await userServices.updateUser(
    req.user!,
    req.params.userId!,
    req.body
  );
  try {
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: result.rows[0],
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const userControllers = {
  getAllUsers,
  updateUser,
};
