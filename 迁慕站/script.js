// 全局变量
let clickCount = 0;
const TARGET_CLICKS = 10;
const CORRECT_PASSWORD = 'syh123456mm';
let passwordAttempts = 0;
const MAX_PASSWORD_ATTEMPTS = 3;

// DOM 元素
const logoContainer = document.getElementById('logoContainer');
const clickCountEl = document.getElementById('clickCount');
const progressBar = document.getElementById('progressBar');
const passwordModal = document.getElementById('passwordModal');
const passwordInput = document.getElementById('passwordInput');
const togglePassword = document.getElementById('togglePassword');
const confirmPassword = document.getElementById('confirmPassword');
const cancelPassword = document.getElementById('cancelPassword');
const closePasswordModal = document.getElementById('closePasswordModal');
const errorMessage = document.getElementById('errorMessage');

// 初始化
function init() {
    updateProgress();
    setupEventListeners();
    checkAuthStatus();
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
}

// 设置事件监听器
function setupEventListeners() {
    logoContainer.addEventListener('click', handleLogoClick);
    
    // 密码模态框事件
    confirmPassword.addEventListener('click', verifyPassword);
    cancelPassword.addEventListener('click', closePasswordModalHandler);
    closePasswordModal.addEventListener('click', closePasswordModalHandler);
    passwordModal.addEventListener('click', (e) => {
        if (e.target === passwordModal) {
            closePasswordModalHandler();
        }
    });
    
    // 密码显示/隐藏切换
    togglePassword.addEventListener('click', togglePasswordVisibility);
    
    // 回车键提交
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            verifyPassword();
        }
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        // ESC 关闭模态框
        if (e.key === 'Escape' && passwordModal.classList.contains('active')) {
            closePasswordModalHandler();
        }
    });
}

// 处理 Logo 点击
function handleLogoClick(e) {
    e.preventDefault();
    
    clickCount++;
    updateProgress();
    
    // 创建点击动画效果
    createClickEffect(e);
    
    // 检查是否达到目标点击数
    if (clickCount >= TARGET_CLICKS) {
        setTimeout(() => {
            showPasswordModal();
            resetClickCount();
        }, 300);
    }
}

// 更新进度显示
function updateProgress() {
    clickCountEl.textContent = clickCount;
    
    const progress = (clickCount / TARGET_CLICKS) * 100;
    const circumference = 2 * Math.PI * 45; // r=45
    const offset = circumference - (progress / 100) * circumference;
    progressBar.style.strokeDashoffset = offset;
    
    // 添加进度环颜色变化
    if (progress >= 100) {
        progressBar.style.stroke = '#10b981'; // 绿色
    } else if (progress >= 70) {
        progressBar.style.stroke = '#f59e0b'; // 橙色
    } else {
        progressBar.style.stroke = '#6366f1'; // 主色
    }
}

// 创建点击动画效果
function createClickEffect(e) {
    const rect = logoContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 创建波纹效果
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.background = 'rgba(99, 102, 241, 0.3)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'ripple 0.6s ease-out';
    
    logoContainer.style.position = 'relative';
    logoContainer.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
    
    // 添加数字弹出效果
    createNumberPopup(e);
}

// 创建数字弹出效果
function createNumberPopup(e) {
    const popup = document.createElement('div');
    popup.textContent = '+' + clickCount;
    popup.style.position = 'fixed';
    popup.style.left = e.clientX + 'px';
    popup.style.top = e.clientY + 'px';
    popup.style.fontSize = '24px';
    popup.style.fontWeight = 'bold';
    popup.style.color = '#6366f1';
    popup.style.pointerEvents = 'none';
    popup.style.zIndex = '9999';
    popup.style.animation = 'numberPopup 1s ease-out forwards';
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 1000);
}

// 重置点击计数
function resetClickCount() {
    setTimeout(() => {
        clickCount = 0;
        updateProgress();
    }, 1000);
}

// 显示密码模态框
function showPasswordModal() {
    passwordModal.classList.add('active');
    passwordInput.focus();
    
    // 重置状态
    passwordInput.value = '';
    errorMessage.textContent = '';
    passwordAttempts = 0;
}

// 关闭密码模态框
function closePasswordModalHandler() {
    passwordModal.classList.remove('active');
    errorMessage.textContent = '';
    passwordInput.value = '';
    
    // 延迟重置点击计数，给用户反馈时间
    setTimeout(() => {
        resetClickCount();
    }, 500);
}

// 切换密码可见性
function togglePasswordVisibility() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // 切换图标
    const svg = togglePassword.querySelector('svg');
    if (type === 'text') {
        svg.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <path d="M2 2l20 20" stroke="currentColor" stroke-width="2"/>
        `;
    } else {
        svg.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
        `;
    }
}

