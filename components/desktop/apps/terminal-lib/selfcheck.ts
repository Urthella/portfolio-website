import type { FsDir } from "@/components/desktop/fs"
import { complete, linkify, parseArgs, parseHex, suggestProject, tokenize, tree } from "@/components/desktop/apps/terminal-lib/shell"

/**
 * Self-check for the Terminal's pure parts. Not part of the app bundle.
 * Run: node -e "require('jiti').createJiti(process.cwd()+'/x.js',{alias:{'@':process.cwd()}}).import('./components/desktop/apps/terminal-lib/selfcheck.ts').then(m=>m.run())"
 */

const HOME = "/home/utku"
const home: FsDir = {
  kind: "dir",
  name: "utku",
  children: [
    { kind: "file", name: "README.md", body: "hi" },
    { kind: "file", name: "resume.pdf", open: { app: "resume" } },
    { kind: "dir", name: ".config", children: [] },
    {
      kind: "dir",
      name: "projects",
      children: [
        { kind: "dir", name: "okut-gitsin", children: [{ kind: "file", name: "README.md", body: "" }] },
        { kind: "dir", name: "reveil", children: [] },
        { kind: "dir", name: "realtime-collab-editor", children: [] },
      ],
    },
  ],
}
const root: FsDir = { kind: "dir", name: "", children: [{ kind: "dir", name: "home", children: [home] }] }

export function run() {
  let n = 0
  const eq = (got: unknown, want: unknown, what: string) => {
    n++
    if (JSON.stringify(got) !== JSON.stringify(want)) throw new Error(`${what}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`)
  }

  // argument parsing
  eq(tokenize(`echo "a b" 'c $X' $X\\ y`, { X: "1" }), ["echo", "a b", "c $X", "1 y"], "quotes, escapes, $VAR")
  eq(tokenize("cd ~/projects  ~ a~"), ["cd", `${HOME}/projects`, HOME, "a~"], "tilde")
  eq(tokenize(`echo ""`), ["echo", ""], "empty quoted arg")
  eq(tokenize(`echo "open`), null, "unclosed quote")
  eq(tokenize("   "), [], "blank line")
  const p = parseArgs(["-la", "--oneline", "-", "x", "--", "-y"])
  eq([[...p.flags].sort(), p.args], [["a", "l", "oneline"], ["-", "x", "-y"]], "flags")
  eq([parseHex("#ABC"), parseHex("f97316"), parseHex("#12345"), parseHex("red")], ["#aabbcc", "#f97316", null, null], "hex")

  // path + command completion
  const c = (s: string, words: Record<string, string[]> = {}) => complete(s, HOME, root, ["neofetch", "ls", "lang"], words)
  eq(c("ne"), { value: "neofetch ", matches: [] }, "command")
  eq(c("la").value, "lang ", "command, unique among two l's")
  eq(c("l"), { value: "l", matches: ["ls", "lang"] }, "ambiguous command")
  eq(c("cat RE").value, "cat README.md ", "file")
  eq(c("cd pro").value, "cd projects/", "dir gets a slash, no space")
  eq(c("cd projects/re"), { value: "cd projects/re", matches: ["realtime-collab-editor/", "reveil/"] }, "ambiguous path")
  eq(c("ls ~/projects/ok").value, "ls ~/projects/okut-gitsin/", "~ path")
  eq(c("ls /home/utku/projects/okut-gitsin/R").value, "ls /home/utku/projects/okut-gitsin/README.md ", "absolute path")
  eq(c("ls .c").value, "ls .config/", "dotfiles only when asked")
  eq(c("ls ").matches, ["projects/", "README.md", "resume.pdf"], "listing hides dotfiles")
  eq(c("cd RE").value, "cd RE", "cd completes folders only")
  eq(c("cd ..").value, "cd ../", "..")
  eq(c("theme pu", { theme: ["purple", "pink"] }).value, "theme purple ", "arg words")
  eq(c("theme R", { theme: ["red"] }).value, "theme R", "word-only commands skip paths")
  eq(c("open re", { open: ["resume", "text"] }), { value: "open resume", matches: ["resume", "resume.pdf"] }, "open mixes apps and paths")

  // tree + linkify + apt
  const rows = tree(home, HOME)
  eq(rows.map((r) => r.prefix + r.node.name), ["├── projects", "│   ├── okut-gitsin", "│   │   └── README.md", "│   ├── realtime-collab-editor", "│   └── reveil", "├── README.md", "└── resume.pdf"], "tree")
  const text = "see https://x.dev/a. or ~/README.md, not ~/nope or Boot/Java, mail me@x.io; cd /home/utku/projects."
  const segs = linkify(text, undefined, root)
  eq(segs.filter((s) => s.href || s.path).map((s) => s.href ?? s.path), ["https://x.dev/a", `${HOME}/README.md`, "mailto:me@x.io", `${HOME}/projects`], "linkify")
  eq(segs.map((s) => s.t).join(""), text, "linkify keeps text")
  const projects = [
    { name: "Okut Gitsin", stack: ["Redis"], blurb: "" },
    { name: "k8s-resilience-harness", stack: ["Go", "Kubernetes"], blurb: "" },
  ]
  eq([suggestProject("kubectl", projects).name, suggestProject("redis", projects).name, suggestProject("vim", projects).name], ["k8s-resilience-harness", "Okut Gitsin", "Okut Gitsin"], "apt suggestion")

  console.log(`terminal selfcheck: ${n} checks passed`)
  return n
}
