import { Loader2Icon } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="size-full flex-center">
      <Loader2Icon className="animate-spin" />
      <p className="">Please Wait</p>
    </div>
  );
};

export default LoadingScreen;
