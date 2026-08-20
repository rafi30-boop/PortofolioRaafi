const GITHUB_OWNER = process.env.GITHUB_OWNER ?? "";
const GITHUB_REPO = process.env.GITHUB_REPO ?? "";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? "main";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "";

function githubEnabled(): boolean {
  return Boolean(GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO);
}

function githubUrl(filePath: string, query = ""): string {
  const encoded = filePath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encoded}${query}`;
}

async function getFileSha(filePath: string): Promise<string | undefined> {
  const response = await fetch(githubUrl(filePath, `?ref=${GITHUB_BRANCH}`), {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "User-Agent": "portoexpert-cms",
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    return undefined;
  }

  const data = (await response.json()) as { sha?: string };
  return data.sha;
}

export async function commitFile(
  filePath: string,
  content: string | Buffer,
  message: string
): Promise<void> {
  if (!githubEnabled()) {
    throw new Error("GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO must be set.");
  }

  const sha = await getFileSha(filePath);

  const base64 =
    typeof content === "string"
      ? Buffer.from(content, "utf-8").toString("base64")
      : content.toString("base64");

  const response = await fetch(githubUrl(filePath), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "User-Agent": "portoexpert-cms",
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: base64,
      branch: GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub commit failed (${response.status}): ${detail.slice(0, 300)}`);
  }
}

export { githubEnabled };