// 验证密码
function verifyPassword() {
    const password = passwordInput.value.trim();
    
    if (!password) {
        showError('请输入密码');
        return;
    }
    
    if (password === CORRECT_PASSWORD) {
        // 密码正确，设置认证状态
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authTime', Date.now().toString());
        
        // 显示成功消息
        showToast('身份验证成功，正在跳转...', 'success');
        
        // 关闭模态框并跳转
        setTimeout(() => {
            passwordModal.classList.remove('active');
            window.location.href = 'admin.html';
        }, 1000);
        
    } else {
        passwordAttempts++;
        const remaining = MAX_PASSWORD_ATTEMPTS - passwordAttempts;
        
        if (remaining > 0) {
            showError(`密码错误！还剩 ${remaining} 次机会`);
            passwordInput.value = '';
            passwordInput.focus();
            
            // 添加错误动画
            addErrorAnimation();
        } else {
            // 触发安全警报
            triggerSecurityAlert();
        }
    }
}

// 显示错误消息
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.animation = 'shake 0.5s ease-in-out';
    
    setTimeout(() => {
        errorMessage.style.animation = '';
    }, 500);
}

// 添加错误动画
function addErrorAnimation() {
    passwordInput.style.animation = 'shake 0.5s ease-in-out';
    passwordInput.style.borderColor = '#ef4444';
    
    setTimeout(() => {
        passwordInput.style.animation = '';
        passwordInput.style.borderColor = '';
    }, 500);
}

// 触发安全警报
function triggerSecurityAlert() {
    // 记录安全事件
    const securityEvents = JSON.parse(localStorage.getItem('securityEvents') || '[]');
    securityEvents.push({
        type: 'password_brute_force',
        timestamp: Date.now(),
        ip: 'local',
        attempts: passwordAttempts
    });
    localStorage.setItem('securityEvents', JSON.stringify(securityEvents));
    
    // 关闭模态框
    passwordModal.classList.remove('active');
    
    // 显示安全警报
    showSecurityAlert();
}

// 显示安全警报
function showSecurityAlert() {
    // 创建警报遮罩
    const alertOverlay = document.createElement('div');
    alertOverlay.className = 'modal-overlay active';
    alertOverlay.style.background = 'rgba(239, 68, 68, 0.9)';
    alertOverlay.style.zIndex = '9999';
    
    alertOverlay.innerHTML = `
        <div class="modal-content" style="max-width: 400px; text-align: center; background: white; padding: 40px 32px;">
            <div style="font-size: 64px; margin-bottom: 16px;">⚠️</div>
            <h2 style="color: #ef4444; margin-bottom: 16px;">安全警报</h2>
            <p style="color: #6b7280; margin-bottom: 24px;">检测到可疑入侵行为！</p>
            <p style="color: #6b7280; font-size: 14px;">系统将在 <span id="countdown" style="font-weight: bold; color: #ef4444;">10</span> 秒后关闭</p>
            <div style="margin-top: 24px;">
                <div style="width: 100%; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden;">
                    <div id="progressBar" style="height: 100%; background: #ef4444; width: 100%; transition: width 1s linear;"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(alertOverlay);
    
    // 倒计时
    let countdown = 10;
    const countdownEl = alertOverlay.querySelector('#countdown');
    const progressBar = alertOverlay.querySelector('#progressBar');
    
    const timer = setInterval(() => {
        countdown--;
        countdownEl.textContent = countdown;
        progressBar.style.width = (countdown / 10 * 100) + '%';
        
        if (countdown <= 0) {
            clearInterval(timer);
            // 执行关闭操作
            alertOverlay.remove();
            
            // 清除所有认证信息
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('authTime');
            
            // 显示提示并刷新页面
            showToast('系统已锁定，请稍后再试', 'error');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }, 1000);
}

// 检查认证状态
function checkAuthStatus() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const authTime = parseInt(localStorage.getItem('authTime') || '0');
    const now = Date.now();
    
    // 认证有效期：2小时
    const AUTH_DURATION = 2 * 60 * 60 * 1000;
    
    if (isAuthenticated && (now - authTime) < AUTH_DURATION) {
        // 如果用户已经认证且未过期，直接跳转到后台
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            window.location.href = 'admin.html';
        }
    } else {
        // 清除过期认证
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authTime');
        
        // 如果用户未认证，确保在首页
        if (window.location.pathname.endsWith('admin.html')) {
            window.location.href = 'index.html';
        }
    }
}

// 显示提示消息
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // 根据类型设置颜色
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#6366f1'
    };
    
    toast.style.borderLeftColor = colors[type] || colors.info;
    
    document.body.appendChild(toast);
    
    // 触发显示动画
    setTimeout(() => toast.classList.add('show'), 100);
    
    // 自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 添加 CSS 动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
    
    @keyframes numberPopup {
        0% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-40px);
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 导出函数供其他页面使用
window.SiteAuth = {
    checkAuthStatus,
    showToast,
    logout() {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authTime');
        window.location.href = 'index.html';
    }
};