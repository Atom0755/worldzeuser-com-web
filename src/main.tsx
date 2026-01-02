const root = document.getElementById('root')

if (root) {
  // --- 1. 获取当前访问的域名 ---
  const hostname = window.location.hostname;
  
  // --- 2. 核心逻辑：判断是哪个子域名 ---
  // 判断逻辑：如果域名包含 'uscgcc'，则进入粤商会模式
  const isUSCGCC = hostname.includes('uscgcc');
  // 您可以继续添加其他判断，比如 isILAUSA = hostname.includes('ilausa');

  // --- 3. 根据域名设置不同的页面内容 ---
  const pageContent = isUSCGCC ? {
    title: "USCGCC 美国粤商会",
    subtitle: "美中广东总商会官方 AI 助手",
    description: "您好！我是粤商会智能助理。关于商会历史、入会收费或会长简介，请随时问我。",
    color: "#38bdf8", // 粤商会用蓝色
    logo: "/ZEHEM-LOGO.png" // 以后可以换成粤商会专属 Logo
  } : {
    title: "WorldZeuser 我的助手",
    subtitle: "AI Assistants Portal",
    description: "by ZEHEM.AI 哲亨的爱 created",
    color: "#f87171", // 主站可以换个颜色区分
    logo: "/ZEHEM-LOGO.png"
  };

  // --- 4. 渲染 UI (保持手机屏幕样式) ---
  root.innerHTML = `
    <div style="
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #f8fafc;
      font-family: -apple-system, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    ">
      <div style="
        width: 100%;
        max-width: 420px;
        background: rgba(30, 41, 59, 0.85);
        border: 1px solid ${pageContent.color}33; /* 边框色随子域名变化 */
        border-radius: 48px;
        padding: 40px 24px;
        box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.6);
        text-align: center;
        backdrop-filter: blur(15px);
      ">
        <img src="${pageContent.logo}" style="width:90px; margin-bottom: 20px;" />

        <h1 style="font-size: 1.6rem; margin: 0; font-weight: 800;">${pageContent.title}</h1>
        <p style="color: ${pageContent.color}; font-weight: 600; margin-top: 5px;">${pageContent.subtitle}</p>
        
        <hr style="width: 40px; border: 1px solid ${pageContent.color}; margin: 25px auto;" />

        <div style="text-align: left; background: rgba(255,255,255,0.03); padding: 18px; border-radius: 20px; border-left: 4px solid ${pageContent.color};">
           <p style="font-size: 0.9rem; color: #cbd5e1; line-height: 1.6; margin: 0;">
             ${pageContent.description}
           </p>
        </div>

        ${!isUSCGCC ? `
          <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
            ${['USCGCC 美国粤商会', 'USCLGCC 美中物流总商会', 'ILAUSA 美国国际物流协会'].map(name => `
              <li style="padding: 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 15px; font-size: 0.9rem;">
                ${name}
              </li>
            `).join('')}
          </ul>
        ` : `
          <div style="margin-top: 25px;">
             <button style="
               width: 100%; padding: 16px; 
               background: ${pageContent.color}; color: #000; 
               border: none; border-radius: 16px; 
               font-weight: bold; cursor: pointer;
             ">立即咨询 AI 助手</button>
          </div>
        `}

        <footer style="margin-top: 40px; color: #475569; font-size: 0.7rem;">
          Securely powered by ZEHEM.AI
        </footer>
      </div>
    </div>
  `
}