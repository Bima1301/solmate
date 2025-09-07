"use server"

import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/get-stream";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { updateUserProfileSchema, UpdateUserProfileValues } from "@/lib/validation";

export async function updateUserProfile(values: UpdateUserProfileValues) {
    const validatedRules = updateUserProfileSchema.parse(values)

    const { user } = await validateRequest()

    if (!user) throw new Error("Unauthorized")

    const updatedUser = await prisma.$transaction(async (tx) => {

        const updatedUser = await tx.user.update({
            where: { id: user.id },
            data: validatedRules,
            select: getUserDataSelect(user.id)
        })

        await streamServerClient.partialUpdateUser({
            id: updatedUser.id,
            set: {
                name: updatedUser.displayName
            }
        })

        return updatedUser
    })


    return updatedUser
}