@extends('layouts.app')

@section('content')
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-900">Add New Category</h1>
            <a href="{{ route('categories.index') }}"
                class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Back to Categories
            </a>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <form action="{{ route('categories.store') }}" method="POST" class="space-y-6">
                @csrf

                <div class="max-w-md">
                    <label for="name" class="block text-sm font-medium text-gray-700">Category Name *</label>
                    <input type="text" name="name" id="name" value="{{ old('name') }}" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 @error('name') @enderror"
                        placeholder="e.g., Food, Electronics, Supplies">
                    @error('name')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                    <p class="mt-1 text-sm text-gray-500">Enter a descriptive name for the category.</p>
                </div>

                <div class="flex justify-end space-x-3">
                    <a href="{{ route('categories.index') }}"
                        class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors">
                        Cancel
                    </a>
                    <button type="submit"
                        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                        Create Category
                    </button>
                </div>
            </form>
        </div>
    </div>
@endsection
