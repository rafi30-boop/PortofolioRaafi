import { Spinner } from "@/components/icons";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div
        className="animate-fade-in flex flex-col items-center gap-4 opacity-0"
        role="status"
        aria-label="Loading project"
      >
        <Spinner className="h-8 w-8 text-neutral-100" />
        <span className="font-body-16px-medium text-neutral-60">
          Loading project...
        </span>
      </div>
    </div>
  );
}