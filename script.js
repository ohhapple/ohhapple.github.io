// ===== 公共脚本：暗黑模式、侧边栏、搜索过滤 =====
(function() {
    // 暗黑模式切换
    const darkSwitch = document.getElementById('darkSwitch');
    if (darkSwitch) {
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

    // 侧边栏控制
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const body = document.body;

    if (sidebar && sidebarToggle && sidebarClose && sidebarOverlay) {
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

    // 搜索过滤功能（仅在存在搜索框的页面生效）
    const searchInput = document.getElementById('searchInput');
    const cards = document.querySelectorAll('.doc-card-link');
    if (searchInput && cards.length > 0) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase().trim();
            cards.forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
                if (title.includes(query) || desc.includes(query) || query === '') {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
})();

// 简约模式切换
const simpleToggle = document.getElementById('simpleToggle');
if (simpleToggle) {
    let storedSimple = localStorage.getItem('simpleMode');
    if (storedSimple === null) {
        // 首次访问，默认开启简约模式
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

// ===== CarpetPlus 文档页特有功能 =====
(function() {
    const toc = document.querySelector('.rule-toc');
    if (!toc) return;

    const ruleItems = document.querySelectorAll('.rule-item');
    const tocLinks = document.querySelectorAll('.rule-toc a');
    const tocSearch = document.getElementById('tocSearch');

    function removeHighlight() {
        ruleItems.forEach(item => item.classList.remove('highlight'));
        tocLinks.forEach(link => link.classList.remove('active'));
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

    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const elementRect = targetElement.getBoundingClientRect();
                const absoluteElementTop = elementRect.top + window.pageYOffset;
                const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
                window.scrollTo({ top: middle, behavior: 'smooth' });

                setTimeout(() => {
                    highlightRule(targetId);
                }, 300);
            }
        });
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.rule-item') && !e.target.closest('.rule-toc a')) {
            removeHighlight();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            removeHighlight();
        }
    });

    if (tocSearch) {
        tocSearch.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase().trim();
            ruleItems.forEach(item => {
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
})();