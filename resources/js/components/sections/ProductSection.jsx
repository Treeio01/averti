import SectionLayout from '@/ui/SectionLayout';
import ProductCard from '@/components/landing/ProductCard.jsx';

const CARDS = [
    {
        text: 'Averti is designed to reduce decision-making, not to chase returns',
        icon: (
            <svg className="absolute top-1/2 left-1/2 -translate-1/2" width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M33.5486 14.3776H14.3776V33.5486H33.5486V14.3776Z" fill="white"/>
                <path d="M41.217 10.5434V6.7092H37.3828V2.875H33.5486V6.7092H29.7144V2.875H25.8802V6.7092H22.046V2.875H18.2118V6.7092H14.3776V2.875H10.5434V6.7092H6.7092V10.5434H2.875V14.3776H6.7092V18.2118H2.875V22.046H6.7092V25.8802H2.875V29.7144H6.7092V33.5486H2.875V37.3828H6.7092V41.217H10.5434V45.0513H14.3776V41.217H18.2118V45.0513H22.046V41.217H25.8802V45.0513H29.7144V41.217H33.5486V45.0513H37.3828V41.217H41.217V37.3828H45.0513V33.5486H41.217V29.7144H45.0513V25.8802H41.217V22.046H45.0513V18.2118H41.217V14.3776H45.0513V10.5434H41.217ZM37.3828 37.3828H10.5434V10.5434H37.3828V37.3828Z" fill="white"/>
            </svg>
        ),
    },
    {
        text: 'Risk management is embedded into the product, not left to the user',
        icon: (
            <svg className="absolute top-1/2 left-1/2 -translate-1/2" width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.58335 19.1666H7.66669V15.3333H11.5V17.25H13.4167V19.1666H15.3334V21.0833H17.25V23H19.1667V24.9166H21.0834V1.91663H24.9167V24.9166H26.8334V23H28.75V21.0833H30.6667V19.1666H32.5834V17.25H34.5V15.3333H38.3334V19.1666H36.4167V21.0833H34.5V23H32.5834V24.9166H30.6667V26.8333H28.75V28.75H26.8334V30.6666H24.9167V32.5833H21.0834V30.6666H19.1667V28.75H17.25V26.8333H15.3334V24.9166H13.4167V23H11.5V21.0833H9.58335V19.1666Z" fill="white"/>
                <path d="M42.1666 40.25H3.83331V44.0833H42.1666V40.25Z" fill="white"/>
            </svg>
        ),
    },
    {
        text: 'Predictable behavior over market cycles',
        icon: (
            <svg className="absolute top-1/2 left-1/2 -translate-1/2" width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32.5833 21.0834H30.6666V24.9167H32.5833V21.0834Z" fill="white"/>
                <path d="M30.6666 24.9166V28.75H28.75V30.6666H24.9166V28.75H26.8333V26.8333H28.75V24.9166H30.6666Z" fill="white"/>
                <path d="M30.6666 17.25V21.0834H28.75V19.1667H26.8333V17.25H24.9166V15.3334H28.75V17.25H30.6666Z" fill="white"/>
                <path d="M24.9167 30.6666H21.0834V32.5833H24.9167V30.6666Z" fill="white"/>
                <path d="M21.0834 28.75V30.6666H17.25V28.75H15.3334V24.9166H17.25V26.8333H19.1667V28.75H21.0834Z" fill="white"/>
                <path d="M24.9166 13.4166V15.3333H23V21.0833H21.0833V23H15.3333V24.9166H13.4166V21.0833H15.3333V17.25H17.25V15.3333H21.0833V13.4166H24.9166Z" fill="white"/>
                <path d="M42.1666 21.0834V17.25H40.25V15.3334H38.3333V13.4167H36.4166V11.5H32.5833V9.58337H13.4166V11.5H9.58329V13.4167H7.66663V15.3334H5.74996V17.25H3.83329V21.0834H1.91663V24.9167H3.83329V28.75H5.74996V30.6667H7.66663V32.5834H9.58329V34.5H13.4166V36.4167H32.5833V34.5H36.4166V32.5834H38.3333V30.6667H40.25V28.75H42.1666V24.9167H44.0833V21.0834H42.1666ZM40.25 26.8334H38.3333V28.75H36.4166V30.6667H34.5V32.5834H30.6666V34.5H15.3333V32.5834H13.4166V30.6667H9.58329V28.75H7.66663V26.8334H5.74996V19.1667H7.66663V17.25H9.58329V15.3334H11.5V13.4167H15.3333V11.5H30.6666V13.4167H34.5V15.3334H36.4166V17.25H38.3333V19.1667H40.25V26.8334Z" fill="white"/>
            </svg>
        ),
    },
];

const ProductSection = () => (
    <SectionLayout id="philosophy" className="max-w-[1321px]" title="Product Philosophy" subtitle="Designed to reduce decisions, not increase activity">
        <div className="flex flex-wrap justify-center w-full gap-[20px] items-stretch">
            {CARDS.map((card, i) => (
                <ProductCard key={card.text} text={card.text} svg={card.icon} animDelay={i * 150} />
            ))}
        </div>
    </SectionLayout>
);

export default ProductSection;
