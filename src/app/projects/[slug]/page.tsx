import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { getContent } from "@/lib/content";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export async function generateStaticParams() {
  const { projects } = await getContent();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { projects, site } = await getContent();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: `${project.title} — ${project.category}`,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "website",
      title: `${project.title} — ${project.category}`,
      description: project.description,
      url: `${site.url}/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const { projects, site } = await getContent();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex min-w-[320px] flex-col items-start bg-white">
      <Navbar site={site} />
      <main className="flex w-full flex-col items-start">
        <article className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-12 p-6 md:p-[72px]">
          <Reveal>
            <Link
              href="/#projects"
              className="group inline-flex items-center gap-2 font-body-16px-medium text-neutral-60 transition-colors hover:text-neutral-100"
            >
              <ArrowUpRight className="!relative !h-5 !w-5 rotate-180 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              Back to works
            </Link>
          </Reveal>

          <Reveal delay={60} className="w-full">
            <header className="flex flex-col items-start gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-neutral-10 px-4 py-1.5 font-body-16px-medium text-neutral-60">
                {project.category}
              </span>
              <span className="rounded-full bg-neutral-10 px-4 py-1.5 font-body-16px-medium text-neutral-60">
                {project.year}
              </span>
            </div>
            <h1
              className="w-full max-w-[1056px] font-heading-desktop-h1 text-neutral-100"
              style={{
                fontFamily:
                  "var(--font-poppins), 'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(40px, 7vw, 104px)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {project.title}
            </h1>
            <p className="w-full max-w-[697px] font-body-22px-regular text-neutral-70">
              {project.description}
            </p>
          </header>
          </Reveal>

          <Reveal delay={120} className="w-full">
          <div
            className="relative flex h-[320px] w-full items-center justify-center overflow-hidden rounded-3xl md:h-[512px] md:w-[1056px]"
            role="img"
            aria-label={`${project.title} — ${project.category}`}
            style={project.image ? undefined : { background: project.gradient }}
          >
            {project.image ? (
              <Image
                className="absolute inset-0 h-full w-full object-cover"
                src={project.image}
                alt={`${project.title} — ${project.category}`}
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
                      "linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.12) 50%, transparent 80%)",
                    backgroundSize: "300% 100%",
                    "--shimmer-width": "300px",
                  } as React.CSSProperties
                }
              />
            )}
            {!project.image && (
              <span className="relative font-heading-desktop-h2 text-white/90">
                {project.title}
              </span>
            )}
          </div>
          </Reveal>

          <Reveal delay={160} className="w-full">
          <div className="flex w-full max-w-[1056px] flex-col gap-12 md:flex-row">
            <div className="flex-1 grow">
              <h2 className="mb-6 font-heading-desktop-h5 text-neutral-100">
                Overview
              </h2>
              <div className="flex flex-col gap-6">
                {project.details.map((paragraph) => (
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
              aria-label="Project details"
            >
              <div className="flex flex-col gap-3">
                <h2 className="font-body-22px-semibold text-neutral-100">
                  Technology
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-neutral-20 px-4 py-1.5 font-body-16px-medium text-neutral-70"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="font-body-22px-semibold text-neutral-100">
                  Year
                </h2>
                <p className="font-body-18px-regular text-neutral-70">
                  {project.year}
                </p>
              </div>
              <Link
                href="#contact"
                className="group inline-flex w-fit items-center justify-center gap-3 rounded-[100px] bg-neutral-100 px-6 py-4 transition-all hover:scale-[1.02] hover:opacity-90"
              >
                <span className="whitespace-nowrap font-body-16px-semibold text-white">
                  Start a project like this
                </span>
                <ArrowRight
                  className="!relative !h-5 !w-5 text-white transition-transform group-hover:translate-x-1"
                  color="white"
                />
              </Link>
            </aside>
          </div>
          </Reveal>

          <Reveal delay={200}>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 font-body-16px-semibold text-neutral-100 transition-colors hover:text-neutral-50"
          >
            <ArrowRight className="!relative !h-5 !w-5 rotate-180" />
            All works
          </Link>
          </Reveal>
        </article>
      </main>
      <Footer site={site} />
    </div>
  );
}