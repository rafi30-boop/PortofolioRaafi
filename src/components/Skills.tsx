import type { Skill } from "@/lib/types";
import { Reveal } from "@/components/Reveal";

interface SkillsProps {
  skills: Skill[];
  specialties: string[];
}

export const Skills = ({ skills, specialties }: SkillsProps) => {
  return (
    <section
      id="skills"
      className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-8 p-6 md:gap-10 md:p-[72px]"
      aria-labelledby="skills-heading"
    >
      <header className="flex w-full flex-col items-start gap-3">
        <h2
          id="skills-heading"
          className="text-3xl font-semibold tracking-tight text-neutral-100 md:text-4xl"
        >
          Skills &amp; Tools
        </h2>
        <p className="hidden font-body-18px-regular text-neutral-70 md:block">
          Technologies I use daily to design, build, and ship products.
        </p>
      </header>

      <div className="flex w-full flex-wrap gap-2 md:gap-3">
        {specialties.map((item) => (
          <span
            key={item}
            className="rounded-full border border-neutral-20 bg-neutral-10 px-4 py-2 text-sm font-medium text-neutral-60 md:px-5 md:py-2.5 md:text-base"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-6">
        {skills.map((skill, index) => (
          <Reveal key={skill.name} delay={Math.min(index * 60, 300)}>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-body-16px-semibold text-neutral-100 md:font-body-18px-semibold">
                  {skill.name}
                </span>
                <span className="text-sm text-neutral-50">
                  {skill.level}%
                </span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-neutral-20"
                role="progressbar"
                aria-valuenow={skill.level}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${skill.name} proficiency`}
              >
                <div
                  className="skill-fill h-full rounded-full bg-neutral-100"
                  style={
                    {
                      "--skill-width": `${skill.level}%`,
                      width: `${skill.level}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};
