import { useState, useEffect } from 'react';
import {
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Linkedin,
    Shield,
    Truck,
    RotateCcw,
    ArrowUp,
    Car,
    Home,
    Waves,
    Scissors
} from 'lucide-react';

const Footer = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const scrollToTop = (): void => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const footerLinks = {
        company: [
            { name: 'About Us', href: '/about' },

        ],
        customerService: [
            { name: 'Contact Us', href: '/contact' },
            { name: 'Help Center', href: '/help' },

        ],
        categories: [
            {
                name: 'Cars',
                href: 'https://cars.arudeal.com/listings?sort=date-desc',
                icon: Car,
                external: true
            },
            {
                name: 'Real Estate',
                href: 'https://realestate.arudeal.com/',
                icon: Home,
                external: true
            },
            {
                name: 'Stays',
                href: 'https://stays.arudeal.com',
                icon: Home,
                external: true
            },
            {
                name: 'Water Sports',
                href: 'https://watersport.arudeal.com',
                icon: Waves,
                external: true
            },
            {
                name: 'Nail Services',
                href: 'https://nails.arudeal.com',
                icon: Scissors,
                external: true
            }
        ],

    };


    const features = [
        { icon: Truck, title: 'Free Delivery', description: 'On all platform services' },
        { icon: RotateCcw, title: 'Easy Returns', description: '30-day return policy' },
        { icon: Shield, title: 'Secure Payment', description: '100% secure checkout' },
        { icon: Phone, title: '24/7 Support', description: 'Always here to help' }
    ];

    const handleCategoryClick = (category: any) => {
        if (category.external) {
            window.open(category.href, '_blank');
        } else {
            window.location.href = category.href;
        }
    };

    return (
        <>
            {/* Features */}
            <div className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <feature.icon className="h-8 w-8 text-yellow-500" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                        {/* Company Info and Contact */}
                        <div className="lg:col-span-2">
                            <h2 className="text-3xl font-bold text-yellow-400 mb-4">
                                arudeal
                            </h2>
                            <p className="text-gray-400 mb-6 max-w-md">
                                Your trusted online marketplace connecting you to cars, real estate, accommodations, water sports, and beauty services across multiple platforms.
                            </p>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center space-x-3">
                                    <MapPin className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                                    <span className="text-gray-400">Oranjestad Santa Cruz 38, Aruba</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                                    <span className="text-gray-400">+297 569 4343</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                                    <span className="text-gray-400">info@cardealership.com</span>
                                </div>
                            </div>


                        </div>

                        {/* Company Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Company</h3>
                            <ul className="space-y-3">
                                {footerLinks.company.map(link => (
                                    <li key={link.name}>
                                        <a href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Customer Service Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
                            <ul className="space-y-3">
                                {footerLinks.customerService.map(link => (
                                    <li key={link.name}>
                                        <a href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
                            <ul className="space-y-3">
                                {footerLinks.categories.map(category => (
                                    <li key={category.name}>
                                        <button
                                            onClick={() => handleCategoryClick(category)}
                                            className="text-gray-400 hover:text-white text-sm transition-colors flex items-center space-x-2 group"
                                        >
                                            <category.icon className="h-4 w-4 text-yellow-400 group-hover:text-yellow-300" />
                                            <span>{category.name}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>


                </div >
            </footer >

            {/* Scroll to Top */}
            {
                showScrollTop && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-6 right-6 bg-yellow-400 hover:bg-yellow-500 text-black p-3 rounded-full shadow-lg z-50 transition-all duration-200 hover:scale-110"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="h-5 w-5" />
                    </button>
                )
            }
        </>
    );
};

export default Footer;