import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { getContent } from "@/lib/content";

interface CertificatePageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export async function generateStaticParams() {
  const { certificates } = await getContent();
  return certificates.map((certificate) => ({ slug: certificate.slug }));
}

export async function generateMetadata({
  params,
}: CertificatePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { certificates, site } = await getContent();
  const certificate = certificates.find((item) => item.slug === slug);

  if (!certificate) {
    return { title: "Certificate not found" };
  }

  return {
    title: `${certificate.title} — ${certificate.issuer}`,
    description: certificate.description,
    alternates: { canonical: `/certificates/${certificate.slug}` },
    openGraph: {
      type: "website",
      title: `${certificate.title} — ${certificate.issuer}`,
      description: certificate.description,
      url: `${site.url}/certificates/${certificate.slug}`,
    },
  };
}

export default async function CertificatePage({
  params,
}: CertificatePageProps) {
  const { slug } = await params;
  const { certificates, site } = await getContent();
  const certificate = certificates.find((item) => item.slug === slug);

  if (!certificate) {
    notFound();
  }

  return (
    <div className="flex min-w-[320px] flex-col items-start bg-white">
      <Navbar site={site} />
      <main className="flex w-full flex-col items-start">
        <article className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-12 p-6 md:p-[72px]">
          <Reveal>
            <Link
              href="/#certificates"
              className="group inline-flex items-center gap-2 font-body-16px-medium text-neutral-60 transition-colors hover:text-neutral-100"
            >
              <ArrowUpRight className="!relative !h-5 !w-5 rotate-180 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              Back to certificates
            </Link>
          </Reveal>

          <Reveal delay={60} className="w-full">
          <header className="flex flex-col items-start gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-neutral-10 px-4 py-1.5 font-body-16px-medium text-neutral-60">
                {certificate.issuer}
              </span>
              <span className="rounded-full bg-neutral-10 px-4 py-1.5 font-body-16px-medium text-neutral-60">
                {certificate.year}
              </span>
            </div>
            <h1
              className="w-full max-w-[1056px] font-heading-desktop-h1 text-neutral-100"
              style={{
                fontFamily:
                  "var(--font-inter-tight), 'Inter Tight', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(40px, 7vw, 104px)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {certificate.title}
            </h1>
            <p className="w-full max-w-[697px] font-body-22px-regular text-neutral-70">
              {certificate.description}
            </p>
          </header>
          </Reveal>

          <Reveal delay={120} className="w-full">
          <div
            className="relative flex h-[280px] w-full items-center justify-center overflow-hidden rounded-3xl md:h-[400px] md:w-[1056px]"
            role="img"
            aria-label={`${certificate.title} — ${certificate.issuer}`}
            style={
              certificate.image ? undefined : { background: certificate.gradient }
            }
          >
            {certificate.image ? (
              <Image
                className="absolute inset-0 h-full w-full object-cover"
                src={certificate.image}
                alt={certificate.title}
                fill
                sizes="(min-width: 768px) 1056px, 100vw"
                priority
              />
            ) : (
              <span
                className="animate-shimmer pointer-events-none absolute inset-0"
                style={
                  {
                    backgroundImage:
                      "linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.15) 50%, transparent 80%)",
                    backgroundSize: "300% 100%",
                    "--shimmer-width": "300px",
                  } as React.CSSProperties
                }
              />
            )}
            {!certificate.image && (
              <div className="relative flex flex-col items-center gap-3 px-6 text-center">
                <span className="font-heading-desktop-h5 text-white/90">
                  Certificate of Completion
                </span>
                <span className="font-body-22px-regular text-white/70">
                  {certificate.title}
                </span>
              </div>
            )}
          </div>
          </Reveal>

          <Reveal delay={160} className="w-full">
          <div className="flex w-full max-w-[1056px] flex-col gap-12 md:flex-row">
            <div className="flex-1 grow">
              <h2 className="mb-6 font-heading-desktop-h5 text-neutral-100">
                About this certificate
              </h2>
              <div className="flex flex-col gap-6">
                {certificate.details.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="font-body-18px-regular text-neutral-70"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <aside
              className="flex w-full max-w-[320px] flex-col gap-8"
              aria-label="Certificate details"
            >
              <div className="flex flex-col gap-3">
                <h2 className="font-body-22px-semibold text-neutral-100">
                  Skills gained
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {certificate.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full border border-neutral-20 px-4 py-1.5 font-body-16px-medium text-neutral-70"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="font-body-22px-semibold text-neutral-100">
                  Issued by
                </h2>
                <p className="font-body-18px-regular text-neutral-70">
                  {certificate.issuer} — {certificate.year}
                </p>
              </div>
              <a
                href={certificate.credentialUrl || "#"}
                target={certificate.credentialUrl ? "_blank" : undefined}
                rel={certificate.credentialUrl ? "noreferrer" : undefined}
                className="group inline-flex w-fit items-center justify-center gap-3 rounded-[100px] border border-solid border-neutral-100 px-6 py-4 transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-100"
              >
                <span className="whitespace-nowrap font-body-16px-semibold text-neutral-100 transition-colors group-hover:text-white">
                  View credential
                </span>
                <ArrowUpRight className="!relative !h-5 !w-5" />
              </a>
            </aside>
          </div>
          </Reveal>

          <Reveal delay={200}>
          <Link
            href="/#certificates"
            className="inline-flex items-center gap-2 font-body-16px-semibold text-neutral-100 transition-colors hover:text-neutral-50"
          >
            <ArrowRight className="!relative !h-5 !w-5 rotate-180" />
            All certificates
          </Link>
          </Reveal>
        </article>
      </main>
      <Footer site={site} />
    </div>
  );
}