/**
 * App Store 宣传图生成器
 * 
 * 核心功能：
 * - 设计画布: 1080 × 1920
 * - 导出尺寸: 1242 × 2688 (iPhone 6.5")
 * - 导出时重新渲染（保持比例一致）
 */

// ========== 模板配置 ==========
const TEMPLATES = {
    // ===== 浅色系 =====
    'minimal-light': {
        name: '极简白',
        background: { type: 'solid', color: '#ffffff' },
        title: { color: '#1d1d1f', fontWeight: '800', shadow: false },
        device: { frameColor: '#1d1d1f', shadowColor: 'rgba(0,0,0,0.12)', shadowBlur: 80, shadowOffsetY: 30 },
        decorations: [
            { type: 'circle', x: 0.85, y: 0.12, size: 300, color: 'rgba(99,102,241,0.06)', blur: 60 },
            { type: 'circle', x: 0.15, y: 0.88, size: 250, color: 'rgba(139,92,246,0.05)', blur: 50 }
        ]
    },
    'cream': {
        name: '奶油米',
        background: { type: 'solid', color: '#faf8f5' },
        title: { color: '#3d3d3d', fontWeight: '800', shadow: false },
        device: { frameColor: '#2d2d2d', shadowColor: 'rgba(0,0,0,0.1)', shadowBlur: 70, shadowOffsetY: 25 },
        decorations: [
            { type: 'circle', x: 0.9, y: 0.15, size: 350, color: 'rgba(255,200,150,0.12)', blur: 70 },
            { type: 'circle', x: 0.1, y: 0.85, size: 280, color: 'rgba(200,180,160,0.1)', blur: 55 }
        ]
    },

    // ===== 深色系 =====
    'dark-focus': {
        name: '深邃黑',
        background: { type: 'gradient', colors: ['#1a1a2e', '#16213e', '#0f3460'] },
        title: { color: '#ffffff', fontWeight: '800', shadow: true },
        device: { frameColor: '#2d2d3a', shadowColor: 'rgba(0,0,0,0.5)', shadowBlur: 100, shadowOffsetY: 40 },
        decorations: [
            { type: 'circle', x: 0.9, y: 0.15, size: 400, color: 'rgba(99,102,241,0.12)', blur: 80 },
            { type: 'circle', x: 0.1, y: 0.85, size: 350, color: 'rgba(139,92,246,0.1)', blur: 70 }
        ]
    },
    'midnight': {
        name: '午夜蓝',
        background: { type: 'gradient', colors: ['#0c1445', '#1a237e', '#283593'] },
        title: { color: '#ffffff', fontWeight: '800', shadow: true },
        device: { frameColor: '#1a1a2e', shadowColor: 'rgba(0,0,0,0.45)', shadowBlur: 90, shadowOffsetY: 35 },
        decorations: [
            { type: 'circle', x: 0.85, y: 0.1, size: 380, color: 'rgba(66,165,245,0.15)', blur: 75 },
            { type: 'circle', x: 0.15, y: 0.9, size: 300, color: 'rgba(126,87,194,0.12)', blur: 60 }
        ]
    },
    'carbon': {
        name: '碳黑',
        background: { type: 'gradient', colors: ['#232526', '#414345', '#232526'] },
        title: { color: '#ffffff', fontWeight: '800', shadow: true },
        device: { frameColor: '#1a1a1a', shadowColor: 'rgba(0,0,0,0.6)', shadowBlur: 100, shadowOffsetY: 45 },
        decorations: [
            { type: 'circle', x: 0.88, y: 0.12, size: 320, color: 'rgba(255,255,255,0.04)', blur: 65 }
        ]
    },

    // ===== 渐变色系 =====
    'soft-gradient': {
        name: '青粉渐变',
        background: { type: 'gradient', colors: ['#a8edea', '#fed6e3'] },
        title: { color: '#2d3748', fontWeight: '800', shadow: false },
        device: { frameColor: '#ffffff', shadowColor: 'rgba(0,0,0,0.18)', shadowBlur: 90, shadowOffsetY: 35 },
        decorations: [
            { type: 'circle', x: 0.88, y: 0.1, size: 320, color: 'rgba(255,255,255,0.4)', blur: 65 },
            { type: 'circle', x: 0.12, y: 0.9, size: 280, color: 'rgba(255,255,255,0.35)', blur: 55 }
        ]
    },
    'aurora': {
        name: '极光紫',
        background: { type: 'gradient', colors: ['#667eea', '#764ba2'] },
        title: { color: '#ffffff', fontWeight: '800', shadow: true },
        device: { frameColor: '#1d1d1f', shadowColor: 'rgba(0,0,0,0.35)', shadowBlur: 100, shadowOffsetY: 40 },
        decorations: [
            { type: 'circle', x: 0.85, y: 0.15, size: 350, color: 'rgba(255,255,255,0.1)', blur: 70 },
            { type: 'circle', x: 0.15, y: 0.85, size: 280, color: 'rgba(255,255,255,0.08)', blur: 55 }
        ]
    },
    'sunset': {
        name: '日落橙',
        background: { type: 'gradient', colors: ['#fa709a', '#fee140'] },
        title: { color: '#ffffff', fontWeight: '800', shadow: true },
        device: { frameColor: '#ffffff', shadowColor: 'rgba(0,0,0,0.25)', shadowBlur: 95, shadowOffsetY: 38 },
        decorations: [
            { type: 'circle', x: 0.9, y: 0.12, size: 380, color: 'rgba(255,255,255,0.2)', blur: 75 },
            { type: 'circle', x: 0.1, y: 0.88, size: 300, color: 'rgba(255,255,255,0.15)', blur: 60 }
        ]
    },
    'ocean': {
        name: '海洋蓝',
        background: { type: 'gradient', colors: ['#4facfe', '#00f2fe'] },
        title: { color: '#ffffff', fontWeight: '800', shadow: true },
        device: { frameColor: '#ffffff', shadowColor: 'rgba(0,0,0,0.22)', shadowBlur: 90, shadowOffsetY: 35 },
        decorations: [
            { type: 'circle', x: 0.15, y: 0.15, size: 340, color: 'rgba(255,255,255,0.18)', blur: 68 },
            { type: 'circle', x: 0.88, y: 0.85, size: 280, color: 'rgba(255,255,255,0.14)', blur: 55 }
        ]
    },
    'forest': {
        name: '森林绿',
        background: { type: 'gradient', colors: ['#56ab2f', '#a8e063'] },
        title: { color: '#ffffff', fontWeight: '800', shadow: true },
        device: { frameColor: '#ffffff', shadowColor: 'rgba(0,0,0,0.2)', shadowBlur: 85, shadowOffsetY: 32 },
        decorations: [
            { type: 'circle', x: 0.12, y: 0.12, size: 300, color: 'rgba(255,255,255,0.2)', blur: 60 },
            { type: 'circle', x: 0.88, y: 0.88, size: 260, color: 'rgba(255,255,255,0.15)', blur: 50 }
        ]
    },
    'peach': {
        name: '蜜桃粉',
        background: { type: 'gradient', colors: ['#ffecd2', '#fcb69f'] },
        title: { color: '#5a3e36', fontWeight: '800', shadow: false },
        device: { frameColor: '#ffffff', shadowColor: 'rgba(100,60,40,0.15)', shadowBlur: 80, shadowOffsetY: 30 },
        decorations: [
            { type: 'circle', x: 0.88, y: 0.16, size: 320, color: 'rgba(255,255,255,0.4)', blur: 65 },
            { type: 'circle', x: 0.16, y: 0.84, size: 260, color: 'rgba(255,255,255,0.35)', blur: 52 }
        ]
    },
    'lavender': {
        name: '薰衣草',
        background: { type: 'gradient', colors: ['#e0c3fc', '#8ec5fc'] },
        title: { color: '#3d3d5c', fontWeight: '800', shadow: false },
        device: { frameColor: '#2d2d3a', shadowColor: 'rgba(60,40,100,0.18)', shadowBlur: 85, shadowOffsetY: 32 },
        decorations: [
            { type: 'circle', x: 0.85, y: 0.1, size: 340, color: 'rgba(255,255,255,0.35)', blur: 68 },
            { type: 'circle', x: 0.15, y: 0.9, size: 280, color: 'rgba(255,255,255,0.28)', blur: 55 }
        ]
    }
};

