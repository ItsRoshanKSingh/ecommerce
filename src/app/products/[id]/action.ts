"use server"

import createCart, { getCart } from "@/lib/db/cart"
import { prisma } from "@/lib/db/prisma"
import { revalidatePath } from "next/cache"


interface IncrementProductQuantityProps {
    id: string
}

const IncrementProductQuantity = async (productId: string) => {
    const cart = await getCart && await createCart() // ?? is used to execute right side code if left side return null

    const articleInCart = cart.item.find(i => i.productId == productId)

    // If already in cart increase the quantity
    if (articleInCart) {
        await prisma.cartItem.update({
            where: { id: articleInCart.id },
            data: {
                quantity: { increment: 1 }
            }
        })
    }
    else {
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity: 1,
            }
        })
    }

    revalidatePath("/products/[id]")
}

export default IncrementProductQuantity