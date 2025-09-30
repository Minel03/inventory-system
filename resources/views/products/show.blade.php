@extends('layouts.app')

@section('content')
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-900">{{ $product->name }}</h1>
            <div class="flex space-x-3">
                <a href="{{ route('products.edit', $product) }}"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Edit Product
                </a>
                <a href="{{ route('products.index') }}"
                    class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    Back to Products
                </a>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Product Details -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Basic Information -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold text-gray-900 mb-4">Product Information</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-500">SKU</label>
                            <p class="mt-1 text-sm text-gray-900">{{ $product->sku }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Brand</label>
                            <p class="mt-1 text-sm text-gray-900">{{ $product->brand ?? 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Category</label>
                            <p class="mt-1 text-sm text-gray-900">{{ $product->category->name ?? 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Supplier</label>
                            <p class="mt-1 text-sm text-gray-900">{{ $product->supplier->company_name ?? 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Unit of Measure</label>
                            <p class="mt-1 text-sm text-gray-900">{{ $product->unit_measure }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">VAT Status</label>
                            <p class="mt-1 text-sm text-gray-900">{{ $product->vat_included ? 'VAT Included' : 'Non-VAT' }}
                            </p>
                        </div>
                    </div>

                    @if ($product->description)
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-500">Description</label>
                            <p class="mt-1 text-sm text-gray-900">{{ $product->description }}</p>
                        </div>
                    @endif

                    @if ($product->tags && is_array($product->tags) && count($product->tags) > 0)
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-500">Tags</label>
                            <div class="mt-1 flex flex-wrap gap-2">
                                @foreach ($product->tags as $tag)
                                    <span
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {{ $tag }}
                                    </span>
                                @endforeach
                            </div>
                        </div>
                    @endif
                </div>

                <!-- Pricing Information -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold text-gray-900 mb-4">Pricing Information</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Cost Price</label>
                            <p class="mt-1 text-lg font-semibold text-gray-900">{{ $product->formatted_cost }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Selling Price</label>
                            <p class="mt-1 text-lg font-semibold text-gray-900">{{ $product->formatted_price }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Profit Margin</label>
                            <p class="mt-1 text-lg font-semibold text-green-600">
                                ₱{{ number_format($product->sell_price - $product->cost_price, 2) }}
                                ({{ number_format((($product->sell_price - $product->cost_price) / $product->cost_price) * 100, 1) }}%)
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Stock Information -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold text-gray-900 mb-4">Stock Information</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Current Stock</label>
                            <p
                                class="mt-1 text-2xl font-bold {{ $product->is_low_stock ? 'text-red-600' : 'text-green-600' }}">
                                {{ $product->current_stock }} {{ $product->unit_measure }}
                            </p>
                            @if ($product->is_low_stock)
                                <p class="text-sm text-red-600">Low Stock Alert!</p>
                            @endif
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Reorder Level</label>
                            <p class="mt-1 text-lg font-semibold text-gray-900">{{ $product->reorder_level }}
                                {{ $product->unit_measure }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Stock Value</label>
                            <p class="mt-1 text-lg font-semibold text-gray-900">
                                ₱{{ number_format($product->current_stock * $product->cost_price, 2) }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Barcode -->
                @if ($product->barcode)
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Barcode</h3>
                        <div class="text-center">
                            <div class="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                                {!! $product->barcode !!}
                            </div>
                            <p class="mt-2 text-sm text-gray-500">SKU: {{ $product->sku }}</p>
                        </div>
                    </div>
                @endif

                <!-- Expiry Information -->
                @if ($product->expiry_date)
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Expiry Information</h3>
                        <div class="space-y-2">
                            <div>
                                <label class="block text-sm font-medium text-gray-500">Expiry Date</label>
                                <p class="mt-1 text-sm text-gray-900">
                                    {{ $product->expiry_date ? \Carbon\Carbon::parse($product->expiry_date)->format('M d, Y') : 'N/A' }}
                                </p>
                            </div>
                            @if ($product->batch_number)
                                <div>
                                    <label class="block text-sm font-medium text-gray-500">Batch Number</label>
                                    <p class="mt-1 text-sm text-gray-900">{{ $product->batch_number }}</p>
                                </div>
                            @endif
                            <div>
                                <label class="block text-sm font-medium text-gray-500">Days Until Expiry</label>
                                @php
                                    $daysUntilExpiry = (int) now()->diffInDays($product->expiry_date, false);
                                @endphp
                                <p
                                    class="mt-1 text-sm font-semibold {{ $daysUntilExpiry < 30 ? 'text-red-600' : ($daysUntilExpiry < 90 ? 'text-yellow-600' : 'text-green-600') }}">
                                    {{ $daysUntilExpiry > 0 ? $daysUntilExpiry . ' days' : 'Expired' }}
                                </p>
                            </div>
                        </div>
                    </div>
                @endif

                <!-- Quick Actions -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div class="space-y-2">
                        <a href="{{ route('stock-movements.create', ['product_id' => $product->id, 'type' => 'In']) }}"
                            class="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                            Stock In
                        </a>
                        <a href="{{ route('stock-movements.create', ['product_id' => $product->id, 'type' => 'Out']) }}"
                            class="block w-full text-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                            Stock Out
                        </a>
                        <a href="{{ route('stock-movements.create', ['product_id' => $product->id, 'type' => 'Adjustment']) }}"
                            class="block w-full text-center bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors">
                            Stock Adjustment
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Stock Movements -->
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Stock Movements</h2>
            @if ($product->stockMovements->count() > 0)
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reference</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Unit Cost</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            @foreach ($product->stockMovements->take(10) as $movement)
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ $movement->date->format('M d, Y') }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        {{ $movement->type === 'In'
                                            ? 'bg-green-100 text-green-800'
                                            : ($movement->type === 'Out'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800') }}">
                                            {{ $movement->type }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ $movement->reference_no }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $movement->quantity }}
                                        {{ $product->unit_measure }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₱{{ number_format($movement->unit_cost, 2) }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₱{{ number_format($movement->total_cost, 2) }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <p class="text-gray-500 text-center py-4">No stock movements recorded yet.</p>
            @endif
        </div>
    </div>
@endsection
