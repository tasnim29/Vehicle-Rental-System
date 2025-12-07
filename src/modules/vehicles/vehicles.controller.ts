import { Request, Response } from "express";
import { vehicleServices } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicle(req.body);
    console.log(result.rows);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getAllVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicle();
    if (result.rows.length === 0) {
      return res.status(200 ).json({
        success: false,
        message: "No vehicles found",
        data: result.rows[0],
      });
    }
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getSingleVehicle(req.params.vehicleId);
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: result.rows[0],
      });
    }
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSingleVehicle = async (req: Request, res: Response) => {
  try {
    const id = req.params.vehicleId
    const result = await vehicleServices.updateVehicle(req.body,id as string);
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: result.rows[0],
      });
    }
    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteSingleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.deleteSingleVehicle(req.params.vehicleId);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No vehicles found",
        data: result.rows[0],
      });
    }
    res.status(200).json({
      success: true,
       message: "Vehicle deleted successfully"
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const vehicleController = {
  createVehicle,
  getAllVehicle,
  getSingleVehicle,
  updateSingleVehicle,
  deleteSingleVehicle
};
