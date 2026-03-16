const SITE_PASSWORD = "watermelon"; // 改成你的密码
const AUTH_KEY = "valhalla_auth_ok";
const AUTH_TIME_KEY = "valhalla_auth_time";
const TIMEOUT_MINUTES = 60; // 多久不访问后失效

function isAuthValid() {
  const ok = localStorage.getItem(AUTH_KEY);
  const lastTime = localStorage.getItem(AUTH_TIME_KEY);

  if (ok !== "true" || !lastTime) return false;

  const now = Date.now();
  const diff = now - Number(lastTime);
  const timeout = TIMEOUT_MINUTES * 60 * 1000;

  return diff <= timeout;
}

function refreshAuthTime() {
  localStorage.setItem(AUTH_TIME_KEY, String(Date.now()));
}

function showPasswordGate() {
  document.documentElement.innerHTML = `
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Access Required</title>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background: #0b0c10;
          color: #e8e8e8;
          font-family: Georgia, serif;
        }
        .gate-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          box-sizing: border-box;
          background:
            linear-gradient(rgba(10,10,15,0.72), rgba(10,10,15,0.72)),
            radial-gradient(circle at top, rgba(255,255,255,0.05), transparent 40%);
        }
        .gate-box {
          width: 100%;
          max-width: 460px;
          background: rgba(20,20,28,0.78);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 18px;
          padding: 32px 28px;
          box-sizing: border-box;
          text-align: center;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 10px 35px rgba(0,0,0,0.45);
        }
        .gate-system {
          font-size: 12px;
          letter-spacing: 4px;
          color: #d8cfa6;
          opacity: 0.8;
          margin-bottom: 10px;
        }
        .gate-title {
          font-size: 30px;
          margin: 0 0 8px 0;
        }
        .gate-subtitle {
          font-size: 15px;
          color: #aaa;
          margin: 0 0 24px 0;
        }
        .gate-input {
          width: 100%;
          padding: 12px 14px;
          font-size: 16px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.06);
          color: #fff;
          box-sizing: border-box;
          outline: none;
          margin-bottom: 14px;
        }
        .gate-btn {
          width: 100%;
          padding: 12px 14px;
          font-size: 15px;
          border-radius: 10px;
          border: 1px solid rgba(255,215,120,0.35);
          background: rgba(255,215,120,0.12);
          color: #ffe8a3;
          cursor: pointer;
        }
        .gate-btn:hover {
          background: rgba(255,215,120,0.18);
        }
        .gate-error {
          margin-top: 12px;
          color: #ffb3b3;
          min-height: 20px;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="gate-wrap">
        <div class="gate-box">
          <div class="gate-system">VALHALLA ARCHIVE SYSTEM</div>
          <h1 class="gate-title">Access Required</h1>
          <p class="gate-subtitle">请输入访问密码</p>
          <input id="gate-password" class="gate-input" type="password" placeholder="Password">
          <button id="gate-submit" class="gate-btn">ENTER ARCHIVE</button>
          <div id="gate-error" class="gate-error"></div>
        </div>
      </div>

      <script>
        const input = document.getElementById("gate-password");
        const btn = document.getElementById("gate-submit");
        const error = document.getElementById("gate-error");

        function submitPassword() {
          if (input.value === "${SITE_PASSWORD}") {
            localStorage.setItem("${AUTH_KEY}", "true");
            localStorage.setItem("${AUTH_TIME_KEY}", String(Date.now()));
            location.reload();
          } else {
            error.textContent = "密码错误";
            input.value = "";
          }
        }

        btn.addEventListener("click", submitPassword);
        input.addEventListener("keydown", function(e) {
          if (e.key === "Enter") submitPassword();
        });
        input.focus();
      <\/script>
    </body>
  </html>
  `;
}

(function initAuth() {
  if (isAuthValid()) {
    refreshAuthTime();
  } else {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_TIME_KEY);
    showPasswordGate();
  }
})();
