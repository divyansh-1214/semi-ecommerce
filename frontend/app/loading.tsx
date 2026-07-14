import Loader from "@/components/ui/Loader";

export default function RootLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader size="lg" />
    </div>
  );
}
