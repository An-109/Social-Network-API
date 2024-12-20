import { Router } from "express";
import { addReaction, createThought, deleteReaction, deleteThought, getThoughtById, getThoughts, updateThought } from "../../controller/thoughts-controller.js";
const router = Router();
router.route("/").get(getThoughts).post(createThought);
router
    .route("/:id")
    .get(getThoughtById)
    .delete(deleteThought)
    .put(updateThought);
router.route("/:id/reactions").post(addReaction);
router.route("/:id/reactions/:reactionId").delete(deleteReaction);
export default router;
