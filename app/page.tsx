'use client';

import { useState } from 'react';

export default function AboutMe() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 bg-[#f6f6f8] dark:bg-[#101622]`}>
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-[#101622]/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#135bec] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">About Me</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">
                {darkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button className="px-6 py-2.5 bg-[#135bec] text-white rounded-lg font-medium hover:bg-[#0e4ac4] transition-all hover:scale-105 flex items-center space-x-2">
              <span className="material-symbols-outlined text-sm">mail</span>
              <span>Contact Me</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Profile Image */}
            <div className="relative">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#135bec] to-purple-600 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform"></div>
                <div className="relative bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl overflow-hidden aspect-square transform group-hover:scale-105 transition-transform">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-9xl text-gray-400 dark:text-gray-600">person</span>
                  </div>
                </div>
                {/* Open to Work Badge */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 animate-bounce">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  <span className="font-semibold text-sm">Open to Work</span>
                </div>
              </div>
            </div>

            {/* Hero Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  Hi, I&apos;m <span className="text-[#135bec]">Alex Johnson</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
                  Full-Stack Developer & UI/UX Enthusiast
                </p>
              </div>

              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="text-lg leading-relaxed">
                  I&apos;m a passionate developer with over 5 years of experience building scalable web applications and beautiful user interfaces. I specialize in modern JavaScript frameworks and love creating seamless digital experiences.
                </p>
                <p className="text-lg leading-relaxed">
                  When I&apos;m not coding, you&apos;ll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 py-6">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-[#135bec]">5+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Years Experience</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-[#135bec]">50+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Projects</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-[#135bec]">20</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Clients</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-[#135bec] text-white rounded-lg font-medium hover:bg-[#0e4ac4] transition-all hover:scale-105 flex items-center space-x-2 shadow-lg">
                  <span className="material-symbols-outlined">download</span>
                  <span>Download CV</span>
                </button>
                <button className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:border-[#135bec] dark:hover:border-[#135bec] transition-all hover:scale-105 flex items-center space-x-2">
                  <span className="material-symbols-outlined">folder_open</span>
                  <span>View Portfolio</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Skills & Expertise</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Technologies I work with</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Frontend Skills */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-6">
                <span className="material-symbols-outlined text-[#135bec] text-3xl">code</span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Frontend</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'JavaScript', 'HTML/CSS', 'Redux'].map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-[#135bec] dark:text-blue-400 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Backend Skills */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-6">
                <span className="material-symbols-outlined text-[#135bec] text-3xl">storage</span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Backend</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'GraphQL', 'REST APIs', 'Docker', 'AWS'].map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-[#135bec] dark:text-blue-400 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Experience & Education</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">My professional journey</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {/* Experience Item 1 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="md:w-1/2 md:text-right md:pr-12">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center space-x-2 mb-2 md:justify-end">
                      <span className="material-symbols-outlined text-[#135bec]">work</span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Senior Full-Stack Developer</h3>
                    </div>
                    <p className="text-[#135bec] font-semibold mb-2">Tech Innovations Inc.</p>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">2021 - Present</p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Leading development of scalable web applications, mentoring junior developers, and implementing best practices across the team.
                    </p>
                  </div>
                </div>
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-[#135bec] rounded-full transform -translate-x-1.5 md:-translate-x-2 border-4 border-white dark:border-[#101622]"></div>
                <div className="md:w-1/2"></div>
              </div>

              {/* Experience Item 2 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="md:w-1/2"></div>
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-[#135bec] rounded-full transform -translate-x-1.5 md:-translate-x-2 border-4 border-white dark:border-[#101622]"></div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="material-symbols-outlined text-[#135bec]">work</span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Full-Stack Developer</h3>
                    </div>
                    <p className="text-[#135bec] font-semibold mb-2">Digital Solutions Ltd.</p>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">2019 - 2021</p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Developed and maintained multiple client projects, specializing in React and Node.js applications with focus on performance optimization.
                    </p>
                  </div>
                </div>
              </div>

              {/* Education Item 1 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="md:w-1/2 md:text-right md:pr-12">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center space-x-2 mb-2 md:justify-end">
                      <span className="material-symbols-outlined text-[#135bec]">school</span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">B.Sc. Computer Science</h3>
                    </div>
                    <p className="text-[#135bec] font-semibold mb-2">University of Technology</p>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">2015 - 2019</p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Graduated with honors. Focused on software engineering, web technologies, and database systems.
                    </p>
                  </div>
                </div>
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-[#135bec] rounded-full transform -translate-x-1.5 md:-translate-x-2 border-4 border-white dark:border-[#101622]"></div>
                <div className="md:w-1/2"></div>
              </div>

              {/* Education Item 2 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="md:w-1/2"></div>
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-[#135bec] rounded-full transform -translate-x-1.5 md:-translate-x-2 border-4 border-white dark:border-[#101622]"></div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="material-symbols-outlined text-[#135bec]">school</span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Web Development Bootcamp</h3>
                    </div>
                    <p className="text-[#135bec] font-semibold mb-2">Code Academy</p>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">2014</p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Intensive 12-week program covering full-stack web development, including HTML, CSS, JavaScript, and modern frameworks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-gray-600 dark:text-gray-400">
              © 2024 Alex Johnson. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#135bec] transition-colors">
                <span className="material-symbols-outlined">mail</span>
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#135bec] transition-colors">
                <span className="material-symbols-outlined">link</span>
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#135bec] transition-colors">
                <span className="material-symbols-outlined">share</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
