import express from "express"
import { userRouter } from "./user.js"
import authMiddleware from "../middleware.js"

export const router = express.Router()

router.use("/user", userRouter)
router.use("/create", authMiddleware)