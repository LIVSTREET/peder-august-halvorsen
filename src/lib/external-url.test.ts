import { describe, expect, it } from "vitest";
import { getProjectExternalUrl, toExternalUrl } from "./external-url";

describe("toExternalUrl", () => {
  it("adds https to bare domains", () => {
    expect(toExternalUrl("kurskragero.no")).toBe("https://kurskragero.no");
  });

  it("preserves complete URLs", () => {
    expect(toExternalUrl("https://goldofsicily.no")).toBe("https://goldofsicily.no");
  });

  it("trims surrounding whitespace", () => {
    expect(toExternalUrl("  pastelly.no  ")).toBe("https://pastelly.no");
  });
});

describe("getProjectExternalUrl", () => {
  it("uses the live website for a project with a missing stored URL", () => {
    expect(getProjectExternalUrl(null, "bilgarasjeno")).toBe("https://bilgarasje.no");
  });

  it("returns null when neither a stored URL nor a known fallback exists", () => {
    expect(getProjectExternalUrl(null, "unknown-project")).toBeNull();
  });
});
