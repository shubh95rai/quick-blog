import { LoaderCircle } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="size-16 animate-spin rounded-full border-3 border-t-white border-gray-700"></div>

      {/* <LoaderCircle className="size-16 animate-spin text-gray-700" /> */}
    </div>
  );
}
