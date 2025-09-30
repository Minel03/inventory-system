@extends('layouts.app')

@section('content')
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-900">Add New Supplier</h1>
            <a href="{{ route('suppliers.index') }}"
                class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Back to Suppliers
            </a>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <form action="{{ route('suppliers.store') }}" method="POST" class="space-y-6">
                @csrf

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Basic Information -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-medium text-gray-900">Basic Information</h3>

                        <div>
                            <label for="code" class="block text-sm font-medium text-gray-700">Supplier Code *</label>
                            <input type="text" name="code" id="code" value="{{ old('code') }}" required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 @error('code') @enderror">
                            @error('code')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="company_name" class="block text-sm font-medium text-gray-700">Company Name *</label>
                            <input type="text" name="company_name" id="company_name" value="{{ old('company_name') }}"
                                required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 @error('company_name') @enderror">
                            @error('company_name')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="contact_person" class="block text-sm font-medium text-gray-700">Contact
                                Person</label>
                            <input type="text" name="contact_person" id="contact_person"
                                value="{{ old('contact_person') }}"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 @error('contact_person') @enderror">
                            @error('contact_person')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="tin" class="block text-sm font-medium text-gray-700">TIN (BIR
                                Compliance)</label>
                            <input type="text" name="tin" id="tin" value="{{ old('tin') }}"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 @error('tin') @enderror">
                            @error('tin')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>

                    <!-- Contact Information -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-medium text-gray-900">Contact Information</h3>

                        <div>
                            <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
                            <textarea name="address" id="address" rows="3"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 @error('address') @enderror">{{ old('address') }}</textarea>
                            @error('address')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="contact_number" class="block text-sm font-medium text-gray-700">Contact
                                Number</label>
                            <input type="text" name="contact_number" id="contact_number"
                                value="{{ old('contact_number') }}"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 @error('contact_number') @enderror">
                            @error('contact_number')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="email" id="email" value="{{ old('email') }}"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 @error('email') @enderror">
                            @error('email')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>
                </div>

                <!-- Payment Information -->
                <div class="space-y-4">
                    <h3 class="text-lg font-medium text-gray-900">Payment Information</h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="payment_terms" class="block text-sm font-medium text-gray-700">Payment Terms
                                *</label>
                            <select name="payment_terms" id="payment_terms" required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 @error('payment_terms') @enderror">
                                <option value="">Select Payment Terms</option>
                                <option value="COD" {{ old('payment_terms') == 'COD' ? 'selected' : '' }}>Cash on
                                    Delivery (COD)</option>
                                <option value="15 days" {{ old('payment_terms') == '15 days' ? 'selected' : '' }}>15 days
                                </option>
                                <option value="30 days" {{ old('payment_terms') == '30 days' ? 'selected' : '' }}>30 days
                                </option>
                                <option value="45 days" {{ old('payment_terms') == '45 days' ? 'selected' : '' }}>45 days
                                </option>
                                <option value="60 days" {{ old('payment_terms') == '60 days' ? 'selected' : '' }}>60 days
                                </option>
                                <option value="90 days" {{ old('payment_terms') == '90 days' ? 'selected' : '' }}>90 days
                                </option>
                            </select>
                            @error('payment_terms')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="bank_details" class="block text-sm font-medium text-gray-700">Bank Details</label>
                            <textarea name="bank_details" id="bank_details" rows="3"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 @error('bank_details') @enderror"
                                placeholder="Bank Name, Account Number, Account Holder Name">{{ old('bank_details') }}</textarea>
                            @error('bank_details')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>
                </div>

                <div class="flex justify-end space-x-3">
                    <a href="{{ route('suppliers.index') }}"
                        class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors">
                        Cancel
                    </a>
                    <button type="submit"
                        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                        Create Supplier
                    </button>
                </div>
            </form>
        </div>
    </div>
@endsection
