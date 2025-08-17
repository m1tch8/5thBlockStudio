import express from "express"
import validateToken from "../middleware/validateToken.js"
import validateRefreshToken from "../middleware/validateRefreshToken.js"
import validateAdmin from "../middleware/validateAdmin.js"
import getUser, {registerUser, loginUser, logoutUser, currentUser, refresh, changePassword, updateUser, deleteUser} from "../controllers/userController.js"

const router = express.Router()

router.get("/", getUser)
router.post("/register", registerUser)
router.get("/refresh", validateRefreshToken, refresh)
router.post("/login", loginUser)
router.get("/logout", logoutUser)
router.get("/current", validateToken, currentUser)
router.put("/change-password", validateToken, changePassword)
router.put("/update", validateToken, updateUser)
router.delete("/:id", validateAdmin, deleteUser)

export default router