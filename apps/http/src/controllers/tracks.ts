import prismaClient from "@repo/db/client";
import { Request, Response } from "express";
import z, { date } from 'zod'

// getting all track
export default async function getAllTracks(req: Request, res: Response): Promise<void> {
    try {
        const allTracks = await prismaClient.track.findMany({})
        res.status(200).json({message: "Got all Tracks", tracks: allTracks})
        return
    } catch(e) {
        console.log(e)
    }
}
// getting a specific track
export async function getSpecificTrack(req: Request, res: Response): Promise<void> {
    const { id } = req.params

    try {
        const getTrack = await prismaClient.track.findFirst({
            where: {
                id: id
            }
        })
        res.status(200).json({message: "Track found", track: getTrack})
        return
    } catch(e) {
        console.log(e);
    }
}

const trackBody = z.object({
    name: z.string(),
    bpm: z.number().default(120),
    timeSignature: z.string().default("4/4"),
    isPublic: z.boolean().default(true),
    ownerId: z.string()  // Add this to connect with User
});

export async function createTrack(req: Request, res: Response): Promise<void> {
    const parsedBody = trackBody.safeParse(req.body);

    if (!parsedBody.success) {
        res.status(403).json({ message: "Invalid inputs" });
        return;
    }

    try {

        const newTrack = await prismaClient.track.create({
            data: {
                name: parsedBody.data.name,
                bpm: parsedBody.data.bpm,
                timeSignature: parsedBody.data.timeSignature,
                isPublic: parsedBody.data.isPublic,
                owner: {
                    connect: { id: parsedBody.data.ownerId }  // Connect to user
                }
                
            },
            include: {
                owner: true,  
                instruments: true
            }
        });

        res.status(201).json({
            message: "Track created successfully",
            track: newTrack
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create track" });
    }
}