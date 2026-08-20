"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/lib/types";
import { ArrowRight } from "@/components/icons";

interface ProjectsProps {
  projects: Project[];
}

const categories = ["All", "Mobile App Design", "Website Design"] as const;

const ProjectCard = ({ project }: { project: Project }) => (
  <article
    id={project.slug}
    className="group relative flex flex-col items-start gap-6"
  >
    <Link
      href={`/projects/${project.slug}`}
      className="relative block w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100"
      aria-label={`View ${project.title} project`}
    >
      <div
        className="relative flex h-[360px] w-full items-center justify-center overflow-hidden rounded-3xl transition-transform duration-500 group-hover:scale-[1.01] md:h-[512px] md:w-[1056px]"
        role="img"
        aria-label={`${project.title} — ${project.category}`}
        style={project.image ? undefined : { background: project.gradient }}
      >
        {project.image ? (
          <Image
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={project.image}
            alt={`${project.title} — ${project.category}`}
            fill
            sizes="(min-width: 768px) 1056px, 100vw"
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
          <span className="relative font-heading-desktop-h5 text-white/90">
            {project.title}
          </span>
        )}
        <span className="absolute right-6 top-6 rounded-full bg-white/15 px-4 py-1.5 font-body-16px-medium text-white backdrop-blur-sm">
          {project.year}
        </span>
      </div>
    </Link>
    <div className="flex w-full items-start justify-between gap-6">
      <div className="flex flex-col items-start gap-2">
        <h3 className="font-body-22px-semibold text-neutral-100">
          {project.title}
        </h3>
        <p className="font-body-16px-regular text-neutral-50">
          {project.category}
        </p>
        <p className="max-w-[520px] font-body-16px-regular text-neutral-70">
          {project.description}
        </p>
        <ul className="flex flex-wrap gap-2 pt-2">
          {project.tech.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-neutral-20 px-3 py-1 font-body-14px-medium text-neutral-60"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`View ${project.title} project`}
        className="inline-flex flex-[0_0_auto] items-start gap-2 rounded-[100px] border border-solid border-neutral-100 px-7 py-4 transition-colors hover:bg-neutral-100 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-100"
      >
        <ArrowRight className="!relative !h-6 !w-6" />
      </Link>
    </div>
  </article>
);

export const Projects = ({ projects }: ProjectsProps) => {
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>("All");

  const visibleProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <section
      id="projects"
      className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-10 p-[72px]"
      aria-labelledby="selected-works-heading"
    >
      <div className="flex flex-col items-start gap-10">
        <header className="flex w-full max-w-[1056px] flex-wrap items-center justify-between gap-6">
          <h2
            id="selected-works-heading"
            className="font-heading-desktop-h5 text-neutral-100"
          >
            Selected works
          </h2>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter projects by category"
          >
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={isActive}
                  className={`rounded-[100px] border px-5 py-2.5 font-body-16px-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100 ${
                    isActive
                      ? "border-neutral-100 bg-neutral-100 text-white"
                      : "border-neutral-20 text-neutral-60 hover:border-neutral-100 hover:text-neutral-100"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </header>
        <div className="flex flex-col items-start gap-10">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};