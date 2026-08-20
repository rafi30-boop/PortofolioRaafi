import { getContent } from "@/lib/content";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { ExperienceEducation } from "@/components/ExperienceEducation";
import { Certificates } from "@/components/Certificates";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

export const revalidate = 0;

export default async function HomePage() {
  const content = await getContent();

  return (
    <div className="flex min-w-[320px] flex-col items-start bg-white">
      <Navbar site={content.site} />
      <main className="flex w-full flex-col items-start">
        <Hero site={content.site} />
        <Reveal delay={40} className="w-full">
          <Projects projects={content.projects} />
        </Reveal>
        <Reveal delay={80} className="w-full">
          <About site={content.site} specialties={content.specialties} />
        </Reveal>
        <Reveal delay={120} className="w-full">
          <Skills skills={content.skills} specialties={content.specialties} />
        </Reveal>
        <Reveal delay={160} className="w-full">
          <ExperienceEducation
            experiences={content.experiences}
            educations={content.educations}
          />
        </Reveal>
        <Reveal delay={200} className="w-full">
          <Certificates certificates={content.certificates} />
        </Reveal>
        <Reveal delay={240} className="w-full">
          <Contact site={content.site} />
        </Reveal>
      </main>
      <Reveal delay={280} className="w-full">
        <Footer site={content.site} />
      </Reveal>
    </div>
  );
}