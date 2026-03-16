const SITE_PASSWORD = "watermelon"; // 改成你的密码
const AUTH_KEY = "valhalla_auth_ok";
const AUTH_TIME_KEY = "valhalla_auth_time";
const TIMEOUT_MINUTES = 60;

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

function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_TIME_KEY);
}

function createGate() {
  const style = document.createElement("style");
  style.textContent = `
#auth-overlay{
  position:fixed;
  inset:0;
  z-index:999999;

  background:rgba(20,20,30,0.35);

  backdrop-filter:blur(18px) saturate(120%);
  -webkit-backdrop-filter:blur(18px) saturate(120%);

  display:flex;
  align-items:center;
  justify-content:center;
  padding:24px;
  box-sizing:border-box;
}

    #auth-box{
      width:100%;
      max-width:460px;
      background:rgba(20,20,28,0.88);
      border:1px solid rgba(255,255,255,0.12);
      border-radius:18px;
      padding:32px 28px;
      box-sizing:border-box;
      text-align:center;
      backdrop-filter:blur(10px);
      -webkit-backdrop-filter:blur(10px);
      box-shadow:0 10px 35px rgba(0,0,0,0.45);
      color:#e8e8e8;
      font-family:Georgia, serif;
    }

    #auth-system{
      font-size:12px;
      letter-spacing:4px;
      color:#d8cfa6;
      opacity:0.8;
      margin-bottom:10px;
      text-transform:uppercase;
    }

    #auth-title{
      font-size:30px;
      margin:0 0 8px 0;
    }

    #auth-subtitle{
      font-size:15px;
      color:#aaa;
      margin:0 0 24px 0;
    }

    #auth-password{
      width:100%;
      padding:12px 14px;
      font-size:16px;
      border-radius:10px;
      border:1px solid rgba(255,255,255,0.16);
      background:rgba(255,255,255,0.06);
      color:#fff;
      box-sizing:border-box;
      outline:none;
      margin-bottom:14px;
    }

    #auth-submit{
      width:100%;
      padding:12px 14px;
      font-size:15px;
      border-radius:10px;
      border:1px solid rgba(255,215,120,0.35);
      background:rgba(255,215,120,0.12);
      color:#ffe8a3;
      cursor:pointer;
    }

    #auth-submit:hover{
      background:rgba(255,215,120,0.18);
    }

    #auth-error{
      margin-top:12px;
      color:#ffb3b3;
      min-height:20px;
      font-size:14px;
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "auth-overlay";
  overlay.innerHTML = `
    <div id="auth-box">
      <div id="auth-system">VALHALLA ARCHIVE SYSTEM</div>
      <h1 id="auth-title">Access Required</h1>
      <p id="auth-subtitle">请输入访问密码</p>
      <input id="auth-password" type="password" placeholder="Password">
      <button id="auth-submit">ENTER ARCHIVE</button>
      <div id="auth-error"></div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  const input = document.getElementById("auth-password");
  const btn = document.getElementById("auth-submit");
  const error = document.getElementById("auth-error");

  function submitPassword() {
    if (input.value === SITE_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "true");
      refreshAuthTime();
      overlay.remove();
      document.body.style.overflow = "";
    } else {
      error.textContent = "密码错误";
      input.value = "";
      input.focus();
    }
  }

  btn.addEventListener("click", submitPassword);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") submitPassword();
  });

  input.focus();
}

function initAuth() {
  if (isAuthValid()) {
    refreshAuthTime();
    return;
  }

  clearAuth();
  createGate();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAuth);
} else {
  initAuth();
}
