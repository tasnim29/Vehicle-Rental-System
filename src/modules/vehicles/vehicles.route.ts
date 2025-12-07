import { Router } from "express"
import { vehicleController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router=Router()

router.post("/",auth("admin"),vehicleController.createVehicle)
router.get("/",vehicleController.getAllVehicle)
router.get("/:vehicleId",vehicleController.getSingleVehicle)
router.put("/:vehicleId",auth("admin"),vehicleController.updateSingleVehicle)
router.delete("/:vehicleId",auth("admin"),vehicleController.deleteSingleVehicle)

export const vehicleRoutes = router;