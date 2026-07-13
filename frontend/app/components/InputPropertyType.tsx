import Image from "next/image";

interface InputPropertyTypeProps {
  title?: string;
  description?: string;
  imgSrc?: string;
  selected?: boolean;
  onClick?: () => void;
}

const InputPropertyType = ({
  title,
  description,
  imgSrc,
  selected,
  onClick,
}: InputPropertyTypeProps) => {
  return (
    <div
      className={`w-full flex flex-col gap-[0.625rem] p-6 rounded-2xl border cursor-pointer ${
        selected ? "border-night" : "border-pale-200"
      }`}
      onClick={onClick}
    >
      <Image
        width={420}
        height={420}
        src={imgSrc ? imgSrc : ""}
        alt=""
        className="w-[13.125rem] h-[13.125rem] m-auto"
      />

      <h3 className="font-medium text-xl">{title}</h3>
      <p className="text-grey text-sm font-normal">{description}</p>
    </div>
  );
};

export default InputPropertyType;
