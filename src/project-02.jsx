import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './style.css'
import './project-showcase.css'
import './project-02.css'

const videos = Array.from({ length: 65 }, (_, index) => {
  const fileNumber = String(index + 2).padStart(3, '0')
  return { no: String(index + 1).padStart(2, '0'), src: `/media/project-02/${fileNumber}.mp4` }
})

const RATIO_PROBE_CONCURRENCY = 8

// Probe each video's intrinsic dimensions in the background (metadata-only, concurrency-capped)
// so the masonry renders with its final aspect ratios up front — no reflow while scrolling.
function useVideoRatios() {
  const [ratios, setRatios] = useState({})

  useEffect(() => {
    let cancelled = false
    const queue = [...videos]
    let active = 0

    const settle = (no, ratio) => {
      active -= 1
      if (!cancelled && ratio) {
        setRatios((current) => (current[no] === ratio ? current : { ...current, [no]: ratio }))
      }
      pump()
    }
    const probe = (video) => {
      const element = document.createElement('video')
      element.preload = 'metadata'
      element.muted = true
      element.addEventListener('loadedmetadata', () => {
        const ratio = element.videoWidth && element.videoHeight ? `${element.videoWidth} / ${element.videoHeight}` : null
        element.removeAttribute('src')
        element.load()
        settle(video.no, ratio)
      }, { once: true })
      element.addEventListener('error', () => settle(video.no, null), { once: true })
      element.src = video.src
      element.load()
    }
    const pump = () => {
      while (active < RATIO_PROBE_CONCURRENCY && queue.length) {
        active += 1
        probe(queue.shift())
      }
    }
    const start = () => { if (!cancelled) pump() }
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 3000 })
      return () => { cancelled = true; window.cancelIdleCallback(id) }
    }
    const timer = window.setTimeout(start, 900)
    return () => { cancelled = true; window.clearTimeout(timer) }
  }, [])

  // Keep scroll-trigger positions accurate after the grid settles
  useEffect(() => {
    try { ScrollTrigger.refresh() } catch { /* plugin not registered yet — harmless */ }
  }, [ratios])

  return ratios
}

