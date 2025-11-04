import React from 'react'

interface ButtonProps {
  btnTitle: string;
  btnColor: string;
  onClick?: () => void;
}

const Button = ({ btnTitle, btnColor, onClick }: ButtonProps) => {
    let color: string = "";
    
    if (btnColor === "Yellow") {
        color = "bg-cust-yellow hover:bg-yellow-500";
    } else if (btnColor === "Red") {
        color = "bg-cust-red text-white hover:bg-red-800";
    } else {
        color = "bg-gray-200 hover:bg-gray-300"
    }

    return (
        <button 
            onClick={onClick}
            className={`hover:cursor-pointer ${color} py-2 px-6 rounded-lg transition duration-200 shadow-md`}
        >
            {btnTitle}
        </button>
    )
}

export default Button