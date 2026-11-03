const { execFileSync } = require("node:child_process");

module.exports = ({ config }) => {
  let commit = process.env.EAS_BUILD_GIT_COMMIT_HASH;
  if (!commit) {
    try {
      commit = execFileSync("git", ["rev-parse", "HEAD"], {
        cwd: __dirname,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
    } catch {
      // Source archives without Git must supply the build commit explicitly.
    }
  }
  if (commit && !/^[a-f0-9]{7,40}$/i.test(commit)) {
    throw new Error("EAS_BUILD_GIT_COMMIT_HASH deve conter um hash Git válido.");
  }
  if (!commit && process.env.EAS_BUILD === "true") {
    throw new Error("Não foi possível identificar o commit desta build.");
  }
  return {
    ...config,
    extra: {
      ...config.extra,
      referenceCommit: commit ? commit.slice(0, 7) : null,
    },
  };
};