function LazyPreviewVideo({ video, index }) {
  const wrapperRef = useRef(null)
  const videoRef = useRef(null)
  const inViewRef = useRef(false)
  const [mounted, setMounted] = useState(index < 6)
  const [ready, setReady] = useState(false)

  // Mount the video element once the card approaches the viewport
  useEffect(() => {
    const node = wrapperRef.current
    if (!node || mounted) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setMounted(true)
    }, { rootMargin: '480px 0px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [mounted])

  // Play only while the card is near the viewport; pause when it scrolls far off —
  // keeps concurrent decoders low so the page stays smooth
  useEffect(() => {
    const node = wrapperRef.current
    const video = videoRef.current
    if (!node || !video || !mounted) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting
      if (entry.isIntersecting) {
        const play = video.play()
        if (play) play.catch(() => {})
      } else {
        video.pause()
      }
    }, { rootMargin: '120px 0px' })
    observer.observe(node)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [mounted])

  return <div className="brand-video-preview" ref={wrapperRef}>
    {mounted && <video ref={videoRef} className={ready ? 'is-ready' : ''} muted loop playsInline preload="metadata" onLoadedData={() => { setReady(true); if (inViewRef.current) { const play = videoRef.current && videoRef.current.play(); if (play) play.catch(() => {}) } }}><source src={video.src} type="video/mp4" /></video>}
  </div>
}

function BrandVisualPage() {
  const ratios = useVideoRatios()
  const [selectedVideo, setSelectedVideo] = useState(null)

  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && setSelectedVideo(null)
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  // Lock page scroll while the modal is open
  useEffect(() => {
    document.body.style.overflow = selectedVideo ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedVideo])

  // Entrance + scroll motion (skipped under prefers-reduced-motion)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    gsap.registerPlugin(ScrollTrigger)
    ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })

    const ctx = gsap.context(() => {
      document.body.classList.add('project-opening-lock')

      const opening = gsap.timeline({ defaults: { ease: 'power4.out' } })
      opening
        .set('.project-opening-wipe', { scaleY: 1, transformOrigin: 'top center' })
        .set(['.project-nav', '.brand-intro .section-label', '.brand-filter'], { autoAlpha: 0, y: 30 })
        .set('.brand-intro-copy > *', { autoAlpha: 0, y: 24 })
        .set(['.brand-intro h1 span', '.brand-intro h1 em'], {
          clipPath: 'inset(0 0 100% 0)',
          yPercent: 112,
          scaleX: .78,
          transformOrigin: 'right center',
        })
        .to('.project-opening-wipe span', { autoAlpha: 0, y: -16, duration: .4, ease: 'power2.out' }, .3)
        .to('.project-opening-wipe', { scaleY: 0, duration: 1.4, ease: 'power4.inOut' }, 0)
        .to('.project-nav', { autoAlpha: 1, y: 0, duration: .85 }, '-=.85')
        .to('.brand-intro .section-label', { autoAlpha: 1, y: 0, duration: .65 }, '-=.5')
        .to('.brand-intro h1 span', { clipPath: 'inset(0 0 0% 0)', yPercent: 0, scaleX: 1, duration: 1 }, '-=.38')
        .to('.brand-intro h1 em', { clipPath: 'inset(0 0 0% 0)', yPercent: 0, scaleX: 1, duration: 1.2 }, '-=.82')
        .to('.brand-intro-copy > *', { autoAlpha: 1, y: 0, duration: .7, stagger: .08 }, '-=.55')
        .to('.brand-filter', { autoAlpha: 1, y: 0, duration: .7 }, '-=.6')
        .add(() => {
          document.body.classList.remove('project-opening-lock')
          gsap.set(['.project-nav', '.brand-intro .section-label', '.brand-intro-copy > *', '.brand-filter'], { clearProps: 'transform,opacity,visibility' })
          gsap.set(['.brand-intro h1 span', '.brand-intro h1 em'], { clearProps: 'transform,clipPath' })
          gsap.set('.project-opening-wipe', { display: 'none' })
        })

      // Featherweight scroll reveal — transform/opacity only, no layout cost
      gsap.utils.toArray('.brand-video-card').forEach((card) => {
        gsap.from(card, {
          autoAlpha: 0,
          y: 56,
          scale: .985,
          duration: .7,
          ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 92%', once: true },
          onStart: () => card.classList.add('revealing'),
          onComplete: () => {
            card.classList.remove('revealing')
            gsap.set(card, { clearProps: 'transform,opacity,visibility' })
          },
        })
      })

      // End-of-project rule + copy
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
      ctx.revert()
    }
  }, [])

  return <main className="project-page brand-page">
    <div className="project-opening-wipe" aria-hidden="true"><span>CATEGORY 02<br />BRAND VISUAL</span></div>
    <nav className="project-nav shell"><a href="/" className="project-brand">ZT<span>STUDIO</span><sup>®</sup></a><a href="/#work">← BACK TO SELECTED WORK</a></nav>
    <section className="brand-showcase">
      <header className="shell brand-intro"><div><p className="section-label">( CATEGORY 02 ) / BRAND VISUAL</p><h1><span>品牌</span><em>视觉</em></h1></div><div className="brand-intro-copy"><span>SELECTED VIDEO FRAMES</span><p>品牌视觉动态探索与画面呈现。</p><a href="/#contact">CONTACT <b>↗</b></a></div></header>
      <div className="shell brand-filter"><span>ALL WORKS</span><span>65 VIDEO PIECES</span><span>AUTO PLAY / LOOP</span></div>
      <div className="shell brand-video-grid">
        {videos.map((video, index) => <button className="brand-video-card" type="button" key={video.no} style={{ '--video-ratio': ratios[video.no] || '16 / 9' }} onClick={() => setSelectedVideo(video)} aria-label={`打开品牌视觉动态作品 ${video.no}`}><LazyPreviewVideo video={video} index={index} /><span className="brand-video-play" aria-hidden="true">VIEW ↗</span><span className="brand-video-caption"><span>{video.no} / 65</span><b>BRAND VISUAL</b></span></button>)}
      </div>
      <footer className="shell project-showcase-end"><span className="project-end-rule" aria-hidden="true" /><span className="project-end-label">END OF CATEGORY 02</span><a href="/#work">BACK TO SELECTED WORK ↑</a></footer>
    </section>
    {selectedVideo && <div className="video-modal-backdrop" role="presentation" onClick={() => setSelectedVideo(null)}><section className="video-modal" role="dialog" aria-modal="true" aria-label={`品牌视觉动态作品 ${selectedVideo.no}`} onClick={(event) => event.stopPropagation()}><button className="video-modal-close" type="button" onClick={() => setSelectedVideo(null)} aria-label="关闭视频弹窗">×</button><div className="video-modal-player"><video controls autoPlay playsInline><source src={selectedVideo.src} type="video/mp4" /></video></div><p>{selectedVideo.no} / 65 — BRAND VISUAL</p></section></div>}
  </main>
}

createRoot(document.getElementById('root')).render(<BrandVisualPage />)
