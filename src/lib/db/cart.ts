import { cookies } from 'next/dist/client/components/headers'

import { Prisma } from '@prisma/client'
import { prisma } from "./prisma"


// Since Product is different model, Cart will not have product details only id. to get the product types
export type CartWithProduct = Prisma.CartGetPayload<{
    include: { item: { include: { product: true } } }
}>

export type ShoppingCartType = CartWithProduct & {
    size: number,
    subtotal: number
}

// get the cart from database
export async function getCart(): Promise<ShoppingCartType | null> {

    const localCartId = cookies().get("localCart")?.value

    // Find the cart from db
    const cart = localCartId ?
        await prisma.cart.findUnique({
            where: { id: localCartId },
            include: { item: { include: { product: true } } }
        }) : null

    if (!cart) return null

    return {
        ...cart,
        size: cart.item.reduce((accumulate, i) => accumulate + i.quantity, 0), //i is single item where as item is multple item from cart model
        subtotal: cart.item.reduce((accumulate, i) => accumulate + i.quantity * i.product.price, 0)
    }
}

export const createCart = async (): Promise<ShoppingCartType> => {
    const newCart = await prisma.cart.create({
        data: {} // This will create an empty card with timestamp only
    })

    // TODO: Need Encryption and secure setting in the real production app
    // This is creating an anonymous cart when user is not logged in
    cookies().set("localCartId", newCart.id)

    return {
        ...newCart,
        item: [],
        size: 0,
        subtotal: 0
    }
}

export default createCart