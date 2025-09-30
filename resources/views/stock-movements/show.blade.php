@extends('layouts.app')

@section('content')
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-900">Stock Movement Details</h1>
            <div class="flex space-x-3">
                <a href="{{ route('stock-movements.edit', $stockMovement) }}"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Edit Movement
                </a>
                <a href="{{ route('stock-movements.index') }}"
                    class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    Back to Stock Movements
                </a>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Movement Details -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Basic Information -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold text-gray-900 mb-4">Movement Information</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Date</label>
                            <p class="mt-1 text-sm text-gray-900">{{ $stockMovement->date->format('M d, Y') }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Type</label>
                            <p class="mt-1">
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                {{ $stockMovement->type === 'In'
                                    ? 'bg-green-100 text-green-800'
                                    : ($stockMovement->type === 'Out'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800') }}">
                                    {{ $stockMovement->type }}
                                </span>
                            </p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Reference Number</label>
                            <p class="mt-1 text-sm text-gray-900">{{ $stockMovement->reference_no }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Quantity</label>
                            <p class="mt-1 text-sm text-gray-900">
                                {{ $stockMovement->type === 'Adjustment' ? ($stockMovement->adjustment_diff > 0 ? '+' : '') . $stockMovement->adjustment_diff : $stockMovement->quantity }}
                                {{ $stockMovement->product->unit_measure }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Product Information -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold text-gray-900 mb-4">Product Information</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Product Name</label>
                            <p class="mt-1 text-sm text-gray-900">{{ $stockMovement->product->name }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">SKU</label>
                            <p class="mt-1 text-sm text-gray-900">{{ $stockMovement->product->sku }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Brand</label>
                            <p class="mt-1 text-sm text-gray-900">{{ $stockMovement->product->brand ?? 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Category</label>
                            <p class="mt-1 text-sm text-gray-900">{{ $stockMovement->product->category->name ?? 'N/A' }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Cost Information -->
                @if ($stockMovement->unit_cost)
                    <div class="bg-white rounded-lg shadow p-6">
                        <h2 class="text-xl font-semibold text-gray-900 mb-4">Cost Information</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-500">Unit Cost</label>
                                <p class="mt-1 text-sm text-gray-900">₱{{ number_format($stockMovement->unit_cost, 2) }}
                                </p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-500">Total Cost</label>
                                <p class="mt-1 text-sm text-gray-900">₱{{ number_format($stockMovement->total_cost, 2) }}
                                </p>
                            </div>
                        </div>
                    </div>
                @endif

                <!-- Additional Information -->
                @if ($stockMovement->supplier || $stockMovement->warehouse || $stockMovement->destination || $stockMovement->reason)
                    <div class="bg-white rounded-lg shadow p-6">
                        <h2 class="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            @if ($stockMovement->supplier)
                                <div>
                                    <label class="block text-sm font-medium text-gray-500">Supplier</label>
                                    <p class="mt-1 text-sm text-gray-900">{{ $stockMovement->supplier->company_name }}</p>
                                </div>
                            @endif
                            @if ($stockMovement->warehouse)
                                <div>
                                    <label class="block text-sm font-medium text-gray-500">Warehouse</label>
                                    <p class="mt-1 text-sm text-gray-900">{{ $stockMovement->warehouse->name }}</p>
                                </div>
                            @endif
                            @if ($stockMovement->destination)
                                <div>
                                    <label class="block text-sm font-medium text-gray-500">Destination</label>
                                    <p class="mt-1 text-sm text-gray-900">{{ $stockMovement->destination }}</p>
                                </div>
                            @endif
                            @if ($stockMovement->reason)
                                <div>
                                    <label class="block text-sm font-medium text-gray-500">Reason</label>
                                    <p class="mt-1 text-sm text-gray-900">{{ $stockMovement->reason }}</p>
                                </div>
                            @endif
                            @if ($stockMovement->expiry_date)
                                <div>
                                    <label class="block text-sm font-medium text-gray-500">Expiry Date</label>
                                    <p class="mt-1 text-sm text-gray-900">
                                        {{ $stockMovement->expiry_date->format('M d, Y') }}</p>
                                </div>
                            @endif
                        </div>
                    </div>
                @endif
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Quick Actions -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div class="space-y-2">
                        <a href="{{ route('products.show', $stockMovement->product) }}"
                            class="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            View Product
                        </a>
                        <a href="{{ route('stock-movements.create', ['product_id' => $stockMovement->product->id]) }}"
                            class="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                            New Movement
                        </a>
                    </div>
                </div>

                <!-- Product Stock Level -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Current Stock</h3>
                    <div class="text-center">
                        <p
                            class="text-3xl font-bold {{ $stockMovement->product->is_low_stock ? 'text-red-600' : 'text-green-600' }}">
                            {{ $stockMovement->product->current_stock }}
                        </p>
                        <p class="text-sm text-gray-500">{{ $stockMovement->product->unit_measure }}</p>
                        @if ($stockMovement->product->is_low_stock)
                            <p class="text-sm text-red-600 mt-2">Low Stock Alert!</p>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
