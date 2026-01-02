const root = document.getElementById('root')

if (root) {
  root.innerHTML = `
    <div style="
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      text-align: center;
      padding: 60px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    ">
      <div style="margin-bottom: 24px;">
        <img src="/ZEHEM-LOGO.png" style="width:100px; height:auto; filter: drop-shadow(0 0 8px rgba(255,255,255,0.2));" />
      </div>

      <h1 style="font-size: 2.2rem; margin: 0; letter-spacing: -0.5px; font-weight: 700;">
        WorldZeuser我的助手<br />
        <span style="color: #38bdf8; font-size: 1.8rem;">AI Assistants</span>
      </h1>
      
      <p style="color: #94a3b8; margin: 12px 0 0; font-size: 1rem;">AI Portal for The Associations</p>
      <p style="color: #64748b; margin: 4px 0 24px; font-size: 0.85rem; letter-spacing: 1px;">by ZEHEM.AI 哲亨的爱 created</p>

      <hr style="width: 60px; border: 0; border-top: 2px solid #38bdf8; margin: 20px auto 40px;" />

      <ul style="
        list-style: none; 
        padding: 0; 
        width: 100%; 
        max-width: 450px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      ">
        ${[
          { name: 'USCGCC 美国粤商会 / 美中广东总商会', link: '/a/uscgcc' },
          { name: 'USCLGCC 美中物流总商会', link: '/a/usclgcc' },
          { name: 'ILAUSA 美国国际物流协会', link: '/a/ilausa' },
          { name: 'UZLEA 美国浙江物流电商协会', link: '/a/uzlea' },
          { name: 'GBI 环球创新建材中心', link: '/a/gbi' }
        ].map(item => `
          <li>
            <a href="${item.link}" style="
              display: block;
              padding: 16px 20px;
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 12px;
              color: #e2e8f0;
              text-decoration: none;
              font-weight: 500;
              transition: all 0.2s ease;
              font-size: 1.05rem;
            " onmouseover="this.style.background='rgba(56, 189, 248, 0.1)'; this.style.borderColor='#38bdf8';" 
               onmouseout="this.style.background='rgba(255, 255, 255, 0.05)'; this.style.borderColor='rgba(255, 255, 255, 0.1)';"
            >
              ${item.name}
            </a>
          </li>
        `).join('')}
      </ul>

      <footer style="margin-top: auto; padding-top: 60px; color: #475569; font-size: 0.8rem;">
        © 2025 WorldZeuser All Rights Reserved.
      </footer>
    </div>
  `
}