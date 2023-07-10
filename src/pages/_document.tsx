import { Html, Head, Main, NextScript } from "next/document";
import { RootStyleRegistry } from "~/shared/lib/root-style-registry";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <RootStyleRegistry>
          <Main />
        </RootStyleRegistry>
        <NextScript />
      </body>
    </Html>
  );
}
