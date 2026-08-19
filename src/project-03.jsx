import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './style.css'
import './project-showcase.css'

const projectImages = Array.from({ length: 3 }, (_, index) => ({
  src: `/media/project-03/${index + 1}.webp`,
  no: String(index + 1).padStart(2, '0'),
}))

function MotionVisualPage() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    gsap.registerPlugin(ScrollTrigger)
    ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })

    const ctx = gsap.context(() => {
      document.body.classList.add('project-opening-lock')

      // Let GSAP drive image transforms during entrance without fighting the CSS hover transition
      const images = gsap.utils.toArray('.project-image img')
      images.forEach((img) => img.classList.add('revealing'))

      // Refresh trigger positions once lazy boards settle
      images.forEach((img) => {
        if (img.complete) return
        img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
      })

      // ---- Opening wipe + intro entrance ----
      const opening = gsap.timeline({ defaults: { ease: 'power4.out' } })
      opening
        .set('.project-opening-wipe', { scaleY: 1, transformOrigin: 'top center' })
        .set(['.project-nav', '.project-showcase-intro .section-label'], { autoAlpha: 0, y: 30 })
        .set('.project-showcase-meta > *', { autoAlpha: 0, y: 24 })
        .set(['.project-showcase h1 span', '.project-showcase h1 em'], {
          clipPath: 'inset(0 0 100% 0)',
          yPercent: 112,
          scaleX: .78,
          transformOrigin: 'right center',
        })
        .to('.project-opening-wipe span', { autoAlpha: 0, y: -16, duration: .4, ease: 'power2.out' }, .3)
        .to('.project-opening-wipe', { scaleY: 0, duration: 1.4, ease: 'power4.inOut' }, 0)
        .to('.project-nav', { autoAlpha: 1, y: 0, duration: .85 }, '-=.85')
        .to('.project-showcase-intro .section-label', { autoAlpha: 1, y: 0, duration: .65 }, '-=.5')
        .to('.project-showcase h1 span', { clipPath: 'inset(0 0 0% 0)', yPercent: 0, scaleX: 1, duration: 1 }, '-=.38')
        .to('.project-showcase h1 em', { clipPath: 'inset(0 0 0% 0)', yPercent: 0, scaleX: 1, duration: 1.2 }, '-=.82')
        .to('.project-showcase-meta > *', { autoAlpha: 1, y: 0, duration: .7, stagger: .08 }, '-=.55')
        .add(() => {
          document.body.classList.remove('project-opening-lock')
          gsap.set(['.project-nav', '.project-showcase-intro .section-label', '.project-showcase-meta > *'], { clearProps: 'transform,opacity,visibility' })
          gsap.set(['.project-showcase h1 span', '.project-showcase h1 em'], { clearProps: 'transform,clipPath' })
          gsap.set('.project-opening-wipe', { display: 'none' })
        })

      // ---- Scroll-reveal entrance for every board in the stack ----
      gsap.utils.toArray('.project-image').forEach((figure) => {
        const img = figure.querySelector('img')
        const reveal = gsap.timeline({
          scrollTrigger: { trigger: figure, start: 'top 85%', once: true },
          defaults: { ease: 'power4.out' },
        })
        reveal
          .from(figure, { y: 70, clipPath: 'inset(0 0 100% 0)', autoAlpha: 0, duration: 1 })
          .from(img, { scale: 1.14, duration: 1.5, ease: 'power3.out' }, '<')
          .add(() => {
            gsap.set(figure, { clearProps: 'transform,opacity,clipPath,visibility' })
            gsap.set(img, { clearProps: 'transform' })
            img.classList.remove('revealing')
          })
      })

      // ---- End-of-project rule + copy ----
      const ending = gsap.timeline({
        scrollTrigger: { trigger: '.project-showcase-end', start: 'top 88%', once: true },
        defaults: { ease: 'power4.out' },
      })
      ending
        .from('.project-end-rule', { scaleX: 0, duration: 1.05, ease: 'power3.inOut' })
        .from(['.project-end-label', '.project-showcase-end a'], { y: 26, autoAlpha: 0, duration: .8, stagger: .12 }, '-=.6')
        .add(() => {
          gsap.set(['.project-end-label', '.project-showcase-end a'], { clearProps: 'transform,opacity,visibility' })
          gsap.set('.project-end-rule', { clearProps: 'transform' })
        })
    })

    return () => {
      document.body.classList.remove('project-opening-lock')
      gsap.utils.toArray('.project-image img').forEach((img) => img.classList.remove('revealing'))
      ctx.revert()
    }
  }, [])

  return <main className="project-page">
    <div className="project-opening-wipe" aria-hidden="true"><span>CATEGORY 03<br />3D &amp; MOTION</span></div>
    <nav className="project-nav shell"><a href="/" className="project-brand">ZT<span>STUDIO</span><sup>®</sup></a><a href="/#work">← BACK TO SELECTED WORK</a></nav>
    <section className="project-showcase">
      <div className="shell project-showcase-intro"><div><p className="section-label">( CATEGORY 03 ) / 3D &amp; MOTION</p><h1><span>三维与</span><em>动态视觉</em></h1></div><div className="project-showcase-meta"><span>SELECTED VISUAL BOARDS</span><p>三维资产、动态视觉与活动界面设计。</p><a href="/#contact">CONTACT <b>↗</b></a></div></div>
      <div className="project-image-stack">
        {projectImages.map((image) => <figure className="project-image" key={image.no}><img src={image.src} alt={`三维与动态视觉作品板 ${image.no}`} loading={image.no === '01' ? 'eager' : 'lazy'} /><figcaption>{image.no} / 03</figcaption></figure>)}
      </div>
      <div className="shell project-showcase-end"><span className="project-end-rule" aria-hidden="true" /><span className="project-end-label">END OF CATEGORY 03</span><a href="/#work">BACK TO SELECTED WORK ↑</a></div>
    </section>
  </main>
}

createRoot(document.getElementById('root')).render(<MotionVisualPage />)
