import React from 'react'
import { TENANTS } from '../data/tenants'

function openTenant(slug: string) {
  const apex = 'worldzeuser.com'
  const url = `https://${slug}.${apex}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export default function Landing() {
  return (
    <div className="container">
      <div className="topbar">
        <div className="brand">
          <div className="logo" aria-label="ZEHEM logo">
            {/* Put your ZEHEM-LOGO.png at /public/ZEHEM-LOGO.png */}
            <img src="/ZEHEM-LOGO.png" alt="ZEHEM" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
          </div>
          <div>
            <h1>WorldZeuser</h1>
            <div className="small">AI 助手大汇合（子域名进入各商会/协会）</div>
          </div>
        </div>
        <div className="pill">by ZEHEM.AI · created</div>
      </div>

      <div className="hero">
        <h2>欢迎来到 WorldZeuser.com</h2>
        <p>
          这里是各商会/协会 AI 智能助手的集合主页。点击下方商会名称即可打开对应的子域名站点，
          未来每个子域名都可以独立配置内容、FAQ、RAG 知识库与活动动态发布。
        </p>
        <div className="btnRow">
          <a className="btn btnPrimary" href="https://worldzeusor.com" target="_blank" rel="noreferrer">
            WorldZeusor.com 我的助手（测试站）
          </a>
          <a className="btn" href="/admin">管理员入口（通用）</a>
        </div>
        <div className="hr" />
        <div className="small">
          提示：子域名需要在 Vercel 里配置 `*.worldzeuser.com`（wildcard）并在 DNS 里添加相应记录。
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>商会/协会列表</h3>
          <p>点击名称打开子域名；也可以直接在浏览器输入：例如 <span className="tag">uscgcc.worldzeuser.com</span></p>
          <div className="list">
            {TENANTS.map(t => (
              <div key={t.slug} className="item">
                <div>
                  <div className="itemTitle">{t.displayName}</div>
                  <div className="small">{t.subtitle ?? t.slug}</div>
                </div>
                <div className="btnRow">
                  <button className="btn btnPrimary" onClick={() => openTenant(t.slug)}>打开</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>子域名站点如何工作</h3>
          <p>
            当访问 <span className="tag">xxx.worldzeuser.com</span> 时，网站会自动识别 <b>xxx</b> 为租户（tenant），
            进入该租户的主页。管理员（会长/秘书长）登录后可以发布动态与管理内容。
          </p>
          <div className="hr" />
          <div className="notice">
            下一步我们会为第一个租户 <b>USCGCC</b> 做「AI 助手页面 + FAQ/RAG」与「管理员发布后台」的增强。
          </div>
        </div>
      </div>

      <div className="footer">
        © {new Date().getFullYear()} ZEHEM.AI · WorldZeuser.com
      </div>
    </div>
  )
}
