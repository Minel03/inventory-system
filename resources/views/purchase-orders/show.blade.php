@extends('layouts.app')

@section('content')
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-900">Purchase Order Details</h1>
            <div class="flex space-x-3">
                <a href="{{ route('purchase-orders.edit', $purchaseOrder) }}"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Edit Purchase Order
                </a>
                <a href="{{ route('purchase-orders.index') }}"
                    class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    Back to Purchase Orders
                </a>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Order Details -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Basic Information -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Information</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-500">PO Number</label>
                            <p class="mt-1 text-sm text-gray-900 font-medium">{{ $purchaseOrder->po_number }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Date</label>
                            <p class="mt-1 text-sm text-gray-900">{{ $purchaseOrder->date->format('M d, Y') }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Status</label>
                            <p class="mt-1">
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                {{ $purchaseOrder->status === 'Pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : ($purchaseOrder->status === 'Approved'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-green-100 text-green-800') }}">
                                    {{ $purchaseOrder->status }}
                                </span>
                            </p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Total Amount</label>
                            <p class="mt-1 text-sm text-gray-900 font-medium">
                                ₱{{ number_format($purchaseOrder->total_amount, 2) }}</p>
                        </div>
                    </div>
                </div>

                <!-- Supplier Information -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold text-gray-900 mb-4">Supplier Information</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Company Name</label>
                            <p class="mt-1 text-sm text-gray-900">{{ $purchaseOrder->supplier->company_name }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Contact Person</label>
                            <p class="mt-1 text-sm text-gray-900">{{ $purchaseOrder->supplier->contact_person }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Contact Number</label>
                            <p class="mt-1 text-sm text-gray-900">{{ $purchaseOrder->supplier->contact_number }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Email</label>
                            <p class="mt-1 text-sm text-gray-900">{{ $purchaseOrder->supplier->email }}</p>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-500">Address</label>
                            <p class="mt-1 text-sm text-gray-900">{{ $purchaseOrder->supplier->address }}</p>
                        </div>
                    </div>
                </div>

                <!-- Order Items -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product</th>
                                    <th
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        SKU</th>
                                    <th
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity</th>
                                    <th
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Unit Price</th>
                                    <th
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                @php
                                    $items = json_decode($purchaseOrder->items, true);
                                    if (!is_array($items)) {
                                        $items = [];
                                    }
                                    $totalAmount = 0;
                                @endphp
                                @foreach ($items as $item)
                                    @php
                                        $product = \App\Models\Product::find($item['product_id']);
                                        $unitPrice = $product ? $product->cost_price : 0;
                                        $itemTotal = $unitPrice * $item['quantity'];
                                        $totalAmount += $itemTotal;
                                    @endphp
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {{ $product ? $product->name : 'Product not found' }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ $product ? $product->sku : 'N/A' }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {{ $item['quantity'] }} {{ $product ? $product->unit_measure : '' }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₱{{ number_format($unitPrice, 2) }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            ₱{{ number_format($itemTotal, 2) }}
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                            <tfoot class="bg-gray-50">
                                <tr>
                                    <td colspan="4" class="px-6 py-4 text-right text-sm font-medium text-gray-900">Total
                                        Amount:</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        ₱{{ number_format($totalAmount, 2) }}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Quick Actions -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div class="space-y-2">
                        <a href="{{ route('suppliers.show', $purchaseOrder->supplier) }}"
                            class="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            View Supplier
                        </a>
                        @if ($purchaseOrder->status !== 'Received')
                            <form action="{{ route('purchase-orders.update', $purchaseOrder) }}" method="POST"
                                class="inline w-full">
                                @csrf
                                @method('PUT')
                                <input type="hidden" name="po_number" value="{{ $purchaseOrder->po_number }}">
                                <input type="hidden" name="supplier_id" value="{{ $purchaseOrder->supplier_id }}">
                                <input type="hidden" name="date" value="{{ $purchaseOrder->date->format('Y-m-d') }}">
                                <input type="hidden" name="items" value="{{ $purchaseOrder->items }}">
                                <input type="hidden" name="status" value="Received">
                                <button type="submit"
                                    class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                                    Mark as Received
                                </button>
                            </form>
                        @endif
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-500">Items:</span>
                            <span class="text-sm text-gray-900">{{ count($items) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-500">Total Quantity:</span>
                            <span class="text-sm text-gray-900">{{ array_sum(array_column($items, 'quantity')) }}</span>
                        </div>
                        <div class="flex justify-between font-medium">
                            <span class="text-sm text-gray-900">Total Amount:</span>
                            <span class="text-sm text-gray-900">₱{{ number_format($totalAmount, 2) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
