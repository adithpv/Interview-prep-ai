import type { FC, ReactNode } from "react";
import { LuX } from "react-icons/lu";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Drawer: FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <div
      className={`fixed top-[64px] right-0 z-40 h-[calc(100dvh-64px)] w-full overflow-y-auto border-r border-l-gray-800 bg-white p-4 shadow-2xl shadow-cyan-800/10 transition-transform md:w-[40vw] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      tabIndex={-1}
      aria-labelledby="drawer-right-label"
    >
      <div className="mb-4 flex items-center justify-between">
        <h5
          className="flex items-center text-base font-semibold text-black"
          id="drawer-right-label"
        >
          {title}
        </h5>
        <button
          className="text gray-400 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm hover:bg-gray-200 hover:text-gray-900"
          type="button"
          onClick={onClose}
        >
          <LuX className="text-lg" />
        </button>
      </div>
      <div className="mx-3 mb-6 text-sm">{children}</div>
    </div>
  );
};

export default Drawer;
