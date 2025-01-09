import { Request, Response } from "express";
import prismaClient from "@repo/db/client";
import zod from "zod"

const signUpBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    name: zod.string()
})
export default async function signupRoute(req: Request, res: Response): Promise<void> {
    const body = req.body
    const parsedData =  signUpBody.safeParse(body)

    if(!parsedData.success) {
        // console.log(parsedData.error)
        res.status(411).json({message: "Signup failed/ Invalid credentials"})
        return;
    }  

    const existingUser = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username
        }
    })

    if(existingUser) {
         res.status(403).json({message: "User already exists"})
         return
    }

    const newUser = await prismaClient.user.create({
        data: {
            email: parsedData.data.username,
            passworrd: parsedData.data.password,
            name: parsedData.data.name
        }
    })
     res.status(200).json({
        message: "Please verify by checking email"
    })
    return
}