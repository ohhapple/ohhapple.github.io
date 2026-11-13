// ===== 公共脚本：暗黑模式、侧边栏、搜索过滤、多语言、页面特有功能整合 =====
(function() {
    // ---------- 初始化全局翻译资源 ----------
    window.i18n = {
        zh: {
            // 公共部分
            'sidebar.title': '导航',
            'nav.home': '主页',
            'nav.docs': '文档',
            'nav.repos': '项目仓库',
            'nav.about': '关于',
            'footer.copyright': 'Copyright © 2026 ohhapple',
        },
        en: {
            'sidebar.title': 'Navigation',
            'nav.home': 'Home',
            'nav.docs': 'Docs',
            'nav.repos': 'Repositories',
            'nav.about': 'About',
            'footer.copyright': 'Copyright © 2026 ohhapple',
        }
    };

    // 自定义字体语言（仅用于字体类，翻译直接使用英文）
    const customLangs = ['CaerulaArbor', 'EndfieldByButan', 'FarNorthRunesRegular'];

    let currentLang = 'zh';

    // ---------- 多语言应用函数 ----------
    window.applyLanguage = function(lang) {
        currentLang = lang;

        // 确定使用的翻译数据：自定义语言直接使用英文，其他使用对应语言（后备英文）
        let translationData;
        if (customLangs.includes(lang)) {
            translationData = window.i18n.en;
        } else {
            translationData = window.i18n[lang] || window.i18n.en;
        }

        // 替换所有 data-i18n 元素的内容
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translationData[key] !== undefined) {
                el.innerHTML = translationData[key];
            }
        });

        // 处理自定义字体类
        document.body.classList.forEach(cls => {
            if (cls.startsWith('lang-')) document.body.classList.remove(cls);
        });
        if (customLangs.includes(lang)) {
            document.body.classList.add(`lang-${lang}`);
        }

        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    };

    // ---------- 暗黑模式 ----------
    function initDarkMode() {
        const darkSwitch = document.getElementById('darkSwitch');
        if (!darkSwitch) return;
        const storedTheme = localStorage.getItem('darkMode');
        if (storedTheme === 'enabled') {
            document.body.classList.add('dark');
            darkSwitch.checked = true;
        } else if (storedTheme === 'disabled') {
            document.body.classList.remove('dark');
            darkSwitch.checked = false;
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.body.classList.add('dark');
                darkSwitch.checked = true;
            }
        }
        darkSwitch.addEventListener('change', function(e) {
            if (this.checked) {
                document.body.classList.add('dark');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                document.body.classList.remove('dark');
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }

    // ---------- 侧边栏控制 ----------
    function initSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarClose = document.getElementById('sidebarClose');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const body = document.body;
        if (!sidebar || !sidebarToggle || !sidebarClose || !sidebarOverlay) return;
        function openSidebar() {
            sidebar.classList.add('open');
            body.classList.add('sidebar-open');
        }
        function closeSidebar() {
            sidebar.classList.remove('open');
            body.classList.remove('sidebar-open');
        }
        sidebarToggle.addEventListener('click', openSidebar);
        sidebarClose.addEventListener('click', closeSidebar);
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // ---------- 简约模式 ----------
    function initSimpleMode() {
        const simpleToggle = document.getElementById('simpleToggle');
        if (!simpleToggle) return;
        let storedSimple = localStorage.getItem('simpleMode');
        if (storedSimple === null) {
            storedSimple = 'enabled';
            localStorage.setItem('simpleMode', 'enabled');
        }
        if (storedSimple === 'enabled') {
            document.body.classList.add('simple-mode');
            simpleToggle.classList.add('active');
        }
        simpleToggle.addEventListener('click', function(e) {
            e.preventDefault();
            if (document.body.classList.contains('simple-mode')) {
                document.body.classList.remove('simple-mode');
                simpleToggle.classList.remove('active');
                localStorage.setItem('simpleMode', 'disabled');
            } else {
                document.body.classList.add('simple-mode');
                simpleToggle.classList.add('active');
                localStorage.setItem('simpleMode', 'enabled');
            }
        });
    }

    // ---------- 语言选择器 ----------
    function initLangSelector() {
        const langSelect = document.getElementById('langSelect');
        if (!langSelect) return;
        currentLang = localStorage.getItem('siteLanguage') || 'zh';
        langSelect.value = currentLang;
        applyLanguage(currentLang);
        langSelect.addEventListener('change', function(e) {
            const newLang = e.target.value;
            localStorage.setItem('siteLanguage', newLang);
            applyLanguage(newLang);
        });
    }

// ---------- 通用搜索（文档卡片）----------
    function initSearch() {
        document.addEventListener('input', function(e) {
            if (e.target.id === 'searchInput') {
                const query = e.target.value.toLowerCase().trim();
                const cards = document.querySelectorAll('.doc-card-link');
                cards.forEach(card => {
                    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                    const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
                    card.style.display = (title.includes(query) || desc.includes(query) || query === '') ? '' : 'none';
                });
                if (typeof window.updateVersionCount === 'function') {
                    window.updateVersionCount();
                }
            }
        });
    }

// ---------- 版本计数（全局）----------
    window.updateVersionCount = function() {
        const countSpan = document.getElementById('versionCount');
        if (!countSpan) return;
        const cards = document.querySelectorAll('.doc-card-link');
        const visibleCards = Array.from(cards).filter(card => card.style.display !== 'none');
        countSpan.textContent = visibleCards.length.toString(); // 转为字符串
    };

// ---------- CarpetPlus 文档页特有功能（规则目录高亮、搜索）----------
    window.initCarpetPlusFeatures = function() {
        const toc = document.querySelector('.rule-toc');
        if (!toc) return; // 不是 CarpetPlus 文档页

        // const ruleItems = document.querySelectorAll('.rule-item');
        const tocSearch = document.getElementById('tocSearch');

        function removeHighlight() {
            document.querySelectorAll('.rule-item').forEach(item => item.classList.remove('highlight'));
            document.querySelectorAll('.rule-toc a').forEach(link => link.classList.remove('active'));
        }

        function highlightRule(targetId) {
            removeHighlight();
            const targetItem = document.getElementById(targetId);
            if (targetItem) {
                targetItem.classList.add('highlight');
                const activeLink = document.querySelector(`.rule-toc a[href="#${targetId}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        }

        // 使用事件委托处理目录点击
        toc.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const elementRect = targetElement.getBoundingClientRect();
                const absoluteElementTop = elementRect.top + window.pageYOffset;
                const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
                window.scrollTo({ top: middle, behavior: 'smooth' });
                setTimeout(() => highlightRule(targetId), 300);
            }
        });

        // 点击其他地方取消高亮
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.rule-item') && !e.target.closest('.rule-toc a')) {
                removeHighlight();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') removeHighlight();
        });

        if (tocSearch) {
            tocSearch.addEventListener('input', function(e) {
                const query = e.target.value.toLowerCase().trim();
                document.querySelectorAll('.rule-item').forEach(item => {
                    const title = item.querySelector('h4')?.textContent.toLowerCase() || '';
                    const description = item.querySelector('p')?.textContent.toLowerCase() || '';
                    const categories = Array.from(item.querySelectorAll('.rule-category')).map(c => c.textContent.toLowerCase()).join(' ');
                    if (title.includes(query) || description.includes(query) || categories.includes(query) || query === '') {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }
    };



    // ---------- 公共布局渲染函数 ----------
    window.renderCommonLayout = function(currentPage = '', basePath = '') {
        const commonHTML = `
            <aside class="sidebar" id="sidebar">
                <div class="sidebar-header">
                    <h3><span data-i18n="sidebar.title">导航</span></h3>
                    <button class="sidebar-close" id="sidebarClose"><i class="fas fa-times"></i></button>
                </div>
                <ul class="sidebar-menu">
                    <li><a href="${basePath}simple.html" class="${currentPage === 'home' ? 'active' : ''}"><i class="fas fa-home"></i> <span data-i18n="nav.home">主页</span></a></li>
                    <li><a href="${basePath}document/document.html" class="${currentPage === 'docs' ? 'active' : ''}"><i class="fas fa-file-alt"></i> <span data-i18n="nav.docs">文档</span></a></li>
                    <li><a href="${basePath}document/repositories.html" class="${currentPage === 'repos' ? 'active' : ''}"><i class="fas fa-code-branch"></i> <span data-i18n="nav.repos">项目仓库</span></a></li>
                    <li><a href="${basePath}about/about.html" class="${currentPage === 'about' ? 'active' : ''}"><i class="fas fa-users"></i> <span data-i18n="nav.about">关于</span></a></li>
                </ul>
                <div class="sidebar-footer">
                    <a href="https://github.com/ohhapple" target="_blank"><i class="fab fa-github"></i></a>
                </div>
                <div class="footer-copy">
                    <span data-i18n="footer.copyright">Copyright © 2026 ohhapple</span>
                </div>
            </aside>
            <div class="sidebar-overlay" id="sidebarOverlay"></div>

            <div class="wrapper">
                <div class="container">
                    <nav class="navbar">
                        <div class="navbar-left">
                            <div class="sidebar-toggle" id="sidebarToggle">
                                <i class="fas fa-bars"></i>
                            </div>
                            <div class="logo">
                                <i class="fas fa-book-open"></i>
                                <span>ohhapple<span style="font-weight:300; color:#5d71b0;">•</span>docs</span>
                            </div>
                        </div>
                        <div class="nav-links">
                            <a href="${basePath}simple.html" class="${currentPage === 'home' ? 'active' : ''}"><span data-i18n="nav.home">主页</span></a>
                            <a href="${basePath}document/document.html" class="${currentPage === 'docs' ? 'active' : ''}"><span data-i18n="nav.docs">文档</span></a>
                            <a href="${basePath}document/repositories.html" class="${currentPage === 'repos' ? 'active' : ''}"><span data-i18n="nav.repos">项目仓库</span></a>
                        </div>
                        <div class="theme-toggle">
                            <label class="switch">
                                <input type="checkbox" id="darkSwitch">
                                <span class="slider round">
                                    <i class="fas fa-sun"></i>
                                    <i class="fas fa-moon"></i>
                                </span>
                            </label>
                        </div>
                        <div class="simple-toggle" id="simpleToggle">
                            <i class="fas fa-image"></i>
                        </div>
                        <div class="lang-selector">
                            <select id="langSelect">
                                <option value="zh">中文</option>
                                <option value="en">English</option>
                                <option value="CaerulaArbor">海嗣语言</option>
                                <option value="EndfieldByButan">萨卡兹古文字</option>
                                <option value="FarNorthRunesRegular">萨米文字刻写体</option>
                            </select>
                        </div>
                        <div class="navbar-github">
                            <a href="https://github.com/ohhapple" target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>
                        </div>
                    </nav>

                    <main id="page-content">
                        <!-- 页面独有内容将插入此处 -->
                    </main>
                </div>

                <div class="container">
                    <footer class="footer">
                        <div class="footer-content">
                            <div class="footer-copy">
                                <span data-i18n="footer.copyright">Copyright © 2026 ohhapple</span>  <i class="fas fa-heart"></i> <i class="fas fa-mug-saucer"></i>
                            </div>
                            <div class="footer-social">
                                <a href="https://github.com/ohhapple" target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', commonHTML);

        // 初始化所有功能
        initDarkMode();
        initSidebar();
        initSimpleMode();
        initLangSelector();
        initSearch();
        initCarpetPlusFeatures();  // 自动判断页面是否包含规则目录
        updateVersionCount();       // 初始化版本计数（如果有）
    };
})();