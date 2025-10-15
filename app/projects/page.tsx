import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return (
    <>
      <div className="space-y-8 pt-6 pb-8">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          Projects
        </h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Selected work I&apos;ve contributed to across the years.
          </p>
          <h2>2025 &ndash; Current</h2>
          <ul>
            <li>
              <span className="font-medium">QMS</span> &mdash; Backend
            </li>
            <li>
              <span className="font-medium">Friend &amp; Family Banking</span> &mdash; Backend
            </li>
          </ul>
          <h2>Before 2025</h2>
          <ul>
            <li>
              <span className="font-medium">ContentBid</span> &mdash; Backend
            </li>
            <li>
              <span className="font-medium">VnAlert</span> &mdash; Backend
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
