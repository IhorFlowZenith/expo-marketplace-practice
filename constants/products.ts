export interface ProductItem {
    id: string;
    name: string;
    price: number;
    image: string;
    images: string[];
    category?: string;
}

export const MOCK_PRODUCTS: ProductItem[] = [
    {
        id: '1',
        name: 'Nike Air Max 270',
        price: 150.00,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop',
        ],
        category: 'Most Popular'
    },
    {
        id: '2',
        name: 'Nike Air Max 270',
        price: 150.00,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop',
        ],
        category: 'Most Popular'
    },
    {
        id: '3',
        name: 'Nike Air Max 270',
        price: 150.00,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop',
        ],
        category: 'Most Popular'
    },
    {
        id: '4',
        name: 'Nike Air Max 270',
        price: 150.00,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop',
        ],
        category: 'Most Popular'
    },
    {
        id: '5',
        name: 'Adidas Ultraboost',
        price: 180.50,
        image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop',
        ],
        category: 'Featured'
    },
    {
        id: '6',
        name: 'Adidas Ultraboost',
        price: 180.50,
        image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop',
        ],
        category: 'Featured'
    },
    {
        id: '7',
        name: 'Adidas Ultraboost',
        price: 180.50,
        image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop',
        ],
        category: 'Featured'
    },
    {
        id: '8',
        name: 'Adidas Ultraboost',
        price: 180.50,
        image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop',
        ],
        category: 'Featured'
    },
    {
        id: '9',
        name: 'Adidas Ultraboost',
        price: 180.50,
        image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=600&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop',
        ],
        category: 'Featured'
    },
];