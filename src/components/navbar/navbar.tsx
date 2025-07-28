import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search,
    Heart,
    User,
    Menu,
    X,
    ChevronDown,
    ShoppingCart,
    Car,
    Smartphone,
    Shirt,
    Home,
    Sparkles,
    Waves,
    Scissors
} from 'lucide-react';

interface Category {
    name: string;
    value: string;
    link: string;
    icon: React.ReactNode;
}

const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const navigate = useNavigate();

    const categories: Category[] = [
        {
            name: 'Cars',
            value: 'cars',
            link: "https://cars.arudeal.com/listings?sort=date-desc",
            icon: <Car className="h-4 w-4" />
        },
        {
            name: 'Real Estate',
            value: 'real-estate',
            link: "https://realestate.arudeal.com/",
            icon: <Home className="h-4 w-4" />
        },
        {
            name: 'Stays',
            value: 'stays',
            link: "https://stays.arudeal.com",
            icon: <Home className="h-4 w-4" />
        },
        {
            name: 'Water Sports',
            value: 'water-sports',
            link: "https://watersport.arudeal.com",
            icon: <Waves className="h-4 w-4" />
        },
        {
            name: 'Nail Services',
            value: 'nail-services',
            link: "https://nails.arudeal.com",
            icon: <Scissors className="h-4 w-4" />
        }
    ];

    // const quickLinks = [
    //     { name: 'Hot Deals', path: '/deals' },
    //     { name: 'New Arrivals', path: '/new-arrivals' },
    //     { name: 'Best Sellers', path: '/best-sellers' },
    //     { name: 'Customer Service', path: '/support' },
    //     { name: 'About Us', path: '/about' }
    // ];

    const handleSearch = (): void => {
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const selectedCategory = categories.find(cat => cat.value === e.target.value);
        if (selectedCategory) {
            window.open(selectedCategory.link, '_blank');
        }
    };

    const handleMobileMenuClose = (): void => {
        setIsMobileMenuOpen(false);
    };

    const handleLoginClick = (): void => {
        navigate('/login');
        handleMobileMenuClose();
    };

    const handleSignupClick = (): void => {
        navigate('/signup');
        handleMobileMenuClose();
    };

    const handleCategoryClick = (categoryValue: string): void => {
        const selectedCategory = categories.find(cat => cat.value === categoryValue);
        if (selectedCategory) {
            window.open(selectedCategory.link, '_blank');
            handleMobileMenuClose();
        }
    };

    const handleQuickLinkClick = (path: string): void => {
        navigate(path);
        handleMobileMenuClose();
    };

    return (
        <>
            {/* Main Header */}
            <header className="bg-yellow-400 relative z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">

                        {/* Mobile Menu Button - Left side on mobile */}
                        <button
                            className="lg:hidden p-2 -ml-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6 text-black" />
                            ) : (
                                <Menu className="h-6 w-6 text-black" />
                            )}
                        </button>

                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/" className="text-2xl lg:text-3xl font-bold text-black hover:text-gray-700 transition-colors duration-200">
                                arudeal
                            </Link>
                        </div>

                        {/* Desktop Search Bar */}
                        <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
                            <div className="flex w-full h-12 rounded-full overflow-hidden bg-white shadow-sm">
                                {/* Category Select */}
                                <div className="relative bg-white">
                                    <select
                                        onChange={handleCategoryChange}
                                        className="appearance-none bg-white px-4 py-3 pr-8 text-sm font-medium text-gray-700 focus:outline-none h-full border-none cursor-pointer"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {categories.map((category) => (
                                            <option key={category.value} value={category.value}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                                </div>

                                {/* Search Input */}
                                <input
                                    type="text"
                                    placeholder="I'm shopping for...."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleSearchKeyPress}
                                    className="flex-1 px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none border-none"
                                />

                                {/* Search Button */}
                                <button
                                    onClick={handleSearch}
                                    className="bg-black text-white px-6 font-medium hover:bg-gray-800 transition-colors duration-200 rounded-r-full"
                                    aria-label="Search"
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* Desktop Right Side Icons */}
                        <div className="hidden lg:flex items-center space-x-4">
                            <Link
                                to="/search"
                                className="p-2 hover:bg-yellow-300 rounded-full transition-colors duration-200"
                                aria-label="Search"
                            >
                                <Search className="h-6 w-6 text-black" />
                            </Link>

                            <Link
                                to="/wishlist"
                                className="p-2 hover:bg-yellow-300 rounded-full transition-colors duration-200 relative"
                                aria-label="Wishlist"
                            >
                                <Heart className="h-6 w-6 text-black" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    0
                                </span>
                            </Link>

                            <Link
                                to="/cart"
                                className="p-2 hover:bg-yellow-300 rounded-full transition-colors duration-200 relative"
                                aria-label="Shopping Cart"
                            >
                                <ShoppingCart className="h-6 w-6 text-black" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    0
                                </span>
                            </Link>

                            <div className="flex items-center space-x-2">
                                <Link
                                    to="/login"
                                    className="flex items-center space-x-2 text-black hover:text-gray-700 font-medium transition-colors duration-200 px-3 py-2 hover:bg-yellow-300 rounded-lg"
                                >
                                    <User className="h-5 w-5" />
                                    <span>Log in</span>
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </div>

                        {/* Mobile Right Side Icons */}
                        <div className="flex lg:hidden items-center space-x-2">
                            <Link
                                to="/search"
                                className="p-2 hover:bg-yellow-300 rounded-full transition-colors duration-200"
                                aria-label="Search"
                            >
                                <Search className="h-5 w-5 text-black" />
                            </Link>

                            <Link
                                to="/wishlist"
                                className="p-2 hover:bg-yellow-300 rounded-full transition-colors duration-200 relative"
                                aria-label="Wishlist"
                            >
                                <Heart className="h-5 w-5 text-black" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-xs">
                                    0
                                </span>
                            </Link>

                            <Link
                                to="/cart"
                                className="p-2 hover:bg-yellow-300 rounded-full transition-colors duration-200 relative"
                                aria-label="Shopping Cart"
                            >
                                <ShoppingCart className="h-5 w-5 text-black" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-xs">
                                    0
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <div className="lg:hidden bg-white border-t border-yellow-500">
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <div className="flex h-11 bg-white rounded-full overflow-hidden shadow-sm">
                            {/* Category Select */}
                            <div className="relative bg-white">
                                <select
                                    onChange={handleCategoryChange}
                                    className="appearance-none bg-white px-3 pr-8 text-sm h-full focus:outline-none border-none cursor-pointer"
                                    defaultValue=""
                                >
                                    <option value="" disabled>Category</option>
                                    {categories.map((category) => (
                                        <option key={category.value} value={category.value}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                            </div>

                            {/* Search Input */}
                            <input
                                type="text"
                                placeholder="I'm shopping for...."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleSearchKeyPress}
                                className="flex-1 px-3 text-gray-700 placeholder-gray-500 focus:outline-none border-none"
                            />

                            {/* Search Button */}
                            <button
                                onClick={handleSearch}
                                className="bg-black text-white px-4 hover:bg-gray-800 transition-colors duration-200 rounded-r-full"
                                aria-label="Search"
                            >
                                <Search className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Shop By Department Section */}
                <div className="hidden lg:block bg-yellow-400 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="py-3">
                            <button className="flex items-center space-x-2 text-black font-medium hover:text-gray-700 transition-colors duration-200">
                                <Menu className="h-5 w-5" />
                                <span>Shop By Category</span>
                            </button>
                        </div>
                    </div>

                    {/* Multiple Yellow-Themed Curved Bottom Layers */}
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                        {/* Layer 1 - Primary curve (yellow-100) */}
                        <svg
                            className="relative block w-full h-20"
                            data-name="Layer 1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1200 120"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                                className="fill-yellow-100"
                            ></path>
                        </svg>

                        {/* Layer 2 - Secondary curve (yellow-200 with opacity) */}
                        <svg
                            className="absolute bottom-0 left-0 w-full h-16 transform translate-y-2"
                            data-name="Layer 2"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1200 120"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                                className="fill-yellow-200 opacity-80"
                            ></path>
                        </svg>

                        {/* Layer 3 - Tertiary curve (yellow-300 with opacity) */}
                        <svg
                            className="absolute bottom-0 left-0 w-full h-14 transform translate-y-4"
                            data-name="Layer 3"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1200 120"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                                className="fill-yellow-300 opacity-60"
                            ></path>
                        </svg>

                        {/* Layer 4 - Quaternary curve (amber-200 with opacity) */}
                        <svg
                            className="absolute bottom-0 left-0 w-full h-12 transform translate-y-6"
                            data-name="Layer 4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1200 120"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                                className="fill-amber-200 opacity-40"
                            ></path>
                        </svg>

                        {/* Layer 5 - Final curve (orange-100 with opacity) */}
                        <svg
                            className="absolute bottom-0 left-0 w-full h-10 transform translate-y-8"
                            data-name="Layer 5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1200 120"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M649.97,0L550.03,0C463.12,42.98,375.41,55.87,293.08,116.93c-36.01,26.69-70.3,58.65-112.8,81.22C126.6,234.93,61.73,253.92,0,299.33V0H1200V0.37C1130.17,12.33,1044.21,1.27,974.03,54.51,909.17,104.13,849.23,162.05,649.97,0Z"
                                className="fill-orange-100 opacity-25"
                            ></path>
                        </svg>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={handleMobileMenuClose}
                    />

                    {/* Mobile Menu Panel */}
                    <div className="fixed top-0 left-0 h-full w-80 bg-white z-50 lg:hidden transform transition-transform duration-300 ease-in-out shadow-xl">
                        {/* Mobile Menu Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-yellow-400">
                            <h2 className="text-lg font-semibold text-black">Menu</h2>
                            <button
                                onClick={handleMobileMenuClose}
                                className="p-2 hover:bg-yellow-300 rounded-full transition-colors duration-200"
                                aria-label="Close menu"
                            >
                                <X className="h-5 w-5 text-black" />
                            </button>
                        </div>

                        {/* Mobile Menu Content */}
                        <div className="flex flex-col h-full">
                            {/* User Section */}
                            <div className="p-4 border-b border-gray-200">
                                <div className="space-y-2">
                                    <button
                                        onClick={handleLoginClick}
                                        className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                    >
                                        <User className="h-6 w-6 text-gray-600" />
                                        <span className="font-medium text-gray-800">Log in</span>
                                    </button>
                                    <button
                                        onClick={handleSignupClick}
                                        className="w-full bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
                                    >
                                        Sign up
                                    </button>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <nav className="flex-1 overflow-y-auto">
                                <div className="p-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Categories</h3>
                                    <div className="space-y-1">
                                        {categories.map((category) => (
                                            <button
                                                key={category.value}
                                                onClick={() => handleCategoryClick(category.value)}
                                                className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    {category.icon}
                                                    <span className="text-gray-800">{category.name}</span>
                                                </div>
                                                <ChevronDown className="h-4 w-4 text-gray-400 transform -rotate-90" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* <div className="p-4 border-t border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Links</h3>
                                    <div className="space-y-1">
                                        {quickLinks.map((link) => (
                                            <button
                                                key={link.name}
                                                onClick={() => handleQuickLinkClick(link.path)}
                                                className="block w-full text-left p-3 text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                            >
                                                {link.name}
                                            </button>
                                        ))}
                                    </div>
                                </div> */}
                            </nav>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Navbar;