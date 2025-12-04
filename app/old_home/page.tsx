'use client'

import React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'
import * as motion from 'motion/react-client'
import { Github, Linkedin, Mail, ChevronRight, ChevronLeft, Laptop } from 'lucide-react'

import { skills, projects, experiences } from '../../data/featured'
import { Button, Card, SkillPill } from '../../components'
import { cn } from '../../lib/utils'

const CardHeader = ({ className, children, ...props }: any) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
)
const CardTitle = ({ className, children, ...props }: any) => (
  <h3 className={`text-xl font-semibold text-white ${className}`} {...props}>
    {children}
  </h3>
)
const CardDescription = ({ className, children, ...props }: any) => (
  <p className={`text-gray-300 ${className}`} {...props}>
    {children}
  </p>
)
const CardContent = ({ className, children, ...props }: any) => (
  <div className={`space-y-2 p-4 ${className}`} {...props}>
    {children}
  </div>
)

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
}

const SkillSection = () => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setScrollPosition((prevPosition) => {
        const newPosition = prevPosition - 1 // Slower speed and reversed direction
        const contentWidth = containerRef.current ? containerRef.current.scrollWidth : 0
        const containerWidth = containerRef.current ? containerRef.current.offsetWidth : 0

        if (newPosition < 0) {
          return contentWidth - containerWidth // Reset to end for continuous loop
        }
        return newPosition
      })
    }, 32) // ~30fps - Adjust for desired speed

    return () => clearInterval(intervalId)
  }, [containerWidth])

  const getOpacity = (index: number, scroll: number, containerWidth: number) => {
    if (!containerRef.current) return 1
    const element = containerRef.current.children[index] as HTMLElement
    if (!element) return 1

    const rect = element.getBoundingClientRect()
    const center = rect.left + rect.width / 2
    const containerCenter = containerWidth / 2
    const distance = Math.abs(center - containerCenter)
    const fadeRange = containerWidth / 3 // Adjust for fade effect range

    if (distance > fadeRange) {
      return 0
    }
    const opacity = 1 - distance / fadeRange
    return Math.max(0, opacity) // Ensure opacity is not negative
  }

  return (
    <motion.section className="space-y-6 py-2" variants={itemVariants}>
      <h2
        className={cn(
          'text-center text-3xl font-semibold sm:text-4xl',
          'bg-clip-text text-transparent',
          'bg-gradient-to-r from-purple-300 to-blue-300'
        )}
      >
        My Skills
      </h2>
      <div
        className={cn('flex flex-nowrap overflow-hidden', 'mx-auto max-w-5xl', 'relative')}
        ref={containerRef}
      >
        <motion.div
          style={{
            display: 'flex',
            flexDirection: 'row',
            transform: `translateX(-${scrollPosition}px)`,
            transition: 'none', // Disable CSS transitions, use JS for animation
          }}
          className="flex flex-nowrap gap-4"
        >
          {skills.map((skill, index) => (
            <SkillPill key={index} skill={skill} style={{}} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

const ProjectSection = () => {
  const [projectScroll, setProjectScroll] = useState(0)
  const projectContainerRef = useRef<HTMLDivElement>(null)
  const [maxProjectScroll, setMaxProjectScroll] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const updateDimensions = () => {
      if (projectContainerRef.current) {
        const container = projectContainerRef.current.children[0] as HTMLElement
        const contentWidth = container.scrollWidth
        const visibleWidth = container.offsetWidth
        setMaxProjectScroll(contentWidth - visibleWidth)
        setContainerWidth(container.offsetWidth)
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const handleProjectScroll = useCallback(
    (direction: 'left' | 'right') => {
      const container = projectContainerRef.current?.children[0] as HTMLElement
      if (!container) return

      console.log('handleProjectScroll called', direction, container)

      const scrollAmount = containerWidth * 0.7 // Scroll by 70% of container width
      var newScroll =
        direction === 'left'
          ? Math.max(projectScroll - scrollAmount, 0)
          : Math.min(projectScroll + scrollAmount, maxProjectScroll)

      setProjectScroll(newScroll)

      // Use smooth scrolling if supported
      container.scrollTo({
        left: newScroll,
        behavior: 'smooth',
      })

      console.log('yes', newScroll, projectScroll, scrollAmount, maxProjectScroll)
    },
    [projectScroll, containerWidth, maxProjectScroll]
  )

  return (
    <motion.section id="projects" className="space-y-6" variants={itemVariants}>
      <h2
        className={cn(
          'text-center text-3xl font-semibold sm:text-4xl',
          'bg-clip-text text-transparent',
          'bg-gradient-to-r from-purple-300 to-blue-300',
          'mb-8'
        )}
      >
        My Projects
      </h2>
      <div className="relative" ref={projectContainerRef}>
        <div
          className={cn(
            'flex flex-nowrap overflow-hidden',
            'w-full',
            'gap-6 pt-1 pb-6' // Add some padding at the bottom for scrollbar
          )}
          style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }} // Enable smooth scrolling
        >
          {projects.map((project, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 md:w-1/2 lg:w-1/3"
              style={{ scrollSnapAlign: 'start' }}
            >
              <Card
                className={cn(
                  'border border-white/10 bg-white/5 backdrop-blur-lg',
                  'shadow-xl hover:shadow-purple-500/20',
                  'transition-all duration-300 hover:scale-[1.02]',
                  'overflow-hidden',
                  'rounded-xl'
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={cn('text-xl font-semibold text-white', 'flex items-center gap-2')}
                  >
                    <Laptop className="h-5 w-5 text-purple-400" />
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-gray-200">
                      <strong>Tech Stack:</strong> {project.techStack}
                    </p>
                    {/* Placeholder for project image or video */}
                    <div className="flex h-48 w-full items-center justify-center rounded-md bg-gray-700">
                      <span className="text-gray-400">Image/Demo</span>
                    </div>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'inline-flex items-center text-blue-400 hover:text-blue-300',
                        'gap-1.5 transition-colors'
                      )}
                    >
                      View Project <ChevronRight className="h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        {/* Scroll Buttons */}
        <div className="absolute top-1/2 left-0 z-10 -translate-y-1/2 transform px-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => handleProjectScroll('left')}
          >
            <ChevronLeft className="h-10 w-10" />
          </Button>
        </div>
        <div className="absolute top-1/2 right-0 z-10 -translate-y-1/2 transform px-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => handleProjectScroll('right')}
          >
            <ChevronRight className="h-10 w-10" />
          </Button>
        </div>
      </div>
    </motion.section>
  )
}

const ContactSection = () => {
  return (
    <motion.section id="contact" className="space-y-6 py-10 text-center" variants={itemVariants}>
      <h2
        className={cn(
          'text-3xl font-semibold sm:text-4xl',
          'bg-clip-text text-transparent',
          'bg-gradient-to-r from-purple-300 to-blue-300'
        )}
      >
        Contact Me
      </h2>
      <p className={cn('mx-auto max-w-xl text-lg text-gray-300/90', 'mb-8')}>
        Feel free to reach out to me for collaborations, projects, or just a friendly chat. I&apos;m
        always open to new opportunities.
      </p>
      <Button asChild variant="outline">
        <a
          href="mailto:your.email@example.com" // Replace with your actual email
        >
          <Mail className="h-6 w-6" />
          Say Hello
        </a>
      </Button>
    </motion.section>
  )
}

const IntroductionSection = () => {
  return (
    <motion.section className="space-y-4 text-center" variants={itemVariants}>
      <h1
        className={cn(
          'text-4xl font-bold sm:text-5xl md:text-6xl',
          'bg-clip-text text-transparent',
          'bg-gradient-to-r from-purple-400 to-blue-400',
          'pt-8 sm:pt-12 md:pt-16'
        )}
      >
        Hi, I&apos;m <span className="text-white">Minh Dang Quang</span>
      </h1>
      <p className={cn('text-lg sm:text-xl md:text-2xl', 'mx-auto max-w-2xl text-gray-300/90')}>
        I&apos;m a Software Engineer passionate about building scalable and innovative solutions. I
        graduated from HUST in 2022 and I'm eager to make an impact with my skills 🧑‍💻.
      </p>
      <div className="flex justify-center gap-4">
        <Button asChild variant="outline">
          <a href="#projects" className="flex flex-row">
            <span>My Projects</span>
            <ChevronRight className="h-5 w-5" />
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href="#contact">
            Contact Me <Mail className="h-5 w-5" />
          </a>
        </Button>
      </div>
      <div className="flex justify-center gap-6">
        <a
          href="https://github.com/minhdqdev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 transition-colors hover:text-white"
        >
          <Github className="h-7 w-7" />
        </a>
        <a
          href="https://linkedin.com/in/minhdqdev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 transition-colors hover:text-white"
        >
          <Linkedin className="h-7 w-7" />
        </a>
        <a
          href="mailto:minhdq.dev@gmail.com"
          className="text-gray-400 transition-colors hover:text-white"
        >
          <Mail className="h-7 w-7" />
        </a>
      </div>
    </motion.section>
  )
}

const ExperienceSection = () => {
  return (
    <motion.section id="experience" className="space-y-6" variants={itemVariants}>
      <h2
        className={cn(
          'text-center text-3xl font-semibold sm:text-4xl',
          'bg-clip-text text-transparent',
          'bg-gradient-to-r from-purple-300 to-blue-300',
          'mb-8'
        )}
      >
        My Experiences
      </h2>
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute top-0 bottom-0 left-6 w-1 bg-gray-700"></div>
        <div className={cn('space-y-8')}>
          {experiences.map((exp, index) => (
            <div key={index} className="relative pl-12">
              {/* Timeline Dot */}
              <div className="absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2 transform rounded-full border-2 border-purple-700 bg-purple-500"></div>
              <Card
                className={cn(
                  'border border-white/10 bg-white/5 backdrop-blur-lg',
                  'shadow-xl hover:shadow-purple-500/20',
                  'transition-all duration-300 hover:scale-[1.02]',
                  'overflow-hidden',
                  'rounded-xl'
                )}
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white">{exp.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {exp.company} | {exp.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-200">{exp.description}</p>
                  <p className="text-gray-200">
                    <strong>Tech Stack:</strong> {exp.techStack}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

const HomePage = () => {
  return (
    <div
      className={cn(
        'min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black',
        'flex flex-col items-center justify-center p-4 md:p-8'
      )}
    >
      <motion.div
        className="container space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <IntroductionSection />
        <SkillSection />
        <ProjectSection />
        <ExperienceSection />
        <ContactSection />
      </motion.div>
    </div>
  )
}

export default HomePage

// export const metadata = {
//   title: "minhdq.dev",
//   description:
//     "Welcome to my portfolio! I am a software engineer with a passion for building scalable and innovative solutions.",
//   openGraph: {
//     title: "minhdq.dev",
//     description:
//       "Welcome to my portfolio! I am a software engineer with a passion for building scalable and innovative solutions.",
//     url: "https://minhdq.dev",
//     siteName: "minhdq.dev",
//     images: [
//       {
//         url: "/path/to/your/image.jpg", // Replace with your actual image URL
//         width: 800,
//         height: 600,
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },
// };
