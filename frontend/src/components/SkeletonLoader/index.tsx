const SkeletonLoader = () => {
  return (
    <div role="status" className="max-w-3xl animate-pulse space-y-4">
      <div className="h-6 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700"></div>

      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-3 w-11/2 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-3 w-10/12 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-3 w-9/12 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      <div className="space-y-2 rounded bg-gray-100 p-4 dark:bg-gray-700">
        <div className="h-3 w-3/4 rounded bg-gray-300 dark:bg-gray-700"></div>
        <div className="h-3 w-2/3 rounded bg-gray-300 dark:bg-gray-700"></div>
        <div className="h-3 w-1/2 rounded bg-gray-300 dark:bg-gray-700"></div>
      </div>

      <div role="status" className="mt-10 max-w-3xl animate-pulse space-y-4">
        <div className="h-4 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700"></div>

        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-3 w-11/12 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-3 w-10/12 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-3 w-9/12 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
