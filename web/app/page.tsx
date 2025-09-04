import Link from "next/link";
import { latestFeatured } from "@/lib/db";

export default async function Home() {
  const featured = await latestFeatured();
  return (
    <div className="space-y-16">
      {/* Hero with featured */}
      <section className="text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-200">
            OneShot Builds: Lessons in Simplicity.
          </h1>
          <p className="mt-4 text-lg text-neutral-200">
            Clean submissions, safe previews, and a curated gallery of focused builds.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/submit" className="btn-primary">Submit Yours</Link>
            <Link href="/explore" className="btn-secondary">Explore Gallery</Link>
          </div>
        </div>
        <div className="mx-auto max-w-3xl mt-10">
          <div className="rounded-2xl overflow-hidden bg-transparent">
            <div className="ring-gradient p-[2px] rounded-2xl">
              <div className="bg-white rounded-xl">
                <div className="aspect-[3/4] w-full rounded-xl overflow-hidden">
                  {featured ? (
                    <iframe
                      title={`${featured.title} by ${featured.username}`}
                      src={featured.path}
                      className="w-full h-full"
                      sandbox="allow-scripts allow-pointer-lock allow-popups allow-top-navigation-by-user-activation"
                    />
                ) : (
                  <div className="w-full h-full grid place-items-center text-neutral-600 text-sm">
                    No approved submissions yet. Be the first to submit.
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
          {featured && (
            <div className="mt-3 text-sm text-neutral-300">
              Featured: <span className="font-medium text-white">{featured.title}</span> by @{featured.username}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card p-6">
          <div className="text-sm font-medium text-neutral-500">Profiles</div>
          <h3 className="mt-1 font-semibold">Polished creator pages</h3>
          <p className="mt-2 text-sm text-neutral-600">Your uploads live on a clean, professional profile with instant embeds.</p>
        </div>
        <div className="card p-6">
          <div className="text-sm font-medium text-neutral-500">Uploads</div>
          <h3 className="mt-1 font-semibold">One HTML, zero friction</h3>
          <p className="mt-2 text-sm text-neutral-600">Drop a single HTML file. We sandbox it and serve it fast.</p>
        </div>
        <div className="card p-6">
          <div className="text-sm font-medium text-neutral-500">Safety</div>
          <h3 className="mt-1 font-semibold">Sandboxed by design</h3>
          <p className="mt-2 text-sm text-neutral-600">Isolated origin + iframe sandbox for safe community content.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="card p-8 flex items-center justify-between gap-6 flex-col sm:flex-row">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">Ready to showcase your oneshot?</h3>
          <p className="text-neutral-600 mt-1">Submit a single HTML file. We review and publish safely.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/submit" className="btn-primary">Submit Now</Link>
          <Link href="/explore" className="btn-secondary">See Examples</Link>
        </div>
      </section>
    </div>
  );
}
