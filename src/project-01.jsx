import React from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import './project-showcase.css'

const projectImages = Array.from({ length: 22 }, (_, index) => ({
  src: `/media/project-01/${index + 1}.webp`,
  no: String(index + 1).padStart(2, '0'),
}))

function ProjectPage() {
  return <main className="project-page">
    <nav className="project-nav shell"><a href="/" className="project-brand">ZT<span>STUDIO</span><sup>®</sup></a><a href="/#work">← BACK TO SELECTED WORK</a></nav>
    <section className="project-showcase" id="project-showcase">
      <div className="shell project-showcase-intro"><div><p className="section-label">( PROJECT 01 ) / ACTIVITY UI DESIGN</p><h1>中东活动<br /><em>视觉设计</em></h1></div><div className="project-showcase-meta"><span>2025 — 2026</span><p>活动视觉、Banner、UI 界面与延展物料。</p><a href="/#contact">CONTACT <b>↗</b></a></div></div>
      <div className="project-image-stack">
        {projectImages.map((image) => <figure className="project-image" key={image.no}><img src={image.src} alt={`中东活动视觉设计作品板 ${image.no}`} loading={image.no === '01' ? 'eager' : 'lazy'} /><figcaption>{image.no} / 22</figcaption></figure>)}
      </div>
      <div className="shell project-showcase-end"><span>END OF PROJECT 01</span><a href="/#work">BACK TO SELECTED WORK ↑</a></div>
    </section>
  </main>
}

createRoot(document.getElementById('root')).render(<ProjectPage />)
