import type { EducationItem, ExperienceItem } from "@/lib/types";

interface ExperienceEducationProps {
  experiences: ExperienceItem[];
  educations: EducationItem[];
}

interface TimelineListProps {
  items: { role?: string; degree?: string; company?: string; school?: string; period: string; description: string }[];
  title: string;
  headingId: string;
  eyebrow: string;
}

const TimelineList = ({ items, title, headingId, eyebrow }: TimelineListProps) => (
  <section
    className="flex flex-col items-start gap-10 flex-1 grow"
    aria-labelledby={headingId}
  >
    <div className="flex flex-col items-start gap-2">
      <p className="font-body-16px-medium uppercase tracking-widest text-neutral-50">
        {eyebrow}
      </p>
      <h2
        id={headingId}
        className="font-heading-desktop-h5 text-neutral-100"
      >
        {title}
      </h2>
    </div>
    <ul className="flex w-full flex-col items-start gap-6">
      {items.map((item) => (
        <li
          key={`${item.period}-${item.company ?? item.school}`}
          className="relative flex flex-col gap-4 self-stretch w-full border-b border-neutral-20 pb-6 pl-6"
        >
          <span
            className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full bg-neutral-100"
            aria-hidden="true"
          />
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-body-22px-semibold text-neutral-100">
              {item.role ?? item.degree}
            </h3>
            <span className="font-body-16px-medium text-neutral-50">
              {item.period}
            </span>
          </div>
          <p className="font-body-18px-semibold text-neutral-50">
            {item.company ?? item.school}
          </p>
          <p className="max-w-[520px] font-body-16px-regular text-neutral-70">
            {item.description}
          </p>
        </li>
      ))}
    </ul>
  </section>
);

export const ExperienceEducation = ({
  experiences,
  educations,
}: ExperienceEducationProps) => {
  return (
    <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-[72px] p-[72px] lg:grid-cols-2">
      <TimelineList
        items={experiences}
        title="Experience"
        headingId="experience-heading"
        eyebrow="Career Journey"
      />
      <TimelineList
        items={educations}
        title="Education"
        headingId="education-heading"
        eyebrow="Academic Background"
      />
    </div>
  );
};