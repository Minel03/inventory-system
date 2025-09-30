<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Inventory System') }}</title>

    <!-- Fonts -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap">

    <!-- Styles -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="font-sans bg-gray-100 text-gray-800">
    <nav class="bg-white shadow-sm py-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <a href="{{ url('/') }}"
                class="text-xl font-semibold text-blue-600">{{ config('app.name', 'Inventory System') }}</a>
            <div class="space-x-4">
                @auth
                    <a href="{{ route('dashboard') }}"
                        class="{{ request()->routeIs('dashboard') ? 'text-blue-800 font-semibold' : 'text-blue-600 hover:text-blue-800' }}">Dashboard</a>
                    <a href="{{ route('products.index') }}"
                        class="{{ request()->routeIs('products.*') ? 'text-blue-800 font-semibold' : 'text-blue-600 hover:text-blue-800' }}">Products</a>
                    <a href="{{ route('suppliers.index') }}"
                        class="{{ request()->routeIs('suppliers.*') ? 'text-blue-800 font-semibold' : 'text-blue-600 hover:text-blue-800' }}">Suppliers</a>
                    <a href="{{ route('categories.index') }}"
                        class="{{ request()->routeIs('categories.*') ? 'text-blue-800 font-semibold' : 'text-blue-600 hover:text-blue-800' }}">Categories</a>
                    <a href="{{ route('warehouses.index') }}"
                        class="{{ request()->routeIs('warehouses.*') ? 'text-blue-800 font-semibold' : 'text-blue-600 hover:text-blue-800' }}">Warehouses</a>
                    <a href="{{ route('stock-movements.index') }}"
                        class="{{ request()->routeIs('stock-movements.*') ? 'text-blue-800 font-semibold' : 'text-blue-600 hover:text-blue-800' }}">Stock
                        Movements</a>
                    <a href="{{ route('purchase-requisitions.index') }}"
                        class="{{ request()->routeIs('purchase-requisitions.*') ? 'text-blue-800 font-semibold' : 'text-blue-600 hover:text-blue-800' }}">Purchase
                        Requisitions</a>
                    <a href="{{ route('purchase-orders.index') }}"
                        class="{{ request()->routeIs('purchase-orders.*') ? 'text-blue-800 font-semibold' : 'text-blue-600 hover:text-blue-800' }}">Purchase
                        Orders</a>
                    <form action="{{ route('logout') }}" method="POST" class="inline">
                        @csrf
                        <button type="submit" class="text-blue-600 hover:text-blue-800">Logout</button>
                    </form>
                @endauth
            </div>
        </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        @if (session('success'))
            <div class="bg-green-100 text-green-800 p-4 rounded-md mb-4">
                {{ session('success') }}
            </div>
        @endif
        @yield('content')
    </div>
</body>

</html>
