import { LuLoaderCircle } from "react-icons/lu";

const SpinnerLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <LuLoaderCircle className="h-5 w-5 animate-spin text-white" />
    </div>
  );
};

export default SpinnerLoader;
