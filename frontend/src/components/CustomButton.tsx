import React, { ReactNode, MouseEvent } from 'react';

interface CustomButtonProps {
    title: string;
    containerStyles?: string;
    iconRight?: ReactNode;
    type?: "button" | "submit" | "reset";
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, containerStyles, iconRight, type, onClick }) => {
    return (
        <button onClick={onClick} type={type || "button"} className={`inline-flex items-center text-base ${containerStyles}`}>
            {title}
            {iconRight && <div className='ml-2'>{iconRight}</div>}
        </button>
    );
};

export default CustomButton;