@extends('layouts.app')

@section('content')
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-900">Edit Warehouse</h1>
            <div class="flex space-x-3">
                <a href="{{ route('warehouses.show', $warehouse) }}"
                    class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    View Warehouse
                </a>
                <a href="{{ route('warehouses.index') }}"
                    class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    Back to Warehouses
                </a>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <form action="{{ route('warehouses.update', $warehouse) }}" method="POST" class="space-y-6">
                @csrf
                @method('PUT')

                <div class="max-w-2xl space-y-6">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700">Warehouse Name *</label>
                        <input type="text" name="name" id="name" value="{{ old('name', $warehouse->name) }}"
                            required
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 @error('name') @enderror"
                            placeholder="e.g., Main Branch, North Warehouse, Storage Facility">
                        @error('name')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                        <p class="mt-1 text-sm text-gray-500">Enter a descriptive name for the warehouse.</p>
                    </div>

                    <div>
                        <label for="location" class="block text-sm font-medium text-gray-700">Location *</label>
                        <textarea name="location" id="location" rows="3" required
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 @error('location') @enderror"
                            placeholder="Enter the full address or location description">{{ old('location', $warehouse->location) }}</textarea>
                        @error('location')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                        <p class="mt-1 text-sm text-gray-500">Provide the complete address or location details.</p>
                    </div>
                </div>

                @if ($warehouse->stockMovements->count() > 0)
                    <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm font-medium text-yellow-800">Warning</h3>
                                <div class="mt-2 text-sm text-yellow-700">
                                    <p>This warehouse has {{ $warehouse->stockMovements->count() }} stock movement(s).
                                        Changing the warehouse details will not affect existing movements, but make sure the
                                        new information is accurate.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                @endif

                <div class="flex justify-end space-x-3">
                    <a href="{{ route('warehouses.show', $warehouse) }}"
                        class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors">
                        Cancel
                    </a>
                    <button type="submit"
                        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                        Update Warehouse
                    </button>
                </div>
            </form>
        </div>
    </div>
@endsection
