import { Loader2Icon } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="flex-col-center flex-1 gap-4 size-full">
      <Loader2Icon className="animate-spin" />
      <p className="">Please Wait</p>
    </div>
  );
};

export default LoadingScreen;
