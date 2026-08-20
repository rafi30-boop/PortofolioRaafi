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

export const revalidate = 0;

export default async function HomePage() {
  const content = await getContent();

  return (
    <div className="flex min-w-[320px] flex-col items-start bg-white">
      <Navbar site={content.site} />
      <main className="flex w-full flex-col items-start">
        <Hero site={content.site} />
        <Projects projects={content.projects} />
        <About site={content.site} specialties={content.specialties} />
        <Skills skills={content.skills} specialties={content.specialties} />
        <ExperienceEducation
          experiences={content.experiences}
          educations={content.educations}
        />
        <Certificates certificates={content.certificates} />
        <Contact site={content.site} />
      </main>
      <Footer site={content.site} />
    </div>
  );
}