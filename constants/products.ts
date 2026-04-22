export interface ProductItem {
    id: string;
    name: string;
    price: number;
    image: string;
    images: string[];
    rating: number;
    category: string;
    brand: string;
    gender: string;
    color: string;
    description: string;
}

export const PRODUCT_CATEGORIES = ["All", "Shoes", "Clothing", "Accessories", "Electronics", "Featured", "Most Popular"];
export const SORT_OPTIONS = ["Newest", "Price: Low to High", "Price: High to Low"];
export const GENDER_OPTIONS = ["All", "Men", "Women", "Unisex"];
export const BRAND_OPTIONS = ["All", "Adidas", "Puma", "CR7", "Nike", "Yeezy", "Supreme"];
export const COLOR_OPTIONS = ["All", "White", "Black", "Grey", "Yellow", "Red", "Green"];

export const MOCK_PRODUCTS: ProductItem[] = [
    {
        id: "1",
        name: "Adidas UltraBoost",
        price: 180,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
            "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&q=80",
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80"
        ],
        rating: 4.8,
        category: "Featured",
        gender: "Men",
        brand: "Adidas",
        color: "Red",
        description: "The ultimate running shoe for maximum energy return."
    },
    {
        id: "2",
        name: "Classic White Tee",
        price: 25,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80",
        images: [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80",
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80"
        ],
        rating: 4.5,
        category: "Featured",
        gender: "Unisex",
        brand: "Nike",
        color: "White",
        description: "Essential organic cotton t-shirt for daily wear."
    },
    {
        id: "3",
        name: "Puma Suede Classic",
        price: 65,
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&q=80",
        images: [
            "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&q=80",
            "https://images.unsplash.com/photo-1539185441755-7ab9b2fc40b8?w=500&q=80"
        ],
        rating: 4.7,
        category: "Most Popular",
        gender: "Men",
        brand: "Puma",
        color: "Black",
        description: "Iconic streetwear sneaker with velvet-like suede."
    },
    {
        id: "4",
        name: "Leather Wallet",
        price: 45,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80",
        images: [
            "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80",
            "https://images.unsplash.com/photo-1614859324967-bdf219d446a3?w=500&q=80"
        ],
        rating: 4.6,
        category: "Most Popular",
        gender: "Men",
        brand: "Supreme",
        color: "Red",
        description: "Genuine leather bifold wallet with modern finish."
    },
    {
        id: "5",
        name: "Women's Yoga Set",
        price: 85,
        image: "https://images.unsplash.com/photo-1583454110551-21f2fa2ec617?w=500&q=80",
        images: [
            "https://images.unsplash.com/photo-1583454110551-21f2fa2ec617?w=500&q=80",
            "https://images.unsplash.com/photo-1518459031867-a89b944baff4?w=500&q=80"
        ],
        rating: 4.9,
        category: "Shoes",
        gender: "Women",
        brand: "Nike",
        color: "Grey",
        description: "Premium seamless yoga set for ultimate comfort."
    },
    {
        id: "6",
        name: "Nike Air Max",
        price: 110,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80",
        images: [
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80",
            "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=500&q=80"
        ],
        rating: 4.7,
        category: "Shoes",
        gender: "Men",
        brand: "Nike",
        color: "Yellow",
        description: "Revolutionary Air-sole unit for lightweight cushioning."
    }
];