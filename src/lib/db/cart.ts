import { cookies } from 'next/dist/client/components/headers'

import { prisma } from "./prisma"

const createCart = async () => {
    const newCart = await prisma.cart.create({
        data: {}
    })

    // TODO: Need Encryption and secure setting in the real production app
    cookies().set("localCartId", newCart.id)

}

export default createCart