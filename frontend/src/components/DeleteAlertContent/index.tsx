import type { FC } from "react";

interface DeleteAlertContentProps {
  content: string;
  isDeleting?: boolean;
  onDelete: () => void;
}

const DeleteAlertContent: FC<DeleteAlertContentProps> = ({
  content,
  isDeleting = false,
  onDelete,
}) => {
  return (
    <div className="p-5">
      <p className="text-[14px]">{content}</p>
      <div className="mt-6 flex justify-end">
        <button 
          type="button" 
          disabled={isDeleting}
          className="inline-flex h-9 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50" 
          onClick={onDelete}
        >
          {isDeleting ? "Deleting..." : "Confirm Delete"}
        </button>
      </div>
    </div>
  );
};

export default DeleteAlertContent;
