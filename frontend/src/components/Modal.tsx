import { type FC, type ReactNode } from "react";
import { RxCross2 } from "react-icons/rx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  hideHeader?: boolean;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  hideHeader,
  title,
  children,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/40">
      <div
        className={`relative flex flex-col overflow-hidden rounded-lg bg-white shadow-lg`}
      >
        {!hideHeader && (
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 md:text-lg">{title}</h3>
          </div>
        )}
        <button
          type="button"
          className="absolute top-3.5 right-3.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-orange-100 hover:text-gray-900"
          onClick={onClose}
        >
          <RxCross2 className="h-4 w-4" />
        </button>
        <div className="flex">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
