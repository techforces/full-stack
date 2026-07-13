interface InputProps {
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  setter?: (value: string) => void;
}

const Input = ({
  name,
  label = "Input label",
  placeholder = "Input placeholder",
  value,
  setter,
}: InputProps) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <label htmlFor={name} className="text-xl font-medium">
        {label}
      </label>
      <input
        name={name}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setter ? setter(e.target.value) : null
        }
        className="font-normal placeholder:font-normal placeholder:text-grey h-[2.875rem] flex items-center px-[1.125rem] border border-pale-200 rounded-xl text-lg"
      />
    </div>
  );
};

export default Input;