// ========== 画布尺寸常量 ==========
const DESIGN_WIDTH = 1080;
const DESIGN_HEIGHT = 1920;
const EXPORT_WIDTH = 1242;
const EXPORT_HEIGHT = 2688;

// ========== 应用状态 ==========
const state = {
    currentTemplate: 'minimal-light',
    uploadedImage: null,
    titleText: '',
    deviceOrientation: 'portrait', // portrait, landscape, tilted
    settings: {
        titleSize: 88,
        screenshotScale: 88,
        cornerRadius: 50,
        bottomOverflow: 8
    }
};

// ========== DOM 元素引用 ==========
const elements = {
    canvas: document.getElementById('mainCanvas'),
    fileInput: document.getElementById('fileInput'),
    uploadZone: document.getElementById('uploadZone'),
    uploadedPreview: document.getElementById('uploadedPreview'),
    previewThumb: document.getElementById('previewThumb'),
    removeBtn: document.getElementById('removeBtn'),
    titleInput: document.getElementById('titleInput'),
    charCount: document.getElementById('charCount'),
    templateBtns: document.querySelectorAll('.template-btn'),
    orientationBtns: document.querySelectorAll('.orientation-btn'),
    toggleSettings: document.getElementById('toggleSettings'),
    settingsPanel: document.getElementById('settingsPanel'),
    titleSizeRange: document.getElementById('titleSizeRange'),
    titleSizeVal: document.getElementById('titleSizeVal'),
    screenshotScale: document.getElementById('screenshotScale'),
    screenshotScaleVal: document.getElementById('screenshotScaleVal'),
    cornerRadius: document.getElementById('cornerRadius'),
    cornerRadiusVal: document.getElementById('cornerRadiusVal'),
    bottomOverflow: document.getElementById('bottomOverflow'),
    bottomOverflowVal: document.getElementById('bottomOverflowVal'),
    exportBtn: document.getElementById('exportBtn'),
    resetBtn: document.getElementById('resetBtn')
};

