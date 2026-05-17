export type DocsLanguage = 'en' | 'ar';

export type DocsText = { en: string; ar: string };

export type DocsSection = { id: string; title: DocsText };

export type DocsTopic = {
    id: string;
    slug: string;
    fileName: string;
    title: DocsText;
    group: DocsText;
    appRoute?: string | null;
    sections: DocsSection[];
    contentHtml: DocsText;
    keywords: string[];
};

const LAST_MODIFIED = '17 May 2026';

const text = (en: string, ar: string): DocsText => ({ en, ar });

const section = (id: string, en: string, ar: string): DocsSection => ({
    id,
    title: text(en, ar)
});

const withFooter = (content: string): string => `${content}
<div class="last-modified">${LAST_MODIFIED}</div>
<div data-feedback-placeholder="true"></div>`;

const coreSections = [
    section('what-this-page-is-for', 'What this page is for', 'الغرض من هذه الصفحة'),
    section('before-you-start', 'Before you start', 'قبل أن تبدأ'),
    section('regular-workflow', 'Regular workflow', 'سير العمل المعتاد'),
    section('what-you-see-on-this-page', 'What you see on this page', 'ما تراه على هذه الصفحة'),
    section('step-by-step', 'Step-by-step', 'خطوة بخطوة'),
    section('validation-mistakes', 'Validation mistakes', 'أخطاء التحقق'),
    section('common-mistakes', 'Common mistakes', 'أخطاء شائعة'),
    section('troubleshooting', 'Troubleshooting', 'استكشاف الأخطاء'),
    section('related-pages', 'Related pages', 'صفحات ذات صلة')
];

