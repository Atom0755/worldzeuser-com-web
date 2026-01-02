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
    padding: 10px;
  ">
    <div style="
      width: 100%;
      max-width: 400px;
      height: 90vh;
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
      <div style="padding: 15px; background: rgba(30, 41, 59, 0.5); display: flex; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <img src="/USCGCC-LOGO.JPG" style="width: 30px; margin-right: 12px;" />
        <div>
          <div style="font-weight: bold; font-size: 0.9rem;">USCGCC 美国粤商会/美中广东总商会</div>
          <div style="font-size: 0.65rem; color: #38bdf8;"> AI 智能助手</div>
        </div>
      </div>

      <div style="padding: 10px; display: flex; flex-direction: column; gap: 8px; background: rgba(15, 23, 42, 0.2);">
        <div style="display: flex; gap: 6px; justify-content: center;">
          ${['商会简介', '总会长简介', '秘书长简介'].map(item => `
            <button style="font-size: 10px; padding: 5px 12px; border-radius: 15px; border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; background: rgba(56, 189, 248, 0.05); cursor: pointer;">${item}</button>
          `).join('')}
        </div>
        <div style="display: flex; gap: 6px; justify-content: center;">
          ${['入会指南', '创始单位', '联系我们'].map(item => `
            <button style="font-size: 10px; padding: 5px 12px; border-radius: 15px; border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; background: rgba(56, 189, 248, 0.05); cursor: pointer;">${item}</button>
          `).join('')}
        </div>
      </div>

      <div style="flex: 2; padding: 15px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto;">
        <div style="align-self: flex-start; max-width: 90%; padding: 12px; background: #1e293b; border-radius: 15px; border-bottom-left-radius: 2px; font-size: 0.85rem; border: 1px solid rgba(56,189,248,0.2);">
          您好！我是美国粤商会AI助手。关于本商会的入会要求、近期活动，您可以直接在下方询问我。
        </div>
        <div id="chat-box"></div>
      </div>

      <div style="padding: 10px 15px; margin-bottom: 5px;">
        <div style="display: flex; gap: 8px; background: #0f172a; padding: 5px 5px 5px 15px; border-radius: 25px; border: 1px solid #38bdf8;">
          <input type="text" placeholder="咨询问入会要求..." style="flex: 1; background: transparent; border: none; color: white; outline: none; font-size: 0.85rem;">
          <button style="width: 35px; height: 35px; border-radius: 50%; background: #38bdf8; border: none; color: white; cursor: pointer;">↑</button>
        </div>
      </div>

      <div style="flex: 1; background: rgba(15, 23, 42, 0.4); border-top: 1px solid rgba(255,255,255,0.05); padding: 12px; overflow-y: auto;">
        <div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 8px; font-weight: bold;">商会动态 News</div>
        <div style="font-size: 0.7rem; color: #e2e8f0; margin-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 5px;">• 2024 美中经贸交流会成功举办...</div>
        <div style="font-size: 0.7rem; color: #e2e8f0; margin-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 5px;">• 关于新入会成员资格公示通知...</div>
        <div style="font-size: 0.7rem; color: #e2e8f0;">• 美国粤商会AI助手正式启用上线...</div>
      </div>

      <div style="padding: 15px; background: rgba(255, 255, 255, 0.05); text-align: center; backdrop-filter: blur(4px);">
        <p style="font-size: 0.65rem; color: #94a3b8; margin: 0 0 8px;">申请加入USCGCC商会</p>
        <div style="display: flex; gap: 5px;">
          <input type="email" placeholder="邮箱" style="flex: 1; padding: 6px; font-size: 0.7rem; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: white;">
          <button style="padding: 6px 12px; font-size: 0.7rem; background: #8b5cf6; color: white; border: none; border-radius: 8px; cursor: pointer;">验证登录</button>
        </div>
      </div>
    </div>
  </div>
`;