const ctx = elements.canvas.getContext('2d');

// ========== 初始化 ==========
function init() {
    bindEvents();
    render();
}

function bindEvents() {
    // 模板切换
    elements.templateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.templateBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentTemplate = btn.dataset.template;
            render();
        });
    });

    // 设备方向切换
    elements.orientationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.orientationBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.deviceOrientation = btn.dataset.orientation;
            render();
        });
    });

    // 文件上传
    elements.fileInput.addEventListener('change', handleFileSelect);
    elements.removeBtn.addEventListener('click', handleRemoveImage);
    
    // 拖拽上传
    elements.uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.uploadZone.classList.add('drag-over');
    });
    elements.uploadZone.addEventListener('dragleave', () => {
        elements.uploadZone.classList.remove('drag-over');
    });
    elements.uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.uploadZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            loadImage(file);
        }
    });

    // 标题输入
    elements.titleInput.addEventListener('input', (e) => {
        state.titleText = e.target.value;
        elements.charCount.textContent = e.target.value.length;
        render();
    });

    // 设置面板切换
    elements.toggleSettings.addEventListener('click', () => {
        const hidden = elements.settingsPanel.style.display === 'none';
        elements.settingsPanel.style.display = hidden ? 'flex' : 'none';
        elements.toggleSettings.textContent = hidden ? '收起' : '展开';
    });

    // 设置滑块
    elements.titleSizeRange.addEventListener('input', (e) => {
        state.settings.titleSize = parseInt(e.target.value);
        elements.titleSizeVal.textContent = e.target.value + 'px';
        render();
    });

    elements.screenshotScale.addEventListener('input', (e) => {
        state.settings.screenshotScale = parseInt(e.target.value);
        elements.screenshotScaleVal.textContent = e.target.value + '%';
        render();
    });

    elements.cornerRadius.addEventListener('input', (e) => {
        state.settings.cornerRadius = parseInt(e.target.value);
        elements.cornerRadiusVal.textContent = e.target.value + 'px';
        render();
    });

    elements.bottomOverflow.addEventListener('input', (e) => {
        state.settings.bottomOverflow = parseInt(e.target.value);
        elements.bottomOverflowVal.textContent = e.target.value + '%';
        render();
    });

    // 导出按钮
    elements.exportBtn.addEventListener('click', handleExport);

    // 重置按钮
    elements.resetBtn.addEventListener('click', handleReset);
}

