import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "./global.css";

export const metadata = {
  // description: 'Make beautiful websites with Next.js & MDX.',
  // metadataBase: new URL('https://nextra.site'),
  keywords: ["Personal", "Engineering", "Blog", "Portfolio"],
  applicationName: "minhdq.dev",
  appleWebApp: {
    title: "minhdq.dev",
  },
  title: {
    default: "minhdq.dev",
    template: "%s | minhdq.dev",
  },
  // openGraph: {
  //   // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
  //   url: './',
  //   siteName: 'Nextra',
  //   locale: 'en_US',
  //   type: 'website'
  // },
  other: {
    "msapplication-TileColor": "#fff",
  },
  // twitter: {
  //   site: 'https://nextra.site'
  // },
  // alternates: {
  //   // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
  //   canonical: './'
  // }
};

// const banner = <Banner storageKey="1.0-release">Version 1.0 is released 🎉</Banner>
const navbar = (
  <Navbar
    logo={<b>minhdq.dev</b>}
    projectLink="https://github.com/minhdqdev"
    // ... Your additional navbar options
  />
);
const footer = (
  <Footer>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
      }}
    >
      <div>{new Date().getFullYear()} © minhdq.dev</div>
      <div>Created with Nextra, Gemini 2.0, and ☕</div>
    </div>
  </Footer>
);

export default async function RootLayout({ children }) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
      // ... Your additional head options
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body>
        <Layout
          // banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/shuding/nextra/tree/main/docs"
          footer={footer}
          nextThemes={{
            attribute: "class",
            defaultTheme: "dark",
            disableTransitionOnChange: true,
            storageKey: "theme",
          }}
          // ... Your additional layout options
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
