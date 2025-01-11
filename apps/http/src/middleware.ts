import prismaClient from "@repo/db/client";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'

export default async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeaders = req.headers.authorization

    if(!authHeaders || !authHeaders.startsWith("Bearer")) {
        res.status(411).json({message: "wrong headers or no headers"})
        return;
    }

    const token = authHeaders.split(' ')[1]

    if(!token) {
        res.status(404).json({message: "Token not found"})
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
        // @ts-ignore
        req.id = decoded.id
        next()
    } catch(e) {
        console.log(e);
    }
}

export async function authorizeRole(allowedRoles: any[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.user?.id

        try {
            if(!id || typeof id !== 'string') return res.status(401).json({message: "Invalid or missing user ID"})

            const userRole = await prismaClient.user.findFirst({
                where: {
                    id: id
                }, 
                select: {
                    role: true
                }
            })

            if(!userRole || !userRole.role) {
                res.status(404).json({message: "No userRole asigned"})
                return;
            }

            if(!allowedRoles.includes(userRole?.role)) {
                res.status(403).json({messsage: "role not recognized"})
                return;
            }
            res.status(200).json({message: "role assigned!"})

        } catch(e) {
            console.error('Authorization error:', e);
            return res.status(500).json({ message: "Error occurred during authorization", error: e });
        }
    }
}