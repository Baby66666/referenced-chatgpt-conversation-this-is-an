import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import './project-showcase.css'
import './project-02.css'

const videos = Array.from({ length: 65 }, (_, index) => {
  const fileNumber = String(index + 2).padStart(3, '0')
  return { no: String(index + 1).padStart(2, '0'), src: `/media/project-02/${fileNumber}.mp4` }
})

function BrandVisualPage() {
  const [ratios, setRatios] = useState({})
  const [selectedVideo, setSelectedVideo] = useState(null)
  const setVideoRatio = (event, no) => {
    const { videoWidth, videoHeight } = event.currentTarget
    if (!videoWidth || !videoHeight) return
    const ratio = `${videoWidth} / ${videoHeight}`
    setRatios((current) => current[no] === ratio ? current : { ...current, [no]: ratio })
  }

  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && setSelectedVideo(null)
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return <main className="project-page brand-page">
    <nav className="project-nav shell"><a href="/" className="project-brand">ZT<span>STUDIO</span><sup>®</sup></a><a href="/#work">← BACK TO SELECTED WORK</a></nav>
    <section className="brand-showcase">
      <header className="shell brand-intro"><div><p className="section-label">( CATEGORY 02 ) / BRAND VISUAL</p><h1>品牌<br /><em>视觉</em></h1></div><div className="brand-intro-copy"><span>SELECTED VIDEO FRAMES</span><p>品牌视觉动态探索与画面呈现。</p><a href="/#contact">CONTACT <b>↗</b></a></div></header>
      <div className="shell brand-filter"><span>ALL WORKS</span><span>65 VIDEO PIECES</span><span>AUTO PLAY / LOOP</span></div>
      <div className="shell brand-video-grid">
        {videos.map((video, index) => <button className="brand-video-card" type="button" key={video.no} style={{ '--video-ratio': ratios[video.no] || '16 / 9' }} onClick={() => setSelectedVideo(video)} aria-label={`打开品牌视觉动态作品 ${video.no}`}><video autoPlay muted loop playsInline preload={index < 6 ? 'metadata' : 'none'} onLoadedMetadata={(event) => setVideoRatio(event, video.no)}><source src={video.src} type="video/mp4" /></video><span className="brand-video-play" aria-hidden="true">VIEW ↗</span><span className="brand-video-caption"><span>{video.no} / 65</span><b>BRAND VISUAL</b></span></button>)}
      </div>
      <footer className="shell project-showcase-end"><span>END OF CATEGORY 02</span><a href="/#work">BACK TO SELECTED WORK ↑</a></footer>
    </section>
    {selectedVideo && <div className="video-modal-backdrop" role="presentation" onClick={() => setSelectedVideo(null)}><section className="video-modal" role="dialog" aria-modal="true" aria-label={`品牌视觉动态作品 ${selectedVideo.no}`} onClick={(event) => event.stopPropagation()}><button className="video-modal-close" type="button" onClick={() => setSelectedVideo(null)} aria-label="关闭视频弹窗">×</button><div className="video-modal-player"><video controls autoPlay playsInline><source src={selectedVideo.src} type="video/mp4" /></video></div><p>{selectedVideo.no} / 65 — BRAND VISUAL</p></section></div>}
  </main>
}

createRoot(document.getElementById('root')).render(<BrandVisualPage />)
