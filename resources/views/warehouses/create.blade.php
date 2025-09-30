@extends('layouts.app')

@section('content')
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-900">Add New Warehouse</h1>
            <a href="{{ route('warehouses.index') }}"
                class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Back to Warehouses
            </a>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <form action="{{ route('warehouses.store') }}" method="POST" class="space-y-6">
                @csrf

                <div class="max-w-2xl space-y-6">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700">Warehouse Name *</label>
                        <input type="text" name="name" id="name" value="{{ old('name') }}" required
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
                            placeholder="Enter the full address or location description">{{ old('location') }}</textarea>
                        @error('location')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                        <p class="mt-1 text-sm text-gray-500">Provide the complete address or location details.</p>
                    </div>
                </div>

                <div class="flex justify-end space-x-3">
                    <a href="{{ route('warehouses.index') }}"
                        class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors">
                        Cancel
                    </a>
                    <button type="submit"
                        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                        Create Warehouse
                    </button>
                </div>
            </form>
        </div>
    </div>
@endsection
