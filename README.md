# main-website

# .env

VITE_API_BASE_URL=https://api.example.com/v1
VITE_API_KEY=your_api_key_here
VITE_CLIENT_ID=your_client_id_here

# scripts

npm run dev # Start development server
npm run build # Build for production
npm run preview # Preview production build

# config

the config file include the calling api paths

# API Endpoints

// Products
GET /products/featured
GET /products/search?q=query
GET /products/:id
GET /products/category/:id

// Banners
GET /hero-slides
GET /categories

# usage

// Products
const { data } = useFeaturedProductsQuery(6);
const { data } = useProductSearchQuery(query);

// Banners
const { data } = useHeroSlidesQuery();
const { data } = useCategoriesQuery();
