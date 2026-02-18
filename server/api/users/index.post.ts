import { importUserToAccessDevelopment } from '../../utils/access'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body.first_name || !body.last_name || !body.email) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'Missing required fields'
        })
    }

    try {
        const user = await prisma.user.create({
            data: {
                first_name: body.first_name,
                last_name: body.last_name,
                email: body.email
            }
        })

        // Import user to Access Development
        const accessRes: any = await importUserToAccessDevelopment(user)

        if (accessRes?.data?.[0]?.id) {
            try {
                const updatedUser = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        acd_id: parseInt(accessRes.data[0].id)
                    }
                })
                return updatedUser
            } catch (updateError) {
                console.error('Failed to update user with acd_id:', updateError)
                // Return the original user if update fails
                return user
            }
        }

        return user
    } catch (error: any) {

        console.log('User Create Error:')

        console.dir(error, { colors: true, depth: null })


        if (error.code === 'P2002') {
            throw createError({
                statusCode: 409,
                statusMessage: 'Conflict',
                message: 'Email already exists'
            })
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: error.message || 'Unknown error'
        })
    }
})
