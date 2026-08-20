import { promises as fs } from "fs";
import path from "path";
import type { PortfolioContent } from "./types";

const CONTENT_PATH = path.join(process.cwd(), "src", "lib", "content.json");

export async function getContent(): Promise<PortfolioContent> {
  const raw = await fs.readFile(CONTENT_PATH, "utf-8");
  return JSON.parse(raw) as PortfolioContent;
}

export async function saveContent(
  content: PortfolioContent
): Promise<void> {
  await fs.writeFile(
    CONTENT_PATH,
    JSON.stringify(content, null, 2),
    "utf-8"
  );
}