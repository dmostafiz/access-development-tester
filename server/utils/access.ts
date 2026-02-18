interface User {
    userId: string
    first_name: string
    last_name: string
    email: string
}

export const importUserToAccessDevelopment = async (user: User) => {
    const organization_key = 203865
    const program_key = 203865

    try {
        const res = await $fetch<any>('https://amt.accessdevelopment.com/api/v1/imports', {
            method: 'POST',
            body: {
                "import": {
                    "members": [
                        {
                            "organization_customer_identifier": organization_key,
                            "program_customer_identifier": program_key,
                            "first_name": user.first_name,
                            "last_name": user.last_name,
                            "email_address": user.email,
                            "member_customer_identifier": user.userId,
                            "member_status": "OPEN"
                        }
                    ]
                }
            },
            headers: {
                'Access-Token': 'ee5ceda6f9dbabcd47a2804f5459a25d4b70e2b20914d0a48888c8ff3000c653'
            }
        })

        console.log('Acd import done')
        console.dir(res, { colors: true, depth: null })

        return res

    } catch (error: any) {
        console.error('Failed to import user to Access Development:', error)
        // We log the error but don't rethrow to avoid failing the user creation if external API is down
        return null
    }
}
