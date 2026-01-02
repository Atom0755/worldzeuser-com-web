const root = document.getElementById('root')

if (root) {
  // --- 新增：二级域名识别逻辑 ---
  const hostname = window.location.hostname;
  
  // 判断是否通过 uscgcc 三级域名访问
  const isUSCGCC = hostname.includes('uscgcc');
  // 判断是否通过 ilausa 三级域名访问
  const isILAUSA = hostname.includes('ilausa');

  // 根据域名定制化内容
  let displayTitle = "WorldZeuser我的助手";
  let displaySubtitle = "AI Assistants";
  let displayWelcome = "AI Portal for The Associations";

  if (isUSCGCC) {
    displayTitle = "USCGCC 美国粤商会";
    displaySubtitle = "官方 AI 智能助手";
    displayWelcome = "欢迎咨询商会历史、入会要求及会员业务";
  } else if (isILAUSA) {
    displayTitle = "ILAUSA 国际物流协会";
    displaySubtitle = "官方 AI 智能助手";
    displayWelcome = "专注国际物流资源对接与行业咨询";
  }

  root.innerHTML = `
    <div style="
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px 20px;
    ">
      <div style="
        width: 100%;
        max-width: 400px;
        background: rgba(30, 41, 59, 0.7);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 40px; /* 模拟手机的圆角 */
        padding: 40px 24px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        text-align: center;
        backdrop-filter: blur(10px);
      ">
        
        <div style="margin-bottom: 24px;">
          <img src="/ZEHEM-LOGO.png" style="width:100px; height:auto; filter: drop-shadow(0 0 8px rgba(255,255,255,0.2));" />
        </div>

        <h1 style="font-size: 1.8rem; margin: 0; letter-spacing: -0.5px; font-weight: 700;">
          ${displayTitle}<br />
          <span style="color: #38bdf8; font-size: 1.5rem;">${displaySubtitle}</span>
        </h1>
        
        <p style="color: #94a3b8; margin: 12px 0 0; font-size: 0.9rem;">${displayWelcome}</p>
        <p style="color: #64748b; margin: 4px 0 24px; font-size: 0.8rem;">by ZEHEM.AI 哲亨的爱 created</p>

        <hr style="width: 180px; border: 0; border-top: 2px solid #38bdf8; margin: 20px auto 30px;" />

        <ul style="
          list-style: none; 
          padding: 0; 
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        ">
          ${[
            { name: 'USCGCC 美国粤商会 / 美中广东总商会', link: '/a/uscgcc' },
            { name: 'USCLGCC 美中物流总商会', link: '/a/usclgcc' },
            { name: 'ILAUSA 美国国际物流协会', link: '/a/ilausa' },
            { name: 'UZLEA 美国浙江物流电商协会', link: '/a/uzlea' },
            { name: 'GBI 环球创新建材中心 / 美国国际建材协会', link: '/a/gbi' }
          ].map(item => `
            <li>
              <a href="${item.link}" style="
                display: block;
                padding: 14px 18px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                color: #e2e8f0;
                text-decoration: none;
                font-weight: 500;
                transition: all 0.2s ease;
                font-size: 0.95rem;
              " onmouseover="this.style.background