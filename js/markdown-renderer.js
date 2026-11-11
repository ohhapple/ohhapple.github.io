(function () {
    'use strict';

    const CONTENT_ROOT = 'content/';
    const CONTENT_LOCALES = {
        zh: 'zhcn',
        zhcn: 'zhcn',
        en: 'enus',
        enus: 'enus',
        CaerulaArbor: 'enus',
        EndfieldByButan: 'enus',
        FarNorthRunesRegular: 'enus'
    };

    const documentCache = new Map();
    let contentManifestPromise;
    let githubCatalogPromise;
    let loadSequence = 0;
    let initialized = false;

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function unquote(value) {
        const trimmed = String(value || '').trim();
        if (
            (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
            (trimmed.startsWith("'") && trimmed.endsWith("'"))
        ) {
            return trimmed.slice(1, -1);
        }
        return trimmed;
    }

    function parseFrontMatter(source) {
        const normalized = String(source || '').replace(/\r\n?/g, '\n');
        if (!normalized.startsWith('---\n')) {
            return { metadata: {}, body: normalized };
        }

        const end = normalized.indexOf('\n---', 4);
        if (end === -1) {
            return { metadata: {}, body: normalized };
        }

        const metadata = {};
        normalized
            .slice(4, end)
            .split('\n')
            .forEach(line => {
                const match = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
                if (match) {
                    metadata[match[1]] = unquote(match[2]);
                }
            });

        let bodyStart = normalized.indexOf('\n', end + 4);
        bodyStart = bodyStart === -1 ? normalized.length : bodyStart + 1;
        return { metadata, body: normalized.slice(bodyStart) };
    }

    function parseFields(lines) {
        const fields = {};
        lines.forEach(line => {
            const match = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
            if (match) {
                fields[match[1]] = unquote(match[2]);
            }
        });
        return fields;
    }

    function deriveDocument(docId, source, locale) {
        const parsed = parseFrontMatter(source);
        const metadata = { ...parsed.metadata };
        const hadFrontMatter = /^\uFEFF?---\r?\n/.test(String(source || ''));
        const lines = parsed.body.replace(/\r\n?/g, '\n').split('\n');
        let titleLineIndex = -1;

        if (!metadata.title) {
            titleLineIndex = lines.findIndex(line => /^#\s+/.test(line));
            if (titleLineIndex !== -1) {
                metadata.title = lines[titleLineIndex].replace(/^#\s+/, '').trim();
                lines[titleLineIndex] = null;
            }
        }

        if (!metadata.description) {
            const paragraphStart = lines.findIndex(line => (
                line !== null &&
                line.trim() &&
                !/^#{1,6}\s|^:::\s*[a-z-]+|^```/.test(line)
            ));
            if (paragraphStart !== -1) {
                const paragraph = [lines[paragraphStart].replace(/^-\s+/, '').trim()];
                if (!hadFrontMatter) lines[paragraphStart] = null;
                let index = paragraphStart + 1;
                while (
                    index < lines.length &&
                    lines[index] !== null &&
                    lines[index].trim() &&
                    !/^#{1,6}\s|^:::\s*[a-z-]+|^```|^-\s+/.test(lines[index])
                ) {
                    paragraph.push(lines[index].trim());
                    if (!hadFrontMatter) lines[index] = null;
                    index += 1;
                }
                metadata.description = paragraph.join(' ');
            }
        }

        const pathParts = String(docId || '').split('/');
        const isNested = pathParts.length > 1;
        const isIndexDocument = isNested && pathParts[pathParts.length - 1] === 'index';

        if (!metadata.layout) {
            if (isIndexDocument) {
                metadata.layout = 'collection';
                metadata.pageType = metadata.pageType || 'project';
                metadata.featured = metadata.featured || 'true';
                metadata.back = metadata.back || 'docs';
                metadata.backLabel = metadata.backLabel || (
                    locale === 'zhcn' ? '返回文档索引' : 'Back to Docs Index'
                );
                metadata.cardTitle = metadata.cardTitle || metadata.title;
                metadata.cardDescription = metadata.cardDescription || metadata.description;
            } else if (isNested || !/^:::\s+/m.test(parsed.body)) {
                metadata.layout = 'article';
            } else {
                metadata.layout = 'custom';
            }
        }

        if (isNested && !metadata.collection && (!isIndexDocument || metadata.layout === 'collection')) {
            metadata.collection = pathParts[0];
        }

        return {
            metadata,
            body: lines.filter(line => line !== null).join('\n'),
            titleWasDerived: titleLineIndex !== -1
        };
    }

    function normalizeDocId(docId) {
        const value = String(docId || '').trim().replace(/^\/+|\/+$/g, '');
        if (
            !value ||
            !/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(value) ||
            value.split('/').some(segment => segment === '..' || segment === '.')
        ) {
            throw new Error('无效的文档路径');
        }
        return value.replace(/\.md$/i, '');
    }

    function resolveDocHref(href, currentDocId) {
        const raw = String(href || '').trim();
        if (raw.startsWith('doc:')) {
            const docId = normalizeDocId(raw.slice(4));
            return `simple.html?doc=${encodeURIComponent(docId)}`;
        }

        if (/^[^:#?]+\.md(?:#.*)?$/i.test(raw)) {
            const [path, hash = ''] = raw.split('#');
            const baseParts = String(currentDocId || '').split('/');
            baseParts.pop();
            path.split('/').forEach(part => {
                if (!part || part === '.') return;
                if (part === '..') {
                    baseParts.pop();
                } else {
                    baseParts.push(part);
                }
            });
            const docId = normalizeDocId(baseParts.join('/').replace(/\.md$/i, ''));
            return `simple.html?doc=${encodeURIComponent(docId)}${hash ? `#${hash}` : ''}`;
        }

        return raw;
    }

    function renderInline(source, options = {}) {
        let html = escapeHtml(source);
        html = html.replace(/&lt;br\s*\/?&gt;/gi, '<br>');

        const codeValues = [];
        html = html.replace(/`([^`\n]+)`/g, (_, code) => {
            const token = `\u0000CODE${codeValues.length}\u0000`;
            codeValues.push(`<code>${code}</code>`);
            return token;
        });

        html = html.replace(
            /!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\)/g,
            (_, alt, src, title) => {
                const titleAttr = title ? ` title="${title}"` : '';
                return `<img src="${src}" alt="${alt}"${titleAttr} style="max-width:100%;height:auto;">`;
            }
        );

        html = html.replace(
            /\[([^\]]+)\]\(([^)\s]+)\)/g,
            (_, label, href) => {
                const target = resolveDocHref(href, options.docId);
                const external = /^https?:\/\//i.test(target)
                    ? ' target="_blank" rel="noopener"'
                    : '';
                return `<a href="${target}"${external}>${label}</a>`;
            }
        );

        html = html.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__([^_\n]+)__/g, '<strong>$1</strong>');
        html = html.replace(/(^|[^\*])\*([^*\n]+)\*/g, '$1<em>$2</em>');

        html = html.replace(/\u0000CODE(\d+)\u0000/g, (_, index) => codeValues[Number(index)]);
        return html;
    }

    function readContainer(lines, startIndex) {
        const opener = lines[startIndex].match(/^:::\s+([a-z-]+)\s*(.*)$/i);
        if (!opener) return null;

        let depth = 1;
        for (let index = startIndex + 1; index < lines.length; index += 1) {
            if (/^:::\s+[a-z-]+/i.test(lines[index])) {
                depth += 1;
            } else if (/^:::\s*$/.test(lines[index])) {
                depth -= 1;
                if (depth === 0) {
                    return {
                        type: opener[1].toLowerCase(),
                        options: opener[2].trim(),
                        content: lines.slice(startIndex + 1, index),
                        endIndex: index
                    };
                }
            }
        }
        return null;
    }

    function renderHero(lines, options) {
        const fields = parseFields(lines);
        const width = fields.width || '800px';
        const className = fields.className ? ` ${escapeHtml(fields.className)}` : '';
        const badge = fields.badge
            ? `<span class="hero-badge">${fields.icon ? `<i class="${escapeHtml(fields.icon)}"></i> ` : ''}${renderInline(fields.badge, options)}</span>`
            : '';
        const description = fields.description
            ? `<p>${renderInline(fields.description, options)}</p>`
            : '';
        return `
            <div class="hero${className}" style="max-width: ${escapeHtml(width)};">
                ${badge}
                <h1>${renderInline(fields.title || '', options)}</h1>
                ${description}
            </div>`;
    }

    function renderBack(lines, options) {
        const fields = parseFields(lines);
        const href = resolveDocHref(fields.href || '#', options.docId);
        return `
            <div style="margin: 2rem 0;">
                <a href="${href}" style="color:#4c6ef5; text-decoration:none;"><i class="fas fa-chevron-left"></i> <span>${renderInline(fields.label || '', options)}</span></a>
            </div>`;
    }

    function renderCta(lines, options) {
        const buttons = lines
            .map(line => line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)\s*(?:\|\s*(.*))?$/))
            .filter(Boolean)
            .map(match => {
                const parts = (match[3] || '').split('|').map(part => part.trim());
                const icon = parts[0] || '';
                const style = parts[1] === 'primary' ? 'primary' : 'outline';
                return `<a href="${resolveDocHref(match[2], options.docId)}" class="btn btn-${style}">${icon ? `<i class="${escapeHtml(icon)}"></i>` : ''} <span>${renderInline(match[1], options)}</span></a>`;
            });
        return `<div class="hero-cta">${buttons.join('')}</div>`;
    }

    function renderSectionTitle(lines, options) {
        const fields = parseFields(lines);
        const marginStyle = fields.marginTop
            ? ` style="margin-top: ${escapeHtml(fields.marginTop)};"`
            : '';
        const link = fields.href
            ? `<a href="${resolveDocHref(fields.href, options.docId)}"><span>${renderInline(fields.action || '', options)}</span> <i class="fas fa-chevron-right" style="font-size:0.7rem;"></i></a>`
            : '';
        return `
            <div class="section-title"${marginStyle}>
                <h2>${renderInline(fields.title || '', options)}</h2>
                ${link}
            </div>`;
    }

    function renderSearch(lines, options) {
        const fields = parseFields(lines);
        return `
            <div class="search-wrapper">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchInput" placeholder="${escapeHtml(fields.placeholder || '')}" autocomplete="off">
                </div>
            </div>`;
    }

    function splitCardRecords(lines) {
        const records = [];
        let current = null;
        lines.forEach(line => {
            if (/^##\s+/.test(line)) {
                if (current) records.push(current);
                current = [line];
            } else if (current && line.trim()) {
                current.push(line);
            }
        });
        if (current) records.push(current);
        return records;
    }

    function renderCard(fields, options) {
        const href = resolveDocHref(fields.href || '#', options.docId);
        const external = /^https?:\/\//i.test(href)
            ? ' target="_blank" rel="noopener"'
            : '';
        return `
            <a href="${href}"${external} style="text-decoration: none; height: 20.5rem; min-height: 20.5rem; max-height: 20.5rem;" class="doc-card-link">
                <article class="doc-card" style="height: 20.5rem; min-height: 20.5rem; max-height: 20.5rem;">
                    <div class="card-icon"><i class="${escapeHtml(fields.icon || 'fas fa-book')}"></i></div>
                    <h3>${renderInline(fields.title || '', options)}</h3>
                    <p>${renderInline(fields.description || '', options)}</p>
                    <div class="card-meta">
                        <span class="tag"><i class="${escapeHtml(fields.tagIcon || 'fas fa-book')}"></i> <span>${renderInline(fields.tag || 'Docs', options)}</span></span>
                        <span class="doc-link"><span>${renderInline(fields.action || 'Read', options)}</span> <i class="fas fa-arrow-right"></i></span>
                    </div>
                </article>
            </a>`;
    }

    function renderCards(lines, options) {
        const cards = splitCardRecords(lines).map(record => {
            const heading = record[0].replace(/^##\s+/, '');
            const linkMatch = heading.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
            const fields = parseFields(record.slice(1));
            return renderCard({
                ...fields,
                title: linkMatch ? linkMatch[1] : heading,
                href: fields.href || (linkMatch ? linkMatch[2] : '#')
            }, options);
        });
        return `<div class="docs-grid" id="docsGrid">${cards.join('')}</div>`;
    }

    function renderCatalogCards(pages, options, defaults = {}) {
        const cards = pages.map(page => renderCard({
            href: `doc:${page.path}`,
            title: page.cardTitle || page.path.split('/').pop(),
            description: page.cardDescription || page.description || '',
            icon: page.cardIcon || page.icon || defaults.icon,
            tag: page.cardTag || defaults.tag,
            tagIcon: page.cardTagIcon || defaults.tagIcon,
            action: page.cardAction || defaults.action
        }, options));
        return `<div class="docs-grid" id="docsGrid">${cards.join('')}</div>`;
    }

    function applyCollectionDefaults(metadata, pages, locale) {
        if (!metadata.collection) return metadata;
        const parent = pages.find(page => page.path === `${metadata.collection}/index`);
        if (!parent) return metadata;

        return {
            ...metadata,
            badge: metadata.badge || parent.cardTitle || parent.title || '',
            icon: metadata.icon || parent.cardIcon || parent.icon || '',
            back: metadata.back || parent.path,
            backLabel: metadata.backLabel || (
                locale === 'zhcn'
                    ? `返回 ${parent.cardTitle || parent.title} 文档索引`
                    : `Back to ${parent.cardTitle || parent.title} Docs Index`
            )
        };
    }

    function renderCount(lines, options) {
        const fields = parseFields(lines);
        return `
            <div style="margin: 3rem 0; text-align: center; opacity: 0.7;">
                <p><span>${renderInline(fields.before || '', options)}</span> <span id="versionCount">0</span> <span>${renderInline(fields.after || '', options)}</span></p>
            </div>`;
    }

    function renderNote(lines, options) {
        return `
            <div style="margin: 3rem 0; text-align: center; opacity: 0.7;">
                <p>${renderInline(lines.join(' '), options)}</p>
            </div>`;
    }

    function renderRuleLayout(lines, options) {
        const firstRuleIndex = lines.findIndex(line => /^##\s+/.test(line));
        const configLines = firstRuleIndex === -1 ? lines : lines.slice(0, firstRuleIndex);
        const config = parseFields(configLines);
        const ruleLines = firstRuleIndex === -1 ? [] : lines.slice(firstRuleIndex);
        const records = [];
        let current = null;

        ruleLines.forEach(line => {
            if (/^##\s+/.test(line)) {
                if (current) records.push(current);
                current = { title: line.replace(/^##\s+/, ''), lines: [] };
            } else if (current) {
                current.lines.push(line);
            }
        });
        if (current) records.push(current);

        const rules = records.map(record => {
            const fields = parseFields(record.lines);
            const id = fields.id || `rule-${record.title.replace(/[^\w-]+/g, '-').replace(/^-|-$/g, '')}`;
            const tags = (fields.tags || '')
                .split('|')
                .map(tag => tag.trim())
                .filter(Boolean)
                .map(tag => tag.startsWith('!')
                    ? `<span>${renderInline(tag.slice(1), options)}</span>`
                    : `<span class="rule-category">${renderInline(tag, options)}</span>`)
                .join('');
            return {
                id,
                title: record.title,
                toc: fields.toc || record.title,
                html: `
                    <div id="${escapeHtml(id)}" class="rule-item">
                        <h4>${renderInline(record.title, options)}</h4>
                        ${tags ? `<div class="rule-meta">${tags}</div>` : ''}
                        <p>${renderInline(fields.description || '', options)}</p>
                        ${fields.meta ? `<p>${renderInline(fields.meta, options)}</p>` : ''}
                        ${fields.enable ? `<p>${renderInline(fields.enable, options)}</p>` : ''}
                    </div>`
            };
        });

        const tocItems = rules
            .map(rule => `<li><a href="#${escapeHtml(rule.id)}">${renderInline(rule.toc, options)}</a></li>`)
            .join('');
        return `
            <div class="list-section" style="margin-top: 2rem; padding: 2rem;">
                <div class="rule-layout">
                    <div class="rule-content">
                        <h3 style="font-size: 1.8rem; margin-bottom: 1.5rem;">${renderInline(config.title || 'Rules', options)}</h3>
                        ${rules.map(rule => rule.html).join('')}
                    </div>
                    <div class="rule-toc">
                        <h4>${renderInline(config.toc || 'Contents', options)}</h4>
                        <div class="toc-search">
                            <i class="fas fa-search"></i>
                            <input type="text" id="tocSearch" placeholder="${escapeHtml(config.search || '')}" aria-label="${escapeHtml(config.search || '')}">
                        </div>
                        <ul>${tocItems}</ul>
                    </div>
                </div>
            </div>`;
    }

    function renderBlockDirective(type, lines, options) {
        switch (type) {
            case 'hero':
                return renderHero(lines, options);
            case 'back':
                return renderBack(lines, options);
            case 'cta':
                return renderCta(lines, options);
            case 'section-title':
                return renderSectionTitle(lines, options);
            case 'search':
                return renderSearch(lines, options);
            case 'cards':
                return renderCards(lines, options);
            case 'count':
                return renderCount(lines, options);
            case 'note':
                return renderNote(lines, options);
            case 'rules':
                return renderRuleLayout(lines, options);
            case 'panel':
                return `<div class="list-section" style="margin-top: 2rem;">${renderMarkdown(lines.join('\n'), options)}</div>`;
            default:
                return renderMarkdown(lines.join('\n'), options);
        }
    }

    function renderMarkdown(source, options = {}) {
        const lines = String(source || '').replace(/\r\n?/g, '\n').split('\n');
        const output = [];
        let index = 0;

        while (index < lines.length) {
            const line = lines[index];
            if (!line.trim()) {
                index += 1;
                continue;
            }

            const container = readContainer(lines, index);
            if (container) {
                output.push(renderBlockDirective(container.type, container.content, options));
                index = container.endIndex + 1;
                continue;
            }

            const fence = line.match(/^```([\w-]*)\s*$/);
            if (fence) {
                const code = [];
                index += 1;
                while (index < lines.length && !/^```\s*$/.test(lines[index])) {
                    code.push(lines[index]);
                    index += 1;
                }
                output.push(`<pre style="background: rgba(0,0,0,0.1); padding: 1rem; border-radius: 8px; margin: 1rem 0;"><code>${escapeHtml(code.join('\n'))}</code></pre>`);
                index += 1;
                continue;
            }

            const heading = line.match(/^(#{1,6})\s+(.+)$/);
            if (heading) {
                const level = heading[1].length;
                output.push(`<h${level}>${renderInline(heading[2], options)}</h${level}>`);
                index += 1;
                continue;
            }

            if (/^-\s+/.test(line)) {
                const items = [];
                while (index < lines.length && /^-\s+/.test(lines[index])) {
                    items.push(`<li>${renderInline(lines[index].replace(/^-\s+/, ''), options)}</li>`);
                    index += 1;
                }
                output.push(`<ul style="margin: 1rem 0 2rem 2rem; line-height: 1.8;">${items.join('')}</ul>`);
                continue;
            }

            if (/^\d+\.\s+/.test(line)) {
                const items = [];
                while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
                    items.push(`<li>${renderInline(lines[index].replace(/^\d+\.\s+/, ''), options)}</li>`);
                    index += 1;
                }
                output.push(`<ol style="margin: 1rem 0 2rem 2rem; line-height: 1.8;">${items.join('')}</ol>`);
                continue;
            }

            if (/^>\s?/.test(line)) {
                const quote = [];
                while (index < lines.length && /^>\s?/.test(lines[index])) {
                    quote.push(lines[index].replace(/^>\s?/, ''));
                    index += 1;
                }
                output.push(`<blockquote style="margin:1rem 0;padding-left:1rem;border-left:3px solid rgba(76,110,245,.45);">${renderInline(quote.join(' '), options)}</blockquote>`);
                continue;
            }

            if (/^---+\s*$/.test(line)) {
                output.push('<hr style="border:none;border-top:1px solid rgba(120,130,200,.25);margin:2rem 0;">');
                index += 1;
                continue;
            }

            const paragraph = [line.trim()];
            index += 1;
            while (
                index < lines.length &&
                lines[index].trim() &&
                !/^```|^#{1,6}\s|^-\s|^\d+\.\s|^>\s?|^:::\s*[a-z-]+/i.test(lines[index])
            ) {
                paragraph.push(lines[index].trim());
                index += 1;
            }
            output.push(`<p>${renderInline(paragraph.join(' '), options)}</p>`);
        }

        return output.join('\n');
    }

    function getContentLocale(lang) {
        return CONTENT_LOCALES[lang] || 'enus';
    }

    function getFallbackLocale(locale) {
        return locale === 'zhcn' ? 'enus' : 'zhcn';
    }

    function mergeCatalogPages(primaryPages, fallbackPages) {
        const merged = new Map();
        (fallbackPages || []).forEach(page => merged.set(page.path, page));
        (primaryPages || []).forEach(page => merged.set(page.path, page));
        return Array.from(merged.values()).sort((left, right) => {
            const leftOrder = Number(left.cardOrder || 9999);
            const rightOrder = Number(right.cardOrder || 9999);
            return leftOrder - rightOrder;
        });
    }

    function getDocumentFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const requestedDoc = params.get('doc') || document.body.dataset.doc || 'home';
        const aliases = { mcmodifier: 'mcmodifier/index' };
        return aliases[requestedDoc] || requestedDoc;
    }

    function setActiveNavigation(page) {
        document.querySelectorAll('[data-nav-link]').forEach(link => {
            link.classList.toggle('active', link.dataset.navLink === page);
        });
    }

    function setDescription(description) {
        let element = document.querySelector('meta[name="description"]');
        if (!element) {
            element = document.createElement('meta');
            element.name = 'description';
            document.head.appendChild(element);
        }
        element.content = description || '';
    }

    function showLoadError(message) {
        const content = document.getElementById('page-content');
        if (!content) return;
        content.innerHTML = `
            <div class="list-section" style="margin-top:2rem;">
                <p>${escapeHtml(message || '文档加载失败')}</p>
            </div>`;
    }

    function renderMetadataHeader(metadata, options) {
        let html = '';
        if (metadata.back) {
            html += renderBack([
                `href: doc:${metadata.back}`,
                `label: ${metadata.backLabel || ''}`
            ], options);
        }

        if (metadata.showHero !== 'false' && metadata.title) {
            const heroDescription = metadata.showDescription === 'false'
                ? ''
                : (metadata.heroDescription || metadata.description || '');
            html += renderHero([
                `title: ${metadata.heroTitle || metadata.title}`,
                `description: ${heroDescription}`,
                `badge: ${metadata.badge || ''}`,
                `icon: ${metadata.icon || ''}`,
                `width: ${metadata.heroWidth || '800px'}`,
                `className: ${metadata.heroClass || ''}`
            ], options);
        }
        return html;
    }

    function renderArticleBody(source, options) {
        const lines = String(source || '').replace(/\r\n?/g, '\n').split('\n');
        const output = [];
        let plainLines = [];
        let index = 0;

        function flushPlainLines() {
            const plainContent = plainLines.join('\n').trim();
            plainLines = [];
            if (!plainContent) return;
            output.push(`<div class="list-section" style="margin-top: 2rem;">${renderMarkdown(plainContent, options)}</div>`);
        }

        while (index < lines.length) {
            const container = readContainer(lines, index);
            if (!container) {
                plainLines.push(lines[index]);
                index += 1;
                continue;
            }

            flushPlainLines();
            if (container.type === 'panel') {
                output.push(`<div class="list-section" style="margin-top: 2rem;">${renderMarkdown(container.content.join('\n'), options)}</div>`);
            } else {
                output.push(renderBlockDirective(container.type, container.content, options));
            }
            index = container.endIndex + 1;
        }
        flushPlainLines();
        return output.join('\n');
    }

    function renderArticleLayout(metadata, body, options) {
        return `
            ${renderMetadataHeader(metadata, options)}
            ${renderArticleBody(body, options)}`;
    }

    function renderFeaturedLayout(metadata, pages, options) {
        const limit = Number(metadata.homeCount || 3);
        const projects = pages
            .filter(page => page.pageType === 'project' && page.featured === 'true')
            .slice(0, limit);
        return `
            ${renderMetadataHeader(metadata, options)}
            ${renderSectionTitle([
                `title: ${metadata.sectionTitle || '📘 热门文档'}`,
                `href: doc:${metadata.sectionLink || 'docs'}`,
                `action: ${metadata.sectionAction || '查看全部'}`
            ], options)}
            ${renderCatalogCards(projects, options, {
                tag: metadata.cardTag || (options.locale === 'zhcn' ? '文档' : 'Docs'),
                action: metadata.cardAction || (options.locale === 'zhcn' ? '阅读' : 'Read')
            })}`;
    }

    function renderProjectsLayout(metadata, pages, options) {
        const projects = pages.filter(page => page.pageType === 'project');
        return `
            ${renderSectionTitle([
                `title: ${metadata.title || '📚 项目文档'}`,
                `href: doc:${metadata.sectionLink || 'repositories'}`,
                `action: ${metadata.sectionAction || ''}`,
                'marginTop: 2rem'
            ], options)}
            ${renderSearch([`placeholder: ${metadata.searchPlaceholder || ''}`], options)}
            ${renderCatalogCards(projects, options, {
                tag: metadata.cardTag || (options.locale === 'zhcn' ? '文档' : 'Docs'),
                action: metadata.cardAction || (options.locale === 'zhcn' ? '阅读' : 'Read')
            })}
            <div style="margin: 3rem 0; text-align: center; opacity: 0.7;">
                <p>${renderInline(metadata.footer || '', options)}</p>
            </div>`;
    }

    function renderCollectionLayout(metadata, pages, options) {
        const entries = pages.filter(page => (
            page.collection === metadata.collection &&
            page.layout !== 'collection'
        ));
        return `
            ${renderMetadataHeader(metadata, options)}
            ${renderSearch([`placeholder: ${metadata.searchPlaceholder || ''}`], options)}
            ${renderCatalogCards(entries, options, {
                icon: metadata.cardIcon || 'fas fa-tag',
                tag: metadata.cardTag || (options.locale === 'zhcn' ? '文档' : 'Docs'),
                tagIcon: metadata.cardTagIcon || 'fas fa-book',
                action: metadata.cardAction || (options.locale === 'zhcn' ? '查看' : 'View')
            })}
            <div style="margin: 3rem 0; text-align: center; opacity: 0.7;">
                <p><span>${renderInline(metadata.countBefore || (options.locale === 'zhcn' ? '共' : 'Total'), options)}</span> <span id="versionCount">0</span> <span>${renderInline(metadata.countAfter || (options.locale === 'zhcn' ? '个版本' : 'versions'), options)}</span></p>
            </div>`;
    }

    async function loadContentManifest() {
        if (!contentManifestPromise) {
            contentManifestPromise = fetch(
                new URL(`${CONTENT_ROOT}manifest.json`, window.location.href),
                { cache: 'no-cache' }
            ).then(response => {
                if (!response.ok) throw new Error(`无法读取 content/manifest.json（HTTP ${response.status}）`);
                return response.json();
            });
        }
        return contentManifestPromise;
    }

    async function discoverGithubCatalog() {
        if (githubCatalogPromise) return githubCatalogPromise;

        githubCatalogPromise = (async () => {
            const cacheKey = 'ohhapple-content-catalog-all-v2';
            try {
                const cached = sessionStorage.getItem(cacheKey);
                if (cached) {
                    const parsedCache = JSON.parse(cached);
                    if (Date.now() - parsedCache.savedAt < 5 * 60 * 1000) {
                        return parsedCache.catalogs;
                    }
                }
            } catch {
                // sessionStorage may be unavailable in restricted browser modes.
            }

            const repository = 'ohhapple/ohhapple.github.io';
            const treeResponse = await fetch(
                `https://api.github.com/repos/${repository}/git/trees/master?recursive=1`,
                { headers: { Accept: 'application/vnd.github+json' } }
            );
            if (!treeResponse.ok) throw new Error('GitHub content discovery failed');
            const tree = await treeResponse.json();
            const markdownFiles = (tree.tree || []).filter(item => (
                item.type === 'blob' &&
                (
                    item.path.startsWith('content/zhcn/') ||
                    item.path.startsWith('content/enus/')
                ) &&
                item.path.endsWith('.md')
            ));

            const entries = await Promise.all(markdownFiles.map(async item => {
                const rawUrl = `https://raw.githubusercontent.com/${repository}/master/${item.path}`;
                const response = await fetch(rawUrl, { cache: 'force-cache' });
                if (!response.ok) throw new Error(`Failed to load ${item.path}`);
                const contentPath = item.path.slice('content/'.length);
                const [sourceLocale, ...docParts] = contentPath.split('/');
                const path = docParts.join('/').replace(/\.md$/, '');
                const parsed = deriveDocument(path, await response.text(), sourceLocale);
                return {
                    locale: sourceLocale,
                    page: {
                        path,
                        ...parsed.metadata
                    }
                };
            }));

            const catalogs = { zhcn: [], enus: [] };
            entries.forEach(entry => {
                if (entry.page.hidden !== 'true' && catalogs[entry.locale]) {
                    catalogs[entry.locale].push(entry.page);
                }
            });
            Object.values(catalogs).forEach(pages => {
                pages.sort((left, right) => {
                    const leftOrder = Number(left.cardOrder || left.order || 9999);
                    const rightOrder = Number(right.cardOrder || right.order || 9999);
                    return leftOrder - rightOrder;
                });
            });

            try {
                sessionStorage.setItem(cacheKey, JSON.stringify({
                    savedAt: Date.now(),
                    catalogs
                }));
            } catch {
                // Caching is optional.
            }
            return catalogs;
        })();

        try {
            return await githubCatalogPromise;
        } catch (error) {
            console.warn(error);
            githubCatalogPromise = null;
            return null;
        }
    }

    async function getCatalogPages(locale) {
        const fallbackLocale = getFallbackLocale(locale);
        let localPages = [];
        let fallbackPages = [];
        try {
            const manifest = await loadContentManifest();
            localPages = manifest.pages?.[locale] || [];
            fallbackPages = manifest.pages?.[fallbackLocale] || [];
        } catch (error) {
            if (window.location.hostname !== 'ohhapple.github.io') throw error;
            console.warn(error);
        }
        if (window.location.hostname === 'ohhapple.github.io') {
            const discoveredCatalogs = await discoverGithubCatalog();
            if (discoveredCatalogs) {
                localPages = discoveredCatalogs[locale] || localPages;
                fallbackPages = discoveredCatalogs[fallbackLocale] || fallbackPages;
            }
        }
        return mergeCatalogPages(localPages, fallbackPages);
    }

    async function loadDocument() {
        const content = document.getElementById('page-content');
        if (!content) return;

        const seq = ++loadSequence;
        const lang = localStorage.getItem('siteLanguage') || 'zh';
        const locale = getContentLocale(lang);
        const fallbackLocale = getFallbackLocale(locale);

        content.setAttribute('aria-busy', 'true');
        try {
            const docId = normalizeDocId(getDocumentFromUrl());
            const requestedUrl = new URL(
                `${CONTENT_ROOT}${locale}/${docId.split('/').map(encodeURIComponent).join('/')}.md`,
                window.location.href
            ).href;
            let markdown;
            let sourceLocale = locale;
            markdown = documentCache.get(requestedUrl);
            if (markdown === undefined) {
                const response = await fetch(requestedUrl, { cache: 'no-cache' });
                if (!response.ok) {
                    const fallbackUrl = new URL(
                        `${CONTENT_ROOT}${fallbackLocale}/${docId.split('/').map(encodeURIComponent).join('/')}.md`,
                        window.location.href
                    ).href;
                    markdown = documentCache.get(fallbackUrl);
                    if (markdown === undefined) {
                        const fallbackResponse = await fetch(fallbackUrl, { cache: 'no-cache' });
                        if (!fallbackResponse.ok) {
                            throw new Error(`无法读取 ${locale}/${docId}.md 或 ${fallbackLocale}/${docId}.md`);
                        }
                        markdown = await fallbackResponse.text();
                        documentCache.set(fallbackUrl, markdown);
                    }
                    sourceLocale = fallbackLocale;
                } else {
                    markdown = await response.text();
                    documentCache.set(requestedUrl, markdown);
                }
            }
            if (seq !== loadSequence) return;

            const parsed = deriveDocument(docId, markdown, sourceLocale);
            const options = { docId, locale: sourceLocale };
            let metadata = parsed.metadata;
            let html;

            if (metadata.layout === 'article' && metadata.collection) {
                metadata = applyCollectionDefaults(metadata, await getCatalogPages(sourceLocale), sourceLocale);
            }

            switch (metadata.layout) {
                case 'featured':
                    html = renderFeaturedLayout(metadata, await getCatalogPages(sourceLocale), options);
                    break;
                case 'projects':
                    html = renderProjectsLayout(metadata, await getCatalogPages(sourceLocale), options);
                    break;
                case 'collection':
                    html = renderCollectionLayout(metadata, await getCatalogPages(sourceLocale), options);
                    break;
                case 'article':
                    html = renderArticleLayout(metadata, parsed.body, options);
                    break;
                default:
                    html = renderMarkdown(parsed.body, options);
            }
            content.innerHTML = html;
            content.removeAttribute('aria-busy');

            document.title = metadata.pageTitle || metadata.title || 'ohhapple•docs';
            setDescription(metadata.description);
            document.documentElement.lang = metadata.lang || (sourceLocale === 'zhcn' ? 'zh-CN' : 'en');
            setActiveNavigation(metadata.nav || (
                ['article', 'projects', 'collection'].includes(metadata.layout) ? 'docs' : ''
            ));

            if (typeof window.updateVersionCount === 'function') {
                window.updateVersionCount();
            }
            if (typeof window.fitDocumentCards === 'function') {
                window.fitDocumentCards();
                if (document.fonts && document.fonts.ready) {
                    document.fonts.ready.then(window.fitDocumentCards);
                }
            }
            if (typeof window.initCarpetPlusFeatures === 'function') {
                window.initCarpetPlusFeatures();
            }
        } catch (error) {
            if (seq !== loadSequence) return;
            content.removeAttribute('aria-busy');
            showLoadError(error.message || '文档加载失败');
            console.error(error);
        }
    }

    window.initMarkdownPage = function () {
        if (!initialized) {
            initialized = true;
            document.addEventListener('languageChanged', loadDocument);
        }
        return loadDocument();
    };

    window.MarkdownDocs = {
        applyCollectionDefaults,
        deriveDocument,
        getContentLocale,
        normalizeDocId,
        parseFrontMatter,
        renderArticleLayout,
        renderCollectionLayout,
        renderFeaturedLayout,
        renderProjectsLayout,
        renderMarkdown
    };
})();
