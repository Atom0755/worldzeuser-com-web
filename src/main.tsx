import { USCGCCPage } from './pages/uscgcc';
import { USCLGCCPage } from './pages/usclgcc';
import { ILAUSAPage } from './pages/ilausa';
import { UZLEAPage } from './pages/uzlea';
import { GBIPage } from './pages/bgi';

const root = document.getElementById('root')

if (root) {
  const hostname = window.location.hostname.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();

  // --- 逻辑判断：是否进入二级域名子页面 ---
  if (hostname.includes('uscgcc') || pathname.includes('/a/uscgcc')) {
    root.innerHTML = USCGCCPage;
  } 
  else if (hostname.includes('usclgcc') || pathname.includes('/a/usclgcc')) {
    root.innerHTML = USCLGCCPage;
  }
  else if (hostname.includes('ilausa') || pathname.includes('/a/ilausa')) {
    root.innerHTML = ILAUSAPage;
  }
  else if (hostname.includes('uzlea') || pathname.includes('/a/uzlea')) {
    root.innerHTML = UZLEAPage;
  }
  else if (hostname.includes('gbi') || pathname.includes('/a/gbi')) {
    root.innerHTML = GBIPage;
  } 
  // --- 默认情况：显示您提供的精美 main 首页版面 ---
  else {
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
          border-radius: 40px;
          padding: 40px 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          text-align: center;
          backdrop-filter: blur(10px);
        ">
          <div style="margin-bottom: 24px;">
            <img src="/ZEHEM-LOGO.png" style="width:100px; height:auto; filter: drop-shadow(0 0 8px rgba(255,255,255,0.2));" />
          </div>

          <h1 style="font-size: 1.8rem; margin: 0; letter-spacing: -0.5px; font-weight: 700;">
            WorldZeuser我的助手<br />
            <span style="color: #38bdf8; font-size: 1.5rem;">AI Assistants</span>
          </h1>
          
          <p style="color: #94a3b8; margin: 12px 0 0; font-size: 0.9rem;">AI Portal for The Associations</p>
          <p style="color: #64748b; margin: 4px 0 24px; font-size: 0.8rem;">by ZEHEM.AI 哲亨的爱 created</p>

          <hr style="width: 180px; border: 0; border-top: 2px solid #38bdf8; margin: 20px auto 30px;" />

          <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${[
              { name: 'USCGCC 美国粤商会 / 美中广东总商会', link: 'https://uscgcc.worldzeuser.com' },
              { name: 'USCLGCC 美中物流总商会', link: 'https://usclgcc.worldzeuser.com' },
              { name: 'ILAUSA 美国国际物流协会', link: 'https://ilausa.worldzeuser.com' },
              { name: 'UZLEA 美国浙江物流电商协会', link: 'https://uzlea.worldzeuser.com' },
              { name: 'GBI 环球创新建材中心', link: 'https://gbi.worldzeuser.com' }
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
                " onmouseover="this.style.background='rgba(56, 189, 248, 0.1)'; this.style.borderColor='#38bdf8';" 
                   onmouseout="this.style.background='rgba(255, 255, 255, 0.05)'; this.style.borderColor='rgba(255, 255, 255, 0.1)';"
                >
                  ${item.name}
                </a>
              </li>
            `).join('')}
          </ul>

          <footer style="margin-top: 30px; color: #475569; font-size: 0.75rem;">
            © 2025 WorldZeuser.com我的助手 All Rights Reserved.
          </footer>
        </div>
      </div>
    `;
  }
}

// --- 2. 【核心修改：新增交互逻辑开始】 ---
  // 这段代码负责监听所有二级域名页面里的点击动作
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    // A. 处理“小字菜单”点击显示内容
    const quickActions = ['商会简介', '总会长简介', '秘书长简介', '入会指南', '创始单位'];
    if (quickActions.includes(target.innerText)) {
      const chatBox = document.querySelector('div[style*="overflow-y: auto"]');
      if (chatBox) {
        const msg = document.createElement('div');
        msg.style.cssText = "align-self: flex-start; max-width: 85%; padding: 12px; background: #1e293b; border-radius: 15px; border-bottom-left-radius: 2px; font-size: 0.9rem; margin-top: 10px; border: 1px solid rgba(56, 189, 248, 0.3);";
        msg.innerHTML = `<strong>${target.innerText}：</strong><br/>正在为您调取数据库资料... (稍后接入正式内容)`;
        chatBox.appendChild(msg);
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }

    // B. 处理“发送验证并登录”按钮拦截
    if (target.innerText === '发送验证并登录') {
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      if (emailInput && emailInput.value) {
        alert('验证码已发送至: ' + emailInput.value + '\\n(稍后我们将正式对接 Supabase 身份验证系统)');
        // 演示：暂时隐藏拦截层
        const overlay = document.querySelector('div[style*="backdrop-filter: blur(8px)"]') as HTMLElement;
        if (overlay) overlay.style.display = 'none';
      } else {
        alert('请输入有效的电子邮箱地址');
      }
    }
  });
  }// --- 【新增交互逻辑结束】 ---

