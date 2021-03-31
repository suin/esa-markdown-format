import * as fs from "fs";
import glob from "glob";
import format from "./index";

test.each(getTestCases())(`demo: %s`, (_, input, output) => {
  expect(format(input, { team: "example" })).toBe(output);
});

test("改行コードはCRLFに統一される", () => {
  const input = "LF\nCR\rCRLF\r\nEOF\r\n";
  const output = format(input, { team: "example" });
  expect(output).toBe("LF\r\nCR\r\nCRLF\r\nEOF\r\n");
});

function getTestCases(): Array<[name: string, input: string, output: string]> {
  const filenames = glob.sync(`${__dirname}/demo/**/{input,output}.md`);

  const p = new RegExp(
    `^${__dirname}/demo/(?<name>.+)/(?<type>input|output).md$`
  );

  const testCases = new Map<
    string,
    { readonly input?: string; readonly output?: string }
  >();

  for (const filename of filenames) {
    const result = p.exec(filename);
    if (!result) {
      console.warn(`Unexpected file: ${filename}`);
      continue;
    }
    const { name, type } = result.groups!;
    const markdownText = fs.readFileSync(filename).toString();
    testCases.set(name, {
      ...(testCases.get(name) ?? {}),
      [type]: markdownText,
    });
  }

  return [...testCases].map(([name, { input, output }]) => [
    name,
    input!,
    output!,
  ]);
}
