import React, { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import './hero.css'
import './about.css'
import './projects.css'
import './capabilities.css'
import './contact.css'
import './overrides.css'

const projects = [
  { no: '01', kind: 'AI VISUAL', title: '活动视觉设计', desc: '将生成式工具融入视觉创作流程，探索图像、叙事与风格的协作边界。', tags: ['AI Creative', 'Visual System', 'Workflow'], tone: 'violet', href: '/project-01.html', image: '/media/previews/01.jpg' },
  { no: '02', kind: 'BRAND VISUAL', title: '礼物动效展示', desc: '从视觉策略到平面延展，建立清晰、统一且具有辨识度的品牌表达。', tags: ['Brand System', 'Art Direction', 'Graphic'], tone: 'steel', href: '/project-02.html', image: '/media/previews/02.jpg' },
  { no: '03', kind: '3D MOTION', title: '物料设计展示', desc: '以空间、材质和节奏重构视觉感知，为内容体验注入动态张力。', tags: ['3D Design', 'Motion', 'Visual Story'], tone: 'acid', href: '/project-03.html', image: '/media/previews/03.jpg' },
]

const strengths = [
  { title: '品牌视觉能力', tags: ['Brand Visual', 'Graphic Design', 'Art Direction'], size: 'tall' },
  { title: '三维与动效能力', tags: ['3D Design', 'Motion Design', 'Visual Story'], size: 'tall' },
  { title: 'AI 创作能力', tags: ['AI Creative', 'Workflow', 'Visual Exploration'], size: 'wide' },
  { title: '视觉系统搭建能力', tags: ['Visual System', 'Layout', 'Templates'], size: 'standard' },
  { title: '平面后期能力', tags: ['Retouching', 'Typography', 'Detail'], size: 'standard' },
]

const previewFrames = [
  { no: '01', title: 'VISUAL<br />FRAME', note: 'VISUAL DESIGN / 2026', tone: 'violet', image: '/media/catalog/01.jpg' },
  { no: '02', title: 'MOTION<br />STUDY', note: 'MOTION / AI CREATIVE', tone: 'blue', image: '/media/catalog/02.jpg' },
  { no: '03', title: 'BRAND<br />EXPLORATION', note: 'BRAND VISUAL', tone: 'orange', image: '/media/catalog/03.jpg' },
  { no: '04', title: 'DESIGN<br />DETAIL', note: 'VISUAL DESIGN', tone: 'purple', image: '/media/catalog/04.jpg' },
  { no: '05', title: 'CREATIVE<br />DIRECTION', note: 'ART DIRECTION', tone: 'mono', image: '/media/catalog/05.jpg' },
  { no: '06', title: 'GRAPHIC<br />STUDY', note: 'GRAPHIC DESIGN', tone: 'violet', image: '/media/catalog/06.jpg' },
  { no: '07', title: 'VISUAL<br />SYSTEM', note: 'VISUAL SYSTEM', tone: 'blue', image: '/media/catalog/07.jpg' },
  { no: '08', title: 'BRAND<br />MOMENT', note: 'BRAND VISUAL', tone: 'orange', image: '/media/catalog/08.jpg' },
  { no: '09', title: 'IMAGE<br />ARCHIVE', note: 'SELECTED WORK', tone: 'purple', image: '/media/catalog/09.jpg' },
]

function App() {
  const previewRailRef = useRef(null)

  useEffect(() => {
    const rail = previewRailRef.current
    if (!rail || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let frameId
    let previousTime = 0
    let paused = false
    const pause = () => { paused = true }
    const resume = () => { paused = false }
    const tick = (time) => {
      if (!previousTime) previousTime = time
      if (!paused && rail.scrollWidth > rail.clientWidth) {
        rail.scrollLeft += (time - previousTime) * 0.035
        if (rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 1) rail.scrollLeft = 0
      }
      previousTime = time
      frameId = window.requestAnimationFrame(tick)
    }

    rail.addEventListener('mouseenter', pause)
    rail.addEventListener('mouseleave', resume)
    rail.addEventListener('focusin', pause)
    rail.addEventListener('focusout', resume)
    frameId = window.requestAnimationFrame(tick)
    return () => {
      window.cancelAnimationFrame(frameId)
      rail.removeEventListener('mouseenter', pause)
      rail.removeEventListener('mouseleave', resume)
      rail.removeEventListener('focusin', pause)
      rail.removeEventListener('focusout', resume)
    }
  }, [])

  return <main>
    <section className="hero" id="top">
      <video className="hero-video" autoPlay muted loop playsInline poster="/media/hero-poster.png">
        <source src="/media/hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-glow" />
      <nav className="nav shell">
        <a className="brand" href="#top"><i />ZT<span>STUDIO</span><sup>®</sup></a>
        <div className="nav-links"><a href="#about">关于我 / ABOUT</a><a href="#work">精选作品 / WORK</a><a href="#contact">联系 / CONTACT</a></div>
        <a className="contact-link" href="#contact">START A CONVERSATION <span>↗</span></a>
      </nav>
      <div className="hero-content shell">
        <div className="hero-tag"><span>01</span><p>ZHANG TONG<br />VISUAL DESIGNER</p></div>
        <div className="hero-title"><p className="eyebrow">VISUAL / AI / BRAND — PORTFOLIO</p><h1><span className="hero-english">Visual Designer<br />2026 Portfolio</span><em>设计作品集</em></h1></div>
        <div className="hero-bottom">
          <p>视觉设计师 / AI 设计师 / 品牌设计师<br />基于图像、叙事与技术，塑造品牌的下一种表达。</p>
          <a href="#work" className="round-button">SCROLL<br />TO EXPLORE <b>↓</b></a>
        </div>
      </div>
      <span className="hero-index">01 — 05</span>
    </section>

    <section className="about section" id="about">
      <div className="shell about-topline"><span>GET TO KNOW ME BETTER</span><span>GET TO KNOW ME BETTER</span></div>
      <div className="shell about-layout">
        <aside className="profile-card">
          <div className="profile-photo"><img className="profile-portrait" src="/media/profile.jpg" alt="张通正面照" /></div>
          <div className="profile-name"><b>张 通</b><span>DESIG<br />NER</span></div>
          <div className="profile-info"><p>学历：<b>桂林理工大学 本科</b></p><p>专业：<b>视觉传达设计</b></p><p>微信：<b>15507832467</b></p><p>技能：<b>视觉、动效、3D、AI</b></p></div>
          <div className="profile-skills"><span>SKILLS</span><p>3D 视觉设计 / 动效设计 / 平面后期</p></div>
        </aside>
        <div className="experience">
          <div className="experience-heading"><p className="section-label">( 01 ) / ABOUT</p><h2>About Me<span>.</span><em>Work Experience</em></h2></div>
          <article className="job"><h3><i />南枫科技-WITOK语聊</h3><time>2025.10 — 2026.08</time><p>在职期间主要负责活动相关的视觉设计、物料设计，以及物料相关的动态设计。个人一体全流程设计，从视觉画面、风格、排版、动态拆分、动态设计到后期剪辑一体化全流程；跟进中东、南亚风格，熟悉当地文化特征及风格喜好。</p></article>
          <article className="job"><h3><i />百度旗下-YY直播</h3><time>2024.01 — 2024.12</time><p>负责 YY 直播 APP 内直播礼物从绘画、建模、动效到渲染的全流程设计，配合运营及活动需求，设计各类座驾、进场特效、勋章头像框的配套设计和动销制作；对不同币值礼物进行区分设计与更新迭代，并将 AI 介入工作流。</p></article>
          <article className="job"><h3><i />BIGO 欢聚时代</h3><time>2021.01 — 2024.01</time><p>负责 hello 语音项目内座驾、头像框、勋章等原画及动效设计；覆盖国内板块业务及海外板块礼物设计，服务中东、泰国、巴基斯坦、印度用户，深入了解海外风格、节日庆典及用户需求。</p></article>
        </div>
      </div>
      <div className="shell stats"><div><b>7<span>+</span></b><p>设计经验</p></div><div><b>4<span>+</span></b><p>项目工程跟进</p></div><div><b>5000<span>+</span></b><p>项目设计出图</p></div></div>
    </section>

    <section className="work catalog" id="work"><div className="shell"><div className="catalog-heading"><div><p className="catalog-title">SELECTED PROJECTS</p><h2>项目作品</h2></div><p className="section-label">( 02 ) / DIRECTORY</p></div>
      <div className="catalog-grid">{projects.map((p) => <article className={`catalog-card ${p.tone}`} key={p.no}><a className="catalog-art" href={p.href} aria-label={`进入${p.title}分类页面`}><img className="catalog-image" src={p.image} alt={`${p.title}作品预览`} /><span>{p.kind}</span></a><div className="catalog-body"><p className="catalog-no">{p.no} / SELECTED WORK</p><h3>{p.title}</h3><p className="catalog-desc">{p.desc}</p><div className="catalog-tags">{p.tags.map(tag => <span key={tag}>{tag}</span>)}</div><a href={p.href}>查看项目详情 <b>↗</b></a></div></article>)}</div></div>
    </section>

    <section className="strength capabilities" id="capabilities"><div className="shell"><div className="capabilities-heading"><p>CORE STRENGTHS</p><h2>个人优势</h2><span className="section-label">( 03 ) / CAPABILITIES</span></div><div className="capabilities-grid">{strengths.map((item) => <article className={`capability-card ${item.size}`} key={item.title}><h3>{item.title}<b>.</b></h3><div className="capability-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article>)}</div></div></section>

    <section className="contact contact-gallery" id="contact">
      <div className="contact-gallery-head shell"><div><p className="section-label">( 04 ) / CONTACT</p><h2>IMAGE<br /><em>PREVIEWS</em></h2></div><div className="contact-gallery-copy"><p>作品预览</p><span>SCROLL TO EXPLORE <b>→</b></span></div></div>
      <div className="preview-rail" ref={previewRailRef} onWheel={(event) => { if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) { event.currentTarget.scrollLeft += event.deltaY; event.preventDefault() } }}>
        {previewFrames.map((frame) => <article className={`preview-card ${frame.tone}`} key={frame.no}><img src={frame.image} alt="张通作品预览画面" /><div className="preview-shade" /><div className="preview-meta"><span>{frame.no} / 09</span><p dangerouslySetInnerHTML={{ __html: frame.title }} /><small>{frame.note}</small></div></article>)}
      </div>
      <div className="shell gallery-footer"><a className="gallery-contact" href="#top">期待与您交流 <span>↗</span></a><div><span>© 2026 ZHANG TONG</span><span>VISUAL / AI / BRAND DESIGNER</span><a href="#top">BACK TO TOP ↑</a></div></div>
    </section>

    <section className="ending-page" aria-label="作品集结尾页">
      <img src="/media/ending.jpg" alt="张通设计作品集 2026 致谢" />
      <div className="ending-copy" aria-label="2026 Thanks"><span>ZHANG TONG / PORTFOLIO</span><h2>2026<br /><em>Thanks</em></h2></div>
      <a className="ending-back" href="#top">BACK TO TOP <span>↑</span></a>
    </section>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
