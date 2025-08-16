import express from "express"
import getUser, {
    registerUser, 
    loginUser, 
    logoutUser, 
    currentUser, 
    refresh, 
    changePassword, 
    updateUser, 
    deleteUser} 
    from "../controllers/userController.js"
import validateToken,{contentPermission, validateRefreshToken} from "../middleware/userAuth.js"
const router = express.Router();

router.get("/", getUser)
router.post("/register", registerUser)
router.get("/refresh", validateRefreshToken, refresh)
router.post("/login", loginUser)
router.get("/logout", logoutUser)
router.get("/current", validateToken, currentUser)
router.put("/change-password", validateToken, changePassword)
router.put("/update", validateToken, updateUser)
router.delete("/:id", contentPermission, deleteUser)

export default router