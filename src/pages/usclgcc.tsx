// src/pages/usclgcce.tsx
export const USCLGCCPage = `
  <div style="height: 100vh; display: flex; flex-direction: column; background: #0f172a; color: white; font-family: sans-serif;">
    <div style="padding: 15px; background: rgba(30, 41, 59, 0.8); backdrop-filter: blur(10px); display: flex; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
      <img src="/ZEHEM-LOGO.png" style="width: 40px; margin-right: 12px;" />
      <div>
        <div style="font-weight: bold; font-size: 1.1rem;">USCGCC 美国粤商会</div>
        <div style="font-size: 0.7rem; color: #38bdf8;">官方 AI 智能助手</div>
      </div>
    </div>

    <div style="padding: 10px; display: flex; gap: 8px; overflow-x: auto; background: #1e293b;">
      ${['商会简介', '总会长简介', '秘书长简介', '入会指南', '创始单位'].map(item => `
        <button style="font-size: 11px; white-space: nowrap; padding: 6px 15px; border-radius: 20px; border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; background: rgba(56, 189, 248, 0.1); cursor: pointer;">
          ${item}
        </button>
      `).join('')}
    </div>

    <div style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 15px; position: relative;">
      <div style="align-self: flex-start; max-width: 85%; padding: 12px; background: #1e293b; border-radius: 15px; border-bottom-left-radius: 2px; font-size: 0.9rem; line-height: 1.5;">
        您好！欢迎来到美国粤商会。您可以直接点击上方快捷菜单，或在注册登录后直接向我提问。
      </div>

      <div id="auth-overlay" style="position: absolute; inset: 0; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 100; padding: 20px;">
        <div style="background: white; color: #333; width: 100%; max-width: 320px; border-radius: 30px; padding: 35px 25px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <h2 style="margin: 0 0 10px; font-size: 1.4rem;">申请 ZEHEM 身份</h2>
          <p style="font-size: 13px; color: #64748b; margin-bottom: 25px;">请注册或登录以开启 AI 提问功能</p>
          <input type="email" placeholder="电子邮箱" style="width: 100%; padding: 12px; margin-bottom: 12px; border: 1px solid #e2e8f0; border-radius: 12px; box-sizing: border-box; outline: none;">
          <input type="password" placeholder="设置密码" style="width: 100%; padding: 12px; margin-bottom: 25px; border: 1px solid #e2e8f0; border-radius: 12px; box-sizing: border-box; outline: none;">
          <button style="width: 100%; padding: 15px; background: #8b5cf6; color: white; border: none; border-radius: 15px; font-weight: bold; cursor: pointer;">发送验证并登录</button>
        </div>
      </div>
    </div>

    <div style="padding: 20px; background: #1e293b; display: flex; gap: 10px; border-top: 1px solid rgba(255,255,255,0.1);">
      <input type="text" placeholder="问问入会要求..." style="flex: 1; padding: 12px 18px; border-radius: 25px; border: 1px solid #334155; background: #0f172a; color: white; outline: none;">
      <button style="width: 45px; height: 45px; border-radius: 50%; background: #38bdf8; border: none; font-weight: bold; cursor: pointer;">↑</button>
    </div>
  </div>
`;