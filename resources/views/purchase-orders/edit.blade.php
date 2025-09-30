@extends('layouts.app')

@section('content')
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-900">Edit Purchase Order</h1>
            <a href="{{ route('purchase-orders.show', $purchaseOrder) }}"
                class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Back to Purchase Order
            </a>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <form action="{{ route('purchase-orders.update', $purchaseOrder) }}" method="POST" class="space-y-6">
                @csrf
                @method('PUT')

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Basic Information -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-medium text-gray-900">Order Information</h3>

                        <div>
                            <label for="po_number" class="block text-sm font-medium text-gray-700">PO Number *</label>
                            <input type="text" name="po_number" id="po_number"
                                value="{{ old('po_number', $purchaseOrder->po_number) }}" required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 @error('po_number')  @enderror"
                                placeholder="e.g., PO-2025-001">
                            @error('po_number')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="supplier_id" class="block text-sm font-medium text-gray-700">Supplier *</label>
                            <select name="supplier_id" id="supplier_id" required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 @error('supplier_id')  @enderror">
                                <option value="">Select Supplier</option>
                                @foreach ($suppliers as $supplier)
                                    <option value="{{ $supplier->id }}"
                                        {{ old('supplier_id', $purchaseOrder->supplier_id) == $supplier->id ? 'selected' : '' }}>
                                        {{ $supplier->company_name }}
                                    </option>
                                @endforeach
                            </select>
                            @error('supplier_id')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="date" class="block text-sm font-medium text-gray-700">Date *</label>
                            <input type="date" name="date" id="date"
                                value="{{ old('date', $purchaseOrder->date->format('Y-m-d')) }}" required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 @error('date') @enderror">
                            @error('date')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="status" class="block text-sm font-medium text-gray-700">Status *</label>
                            <select name="status" id="status" required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 @error('status')  @enderror">
                                <option value="">Select Status</option>
                                <option value="Pending"
                                    {{ old('status', $purchaseOrder->status) == 'Pending' ? 'selected' : '' }}>Pending
                                </option>
                                <option value="Approved"
                                    {{ old('status', $purchaseOrder->status) == 'Approved' ? 'selected' : '' }}>Approved
                                </option>
                                <option value="Received"
                                    {{ old('status', $purchaseOrder->status) == 'Received' ? 'selected' : '' }}>Received
                                </option>
                            </select>
                            @error('status')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>

                    <!-- Items Section -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-medium text-gray-900">Order Items</h3>

                        <div id="items-container">
                            @php
                                $items = json_decode($purchaseOrder->items, true);
                                if (!is_array($items)) {
                                    $items = [];
                                }
                            @endphp
                            @foreach ($items as $index => $item)
                                <div
                                    class="item-row border border-gray-200 rounded-lg p-4 space-y-4 {{ $index > 0 ? 'mt-4' : '' }}">
                                    @if ($index > 0)
                                        <div class="flex justify-between items-center">
                                            <h4 class="text-md font-medium text-gray-900">Item {{ $index + 1 }}</h4>
                                            <button type="button"
                                                class="remove-item text-red-600 hover:text-red-800">Remove</button>
                                        </div>
                                    @endif
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700">Product *</label>
                                            <select name="items[{{ $index }}][product_id]" required
                                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                                <option value="">Select Product</option>
                                                @foreach ($products as $product)
                                                    <option value="{{ $product->id }}"
                                                        {{ $item['product_id'] == $product->id ? 'selected' : '' }}>
                                                        {{ $product->name }} ({{ $product->sku }})
                                                    </option>
                                                @endforeach
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700">Quantity *</label>
                                            <input type="number" name="items[{{ $index }}][quantity]"
                                                value="{{ $item['quantity'] }}" min="1" required
                                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>

                        <button type="button" id="add-item"
                            class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                            Add Item
                        </button>
                    </div>
                </div>

                <div class="flex justify-end space-x-3">
                    <a href="{{ route('purchase-orders.show', $purchaseOrder) }}"
                        class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors">
                        Cancel
                    </a>
                    <button type="submit"
                        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                        Update Purchase Order
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        let itemIndex = {{ count($items) }};

        document.getElementById('add-item').addEventListener('click', function() {
            const container = document.getElementById('items-container');
            const newItem = document.createElement('div');
            newItem.className = 'item-row border border-gray-200 rounded-lg p-4 space-y-4 mt-4';
            newItem.innerHTML = `
        <div class="flex justify-between items-center">
            <h4 class="text-md font-medium text-gray-900">Item ${itemIndex + 1}</h4>
            <button type="button" class="remove-item text-red-600 hover:text-red-800">Remove</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Product *</label>
                <select name="items[${itemIndex}][product_id]" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select Product</option>
                    @foreach ($products as $product)
                        <option value="{{ $product->id }}">{{ $product->name }} ({{ $product->sku }})</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Quantity *</label>
                <input type="number" name="items[${itemIndex}][quantity]" min="1" required
                       class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
        </div>
    `;

            container.appendChild(newItem);
            itemIndex++;

            // Add remove functionality
            newItem.querySelector('.remove-item').addEventListener('click', function() {
                newItem.remove();
            });
        });

        // Add remove functionality to existing items
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                this.closest('.item-row').remove();
            });
        });
    </script>
@endsection
