
import crypto from 'node:crypto'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'User ID is required'
        })
    }

    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(id)
        }
    })

    if (!user) {
        throw createError({
            statusCode: 404,
            message: 'User not found'
        })
    }

    const organization_key = 203865
    const program_key = 203865
    const member_key = user.userId

    const finalKey = `${organization_key}-${program_key}-${member_key.toUpperCase()}`

    console.log('######## acd combined key key: ', finalKey)

    const hash = crypto.createHash('sha256').update(finalKey).digest('hex')

    console.log('######## acd sha256 hash key: ', finalKey)

    const url = `https://deals.xceleraterewards.com/director?cvt=${hash}`

    console.log('###### acd final url:', url)

    return { url }
})
