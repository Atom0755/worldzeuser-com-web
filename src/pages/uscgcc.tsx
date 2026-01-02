// src/pages/uscgcc.tsx
export const USCGCCPage = `
  <div style="
    min-height: 100vh;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  ">
    <div style="
      width: 100%;
      max-width: 400px;
      height: 85vh;
      background: rgba(30, 41, 59, 0.7);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 40px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
      overflow: hidden;
      position: relative;
    ">
      <div style="padding: 20px 15px 10px; background: rgba(30, 41, 59, 0.5); display: flex; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <img src="/ZEHEM-LOGO.png" style="width: 35px; margin-right: 12px;" />
        <div>
          <div style="font-weight: bold; font-size: 1rem;">USCGCC 美国粤商会</div>
          <div style="font-size: 0.7rem; color: #38bdf8;">官方 AI 智能助手</div>
        </div>
      </div>

      <div style="padding: 10px; display: flex; gap: 8px; overflow-x: auto; background: rgba(15, 23, 42, 0.2); scrollbar-width: none;">
        ${['商会简介', '总会长简介', '秘书长简介', '入会指南', '创始单位'].map(item => `
          <button style="font-size: 11px; white-space: nowrap; padding: 6px 15px; border-radius: 20px; border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; background: rgba(56, 189, 248, 0.05); cursor: pointer;">
            ${item}
          </button>
        `).join('')}
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 15px; position: relative;">
        <div style="align-self: flex-start; max-width: 85%; padding: 12px; background: #1e293b; border-radius: 15px; border-bottom-left-radius: 2px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.05);">
          您好！欢迎来到美国粤商会。您可以直接点击上方快捷菜单，或在注册登录后直接向我提问。
        </div>

        <div id="auth-overlay" style="position: absolute; inset: 0; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(6px); display: flex; justify-content: center; align-items: center; z-index: 100; padding: 20px;">
          <div style="background: white; color: #333; width: 100%; max-width: 280px; border-radius: 30px; padding: 30px 20px; text-align: center; box-shadow: 0 15px 30px rgba(0,0,0,0.3);">
            <h3 style="margin: 0 0 8px; font-size: 1.2rem;">申请 ZEHEM 身份</h3>
            <p style="font-size: 12px; color: #64748b; margin-bottom: 20px;">请注册或登录以开启 AI 提问功能</p>
            <input type="email" placeholder="电子邮箱" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #e2e8f0; border-radius: 10px; box-sizing: border-box; outline: none;">
            <input type="password" placeholder="设置密码" style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #e2e8f0; border-radius: 10px; box-sizing: border-box; outline: none;">
            <button style="width: 100%; padding: 12px; background: #8b5cf6; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer;">发送验证并登录</button>
          </div>
        </div>
      </div>

      <div style="padding: 15px; background: rgba(30, 41, 59, 0.4); display: flex; gap: 8px; border-top: 1px solid rgba(255,255,255,0.05);">
        <input type="text" placeholder="问问入会要求..." style="flex: 1; padding: 10px 15px; border-radius: 20px; border: 1px solid #334155; background: #0f172a; color: white; outline: none; font-size: 0.85rem;">
        <button style="width: 38px; height: 38px; border-radius: 50%; background: #38bdf8; border: none; font-weight: bold; cursor: pointer; color: white;">↑</button>
      </div>
    </div>
    </div>
`;