export const ADMIN_DOCS: DocsTopic[] = [
    {
        id: 'getting-started',
        slug: 'getting-started',
        fileName: 'getting-started.html',
        title: text('Getting started', 'البدء'),
        group: text('Start here', 'ابدأ هنا'),
        appRoute: null,
        sections: [
            section('what-this-page-is-for', 'What this page is for', 'الغرض من هذه الصفحة'),
            section('before-you-start', 'Before you start', 'قبل أن تبدأ'),
            section('your-admin-workflow', 'Your admin workflow', 'سير عمل المسؤول'),
            section('what-you-see-in-the-app', 'What you see in the app', 'ما تراه في التطبيق'),
            section('permissions-and-safety', 'Permissions and safety', 'الصلاحيات والسلامة'),
            section('validation-mistakes', 'Validation mistakes', 'أخطاء التحقق'),
            section('common-mistakes', 'Common mistakes', 'أخطاء شائعة'),
            section('troubleshooting', 'Troubleshooting', 'استكشاف الأخطاء'),
            section('related-pages', 'Related pages', 'صفحات ذات صلة')
        ],
        contentHtml: {
            en: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">What this page is for</h2>
<p>This guide is for <span class="control">Admin</span> users. It explains the platform dashboard, generator owner account setup, wallet operations, announcements, SMS templates, and live monitoring.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">Before you start</h2>
<ul class="list _bullet">
<li><p>Sign in with an Admin account.</p></li>
<li><p>Know which generator owner you are working on before changing billing, wallet, or SMS settings.</p></li>
<li><p>Use production actions carefully. Top-ups, status changes, published announcements, and deleted templates affect real users.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="your-admin-workflow" id="your-admin-workflow">Your admin workflow</h2>
<ol class="list _decimal" type="1">
<li><p>Open <a data-tooltip="Platform overview, financial metrics, growth, usage, health, and trend data." href="dashboard.html">Dashboard</a> for high-level platform checks.</p></li>
<li><p>Use <a data-tooltip="Create, edit, export, and manage generator owner accounts." href="generator-owners.html">Generator Owners</a> for account administration.</p></li>
<li><p>Use <a data-tooltip="Top up wallets, override caps, view transactions, and deactivate/reactivate accounts." href="generator-owner-wallet.html">Wallet Management</a> only when the owner and amount are confirmed.</p></li>
<li><p>Use <a data-tooltip="Create, edit, publish, and export platform announcements." href="announcements.html">Announcements</a> for platform messages.</p></li>
<li><p>Use <a data-tooltip="Load and maintain SMS templates for a selected generator owner." href="sms-templates.html">SMS Templates</a> when message text needs setup or correction.</p></li>
<li><p>Use <a data-tooltip="Track active sessions, request activity, session history, and force logout when needed." href="monitoring.html">Monitoring</a> for live support and security checks.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-in-the-app" id="what-you-see-in-the-app">What you see in the app</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Menu item</p></th><th><p>Use it for</p></th></tr></thead><tbody>
<tr><td><p>Dashboard</p></td><td><p>Platform metrics, trends, forecasts, and health.</p></td></tr>
<tr><td><p>Generator Owners</p></td><td><p>Owner accounts, billing settings, status, wallet, export.</p></td></tr>
<tr><td><p>Announcements</p></td><td><p>Platform messages and targeted publishing.</p></td></tr>
<tr><td><p>SMS Templates</p></td><td><p>Owner-specific SMS message templates.</p></td></tr>
<tr><td><p>Monitoring</p></td><td><p>Live sessions, activity logs, locations, history, and force logout.</p></td></tr>
<tr><td><p>Docs</p></td><td><p>This help center.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="permissions-and-safety" id="permissions-and-safety">Permissions and safety</h2>
<aside class="prompt" data-type="warning"><p>Admin actions can affect billing, access, and live customer communication. Confirm the account and action before saving, publishing, deleting, topping up, or force logging out.</p></aside>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">Validation mistakes</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>What you see</p></th><th><p>Likely cause</p></th></tr></thead><tbody>
<tr><td><p>Access denied</p></td><td><p>The signed-in user is not an Admin or the session expired.</p></td></tr>
<tr><td><p>Required field message</p></td><td><p>A form field marked as required is empty.</p></td></tr>
<tr><td><p>Empty list after filtering</p></td><td><p>The active filters are too narrow.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">Common mistakes</h2>
<ul class="list _bullet">
<li><p>Editing the wrong generator owner because multiple owners have similar usernames or business names.</p></li>
<li><p>Publishing an announcement before checking recipients and expiration date.</p></li>
<li><p>Forgetting that SMS templates are loaded per generator owner.</p></li>
<li><p>Force logging out a session without recording a useful reason.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">Troubleshooting</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Problem</p></th><th><p>What to try</p></th></tr></thead><tbody>
<tr><td><p>Page does not load</p></td><td><p>Refresh, confirm your admin session, and try again.</p></td></tr>
<tr><td><p>Form save fails</p></td><td><p>Check required fields, numeric minimums, and server error messages.</p></td></tr>
<tr><td><p>Data looks stale</p></td><td><p>Use the page refresh button or clear filters.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">Related pages</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="Platform metrics and health." href="dashboard.html">Dashboard</a></p></li>
<li><p><a data-tooltip="Account and wallet management." href="generator-owners.html">Generator Owners</a></p></li>
<li><p><a data-tooltip="Live support and security visibility." href="monitoring.html">Monitoring</a></p></li>
</ul>
</section>`),
            ar: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">الغرض من هذه الصفحة</h2>
<p>هذا الدليل مخصص لمستخدم <span class="control">Admin</span>. يشرح لوحة المنصة، إعداد حسابات أصحاب المولدات، عمليات المحفظة، الإعلانات، قوالب SMS، والمراقبة المباشرة.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">قبل أن تبدأ</h2>
<ul class="list _bullet">
<li><p>سجل الدخول بحساب Admin.</p></li>
<li><p>تأكد من صاحب المولد الذي تعمل عليه قبل تعديل الفوترة أو المحفظة أو إعدادات SMS.</p></li>
<li><p>تعامل بحذر مع بيئة الإنتاج. الشحن، تغيير الحالة، نشر الإعلانات، وحذف القوالب يؤثر على مستخدمين حقيقيين.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="your-admin-workflow" id="your-admin-workflow">سير عمل المسؤول</h2>
<ol class="list _decimal" type="1">
<li><p>افتح <a data-tooltip="نظرة عامة على المنصة والمال والنمو والاستخدام والصحة والاتجاهات." href="dashboard.html">Dashboard</a> لمراجعة المنصة.</p></li>
<li><p>استخدم <a data-tooltip="إنشاء وتعديل وتصدير وإدارة حسابات أصحاب المولدات." href="generator-owners.html">Generator Owners</a> لإدارة الحسابات.</p></li>
<li><p>استخدم <a data-tooltip="شحن المحفظة، تعديل السقف، عرض الحركات، وتعطيل أو تفعيل الحساب." href="generator-owner-wallet.html">Wallet Management</a> فقط بعد تأكيد صاحب الحساب والمبلغ.</p></li>
<li><p>استخدم <a data-tooltip="إنشاء وتعديل ونشر وتصدير إعلانات المنصة." href="announcements.html">Announcements</a> لرسائل المنصة.</p></li>
<li><p>استخدم <a data-tooltip="تحميل وصيانة قوالب SMS لصاحب مولد محدد." href="sms-templates.html">SMS Templates</a> عند إعداد أو تصحيح نصوص الرسائل.</p></li>
<li><p>استخدم <a data-tooltip="متابعة الجلسات والنشاط والسجل والموقع وتسجيل الخروج الإجباري عند الحاجة." href="monitoring.html">Monitoring</a> للدعم والأمان.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-in-the-app" id="what-you-see-in-the-app">ما تراه في التطبيق</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>القائمة</p></th><th><p>الاستخدام</p></th></tr></thead><tbody>
<tr><td><p>Dashboard</p></td><td><p>مؤشرات المنصة والاتجاهات والتوقعات والصحة.</p></td></tr>
<tr><td><p>Generator Owners</p></td><td><p>حسابات أصحاب المولدات، الفوترة، الحالة، المحفظة، والتصدير.</p></td></tr>
<tr><td><p>Announcements</p></td><td><p>رسائل المنصة والنشر الموجه.</p></td></tr>
<tr><td><p>SMS Templates</p></td><td><p>قوالب SMS الخاصة بصاحب مولد.</p></td></tr>
<tr><td><p>Monitoring</p></td><td><p>الجلسات المباشرة، سجلات النشاط، المواقع، السجل، وتسجيل الخروج الإجباري.</p></td></tr>
<tr><td><p>Docs</p></td><td><p>مركز المساعدة هذا.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="permissions-and-safety" id="permissions-and-safety">الصلاحيات والسلامة</h2>
<aside class="prompt" data-type="warning"><p>إجراءات المسؤول قد تؤثر على الفوترة والوصول ورسائل العملاء. تأكد من الحساب والإجراء قبل الحفظ أو النشر أو الحذف أو الشحن أو تسجيل الخروج الإجباري.</p></aside>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">أخطاء التحقق</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>ما تراه</p></th><th><p>السبب المحتمل</p></th></tr></thead><tbody>
<tr><td><p>Access denied</p></td><td><p>المستخدم ليس Admin أو انتهت الجلسة.</p></td></tr>
<tr><td><p>Required field message</p></td><td><p>حقل مطلوب فارغ.</p></td></tr>
<tr><td><p>قائمة فارغة بعد الفلترة</p></td><td><p>الفلاتر الحالية ضيقة جدا.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">أخطاء شائعة</h2>
<ul class="list _bullet">
<li><p>تعديل صاحب مولد خاطئ بسبب تشابه أسماء المستخدمين أو أسماء الأعمال.</p></li>
<li><p>نشر إعلان قبل مراجعة المستلمين وتاريخ الانتهاء.</p></li>
<li><p>نسيان أن قوالب SMS تحمل حسب صاحب المولد.</p></li>
<li><p>تسجيل خروج إجباري دون كتابة سبب مفيد.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">استكشاف الأخطاء</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>المشكلة</p></th><th><p>ما تجربه</p></th></tr></thead><tbody>
<tr><td><p>الصفحة لا تحمل</p></td><td><p>حدث الصفحة وتأكد من جلسة المسؤول ثم حاول مرة أخرى.</p></td></tr>
<tr><td><p>فشل الحفظ</p></td><td><p>راجع الحقول المطلوبة والحدود الرقمية ورسائل الخادم.</p></td></tr>
<tr><td><p>البيانات تبدو قديمة</p></td><td><p>استخدم زر التحديث أو امسح الفلاتر.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">صفحات ذات صلة</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="مؤشرات وصحة المنصة." href="dashboard.html">Dashboard</a></p></li>
<li><p><a data-tooltip="إدارة الحسابات والمحافظ." href="generator-owners.html">Generator Owners</a></p></li>
<li><p><a data-tooltip="الدعم المباشر ورؤية الأمان." href="monitoring.html">Monitoring</a></p></li>
</ul>
</section>`)
        },
        keywords: ['Start here', 'Admin', 'Dashboard', 'Generator Owners', 'Monitoring', 'ابدأ', 'مسؤول']
    },
    {
        id: 'dashboard',
        slug: 'dashboard',
        fileName: 'dashboard.html',
        title: text('Dashboard', 'Dashboard'),
        group: text('Platform overview', 'نظرة عامة'),
        appRoute: 'dashboard',
        sections: coreSections,
        contentHtml: {
            en: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">What this page is for</h2>
<p>The <span class="control">Admin Dashboard</span> gives a platform-level overview of generator owners, subscribers, revenue, growth, usage, health, trends, and forecasts.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">Before you start</h2>
<ul class="list _bullet">
<li><p>Choose the correct period from the toolbar.</p></li>
<li><p>Enable or disable trends and forecasts depending on the question you are answering.</p></li>
<li><p>Use Refresh before reporting numbers.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">Regular workflow</h2>
<ol class="list _decimal" type="1">
<li><p>Select a <span class="control">Period</span>.</p></li>
<li><p>Review the KPI cards at the top.</p></li>
<li><p>Use tabs: Overview, Financial, Growth, Usage, Health, and Trends.</p></li>
<li><p>In Trends, select the metric you want to chart.</p></li>
<li><p>Refresh after changing filters or before sharing figures.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">What you see on this page</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Area</p></th><th><p>Meaning</p></th></tr></thead><tbody>
<tr><td><p>KPI cards</p></td><td><p>Fast platform totals and financial highlights.</p></td></tr>
<tr><td><p>Overview</p></td><td><p>Platform and operational metrics.</p></td></tr>
<tr><td><p>Financial</p></td><td><p>Revenue, accounting summary, pricing averages.</p></td></tr>
<tr><td><p>Growth</p></td><td><p>Growth metrics and optional forecasts.</p></td></tr>
<tr><td><p>Usage / Health</p></td><td><p>Usage, top performers, health, and consumption.</p></td></tr>
<tr><td><p>Trends</p></td><td><p>Monthly, weekly, and daily charts and tables.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">Step-by-step</h2>
<ol class="list _decimal" type="1">
<li><p>Menu - Dashboard.</p></li>
<li><p>Pick Period.</p></li>
<li><p>Toggle Trends or Forecasts if needed.</p></li>
<li><p>Open the tab that matches your question.</p></li>
<li><p>Use Refresh before making decisions from the data.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">Validation mistakes</h2>
<p>This page is read-only. The main mistakes are using the wrong period or forgetting that trends and forecasts can be disabled from the toolbar.</p>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">Common mistakes</h2>
<ul class="list _bullet">
<li><p>Comparing numbers from different periods.</p></li>
<li><p>Reporting trend charts while Trends is disabled.</p></li>
<li><p>Using dashboard totals as a substitute for detailed owner investigation.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">Troubleshooting</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Problem</p></th><th><p>What to try</p></th></tr></thead><tbody>
<tr><td><p>Failed to load dashboard</p></td><td><p>Refresh and confirm your admin session.</p></td></tr>
<tr><td><p>Forecasts missing</p></td><td><p>Enable Forecasts in the toolbar.</p></td></tr>
<tr><td><p>Trend chart empty</p></td><td><p>Enable Trends and try another metric.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">Related pages</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="Investigate owners behind the dashboard numbers." href="generator-owners.html">Generator Owners</a></p></li>
<li><p><a data-tooltip="Live usage and session visibility." href="monitoring.html">Monitoring</a></p></li>
</ul>
</section>`),
            ar: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">الغرض من هذه الصفحة</h2>
<p>تعطي صفحة <span class="control">Admin Dashboard</span> نظرة عامة على أصحاب المولدات والمشتركين والإيرادات والنمو والاستخدام والصحة والاتجاهات والتوقعات.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">قبل أن تبدأ</h2>
<ul class="list _bullet">
<li><p>اختر الفترة الصحيحة من الشريط العلوي.</p></li>
<li><p>فعل أو أوقف الاتجاهات والتوقعات حسب السؤال المطلوب.</p></li>
<li><p>استخدم Refresh قبل اعتماد الأرقام.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">سير العمل المعتاد</h2>
<ol class="list _decimal" type="1">
<li><p>اختر <span class="control">Period</span>.</p></li>
<li><p>راجع بطاقات KPI في الأعلى.</p></li>
<li><p>استخدم التبويبات: Overview و Financial و Growth و Usage و Health و Trends.</p></li>
<li><p>في Trends اختر المؤشر المطلوب رسمه.</p></li>
<li><p>حدث الصفحة بعد تغيير الفلاتر أو قبل مشاركة الأرقام.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">ما تراه على هذه الصفحة</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>المنطقة</p></th><th><p>المعنى</p></th></tr></thead><tbody>
<tr><td><p>KPI cards</p></td><td><p>إجماليات ومؤشرات مالية سريعة.</p></td></tr>
<tr><td><p>Overview</p></td><td><p>مؤشرات المنصة والتشغيل.</p></td></tr>
<tr><td><p>Financial</p></td><td><p>الإيرادات والملخص المحاسبي ومتوسطات الأسعار.</p></td></tr>
<tr><td><p>Growth</p></td><td><p>مؤشرات النمو والتوقعات عند تفعيلها.</p></td></tr>
<tr><td><p>Usage / Health</p></td><td><p>الاستخدام والأفضل أداء والصحة والاستهلاك.</p></td></tr>
<tr><td><p>Trends</p></td><td><p>رسوم وجداول شهرية وأسبوعية ويومية.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">خطوة بخطوة</h2>
<ol class="list _decimal" type="1">
<li><p>القائمة - Dashboard.</p></li>
<li><p>اختر Period.</p></li>
<li><p>فعل Trends أو Forecasts عند الحاجة.</p></li>
<li><p>افتح التبويب المناسب للسؤال.</p></li>
<li><p>استخدم Refresh قبل اتخاذ قرار من البيانات.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">أخطاء التحقق</h2>
<p>هذه الصفحة للقراءة فقط. الأخطاء الأساسية هي اختيار فترة خاطئة أو نسيان أن Trends و Forecasts يمكن إيقافهما.</p>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">أخطاء شائعة</h2>
<ul class="list _bullet">
<li><p>مقارنة أرقام من فترات مختلفة.</p></li>
<li><p>الاعتماد على رسوم Trends وهي غير مفعلة.</p></li>
<li><p>استخدام الإجماليات بدل التحقيق في صاحب مولد محدد.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">استكشاف الأخطاء</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>المشكلة</p></th><th><p>ما تجربه</p></th></tr></thead><tbody>
<tr><td><p>فشل تحميل Dashboard</p></td><td><p>حدث الصفحة وتأكد من جلسة المسؤول.</p></td></tr>
<tr><td><p>التوقعات غير ظاهرة</p></td><td><p>فعل Forecasts من الشريط العلوي.</p></td></tr>
<tr><td><p>رسم الاتجاه فارغ</p></td><td><p>فعل Trends وجرب مؤشرا آخر.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">صفحات ذات صلة</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="تحليل أصحاب المولدات خلف أرقام Dashboard." href="generator-owners.html">Generator Owners</a></p></li>
<li><p><a data-tooltip="رؤية الاستخدام والجلسات المباشرة." href="monitoring.html">Monitoring</a></p></li>
</ul>
</section>`)
        },
        keywords: ['Dashboard', 'KPIs', 'financial', 'growth', 'usage', 'health', 'trends', 'forecasts']
    },
    {
        id: 'generator-owners',
        slug: 'generator-owners',
        fileName: 'generator-owners.html',
        title: text('Generator Owners', 'Generator Owners'),
        group: text('Accounts', 'الحسابات'),
        appRoute: 'generator-owners',
        sections: coreSections,
        contentHtml: {
            en: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">What this page is for</h2>
<p>The <span class="control">Generator Owners</span> page lists generator owner accounts. Use it to create owners, edit account and billing settings, export CSV, and open wallet management.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">Before you start</h2>
<ul class="list _bullet">
<li><p>Confirm the owner username, business name, and phone number.</p></li>
<li><p>Know whether you are creating a new account or editing an existing one.</p></li>
<li><p>For wallet work, confirm the owner before pressing the wallet button.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">Regular workflow</h2>
<ol class="list _decimal" type="1">
<li><p>Search or sort the table to find the owner.</p></li>
<li><p>Use <span class="control">New</span> for a new owner or the pencil icon to edit.</p></li>
<li><p>Use the wallet icon for <a data-tooltip="Top up wallet, override cap, view transactions, and manage active/deactivated status." href="generator-owner-wallet.html">Wallet Management</a>.</p></li>
<li><p>Select rows and use Export when you need a CSV.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">What you see on this page</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Control</p></th><th><p>Use it for</p></th></tr></thead><tbody>
<tr><td><p>Search keyword</p></td><td><p>Search by id, username, name, business, or phone.</p></td></tr>
<tr><td><p>New</p></td><td><p>Create a generator owner account.</p></td></tr>
<tr><td><p>Pencil</p></td><td><p>Edit account and billing settings.</p></td></tr>
<tr><td><p>Wallet</p></td><td><p>Open wallet, cap, transactions, and account status tools.</p></td></tr>
<tr><td><p>Export</p></td><td><p>Export all rows or selected rows to CSV.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">Step-by-step</h2>
<ol class="list _decimal" type="1">
<li><p>Menu - Generator Owners.</p></li>
<li><p>Use search or table sorting.</p></li>
<li><p>Click New, pencil, wallet, or Export depending on the task.</p></li>
<li><p>After saving an owner, confirm the row updates.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">Validation mistakes</h2>
<p>This page itself mainly filters and opens dialogs. Validation happens inside <a data-tooltip="Create and edit owner account, business, billing, pricing, trial, and currency settings." href="generator-owner-account.html">Generator Owner Account</a> and <a data-tooltip="Wallet top-up, cap, status, and transactions." href="generator-owner-wallet.html">Wallet Management</a>.</p>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">Common mistakes</h2>
<ul class="list _bullet">
<li><p>Editing the wrong owner after using a broad search keyword.</p></li>
<li><p>Exporting all rows when only selected rows were intended.</p></li>
<li><p>Opening wallet management before confirming the owner username.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">Troubleshooting</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Problem</p></th><th><p>What to try</p></th></tr></thead><tbody>
<tr><td><p>No owners found</p></td><td><p>Clear filters and refresh the page.</p></td></tr>
<tr><td><p>CSV missing rows</p></td><td><p>Check whether only selected rows were exported.</p></td></tr>
<tr><td><p>Dialog data stale</p></td><td><p>Close and reopen the dialog after refreshing the list.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">Related pages</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="Create or edit owner details and billing." href="generator-owner-account.html">Generator Owner Account</a></p></li>
<li><p><a data-tooltip="Wallet, cap, transactions, and status tools." href="generator-owner-wallet.html">Wallet Management</a></p></li>
<li><p><a data-tooltip="Owner-specific SMS templates." href="sms-templates.html">SMS Templates</a></p></li>
</ul>
</section>`),
            ar: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">الغرض من هذه الصفحة</h2>
<p>تعرض صفحة <span class="control">Generator Owners</span> حسابات أصحاب المولدات. استخدمها لإنشاء حسابات، تعديل الحساب والفوترة، تصدير CSV، وفتح إدارة المحفظة.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">قبل أن تبدأ</h2>
<ul class="list _bullet">
<li><p>تأكد من اسم المستخدم واسم العمل ورقم الهاتف.</p></li>
<li><p>اعرف إن كنت تنشئ حسابا جديدا أو تعدل حسابا موجودا.</p></li>
<li><p>في عمل المحفظة، تأكد من صاحب الحساب قبل الضغط على زر المحفظة.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">سير العمل المعتاد</h2>
<ol class="list _decimal" type="1">
<li><p>ابحث أو رتب الجدول للعثور على صاحب المولد.</p></li>
<li><p>استخدم <span class="control">New</span> لحساب جديد أو أيقونة القلم للتعديل.</p></li>
<li><p>استخدم أيقونة المحفظة لفتح <a data-tooltip="شحن المحفظة، تعديل السقف، عرض الحركات، وإدارة حالة الحساب." href="generator-owner-wallet.html">Wallet Management</a>.</p></li>
<li><p>حدد صفوفا واستخدم Export عند الحاجة إلى CSV.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">ما تراه على هذه الصفحة</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>العنصر</p></th><th><p>الاستخدام</p></th></tr></thead><tbody>
<tr><td><p>Search keyword</p></td><td><p>البحث بالرقم أو اسم المستخدم أو الاسم أو العمل أو الهاتف.</p></td></tr>
<tr><td><p>New</p></td><td><p>إنشاء حساب صاحب مولد.</p></td></tr>
<tr><td><p>Pencil</p></td><td><p>تعديل الحساب وإعدادات الفوترة.</p></td></tr>
<tr><td><p>Wallet</p></td><td><p>فتح أدوات المحفظة والسقف والحركات والحالة.</p></td></tr>
<tr><td><p>Export</p></td><td><p>تصدير كل الصفوف أو الصفوف المحددة إلى CSV.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">خطوة بخطوة</h2>
<ol class="list _decimal" type="1">
<li><p>القائمة - Generator Owners.</p></li>
<li><p>استخدم البحث أو ترتيب الجدول.</p></li>
<li><p>اضغط New أو القلم أو المحفظة أو Export حسب المهمة.</p></li>
<li><p>بعد الحفظ، تأكد أن الصف تم تحديثه.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">أخطاء التحقق</h2>
<p>هذه الصفحة تفتح النوافذ وتفلتر الجدول. التحقق يحدث داخل <a data-tooltip="إنشاء وتعديل بيانات صاحب المولد والفوترة والتسعير والتجربة والعملات." href="generator-owner-account.html">Generator Owner Account</a> و <a data-tooltip="الشحن والسقف والحالة والحركات." href="generator-owner-wallet.html">Wallet Management</a>.</p>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">أخطاء شائعة</h2>
<ul class="list _bullet">
<li><p>تعديل صاحب مولد خاطئ بعد استخدام بحث واسع.</p></li>
<li><p>تصدير كل الصفوف بينما المطلوب الصفوف المحددة فقط.</p></li>
<li><p>فتح المحفظة قبل تأكيد اسم المستخدم.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">استكشاف الأخطاء</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>المشكلة</p></th><th><p>ما تجربه</p></th></tr></thead><tbody>
<tr><td><p>لا يوجد أصحاب مولدات</p></td><td><p>امسح الفلاتر وحدث الصفحة.</p></td></tr>
<tr><td><p>CSV ناقص</p></td><td><p>تأكد إن كان التصدير للصفوف المحددة فقط.</p></td></tr>
<tr><td><p>بيانات النافذة قديمة</p></td><td><p>أغلق النافذة وافتحها بعد تحديث القائمة.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">صفحات ذات صلة</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="إنشاء أو تعديل بيانات وفوترة صاحب المولد." href="generator-owner-account.html">Generator Owner Account</a></p></li>
<li><p><a data-tooltip="أدوات المحفظة والسقف والحركات والحالة." href="generator-owner-wallet.html">Wallet Management</a></p></li>
<li><p><a data-tooltip="قوالب SMS الخاصة بصاحب المولد." href="sms-templates.html">SMS Templates</a></p></li>
</ul>
</section>`)
        },
        keywords: ['Accounts', 'Generator Owners', 'owner', 'export', 'wallet', 'status', 'business']
    },
    {
        id: 'generator-owner-account',
        slug: 'generator-owner-account',
        fileName: 'generator-owner-account.html',
        title: text('Generator Owner Account', 'حساب صاحب المولد'),
        group: text('Accounts', 'الحسابات'),
        appRoute: 'generator-owners',
        sections: coreSections,
        contentHtml: {
            en: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">What this page is for</h2>
<p>The account dialog creates or edits a generator owner. It covers login credentials, business details, billing settings, pricing, yearly discounts, free trial, wallet setup on create, and currency rates.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">Before you start</h2>
<ul class="list _bullet">
<li><p>Collect username, owner name, business name, phone number, and pricing terms.</p></li>
<li><p>For create mode, prepare password and required pricing values.</p></li>
<li><p>For yearly payment, know at least one yearly discount value.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">Regular workflow</h2>
<ol class="list _decimal" type="1">
<li><p>Open <a data-tooltip="List of all generator owner accounts." href="generator-owners.html">Generator Owners</a>.</p></li>
<li><p>Click <span class="control">New</span> or the pencil icon.</p></li>
<li><p>Fill Account and Business Details.</p></li>
<li><p>Fill Billing, Pricing, yearly payment, trial, and currency rates as needed.</p></li>
<li><p>Click Create or Update and wait for the list to update.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">What you see on this page</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Section</p></th><th><p>Purpose</p></th></tr></thead><tbody>
<tr><td><p>Account</p></td><td><p>Username and password. Password is required only on create.</p></td></tr>
<tr><td><p>Business Details</p></td><td><p>Name, business name, phone, SMS display name.</p></td></tr>
<tr><td><p>Billing</p></td><td><p>Grace period, cycle days, start date, pricing.</p></td></tr>
<tr><td><p>Yearly Payment</p></td><td><p>Enables yearly discount fields.</p></td></tr>
<tr><td><p>Free Trial</p></td><td><p>Trial months before billing.</p></td></tr>
<tr><td><p>Wallet</p></td><td><p>Create-only initial balance, cap override, payment method, reference.</p></td></tr>
<tr><td><p>Currency Rates</p></td><td><p>Optional conversion rate overrides.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">Step-by-step</h2>
<ol class="list _decimal" type="1">
<li><p>Choose create or edit mode.</p></li>
<li><p>Fill required fields marked with an asterisk.</p></li>
<li><p>Use +961 phone input without manually typing the country code.</p></li>
<li><p>Enable yearly payment only when discounts are known.</p></li>
<li><p>Add currency rates only if override rates are needed.</p></li>
<li><p>Save.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">Validation mistakes</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Message</p></th><th><p>Fix</p></th></tr></thead><tbody>
<tr><td><p>Username is required</p></td><td><p>Enter a login username.</p></td></tr>
<tr><td><p>Password is required</p></td><td><p>Only create mode requires a password of at least 6 characters.</p></td></tr>
<tr><td><p>Required on create and must be greater than 0</p></td><td><p>Enter price per subscriber and price per SMS.</p></td></tr>
<tr><td><p>Provide at least one yearly discount</p></td><td><p>Either add a yearly discount or turn off Yearly Payment.</p></td></tr>
<tr><td><p>Currency rate required</p></td><td><p>Complete From, To, Date, and Rate for every currency row.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">Common mistakes</h2>
<ul class="list _bullet">
<li><p>Leaving password blank while creating a new owner.</p></li>
<li><p>Entering a phone number with +961 inside the phone field.</p></li>
<li><p>Turning on Yearly Payment without a discount.</p></li>
<li><p>Changing billing pricing without coordinating wallet balance expectations.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">Troubleshooting</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Problem</p></th><th><p>What to try</p></th></tr></thead><tbody>
<tr><td><p>Save does nothing</p></td><td><p>Scroll the form and check required validation messages.</p></td></tr>
<tr><td><p>Owner not added to list</p></td><td><p>Close the dialog and refresh Generator Owners.</p></td></tr>
<tr><td><p>Currency dropdown empty</p></td><td><p>Wait for currencies to load or reopen the dialog.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">Related pages</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="Owner list and entry point." href="generator-owners.html">Generator Owners</a></p></li>
<li><p><a data-tooltip="Wallet and account status tools." href="generator-owner-wallet.html">Wallet Management</a></p></li>
<li><p><a data-tooltip="Owner-specific message templates." href="sms-templates.html">SMS Templates</a></p></li>
</ul>
</section>`),
            ar: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">الغرض من هذه الصفحة</h2>
<p>نافذة الحساب تنشئ أو تعدل صاحب مولد. تشمل بيانات الدخول، بيانات العمل، إعدادات الفوترة، التسعير، خصومات الدفع السنوي، التجربة المجانية، إعداد المحفظة عند الإنشاء، وأسعار العملات.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">قبل أن تبدأ</h2>
<ul class="list _bullet">
<li><p>جهز اسم المستخدم واسم صاحب الحساب واسم العمل ورقم الهاتف وشروط التسعير.</p></li>
<li><p>في وضع الإنشاء، جهز كلمة المرور وقيم التسعير المطلوبة.</p></li>
<li><p>للدفع السنوي، جهز قيمة خصم واحدة على الأقل.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">سير العمل المعتاد</h2>
<ol class="list _decimal" type="1">
<li><p>افتح <a data-tooltip="قائمة حسابات أصحاب المولدات." href="generator-owners.html">Generator Owners</a>.</p></li>
<li><p>اضغط <span class="control">New</span> أو أيقونة القلم.</p></li>
<li><p>املأ Account و Business Details.</p></li>
<li><p>املأ Billing و Pricing والدفع السنوي والتجربة وأسعار العملات عند الحاجة.</p></li>
<li><p>اضغط Create أو Update وانتظر تحديث القائمة.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">ما تراه على هذه الصفحة</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>القسم</p></th><th><p>الغرض</p></th></tr></thead><tbody>
<tr><td><p>Account</p></td><td><p>اسم المستخدم وكلمة المرور. كلمة المرور مطلوبة عند الإنشاء فقط.</p></td></tr>
<tr><td><p>Business Details</p></td><td><p>الاسم واسم العمل والهاتف واسم SMS.</p></td></tr>
<tr><td><p>Billing</p></td><td><p>فترة السماح وأيام الدورة وتاريخ البداية والتسعير.</p></td></tr>
<tr><td><p>Yearly Payment</p></td><td><p>يفعل حقول الخصومات السنوية.</p></td></tr>
<tr><td><p>Free Trial</p></td><td><p>أشهر تجربة قبل بدء الفوترة.</p></td></tr>
<tr><td><p>Wallet</p></td><td><p>عند الإنشاء فقط: رصيد أولي وسقف وطريقة دفع ومرجع.</p></td></tr>
<tr><td><p>Currency Rates</p></td><td><p>تجاوزات اختيارية لأسعار التحويل.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">خطوة بخطوة</h2>
<ol class="list _decimal" type="1">
<li><p>اختر الإنشاء أو التعديل.</p></li>
<li><p>املأ الحقول المطلوبة بعلامة النجمة.</p></li>
<li><p>استخدم حقل +961 بدون كتابة رمز الدولة يدويا.</p></li>
<li><p>فعل الدفع السنوي فقط عند معرفة الخصومات.</p></li>
<li><p>أضف أسعار العملات فقط عند الحاجة إلى تجاوز.</p></li>
<li><p>احفظ.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">أخطاء التحقق</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>الرسالة</p></th><th><p>الحل</p></th></tr></thead><tbody>
<tr><td><p>Username is required</p></td><td><p>أدخل اسم مستخدم.</p></td></tr>
<tr><td><p>Password is required</p></td><td><p>كلمة المرور مطلوبة فقط عند الإنشاء ويجب أن تكون 6 أحرف على الأقل.</p></td></tr>
<tr><td><p>Required on create and must be greater than 0</p></td><td><p>أدخل سعر المشترك وسعر SMS.</p></td></tr>
<tr><td><p>Provide at least one yearly discount</p></td><td><p>أضف خصما سنويا أو أوقف Yearly Payment.</p></td></tr>
<tr><td><p>Currency rate required</p></td><td><p>أكمل From و To و Date و Rate لكل صف عملة.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">أخطاء شائعة</h2>
<ul class="list _bullet">
<li><p>ترك كلمة المرور فارغة عند إنشاء صاحب مولد جديد.</p></li>
<li><p>إدخال +961 داخل حقل الهاتف.</p></li>
<li><p>تفعيل الدفع السنوي دون إدخال خصم.</p></li>
<li><p>تغيير التسعير دون تنسيق توقعات رصيد المحفظة.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">استكشاف الأخطاء</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>المشكلة</p></th><th><p>ما تجربه</p></th></tr></thead><tbody>
<tr><td><p>زر الحفظ لا يفعل شيئا</p></td><td><p>مرر داخل النموذج وراجع رسائل الحقول المطلوبة.</p></td></tr>
<tr><td><p>الحساب لم يظهر في القائمة</p></td><td><p>أغلق النافذة وحدث Generator Owners.</p></td></tr>
<tr><td><p>قائمة العملات فارغة</p></td><td><p>انتظر تحميل العملات أو أعد فتح النافذة.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">صفحات ذات صلة</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="قائمة أصحاب المولدات ونقطة الدخول." href="generator-owners.html">Generator Owners</a></p></li>
<li><p><a data-tooltip="أدوات المحفظة وحالة الحساب." href="generator-owner-wallet.html">Wallet Management</a></p></li>
<li><p><a data-tooltip="قوالب الرسائل الخاصة بصاحب المولد." href="sms-templates.html">SMS Templates</a></p></li>
</ul>
</section>`)
        },
        keywords: ['Accounts', 'Generator Owner Account', 'billing', 'pricing', 'yearly', 'trial', 'currency']
    },
    {
        id: 'generator-owner-wallet',
        slug: 'generator-owner-wallet',
        fileName: 'generator-owner-wallet.html',
        title: text('Wallet Management', 'إدارة المحفظة'),
        group: text('Accounts', 'الحسابات'),
        appRoute: 'generator-owners',
        sections: coreSections,
        contentHtml: {
            en: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">What this page is for</h2>
<p><span class="control">Wallet Management</span> lets admins review a generator owner wallet, top up funds, set a cap override, deactivate/reactivate access, and inspect wallet transactions.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">Before you start</h2>
<ul class="list _bullet">
<li><p>Confirm the generator owner username and id at the top of the dialog.</p></li>
<li><p>For top-up, confirm amount, payment method, and reference number.</p></li>
<li><p>For status changes, prepare a clear reason.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">Regular workflow</h2>
<ol class="list _decimal" type="1">
<li><p>Open <a data-tooltip="Find the owner first, then click the wallet icon." href="generator-owners.html">Generator Owners</a> and click the wallet icon.</p></li>
<li><p>Review Wallet Overview: balance, available balance, cap, next billing date, and status.</p></li>
<li><p>Use Top Up only after payment confirmation.</p></li>
<li><p>Use Cap Override with a documented reason.</p></li>
<li><p>Use Status actions only when deactivation/reactivation is intentional.</p></li>
<li><p>Review Transactions with filters when reconciling wallet history.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">What you see on this page</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Section</p></th><th><p>Purpose</p></th></tr></thead><tbody>
<tr><td><p>Wallet Overview</p></td><td><p>Balance, available balance, effective cap, next billing date, warning message, status.</p></td></tr>
<tr><td><p>Top Up Wallet</p></td><td><p>Add funds with amount, payment method, reference, and notes.</p></td></tr>
<tr><td><p>Cap Override</p></td><td><p>Set a custom wallet cap with a reason.</p></td></tr>
<tr><td><p>Status</p></td><td><p>Deactivate or reactivate owner access with a reason.</p></td></tr>
<tr><td><p>Transactions</p></td><td><p>Filter and review wallet transaction history.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">Step-by-step</h2>
<ol class="list _decimal" type="1">
<li><p>Click the wallet icon from the owner row.</p></li>
<li><p>Confirm the header owner name and id.</p></li>
<li><p>Choose Top Up, Cap Override, Status, or Transactions.</p></li>
<li><p>Fill required fields and submit.</p></li>
<li><p>Refresh the header and transaction list after changes.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">Validation mistakes</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Message</p></th><th><p>Fix</p></th></tr></thead><tbody>
<tr><td><p>Amount must be at least 1</p></td><td><p>Enter a positive top-up amount.</p></td></tr>
<tr><td><p>Payment method is required</p></td><td><p>Select the payment method from the dropdown.</p></td></tr>
<tr><td><p>Reference number is required</p></td><td><p>Enter the payment reference number.</p></td></tr>
<tr><td><p>Reason is required</p></td><td><p>Add a reason for cap override or status change.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">Common mistakes</h2>
<ul class="list _bullet">
<li><p>Topping up the wrong owner because the wallet dialog was opened from the wrong row.</p></li>
<li><p>Using a vague reference number or missing notes for reconciliation.</p></li>
<li><p>Setting a cap override without a meaningful reason.</p></li>
<li><p>Deactivating an owner when only wallet top-up was needed.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">Troubleshooting</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Problem</p></th><th><p>What to try</p></th></tr></thead><tbody>
<tr><td><p>Balance did not change</p></td><td><p>Refresh the wallet header and check transactions.</p></td></tr>
<tr><td><p>Transactions missing</p></td><td><p>Clear date/type filters and reload.</p></td></tr>
<tr><td><p>Status tag did not update</p></td><td><p>Refresh the dialog or reopen wallet management.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">Related pages</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="Find the owner and open wallet." href="generator-owners.html">Generator Owners</a></p></li>
<li><p><a data-tooltip="Billing and pricing setup for the owner." href="generator-owner-account.html">Generator Owner Account</a></p></li>
<li><p><a data-tooltip="Revenue and financial overview." href="dashboard.html">Dashboard</a></p></li>
</ul>
</section>`),
            ar: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">الغرض من هذه الصفحة</h2>
<p>تتيح <span class="control">Wallet Management</span> مراجعة محفظة صاحب المولد، شحن الرصيد، تعديل السقف، تعطيل أو تفعيل الوصول، ومراجعة حركات المحفظة.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">قبل أن تبدأ</h2>
<ul class="list _bullet">
<li><p>تأكد من اسم المستخدم ورقم صاحب المولد في أعلى النافذة.</p></li>
<li><p>للشحن، أكد المبلغ وطريقة الدفع ورقم المرجع.</p></li>
<li><p>لتغيير الحالة، جهز سببا واضحا.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">سير العمل المعتاد</h2>
<ol class="list _decimal" type="1">
<li><p>افتح <a data-tooltip="ابحث عن صاحب المولد ثم اضغط أيقونة المحفظة." href="generator-owners.html">Generator Owners</a> واضغط أيقونة المحفظة.</p></li>
<li><p>راجع Wallet Overview: الرصيد، المتاح، السقف، تاريخ الفوترة التالي، والحالة.</p></li>
<li><p>استخدم Top Up فقط بعد تأكيد الدفع.</p></li>
<li><p>استخدم Cap Override مع سبب موثق.</p></li>
<li><p>استخدم Status فقط عند قصد التعطيل أو التفعيل.</p></li>
<li><p>راجع Transactions مع الفلاتر عند مطابقة سجل المحفظة.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">ما تراه على هذه الصفحة</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>القسم</p></th><th><p>الغرض</p></th></tr></thead><tbody>
<tr><td><p>Wallet Overview</p></td><td><p>الرصيد، المتاح، السقف الفعال، تاريخ الفوترة التالي، التحذير، والحالة.</p></td></tr>
<tr><td><p>Top Up Wallet</p></td><td><p>إضافة رصيد مع المبلغ وطريقة الدفع والمرجع والملاحظات.</p></td></tr>
<tr><td><p>Cap Override</p></td><td><p>تعيين سقف مخصص مع سبب.</p></td></tr>
<tr><td><p>Status</p></td><td><p>تعطيل أو تفعيل وصول صاحب المولد مع سبب.</p></td></tr>
<tr><td><p>Transactions</p></td><td><p>فلترة ومراجعة سجل حركات المحفظة.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">خطوة بخطوة</h2>
<ol class="list _decimal" type="1">
<li><p>اضغط أيقونة المحفظة من صف صاحب المولد.</p></li>
<li><p>أكد اسم ورقم صاحب الحساب في الأعلى.</p></li>
<li><p>اختر Top Up أو Cap Override أو Status أو Transactions.</p></li>
<li><p>املأ الحقول المطلوبة وأرسل.</p></li>
<li><p>حدث الرأس وقائمة الحركات بعد التغييرات.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">أخطاء التحقق</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>الرسالة</p></th><th><p>الحل</p></th></tr></thead><tbody>
<tr><td><p>Amount must be at least 1</p></td><td><p>أدخل مبلغ شحن موجب.</p></td></tr>
<tr><td><p>Payment method is required</p></td><td><p>اختر طريقة الدفع.</p></td></tr>
<tr><td><p>Reference number is required</p></td><td><p>أدخل رقم المرجع.</p></td></tr>
<tr><td><p>Reason is required</p></td><td><p>أضف سببا لتعديل السقف أو تغيير الحالة.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">أخطاء شائعة</h2>
<ul class="list _bullet">
<li><p>شحن صاحب مولد خاطئ لأن نافذة المحفظة فتحت من صف غير صحيح.</p></li>
<li><p>استخدام رقم مرجع غير واضح أو ملاحظات ناقصة للمطابقة.</p></li>
<li><p>تعيين سقف مخصص دون سبب مفيد.</p></li>
<li><p>تعطيل صاحب المولد بينما المطلوب كان شحن المحفظة فقط.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">استكشاف الأخطاء</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>المشكلة</p></th><th><p>ما تجربه</p></th></tr></thead><tbody>
<tr><td><p>الرصيد لم يتغير</p></td><td><p>حدث رأس المحفظة وراجع الحركات.</p></td></tr>
<tr><td><p>الحركات غير ظاهرة</p></td><td><p>امسح فلاتر التاريخ أو النوع وأعد التحميل.</p></td></tr>
<tr><td><p>الحالة لم تتحدث</p></td><td><p>حدث النافذة أو أعد فتح إدارة المحفظة.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">صفحات ذات صلة</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="البحث عن صاحب المولد وفتح المحفظة." href="generator-owners.html">Generator Owners</a></p></li>
<li><p><a data-tooltip="إعداد الفوترة والتسعير." href="generator-owner-account.html">Generator Owner Account</a></p></li>
<li><p><a data-tooltip="نظرة مالية وإيرادات." href="dashboard.html">Dashboard</a></p></li>
</ul>
</section>`)
        },
        keywords: ['Accounts', 'Wallet', 'top up', 'cap override', 'deactivate', 'reactivate', 'transactions']
    },
    {
        id: 'announcements',
        slug: 'announcements',
        fileName: 'announcements.html',
        title: text('Announcements', 'Announcements'),
        group: text('Communication', 'التواصل'),
        appRoute: 'announcements',
        sections: coreSections,
        contentHtml: {
            en: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">What this page is for</h2>
<p><span class="control">Admin Announcements</span> lets admins create, edit, publish, delete, filter, and export platform announcements.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">Before you start</h2>
<ul class="list _bullet">
<li><p>Prepare title, content, priority, and expiration date.</p></li>
<li><p>Decide whether the announcement is for all generator owners or selected owners.</p></li>
<li><p>Review carefully before publishing. Published announcements cannot be unpublished from this screen.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">Regular workflow</h2>
<ol class="list _decimal" type="1">
<li><p>Use filters to find existing announcements.</p></li>
<li><p>Click <span class="control">New</span> or pencil to create/edit.</p></li>
<li><p>Save the announcement.</p></li>
<li><p>Click the send icon to publish to all or selected generator owners.</p></li>
<li><p>Use Export CSV for reporting or audit review.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">What you see on this page</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Control</p></th><th><p>Use it for</p></th></tr></thead><tbody>
<tr><td><p>Keyword / Published filters</p></td><td><p>Find announcements by text and publish state.</p></td></tr>
<tr><td><p>New / Pencil</p></td><td><p>Create or edit title, content, priority, expiration.</p></td></tr>
<tr><td><p>Send</p></td><td><p>Publish to all or selected generator owners.</p></td></tr>
<tr><td><p>Trash</p></td><td><p>Delete an announcement.</p></td></tr>
<tr><td><p>Stats</p></td><td><p>Recipient count and read count.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">Step-by-step</h2>
<ol class="list _decimal" type="1">
<li><p>Menu - Announcements.</p></li>
<li><p>Click New.</p></li>
<li><p>Enter title, content, priority, and expiration date.</p></li>
<li><p>Save.</p></li>
<li><p>Click send and choose publish target.</p></li>
<li><p>Confirm recipient count after publish.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">Validation mistakes</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Message</p></th><th><p>Fix</p></th></tr></thead><tbody>
<tr><td><p>Title is required</p></td><td><p>Enter a title.</p></td></tr>
<tr><td><p>Content is required</p></td><td><p>Enter announcement content.</p></td></tr>
<tr><td><p>Priority is required</p></td><td><p>Select a priority.</p></td></tr>
<tr><td><p>Expiration date/time is required</p></td><td><p>Select an expiration date.</p></td></tr>
<tr><td><p>Select at least one Generator Owner</p></td><td><p>When Publish to all is off, choose recipients.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">Common mistakes</h2>
<ul class="list _bullet">
<li><p>Publishing before checking expiration date.</p></li>
<li><p>Leaving Publish to all on when only selected owners should receive it.</p></li>
<li><p>Deleting the wrong draft announcement.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">Troubleshooting</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Problem</p></th><th><p>What to try</p></th></tr></thead><tbody>
<tr><td><p>No announcements found</p></td><td><p>Reset filters and reload.</p></td></tr>
<tr><td><p>Send button disabled</p></td><td><p>The announcement may already be published.</p></td></tr>
<tr><td><p>Owner list not loading in publish dialog</p></td><td><p>Close and reopen the publish dialog.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">Related pages</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="Owner list used for targeted publish." href="generator-owners.html">Generator Owners</a></p></li>
<li><p><a data-tooltip="Owner-specific SMS messages." href="sms-templates.html">SMS Templates</a></p></li>
</ul>
</section>`),
            ar: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">الغرض من هذه الصفحة</h2>
<p>تتيح <span class="control">Admin Announcements</span> إنشاء وتعديل ونشر وحذف وفلترة وتصدير إعلانات المنصة.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">قبل أن تبدأ</h2>
<ul class="list _bullet">
<li><p>جهز العنوان والمحتوى والأولوية وتاريخ الانتهاء.</p></li>
<li><p>حدد إن كان الإعلان لكل أصحاب المولدات أو لمجموعة محددة.</p></li>
<li><p>راجع بعناية قبل النشر. لا توجد عملية إلغاء نشر من هذه الشاشة.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">سير العمل المعتاد</h2>
<ol class="list _decimal" type="1">
<li><p>استخدم الفلاتر للعثور على إعلان موجود.</p></li>
<li><p>اضغط <span class="control">New</span> أو القلم للإنشاء أو التعديل.</p></li>
<li><p>احفظ الإعلان.</p></li>
<li><p>اضغط أيقونة الإرسال للنشر إلى الجميع أو أصحاب مولدات محددين.</p></li>
<li><p>استخدم Export CSV للتقارير أو المراجعة.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">ما تراه على هذه الصفحة</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>العنصر</p></th><th><p>الاستخدام</p></th></tr></thead><tbody>
<tr><td><p>Keyword / Published filters</p></td><td><p>البحث بالنص وحالة النشر.</p></td></tr>
<tr><td><p>New / Pencil</p></td><td><p>إنشاء أو تعديل العنوان والمحتوى والأولوية والانتهاء.</p></td></tr>
<tr><td><p>Send</p></td><td><p>النشر للجميع أو لمجموعة محددة.</p></td></tr>
<tr><td><p>Trash</p></td><td><p>حذف إعلان.</p></td></tr>
<tr><td><p>Stats</p></td><td><p>عدد المستلمين وعدد القراءات.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">خطوة بخطوة</h2>
<ol class="list _decimal" type="1">
<li><p>القائمة - Announcements.</p></li>
<li><p>اضغط New.</p></li>
<li><p>أدخل العنوان والمحتوى والأولوية وتاريخ الانتهاء.</p></li>
<li><p>احفظ.</p></li>
<li><p>اضغط إرسال واختر هدف النشر.</p></li>
<li><p>تأكد من عدد المستلمين بعد النشر.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">أخطاء التحقق</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>الرسالة</p></th><th><p>الحل</p></th></tr></thead><tbody>
<tr><td><p>Title is required</p></td><td><p>أدخل عنوانا.</p></td></tr>
<tr><td><p>Content is required</p></td><td><p>أدخل محتوى الإعلان.</p></td></tr>
<tr><td><p>Priority is required</p></td><td><p>اختر الأولوية.</p></td></tr>
<tr><td><p>Expiration date/time is required</p></td><td><p>اختر تاريخ انتهاء.</p></td></tr>
<tr><td><p>Select at least one Generator Owner</p></td><td><p>عند إيقاف Publish to all، اختر مستلمين.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">أخطاء شائعة</h2>
<ul class="list _bullet">
<li><p>النشر قبل مراجعة تاريخ الانتهاء.</p></li>
<li><p>ترك Publish to all مفعلا بينما المطلوب مستلمون محددون.</p></li>
<li><p>حذف مسودة إعلان خاطئة.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">استكشاف الأخطاء</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>المشكلة</p></th><th><p>ما تجربه</p></th></tr></thead><tbody>
<tr><td><p>لا توجد إعلانات</p></td><td><p>أعد ضبط الفلاتر وحمل من جديد.</p></td></tr>
<tr><td><p>زر الإرسال غير فعال</p></td><td><p>قد يكون الإعلان منشورا بالفعل.</p></td></tr>
<tr><td><p>قائمة أصحاب المولدات لا تحمل</p></td><td><p>أغلق نافذة النشر وأعد فتحها.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">صفحات ذات صلة</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="قائمة أصحاب المولدات المستخدمة للنشر الموجه." href="generator-owners.html">Generator Owners</a></p></li>
<li><p><a data-tooltip="رسائل SMS الخاصة بصاحب المولد." href="sms-templates.html">SMS Templates</a></p></li>
</ul>
</section>`)
        },
        keywords: ['Communication', 'Announcements', 'publish', 'priority', 'expiration', 'recipients']
    },
    {
        id: 'sms-templates',
        slug: 'sms-templates',
        fileName: 'sms-templates.html',
        title: text('SMS Templates', 'SMS Templates'),
        group: text('Communication', 'التواصل'),
        appRoute: 'sms-templates',
        sections: coreSections,
        contentHtml: {
            en: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">What this page is for</h2>
<p><span class="control">SMS Templates</span> lets admins load and maintain SMS message templates for one selected generator owner.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">Before you start</h2>
<ul class="list _bullet">
<li><p>Select the generator owner first. This field is required.</p></li>
<li><p>Know the SMS template role and intended language.</p></li>
<li><p>Prepare the English body and optional Arabic name/body.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">Regular workflow</h2>
<ol class="list _decimal" type="1">
<li><p>Select <span class="control">Generator Owner User ID</span>.</p></li>
<li><p>Optionally choose role, keyword, language, and status filters.</p></li>
<li><p>Click Apply to load templates.</p></li>
<li><p>Use New or pencil to create/edit a template.</p></li>
<li><p>Use trash to delete and Export CSV for a file copy.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">What you see on this page</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Control</p></th><th><p>Use it for</p></th></tr></thead><tbody>
<tr><td><p>Generator Owner User ID</p></td><td><p>Required owner selection before loading templates.</p></td></tr>
<tr><td><p>SMS Template Role</p></td><td><p>Filter or assign a template role.</p></td></tr>
<tr><td><p>Keyword / Language / Status</p></td><td><p>Client-side filtering after load.</p></td></tr>
<tr><td><p>Name and Body</p></td><td><p>Template title and SMS text.</p></td></tr>
<tr><td><p>Active toggle</p></td><td><p>Controls whether a template is active.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">Step-by-step</h2>
<ol class="list _decimal" type="1">
<li><p>Menu - SMS Templates.</p></li>
<li><p>Select generator owner.</p></li>
<li><p>Click Apply.</p></li>
<li><p>Click New or edit an existing template.</p></li>
<li><p>Fill Name, Body, Language, optional role, optional Arabic fields, and Active.</p></li>
<li><p>Save.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">Validation mistakes</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Message</p></th><th><p>Fix</p></th></tr></thead><tbody>
<tr><td><p>GeneratorOwnerUserId is required</p></td><td><p>Select a generator owner before loading or saving.</p></td></tr>
<tr><td><p>Name is required</p></td><td><p>Enter the English template name.</p></td></tr>
<tr><td><p>Body is required</p></td><td><p>Enter the English SMS body.</p></td></tr>
<tr><td><p>Language is required</p></td><td><p>Select a language.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">Common mistakes</h2>
<ul class="list _bullet">
<li><p>Trying to load templates before selecting a generator owner.</p></li>
<li><p>Editing the template for the wrong owner.</p></li>
<li><p>Deleting a template without exporting or confirming the replacement.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">Troubleshooting</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Problem</p></th><th><p>What to try</p></th></tr></thead><tbody>
<tr><td><p>No templates found</p></td><td><p>Confirm owner and role filters, then apply again.</p></td></tr>
<tr><td><p>Role options missing</p></td><td><p>Wait for lookup loading or refresh the page.</p></td></tr>
<tr><td><p>Save failed</p></td><td><p>Check required fields and owner selection.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">Related pages</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="Find the owner whose templates you are editing." href="generator-owners.html">Generator Owners</a></p></li>
<li><p><a data-tooltip="Platform message publishing." href="announcements.html">Announcements</a></p></li>
</ul>
</section>`),
            ar: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">الغرض من هذه الصفحة</h2>
<p>تتيح صفحة <span class="control">SMS Templates</span> تحميل وصيانة قوالب رسائل SMS لصاحب مولد محدد.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">قبل أن تبدأ</h2>
<ul class="list _bullet">
<li><p>اختر صاحب المولد أولا. هذا الحقل مطلوب.</p></li>
<li><p>اعرف دور قالب SMS واللغة المطلوبة.</p></li>
<li><p>جهز النص الإنجليزي والاسم أو النص العربي اختياريا.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">سير العمل المعتاد</h2>
<ol class="list _decimal" type="1">
<li><p>اختر <span class="control">Generator Owner User ID</span>.</p></li>
<li><p>اختر الدور أو الكلمة أو اللغة أو الحالة عند الحاجة.</p></li>
<li><p>اضغط Apply لتحميل القوالب.</p></li>
<li><p>استخدم New أو القلم للإنشاء أو التعديل.</p></li>
<li><p>استخدم الحذف أو Export CSV عند الحاجة.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">ما تراه على هذه الصفحة</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>العنصر</p></th><th><p>الاستخدام</p></th></tr></thead><tbody>
<tr><td><p>Generator Owner User ID</p></td><td><p>اختيار صاحب المولد المطلوب قبل التحميل.</p></td></tr>
<tr><td><p>SMS Template Role</p></td><td><p>فلترة أو تحديد دور القالب.</p></td></tr>
<tr><td><p>Keyword / Language / Status</p></td><td><p>فلترة محلية بعد التحميل.</p></td></tr>
<tr><td><p>Name and Body</p></td><td><p>عنوان القالب ونص SMS.</p></td></tr>
<tr><td><p>Active toggle</p></td><td><p>تحديد ما إذا كان القالب فعالا.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">خطوة بخطوة</h2>
<ol class="list _decimal" type="1">
<li><p>القائمة - SMS Templates.</p></li>
<li><p>اختر صاحب المولد.</p></li>
<li><p>اضغط Apply.</p></li>
<li><p>اضغط New أو عدل قالبا موجودا.</p></li>
<li><p>املأ Name و Body و Language والدور الاختياري والحقول العربية و Active.</p></li>
<li><p>احفظ.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">أخطاء التحقق</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>الرسالة</p></th><th><p>الحل</p></th></tr></thead><tbody>
<tr><td><p>GeneratorOwnerUserId is required</p></td><td><p>اختر صاحب مولد قبل التحميل أو الحفظ.</p></td></tr>
<tr><td><p>Name is required</p></td><td><p>أدخل اسم القالب بالإنجليزية.</p></td></tr>
<tr><td><p>Body is required</p></td><td><p>أدخل نص SMS بالإنجليزية.</p></td></tr>
<tr><td><p>Language is required</p></td><td><p>اختر اللغة.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">أخطاء شائعة</h2>
<ul class="list _bullet">
<li><p>محاولة تحميل القوالب قبل اختيار صاحب المولد.</p></li>
<li><p>تعديل قالب لصاحب مولد خاطئ.</p></li>
<li><p>حذف قالب دون تصدير أو التأكد من وجود بديل.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">استكشاف الأخطاء</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>المشكلة</p></th><th><p>ما تجربه</p></th></tr></thead><tbody>
<tr><td><p>لا توجد قوالب</p></td><td><p>تأكد من صاحب المولد وفلاتر الدور ثم اضغط Apply.</p></td></tr>
<tr><td><p>خيارات الدور غير ظاهرة</p></td><td><p>انتظر تحميل lookup أو حدث الصفحة.</p></td></tr>
<tr><td><p>فشل الحفظ</p></td><td><p>راجع الحقول المطلوبة واختيار صاحب المولد.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">صفحات ذات صلة</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="ابحث عن صاحب المولد الذي تعدل قوالبه." href="generator-owners.html">Generator Owners</a></p></li>
<li><p><a data-tooltip="نشر رسائل المنصة." href="announcements.html">Announcements</a></p></li>
</ul>
</section>`)
        },
        keywords: ['Communication', 'SMS Templates', 'template', 'role', 'language', 'active']
    },
    {
        id: 'monitoring',
        slug: 'monitoring',
        fileName: 'monitoring.html',
        title: text('Live Monitoring', 'Live Monitoring'),
        group: text('Operations', 'التشغيل'),
        appRoute: 'monitoring',
        sections: coreSections,
        contentHtml: {
            en: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">What this page is for</h2>
<p><span class="control">Live Monitoring</span> helps admins monitor online users, sessions, activity logs, user locations, session history, and force logout when needed.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">Before you start</h2>
<ul class="list _bullet">
<li><p>Use monitoring for support, security, and diagnostics.</p></li>
<li><p>Know the username, role, session, or approximate time you are investigating.</p></li>
<li><p>Use Force Logout only with a clear reason.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">Regular workflow</h2>
<ol class="list _decimal" type="1">
<li><p>Keep Auto refresh on for live operations, or turn it off while investigating one session.</p></li>
<li><p>Use role/status/search filters in Active Sessions.</p></li>
<li><p>Select a session to load Session Detail and Activity.</p></li>
<li><p>Open Activity Detail to inspect request/response logs and payloads.</p></li>
<li><p>Use User Session History to inspect past sessions for a selected user.</p></li>
<li><p>Use Force Logout only when necessary and record the reason.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">What you see on this page</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Area</p></th><th><p>Meaning</p></th></tr></thead><tbody>
<tr><td><p>KPIs</p></td><td><p>Online users, idle users, last update, role distribution.</p></td></tr>
<tr><td><p>Active Sessions</p></td><td><p>Currently tracked online or idle sessions.</p></td></tr>
<tr><td><p>Session Detail</p></td><td><p>Selected user, IP, device, OS, sign-in and last seen data.</p></td></tr>
<tr><td><p>Activity</p></td><td><p>Recent API/screen activity for the selected session.</p></td></tr>
<tr><td><p>User Session History</p></td><td><p>Past sessions for a selected user and date range.</p></td></tr>
<tr><td><p>Geo Distribution</p></td><td><p>Active sessions grouped by location.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">Step-by-step</h2>
<ol class="list _decimal" type="1">
<li><p>Menu - Monitoring.</p></li>
<li><p>Apply filters in Active Sessions.</p></li>
<li><p>Select a session row.</p></li>
<li><p>Review Session Detail and Activity.</p></li>
<li><p>Click View to inspect activity detail or payload JSON.</p></li>
<li><p>If needed, click Force Logout, enter reason, and confirm.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">Validation mistakes</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>What you see</p></th><th><p>Fix</p></th></tr></thead><tbody>
<tr><td><p>Missing User</p></td><td><p>Select a session or choose a user before loading history.</p></td></tr>
<tr><td><p>Please enter a reason for force logout</p></td><td><p>Type a clear reason before confirming.</p></td></tr>
<tr><td><p>No activity found</p></td><td><p>Change activity direction/limit or clear the activity search.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">Common mistakes</h2>
<ul class="list _bullet">
<li><p>Leaving auto refresh on while reading a selected session, causing data to update while investigating.</p></li>
<li><p>Force logging out before checking whether the session is just idle.</p></li>
<li><p>Using history filters without selecting a user.</p></li>
<li><p>Sharing raw payload data without reviewing sensitive fields.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">Troubleshooting</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Problem</p></th><th><p>What to try</p></th></tr></thead><tbody>
<tr><td><p>Active sessions fail to load</p></td><td><p>Clear filters and click Refresh.</p></td></tr>
<tr><td><p>Session detail blank</p></td><td><p>Select the row again or refresh monitoring.</p></td></tr>
<tr><td><p>Payload is hard to read</p></td><td><p>Use View JSON; formatted JSON is shown when possible.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">Related pages</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="Platform usage and health metrics." href="dashboard.html">Dashboard</a></p></li>
<li><p><a data-tooltip="Deactivate/reactivate owners from wallet management when account access must change." href="generator-owner-wallet.html">Wallet Management</a></p></li>
</ul>
</section>`),
            ar: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">الغرض من هذه الصفحة</h2>
<p>تساعد <span class="control">Live Monitoring</span> المسؤول على متابعة المستخدمين والجلسات وسجلات النشاط والمواقع وسجل الجلسات وتسجيل الخروج الإجباري عند الحاجة.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">قبل أن تبدأ</h2>
<ul class="list _bullet">
<li><p>استخدم المراقبة للدعم والأمان والتشخيص.</p></li>
<li><p>اعرف اسم المستخدم أو الدور أو الجلسة أو الوقت التقريبي الذي تحقق فيه.</p></li>
<li><p>استخدم Force Logout فقط مع سبب واضح.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">سير العمل المعتاد</h2>
<ol class="list _decimal" type="1">
<li><p>اترك Auto refresh مفعلا للمتابعة المباشرة، أو أوقفه أثناء التحقيق في جلسة واحدة.</p></li>
<li><p>استخدم فلاتر الدور والحالة والبحث في Active Sessions.</p></li>
<li><p>اختر جلسة لتحميل Session Detail و Activity.</p></li>
<li><p>افتح Activity Detail لفحص السجلات والبيانات.</p></li>
<li><p>استخدم User Session History لفحص جلسات سابقة لمستخدم محدد.</p></li>
<li><p>استخدم Force Logout فقط عند الحاجة واكتب السبب.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">ما تراه على هذه الصفحة</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>المنطقة</p></th><th><p>المعنى</p></th></tr></thead><tbody>
<tr><td><p>KPIs</p></td><td><p>المستخدمون المتصلون، الخاملون، آخر تحديث، توزيع الأدوار.</p></td></tr>
<tr><td><p>Active Sessions</p></td><td><p>الجلسات المتصلة أو الخاملة حاليا.</p></td></tr>
<tr><td><p>Session Detail</p></td><td><p>المستخدم و IP والجهاز والنظام ووقت الدخول وآخر ظهور.</p></td></tr>
<tr><td><p>Activity</p></td><td><p>نشاط API أو الشاشة للجلسة المحددة.</p></td></tr>
<tr><td><p>User Session History</p></td><td><p>الجلسات السابقة لمستخدم وفترة محددة.</p></td></tr>
<tr><td><p>Geo Distribution</p></td><td><p>الجلسات النشطة حسب الموقع.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">خطوة بخطوة</h2>
<ol class="list _decimal" type="1">
<li><p>القائمة - Monitoring.</p></li>
<li><p>طبق الفلاتر في Active Sessions.</p></li>
<li><p>اختر صف جلسة.</p></li>
<li><p>راجع Session Detail و Activity.</p></li>
<li><p>اضغط View لفحص التفاصيل أو JSON.</p></li>
<li><p>عند الحاجة، اضغط Force Logout واكتب السبب ثم أكد.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">أخطاء التحقق</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>ما تراه</p></th><th><p>الحل</p></th></tr></thead><tbody>
<tr><td><p>Missing User</p></td><td><p>اختر جلسة أو مستخدما قبل تحميل السجل.</p></td></tr>
<tr><td><p>Please enter a reason for force logout</p></td><td><p>اكتب سببا واضحا قبل التأكيد.</p></td></tr>
<tr><td><p>No activity found</p></td><td><p>غير اتجاه أو حد النشاط أو امسح البحث.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">أخطاء شائعة</h2>
<ul class="list _bullet">
<li><p>ترك auto refresh مفعلا أثناء قراءة جلسة محددة.</p></li>
<li><p>تسجيل خروج إجباري قبل التأكد أن الجلسة ليست خاملة فقط.</p></li>
<li><p>استخدام فلاتر السجل دون اختيار مستخدم.</p></li>
<li><p>مشاركة بيانات payload دون مراجعة الحقول الحساسة.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">استكشاف الأخطاء</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>المشكلة</p></th><th><p>ما تجربه</p></th></tr></thead><tbody>
<tr><td><p>فشل تحميل الجلسات</p></td><td><p>امسح الفلاتر واضغط Refresh.</p></td></tr>
<tr><td><p>تفاصيل الجلسة فارغة</p></td><td><p>اختر الصف مرة أخرى أو حدث المراقبة.</p></td></tr>
<tr><td><p>Payload صعب القراءة</p></td><td><p>استخدم View JSON؛ يتم تنسيق JSON عند الإمكان.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">صفحات ذات صلة</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="مؤشرات الاستخدام وصحة المنصة." href="dashboard.html">Dashboard</a></p></li>
<li><p><a data-tooltip="تعطيل أو تفعيل أصحاب المولدات عند الحاجة لتغيير الوصول." href="generator-owner-wallet.html">Wallet Management</a></p></li>
</ul>
</section>`)
        },
        keywords: ['Operations', 'Monitoring', 'sessions', 'activity', 'force logout', 'history', 'geo']
    }
];
