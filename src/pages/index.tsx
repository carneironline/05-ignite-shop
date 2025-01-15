import Image from 'next/image';
import { useKeenSlider } from 'keen-slider/react';
import { HomeContainer, Product } from '@/styles/pages/home';

import 'keen-slider/keen-slider.min.css';

import { GetStaticProps } from 'next';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';
import Link from 'next/link';

interface HomeProps {
    products: {
        id: string;
        name: string;
        imageUrl: string;
        price: number;
    }[];
}

export default function Home({ products }: HomeProps) {
    const [sliderRef] = useKeenSlider({
        slides: {
            perView: 3,
            spacing: 48,
        },
    });

    return (
        <HomeContainer ref={sliderRef} className='keen-slider'>
            {products.map((product) => {
                const name = product.name;
                const price = product.price;

                return (
                    <Link key={product.id} href={`/product/${product.id}`}>
                        <Product className='keen-slider__slide'>
                            <Image
                                src={product.imageUrl}
                                width={520}
                                height={520}
                                alt=''
                            />

                            <footer>
                                <strong>{name}</strong>
                                <span>{price}</span>
                            </footer>
                        </Product>
                    </Link>
                );
            })}
        </HomeContainer>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const response = await stripe.products.list({
        expand: ['data.default_price'],
    });

    const products = response.data.map((product) => {
        const price = product.default_price as Stripe.Price;
        const formattedPrice = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price.unit_amount ? price.unit_amount / 100 : 0);

        return {
            id: product.id,
            name: product.name,
            imageUrl: product.images[0],
            price: formattedPrice,
        };
    });

    return {
        props: {
            products,
        },
        revalidate: 60 * 60 * 2, // 2 hours
    };
};
