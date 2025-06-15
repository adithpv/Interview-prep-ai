import type { FC } from "react";

interface DeleteAlertContentProps {
  content: string;
  onDelete: () => void;
}

const DeleteAlertContent: FC<DeleteAlertContentProps> = ({
  content,
  onDelete,
}) => {
  return (
    <div className="p-5">
      <p className="text-[14px]">{content}</p>
      <div className="mt-6 flex justify-end">
        <button type="button" className="btn-small" onClick={onDelete}>
          Confirm Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlertContent;
