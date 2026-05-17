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

export const BILL_COLLECTOR_DOCS: DocsTopic[] = [
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
            section('your-daily-workflow', 'Your daily workflow', 'سير عملك اليومي'),
            section('what-you-see-in-the-app', 'What you see in the app', 'ما تراه في التطبيق'),
            section('qr-codes', 'QR codes', 'رموز QR'),
            section('validation-mistakes', 'Validation mistakes', 'أخطاء التحقق'),
            section('common-mistakes', 'Common mistakes', 'أخطاء شائعة'),
            section('troubleshooting', 'Troubleshooting', 'استكشاف الأخطاء'),
            section('related-pages', 'Related pages', 'صفحات ذات صلة')
        ],
        contentHtml: {
            en: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">What this page is for</h2>
<p>This guide is for <span class="control">Bill Collector</span> users. It explains how to find assigned subscribers, submit KWH readings with images, scan QR codes, and record bill collections for generator owner approval.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">Before you start</h2>
<ul class="list _bullet">
<li><p>Use the username and password provided by the generator owner or administrator.</p></li>
<li><p>Allow camera permission if you will scan QR codes or take reading photos.</p></li>
<li><p>Use a stable internet connection. Submitted readings and collections must reach the server.</p></li>
<li><p>Confirm you are using a Bill Collector account, not a Generator Owner account.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="your-daily-workflow" id="your-daily-workflow">Your daily workflow</h2>
<ol class="list _decimal" type="1">
<li><p>Open <a data-tooltip="Search assigned subscribers, scan subscriber QR codes, and start KWH reading entry." href="subscribers.html">Subscribers</a> to find the customer.</p></li>
<li><p>Add the KWH reading and required image from <a data-tooltip="The reading form opens after selecting a subscriber. Enter a new reading and attach a meter photo." href="add-kwh-reading.html">Add KWH Reading</a>.</p></li>
<li><p>Open <a data-tooltip="Review readings you submitted and update pending readings before they are billed." href="kwh-readings.html">KWH Readings</a> to review or update pending readings.</p></li>
<li><p>Use <a data-tooltip="Scan bill QR codes and review collections sent to the generator owner for approval." href="bill-collections.html">Bill Collections</a> when collecting bill payments.</p></li>
<li><p>Refresh before leaving the field so you can see whether anything is still pending.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-in-the-app" id="what-you-see-in-the-app">What you see in the app</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Menu item</p></th><th><p>Use it for</p></th></tr></thead><tbody>
<tr><td><p>Subscribers</p></td><td><p>Find a subscriber, scan QR, and start a KWH reading.</p></td></tr>
<tr><td><p>KWH Readings</p></td><td><p>Review submitted readings and update pending ones.</p></td></tr>
<tr><td><p>Bill Collections</p></td><td><p>Scan bill QR codes, collect bills, filter by date, and review collection status.</p></td></tr>
<tr><td><p>Docs</p></td><td><p>Open this help center.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="qr-codes" id="qr-codes">QR codes</h2>
<p>QR buttons appear on the <span class="control">Subscribers</span> and <span class="control">Bill Collections</span> pages. Subscriber QR codes open reading entry. Bill QR codes collect the bill and send it as pending owner approval.</p>
<aside class="prompt" data-type="tip"><p>Hold the QR inside the scanner box until the app closes the scanner or navigates. If the QR is rejected, search manually.</p></aside>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">Validation mistakes</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>What you see</p></th><th><p>Likely cause</p></th></tr></thead><tbody>
<tr><td><p>Access denied</p></td><td><p>You are signed in with the wrong role or your session expired.</p></td></tr>
<tr><td><p>Invalid QR</p></td><td><p>The QR does not point to a supported subscriber reading or bill collection page.</p></td></tr>
<tr><td><p>Red validation under KWH Reading</p></td><td><p>The new reading is empty or lower than the current KWH value.</p></td></tr>
<tr><td><p>Image is required</p></td><td><p>A meter photo must be attached before submitting a reading.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">Common mistakes</h2>
<ul class="list _bullet">
<li><p>Submitting a reading without checking the current KWH shown on the subscriber card.</p></li>
<li><p>Leaving the scanner too quickly before the QR result is accepted.</p></li>
<li><p>Trying to edit a reading after it has already been billed.</p></li>
<li><p>Assuming a collected bill is final. The generator owner still has to approve it.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">Troubleshooting</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Problem</p></th><th><p>What to try</p></th></tr></thead><tbody>
<tr><td><p>Camera does not open</p></td><td><p>Allow browser camera permission and reload the page.</p></td></tr>
<tr><td><p>Subscriber not found</p></td><td><p>Search by phone, name, meter number, or ask the owner to confirm assignment.</p></td></tr>
<tr><td><p>Reading submit fails</p></td><td><p>Check the reading value, image, and internet connection, then retry.</p></td></tr>
<tr><td><p>Collected bill does not appear</p></td><td><p>Refresh Bill Collections and check the date filter.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">Related pages</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="The daily order for reading and collection work." href="daily-field-workflow.html">Daily field workflow</a></p></li>
<li><p><a data-tooltip="Find subscribers and start KWH reading entry." href="subscribers.html">Subscribers</a></p></li>
<li><p><a data-tooltip="Scan bill QR codes and review recorded collections." href="bill-collections.html">Bill Collections</a></p></li>
</ul>
</section>`),
            ar: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">الغرض من هذه الصفحة</h2>
<p>هذا الدليل مخصص لمستخدم <span class="control">محصل الفواتير</span>. يشرح كيف تبحث عن المشتركين المعينين لك، تسجل قراءات KWH مع صورة، تمسح رموز QR، وتسجل تحصيل الفواتير بانتظار موافقة صاحب المولد.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">قبل أن تبدأ</h2>
<ul class="list _bullet">
<li><p>استخدم اسم المستخدم وكلمة المرور من صاحب المولد أو المسؤول.</p></li>
<li><p>اسمح للكاميرا إذا كنت ستستخدم QR أو تلتقط صورة العداد.</p></li>
<li><p>تأكد من وجود إنترنت مستقر حتى تصل القراءات والتحصيلات إلى النظام.</p></li>
<li><p>تأكد أنك داخل حساب Bill Collector وليس حساب Generator Owner.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="your-daily-workflow" id="your-daily-workflow">سير عملك اليومي</h2>
<ol class="list _decimal" type="1">
<li><p>افتح <a data-tooltip="ابحث عن المشتركين، امسح QR الخاص بالمشترك، وابدأ إدخال قراءة KWH." href="subscribers.html">Subscribers</a> للبحث عن المشترك.</p></li>
<li><p>أدخل قراءة KWH والصورة المطلوبة من <a data-tooltip="تفتح صفحة القراءة بعد اختيار المشترك. أدخل القراءة الجديدة وأرفق صورة العداد." href="add-kwh-reading.html">Add KWH Reading</a>.</p></li>
<li><p>افتح <a data-tooltip="راجع القراءات التي أرسلتها وعدل القراءات المعلقة قبل إصدار الفاتورة." href="kwh-readings.html">KWH Readings</a> للمراجعة أو التعديل.</p></li>
<li><p>استخدم <a data-tooltip="امسح QR الفاتورة وراجع التحصيلات المرسلة إلى صاحب المولد للموافقة." href="bill-collections.html">Bill Collections</a> عند تحصيل الفواتير.</p></li>
<li><p>قم بالتحديث قبل إنهاء العمل للتأكد من عدم وجود شيء يحتاج متابعة.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-in-the-app" id="what-you-see-in-the-app">ما تراه في التطبيق</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>القائمة</p></th><th><p>الاستخدام</p></th></tr></thead><tbody>
<tr><td><p>Subscribers</p></td><td><p>البحث عن مشترك، مسح QR، وبدء قراءة KWH.</p></td></tr>
<tr><td><p>KWH Readings</p></td><td><p>مراجعة القراءات المرسلة وتعديل القراءات المعلقة.</p></td></tr>
<tr><td><p>Bill Collections</p></td><td><p>مسح QR الفاتورة، تحصيل الفواتير، الفلترة حسب التاريخ، ومراجعة الحالة.</p></td></tr>
<tr><td><p>Docs</p></td><td><p>فتح مركز المساعدة.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="qr-codes" id="qr-codes">رموز QR</h2>
<p>أزرار QR موجودة في صفحات <span class="control">Subscribers</span> و <span class="control">Bill Collections</span>. QR الخاص بالمشترك يفتح إدخال القراءة. QR الخاص بالفاتورة يسجل التحصيل بانتظار موافقة صاحب المولد.</p>
<aside class="prompt" data-type="tip"><p>ابق رمز QR داخل مربع المسح حتى يغلق التطبيق الماسح أو ينتقل للصفحة. إذا تم رفض الرمز، ابحث يدويا.</p></aside>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">أخطاء التحقق</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>ما تراه</p></th><th><p>السبب المحتمل</p></th></tr></thead><tbody>
<tr><td><p>Access denied</p></td><td><p>الدور غير صحيح أو انتهت الجلسة.</p></td></tr>
<tr><td><p>Invalid QR</p></td><td><p>QR لا يشير إلى صفحة قراءة مشترك أو تحصيل فاتورة مدعومة.</p></td></tr>
<tr><td><p>خطأ تحت KWH Reading</p></td><td><p>القراءة فارغة أو أقل من قيمة KWH الحالية.</p></td></tr>
<tr><td><p>Image is required</p></td><td><p>يجب إرفاق صورة العداد قبل إرسال القراءة.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">أخطاء شائعة</h2>
<ul class="list _bullet">
<li><p>إرسال قراءة دون التأكد من قيمة KWH الحالية على بطاقة المشترك.</p></li>
<li><p>إغلاق الماسح بسرعة قبل قبول نتيجة QR.</p></li>
<li><p>محاولة تعديل قراءة بعد تحويلها إلى فاتورة.</p></li>
<li><p>اعتبار التحصيل نهائيا. صاحب المولد ما زال يحتاج إلى الموافقة.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">استكشاف الأخطاء</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>المشكلة</p></th><th><p>ما تجربه</p></th></tr></thead><tbody>
<tr><td><p>الكاميرا لا تفتح</p></td><td><p>اسمح للكاميرا من المتصفح ثم أعد تحميل الصفحة.</p></td></tr>
<tr><td><p>المشترك غير موجود</p></td><td><p>ابحث بالهاتف أو الاسم أو رقم العداد، أو اطلب من صاحب المولد تأكيد التعيين.</p></td></tr>
<tr><td><p>فشل إرسال القراءة</p></td><td><p>تحقق من القراءة والصورة والإنترنت ثم حاول مرة أخرى.</p></td></tr>
<tr><td><p>التحصيل لا يظهر</p></td><td><p>حدث Bill Collections وتأكد من فلتر التاريخ.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">صفحات ذات صلة</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="الترتيب اليومي لعمل القراءات والتحصيل." href="daily-field-workflow.html">سير العمل الميداني اليومي</a></p></li>
<li><p><a data-tooltip="البحث عن المشتركين وبدء إدخال قراءة KWH." href="subscribers.html">Subscribers</a></p></li>
<li><p><a data-tooltip="مسح QR الفواتير ومراجعة التحصيلات." href="bill-collections.html">Bill Collections</a></p></li>
</ul>
</section>`)
        },
        keywords: ['Start here', 'Getting started', 'bill collector', 'QR', 'KWH', 'collections', 'ابدأ', 'محصل']
    },
    {
        id: 'daily-field-workflow',
        slug: 'daily-field-workflow',
        fileName: 'daily-field-workflow.html',
        title: text('Daily field workflow', 'سير العمل الميداني اليومي'),
        group: text('Start here', 'ابدأ هنا'),
        appRoute: null,
        sections: [
            section('what-this-page-is-for', 'What this page is for', 'الغرض من هذه الصفحة'),
            section('before-you-start', 'Before you start', 'قبل أن تبدأ'),
            section('recommended-order', 'Recommended order', 'الترتيب الموصى به'),
            section('end-of-day-checks', 'End-of-day checks', 'مراجعة نهاية اليوم'),
            section('common-mistakes', 'Common mistakes', 'أخطاء شائعة'),
            section('troubleshooting', 'Troubleshooting', 'استكشاف الأخطاء'),
            section('related-pages', 'Related pages', 'صفحات ذات صلة')
        ],
        contentHtml: {
            en: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">What this page is for</h2>
<p>Use this page as the normal order for field work. It keeps readings, photos, QR scans, and bill collections consistent.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">Before you start</h2>
<ul class="list _bullet">
<li><p>Charge your phone and confirm the camera works.</p></li>
<li><p>Sign in before reaching the first subscriber if internet coverage is weak.</p></li>
<li><p>Keep subscriber QR codes or bill QR codes ready if your route uses printed codes.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="recommended-order" id="recommended-order">Recommended order</h2>
<ol class="list _decimal" type="1">
<li><p>Open <a data-tooltip="Search assigned subscribers and open the reading form." href="subscribers.html">Subscribers</a>.</p></li>
<li><p>Search by phone/name/meter, or use the QR button.</p></li>
<li><p>Submit the new reading and meter image in <a data-tooltip="Enter a reading greater than or equal to the current KWH and attach an image." href="add-kwh-reading.html">Add KWH Reading</a>.</p></li>
<li><p>Open <a data-tooltip="Review submitted readings and update pending ones." href="kwh-readings.html">KWH Readings</a> if you need to correct a pending reading.</p></li>
<li><p>Open <a data-tooltip="Scan bill QR codes and review pending owner approval." href="bill-collections.html">Bill Collections</a> when collecting a bill payment.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="end-of-day-checks" id="end-of-day-checks">End-of-day checks</h2>
<ul class="list _bullet">
<li><p>Refresh <span class="control">KWH Readings</span> and check pending items.</p></li>
<li><p>Refresh <span class="control">Bill Collections</span> and confirm today's collected bills are visible.</p></li>
<li><p>Report rejected QR codes, missing subscribers, or wrong meter numbers to the generator owner.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">Common mistakes</h2>
<ul class="list _bullet">
<li><p>Taking the photo before confirming the subscriber name and meter number.</p></li>
<li><p>Submitting duplicate pending readings for the same subscriber.</p></li>
<li><p>Using an old date filter and thinking today's collections are missing.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">Troubleshooting</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Problem</p></th><th><p>What to try</p></th></tr></thead><tbody>
<tr><td><p>Weak internet</p></td><td><p>Move to a better signal area before submitting forms.</p></td></tr>
<tr><td><p>Duplicate pending warning</p></td><td><p>Open KWH Readings and update the existing pending reading if possible.</p></td></tr>
<tr><td><p>Wrong subscriber opened</p></td><td><p>Go back and search by meter number or phone.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">Related pages</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="Main screen for subscriber search and QR scan." href="subscribers.html">Subscribers</a></p></li>
<li><p><a data-tooltip="Reading submission form." href="add-kwh-reading.html">Add KWH Reading</a></p></li>
<li><p><a data-tooltip="Bill collection and QR workflow." href="bill-collections.html">Bill Collections</a></p></li>
</ul>
</section>`),
            ar: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">الغرض من هذه الصفحة</h2>
<p>استخدم هذه الصفحة كترتيب يومي للعمل الميداني حتى تبقى القراءات والصور وعمليات QR والتحصيلات منظمة.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">قبل أن تبدأ</h2>
<ul class="list _bullet">
<li><p>اشحن الهاتف وتأكد أن الكاميرا تعمل.</p></li>
<li><p>سجل الدخول قبل الوصول إلى أول مشترك إذا كانت التغطية ضعيفة.</p></li>
<li><p>جهز رموز QR الخاصة بالمشتركين أو الفواتير إذا كان المسار يعتمد على رموز مطبوعة.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="recommended-order" id="recommended-order">الترتيب الموصى به</h2>
<ol class="list _decimal" type="1">
<li><p>افتح <a data-tooltip="البحث عن المشتركين وفتح نموذج القراءة." href="subscribers.html">Subscribers</a>.</p></li>
<li><p>ابحث بالهاتف أو الاسم أو العداد، أو استخدم زر QR.</p></li>
<li><p>أرسل القراءة الجديدة وصورة العداد في <a data-tooltip="أدخل قراءة أكبر أو تساوي KWH الحالية وأرفق صورة." href="add-kwh-reading.html">Add KWH Reading</a>.</p></li>
<li><p>افتح <a data-tooltip="راجع القراءات وعدل المعلقة منها." href="kwh-readings.html">KWH Readings</a> إذا احتجت إلى تصحيح قراءة معلقة.</p></li>
<li><p>افتح <a data-tooltip="امسح QR الفاتورة وراجع التحصيلات بانتظار موافقة صاحب المولد." href="bill-collections.html">Bill Collections</a> عند تحصيل فاتورة.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="end-of-day-checks" id="end-of-day-checks">مراجعة نهاية اليوم</h2>
<ul class="list _bullet">
<li><p>حدث <span class="control">KWH Readings</span> وراجع العناصر المعلقة.</p></li>
<li><p>حدث <span class="control">Bill Collections</span> وتأكد أن تحصيلات اليوم ظاهرة.</p></li>
<li><p>أبلغ صاحب المولد عن QR مرفوض أو مشترك مفقود أو رقم عداد غير صحيح.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">أخطاء شائعة</h2>
<ul class="list _bullet">
<li><p>التقاط الصورة قبل التأكد من اسم المشترك ورقم العداد.</p></li>
<li><p>إرسال أكثر من قراءة معلقة لنفس المشترك.</p></li>
<li><p>ترك فلتر تاريخ قديم ثم الاعتقاد أن تحصيلات اليوم غير موجودة.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">استكشاف الأخطاء</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>المشكلة</p></th><th><p>ما تجربه</p></th></tr></thead><tbody>
<tr><td><p>إنترنت ضعيف</p></td><td><p>انتقل إلى مكان بتغطية أفضل قبل إرسال النماذج.</p></td></tr>
<tr><td><p>تحذير قراءة مكررة</p></td><td><p>افتح KWH Readings وعدل القراءة المعلقة الموجودة إذا أمكن.</p></td></tr>
<tr><td><p>تم فتح مشترك غير صحيح</p></td><td><p>ارجع وابحث برقم العداد أو الهاتف.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">صفحات ذات صلة</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="الشاشة الأساسية للبحث و QR." href="subscribers.html">Subscribers</a></p></li>
<li><p><a data-tooltip="نموذج إرسال القراءة." href="add-kwh-reading.html">Add KWH Reading</a></p></li>
<li><p><a data-tooltip="تحصيل الفواتير و QR." href="bill-collections.html">Bill Collections</a></p></li>
</ul>
</section>`)
        },
        keywords: ['workflow', 'daily', 'field', 'route', 'KWH', 'collection', 'سير العمل', 'ميداني']
    },
    {
        id: 'subscribers',
        slug: 'subscribers',
        fileName: 'subscribers.html',
        title: text('Subscribers', 'Subscribers'),
        group: text('Field work', 'العمل الميداني'),
        appRoute: 'subscribers',
        sections: coreSections,
        contentHtml: {
            en: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">What this page is for</h2>
<p>The <span class="control">Subscribers</span> page is your starting point for reading work. You can search subscribers, scan a QR code, view meter context, and open the KWH reading form.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">Before you start</h2>
<ul class="list _bullet">
<li><p>Know at least one identifier: name, phone, meter number, generator code, or subscriber QR.</p></li>
<li><p>Confirm the subscriber status is active when possible.</p></li>
<li><p>Use the QR button only when the printed code belongs to this Echtirak account.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">Regular workflow</h2>
<ol class="list _decimal" type="1">
<li><p>Search by phone, name, or meter number.</p></li>
<li><p>Review the subscriber card: phone, generator, meter, previous KWH, current KWH, and address.</p></li>
<li><p>Tap the card to open <a data-tooltip="Enter the new meter reading and attach the required image." href="add-kwh-reading.html">Add KWH Reading</a>.</p></li>
<li><p>Use <span class="control">Load more</span> when there are more assigned subscribers.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">What you see on this page</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Area</p></th><th><p>Meaning</p></th></tr></thead><tbody>
<tr><td><p>Search</p></td><td><p>Filters assigned subscribers by phone, name, or meter.</p></td></tr>
<tr><td><p>QR button</p></td><td><p>Opens the camera scanner.</p></td></tr>
<tr><td><p>Subscriber card</p></td><td><p>Shows identity, status, generator, meter, KWH context, and address.</p></td></tr>
<tr><td><p>Tap to add reading</p></td><td><p>Opens the reading form for that subscriber.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">Step-by-step</h2>
<ol class="list _decimal" type="1">
<li><p>Menu - Subscribers.</p></li>
<li><p>Type a search value or tap the QR icon.</p></li>
<li><p>Confirm the card belongs to the correct subscriber.</p></li>
<li><p>Tap the card and continue in <a data-tooltip="The form where readings and images are submitted." href="add-kwh-reading.html">Add KWH Reading</a>.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">Validation mistakes</h2>
<p>No form is saved on this page. The main mistakes are searching with the wrong keyword or scanning an unsupported QR.</p>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">Common mistakes</h2>
<ul class="list _bullet">
<li><p>Selecting the right name but wrong meter number.</p></li>
<li><p>Ignoring the address when a subscriber has a similar name.</p></li>
<li><p>Scanning a bill QR when you intended to add a reading. Bill QR codes route to Bill Collections.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">Troubleshooting</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Problem</p></th><th><p>What to try</p></th></tr></thead><tbody>
<tr><td><p>No subscribers found</p></td><td><p>Clear search, try a shorter keyword, or ask the owner to check assignment.</p></td></tr>
<tr><td><p>QR rejected</p></td><td><p>Search manually and report the printed QR if it is outdated.</p></td></tr>
<tr><td><p>Wrong subscriber after scanning</p></td><td><p>Go back and search manually before submitting any reading.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">Related pages</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="Submit the reading after opening a subscriber." href="add-kwh-reading.html">Add KWH Reading</a></p></li>
<li><p><a data-tooltip="Review readings after submission." href="kwh-readings.html">KWH Readings</a></p></li>
<li><p><a data-tooltip="How QR scanning behaves." href="qr-scanner.html">QR scanner</a></p></li>
</ul>
</section>`),
            ar: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">الغرض من هذه الصفحة</h2>
<p>صفحة <span class="control">Subscribers</span> هي نقطة البداية لعمل القراءات. يمكنك البحث عن مشترك، مسح QR، رؤية بيانات العداد، وفتح نموذج قراءة KWH.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">قبل أن تبدأ</h2>
<ul class="list _bullet">
<li><p>اعرف معلومة واحدة على الأقل: الاسم، الهاتف، رقم العداد، رمز المولد، أو QR المشترك.</p></li>
<li><p>تأكد من حالة المشترك إذا أمكن.</p></li>
<li><p>استخدم QR فقط إذا كان الرمز يخص حساب Echtirak الحالي.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">سير العمل المعتاد</h2>
<ol class="list _decimal" type="1">
<li><p>ابحث بالهاتف أو الاسم أو رقم العداد.</p></li>
<li><p>راجع بطاقة المشترك: الهاتف، المولد، العداد، KWH السابقة والحالية، والعنوان.</p></li>
<li><p>اضغط البطاقة لفتح <a data-tooltip="أدخل قراءة العداد الجديدة وأرفق الصورة المطلوبة." href="add-kwh-reading.html">Add KWH Reading</a>.</p></li>
<li><p>استخدم <span class="control">Load more</span> عند وجود مشتركين إضافيين.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">ما تراه على هذه الصفحة</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>المنطقة</p></th><th><p>المعنى</p></th></tr></thead><tbody>
<tr><td><p>Search</p></td><td><p>يفلتر المشتركين بالهاتف أو الاسم أو العداد.</p></td></tr>
<tr><td><p>زر QR</p></td><td><p>يفتح ماسح الكاميرا.</p></td></tr>
<tr><td><p>بطاقة المشترك</p></td><td><p>تعرض الهوية والحالة والمولد والعداد وبيانات KWH والعنوان.</p></td></tr>
<tr><td><p>Tap to add reading</p></td><td><p>يفتح نموذج القراءة لذلك المشترك.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">خطوة بخطوة</h2>
<ol class="list _decimal" type="1">
<li><p>القائمة - Subscribers.</p></li>
<li><p>اكتب كلمة بحث أو اضغط أيقونة QR.</p></li>
<li><p>تأكد أن البطاقة للمشترك الصحيح.</p></li>
<li><p>اضغط البطاقة وتابع في <a data-tooltip="النموذج الذي ترسل منه القراءة والصورة." href="add-kwh-reading.html">Add KWH Reading</a>.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">أخطاء التحقق</h2>
<p>لا يتم حفظ نموذج في هذه الصفحة. الأخطاء الأساسية هي البحث بكلمة غير صحيحة أو مسح QR غير مدعوم.</p>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">أخطاء شائعة</h2>
<ul class="list _bullet">
<li><p>اختيار الاسم الصحيح لكن رقم عداد غير صحيح.</p></li>
<li><p>تجاهل العنوان عند وجود مشتركين بأسماء متشابهة.</p></li>
<li><p>مسح QR فاتورة بدل QR قراءة. QR الفاتورة يوجه إلى Bill Collections.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">استكشاف الأخطاء</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>المشكلة</p></th><th><p>ما تجربه</p></th></tr></thead><tbody>
<tr><td><p>لا يوجد مشتركين</p></td><td><p>امسح البحث، جرب كلمة أقصر، أو اطلب من صاحب المولد مراجعة التعيين.</p></td></tr>
<tr><td><p>QR مرفوض</p></td><td><p>ابحث يدويا وأبلغ عن QR المطبوع إذا كان قديما.</p></td></tr>
<tr><td><p>تم فتح مشترك خطأ بعد المسح</p></td><td><p>ارجع وابحث يدويا قبل إرسال أي قراءة.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">صفحات ذات صلة</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="أرسل القراءة بعد فتح المشترك." href="add-kwh-reading.html">Add KWH Reading</a></p></li>
<li><p><a data-tooltip="راجع القراءات بعد الإرسال." href="kwh-readings.html">KWH Readings</a></p></li>
<li><p><a data-tooltip="كيف يعمل QR." href="qr-scanner.html">QR scanner</a></p></li>
</ul>
</section>`)
        },
        keywords: ['Field work', 'Subscribers', 'search', 'QR', 'meter', 'KWH', 'مشتركين', 'عداد']
    },
    {
        id: 'add-kwh-reading',
        slug: 'add-kwh-reading',
        fileName: 'add-kwh-reading.html',
        title: text('Add KWH Reading', 'إضافة قراءة KWH'),
        group: text('Field work', 'العمل الميداني'),
        appRoute: 'subscribers',
        sections: coreSections,
        contentHtml: {
            en: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">What this page is for</h2>
<p><span class="control">Add KWH Reading</span> is where you submit a new meter reading for one subscriber and attach a meter image.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">Before you start</h2>
<ul class="list _bullet">
<li><p>Open this page from a subscriber card or subscriber QR code.</p></li>
<li><p>Confirm subscriber name, meter, generator, current KWH, and address.</p></li>
<li><p>Have a clear meter photo ready from camera or gallery.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">Regular workflow</h2>
<ol class="list _decimal" type="1">
<li><p>Enter the new <span class="control">KWH Reading</span>.</p></li>
<li><p>Tap <span class="control">Camera</span> or <span class="control">Gallery</span> and select a meter image.</p></li>
<li><p>Wait for image compression to finish.</p></li>
<li><p>Tap <span class="control">Submit Reading</span>.</p></li>
<li><p>After success, review the item in <a data-tooltip="Pending readings can be updated before the owner bills them." href="kwh-readings.html">KWH Readings</a>.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">What you see on this page</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Control</p></th><th><p>Use it for</p></th></tr></thead><tbody>
<tr><td><p>Subscriber details panel</p></td><td><p>Confirms the subscriber and current reading context.</p></td></tr>
<tr><td><p>KWH Reading</p></td><td><p>The new meter value you are submitting.</p></td></tr>
<tr><td><p>Camera / Gallery</p></td><td><p>Attach evidence image for the meter reading.</p></td></tr>
<tr><td><p>Submit Reading</p></td><td><p>Sends the reading as pending review/billing.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">Step-by-step</h2>
<ol class="list _decimal" type="1">
<li><p>From <a data-tooltip="Find the subscriber first." href="subscribers.html">Subscribers</a>, tap the correct subscriber.</p></li>
<li><p>Expand subscriber details if you need to verify phone, address, generator, or meter.</p></li>
<li><p>Enter a reading greater than or equal to the current KWH.</p></li>
<li><p>Add a clear image.</p></li>
<li><p>Submit and wait for the success message.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">Validation mistakes</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Message</p></th><th><p>Fix</p></th></tr></thead><tbody>
<tr><td><p>KWH reading is required</p></td><td><p>Enter the new meter value.</p></td></tr>
<tr><td><p>Must be greater than or equal to current KWH</p></td><td><p>Re-check the meter and current value on screen.</p></td></tr>
<tr><td><p>Image is required</p></td><td><p>Attach a camera or gallery image.</p></td></tr>
<tr><td><p>Invalid file</p></td><td><p>Select an image file, not a document.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">Common mistakes</h2>
<ul class="list _bullet">
<li><p>Typing consumption instead of the total meter reading.</p></li>
<li><p>Submitting a blurry photo that cannot be reviewed.</p></li>
<li><p>Leaving the page while image compression is still running.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">Troubleshooting</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Problem</p></th><th><p>What to try</p></th></tr></thead><tbody>
<tr><td><p>Page returns to Subscribers</p></td><td><p>The subscriber id may be invalid or no longer assigned.</p></td></tr>
<tr><td><p>Image compression fails</p></td><td><p>Try another image or take a new photo.</p></td></tr>
<tr><td><p>Submit button does nothing</p></td><td><p>Check validation messages and wait for compression to finish.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">Related pages</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="Find the subscriber before adding a reading." href="subscribers.html">Subscribers</a></p></li>
<li><p><a data-tooltip="Update pending readings." href="kwh-readings.html">KWH Readings</a></p></li>
<li><p><a data-tooltip="Recommended daily reading order." href="daily-field-workflow.html">Daily field workflow</a></p></li>
</ul>
</section>`),
            ar: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">الغرض من هذه الصفحة</h2>
<p>صفحة <span class="control">Add KWH Reading</span> تستخدم لإرسال قراءة عداد جديدة لمشترك واحد مع صورة العداد.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">قبل أن تبدأ</h2>
<ul class="list _bullet">
<li><p>افتح الصفحة من بطاقة المشترك أو من QR المشترك.</p></li>
<li><p>تأكد من اسم المشترك والعداد والمولد و KWH الحالية والعنوان.</p></li>
<li><p>جهز صورة واضحة للعداد من الكاميرا أو المعرض.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">سير العمل المعتاد</h2>
<ol class="list _decimal" type="1">
<li><p>أدخل <span class="control">KWH Reading</span> الجديدة.</p></li>
<li><p>اضغط <span class="control">Camera</span> أو <span class="control">Gallery</span> واختر صورة العداد.</p></li>
<li><p>انتظر انتهاء ضغط الصورة.</p></li>
<li><p>اضغط <span class="control">Submit Reading</span>.</p></li>
<li><p>بعد النجاح، راجع العنصر في <a data-tooltip="يمكن تعديل القراءات المعلقة قبل أن يحولها صاحب المولد إلى فاتورة." href="kwh-readings.html">KWH Readings</a>.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">ما تراه على هذه الصفحة</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>العنصر</p></th><th><p>الاستخدام</p></th></tr></thead><tbody>
<tr><td><p>Subscriber details panel</p></td><td><p>تأكيد المشترك وسياق القراءة الحالية.</p></td></tr>
<tr><td><p>KWH Reading</p></td><td><p>قيمة العداد الجديدة التي ترسلها.</p></td></tr>
<tr><td><p>Camera / Gallery</p></td><td><p>إرفاق صورة إثبات للقراءة.</p></td></tr>
<tr><td><p>Submit Reading</p></td><td><p>إرسال القراءة بانتظار المراجعة أو الفوترة.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">خطوة بخطوة</h2>
<ol class="list _decimal" type="1">
<li><p>من <a data-tooltip="ابحث عن المشترك أولا." href="subscribers.html">Subscribers</a> اضغط المشترك الصحيح.</p></li>
<li><p>افتح تفاصيل المشترك إذا احتجت إلى تأكيد الهاتف أو العنوان أو المولد أو العداد.</p></li>
<li><p>أدخل قراءة أكبر أو تساوي KWH الحالية.</p></li>
<li><p>أضف صورة واضحة.</p></li>
<li><p>أرسل وانتظر رسالة النجاح.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">أخطاء التحقق</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>الرسالة</p></th><th><p>الحل</p></th></tr></thead><tbody>
<tr><td><p>KWH reading is required</p></td><td><p>أدخل قيمة العداد الجديدة.</p></td></tr>
<tr><td><p>Must be greater than or equal to current KWH</p></td><td><p>راجع العداد والقيمة الحالية على الشاشة.</p></td></tr>
<tr><td><p>Image is required</p></td><td><p>أرفق صورة من الكاميرا أو المعرض.</p></td></tr>
<tr><td><p>Invalid file</p></td><td><p>اختر ملف صورة وليس مستندا.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">أخطاء شائعة</h2>
<ul class="list _bullet">
<li><p>كتابة الاستهلاك بدل قراءة العداد الإجمالية.</p></li>
<li><p>إرسال صورة غير واضحة لا يمكن مراجعتها.</p></li>
<li><p>مغادرة الصفحة أثناء ضغط الصورة.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">استكشاف الأخطاء</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>المشكلة</p></th><th><p>ما تجربه</p></th></tr></thead><tbody>
<tr><td><p>الصفحة تعود إلى Subscribers</p></td><td><p>قد يكون رقم المشترك غير صحيح أو لم يعد معينا لك.</p></td></tr>
<tr><td><p>فشل ضغط الصورة</p></td><td><p>جرب صورة أخرى أو التقط صورة جديدة.</p></td></tr>
<tr><td><p>زر الإرسال لا يعمل</p></td><td><p>راجع رسائل التحقق وانتظر انتهاء الضغط.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">صفحات ذات صلة</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="ابحث عن المشترك قبل إضافة القراءة." href="subscribers.html">Subscribers</a></p></li>
<li><p><a data-tooltip="تعديل القراءات المعلقة." href="kwh-readings.html">KWH Readings</a></p></li>
<li><p><a data-tooltip="ترتيب العمل اليومي للقراءات." href="daily-field-workflow.html">سير العمل الميداني اليومي</a></p></li>
</ul>
</section>`)
        },
        keywords: ['Field work', 'Add KWH Reading', 'image', 'camera', 'meter', 'reading', 'قراءة', 'صورة']
    },
    {
        id: 'kwh-readings',
        slug: 'kwh-readings',
        fileName: 'kwh-readings.html',
        title: text('KWH Readings', 'KWH Readings'),
        group: text('Review', 'المراجعة'),
        appRoute: 'kva-readings',
        sections: coreSections,
        contentHtml: {
            en: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">What this page is for</h2>
<p><span class="control">KWH Readings</span> lists readings you submitted. Use it to review status, detect duplicate pending readings, and update readings that are still pending.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">Before you start</h2>
<ul class="list _bullet">
<li><p>Have the correct subscriber or meter information if you plan to search.</p></li>
<li><p>Only pending readings can be updated.</p></li>
<li><p>Keep a replacement meter image ready if you need to edit a reading.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">Regular workflow</h2>
<ol class="list _decimal" type="1">
<li><p>Open the page and review the pending count.</p></li>
<li><p>Use search for name, phone, meter, generator, subscriber id, or reading id.</p></li>
<li><p>For a pending reading, tap <span class="control">Update</span>.</p></li>
<li><p>Change the reading and optionally replace the image.</p></li>
<li><p>Save and refresh if needed.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">What you see on this page</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Item</p></th><th><p>Meaning</p></th></tr></thead><tbody>
<tr><td><p>Pending count</p></td><td><p>Readings waiting for owner billing or review.</p></td></tr>
<tr><td><p>Status tag</p></td><td><p>Pending, billed, cancelled, or similar status from the server.</p></td></tr>
<tr><td><p>Duplicate tag</p></td><td><p>The subscriber has more than one pending reading.</p></td></tr>
<tr><td><p>Update</p></td><td><p>Available only while the reading is pending.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">Step-by-step</h2>
<ol class="list _decimal" type="1">
<li><p>Menu - KWH Readings.</p></li>
<li><p>Search or scroll to the reading.</p></li>
<li><p>Check previous, current, new reading, and added KWH.</p></li>
<li><p>If status is pending, tap <span class="control">Update</span>.</p></li>
<li><p>Save the corrected reading and image.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">Validation mistakes</h2>
<p>The update dialog uses the same rules as Add KWH Reading: the reading must be greater than or equal to current KWH, and an image must exist.</p>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">Common mistakes</h2>
<ul class="list _bullet">
<li><p>Trying to update a billed reading. Billed readings are locked.</p></li>
<li><p>Ignoring the Duplicate tag and creating another pending reading.</p></li>
<li><p>Replacing the reading but not checking the image.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">Troubleshooting</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Problem</p></th><th><p>What to try</p></th></tr></thead><tbody>
<tr><td><p>Update disabled</p></td><td><p>The reading is not pending.</p></td></tr>
<tr><td><p>Image preview missing</p></td><td><p>The image may not have loaded. You can attach a new image before saving.</p></td></tr>
<tr><td><p>Reading not found</p></td><td><p>Clear search and refresh the list.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">Related pages</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="Create a new reading from a subscriber." href="add-kwh-reading.html">Add KWH Reading</a></p></li>
<li><p><a data-tooltip="Find subscribers before creating readings." href="subscribers.html">Subscribers</a></p></li>
<li><p><a data-tooltip="Field routine for readings." href="daily-field-workflow.html">Daily field workflow</a></p></li>
</ul>
</section>`),
            ar: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">الغرض من هذه الصفحة</h2>
<p>صفحة <span class="control">KWH Readings</span> تعرض القراءات التي أرسلتها. استخدمها لمراجعة الحالة، اكتشاف القراءات المعلقة المكررة، وتعديل القراءة ما دامت معلقة.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">قبل أن تبدأ</h2>
<ul class="list _bullet">
<li><p>جهز اسم المشترك أو رقم العداد إذا كنت ستبحث.</p></li>
<li><p>يمكن تعديل القراءات المعلقة فقط.</p></li>
<li><p>جهز صورة بديلة إذا كنت تحتاج إلى تعديل قراءة.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">سير العمل المعتاد</h2>
<ol class="list _decimal" type="1">
<li><p>افتح الصفحة وراجع عدد القراءات المعلقة.</p></li>
<li><p>ابحث بالاسم أو الهاتف أو العداد أو المولد أو رقم المشترك أو رقم القراءة.</p></li>
<li><p>للقراءة المعلقة، اضغط <span class="control">Update</span>.</p></li>
<li><p>غير القراءة واستبدل الصورة عند الحاجة.</p></li>
<li><p>احفظ وحدث الصفحة إذا لزم.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">ما تراه على هذه الصفحة</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>العنصر</p></th><th><p>المعنى</p></th></tr></thead><tbody>
<tr><td><p>Pending count</p></td><td><p>قراءات بانتظار المراجعة أو الفوترة.</p></td></tr>
<tr><td><p>Status tag</p></td><td><p>الحالة القادمة من النظام مثل pending أو billed أو cancelled.</p></td></tr>
<tr><td><p>Duplicate tag</p></td><td><p>لدى المشترك أكثر من قراءة معلقة.</p></td></tr>
<tr><td><p>Update</p></td><td><p>متاح فقط عندما تكون القراءة معلقة.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">خطوة بخطوة</h2>
<ol class="list _decimal" type="1">
<li><p>القائمة - KWH Readings.</p></li>
<li><p>ابحث أو مرر إلى القراءة.</p></li>
<li><p>راجع القراءة السابقة والحالية والجديدة و KWH المضافة.</p></li>
<li><p>إذا كانت الحالة pending اضغط <span class="control">Update</span>.</p></li>
<li><p>احفظ القراءة والصورة المصححة.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">أخطاء التحقق</h2>
<p>نافذة التعديل تستخدم نفس قواعد Add KWH Reading: القراءة يجب أن تكون أكبر أو تساوي KWH الحالية، ويجب وجود صورة.</p>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">أخطاء شائعة</h2>
<ul class="list _bullet">
<li><p>محاولة تعديل قراءة أصبحت billed. القراءة المفوترة مقفلة.</p></li>
<li><p>تجاهل علامة Duplicate وإنشاء قراءة معلقة إضافية.</p></li>
<li><p>تغيير القراءة دون مراجعة الصورة.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">استكشاف الأخطاء</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>المشكلة</p></th><th><p>ما تجربه</p></th></tr></thead><tbody>
<tr><td><p>Update غير متاح</p></td><td><p>القراءة ليست معلقة.</p></td></tr>
<tr><td><p>صورة المعاينة غير ظاهرة</p></td><td><p>قد لا تكون الصورة حملت. يمكنك إرفاق صورة جديدة قبل الحفظ.</p></td></tr>
<tr><td><p>القراءة غير موجودة</p></td><td><p>امسح البحث وحدث القائمة.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">صفحات ذات صلة</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="إنشاء قراءة جديدة من مشترك." href="add-kwh-reading.html">Add KWH Reading</a></p></li>
<li><p><a data-tooltip="البحث عن المشتركين قبل إنشاء القراءة." href="subscribers.html">Subscribers</a></p></li>
<li><p><a data-tooltip="روتين العمل الميداني للقراءات." href="daily-field-workflow.html">سير العمل الميداني اليومي</a></p></li>
</ul>
</section>`)
        },
        keywords: ['Review', 'KWH Readings', 'pending', 'duplicate', 'update', 'status', 'قراءات', 'معلقة']
    },
    {
        id: 'bill-collections',
        slug: 'bill-collections',
        fileName: 'bill-collections.html',
        title: text('Bill Collections', 'Bill Collections'),
        group: text('Field work', 'العمل الميداني'),
        appRoute: 'bill-collections',
        sections: coreSections,
        contentHtml: {
            en: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">What this page is for</h2>
<p><span class="control">Bill Collections</span> is used to scan bill QR codes, record collected bills, and review collections that are pending generator owner approval.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">Before you start</h2>
<ul class="list _bullet">
<li><p>Confirm you are collecting the correct bill from the subscriber.</p></li>
<li><p>Use the printed bill QR when available.</p></li>
<li><p>Remember that collected bills remain pending until owner approval.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">Regular workflow</h2>
<ol class="list _decimal" type="1">
<li><p>Open <span class="control">Bill Collections</span>.</p></li>
<li><p>Tap the QR button and scan the bill QR code.</p></li>
<li><p>Wait for the success message.</p></li>
<li><p>Review the collection card and summary totals.</p></li>
<li><p>Use date filters when checking collections from a specific day.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">What you see on this page</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Area</p></th><th><p>Meaning</p></th></tr></thead><tbody>
<tr><td><p>Date filters</p></td><td><p>Filter collections by creation date.</p></td></tr>
<tr><td><p>Total Collections</p></td><td><p>Count and amount returned by the server.</p></td></tr>
<tr><td><p>Pending / Approved / Rejected</p></td><td><p>Status breakdown for collection approval.</p></td></tr>
<tr><td><p>Collection card</p></td><td><p>Bill reference, amount, currency, status, and created date.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">Step-by-step</h2>
<ol class="list _decimal" type="1">
<li><p>Menu - Bill Collections.</p></li>
<li><p>Tap the QR icon.</p></li>
<li><p>Hold the bill QR inside the scanner box.</p></li>
<li><p>After success, the app refreshes the list and removes the QR query value.</p></li>
<li><p>Confirm the collection appears with the expected amount.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">Validation mistakes</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>What you see</p></th><th><p>Likely cause</p></th></tr></thead><tbody>
<tr><td><p>Invalid bill QR code</p></td><td><p>The QR did not include a valid bill id.</p></td></tr>
<tr><td><p>Created From cannot be after Created To</p></td><td><p>The selected date range is reversed.</p></td></tr>
<tr><td><p>No collections found</p></td><td><p>No records match the current filter or date range.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">Common mistakes</h2>
<ul class="list _bullet">
<li><p>Scanning a subscriber reading QR instead of a bill QR. That opens Add KWH Reading.</p></li>
<li><p>Using a date filter and forgetting to clear it.</p></li>
<li><p>Promising the subscriber the collection is approved before the generator owner approves it.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">Troubleshooting</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Problem</p></th><th><p>What to try</p></th></tr></thead><tbody>
<tr><td><p>Collection fails</p></td><td><p>Scan again, check internet, or confirm the bill is still collectible.</p></td></tr>
<tr><td><p>Expected bill missing</p></td><td><p>Clear filters and refresh.</p></td></tr>
<tr><td><p>Wrong QR type</p></td><td><p>Use the printed bill QR, not the subscriber QR.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">Related pages</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="How the QR camera behaves." href="qr-scanner.html">QR scanner</a></p></li>
<li><p><a data-tooltip="Daily order for field work." href="daily-field-workflow.html">Daily field workflow</a></p></li>
<li><p><a data-tooltip="Subscriber QR codes can route to reading entry." href="subscribers.html">Subscribers</a></p></li>
</ul>
</section>`),
            ar: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">الغرض من هذه الصفحة</h2>
<p>صفحة <span class="control">Bill Collections</span> تستخدم لمسح QR الفاتورة، تسجيل تحصيل الفواتير، ومراجعة التحصيلات بانتظار موافقة صاحب المولد.</p>
</section>
<section class="chapter">
<h2 data-toc="before-you-start" id="before-you-start">قبل أن تبدأ</h2>
<ul class="list _bullet">
<li><p>تأكد أنك تحصل الفاتورة الصحيحة من المشترك.</p></li>
<li><p>استخدم QR الفاتورة المطبوع عند توفره.</p></li>
<li><p>تذكر أن التحصيل يبقى معلقا حتى يوافق صاحب المولد.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="regular-workflow" id="regular-workflow">سير العمل المعتاد</h2>
<ol class="list _decimal" type="1">
<li><p>افتح <span class="control">Bill Collections</span>.</p></li>
<li><p>اضغط زر QR وامسح QR الفاتورة.</p></li>
<li><p>انتظر رسالة النجاح.</p></li>
<li><p>راجع بطاقة التحصيل وملخص المبالغ.</p></li>
<li><p>استخدم فلتر التاريخ عند مراجعة تحصيلات يوم محدد.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="what-you-see-on-this-page" id="what-you-see-on-this-page">ما تراه على هذه الصفحة</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>المنطقة</p></th><th><p>المعنى</p></th></tr></thead><tbody>
<tr><td><p>Date filters</p></td><td><p>فلترة التحصيلات حسب تاريخ الإنشاء.</p></td></tr>
<tr><td><p>Total Collections</p></td><td><p>العدد والمبلغ من النظام.</p></td></tr>
<tr><td><p>Pending / Approved / Rejected</p></td><td><p>تفصيل حالة موافقة التحصيلات.</p></td></tr>
<tr><td><p>Collection card</p></td><td><p>رقم الفاتورة والمبلغ والعملة والحالة وتاريخ الإنشاء.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">خطوة بخطوة</h2>
<ol class="list _decimal" type="1">
<li><p>القائمة - Bill Collections.</p></li>
<li><p>اضغط أيقونة QR.</p></li>
<li><p>ضع QR الفاتورة داخل مربع المسح.</p></li>
<li><p>بعد النجاح، يحدث التطبيق القائمة ويمسح قيمة QR من الرابط.</p></li>
<li><p>تأكد أن التحصيل ظهر بالمبلغ المتوقع.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="validation-mistakes" id="validation-mistakes">أخطاء التحقق</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>ما تراه</p></th><th><p>السبب المحتمل</p></th></tr></thead><tbody>
<tr><td><p>Invalid bill QR code</p></td><td><p>QR لا يحتوي على رقم فاتورة صحيح.</p></td></tr>
<tr><td><p>Created From cannot be after Created To</p></td><td><p>نطاق التاريخ معكوس.</p></td></tr>
<tr><td><p>No collections found</p></td><td><p>لا توجد سجلات تطابق الفلتر الحالي.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">أخطاء شائعة</h2>
<ul class="list _bullet">
<li><p>مسح QR قراءة مشترك بدل QR فاتورة. هذا يفتح Add KWH Reading.</p></li>
<li><p>ترك فلتر التاريخ فعالا ونسيان مسحه.</p></li>
<li><p>إخبار المشترك أن التحصيل تمت الموافقة عليه قبل موافقة صاحب المولد.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">استكشاف الأخطاء</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>المشكلة</p></th><th><p>ما تجربه</p></th></tr></thead><tbody>
<tr><td><p>فشل التحصيل</p></td><td><p>امسح مرة أخرى، تحقق من الإنترنت، أو تأكد أن الفاتورة قابلة للتحصيل.</p></td></tr>
<tr><td><p>فاتورة متوقعة غير ظاهرة</p></td><td><p>امسح الفلاتر وحدث الصفحة.</p></td></tr>
<tr><td><p>نوع QR غير صحيح</p></td><td><p>استخدم QR الفاتورة المطبوع وليس QR المشترك.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">صفحات ذات صلة</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="كيف تعمل كاميرا QR." href="qr-scanner.html">QR scanner</a></p></li>
<li><p><a data-tooltip="ترتيب العمل اليومي." href="daily-field-workflow.html">سير العمل الميداني اليومي</a></p></li>
<li><p><a data-tooltip="QR المشترك يمكن أن يفتح إدخال القراءة." href="subscribers.html">Subscribers</a></p></li>
</ul>
</section>`)
        },
        keywords: ['Field work', 'Bill Collections', 'collect', 'QR', 'approval', 'date filter', 'تحصيل', 'فاتورة']
    },
    {
        id: 'qr-scanner',
        slug: 'qr-scanner',
        fileName: 'qr-scanner.html',
        title: text('QR scanner', 'ماسح QR'),
        group: text('Tools', 'الأدوات'),
        appRoute: 'subscribers',
        sections: [
            section('what-this-page-is-for', 'What this page is for', 'الغرض من هذه الصفحة'),
            section('where-it-appears', 'Where it appears', 'أين يظهر'),
            section('supported-qr-targets', 'Supported QR targets', 'أنواع QR المدعومة'),
            section('step-by-step', 'Step-by-step', 'خطوة بخطوة'),
            section('common-mistakes', 'Common mistakes', 'أخطاء شائعة'),
            section('troubleshooting', 'Troubleshooting', 'استكشاف الأخطاء'),
            section('related-pages', 'Related pages', 'صفحات ذات صلة')
        ],
        contentHtml: {
            en: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">What this page is for</h2>
<p>The QR scanner reads Echtirak QR links and routes you to the correct task: add a KWH reading or collect a bill.</p>
</section>
<section class="chapter">
<h2 data-toc="where-it-appears" id="where-it-appears">Where it appears</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="Subscriber QR codes can open reading entry." href="subscribers.html">Subscribers</a> - scan subscriber reading QR codes.</p></li>
<li><p><a data-tooltip="Bill QR codes can collect a bill and send it for owner approval." href="bill-collections.html">Bill Collections</a> - scan bill QR codes.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="supported-qr-targets" id="supported-qr-targets">Supported QR targets</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>QR type</p></th><th><p>Result</p></th></tr></thead><tbody>
<tr><td><p>Subscriber / KWH reading QR</p></td><td><p>Opens Add KWH Reading for the subscriber.</p></td></tr>
<tr><td><p>Bill collection QR</p></td><td><p>Collects the bill and opens Bill Collections.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">Step-by-step</h2>
<ol class="list _decimal" type="1">
<li><p>Tap the QR icon.</p></li>
<li><p>Allow camera access if prompted.</p></li>
<li><p>Keep the QR inside the box and hold steady.</p></li>
<li><p>Wait for the scanner to read the same value twice and close automatically.</p></li>
<li><p>Confirm the next screen matches the task you expected.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">Common mistakes</h2>
<ul class="list _bullet">
<li><p>Scanning too far away or at an angle.</p></li>
<li><p>Using a QR from another account or an old printed document.</p></li>
<li><p>Continuing after the scanner opens the wrong task. Go back and verify before submitting.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">Troubleshooting</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>Problem</p></th><th><p>What to try</p></th></tr></thead><tbody>
<tr><td><p>Please allow camera access</p></td><td><p>Enable camera permission for the browser and reopen the scanner.</p></td></tr>
<tr><td><p>No scan result</p></td><td><p>Clean the camera, improve lighting, and center the QR.</p></td></tr>
<tr><td><p>Invalid QR</p></td><td><p>Search manually and report the printed QR.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">Related pages</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="Search and scan subscribers." href="subscribers.html">Subscribers</a></p></li>
<li><p><a data-tooltip="Scan bill QR codes." href="bill-collections.html">Bill Collections</a></p></li>
<li><p><a data-tooltip="Recommended field sequence." href="daily-field-workflow.html">Daily field workflow</a></p></li>
</ul>
</section>`),
            ar: withFooter(`<section class="chapter">
<h2 data-toc="what-this-page-is-for" id="what-this-page-is-for">الغرض من هذه الصفحة</h2>
<p>ماسح QR يقرأ روابط Echtirak ويوجهك إلى المهمة الصحيحة: إضافة قراءة KWH أو تحصيل فاتورة.</p>
</section>
<section class="chapter">
<h2 data-toc="where-it-appears" id="where-it-appears">أين يظهر</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="QR المشترك يمكن أن يفتح إدخال القراءة." href="subscribers.html">Subscribers</a> - لمسح QR قراءة المشترك.</p></li>
<li><p><a data-tooltip="QR الفاتورة يمكن أن يسجل التحصيل بانتظار موافقة صاحب المولد." href="bill-collections.html">Bill Collections</a> - لمسح QR الفاتورة.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="supported-qr-targets" id="supported-qr-targets">أنواع QR المدعومة</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>نوع QR</p></th><th><p>النتيجة</p></th></tr></thead><tbody>
<tr><td><p>Subscriber / KWH reading QR</p></td><td><p>يفتح Add KWH Reading للمشترك.</p></td></tr>
<tr><td><p>Bill collection QR</p></td><td><p>يسجل تحصيل الفاتورة ويفتح Bill Collections.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="step-by-step" id="step-by-step">خطوة بخطوة</h2>
<ol class="list _decimal" type="1">
<li><p>اضغط أيقونة QR.</p></li>
<li><p>اسمح للكاميرا إذا طلب المتصفح ذلك.</p></li>
<li><p>ضع QR داخل المربع وامسك الهاتف بثبات.</p></li>
<li><p>انتظر حتى يقرأ الماسح نفس القيمة مرتين ويغلق تلقائيا.</p></li>
<li><p>تأكد أن الصفحة التالية تطابق المهمة المطلوبة.</p></li>
</ol>
</section>
<section class="chapter">
<h2 data-toc="common-mistakes" id="common-mistakes">أخطاء شائعة</h2>
<ul class="list _bullet">
<li><p>المسح من مسافة بعيدة أو بزاوية حادة.</p></li>
<li><p>استخدام QR من حساب آخر أو مستند مطبوع قديم.</p></li>
<li><p>المتابعة بعد فتح مهمة خاطئة. ارجع وتأكد قبل الإرسال.</p></li>
</ul>
</section>
<section class="chapter">
<h2 data-toc="troubleshooting" id="troubleshooting">استكشاف الأخطاء</h2>
<div class="table-wrapper"><table class="wide"><thead><tr class="ijRowHead"><th><p>المشكلة</p></th><th><p>ما تجربه</p></th></tr></thead><tbody>
<tr><td><p>Please allow camera access</p></td><td><p>فعل إذن الكاميرا للمتصفح ثم افتح الماسح مرة أخرى.</p></td></tr>
<tr><td><p>لا توجد نتيجة مسح</p></td><td><p>نظف الكاميرا، حسن الإضاءة، وضع QR في الوسط.</p></td></tr>
<tr><td><p>Invalid QR</p></td><td><p>ابحث يدويا وأبلغ عن QR المطبوع.</p></td></tr>
</tbody></table></div>
</section>
<section class="chapter">
<h2 data-toc="related-pages" id="related-pages">صفحات ذات صلة</h2>
<ul class="list _bullet">
<li><p><a data-tooltip="البحث ومسح QR للمشتركين." href="subscribers.html">Subscribers</a></p></li>
<li><p><a data-tooltip="مسح QR الفواتير." href="bill-collections.html">Bill Collections</a></p></li>
<li><p><a data-tooltip="الترتيب الميداني الموصى به." href="daily-field-workflow.html">سير العمل الميداني اليومي</a></p></li>
</ul>
</section>`)
        },
        keywords: ['Tools', 'QR scanner', 'camera', 'barcode', 'bill QR', 'subscriber QR', 'ماسح', 'كاميرا']
    }
];
