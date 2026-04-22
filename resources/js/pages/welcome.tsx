import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Package, ArrowRight, ShieldCheck, BarChart3, Boxes } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                
                {/* Navigation */}
                <header className="sticky top-0 z-50 w-full border-b border-[#19140015] bg-[#FDFDFC]/80 backdrop-blur-md dark:border-[#3E3E3A] dark:bg-[#0a0a0a]/80">
                    <div className="container mx-auto flex h-16 items-center justify-between px-6">
                        <div className="flex items-center gap-2 font-semibold">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black">
                                <AppLogoIcon className="h-5 w-5" />
                            </div>
                            <span className="text-lg">InventorySystem</span>
                        </div>
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                                >
                                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="flex-1">
                    <section className="container mx-auto flex flex-col items-center justify-center px-6 py-24 text-center md:py-32">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
                            <Package className="h-8 w-8" />
                        </div>
                        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                            Modern Inventory Management
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400 md:text-xl">
                            Streamline your stock transfers, purchase requisitions, and multi-warehouse operations with our robust, secure, and fast platform.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex h-12 items-center justify-center rounded-md bg-black px-8 text-sm font-medium text-white shadow transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="inline-flex h-12 items-center justify-center rounded-md bg-black px-8 text-sm font-medium text-white shadow transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                                >
                                    Log in to your account
                                </Link>
                            )}
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="border-t border-[#19140015] bg-gray-50/50 py-24 dark:border-[#3E3E3A] dark:bg-[#111]">
                        <div className="container mx-auto px-6">
                            <div className="grid gap-12 md:grid-cols-3">
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        <Boxes className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold">Multi-Warehouse Control</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Transfer stock between warehouses efficiently with a comprehensive processing and in-transit tracking system.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold">Role-Based Access</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Strict permission structures ensure only authorized staff can approve PRs, POs, and execute stock adjustments.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                        <BarChart3 className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold">Automated Reporting</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Generate dynamic PDF and CSV reports for items, requisitions, and orders with instant analytical insights.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-[#19140015] py-8 text-center text-sm text-gray-500 dark:border-[#3E3E3A]">
                    <p>&copy; {new Date().getFullYear()} Inventory System. Built with Laravel & React.</p>
                </footer>
            </div>
        </>
    );
}
