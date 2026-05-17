import { CommonModule, DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Button } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';

import { ADMIN_DOCS, DocsLanguage, DocsText, DocsTopic } from './admin-docs.data';

type LanguageOption = {
    label: string;
    value: DocsLanguage;
};

type GroupedDocs = {
    key: string;
    group: DocsText;
    docs: DocsTopic[];
};

type SelectDocOptions = {
    sectionId?: string | null;
    scroll?: boolean;
    smooth?: boolean;
    updateUrl?: boolean;
};

type FloatingTooltip = {
    visible: boolean;
    text: string;
    left: number;
    top: number;
    placement: 'top' | 'bottom';
};

type AdminDocsMouseEvent = MouseEvent & {
    __adminDocsLinkHandled?: boolean;
};

@Component({
    selector: 'app-admin-docs',
    standalone: true,
    imports: [CommonModule, FormsModule, Button, DrawerModule, IconField, InputIcon, InputText, Select, Tag, Tooltip],
    templateUrl: './admin-docs.component.html',
    styleUrl: './admin-docs.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDocsComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly document = inject(DOCUMENT);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly cdr = inject(ChangeDetectorRef);

    @ViewChild('articleStart') articleStart?: ElementRef<HTMLElement>;
    @ViewChild('articleContent') articleContent?: ElementRef<HTMLElement>;

    readonly docs = ADMIN_DOCS;
    readonly languageOptions: LanguageOption[] = [
        { label: 'English', value: 'en' },
        { label: 'العربية', value: 'ar' }
    ];

    language: DocsLanguage = 'en';
    searchTerm = '';
    selectedDocId = this.docs[0]?.id ?? '';
    activeSectionId = this.docs[0]?.sections?.[0]?.id ?? '';
    mobileTopicsVisible = false;
    expandedGroups: Record<string, boolean> = {};

    activeTooltip: FloatingTooltip = {
        visible: false,
        text: '',
        left: 0,
        top: 0,
        placement: 'top'
    };

    private activeTooltipAnchor: HTMLAnchorElement | null = null;
    private scrollRaf = 0;
    private unlockTimer?: ReturnType<typeof setTimeout>;
    private ignoreScrollUntil = 0;
    private cachedArticleHtml: SafeHtml | null = null;
    private mutationObserver: MutationObserver | null = null;

    private readonly scrollOffset = 160;
    private readonly activeThreshold = 80;

    ngOnInit(): void {
        this.expandAllGroups();
        this.readInitialRouteState();
        this.updateCachedHtml();

        this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const lang = params.get('lang') as DocsLanguage | null;
            const topic = params.get('topic');
            const section = params.get('section');

            if ((lang === 'en' || lang === 'ar') && lang !== this.language) {
                this.language = lang;
                this.updateCachedHtml();
                this.cdr.markForCheck();
            }

            if (topic) {
                const doc = this.findDocByTopicValue(topic);
                if (doc && doc.id !== this.selectedDocId) {
                    this.selectedDocId = doc.id;
                    this.activeSectionId = section || doc.sections[0]?.id || '';
                    this.ensureSelectedGroupIsExpanded();
                    this.updateCachedHtml();
                    this.cdr.markForCheck();
                }
            }
        });
    }

    ngAfterViewInit(): void {
        window.addEventListener('scroll', this.onWindowScroll, { passive: true });
        window.addEventListener('resize', this.hideTooltip, { passive: true });
        this.document.addEventListener('pointermove', this.onDocumentPointerMove, { passive: true });
        this.document.addEventListener('pointerdown', this.onDocumentPointerDown, true);

        this.attachDirectAnchorHandlers();

        if (this.articleContent?.nativeElement) {
            this.mutationObserver = new MutationObserver(() => this.attachDirectAnchorHandlers());
            this.mutationObserver.observe(this.articleContent.nativeElement, { childList: true, subtree: true });
        }

        const initialSection = this.route.snapshot.queryParamMap.get('section');
        setTimeout(() => {
            if (initialSection) {
                this.scrollToSection(initialSection, undefined, false, 'auto');
            } else {
                this.updateActiveSectionFromScroll(false);
            }
        });
    }

    ngOnDestroy(): void {
        window.removeEventListener('scroll', this.onWindowScroll);
        window.removeEventListener('resize', this.hideTooltip);
        this.document.removeEventListener('pointermove', this.onDocumentPointerMove);
        this.document.removeEventListener('pointerdown', this.onDocumentPointerDown, true);
        if (this.scrollRaf) cancelAnimationFrame(this.scrollRaf);
        if (this.unlockTimer) clearTimeout(this.unlockTimer);
        if (this.mutationObserver) this.mutationObserver.disconnect();
    }

    get isArabic(): boolean {
        return this.language === 'ar';
    }

    get direction(): 'ltr' | 'rtl' {
        return this.isArabic ? 'rtl' : 'ltr';
    }

    get pageTitle(): string {
        return this.isArabic ? 'دليل المسؤول' : 'Admin Docs';
    }

    get productTitle(): string {
        return this.isArabic ? 'مركز مساعدة اشتراك' : 'Echtirak Help';
    }

    get searchPlaceholder(): string {
        return this.isArabic ? 'ابحث في الدليل...' : 'Search docs...';
    }

    get selectedDoc(): DocsTopic | null {
        return this.docs.find((doc) => doc.id === this.selectedDocId) ?? this.docs[0] ?? null;
    }

    get selectedDocIndex(): number {
        if (!this.selectedDoc) return -1;
        return this.docs.findIndex((doc) => doc.id === this.selectedDoc?.id);
    }

    get articleHtml(): SafeHtml {
        return this.cachedArticleHtml ?? '';
    }

    get groupedDocs(): GroupedDocs[] {
        const search = this.normalizedSearchTerm;
        const groups = new Map<string, GroupedDocs>();
        for (const doc of this.docs) {
            if (search && !this.searchMatches(doc, search)) continue;
            const key = doc.group.en;
            if (!groups.has(key)) {
                groups.set(key, { key, group: doc.group, docs: [] });
            }
            groups.get(key)!.docs.push(doc);
        }
        return Array.from(groups.values());
    }

    get normalizedSearchTerm(): string {
        return this.searchTerm.trim().toLowerCase();
    }

    get activeSectionTitle(): string {
        const found = this.selectedDoc?.sections.find((section) => section.id === this.activeSectionId);
        return found ? this.t(found.title) : '';
    }

    get sectionCountLabel(): string {
        const count = this.selectedDoc?.sections.length ?? 0;
        return this.isArabic ? `${count} أقسام` : `${count} sections`;
    }

    get hasSearchResults(): boolean {
        return this.groupedDocs.some((group) => group.docs.length > 0);
    }

    get previousDoc(): DocsTopic | null {
        const index = this.selectedDocIndex;
        return index > 0 ? this.docs[index - 1] : null;
    }

    get nextDoc(): DocsTopic | null {
        const index = this.selectedDocIndex;
        return index >= 0 && index < this.docs.length - 1 ? this.docs[index + 1] : null;
    }

    t(text: DocsText | null | undefined): string {
        if (!text) return '';
        return this.isArabic ? text.ar : text.en;
    }

    goToFirstDoc(): void {
        const firstDoc = this.docs[0];
        if (!firstDoc) return;
        this.selectDoc(firstDoc, { smooth: false });
    }

    toggleGroup(group: DocsText): void {
        this.expandedGroups[group.en] = this.expandedGroups[group.en] === false;
    }

    isGroupExpanded(group: DocsText): boolean {
        return this.expandedGroups[group.en] !== false;
    }

    selectDoc(doc: DocsTopic, options: SelectDocOptions = {}): void {
        const sectionId = options.sectionId ?? null;
        const shouldScroll = options.scroll !== false;
        const smooth = options.smooth === true;
        const updateUrl = options.updateUrl !== false;
        const isSameDoc = this.selectedDocId === doc.id;

        this.hideTooltip();
        this.selectedDocId = doc.id;
        this.mobileTopicsVisible = false;
        this.activeSectionId = sectionId || doc.sections[0]?.id || '';
        this.ensureSelectedGroupIsExpanded();
        this.updateCachedHtml();
        this.cdr.markForCheck();

        if (updateUrl) {
            this.replaceUrlState(doc.id, sectionId || null, this.language);
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (sectionId) {
                    this.scrollToSection(sectionId, undefined, false, smooth ? 'smooth' : 'auto');
                } else if (shouldScroll && !isSameDoc) {
                    this.scrollToArticleTop(smooth ? 'smooth' : 'auto');
                } else {
                    this.updateActiveSectionFromScroll(false);
                }
                this.attachDirectAnchorHandlers();
            });
        });
    }

    onLanguageChange(): void {
        this.hideTooltip();
        this.updateCachedHtml();
        this.cdr.markForCheck();
        this.replaceUrlState(this.selectedDocId, this.activeSectionId || null, this.language);
        setTimeout(() => {
            if (this.activeSectionId) {
                this.scrollToSection(this.activeSectionId, undefined, false, 'auto');
            }
            this.attachDirectAnchorHandlers();
        });
    }

    clearSearch(): void {
        this.searchTerm = '';
    }

    openInApp(doc: DocsTopic | null = this.selectedDoc): void {
        if (!doc?.appRoute) return;
        const routeSegments = doc.appRoute.split('/').filter(Boolean);
        this.router.navigate(['/app', 'admin', ...routeSegments]);
    }

    scrollToSection(sectionId: string, event?: Event, updateUrl = true, behavior: ScrollBehavior = 'smooth'): void {
        event?.preventDefault();
        event?.stopPropagation();
        this.hideTooltip();
        const normalizedId = this.normalizeSectionId(sectionId);
        if (!normalizedId) return;
        this.lockActiveSection(normalizedId, behavior === 'smooth' ? 700 : 150);
        let attempts = 0;
        const maxAttempts = 15;
        const interval = 50;
        const tryScroll = () => {
            const element = this.getSectionElement(normalizedId);
            if (element) {
                const targetTop = element.getBoundingClientRect().top + window.scrollY - this.scrollOffset;
                window.scrollTo({ top: Math.max(targetTop, 0), behavior });
                if (updateUrl) this.replaceUrlState(this.selectedDocId, normalizedId, this.language);
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(tryScroll, interval);
            }
        };
        tryScroll();
    }

    onArticlePointerOver(event: PointerEvent): void {
        if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') {
            this.hideTooltip();
            return;
        }
        const anchor = this.getTooltipAnchor(event.target);
        if (!anchor || anchor === this.activeTooltipAnchor) return;
        this.showTooltipForAnchor(anchor, event);
    }

    onArticlePointerOut(event: PointerEvent): void {
        const anchor = this.activeTooltipAnchor;
        if (!anchor) return;
        const nextTarget = event.relatedTarget as Node | null;
        if (nextTarget && anchor.contains(nextTarget)) return;
        this.hideTooltip();
    }

    onArticleClick(event: MouseEvent): void {
        this.handleArticleAnchorClick(event as AdminDocsMouseEvent);
    }

    private attachDirectAnchorHandlers(): void {
        const container = this.articleContent?.nativeElement;
        if (!container) return;
        const anchors = container.querySelectorAll('a');
        anchors.forEach((anchor) => {
            if ((anchor as HTMLAnchorElement & { __docsHandlerAttached?: boolean }).__docsHandlerAttached) return;
            (anchor as HTMLAnchorElement & { __docsHandlerAttached?: boolean }).__docsHandlerAttached = true;
            anchor.addEventListener('click', (event) => {
                this.handleArticleAnchorClick(event as AdminDocsMouseEvent);
            });
        });
    }

    private handleArticleAnchorClick(event: AdminDocsMouseEvent): void {
        if (event.__adminDocsLinkHandled) return;
        event.__adminDocsLinkHandled = true;

        const anchor = event.currentTarget as HTMLAnchorElement;
        const href = anchor.getAttribute('href')?.trim();
        if (!href) return;

        if (href.startsWith('#')) {
            event.preventDefault();
            event.stopPropagation();
            this.scrollToSection(href.slice(1), undefined, true, 'smooth');
            return;
        }

        const targetDoc = this.findDocByHref(href);
        if (!targetDoc) return;

        event.preventDefault();
        event.stopPropagation();
        this.hideTooltip();

        let sectionId: string | null = null;
        const hashIndex = href.indexOf('#');
        if (hashIndex !== -1) sectionId = href.slice(hashIndex + 1);

        this.selectDoc(targetDoc, {
            sectionId,
            scroll: true,
            smooth: false,
            updateUrl: true
        });
    }

    private findDocByHref(href: string): DocsTopic | null {
        let url: URL;
        try {
            url = new URL(href, window.location.href);
        } catch {
            return null;
        }
        let fileName = url.pathname.split('/').pop() || '';
        fileName = fileName.split('?')[0];
        const baseName = fileName.replace(/\.html$/i, '');
        if (!baseName) return null;
        return this.docs.find((doc) => doc.fileName.replace(/\.html$/i, '') === baseName || doc.slug === baseName || doc.id === baseName) ?? null;
    }

    private getTooltipAnchor(target: EventTarget | null): HTMLAnchorElement | null {
        const element = target instanceof HTMLElement ? target : null;
        const anchor = element?.closest('a[data-tooltip]') as HTMLAnchorElement | null;
        if (!anchor || !this.articleContent?.nativeElement.contains(anchor)) return null;
        return anchor;
    }

    private showTooltipForAnchor(anchor: HTMLAnchorElement, event?: PointerEvent): void {
        const text = anchor.getAttribute('data-tooltip')?.trim();
        if (!text) {
            this.hideTooltip();
            return;
        }
        const rect = this.getBestAnchorRect(anchor, event);
        const viewportPadding = 16;
        const estimatedTooltipWidth = Math.min(460, Math.max(window.innerWidth - viewportPadding * 2, 220));
        const halfTooltipWidth = estimatedTooltipWidth / 2;
        const rawLeft = rect.left + rect.width / 2;
        const left = Math.min(Math.max(rawLeft, halfTooltipWidth + viewportPadding), window.innerWidth - halfTooltipWidth - viewportPadding);
        const shouldPlaceBelow = rect.top < 120;
        this.activeTooltipAnchor = anchor;
        this.activeTooltip = {
            visible: true,
            text,
            left,
            top: shouldPlaceBelow ? rect.bottom + 12 : rect.top - 12,
            placement: shouldPlaceBelow ? 'bottom' : 'top'
        };
        this.cdr.markForCheck();
    }

    private getBestAnchorRect(anchor: HTMLAnchorElement, event?: PointerEvent): DOMRect {
        const rects = Array.from(anchor.getClientRects());
        if (!rects.length) return anchor.getBoundingClientRect();
        if (!event) return rects[0];
        const pointX = event.clientX;
        const pointY = event.clientY;
        const containingRect = rects.find((rect) => pointX >= rect.left && pointX <= rect.right && pointY >= rect.top && pointY <= rect.bottom);
        if (containingRect) return containingRect;
        return rects.reduce((best, current) => {
            const bestCenterX = best.left + best.width / 2;
            const bestCenterY = best.top + best.height / 2;
            const currentCenterX = current.left + current.width / 2;
            const currentCenterY = current.top + current.height / 2;
            const bestDist = Math.hypot(bestCenterX - pointX, bestCenterY - pointY);
            const currDist = Math.hypot(currentCenterX - pointX, currentCenterY - pointY);
            return currDist < bestDist ? current : best;
        }, rects[0]);
    }

    readonly hideTooltip = (): void => {
        this.activeTooltipAnchor = null;
        this.activeTooltip = { visible: false, text: '', left: 0, top: 0, placement: 'top' };
        this.cdr.markForCheck();
    };

    private readonly onDocumentPointerMove = (event: PointerEvent): void => {
        const anchor = this.activeTooltipAnchor;
        if (!anchor) return;
        const elementUnderPointer = this.document.elementFromPoint(event.clientX, event.clientY);
        if (elementUnderPointer && anchor.contains(elementUnderPointer)) return;
        this.hideTooltip();
    };

    private readonly onDocumentPointerDown = (event: PointerEvent): void => {
        const anchor = this.activeTooltipAnchor;
        if (!anchor) return;
        const target = event.target instanceof Node ? event.target : null;
        if (target && anchor.contains(target)) return;
        this.hideTooltip();
    };

    private updateCachedHtml(): void {
        const doc = this.selectedDoc;
        if (!doc) {
            this.cachedArticleHtml = null;
            return;
        }
        const html = this.t(doc.contentHtml);
        this.cachedArticleHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    }

    private readInitialRouteState(): void {
        const params = this.route.snapshot.queryParamMap;
        const topic = params.get('topic');
        const lang = params.get('lang') as DocsLanguage | null;
        const section = params.get('section');
        if (lang === 'en' || lang === 'ar') this.language = lang;
        if (topic) {
            const doc = this.findDocByTopicValue(topic);
            if (doc) this.selectedDocId = doc.id;
        }
        this.activeSectionId = section || this.selectedDoc?.sections[0]?.id || '';
        this.ensureSelectedGroupIsExpanded();
        this.updateCachedHtml();
    }

    private expandAllGroups(): void {
        for (const doc of this.docs) {
            this.expandedGroups[doc.group.en] = true;
        }
    }

    private ensureSelectedGroupIsExpanded(): void {
        const group = this.selectedDoc?.group.en;
        if (group) this.expandedGroups[group] = true;
    }

    private searchMatches(doc: DocsTopic, search: string): boolean {
        const contentText = `${doc.contentHtml.en} ${doc.contentHtml.ar}`.replace(/<[^>]+>/g, ' ');
        const haystack = [doc.title.en, doc.title.ar, doc.group.en, doc.group.ar, ...doc.keywords, ...doc.sections.flatMap((section) => [section.title.en, section.title.ar]), contentText].join(' ').toLowerCase();
        return haystack.includes(search);
    }

    private findDocByTopicValue(value: string): DocsTopic | undefined {
        const raw = decodeURIComponent(value.trim());
        const lastSegment = raw.split('/').pop() ?? raw;
        const withoutHtml = lastSegment.replace(/\.html$/i, '');
        const normalized = this.normalizeDocSlug(withoutHtml);
        return this.docs.find((doc) => {
            const docFile = doc.fileName.replace(/\.html$/i, '');
            const normalizedDocFile = this.normalizeDocSlug(docFile);
            return (
                doc.id === raw || doc.slug === raw || doc.fileName === raw || doc.id === lastSegment || doc.slug === lastSegment || doc.fileName === lastSegment || doc.id === normalized || doc.slug === normalized || normalizedDocFile === normalized
            );
        });
    }

    private normalizeDocSlug(value: string): string {
        return value
            .trim()
            .replace(/\.html$/i, '')
            .replace(/^ar[-_/]/i, '')
            .replace(/^en[-_/]/i, '');
    }

    private normalizeSectionId(sectionId: string | null | undefined): string {
        return decodeURIComponent((sectionId ?? '').replace(/^#/, '').trim());
    }

    private scrollToArticleTop(behavior: ScrollBehavior = 'auto'): void {
        const element = this.articleStart?.nativeElement;
        if (!element) return;
        const top = element.getBoundingClientRect().top + window.scrollY - this.scrollOffset;
        window.scrollTo({ top: Math.max(top, 0), behavior });
    }

    private lockActiveSection(sectionId: string, durationMs: number): void {
        this.activeSectionId = sectionId;
        this.ignoreScrollUntil = Date.now() + durationMs;
        if (this.unlockTimer) clearTimeout(this.unlockTimer);
        this.unlockTimer = setTimeout(() => {
            this.ignoreScrollUntil = 0;
            this.activeSectionId = sectionId;
        }, durationMs);
    }

    private readonly onWindowScroll = (): void => {
        this.hideTooltip();
        if (Date.now() < this.ignoreScrollUntil) return;
        if (this.scrollRaf) return;
        this.scrollRaf = requestAnimationFrame(() => {
            this.scrollRaf = 0;
            this.updateActiveSectionFromScroll(true);
        });
    };

    private updateActiveSectionFromScroll(updateUrl: boolean): void {
        const doc = this.selectedDoc;
        if (!doc?.sections?.length) return;
        const sections = doc.sections.map((section) => ({ section, element: this.getSectionElement(section.id) })).filter((entry): entry is { section: (typeof doc.sections)[number]; element: HTMLElement } => !!entry.element);
        if (!sections.length) return;
        const marker = this.scrollOffset + this.activeThreshold;
        let active = sections[0].section.id;
        for (const entry of sections) {
            const top = entry.element.getBoundingClientRect().top;
            if (top <= marker) active = entry.section.id;
            else break;
        }
        if (active !== this.activeSectionId) {
            this.activeSectionId = active;
            if (updateUrl) this.replaceUrlState(this.selectedDocId, active, this.language);
        }
    }

    private getSectionElement(sectionId: string): HTMLElement | null {
        if (!sectionId) return null;
        const root = this.articleContent?.nativeElement ?? this.document;
        const selector = `#${this.escapeCssIdentifier(sectionId)}`;
        return root.querySelector(selector) as HTMLElement | null;
    }

    private escapeCssIdentifier(value: string): string {
        if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
            return CSS.escape(value);
        }
        return value.replace(/([ #;?%&,.+*~':"!^$[\]()=>|/@])/g, '\\$1');
    }

    private replaceUrlState(topic: string | null, section: string | null, lang: DocsLanguage): void {
        const url = this.router
            .createUrlTree([], {
                relativeTo: this.route,
                queryParams: { topic: topic || null, section: section || null, lang },
                queryParamsHandling: 'merge'
            })
            .toString();
        window.history.replaceState(window.history.state, '', url);
    }
}
