import type { SiteConfig } from "@/lib/types";
import { ArrowRight, MapPinIcon, MailIcon } from "@/components/icons";

interface HeroProps {
  site: SiteConfig;
}

export const Hero = ({ site }: HeroProps) => {
  return (
    <section
      id="top"
      aria-labelledby="portfolio-hero-heading"
      className="relative mx-auto flex w-full max-w-[1200px] flex-col items-start gap-16 p-[72px]"
    >
      <div className="flex flex-col items-start gap-14 self-stretch w-full flex-[0_0_auto]">
        <header className="inline-flex flex-col items-start gap-4 relative flex-[0_0_auto]">
          <p className="animate-fade-up relative self-stretch mt-[-1.00px] font-body-28px-medium text-neutral-100">
            Hello! I&apos;m {site.name}.
          </p>
          <h1
            id="portfolio-hero-heading"
            className="animate-fade-up relative w-full max-w-[1056px] font-heading-desktop-h1 text-neutral-100 opacity-0 [animation-delay:100ms]"
            style={{
              fontFamily:
                "var(--font-inter-tight), 'Inter Tight', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(48px, 9vw, 104px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            <span className="text-neutral-100">
              {site.role} crafting{" "}
            </span>
            <span className="text-[#adb2ba]">digital experience</span>
          </h1>
        </header>

        <div className="animate-fade-up flex flex-col items-start justify-between gap-8 self-stretch w-full flex-[0_0_auto] opacity-0 [animation-delay:250ms] md:flex-row md:items-end">
          <div className="flex flex-col items-start gap-8">
            <a
              href="#contact"
              className="group inline-flex w-fit items-center justify-center gap-3 rounded-[100px] bg-neutral-100 px-12 py-6 transition-all hover:scale-[1.02] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-100"
            >
              <span className="whitespace-nowrap font-body-22px-semibold text-white">
                Let&apos;s Talk
              </span>
              <ArrowRight
                className="!relative !h-7 !w-7 text-white transition-transform group-hover:translate-x-1"
                color="white"
              />
            </a>
            <ul className="flex flex-wrap items-center gap-6">
              <li className="inline-flex items-center gap-2 font-body-16px-medium text-neutral-60">
                <MapPinIcon className="h-5 w-5" color="#6b7280" />
                {site.location}
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 font-body-16px-medium text-neutral-60 transition-colors hover:text-neutral-100"
                >
                  <MailIcon className="h-5 w-5" color="#6b7280" />
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
          <p className="w-full max-w-[518px] font-body-22px-regular text-neutral-70">
            {site.headline}
          </p>
        </div>
      </div>
    </section>
  );
};