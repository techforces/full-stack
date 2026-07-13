interface ModalProps {
  isOpen?: boolean;
  title?: string;
  children?: React.ReactNode;
  handleClose?: () => void;
}

const Modal = ({
  isOpen = true,
  title = "Modal title",
  children,
  handleClose,
}: ModalProps) => {
  return (
    <>
      <div
        className={`absolute top-0 left-0 w-full h-full overflow-hidden duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          onClick={handleClose}
          className={`absolute top-0 left-0 w-full h-full bg-black duration-200 ${
            isOpen ? "opacity-60" : "opacity-0"
          }`}
        ></div>

        <div
          className={`overflow-y-auto absolute bottom-0 left-0 w-full h-[calc(100vh-75px)] rounded-t-[2rem] bg-white flex flex-col items-center gap-8 pt-8 pb-20 shrink-0 box-border duration-200 ease-in-out ${
            isOpen ? "translate-y-0" : " translate-y-full"
          }`}
        >
          {title && (
            <h2 className="text-[2rem] font-medium shrink-0">{title}</h2>
          )}

          <div className="flex flex-col w-[40rem] h-max justify-center items-center shrink-0">
            {isOpen && children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
