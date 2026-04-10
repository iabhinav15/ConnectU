import React from 'react';

interface TextInputProps {
    type?: string;
    placeholder?: string;
    styles?: string;
    label?: string;
    labelStyles?: string;
    register?: any;
    name?: string;
    error?: string;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>((
    { type, placeholder, styles, label, labelStyles, register, name, error }, ref
) => {
    return (
        <div className='w-full flex flex-col mt-2'>
            {label && <p className={`text-ascent-2 text-sm mb-2 ${labelStyles}`}>{label}</p>}
            <div>
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    ref={ref}
                    className={`bg-secondary rounded border border-[#66666690] outline-none text-sm text-ascent-1 px-4 py-3 placeholder:text-[#666] ${styles}`}
                    {...register}
                    aria-invalid={error ? "true" : "false"}
                />
            </div>
            {error && <span className='text-[#f64949f3] text-xs mt-0.5'>{error}</span>}
        </div>
    );
});

export default TextInput;