// ========== 文件处理 ==========
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) loadImage(file);
}

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            state.uploadedImage = img;
            elements.previewThumb.src = e.target.result;
            elements.uploadZone.style.display = 'none';
            elements.uploadedPreview.style.display = 'block';
            render();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function handleRemoveImage() {
    state.uploadedImage = null;
    elements.fileInput.value = '';
    elements.uploadZone.style.display = 'block';
    elements.uploadedPreview.style.display = 'none';
    render();
}

// ========== 重置设置 ==========
function handleReset() {
    state.settings = {
        titleSize: 88,
        screenshotScale: 88,
        cornerRadius: 50,
        bottomOverflow: 8
    };

    elements.titleSizeRange.value = 88;
    elements.titleSizeVal.textContent = '88px';
    elements.screenshotScale.value = 88;
    elements.screenshotScaleVal.textContent = '88%';
    elements.cornerRadius.value = 50;
    elements.cornerRadiusVal.textContent = '50px';
    elements.bottomOverflow.value = 8;
    elements.bottomOverflowVal.textContent = '8%';

    render();
}

// ========== 核心渲染函数 ==========
function renderToCanvas(context, width, height) {
    const template = TEMPLATES[state.currentTemplate];
    const scale = width / DESIGN_WIDTH;
    
    context.clearRect(0, 0, width, height);
    
    // 1. 绘制背景
    drawBackground(context, template, width, height);
    
    // 2. 绘制装饰元素
    if (template.decorations) {
        drawDecorations(context, template, width, height);
    }
    
    // 3. 绘制手机截图（带边框）
    if (state.uploadedImage) {
        drawRealisticDevice(context, template, width, height, scale);
    }
    
    // 4. 绘制标题
    if (state.titleText) {
        drawTitle(context, template, width, height, scale);
    }
}

function render() {
    renderToCanvas(ctx, DESIGN_WIDTH, DESIGN_HEIGHT);
}

// ========== 背景绘制 ==========
function drawBackground(context, template, width, height) {
    const bg = template.background;

    if (bg.type === 'solid') {
        context.fillStyle = bg.color;
        context.fillRect(0, 0, width, height);
    } else if (bg.type === 'gradient') {
        const gradient = context.createLinearGradient(0, 0, width * 0.3, height);
        bg.colors.forEach((color, i) => {
            gradient.addColorStop(i / (bg.colors.length - 1), color);
        });
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
    }
}

// ========== 装饰元素绘制 ==========
function drawDecorations(context, template, width, height) {
    template.decorations.forEach(deco => {
        context.save();
        
        const x = width * deco.x;
        const y = height * deco.y;
        const size = deco.size * (width / DESIGN_WIDTH);
        
        if (deco.blur) {
            context.filter = `blur(${deco.blur * (width / DESIGN_WIDTH)}px)`;
        }
        
        if (deco.type === 'circle') {
            context.beginPath();
            context.arc(x, y, size / 2, 0, Math.PI * 2);
            context.fillStyle = deco.color;
            context.fill();
        }

        context.restore();
    });
}

