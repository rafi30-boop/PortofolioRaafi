import { promises as fs } from "fs";
import path from "path";
import type { PortfolioContent } from "./types";
import { commitFile, githubEnabled } from "./github";

const CONTENT_PATH = path.join(process.cwd(), "src", "lib", "content.json");

export async function getContent(): Promise<PortfolioContent> {
  const raw = await fs.readFile(CONTENT_PATH, "utf-8");
  return JSON.parse(raw) as PortfolioContent;
}

export async function saveContent(
  content: PortfolioContent
): Promise<"disk" | "github"> {
  const raw = JSON.stringify(content, null, 2);

  if (githubEnabled()) {
    await commitFile(
      "src/lib/content.json",
      raw,
      "Update content via admin"
    );
    return "github";
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "GITHUB_TOKEN, GITHUB_OWNER, dan GITHUB_REPO belum diset di Environment Variables Vercel."
    );
  }

  await fs.writeFile(CONTENT_PATH, raw, "utf-8");
  return "disk";
}