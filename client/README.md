
# E-Commerce MERN Frontend

This is a modern e-commerce frontend built with React, Vite, and Tailwind CSS. It features product browsing, cart, wishlist, checkout, authentication, and order history.

## Features
- Product listing with search, filter, and wishlist
- Product details with add to cart/wishlist
- Shopping cart with quantity management
- Checkout with shipping form and order summary
- Order history and profile pages
- Toast notifications for user actions
- Responsive design with Tailwind CSS

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository:
	```sh
	git clone https://github.com/Malik-AK47/E-Commerce.git
	cd E-Commerce/client
	```
2. Install dependencies:
	```sh
	npm install
	# or
	yarn
	```
3. Start the development server:
	```sh
	npm run dev
	# or
	yarn dev
	```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Folder Structure
```
client/
  src/
	 components/    # Navbar, Footer, SkeletonGrid, etc.
	 data/          # Static product data
	 pages/         # Home, Cart, Checkout, Wishlist, etc.
	 App.jsx        # Main app component
	 ...
```

## Customization
- Update `src/data/products.js` to change product data
- Update styles in `tailwind.config.js` and `index.css`

## License
This project is for educational/demo purposes. Feel free to use and modify.
