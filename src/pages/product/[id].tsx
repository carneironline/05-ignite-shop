import {
    ImageContainer,
    ProductContainer,
    ProductDetails,
} from '@/styles/pages/product';
import { useRouter } from 'next/router';

export default function Product() {
    const { query } = useRouter();

    return (
        <ProductContainer>
            <ImageContainer></ImageContainer>

            <ProductDetails>
                <h1>Camise X</h1>

                <span>R$ 79,90</span>

                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Minima voluptatibus, blanditiis cum perferendis molestiae
                    iure reiciendis tempora iste eos molestias ad laborum
                    debitis laudantium nobis cupiditate magni temporibus quia
                    commodi.
                </p>

                <button>Comprar agora</button>
            </ProductDetails>
        </ProductContainer>
    );
}
