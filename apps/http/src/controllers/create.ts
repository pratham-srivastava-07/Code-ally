import prismaClient from "@repo/db/client";
import { Request, Response } from "express";

export default async function createRoute(req: Request, res: Response): Promise<void> {
    // takes project-name and framework as inputs 
    const {projectName, framework} = req.body;

    const newProject = await prismaClient.projects.create({
        data: {
            projectName: projectName,
            framework: framework
        }
    })
    
}