import Image from "next/image";
import Link from "next/link";
import type { CertificateItem } from "@/lib/types";
import { ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/Reveal";

interface CertificatesProps {
  certificates: CertificateItem[];
}

export const Certificates = ({ certificates }: CertificatesProps) => {
  return (
    <section
      id="certificates"
      className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-10 p-6 md:p-[72px]"
      aria-labelledby="certificates-heading"
    >
      <header className="flex w-full max-w-[1056px] flex-wrap items-center justify-between gap-6">
        <div className="flex flex-col items-start gap-2">
          <p className="font-body-16px-medium uppercase tracking-widest text-neutral-50">
            Credentials
          </p>
          <h2
            id="certificates-heading"
            className="font-heading-desktop-h5 text-neutral-100"
          >
            Certificates
          </h2>
        </div>
        <p className="max-w-[380px] font-body-18px-regular text-neutral-70">
          Continuous learning through verified courses and professional
          certifications.
        </p>
      </header>

      <ul className="grid w-full max-w-[1056px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((certificate, index) => (
          <li key={certificate.title}>
            <Reveal delay={Math.min(index * 80, 320)} className="h-full">
              <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-20 transition-shadow hover:shadow-[0_12px_20px_0_rgba(0,0,0,0.12)]">
            <Link
              href={`/certificates/${certificate.slug}`}
              aria-label={`View certificate: ${certificate.title}`}
              className="relative flex h-[200px] items-center justify-center overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100"
              style={certificate.image ? undefined : { background: certificate.gradient }}
            >
              {certificate.image ? (
                <Image
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={certificate.image}
                  alt={certificate.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
                <span className="relative font-heading-desktop-h5 text-white/90">
                  {certificate.issuer}
                </span>
              )}
              <span className="absolute right-4 top-4 rounded-full bg-white/15 px-3 py-1 font-body-14px-medium text-white backdrop-blur-sm">
                {certificate.year}
              </span>
            </Link>
            <div className="flex flex-1 flex-col gap-3 bg-white p-6">
              <h3 className="font-body-22px-semibold text-neutral-100">
                {certificate.title}
              </h3>
              <p className="font-body-16px-regular text-neutral-70">
                {certificate.description}
              </p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-body-16px-semibold text-neutral-100 transition-colors group-hover:text-neutral-50">
                View credential
                <ArrowUpRight className="!relative !h-5 !w-5" />
              </span>
            </div>
            </div>
          </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
};