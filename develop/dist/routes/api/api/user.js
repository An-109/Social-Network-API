import { Router } from "express";
const router = Router();
import { getUsers, getSingleUser, createUser, deleteUser, updateUser, addFriend, deleteFriend, } from "../../../controller/user-controller";
router.route("/").get(getUsers).post(createUser);
router.route("/:userId").get(getSingleUser).delete(deleteUser).put(updateUser);
router.route("/:userId/friends/:friendsId").delete(deleteFriend);
router.route("/:userId/friends").post(addFriend);
export default router;
