import type { Skill } from "@/lib/types";

interface SkillsProps {
  skills: Skill[];
  specialties: string[];
}

export const Skills = ({ skills, specialties }: SkillsProps) => {
  return (
    <section
      id="skills"
      className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-10 p-6 md:p-[72px]"
      aria-labelledby="skills-heading"
    >
      <div className="flex flex-col items-start gap-10">
        <header className="flex w-full max-w-[1056px] items-center gap-6">
          <h2
            id="skills-heading"
            className="flex-1 font-heading-desktop-h5 text-neutral-100"
          >
            Skills &amp; Tools
          </h2>
          <p className="hidden max-w-[380px] font-body-18px-regular text-neutral-70 md:block">
            Technologies I use daily to design, build, and ship products.
          </p>
        </header>

        <div
          className="relative w-full max-w-[1056px] overflow-hidden"
          role="presentation"
          aria-hidden="true"
        >
          <div className="animate-marquee flex w-max items-center [--gap:48px]">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                className="flex items-center gap-12 pr-12 [--gap:48px]"
              >
                {specialties.map((item) => (
                  <li
                    key={`${item}-${copy}`}
                    className="font-heading-desktop-h5 text-neutral-20"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <ul className="grid w-full max-w-[1056px] grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <li key={skill.name} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-body-18px-semibold text-neutral-100">
                  {skill.name}
                </span>
                <span className="font-body-16px-regular text-neutral-50">
                  {skill.level}%
                </span>
              </div>
              <div
                className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-20"
                role="progressbar"
                aria-valuenow={skill.level}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${skill.name} proficiency`}
              >
                <div
                  className="animate-fade-in h-full rounded-full bg-neutral-100 opacity-0"
                  style={{
                    width: `${skill.level}%`,
                    animationDelay: "200ms",
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};