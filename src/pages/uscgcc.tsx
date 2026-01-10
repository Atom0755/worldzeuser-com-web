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
      height: 82vh; 
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
      <div style="padding: 15px; background: rgba(30, 41, 59, 0.5); display: flex; flex-direction: column; align-items: center; justify-content: center; border-bottom: 1px solid rgba(255,255,255,0.05); gap: 8px;">
        <img src="/USCGCC-LOGO.jpg" class="logo-img" style="width: 40px; height: 40px; border-radius: 4px;" />
        <div style="text-align: center;">
          <div style="font-weight: bold; font-size: 0.85rem;">USCGCC 美国粤商会/美中广东总商会</div>
          <div style="font-size: 0.65rem; color: #38bdf8;"> AI 智能助手</div>
        </div>
      </div>

      <div style="padding: 10px; display: flex; flex-direction: column; gap: 8px; background: rgba(15, 23, 42, 0.2);">
        <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
          ${['商会简介', '总会长简介', '秘书长简介'].map(item => `
            <button class="menu-btn" data-menu="${item}" style="font-size: 10px; padding: 5px 12px; border-radius: 15px; border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; background: rgba(56, 189, 248, 0.05); cursor: pointer; transition: all 0.2s;">${item}</button>
          `).join('')}
        </div>
        <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
          ${['入会指南', '创始单位', '联系我们'].map(item => `
            <button class="menu-btn" data-menu="${item}" style="font-size: 10px; padding: 5px 12px; border-radius: 15px; border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; background: rgba(56, 189, 248, 0.05); cursor: pointer; transition: all 0.2s;">${item}</button>
          `).join('')}
        </div>
      </div>

      <div id="chat-container" style="flex: 1.5; padding: 15px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto;">
        <div style="align-self: flex-start; max-width: 90%; padding: 12px; background: #1e293b; border-radius: 15px; border-bottom-left-radius: 2px; font-size: 0.85rem; border: 1px solid rgba(56,189,248,0.2);">
          您好！我是美国粤商会AI助手。关于本商会的入会要求、近期活动，您可以直接在下方询问我。
        </div>
        <div id="chat-box" style="display: flex; flex-direction: column; gap: 10px;"></div>
      </div>

      <div style="padding: 5px 15px;">
        <div style="display: flex; gap: 8px; background: #0f172a; padding: 5px 5px 5px 15px; border-radius: 25px; border: 1px solid #38bdf8;">
          <input id="chat-input" type="text" placeholder="请问商会近期活动？..." style="flex: 1; background: transparent; border: none; color: white; outline: none; font-size: 0.85rem;">
          <button id="send-btn" style="width: 35px; height: 35px; border-radius: 50%; background: #38bdf8; border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: all 0.2s;">↑</button>
        </div>
      </div>

      <div id="auth-overlay" style="padding: 5px 15px 10px;">
        <div style="display: flex; gap: 5px; background: rgba(255, 255, 255, 0.05); padding: 4px; border-radius: 10px;">
          <input id="email-input" type="email" placeholder="输入邮箱验证后开启 AI 提问" style="flex: 1; padding: 6px 12px; font-size: 0.7rem; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: white; outline: none;">
          <button id="verify-submit" style="padding: 6px 12px; font-size: 0.7rem; background: #8b5cf6; color: white; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s;">点击确认</button>
        </div>
      </div>

      <div style="flex: 0.8; background: rgba(15, 23, 42, 0.4); border-top: 1px solid rgba(255,255,255,0.05); padding: 12px; overflow-y: auto;">
        <div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 8px; font-weight: bold;">商会动态 News</div>
        <div style="font-size: 0.7rem; color: #e2e8f0; margin-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 5px;">• 2024 美中经贸交流会成功举办...</div>
        <div style="font-size: 0.7rem; color: #e2e8f0; margin-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 5px;">• 关于新入会成员资格公示通知...</div>
        <div style="font-size: 0.7rem; color: #e2e8f0; margin-bottom: 12px;">• 美国粤商会AI助手正式启用上线...</div>
        <div style="font-size: 0.7rem; color: #e2e8f0; margin-bottom: 12px;">• 更多动态资讯,即将发布...</div>
        <div style="text-align: center; padding-top: 5px;">
          <p style="font-size: 0.8rem; color: #38bdf8; margin: 0; cursor: pointer; font-weight: bold;">申请加入 USCGCC 商会 →</p>
        </div>
      </div>

      <div style="padding: 5px;"></div>
    </div>
`;
