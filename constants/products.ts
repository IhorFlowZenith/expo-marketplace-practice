export const PRODUCT_CATEGORIES = ["All", "Shoes", "Clothing", "Accessories", "Electronics", "Featured", "Most Popular"];
export const SORT_OPTIONS = ["Newest", "Price: Low to High", "Price: High to Low"];
export const GENDER_OPTIONS = ["All", "Men", "Women", "Unisex"];
export const BRAND_OPTIONS = ["All", "Adidas", "Puma", "CR7", "Nike", "Yeezy", "Supreme"];
export const COLOR_OPTIONS = ["All", "White", "Black", "Grey", "Yellow", "Red", "Green"];

export interface BannerItem {
	id: string;
	title: string;
	offer: string;
	target: string;
	image: string;
}

export const MOCK_BANNERS: BannerItem[] = [
	{
		id: "1",
		title: "Get Winter Discount",
		offer: "20% Off",
		target: "For Children",
		image: "https://i.ibb.co/99QptdFT/image-1.png"
	},
	{
		id: "2",
		title: "New Summer Collection",
		offer: "30% Off",
		target: "For Everyone",
		image: "https://i.ibb.co/99QptdFT/image-1.png"
	},
	{
		id: "3",
		title: "Flash Sale",
		offer: "50% Off",
		target: "Limited Time",
		image: "https://i.ibb.co/99QptdFT/image-1.png"
	}
];
