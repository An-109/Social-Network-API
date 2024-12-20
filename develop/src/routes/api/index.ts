import { Router } from "express";
const router = Router();

import userRoutes from "./user.js";
import thoughtRoute from "./thoughts.js";

router.use("/users", userRoutes);
router.use("/thoughts", thoughtRoute);
export default router;