// ========== 标题绘制 ==========
function drawTitle(context, template, width, height, scale) {
    const config = template.title;
    const fontSize = state.settings.titleSize * scale;
    const maxWidth = width * 0.9;

    context.fillStyle = config.color;
    context.font = `${config.fontWeight} ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'top';

    if (config.shadow) {
        context.shadowColor = 'rgba(0, 0, 0, 0.3)';
        context.shadowBlur = 20 * scale;
        context.shadowOffsetY = 4 * scale;
    }

    const lines = wrapText(context, state.titleText, maxWidth, 2);
    const lineHeight = fontSize * 1.15;
    const startY = 100 * scale;

    lines.forEach((line, index) => {
        context.fillText(line, width / 2, startY + index * lineHeight);
    });

    context.shadowColor = 'transparent';
    context.shadowBlur = 0;
    context.shadowOffsetY = 0;
}

function wrapText(context, text, maxWidth, maxLines) {
    const chars = text.split('');
    const lines = [];
    let currentLine = '';
    
    for (let i = 0; i < chars.length; i++) {
        const testLine = currentLine + chars[i];
        if (context.measureText(testLine).width > maxWidth && currentLine !== '') {
            lines.push(currentLine);
            currentLine = chars[i];
            if (lines.length >= maxLines) break;
        } else {
            currentLine = testLine;
        }
    }
    
    if (currentLine && lines.length < maxLines) {
        lines.push(currentLine);
    }
    
    return lines;
}

// ========== 真实感 iPhone 设备绘制 ==========
function drawRealisticDevice(context, template, canvasWidth, canvasHeight, scale) {
    const img = state.uploadedImage;
    const deviceConfig = template.device;
    const orientation = state.deviceOrientation;
    
    // 基础截图尺寸计算
    const baseScale = state.settings.screenshotScale / 100;
    let screenshotWidth, screenshotHeight;
    
    const imgAspectRatio = img.width / img.height;
    
    if (orientation === 'landscape') {
        // 横屏模式
        screenshotHeight = canvasWidth * baseScale * 0.42;
        screenshotWidth = screenshotHeight / imgAspectRatio;
    } else {
        // 竖屏和倾斜模式
        screenshotWidth = canvasWidth * baseScale;
        screenshotHeight = screenshotWidth / imgAspectRatio;
        
        const maxHeight = canvasHeight * 0.82;
        if (screenshotHeight > maxHeight) {
            screenshotHeight = maxHeight;
            screenshotWidth = screenshotHeight * imgAspectRatio;
        }
    }

    // iPhone 15 Pro 边框参数
    const frameThickness = 14 * scale;
    const innerBezel = 3 * scale; // 内部黑边
    const cornerRadius = state.settings.cornerRadius * scale;
    const outerCornerRadius = cornerRadius + frameThickness + 4 * scale;

    // 设备总尺寸
    const deviceWidth = screenshotWidth + (frameThickness + innerBezel) * 2;
    const deviceHeight = screenshotHeight + (frameThickness + innerBezel) * 2;

    // 位置计算
    const overflowAmount = deviceHeight * (state.settings.bottomOverflow / 100);
    let centerX = canvasWidth / 2;
    let centerY = canvasHeight - deviceHeight / 2 + overflowAmount;

    context.save();
    context.translate(centerX, centerY);

    // 根据方向旋转
    let rotation = 0;
    if (orientation === 'landscape') {
        rotation = -90 * Math.PI / 180;
    } else if (orientation === 'tilted') {
        rotation = -15 * Math.PI / 180;
    }
    context.rotate(rotation);

    // ========== 绘制阴影 ==========
    context.shadowColor = deviceConfig.shadowColor;
    context.shadowBlur = deviceConfig.shadowBlur * scale;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = deviceConfig.shadowOffsetY * scale;

    // ========== 绘制外框主体 ==========
    const isDarkFrame = isColorDark(deviceConfig.frameColor);
    
    // 金属边框渐变
    const frameGradient = context.createLinearGradient(
        -deviceWidth / 2, -deviceHeight / 2,
        deviceWidth / 2, deviceHeight / 2
    );
    
    if (isDarkFrame) {
        frameGradient.addColorStop(0, '#3a3a3c');
        frameGradient.addColorStop(0.3, '#1d1d1f');
        frameGradient.addColorStop(0.5, '#2c2c2e');
        frameGradient.addColorStop(0.7, '#1d1d1f');
        frameGradient.addColorStop(1, '#3a3a3c');
    } else {
        frameGradient.addColorStop(0, '#f5f5f7');
        frameGradient.addColorStop(0.3, '#e8e8ed');
        frameGradient.addColorStop(0.5, '#f5f5f7');
        frameGradient.addColorStop(0.7, '#e8e8ed');
        frameGradient.addColorStop(1, '#f5f5f7');
    }
    
    context.fillStyle = frameGradient;
    drawRoundedRect(context, -deviceWidth / 2, -deviceHeight / 2, deviceWidth, deviceHeight, outerCornerRadius);
    context.fill();

    // 重置阴影
    context.shadowColor = 'transparent';
    context.shadowBlur = 0;
    context.shadowOffsetY = 0;

    // ========== 边框高光 ==========
    context.strokeStyle = isDarkFrame ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)';
    context.lineWidth = 1 * scale;
    drawRoundedRect(context, -deviceWidth / 2 + 1, -deviceHeight / 2 + 1, deviceWidth - 2, deviceHeight - 2, outerCornerRadius - 1);
    context.stroke();

    // ========== 绘制内部黑色边框 ==========
    const innerFrameX = -deviceWidth / 2 + frameThickness;
    const innerFrameY = -deviceHeight / 2 + frameThickness;
    const innerFrameW = deviceWidth - frameThickness * 2;
    const innerFrameH = deviceHeight - frameThickness * 2;
    
    context.fillStyle = '#000000';
    drawRoundedRect(context, innerFrameX, innerFrameY, innerFrameW, innerFrameH, cornerRadius + innerBezel + 2 * scale);
    context.fill();

    // ========== 绘制屏幕区域 ==========
    const screenX = -screenshotWidth / 2;
    const screenY = -screenshotHeight / 2;

    context.save();
    drawRoundedRect(context, screenX, screenY, screenshotWidth, screenshotHeight, cornerRadius);
    context.clip();
    context.drawImage(img, screenX, screenY, screenshotWidth, screenshotHeight);
    context.restore();

    // ========== 绘制灵动岛 (Dynamic Island) ==========
    const islandWidth = screenshotWidth * 0.32;
    const islandHeight = 36 * scale;
    const islandX = -islandWidth / 2;
    const islandY = screenY + 14 * scale;

    // 灵动岛背景
    context.fillStyle = '#000000';
    drawPill(context, islandX, islandY, islandWidth, islandHeight);
    context.fill();

    // 灵动岛内的摄像头
    const cameraSize = 12 * scale;
    const cameraX = islandX + islandWidth - cameraSize - 10 * scale;
    const cameraY = islandY + (islandHeight - cameraSize) / 2;
    
    // 摄像头外圈
    context.fillStyle = '#1a1a1e';
    context.beginPath();
    context.arc(cameraX + cameraSize / 2, cameraY + cameraSize / 2, cameraSize / 2, 0, Math.PI * 2);
    context.fill();
    
    // 摄像头镜头
    context.fillStyle = '#0d47a1';
    context.beginPath();
    context.arc(cameraX + cameraSize / 2, cameraY + cameraSize / 2, cameraSize / 3.5, 0, Math.PI * 2);
    context.fill();
    
    // 镜头高光
    context.fillStyle = 'rgba(255,255,255,0.3)';
    context.beginPath();
    context.arc(cameraX + cameraSize / 2 - 1 * scale, cameraY + cameraSize / 2 - 1 * scale, cameraSize / 6, 0, Math.PI * 2);
    context.fill();

    // ========== 绘制侧边按钮 ==========
    const btnColor = isDarkFrame ? '#2c2c2e' : '#d1d1d6';
    const btnHighlight = isDarkFrame ? '#4a4a4c' : '#ffffff';
    
    // 右侧 - 电源键
    const powerBtnWidth = 5 * scale;
    const powerBtnHeight = 70 * scale;
    const powerBtnX = deviceWidth / 2 - 1 * scale;
    const powerBtnY = -deviceHeight * 0.15;
    
    context.fillStyle = btnColor;
    drawRoundedRect(context, powerBtnX, powerBtnY, powerBtnWidth, powerBtnHeight, 2 * scale);
    context.fill();
    
    // 电源键高光
    context.fillStyle = btnHighlight;
    context.fillRect(powerBtnX, powerBtnY + 2 * scale, 1 * scale, powerBtnHeight - 4 * scale);

    // 左侧 - 静音开关
    const muteBtnWidth = 5 * scale;
    const muteBtnHeight = 32 * scale;
    const muteBtnX = -deviceWidth / 2 - muteBtnWidth + 1 * scale;
    const muteBtnY = -deviceHeight * 0.32;
    
    context.fillStyle = btnColor;
    drawRoundedRect(context, muteBtnX, muteBtnY, muteBtnWidth, muteBtnHeight, 2 * scale);
    context.fill();

    // 左侧 - 音量加
    const volUpY = -deviceHeight * 0.22;
    context.fillStyle = btnColor;
    drawRoundedRect(context, muteBtnX, volUpY, muteBtnWidth, 55 * scale, 2 * scale);
    context.fill();
    
    // 音量加高光
    context.fillStyle = btnHighlight;
    context.fillRect(muteBtnX + muteBtnWidth - 1 * scale, volUpY + 2 * scale, 1 * scale, 51 * scale);

    // 左侧 - 音量减
    const volDownY = -deviceHeight * 0.22 + 65 * scale;
    context.fillStyle = btnColor;
    drawRoundedRect(context, muteBtnX, volDownY, muteBtnWidth, 55 * scale, 2 * scale);
    context.fill();
    
    // 音量减高光
    context.fillStyle = btnHighlight;
    context.fillRect(muteBtnX + muteBtnWidth - 1 * scale, volDownY + 2 * scale, 1 * scale, 51 * scale);

    // ========== 屏幕边缘反光 ==========
    context.strokeStyle = 'rgba(255,255,255,0.05)';
    context.lineWidth = 2 * scale;
    drawRoundedRect(context, screenX + 1, screenY + 1, screenshotWidth - 2, screenshotHeight - 2, cornerRadius - 1);
    context.stroke();

    context.restore();
}

// 判断颜色是否为深色
function isColorDark(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return true;
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness < 128;
}

// 绘制药丸形状
function drawPill(context, x, y, width, height) {
    const radius = height / 2;
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.arc(x + width - radius, y + radius, radius, -Math.PI / 2, Math.PI / 2);
    context.lineTo(x + radius, y + height);
    context.arc(x + radius, y + radius, radius, Math.PI / 2, -Math.PI / 2);
    context.closePath();
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function drawRoundedRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    
    context.beginPath();
    context.moveTo(x + r, y);
    context.lineTo(x + width - r, y);
    context.quadraticCurveTo(x + width, y, x + width, y + r);
    context.lineTo(x + width, y + height - r);
    context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    context.lineTo(x + r, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - r);
    context.lineTo(x, y + r);
    context.quadraticCurveTo(x, y, x + r, y);
    context.closePath();
}

// ========== 导出功能 ==========
function handleExport() {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = EXPORT_WIDTH;
    exportCanvas.height = EXPORT_HEIGHT;
    const exportCtx = exportCanvas.getContext('2d');
    
    renderToCanvas(exportCtx, EXPORT_WIDTH, EXPORT_HEIGHT);

    exportCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'appstore-6.5.png';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }, 'image/png', 1.0);
}

// ========== 启动 ==========
init();
