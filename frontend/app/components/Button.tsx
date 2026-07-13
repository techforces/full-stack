"use client";

interface ButtonProps {
  label?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({
  label = "Button label",
  disabled = false,
  onClick = () => {},
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-max text-white font-medium rounded-xl px-[1.125rem] h-10  duration-200 text-base 
        disabled:bg-gray-500 bg-blue hover:bg-blue-dark"
    >
      {label}
    </button>
  );
};

export default Button;
