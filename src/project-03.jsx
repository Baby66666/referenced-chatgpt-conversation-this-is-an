import React from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import './project-showcase.css'

const projectImages = Array.from({ length: 3 }, (_, index) => ({
  src: `/media/project-03/${index + 1}.webp`,
  no: String(index + 1).padStart(2, '0'),
}))

function MotionVisualPage() {
  return <main className="project-page">
    <nav className="project-nav shell"><a href="/" className="project-brand">ZT<span>STUDIO</span><sup>®</sup></a><a href="/#work">← BACK TO SELECTED WORK</a></nav>
    <section className="project-showcase">
      <div className="shell project-showcase-intro"><div><p className="section-label">( CATEGORY 03 ) / 3D &amp; MOTION</p><h1>三维与<br /><em>动态视觉</em></h1></div><div className="project-showcase-meta"><span>SELECTED VISUAL BOARDS</span><p>三维资产、动态视觉与活动界面设计。</p><a href="/#contact">CONTACT <b>↗</b></a></div></div>
      <div className="project-image-stack">
        {projectImages.map((image) => <figure className="project-image" key={image.no}><img src={image.src} alt={`三维与动态视觉作品板 ${image.no}`} loading={image.no === '01' ? 'eager' : 'lazy'} /><figcaption>{image.no} / 03</figcaption></figure>)}
      </div>
      <div className="shell project-showcase-end"><span>END OF CATEGORY 03</span><a href="/#work">BACK TO SELECTED WORK ↑</a></div>
    </section>
  </main>
}

createRoot(document.getElementById('root')).render(<MotionVisualPage />)
