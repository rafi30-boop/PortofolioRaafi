import type { SiteConfig } from "@/lib/types";
import { ArrowRight } from "@/components/icons";

interface AboutProps {
  site: SiteConfig;
  specialties: string[];
}

export const About = ({ site, specialties }: AboutProps) => {
  return (
    <section
      id="about"
      className="mx-auto flex w-full max-w-[1200px] items-end gap-[72px] p-[72px]"
      aria-labelledby="about-designer-heading"
    >
      <div className="flex flex-col items-start gap-[72px] md:flex-row md:items-end">
        <div className="flex flex-col items-start gap-8 flex-1 grow">
          <div className="flex flex-col items-start gap-6 self-stretch w-full">
            <h2
              id="about-designer-heading"
              className="relative self-stretch font-heading-desktop-h2 text-neutral-100"
              style={{
                fontSize: "clamp(36px, 6vw, 72px)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              A developer focused on creating emotional digital experience
            </h2>
            <p className="relative max-w-[697px] font-body-18px-regular text-neutral-70">
              I&apos;m {`${site.name}`} — a {site.role.toLowerCase()}{" "}
              who loves turning complex problems into simple, beautiful, and
              intuitive interfaces. I combine clean code with sharp design
              sense to ship products people enjoy using.
            </p>
          </div>
          <a
            href="#projects"
            className="group inline-flex justify-center gap-3 rounded-[100px] border border-solid border-neutral-100 px-5 py-4 transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100"
            aria-label="See my projects"
          >
            <span className="whitespace-nowrap font-body-16px-semibold text-neutral-100 transition-colors group-hover:text-white">
              My Projects
            </span>
            <ArrowRight className="!relative !h-6 !w-6 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
        <ul
          className="inline-flex flex-col items-end gap-6 flex-[0_0_auto]"
          aria-label="Design specialties"
        >
          {specialties.map((specialty, index) => (
            <li
              key={specialty}
              className={`relative w-fit whitespace-nowrap font-body-16px-regular text-neutral-50 ${
                index === 0 ? "mt-[-1.00px]" : ""
              }`}
            >
              {specialty}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};