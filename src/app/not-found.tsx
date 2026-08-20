import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white p-8 text-center">
      <h1 className="font-heading-desktop-h1 text-neutral-100">404</h1>
      <p className="max-w-md font-body-22px-regular text-neutral-70">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-[100px] bg-neutral-100 px-8 py-4 font-body-16px-semibold text-white transition-opacity hover:opacity-90"
      >
        Back to Home
      </Link>
    </div>
  );
}