import { stripe } from '@/lib/stripe';
import {
    ImageContainer,
    ProductContainer,
    ProductDetails,
} from '@/styles/pages/product';
import axios from 'axios';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Stripe from 'stripe';

interface ProductProps {
    product: {
        id: string;
        name: string;
        imageUrl: string;
        price: string;
        description: string;
        defaultPriceId: string;
    };
}

export default function Product({ product }: ProductProps) {
    const { query } = useRouter();
    const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
        useState(false);

    async function handleByProduct() {
        try {
            setIsCreatingCheckoutSession(true);

            const response = await axios.post('/api/checkout', {
                priceId: product.defaultPriceId,
            });

            const { checkoutUrl } = response.data;
            console.log(checkoutUrl);
            window.location.href = checkoutUrl;
        } catch (error) {
            console.log(error);

            setIsCreatingCheckoutSession(false);
        }
    }

    return (
        <ProductContainer>
            <ImageContainer>
                <Image src={product.imageUrl} width={520} height={520} alt='' />
            </ImageContainer>

            <ProductDetails>
                <h1>{product.name}</h1>

                <span>{product.price}</span>

                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Minima voluptatibus, blanditiis cum perferendis molestiae
                    iure reiciendis tempora iste eos molestias ad laborum
                    debitis laudantium nobis cupiditate magni temporibus quia
                    commodi.
                </p>

                <button
                    disabled={isCreatingCheckoutSession}
                    onClick={handleByProduct}
                >
                    Comprar agora
                </button>
            </ProductDetails>
        </ProductContainer>
    );
}

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking',
    };
};

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
    params,
}) => {
    const productId = params?.id || '';

    const product = await stripe.products.retrieve(productId, {
        expand: ['default_price'],
    });

    const price = product.default_price as Stripe.Price;

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(price.unit_amount ? price.unit_amount / 100 : 0);

    return {
        props: {
            product: {
                id: product.id,
                name: product.name,
                imageUrl: product.images[0],
                price: formattedPrice,
                description: product.description,
                defaultPriceId: price.id,
            },
        },
        revalidate: 60 * 60 * 1, // 1 hour
    };
};
