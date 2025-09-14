import React, { useId } from 'react'

function Input({ label, placeholder, type, required = false, ...rest }) {

    const id = useId();

    return (
        <div className="max-w-sm">
            <label htmlFor={id} className="block text-sm font-medium mb-2 dark:text-white">{label}</label>
            <input className="py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                type={type}
                id={id}
                placeholder={placeholder}
                required={required}
                {...rest}
            />
        </div>
    )
}

export default Input