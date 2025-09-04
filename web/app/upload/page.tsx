import Link from "next/link";

export default function UploadRedirect() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight">Upload moved</h1>
      <p className="text-neutral-600 mt-1">Please use the new submission form.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/submit" className="btn-primary">Go to Submit</Link>
        <Link href="/" className="btn-secondary">Home</Link>
      </div>
    </div>
  );
}
