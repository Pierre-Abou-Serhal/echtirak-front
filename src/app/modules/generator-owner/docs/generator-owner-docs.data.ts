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

export const GENERATOR_OWNER_DOCS: DocsTopic[] = [
    {
        "id": "getting-started",
        "slug": "getting-started",
        "fileName": "getting-started.html",
        "title": {
            "en": "Getting started",
            "ar": "البدء"
        },
        "group": {
            "en": "Start here",
            "ar": "ابدأ هنا"
        },
        "appRoute": null,
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start",
                "title": {
                    "en": "Before you start",
                    "ar": "قبل أن تبدأ"
                }
            },
            {
                "id": "your-regular-workflow-every-time-you-log-in",
                "title": {
                    "en": "Your regular workflow (every time you log in)",
                    "ar": "سير عملك المعتاد (في كل مرة تدخل)"
                }
            },
            {
                "id": "what-you-see-in-the-app",
                "title": {
                    "en": "What you see in the app",
                    "ar": "ما تراه في التطبيق"
                }
            },
            {
                "id": "step-by-step-first-login",
                "title": {
                    "en": "Step-by-step: first login",
                    "ar": "خطوة بخطوة: أول تسجيل دخول"
                }
            },
            {
                "id": "validation-mistakes",
                "title": {
                    "en": "Validation mistakes",
                    "ar": "أخطاء التحقق"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2><p id=\"c0524j_12\">Learn how to <span class=\"control\" id=\"c0524j_13\">sign in</span>, use the <span class=\"control\" id=\"c0524j_14\">left menu</span>, and which guide to open for each task. After this page, complete the <a data-tooltip=\"Use this once when you are new to Echtirak, or when you take over an account from someone else. Complete every item before your first real monthly billing run.\" href=\"setup-checklist.html\" id=\"c0524j_15\">Setup checklist</a>, then use the <a data-tooltip=\"This is the main workflow most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.\" href=\"monthly-billing-workflow.html\" id=\"c0524j_16\">Monthly billing workflow</a> every month.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">Before you start</h2><ul class=\"list _bullet\" id=\"c0524j_17\"><li class=\"list__item\" id=\"c0524j_18\"><p id=\"c0524j_21\">Username and password from your administrator (Generator Owner account).</p></li><li class=\"list__item\" id=\"c0524j_19\"><p id=\"c0524j_22\">A modern browser (Chrome, Edge, or Firefox).</p></li><li class=\"list__item\" id=\"c0524j_20\"><p id=\"c0524j_23\">Stable internet — the app does not work fully offline.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow-every-time-you-log-in\" id=\"your-regular-workflow-every-time-you-log-in\">Your regular workflow (every time you log in)</h2><ol class=\"list _decimal\" id=\"c0524j_24\" type=\"1\"><li class=\"list__item\" id=\"c0524j_26\"><p id=\"c0524j_30\"><span class=\"control\" id=\"c0524j_31\">Sign in</span> → you land on <a data-tooltip=\"Your control room. See subscribers, money, bills, collections, and wallet at a glance. Use it to decide what to do first each day.\" href=\"dashboard.html\" id=\"c0524j_32\">Dashboard</a>.</p></li><li class=\"list__item\" id=\"c0524j_27\"><p id=\"c0524j_33\">Glance at <span class=\"control\" id=\"c0524j_34\">Collections To Review</span> and overdue bills.</p></li><li class=\"list__item\" id=\"c0524j_28\"><p id=\"c0524j_35\">Do today’s work (approve collections, generate bills, add subscribers, etc.).</p></li><li class=\"list__item\" id=\"c0524j_29\"><p id=\"c0524j_36\">Sign out when using a shared computer.</p></li></ol><aside class=\"prompt\" data-title=\"\" data-type=\"tip\" id=\"c0524j_25\"><p id=\"c0524j_37\"><span class=\"control\" id=\"c0524j_38\">Monthly cycle:</span> Follow <a data-tooltip=\"This is the main workflow most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.\" href=\"monthly-billing-workflow.html\" id=\"c0524j_39\">Monthly billing workflow</a> in the same order each month.</p></aside></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-in-the-app\" id=\"what-you-see-in-the-app\">What you see in the app</h2><section class=\"chapter\"><h3 data-toc=\"left-menu-main-work\" id=\"left-menu-main-work\">Left menu (main work)</h3><div class=\"table-wrapper\"><table class=\"wide\" id=\"c0524j_42\"><thead><tr class=\"ijRowHead\" id=\"c0524j_43\"><th id=\"c0524j_58\"><p>Menu item</p></th><th id=\"c0524j_59\"><p>Use it for</p></th></tr></thead><tbody><tr id=\"c0524j_44\"><td id=\"c0524j_60\"><p>Dashboard</p></td><td id=\"c0524j_61\"><p>Summary and what needs attention</p></td></tr><tr id=\"c0524j_45\"><td id=\"c0524j_62\"><p>Subscribers</p></td><td id=\"c0524j_63\"><p>Customers and QR codes</p></td></tr><tr id=\"c0524j_46\"><td id=\"c0524j_64\"><p>Subscriber Addresses</p></td><td id=\"c0524j_65\"><p>Extra locations per customer</p></td></tr><tr id=\"c0524j_47\"><td id=\"c0524j_66\"><p>Generators</p></td><td id=\"c0524j_67\"><p>Your machines / areas</p></td></tr><tr id=\"c0524j_48\"><td id=\"c0524j_68\"><p>Bill Collectors</p></td><td id=\"c0524j_69\"><p>Field staff accounts</p></td></tr><tr id=\"c0524j_49\"><td id=\"c0524j_70\"><p>Billing Models</p></td><td id=\"c0524j_71\"><p>How you charge (fixed or meter)</p></td></tr><tr id=\"c0524j_50\"><td id=\"c0524j_72\"><p>Bill Collections</p></td><td id=\"c0524j_73\"><p>Approve payments collectors recorded</p></td></tr><tr id=\"c0524j_51\"><td id=\"c0524j_74\"><p>Bills</p></td><td id=\"c0524j_75\"><p>List, create, and generate bills</p></td></tr><tr id=\"c0524j_52\"><td id=\"c0524j_76\"><p>KWH Readings</p></td><td id=\"c0524j_77\"><p>Meter history</p></td></tr><tr id=\"c0524j_53\"><td id=\"c0524j_78\"><p>SMS Templates</p></td><td id=\"c0524j_79\"><p>Message text patterns</p></td></tr><tr id=\"c0524j_54\"><td id=\"c0524j_80\"><p>SMS Campaigns</p></td><td id=\"c0524j_81\"><p>Send bulk SMS</p></td></tr><tr id=\"c0524j_55\"><td id=\"c0524j_82\"><p>Currency Rates</p></td><td id=\"c0524j_83\"><p>USD / LBP conversion</p></td></tr><tr id=\"c0524j_56\"><td id=\"c0524j_84\"><p>Wallet</p></td><td id=\"c0524j_85\"><p>Echtirak service balance</p></td></tr><tr id=\"c0524j_57\"><td id=\"c0524j_86\"><p>Announcements</p></td><td id=\"c0524j_87\"><p>Messages from support</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h3 data-toc=\"top-right\" id=\"top-right\">Top right</h3><ul class=\"list _bullet\" id=\"c0524j_88\"><li class=\"list__item\" id=\"c0524j_89\"><p id=\"c0524j_90\"><span class=\"control\" id=\"c0524j_91\">Profile</span> — your business name and contact details.</p></li></ul></section></section><section class=\"chapter\"><h2 data-toc=\"step-by-step-first-login\" id=\"step-by-step-first-login\">Step-by-step: first login</h2><ol class=\"list _decimal\" id=\"c0524j_92\" type=\"1\"><li class=\"list__item\" id=\"c0524j_93\"><p id=\"c0524j_98\">Open your Echtirak link (production or UAT).</p></li><li class=\"list__item\" id=\"c0524j_94\"><p id=\"c0524j_99\">Click <span class=\"control\" id=\"c0524j_100\">Sign in</span>.</p></li><li class=\"list__item\" id=\"c0524j_95\"><p id=\"c0524j_101\">Enter username and password → confirm you see <span class=\"control\" id=\"c0524j_102\">Dashboard</span>.</p></li><li class=\"list__item\" id=\"c0524j_96\"><p id=\"c0524j_103\">If you are new, open <a data-tooltip=\"Use this once when you are new to Echtirak, or when you take over an account from someone else. Complete every item before your first real monthly billing run.\" href=\"setup-checklist.html\" id=\"c0524j_104\">Setup checklist</a> and complete all steps.</p></li><li class=\"list__item\" id=\"c0524j_97\"><p id=\"c0524j_105\">Bookmark <a data-tooltip=\"This is the main workflow most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.\" href=\"monthly-billing-workflow.html\" id=\"c0524j_106\">Monthly billing workflow</a>.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">Validation mistakes</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"c0524j_107\"><thead><tr class=\"ijRowHead\" id=\"c0524j_108\"><th id=\"c0524j_112\"><p>What you see</p></th><th id=\"c0524j_113\"><p>Likely cause</p></th></tr></thead><tbody><tr id=\"c0524j_109\"><td id=\"c0524j_114\"><p>“Access denied”</p></td><td id=\"c0524j_115\"><p>Wrong role (not Generator Owner)</p></td></tr><tr id=\"c0524j_110\"><td id=\"c0524j_116\"><p>Empty menu</p></td><td id=\"c0524j_117\"><p>Wrong account or session expired — sign in again</p></td></tr><tr id=\"c0524j_111\"><td id=\"c0524j_118\"><p>Red fields on a form</p></td><td id=\"c0524j_119\"><p>Required item missing — read the label on screen</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2><ul class=\"list _bullet\" id=\"c0524j_120\"><li class=\"list__item\" id=\"c0524j_121\"><p id=\"c0524j_124\">Using a <span class=\"control\" id=\"c0524j_125\">bill collector</span> login on the owner app — menu and permissions differ.</p></li><li class=\"list__item\" id=\"c0524j_122\"><p id=\"c0524j_126\">Skipping setup and generating bills immediately — see <a data-tooltip=\"Use this once when you are new to Echtirak, or when you take over an account from someone else. Complete every item before your first real monthly billing run.\" href=\"setup-checklist.html\" id=\"c0524j_127\">Setup checklist</a>.</p></li><li class=\"list__item\" id=\"c0524j_123\"><p id=\"c0524j_128\">Working in the wrong <span class=\"control\" id=\"c0524j_129\">month</span> on bills or readings — always confirm year/month on screen.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"c0524j_130\"><thead><tr class=\"ijRowHead\" id=\"c0524j_131\"><th id=\"c0524j_135\"><p>Problem</p></th><th id=\"c0524j_136\"><p>What to try</p></th></tr></thead><tbody><tr id=\"c0524j_132\"><td id=\"c0524j_137\"><p>Cannot sign in</p></td><td id=\"c0524j_138\"><p>Check caps lock; ask admin to reset password</p></td></tr><tr id=\"c0524j_133\"><td id=\"c0524j_139\"><p>Page blank after login</p></td><td id=\"c0524j_140\"><p>Refresh; clear cache; try another browser</p></td></tr><tr id=\"c0524j_134\"><td id=\"c0524j_141\"><p>Changes not saved</p></td><td id=\"c0524j_142\"><p>Look for red error text; check required fields</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2><ul class=\"list _bullet\" id=\"c0524j_143\"><li class=\"list__item\" id=\"c0524j_144\"><p id=\"c0524j_147\"><a data-tooltip=\"Use this once when you are new to Echtirak, or when you take over an account from someone else. Complete every item before your first real monthly billing run.\" href=\"setup-checklist.html\" id=\"c0524j_148\">Setup checklist</a></p></li><li class=\"list__item\" id=\"c0524j_145\"><p id=\"c0524j_149\"><a data-tooltip=\"This is the main workflow most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.\" href=\"monthly-billing-workflow.html\" id=\"c0524j_150\">Monthly billing workflow</a></p></li><li class=\"list__item\" id=\"c0524j_146\"><p id=\"c0524j_151\"><a data-tooltip=\"Your control room. See subscribers, money, bills, collections, and wallet at a glance. Use it to decide what to do first each day.\" href=\"dashboard.html\" id=\"c0524j_152\">Dashboard</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__next\" href=\"setup-checklist.html\">Setup checklist</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"-66pnnx_13\">تتعلم <span class=\"control\" id=\"-66pnnx_14\">تسجيل الدخول</span>، استخدام <span class=\"control\" id=\"-66pnnx_15\">القائمة اليسرى</span>، وأي دليل تفتح لكل مهمة. بعد هذه الصفحة، أكمل <a data-tooltip=\"استخدمها مرة واحدة عند بدء العمل على Echtirak، أو عند استلام حساب من شخص آخر. أكمل كل بند قبل أول دورة فوترة شهرية حقيقية.\" href=\"setup-checklist.html\" id=\"-66pnnx_16\">قائمة الإعداد</a>، ثم استخدم <a data-tooltip=\"هذا سير العمل الرئيسي الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.\" href=\"monthly-billing-workflow.html\" id=\"-66pnnx_17\">دورة الفوترة الشهرية</a> كل شهر.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">قبل أن تبدأ</h2><ul class=\"list _bullet\" id=\"-66pnnx_18\"><li class=\"list__item\" id=\"-66pnnx_19\"><p id=\"-66pnnx_22\">اسم المستخدم وكلمة المرور من المسؤول (حساب Generator Owner).</p></li><li class=\"list__item\" id=\"-66pnnx_20\"><p id=\"-66pnnx_23\">متصفح حديث (Chrome أو Edge أو Firefox).</p></li><li class=\"list__item\" id=\"-66pnnx_21\"><p id=\"-66pnnx_24\">إنترنت مستقر — التطبيق لا يعمل بالكامل دون اتصال.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow-every-time-you-log-in\" id=\"your-regular-workflow-every-time-you-log-in\">سير عملك المعتاد (في كل مرة تدخل)</h2><ol class=\"list _decimal\" id=\"-66pnnx_25\" type=\"1\"><li class=\"list__item\" id=\"-66pnnx_27\"><p id=\"-66pnnx_31\"><span class=\"control\" id=\"-66pnnx_32\">Sign in</span> → تصل إلى <a data-tooltip=\"غرفة التحكم لديك. ترى المشتركين والأموال والفواتير والتحصيل والـ wallet بنظرة واحدة. استخدمها لتحديد ماذا تفعل أولاً كل يوم.\" href=\"dashboard.html\" id=\"-66pnnx_33\">Dashboard</a>.</p></li><li class=\"list__item\" id=\"-66pnnx_28\"><p id=\"-66pnnx_34\">انظر إلى <span class=\"control\" id=\"-66pnnx_35\">Collections To Review</span> والفواتير المتأخرة.</p></li><li class=\"list__item\" id=\"-66pnnx_29\"><p id=\"-66pnnx_36\">نفّذ عمل اليوم (اعتماد التحصيلات، إنشاء الفواتير، إضافة مشتركين، إلخ).</p></li><li class=\"list__item\" id=\"-66pnnx_30\"><p id=\"-66pnnx_37\"><span class=\"control\" id=\"-66pnnx_38\">Sign out</span> عند استخدام جهاز مشترك.</p></li></ol><aside class=\"prompt\" data-title=\"\" data-type=\"tip\" id=\"-66pnnx_26\"><p id=\"-66pnnx_39\"><span class=\"control\" id=\"-66pnnx_40\">الدورة الشهرية:</span> اتبع <a data-tooltip=\"هذا سير العمل الرئيسي الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.\" href=\"monthly-billing-workflow.html\" id=\"-66pnnx_41\">دورة الفوترة الشهرية</a> بنفس الترتيب كل شهر.</p></aside></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-in-the-app\" id=\"what-you-see-in-the-app\">ما تراه في التطبيق</h2><section class=\"chapter\"><h3 data-toc=\"-66pnnx_42\" id=\"-66pnnx_42\">القائمة اليسرى (العمل اليومي)</h3><div class=\"table-wrapper\"><table class=\"wide\" id=\"-66pnnx_44\"><thead><tr class=\"ijRowHead\" id=\"-66pnnx_45\"><th id=\"-66pnnx_60\"><p>عنصر القائمة</p></th><th id=\"-66pnnx_61\"><p>استخدمه من أجل</p></th></tr></thead><tbody><tr id=\"-66pnnx_46\"><td id=\"-66pnnx_62\"><p>Dashboard</p></td><td id=\"-66pnnx_63\"><p>ملخص وما يحتاج انتباهك</p></td></tr><tr id=\"-66pnnx_47\"><td id=\"-66pnnx_64\"><p>Subscribers</p></td><td id=\"-66pnnx_65\"><p>المشتركين ورموز QR</p></td></tr><tr id=\"-66pnnx_48\"><td id=\"-66pnnx_66\"><p>Subscriber Addresses</p></td><td id=\"-66pnnx_67\"><p>عناوين إضافية لنفس المشترك</p></td></tr><tr id=\"-66pnnx_49\"><td id=\"-66pnnx_68\"><p>Generators</p></td><td id=\"-66pnnx_69\"><p>المولدات / المناطق</p></td></tr><tr id=\"-66pnnx_50\"><td id=\"-66pnnx_70\"><p>Bill Collectors</p></td><td id=\"-66pnnx_71\"><p>حسابات جامعي التحصيل</p></td></tr><tr id=\"-66pnnx_51\"><td id=\"-66pnnx_72\"><p>Billing Models</p></td><td id=\"-66pnnx_73\"><p>طريقة التسعير (ثابت أو عداد)</p></td></tr><tr id=\"-66pnnx_52\"><td id=\"-66pnnx_74\"><p>Bill Collections</p></td><td id=\"-66pnnx_75\"><p>اعتماد مدفوعات الجامعين</p></td></tr><tr id=\"-66pnnx_53\"><td id=\"-66pnnx_76\"><p>Bills</p></td><td id=\"-66pnnx_77\"><p>عرض وإنشاء وتوليد الفواتير</p></td></tr><tr id=\"-66pnnx_54\"><td id=\"-66pnnx_78\"><p>KWH Readings</p></td><td id=\"-66pnnx_79\"><p>سجل قراءات العداد</p></td></tr><tr id=\"-66pnnx_55\"><td id=\"-66pnnx_80\"><p>SMS Templates</p></td><td id=\"-66pnnx_81\"><p>نصوص الرسائل</p></td></tr><tr id=\"-66pnnx_56\"><td id=\"-66pnnx_82\"><p>SMS Campaigns</p></td><td id=\"-66pnnx_83\"><p>إرسال SMS جماعي</p></td></tr><tr id=\"-66pnnx_57\"><td id=\"-66pnnx_84\"><p>Currency Rates</p></td><td id=\"-66pnnx_85\"><p>تحويل USD / LBP</p></td></tr><tr id=\"-66pnnx_58\"><td id=\"-66pnnx_86\"><p>Wallet</p></td><td id=\"-66pnnx_87\"><p>رصيد خدمات إشتراك</p></td></tr><tr id=\"-66pnnx_59\"><td id=\"-66pnnx_88\"><p>Announcements</p></td><td id=\"-66pnnx_89\"><p>رسائل من الدعم</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h3 data-toc=\"-66pnnx_43\" id=\"-66pnnx_43\">أعلى اليمين</h3><ul class=\"list _bullet\" id=\"-66pnnx_90\"><li class=\"list__item\" id=\"-66pnnx_91\"><p id=\"-66pnnx_92\"><span class=\"control\" id=\"-66pnnx_93\">Profile</span> — اسم عملك وبيانات الاتصال.</p></li></ul></section></section><section class=\"chapter\"><h2 data-toc=\"step-by-step-first-login\" id=\"step-by-step-first-login\">خطوة بخطوة: أول تسجيل دخول</h2><ol class=\"list _decimal\" id=\"-66pnnx_94\" type=\"1\"><li class=\"list__item\" id=\"-66pnnx_95\"><p id=\"-66pnnx_100\">افتح رابط Echtirak (الإنتاج أو UAT).</p></li><li class=\"list__item\" id=\"-66pnnx_96\"><p id=\"-66pnnx_101\">اضغط <span class=\"control\" id=\"-66pnnx_102\">Sign in</span>.</p></li><li class=\"list__item\" id=\"-66pnnx_97\"><p id=\"-66pnnx_103\">أدخل اسم المستخدم وكلمة المرور → تأكد أنك ترى <span class=\"control\" id=\"-66pnnx_104\">Dashboard</span>.</p></li><li class=\"list__item\" id=\"-66pnnx_98\"><p id=\"-66pnnx_105\">إن كنت جديداً، افتح <a data-tooltip=\"استخدمها مرة واحدة عند بدء العمل على Echtirak، أو عند استلام حساب من شخص آخر. أكمل كل بند قبل أول دورة فوترة شهرية حقيقية.\" href=\"setup-checklist.html\" id=\"-66pnnx_106\">قائمة الإعداد</a> وأكمل كل الخطوات.</p></li><li class=\"list__item\" id=\"-66pnnx_99\"><p id=\"-66pnnx_107\">احفظ <a data-tooltip=\"هذا سير العمل الرئيسي الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.\" href=\"monthly-billing-workflow.html\" id=\"-66pnnx_108\">دورة الفوترة الشهرية</a> في المفضلة.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">أخطاء التحقق</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-66pnnx_109\"><thead><tr class=\"ijRowHead\" id=\"-66pnnx_110\"><th id=\"-66pnnx_114\"><p>ما تراه</p></th><th id=\"-66pnnx_115\"><p>السبب المحتمل</p></th></tr></thead><tbody><tr id=\"-66pnnx_111\"><td id=\"-66pnnx_116\"><p>Access denied</p></td><td id=\"-66pnnx_117\"><p>دور خاطئ (ليس Generator Owner)</p></td></tr><tr id=\"-66pnnx_112\"><td id=\"-66pnnx_118\"><p>قائمة فارغة</p></td><td id=\"-66pnnx_119\"><p>حساب خاطئ أو انتهت الجلسة — سجّل الدخول مجدداً</p></td></tr><tr id=\"-66pnnx_113\"><td id=\"-66pnnx_120\"><p>حقول حمراء في نموذج</p></td><td id=\"-66pnnx_121\"><p>حقل مطلوب ناقص — اقرأ التسمية على الشاشة</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"-66pnnx_122\"><li class=\"list__item\" id=\"-66pnnx_123\"><p id=\"-66pnnx_126\">استخدام حساب <span class=\"control\" id=\"-66pnnx_127\">bill collector</span> على تطبيق المالك — القائمة والصلاحيات مختلفة.</p></li><li class=\"list__item\" id=\"-66pnnx_124\"><p id=\"-66pnnx_128\">تخطي الإعداد وتوليد الفواتير مباشرة — راجع <a data-tooltip=\"استخدمها مرة واحدة عند بدء العمل على Echtirak، أو عند استلام حساب من شخص آخر. أكمل كل بند قبل أول دورة فوترة شهرية حقيقية.\" href=\"setup-checklist.html\" id=\"-66pnnx_129\">قائمة الإعداد</a>.</p></li><li class=\"list__item\" id=\"-66pnnx_125\"><p id=\"-66pnnx_130\">العمل على <span class=\"control\" id=\"-66pnnx_131\">شهر</span> خاطئ في الفواتير أو القراءات — تأكد دائماً من السنة/الشهر على الشاشة.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-66pnnx_132\"><thead><tr class=\"ijRowHead\" id=\"-66pnnx_133\"><th id=\"-66pnnx_137\"><p>المشكلة</p></th><th id=\"-66pnnx_138\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"-66pnnx_134\"><td id=\"-66pnnx_139\"><p>لا أستطيع تسجيل الدخول</p></td><td id=\"-66pnnx_140\"><p>تحقق من Caps Lock؛ اطلب من المسؤول إعادة تعيين كلمة المرور</p></td></tr><tr id=\"-66pnnx_135\"><td id=\"-66pnnx_141\"><p>صفحة فارغة بعد الدخول</p></td><td id=\"-66pnnx_142\"><p>حدّث الصفحة؛ امسح الكاش؛ جرّب متصفحاً آخر</p></td></tr><tr id=\"-66pnnx_136\"><td id=\"-66pnnx_143\"><p>التغييرات لم تُحفظ</p></td><td id=\"-66pnnx_144\"><p>ابحث عن رسالة خطأ حمراء؛ تحقق من الحقول المطلوبة</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"-66pnnx_145\"><li class=\"list__item\" id=\"-66pnnx_146\"><p id=\"-66pnnx_149\"><a data-tooltip=\"استخدمها مرة واحدة عند بدء العمل على Echtirak، أو عند استلام حساب من شخص آخر. أكمل كل بند قبل أول دورة فوترة شهرية حقيقية.\" href=\"setup-checklist.html\" id=\"-66pnnx_150\">قائمة الإعداد</a></p></li><li class=\"list__item\" id=\"-66pnnx_147\"><p id=\"-66pnnx_151\"><a data-tooltip=\"هذا سير العمل الرئيسي الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.\" href=\"monthly-billing-workflow.html\" id=\"-66pnnx_152\">دورة الفوترة الشهرية</a></p></li><li class=\"list__item\" id=\"-66pnnx_148\"><p id=\"-66pnnx_153\"><a data-tooltip=\"غرفة التحكم لديك. ترى المشتركين والأموال والفواتير والتحصيل والـ wallet بنظرة واحدة. استخدمها لتحديد ماذا تفعل أولاً كل يوم.\" href=\"dashboard.html\" id=\"-66pnnx_154\">Dashboard</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__next\" href=\"setup-checklist.html\">قائمة الإعداد</a></div>"
        },
        "keywords": [
            "Getting started",
            "Start here",
            "getting started",
            "ابدأ هنا",
            "البدء"
        ]
    },
    {
        "id": "setup-checklist",
        "slug": "setup-checklist",
        "fileName": "setup-checklist.html",
        "title": {
            "en": "Setup checklist",
            "ar": "قائمة الإعداد"
        },
        "group": {
            "en": "Start here",
            "ar": "ابدأ هنا"
        },
        "appRoute": null,
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start",
                "title": {
                    "en": "Before you start",
                    "ar": "قبل أن تبدأ"
                }
            },
            {
                "id": "one-time-setup-workflow",
                "title": {
                    "en": "One-time setup workflow",
                    "ar": "سير الإعداد لمرة واحدة"
                }
            },
            {
                "id": "validation-mistakes-app-will-block-or-warn",
                "title": {
                    "en": "Validation mistakes (app will block or warn)",
                    "ar": "أخطاء التحقق (التطبيق يمنع أو يحذّر)"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2><p id=\"z69aaqt_10\">Use this <span class=\"control\" id=\"z69aaqt_11\">once</span> when you are new to Echtirak, or when you take over an account from someone else. Complete every item <span class=\"control\" id=\"z69aaqt_12\">before</span> your first real monthly billing run.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">Before you start</h2><ul class=\"list _bullet\" id=\"z69aaqt_13\"><li class=\"list__item\" id=\"z69aaqt_14\"><p id=\"z69aaqt_17\">You have a <span class=\"control\" id=\"z69aaqt_18\">Generator Owner</span> login (not bill collector, not admin).</p></li><li class=\"list__item\" id=\"z69aaqt_15\"><p id=\"z69aaqt_19\">You know which <span class=\"control\" id=\"z69aaqt_20\">generators</span> (areas / machines) you operate.</p></li><li class=\"list__item\" id=\"z69aaqt_16\"><p id=\"z69aaqt_21\">You have a list of <span class=\"control\" id=\"z69aaqt_22\">subscribers</span> with phone numbers and how each one is charged (fixed or meter).</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"one-time-setup-workflow\" id=\"one-time-setup-workflow\">One-time setup workflow</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"z69aaqt_23\"><thead><tr class=\"ijRowHead\" id=\"z69aaqt_25\"><th id=\"z69aaqt_34\"><p>Step</p></th><th id=\"z69aaqt_35\"><p>Menu in app</p></th><th id=\"z69aaqt_36\"><p>Done when…</p></th></tr></thead><tbody><tr id=\"z69aaqt_26\"><td id=\"z69aaqt_37\"><p>1</p></td><td id=\"z69aaqt_38\"><p><a data-tooltip=\"Register each generator (machine or supply zone). Subscribers, readings, and reports are grouped by generator.\" href=\"generators.html\" id=\"z69aaqt_40\">Generators</a></p></td><td id=\"z69aaqt_39\"><p>Every machine/area is listed and <span class=\"control\" id=\"z69aaqt_41\">active</span></p></td></tr><tr id=\"z69aaqt_27\"><td id=\"z69aaqt_42\"><p>2</p></td><td id=\"z69aaqt_43\"><p><a data-tooltip=\"Define how you charge: fixed monthly amount or by meter (KWH), with prices and fees. Every subscriber must have one model.\" href=\"billing-models.html\" id=\"z69aaqt_45\">Billing Models</a></p></td><td id=\"z69aaqt_44\"><p>At least one <span class=\"control\" id=\"z69aaqt_46\">fixed</span> and/or <span class=\"control\" id=\"z69aaqt_47\">metered</span> model exists with correct prices</p></td></tr><tr id=\"z69aaqt_28\"><td id=\"z69aaqt_48\"><p>3</p></td><td id=\"z69aaqt_49\"><p><a data-tooltip=\"Set how dollars convert to pounds (or other pairs) on bills when you use more than one currency.\" href=\"currency-rates.html\" id=\"z69aaqt_51\">Currency Rates</a></p></td><td id=\"z69aaqt_50\"><p>USD→LBP (or your currencies) is set for the current period</p></td></tr><tr id=\"z69aaqt_29\"><td id=\"z69aaqt_52\"><p>4</p></td><td id=\"z69aaqt_53\"><p><a data-tooltip=\"Manage everyone who receives electricity from you: add, edit, deactivate, export list, and print QR codes so they can view bills online.\" href=\"subscribers.html\" id=\"z69aaqt_55\">Subscribers</a></p></td><td id=\"z69aaqt_54\"><p>Every customer is added with <span class=\"control\" id=\"z69aaqt_56\">phone</span>, <span class=\"control\" id=\"z69aaqt_57\">generator</span>, <span class=\"control\" id=\"z69aaqt_58\">billing model</span>, <span class=\"control\" id=\"z69aaqt_59\">active</span></p></td></tr><tr id=\"z69aaqt_30\"><td id=\"z69aaqt_60\"><p>5</p></td><td id=\"z69aaqt_61\"><p><a data-tooltip=\"Link extra locations to one subscriber (shop + home, multiple floors, etc.) so bills and visits target the right place.\" href=\"subscriber-addresses.html\" id=\"z69aaqt_63\">Subscriber Addresses</a></p></td><td id=\"z69aaqt_62\"><p>Extra locations added where one person has more than one meter/shop</p></td></tr><tr id=\"z69aaqt_31\"><td id=\"z69aaqt_64\"><p>6</p></td><td id=\"z69aaqt_65\"><p><a data-tooltip=\"Create accounts for field staff who record readings and payments. Control which generators each person can see.\" href=\"bill-collectors.html\" id=\"z69aaqt_67\">Bill Collectors</a></p></td><td id=\"z69aaqt_66\"><p>Each field worker has an account and correct <span class=\"control\" id=\"z69aaqt_68\">generator</span> access</p></td></tr><tr id=\"z69aaqt_32\"><td id=\"z69aaqt_69\"><p>7</p></td><td id=\"z69aaqt_70\"><p><a data-tooltip=\"Ready-made SMS text with placeholders (name, amount, month). Reuse in campaigns so every message is consistent and professional.\" href=\"sms-templates.html\" id=\"z69aaqt_72\">SMS Templates</a></p></td><td id=\"z69aaqt_71\"><p>Optional but recommended: “bill ready” and “payment received” templates</p></td></tr><tr id=\"z69aaqt_33\"><td id=\"z69aaqt_73\"><p>8</p></td><td id=\"z69aaqt_74\"><p><a data-tooltip=\"Balance you keep with Echtirak to pay for platform services (SMS, subscription charges). Not cash from subscribers — that flows through Bill Collections.\" href=\"wallet.html\" id=\"z69aaqt_76\">Wallet</a></p></td><td id=\"z69aaqt_75\"><p>Balance is enough for SMS and platform fees if you use SMS</p></td></tr></tbody></table></div><aside class=\"prompt\" data-title=\"\" data-type=\"tip\" id=\"z69aaqt_24\"><p id=\"z69aaqt_77\"><span class=\"control\" id=\"z69aaqt_78\">Workflow rule:</span> Do not skip steps 1–4. Bills and collections depend on them.</p></aside></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes-app-will-block-or-warn\" id=\"validation-mistakes-app-will-block-or-warn\">Validation mistakes (app will block or warn)</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"z69aaqt_79\"><thead><tr class=\"ijRowHead\" id=\"z69aaqt_80\"><th id=\"z69aaqt_86\"><p>What you tried</p></th><th id=\"z69aaqt_87\"><p>What usually went wrong</p></th></tr></thead><tbody><tr id=\"z69aaqt_81\"><td id=\"z69aaqt_88\"><p>Save subscriber</p></td><td id=\"z69aaqt_89\"><p>Missing <span class=\"control\" id=\"z69aaqt_90\">phone</span>, <span class=\"control\" id=\"z69aaqt_91\">generator</span>, or <span class=\"control\" id=\"z69aaqt_92\">billing model</span></p></td></tr><tr id=\"z69aaqt_82\"><td id=\"z69aaqt_93\"><p>Generate bills</p></td><td id=\"z69aaqt_94\"><p>Subscriber <span class=\"control\" id=\"z69aaqt_95\">inactive</span> or no model</p></td></tr><tr id=\"z69aaqt_83\"><td id=\"z69aaqt_96\"><p>Generate metered bills</p></td><td id=\"z69aaqt_97\"><p>No <span class=\"control\" id=\"z69aaqt_98\">KWH reading</span> for that month</p></td></tr><tr id=\"z69aaqt_84\"><td id=\"z69aaqt_99\"><p>Send SMS</p></td><td id=\"z69aaqt_100\"><p>Missing <span class=\"control\" id=\"z69aaqt_101\">phone</span> or low <span class=\"control\" id=\"z69aaqt_102\">wallet</span> balance</p></td></tr><tr id=\"z69aaqt_85\"><td id=\"z69aaqt_103\"><p>Approve collection</p></td><td id=\"z69aaqt_104\"><p>Bill already <span class=\"control\" id=\"z69aaqt_105\">paid</span> or wrong amount</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2><ul class=\"list _bullet\" id=\"z69aaqt_106\"><li class=\"list__item\" id=\"z69aaqt_107\"><p id=\"z69aaqt_110\">Entering all subscribers before creating <span class=\"control\" id=\"z69aaqt_111\">billing models</span> — you must go back and fix each one.</p></li><li class=\"list__item\" id=\"z69aaqt_108\"><p id=\"z69aaqt_112\">One generic billing model for everyone — mixed fixed and metered customers need different models.</p></li><li class=\"list__item\" id=\"z69aaqt_109\"><p id=\"z69aaqt_113\">Collectors created without <span class=\"control\" id=\"z69aaqt_114\">generator</span> assignment — they see an empty list in the field.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"z69aaqt_115\"><thead><tr class=\"ijRowHead\" id=\"z69aaqt_116\"><th id=\"z69aaqt_120\"><p>Problem</p></th><th id=\"z69aaqt_121\"><p>What to try</p></th></tr></thead><tbody><tr id=\"z69aaqt_117\"><td id=\"z69aaqt_122\"><p>Cannot add subscriber</p></td><td id=\"z69aaqt_123\"><p>Complete generators and billing models first</p></td></tr><tr id=\"z69aaqt_118\"><td id=\"z69aaqt_124\"><p>Model price looks wrong</p></td><td id=\"z69aaqt_125\"><p>Edit model before generating bills; do not change old bills casually</p></td></tr><tr id=\"z69aaqt_119\"><td id=\"z69aaqt_126\"><p>Collector cannot log in</p></td><td id=\"z69aaqt_127\"><p>Confirm account is active; reset password with your administrator</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2><ul class=\"list _bullet\" id=\"z69aaqt_128\"><li class=\"list__item\" id=\"z69aaqt_129\"><p id=\"z69aaqt_132\"><a data-tooltip=\"Learn how to sign in, use the left menu, and which guide to open for each task. After this page, complete the Setup checklist, then use the Monthly billing workflow every month.\" href=\"getting-started.html\" id=\"z69aaqt_133\">Getting started</a></p></li><li class=\"list__item\" id=\"z69aaqt_130\"><p id=\"z69aaqt_134\"><a data-tooltip=\"This is the main workflow most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.\" href=\"monthly-billing-workflow.html\" id=\"z69aaqt_135\">Monthly billing workflow</a></p></li><li class=\"list__item\" id=\"z69aaqt_131\"><p id=\"z69aaqt_136\"><a data-tooltip=\"Manage everyone who receives electricity from you: add, edit, deactivate, export list, and print QR codes so they can view bills online.\" href=\"subscribers.html\" id=\"z69aaqt_137\">Subscribers</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"getting-started.html\">Getting started</a><a class=\"navigation-links__next\" href=\"monthly-billing-workflow.html\">Monthly billing workflow</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"-bxkf1n_11\">استخدمها <span class=\"control\" id=\"-bxkf1n_12\">مرة واحدة</span> عند بدء العمل على Echtirak، أو عند استلام حساب من شخص آخر. أكمل كل بند <span class=\"control\" id=\"-bxkf1n_13\">قبل</span> أول دورة فوترة شهرية حقيقية.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">قبل أن تبدأ</h2><ul class=\"list _bullet\" id=\"-bxkf1n_14\"><li class=\"list__item\" id=\"-bxkf1n_15\"><p id=\"-bxkf1n_18\">لديك حساب <span class=\"control\" id=\"-bxkf1n_19\">Generator Owner</span> (ليس bill collector ولا admin).</p></li><li class=\"list__item\" id=\"-bxkf1n_16\"><p id=\"-bxkf1n_20\">تعرف <span class=\"control\" id=\"-bxkf1n_21\">Generators</span> (المناطق / المولدات) التي تديرها.</p></li><li class=\"list__item\" id=\"-bxkf1n_17\"><p id=\"-bxkf1n_22\">لديك قائمة <span class=\"control\" id=\"-bxkf1n_23\">Subscribers</span> بأرقام الهواتف وطريقة التسعير (ثابت أو عداد).</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"one-time-setup-workflow\" id=\"one-time-setup-workflow\">سير الإعداد لمرة واحدة</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-bxkf1n_24\"><thead><tr class=\"ijRowHead\" id=\"-bxkf1n_26\"><th id=\"-bxkf1n_35\"><p>الخطوة</p></th><th id=\"-bxkf1n_36\"><p>القائمة في التطبيق</p></th><th id=\"-bxkf1n_37\"><p>تُعتبر منتهية عندما…</p></th></tr></thead><tbody><tr id=\"-bxkf1n_27\"><td id=\"-bxkf1n_38\"><p>1</p></td><td id=\"-bxkf1n_39\"><p><a data-tooltip=\"تسجيل كل generator (مولدة أو منطقة تغذية). المشتركون والقراءات والتقارير تُجمَّع حسب generator.\" href=\"generators.html\" id=\"-bxkf1n_41\">Generators</a></p></td><td id=\"-bxkf1n_40\"><p>كل مولدة/منطقة مسجلة و<span class=\"control\" id=\"-bxkf1n_42\">active</span></p></td></tr><tr id=\"-bxkf1n_28\"><td id=\"-bxkf1n_43\"><p>2</p></td><td id=\"-bxkf1n_44\"><p><a data-tooltip=\"تحديد كيف تُحاسب: مبلغ شهري ثابت أو حسب العداد (KWH)، مع الأسعار والرسوم. كل مشترك يحتاج نموذجاً واحداً.\" href=\"billing-models.html\" id=\"-bxkf1n_46\">Billing Models</a></p></td><td id=\"-bxkf1n_45\"><p>يوجد نموذج <span class=\"control\" id=\"-bxkf1n_47\">fixed</span> و/أو <span class=\"control\" id=\"-bxkf1n_48\">metered</span> بأسعار صحيحة</p></td></tr><tr id=\"-bxkf1n_29\"><td id=\"-bxkf1n_49\"><p>3</p></td><td id=\"-bxkf1n_50\"><p><a data-tooltip=\"تحديد كيف يتحوّل الدولار إلى الليرة (أو أزواج أخرى) على الفواتير عند استخدام أكثر من عملة.\" href=\"currency-rates.html\" id=\"-bxkf1n_52\">Currency Rates</a></p></td><td id=\"-bxkf1n_51\"><p>سعر USD→LBP (أو عملاتك) محدّد للفترة الحالية</p></td></tr><tr id=\"-bxkf1n_30\"><td id=\"-bxkf1n_53\"><p>4</p></td><td id=\"-bxkf1n_54\"><p><a data-tooltip=\"إدارة كل من يستلم الكهرباء منك: إضافة، تعديل، إلغاء تفعيل، تصدير القائمة، وطباعة QR codes لعرض الفواتير أونلاين.\" href=\"subscribers.html\" id=\"-bxkf1n_56\">Subscribers</a></p></td><td id=\"-bxkf1n_55\"><p>كل مشترك مضاف مع <span class=\"control\" id=\"-bxkf1n_57\">phone</span> و<span class=\"control\" id=\"-bxkf1n_58\">generator</span> و<span class=\"control\" id=\"-bxkf1n_59\">billing model</span> و<span class=\"control\" id=\"-bxkf1n_60\">active</span></p></td></tr><tr id=\"-bxkf1n_31\"><td id=\"-bxkf1n_61\"><p>5</p></td><td id=\"-bxkf1n_62\"><p><a data-tooltip=\"ربط مواقع إضافية بمشترك واحد (محل + بيت، طوابق متعددة، إلخ) حتى تستهدف الفواتير والزيارات المكان الصحيح.\" href=\"subscriber-addresses.html\" id=\"-bxkf1n_64\">Subscriber Addresses</a></p></td><td id=\"-bxkf1n_63\"><p>عناوين إضافية حيث يوجد أكثر من عداد/محل</p></td></tr><tr id=\"-bxkf1n_32\"><td id=\"-bxkf1n_65\"><p>6</p></td><td id=\"-bxkf1n_66\"><p><a data-tooltip=\"إنشاء حسابات الموظفين الميدانيين الذين يسجلون القراءات والمدفوعات. تحكم بأي generators يرى كل شخص.\" href=\"bill-collectors.html\" id=\"-bxkf1n_68\">Bill Collectors</a></p></td><td id=\"-bxkf1n_67\"><p>لكل جامع حساب وصلاحية <span class=\"control\" id=\"-bxkf1n_69\">generator</span> صحيحة</p></td></tr><tr id=\"-bxkf1n_33\"><td id=\"-bxkf1n_70\"><p>7</p></td><td id=\"-bxkf1n_71\"><p><a data-tooltip=\"نصوص SMS جاهزة مع placeholders (الاسم، المبلغ، الشهر). أعد استخدامها في الحملات لرسائل متسقة ومهنية.\" href=\"sms-templates.html\" id=\"-bxkf1n_73\">SMS Templates</a></p></td><td id=\"-bxkf1n_72\"><p>اختياري لكن مُستحسن: قوالب «الفاتورة جاهزة» و«تم الدفع»</p></td></tr><tr id=\"-bxkf1n_34\"><td id=\"-bxkf1n_74\"><p>8</p></td><td id=\"-bxkf1n_75\"><p><a data-tooltip=\"الرصيد الذي تحتفظ به لدى Echtirak لدفع خدمات المنصة (SMS، رسوم الاشتراك). ليس نقد المشتركين — ذلك يمر عبر Bill Collections.\" href=\"wallet.html\" id=\"-bxkf1n_77\">Wallet</a></p></td><td id=\"-bxkf1n_76\"><p>رصيد كافٍ لـ SMS ورسوم المنصة إن كنت تستخدم SMS</p></td></tr></tbody></table></div><aside class=\"prompt\" data-title=\"\" data-type=\"tip\" id=\"-bxkf1n_25\"><p id=\"-bxkf1n_78\"><span class=\"control\" id=\"-bxkf1n_79\">قاعدة:</span> لا تتخطَّ الخطوات 1–4. الفواتير والتحصيل تعتمد عليها.</p></aside></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes-app-will-block-or-warn\" id=\"validation-mistakes-app-will-block-or-warn\">أخطاء التحقق (التطبيق يمنع أو يحذّر)</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-bxkf1n_80\"><thead><tr class=\"ijRowHead\" id=\"-bxkf1n_81\"><th id=\"-bxkf1n_87\"><p>ما حاولت</p></th><th id=\"-bxkf1n_88\"><p>ما يحدث عادة</p></th></tr></thead><tbody><tr id=\"-bxkf1n_82\"><td id=\"-bxkf1n_89\"><p>حفظ subscriber</p></td><td id=\"-bxkf1n_90\"><p><span class=\"control\" id=\"-bxkf1n_91\">phone</span> أو <span class=\"control\" id=\"-bxkf1n_92\">generator</span> أو <span class=\"control\" id=\"-bxkf1n_93\">billing model</span> ناقص</p></td></tr><tr id=\"-bxkf1n_83\"><td id=\"-bxkf1n_94\"><p>توليد فواتير</p></td><td id=\"-bxkf1n_95\"><p>المشترك <span class=\"control\" id=\"-bxkf1n_96\">inactive</span> أو بلا نموذج</p></td></tr><tr id=\"-bxkf1n_84\"><td id=\"-bxkf1n_97\"><p>فواتير metered</p></td><td id=\"-bxkf1n_98\"><p>لا يوجد <span class=\"control\" id=\"-bxkf1n_99\">KWH reading</span> لذلك الشهر</p></td></tr><tr id=\"-bxkf1n_85\"><td id=\"-bxkf1n_100\"><p>إرسال SMS</p></td><td id=\"-bxkf1n_101\"><p><span class=\"control\" id=\"-bxkf1n_102\">phone</span> ناقص أو رصيد <span class=\"control\" id=\"-bxkf1n_103\">wallet</span> منخفض</p></td></tr><tr id=\"-bxkf1n_86\"><td id=\"-bxkf1n_104\"><p>اعتماد collection</p></td><td id=\"-bxkf1n_105\"><p>الفاتورة <span class=\"control\" id=\"-bxkf1n_106\">paid</span> مسبقاً أو مبلغ خاطئ</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"-bxkf1n_107\"><li class=\"list__item\" id=\"-bxkf1n_108\"><p id=\"-bxkf1n_111\">إدخال كل المشتركين قبل إنشاء <span class=\"control\" id=\"-bxkf1n_112\">billing models</span> — ستضطر لتصحيح كل واحد.</p></li><li class=\"list__item\" id=\"-bxkf1n_109\"><p id=\"-bxkf1n_113\">نموذج واحد للجميع — العملاء الثابت والعداد يحتاجون نماذج مختلفة.</p></li><li class=\"list__item\" id=\"-bxkf1n_110\"><p id=\"-bxkf1n_114\">جامعون بلا تعيين <span class=\"control\" id=\"-bxkf1n_115\">generator</span> — يرون قائمة فارغة في الميدان.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-bxkf1n_116\"><thead><tr class=\"ijRowHead\" id=\"-bxkf1n_117\"><th id=\"-bxkf1n_121\"><p>المشكلة</p></th><th id=\"-bxkf1n_122\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"-bxkf1n_118\"><td id=\"-bxkf1n_123\"><p>لا أستطيع إضافة subscriber</p></td><td id=\"-bxkf1n_124\"><p>أكمل generators و billing models أولاً</p></td></tr><tr id=\"-bxkf1n_119\"><td id=\"-bxkf1n_125\"><p>سعر النموذج خاطئ</p></td><td id=\"-bxkf1n_126\"><p>عدّل النموذج قبل التوليد؛ لا تغيّر فواتير قديمة بلا خطة</p></td></tr><tr id=\"-bxkf1n_120\"><td id=\"-bxkf1n_127\"><p>الجامع لا يستطيع الدخول</p></td><td id=\"-bxkf1n_128\"><p>تأكد أن الحساب active؛ أعد تعيين كلمة المرور عبر المسؤول</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"-bxkf1n_129\"><li class=\"list__item\" id=\"-bxkf1n_130\"><p id=\"-bxkf1n_133\"><a data-tooltip=\"تتعلم تسجيل الدخول، استخدام القائمة اليسرى، وأي دليل تفتح لكل مهمة. بعد هذه الصفحة، أكمل قائمة الإعداد، ثم استخدم دورة الفوترة الشهرية كل شهر.\" href=\"getting-started.html\" id=\"-bxkf1n_134\">البدء</a></p></li><li class=\"list__item\" id=\"-bxkf1n_131\"><p id=\"-bxkf1n_135\"><a data-tooltip=\"هذا سير العمل الرئيسي الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.\" href=\"monthly-billing-workflow.html\" id=\"-bxkf1n_136\">دورة الفوترة الشهرية</a></p></li><li class=\"list__item\" id=\"-bxkf1n_132\"><p id=\"-bxkf1n_137\"><a data-tooltip=\"إدارة كل من يستلم الكهرباء منك: إضافة، تعديل، إلغاء تفعيل، تصدير القائمة، وطباعة QR codes لعرض الفواتير أونلاين.\" href=\"subscribers.html\" id=\"-bxkf1n_138\">Subscribers</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"getting-started.html\">البدء</a><a class=\"navigation-links__next\" href=\"monthly-billing-workflow.html\">دورة الفوترة الشهرية</a></div>"
        },
        "keywords": [
            "Setup checklist",
            "Start here",
            "setup checklist",
            "ابدأ هنا",
            "قائمة الإعداد"
        ]
    },
    {
        "id": "monthly-billing-workflow",
        "slug": "monthly-billing-workflow",
        "fileName": "monthly-billing-workflow.html",
        "title": {
            "en": "Monthly billing workflow",
            "ar": "دورة الفوترة الشهرية"
        },
        "group": {
            "en": "Start here",
            "ar": "ابدأ هنا"
        },
        "appRoute": null,
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start-prerequisites",
                "title": {
                    "en": "Before you start (prerequisites)",
                    "ar": "قبل أن تبدأ (متطلبات)"
                }
            },
            {
                "id": "your-monthly-workflow",
                "title": {
                    "en": "Your monthly workflow",
                    "ar": "دورتك الشهرية"
                }
            },
            {
                "id": "validation-mistakes-during-this-workflow",
                "title": {
                    "en": "Validation mistakes during this workflow",
                    "ar": "أخطاء التحقق أثناء الدورة"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2><p id=\"iv3ehq_10\">This is the <span class=\"control\" id=\"iv3ehq_12\">main workflow</span> most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.</p><aside class=\"prompt\" data-title=\"\" data-type=\"tip\" id=\"iv3ehq_11\"><p id=\"iv3ehq_13\"><span class=\"control\" id=\"iv3ehq_14\">Use this every billing cycle.</span> Other pages explain each screen in detail; this page is your checklist.</p></aside></section><section class=\"chapter\"><h2 data-toc=\"before-you-start-prerequisites\" id=\"before-you-start-prerequisites\">Before you start (prerequisites)</h2><ul class=\"list _bullet\" id=\"iv3ehq_15\"><li class=\"list__item\" id=\"iv3ehq_16\"><p id=\"iv3ehq_20\"><a data-tooltip=\"Use this once when you are new to Echtirak, or when you take over an account from someone else. Complete every item before your first real monthly billing run.\" href=\"setup-checklist.html\" id=\"iv3ehq_21\">Setup checklist</a> is complete for new accounts.</p></li><li class=\"list__item\" id=\"iv3ehq_17\"><p id=\"iv3ehq_22\">Collectors have finished <span class=\"control\" id=\"iv3ehq_23\">meter visits</span> for this month (metered subscribers).</p></li><li class=\"list__item\" id=\"iv3ehq_18\"><p id=\"iv3ehq_24\"><a data-tooltip=\"Set how dollars convert to pounds (or other pairs) on bills when you use more than one currency.\" href=\"currency-rates.html\" id=\"iv3ehq_25\">Currency Rates</a> are updated if the dollar rate changed.</p></li><li class=\"list__item\" id=\"iv3ehq_19\"><p id=\"iv3ehq_26\"><a data-tooltip=\"Balance you keep with Echtirak to pay for platform services (SMS, subscription charges). Not cash from subscribers — that flows through Bill Collections.\" href=\"wallet.html\" id=\"iv3ehq_27\">Wallet</a> has enough balance if you plan to send SMS.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-monthly-workflow\" id=\"your-monthly-workflow\">Your monthly workflow</h2><section class=\"chapter\"><h3 data-toc=\"phase-1-prepare-start-of-cycle\" id=\"phase-1-prepare-start-of-cycle\">Phase 1 — Prepare (start of cycle)</h3><ol class=\"list _decimal\" id=\"iv3ehq_32\" type=\"1\"><li class=\"list__item\" id=\"iv3ehq_33\"><p id=\"iv3ehq_36\">Open <a data-tooltip=\"Your control room. See subscribers, money, bills, collections, and wallet at a glance. Use it to decide what to do first each day.\" href=\"dashboard.html\" id=\"iv3ehq_37\">Dashboard</a> — note <span class=\"control\" id=\"iv3ehq_38\">Collections To Review</span> and overdue bills.</p></li><li class=\"list__item\" id=\"iv3ehq_34\"><p id=\"iv3ehq_39\">Open <a data-tooltip=\"History of meter readings for metered subscribers. Used to calculate usage and bills. Check photos when a number looks wrong.\" href=\"kwh-readings.html\" id=\"iv3ehq_40\">KWH Readings</a> — confirm every <span class=\"control\" id=\"iv3ehq_41\">metered</span> home has a reading for this month; fix wrong numbers <span class=\"control\" id=\"iv3ehq_42\">before</span> billing.</p></li><li class=\"list__item\" id=\"iv3ehq_35\"><p id=\"iv3ehq_43\">Open <a data-tooltip=\"Review money your collectors recorded in the field. Approve when correct; reject when wrong. Until you approve, the payment is not final in your reports.\" href=\"bill-collections.html\" id=\"iv3ehq_44\">Bill Collections</a> — <span class=\"control\" id=\"iv3ehq_45\">approve or reject</span> all pending payments from last month so records are clean.</p></li></ol></section><section class=\"chapter\"><h3 data-toc=\"phase-2-create-bills\" id=\"phase-2-create-bills\">Phase 2 — Create bills</h3><ol class=\"list _decimal\" id=\"iv3ehq_46\" start=\"4\" type=\"1\"><li class=\"list__item\" id=\"iv3ehq_47\"><p id=\"iv3ehq_52\">Open <a data-tooltip=\"Three tools on one screen: see all bills, create special one-off bills, and run monthly generation for many subscribers.\" href=\"bills.html\" id=\"iv3ehq_53\">Bills</a> → <span class=\"control\" id=\"iv3ehq_54\">Bill Generation</span> tab.</p></li><li class=\"list__item\" id=\"iv3ehq_48\"><p id=\"iv3ehq_55\">Run <span class=\"control\" id=\"iv3ehq_56\">metered</span> generation for the correct <span class=\"control\" id=\"iv3ehq_57\">year/month</span> and generator(s).</p></li><li class=\"list__item\" id=\"iv3ehq_49\"><p id=\"iv3ehq_58\">Run <span class=\"control\" id=\"iv3ehq_59\">fixed</span> generation for fixed subscribers.</p></li><li class=\"list__item\" id=\"iv3ehq_50\"><p id=\"iv3ehq_60\">Review the <span class=\"control\" id=\"iv3ehq_61\">preview</span> — resolve duplicate warnings; do not confirm until totals look right.</p></li><li class=\"list__item\" id=\"iv3ehq_51\"><p id=\"iv3ehq_62\">Open <span class=\"control\" id=\"iv3ehq_63\">Bills List</span> tab — spot-check a few subscribers (amount, name, period).</p></li></ol></section><section class=\"chapter\"><h3 data-toc=\"phase-3-notify-and-collect\" id=\"phase-3-notify-and-collect\">Phase 3 — Notify and collect</h3><ol class=\"list _decimal\" id=\"iv3ehq_64\" start=\"9\" type=\"1\"><li class=\"list__item\" id=\"iv3ehq_65\"><p id=\"iv3ehq_68\">Optional: <a data-tooltip=\"Send the same message to many subscribers at once. See past campaigns and open details to check delivery.\" href=\"sms-campaigns.html\" id=\"iv3ehq_69\">SMS Campaigns</a> → notify subscribers that bills are ready (Bills tab, correct month).</p></li><li class=\"list__item\" id=\"iv3ehq_66\"><p id=\"iv3ehq_70\">Collectors visit subscribers; payments appear in <a data-tooltip=\"Review money your collectors recorded in the field. Approve when correct; reject when wrong. Until you approve, the payment is not final in your reports.\" href=\"bill-collections.html\" id=\"iv3ehq_71\">Bill Collections</a>.</p></li><li class=\"list__item\" id=\"iv3ehq_67\"><p id=\"iv3ehq_72\"><span class=\"control\" id=\"iv3ehq_73\">Every day:</span> approve legitimate collections; reject wrong ones and tell the collector why.</p></li></ol></section><section class=\"chapter\"><h3 data-toc=\"phase-4-close-the-month\" id=\"phase-4-close-the-month\">Phase 4 — Close the month</h3><ol class=\"list _decimal\" id=\"iv3ehq_74\" start=\"12\" type=\"1\"><li class=\"list__item\" id=\"iv3ehq_76\"><p id=\"iv3ehq_79\"><a data-tooltip=\"Your control room. See subscribers, money, bills, collections, and wallet at a glance. Use it to decide what to do first each day.\" href=\"dashboard.html\" id=\"iv3ehq_80\">Dashboard</a> — check overdue and <span class=\"control\" id=\"iv3ehq_81\">Top Debtors</span>; plan follow-up.</p></li><li class=\"list__item\" id=\"iv3ehq_77\"><p id=\"iv3ehq_82\"><a data-tooltip=\"Three tools on one screen: see all bills, create special one-off bills, and run monthly generation for many subscribers.\" href=\"bills.html\" id=\"iv3ehq_83\">Bills</a> — filter <span class=\"control\" id=\"iv3ehq_84\">overdue</span>; decide reminders or visits.</p></li><li class=\"list__item\" id=\"iv3ehq_78\"><p id=\"iv3ehq_85\">Optional: SMS “thank you” for paid bills if you use that template.</p></li></ol><div class=\"code-block\" data-lang=\"none\">\nReadings → Generate bills → SMS (optional) → Collect → Approve collections → Review overdue\n</div></section></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes-during-this-workflow\" id=\"validation-mistakes-during-this-workflow\">Validation mistakes during this workflow</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"iv3ehq_86\"><thead><tr class=\"ijRowHead\" id=\"iv3ehq_87\"><th id=\"iv3ehq_94\"><p>Step</p></th><th id=\"iv3ehq_95\"><p>App may reject or warn if…</p></th></tr></thead><tbody><tr id=\"iv3ehq_88\"><td id=\"iv3ehq_96\"><p>Readings</p></td><td id=\"iv3ehq_97\"><p>New reading is <span class=\"control\" id=\"iv3ehq_98\">lower</span> than previous reading</p></td></tr><tr id=\"iv3ehq_89\"><td id=\"iv3ehq_99\"><p>Bill generation</p></td><td id=\"iv3ehq_100\"><p><span class=\"control\" id=\"iv3ehq_101\">No reading</span> for metered subscriber in that month</p></td></tr><tr id=\"iv3ehq_90\"><td id=\"iv3ehq_102\"><p>Bill generation</p></td><td id=\"iv3ehq_103\"><p>Subscriber has <span class=\"control\" id=\"iv3ehq_104\">no billing model</span> or is inactive</p></td></tr><tr id=\"iv3ehq_91\"><td id=\"iv3ehq_105\"><p>Preview</p></td><td id=\"iv3ehq_106\"><p><span class=\"control\" id=\"iv3ehq_107\">Duplicate bill</span> for same subscriber and same month</p></td></tr><tr id=\"iv3ehq_92\"><td id=\"iv3ehq_108\"><p>Approve collection</p></td><td id=\"iv3ehq_109\"><p>Amount does not match bill or bill already paid</p></td></tr><tr id=\"iv3ehq_93\"><td id=\"iv3ehq_110\"><p>SMS</p></td><td id=\"iv3ehq_111\"><p><span class=\"control\" id=\"iv3ehq_112\">No phone</span> on subscriber or empty campaign list</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2><ul class=\"list _bullet\" id=\"iv3ehq_113\"><li class=\"list__item\" id=\"iv3ehq_114\"><p id=\"iv3ehq_118\">Generating bills <span class=\"control\" id=\"iv3ehq_119\">before</span> readings — wrong charges.</p></li><li class=\"list__item\" id=\"iv3ehq_115\"><p id=\"iv3ehq_120\">Approving collections <span class=\"control\" id=\"iv3ehq_121\">without</span> opening the bill preview.</p></li><li class=\"list__item\" id=\"iv3ehq_116\"><p id=\"iv3ehq_122\">Sending SMS <span class=\"control\" id=\"iv3ehq_123\">before</span> bills exist for that month.</p></li><li class=\"list__item\" id=\"iv3ehq_117\"><p id=\"iv3ehq_124\">Leaving pending collections until next month — dashboard numbers stay wrong.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"iv3ehq_125\"><thead><tr class=\"ijRowHead\" id=\"iv3ehq_126\"><th id=\"iv3ehq_130\"><p>Problem</p></th><th id=\"iv3ehq_131\"><p>What to try</p></th></tr></thead><tbody><tr id=\"iv3ehq_127\"><td id=\"iv3ehq_132\"><p>Generation list is empty</p></td><td id=\"iv3ehq_133\"><p>Wrong month/year; wrong generator; subscribers inactive</p></td></tr><tr id=\"iv3ehq_128\"><td id=\"iv3ehq_134\"><p>Duplicate bills</p></td><td id=\"iv3ehq_135\"><p>Use preview; cancel extra bills per your company rules</p></td></tr><tr id=\"iv3ehq_129\"><td id=\"iv3ehq_136\"><p>Revenue on dashboard does not match cash</p></td><td id=\"iv3ehq_137\"><p>Approve pending collections; check rejected items</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2><ul class=\"list _bullet\" id=\"iv3ehq_138\"><li class=\"list__item\" id=\"iv3ehq_139\"><p id=\"iv3ehq_143\"><a data-tooltip=\"Three tools on one screen: see all bills, create special one-off bills, and run monthly generation for many subscribers.\" href=\"bills.html\" id=\"iv3ehq_144\">Bills</a></p></li><li class=\"list__item\" id=\"iv3ehq_140\"><p id=\"iv3ehq_145\"><a data-tooltip=\"Review money your collectors recorded in the field. Approve when correct; reject when wrong. Until you approve, the payment is not final in your reports.\" href=\"bill-collections.html\" id=\"iv3ehq_146\">Bill Collections</a></p></li><li class=\"list__item\" id=\"iv3ehq_141\"><p id=\"iv3ehq_147\"><a data-tooltip=\"History of meter readings for metered subscribers. Used to calculate usage and bills. Check photos when a number looks wrong.\" href=\"kwh-readings.html\" id=\"iv3ehq_148\">KWH Readings</a></p></li><li class=\"list__item\" id=\"iv3ehq_142\"><p id=\"iv3ehq_149\"><a data-tooltip=\"Your control room. See subscribers, money, bills, collections, and wallet at a glance. Use it to decide what to do first each day.\" href=\"dashboard.html\" id=\"iv3ehq_150\">Dashboard</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"setup-checklist.html\">Setup checklist</a><a class=\"navigation-links__next\" href=\"dashboard.html\">Dashboard</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"mdgjse_11\">هذا <span class=\"control\" id=\"mdgjse_13\">سير العمل الرئيسي</span> الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.</p><aside class=\"prompt\" data-title=\"\" data-type=\"tip\" id=\"mdgjse_12\"><p id=\"mdgjse_14\"><span class=\"control\" id=\"mdgjse_15\">استخدمها في كل دورة فوترة.</span> الصفحات الأخرى تشرح كل شاشة بالتفصيل؛ هذه الصفحة قائمة تحققك.</p></aside></section><section class=\"chapter\"><h2 data-toc=\"before-you-start-prerequisites\" id=\"before-you-start-prerequisites\">قبل أن تبدأ (متطلبات)</h2><ul class=\"list _bullet\" id=\"mdgjse_16\"><li class=\"list__item\" id=\"mdgjse_17\"><p id=\"mdgjse_21\"><a data-tooltip=\"استخدمها مرة واحدة عند بدء العمل على Echtirak، أو عند استلام حساب من شخص آخر. أكمل كل بند قبل أول دورة فوترة شهرية حقيقية.\" href=\"setup-checklist.html\" id=\"mdgjse_22\">قائمة الإعداد</a> مكتملة للحسابات الجديدة.</p></li><li class=\"list__item\" id=\"mdgjse_18\"><p id=\"mdgjse_23\">الجامعون أنهوا <span class=\"control\" id=\"mdgjse_24\">زيارات العداد</span> لهذا الشهر (للمشتركين metered).</p></li><li class=\"list__item\" id=\"mdgjse_19\"><p id=\"mdgjse_25\"><a data-tooltip=\"تحديد كيف يتحوّل الدولار إلى الليرة (أو أزواج أخرى) على الفواتير عند استخدام أكثر من عملة.\" href=\"currency-rates.html\" id=\"mdgjse_26\">Currency Rates</a> محدّثة إن تغيّر سعر الدولار.</p></li><li class=\"list__item\" id=\"mdgjse_20\"><p id=\"mdgjse_27\"><a data-tooltip=\"الرصيد الذي تحتفظ به لدى Echtirak لدفع خدمات المنصة (SMS، رسوم الاشتراك). ليس نقد المشتركين — ذلك يمر عبر Bill Collections.\" href=\"wallet.html\" id=\"mdgjse_28\">Wallet</a> برصيد كافٍ إن كنت سترسل SMS.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-monthly-workflow\" id=\"your-monthly-workflow\">دورتك الشهرية</h2><section class=\"chapter\"><h3 data-toc=\"1\" id=\"1\">المرحلة 1 — التحضير (بداية الدورة)</h3><ol class=\"list _decimal\" id=\"mdgjse_33\" type=\"1\"><li class=\"list__item\" id=\"mdgjse_34\"><p id=\"mdgjse_37\">افتح <a data-tooltip=\"غرفة التحكم لديك. ترى المشتركين والأموال والفواتير والتحصيل والـ wallet بنظرة واحدة. استخدمها لتحديد ماذا تفعل أولاً كل يوم.\" href=\"dashboard.html\" id=\"mdgjse_38\">Dashboard</a> — لاحظ <span class=\"control\" id=\"mdgjse_39\">Collections To Review</span> والفواتير المتأخرة.</p></li><li class=\"list__item\" id=\"mdgjse_35\"><p id=\"mdgjse_40\">افتح <a data-tooltip=\"سجل قراءات العداد للمشتركين metered. تُستخدم لحساب الاستهلاك والفواتير. راجع الصور عندما يبدو الرقم غريباً.\" href=\"kwh-readings.html\" id=\"mdgjse_41\">KWH Readings</a> — تأكد أن كل منزل <span class=\"control\" id=\"mdgjse_42\">metered</span> له قراءة لهذا الشهر؛ صحّح الأرقام <span class=\"control\" id=\"mdgjse_43\">قبل</span> الفوترة.</p></li><li class=\"list__item\" id=\"mdgjse_36\"><p id=\"mdgjse_44\">افتح <a data-tooltip=\"مراجعة الأموال التي سجّلها الجامعون في الميدان. Approve إن كانت صحيحة؛ Reject إن كانت خاطئة. حتى تعتمد، الدفعة غير نهائية في تقاريرك.\" href=\"bill-collections.html\" id=\"mdgjse_45\">Bill Collections</a> — <span class=\"control\" id=\"mdgjse_46\">Approve</span> أو <span class=\"control\" id=\"mdgjse_47\">Reject</span> كل المدفوعات المعلقة من الشهر الماضي.</p></li></ol></section><section class=\"chapter\"><h3 data-toc=\"2\" id=\"2\">المرحلة 2 — إنشاء الفواتير</h3><ol class=\"list _decimal\" id=\"mdgjse_48\" start=\"4\" type=\"1\"><li class=\"list__item\" id=\"mdgjse_49\"><p id=\"mdgjse_54\">افتح <a data-tooltip=\"ثلاث أدوات في شاشة واحدة: عرض كل الفواتير، إنشاء فواتير استثنائية لمرة واحدة، وتشغيل التوليد الشهري لعدة مشتركين.\" href=\"bills.html\" id=\"mdgjse_55\">Bills</a> → تبويب <span class=\"control\" id=\"mdgjse_56\">Bill Generation</span>.</p></li><li class=\"list__item\" id=\"mdgjse_50\"><p id=\"mdgjse_57\">شغّل توليد <span class=\"control\" id=\"mdgjse_58\">metered</span> للسنة/الشهر و<span class=\"control\" id=\"mdgjse_59\">generator</span> الصحيحين.</p></li><li class=\"list__item\" id=\"mdgjse_51\"><p id=\"mdgjse_60\">شغّل توليد <span class=\"control\" id=\"mdgjse_61\">fixed</span> للمشتركين الثابتين.</p></li><li class=\"list__item\" id=\"mdgjse_52\"><p id=\"mdgjse_62\">راجع <span class=\"control\" id=\"mdgjse_63\">Generated Bills Preview</span> — عالج تحذيرات التكرار؛ لا تؤكد قبل أن تبدو المجاميع صحيحة.</p></li><li class=\"list__item\" id=\"mdgjse_53\"><p id=\"mdgjse_64\">افتح تبويب <span class=\"control\" id=\"mdgjse_65\">Bills List</span> — راجع عينة من المشتركين (المبلغ، الاسم، الفترة).</p></li></ol></section><section class=\"chapter\"><h3 data-toc=\"3\" id=\"3\">المرحلة 3 — الإشعار والتحصيل</h3><ol class=\"list _decimal\" id=\"mdgjse_66\" start=\"9\" type=\"1\"><li class=\"list__item\" id=\"mdgjse_67\"><p id=\"mdgjse_70\">اختياري: <a data-tooltip=\"إرسال نفس الرسالة إلى عدة مشتركين دفعة واحدة. اعرض الحملات السابقة وافتح التفاصيل للتحقق من التسليم.\" href=\"sms-campaigns.html\" id=\"mdgjse_71\">SMS Campaigns</a> لإعلام المشتركين أن الفواتير جاهزة (تبويب Bills، الشهر الصحيح).</p></li><li class=\"list__item\" id=\"mdgjse_68\"><p id=\"mdgjse_72\">الجامعون يزورون المشتركين؛ المدفوعات تظهر في <a data-tooltip=\"مراجعة الأموال التي سجّلها الجامعون في الميدان. Approve إن كانت صحيحة؛ Reject إن كانت خاطئة. حتى تعتمد، الدفعة غير نهائية في تقاريرك.\" href=\"bill-collections.html\" id=\"mdgjse_73\">Bill Collections</a>.</p></li><li class=\"list__item\" id=\"mdgjse_69\"><p id=\"mdgjse_74\"><span class=\"control\" id=\"mdgjse_75\">كل يوم:</span> اعتمد التحصيلات الصحيحة؛ ارفض الخاطئة واشرح للجامع السبب.</p></li></ol></section><section class=\"chapter\"><h3 data-toc=\"4\" id=\"4\">المرحلة 4 — إغلاق الشهر</h3><ol class=\"list _decimal\" id=\"mdgjse_76\" start=\"12\" type=\"1\"><li class=\"list__item\" id=\"mdgjse_78\"><p id=\"mdgjse_81\"><a data-tooltip=\"غرفة التحكم لديك. ترى المشتركين والأموال والفواتير والتحصيل والـ wallet بنظرة واحدة. استخدمها لتحديد ماذا تفعل أولاً كل يوم.\" href=\"dashboard.html\" id=\"mdgjse_82\">Dashboard</a> — راجع المتأخر و<span class=\"control\" id=\"mdgjse_83\">Top Debtors</span>؛ خطط للمتابعة.</p></li><li class=\"list__item\" id=\"mdgjse_79\"><p id=\"mdgjse_84\"><a data-tooltip=\"ثلاث أدوات في شاشة واحدة: عرض كل الفواتير، إنشاء فواتير استثنائية لمرة واحدة، وتشغيل التوليد الشهري لعدة مشتركين.\" href=\"bills.html\" id=\"mdgjse_85\">Bills</a> — فلتر <span class=\"control\" id=\"mdgjse_86\">overdue</span>؛ قرر تذكيرات أو زيارات.</p></li><li class=\"list__item\" id=\"mdgjse_80\"><p id=\"mdgjse_87\">اختياري: SMS شكر للمدفوعين إن كان لديك قالب لذلك.</p></li></ol><div class=\"code-block\" data-lang=\"none\">\nReadings → Generate bills → SMS (optional) → Collect → Approve collections → Review overdue\n</div></section></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes-during-this-workflow\" id=\"validation-mistakes-during-this-workflow\">أخطاء التحقق أثناء الدورة</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"mdgjse_88\"><thead><tr class=\"ijRowHead\" id=\"mdgjse_89\"><th id=\"mdgjse_96\"><p>الخطوة</p></th><th id=\"mdgjse_97\"><p>التطبيق قد يرفض أو يحذّر إذا…</p></th></tr></thead><tbody><tr id=\"mdgjse_90\"><td id=\"mdgjse_98\"><p>Readings</p></td><td id=\"mdgjse_99\"><p>القراءة الجديدة <span class=\"control\" id=\"mdgjse_100\">أقل</span> من السابقة</p></td></tr><tr id=\"mdgjse_91\"><td id=\"mdgjse_101\"><p>Bill generation</p></td><td id=\"mdgjse_102\"><p>لا قراءة للمشترك metered في ذلك الشهر</p></td></tr><tr id=\"mdgjse_92\"><td id=\"mdgjse_103\"><p>Bill generation</p></td><td id=\"mdgjse_104\"><p>لا <span class=\"control\" id=\"mdgjse_105\">billing model</span> أو المشترك inactive</p></td></tr><tr id=\"mdgjse_93\"><td id=\"mdgjse_106\"><p>Preview</p></td><td id=\"mdgjse_107\"><p><span class=\"control\" id=\"mdgjse_108\">فاتورة مكررة</span> لنفس المشترك ونفس الشهر</p></td></tr><tr id=\"mdgjse_94\"><td id=\"mdgjse_109\"><p>Approve collection</p></td><td id=\"mdgjse_110\"><p>المبلغ لا يطابق الفاتورة أو الفاتورة paid</p></td></tr><tr id=\"mdgjse_95\"><td id=\"mdgjse_111\"><p>SMS</p></td><td id=\"mdgjse_112\"><p>لا <span class=\"control\" id=\"mdgjse_113\">phone</span> أو قائمة حملة فارغة</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"mdgjse_114\"><li class=\"list__item\" id=\"mdgjse_115\"><p id=\"mdgjse_119\">توليد الفواتير <span class=\"control\" id=\"mdgjse_120\">قبل</span> القراءات — مبالغ خاطئة.</p></li><li class=\"list__item\" id=\"mdgjse_116\"><p id=\"mdgjse_121\">اعتماد التحصيل <span class=\"control\" id=\"mdgjse_122\">دون</span> فتح معاينة الفاتورة.</p></li><li class=\"list__item\" id=\"mdgjse_117\"><p id=\"mdgjse_123\">إرسال SMS <span class=\"control\" id=\"mdgjse_124\">قبل</span> وجود فواتير لذلك الشهر.</p></li><li class=\"list__item\" id=\"mdgjse_118\"><p id=\"mdgjse_125\">ترك collections معلقة حتى الشهر التالي — أرقام Dashboard تبقى خاطئة.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"mdgjse_126\"><thead><tr class=\"ijRowHead\" id=\"mdgjse_127\"><th id=\"mdgjse_131\"><p>المشكلة</p></th><th id=\"mdgjse_132\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"mdgjse_128\"><td id=\"mdgjse_133\"><p>قائمة التوليد فارغة</p></td><td id=\"mdgjse_134\"><p>سنة/شهر خاطئ؛ generator خاطئ؛ مشتركون inactive</p></td></tr><tr id=\"mdgjse_129\"><td id=\"mdgjse_135\"><p>فواتير مكررة</p></td><td id=\"mdgjse_136\"><p>استخدم preview؛ ألغِ الزائد حسب سياسة شركتك</p></td></tr><tr id=\"mdgjse_130\"><td id=\"mdgjse_137\"><p>إيراد Dashboard لا يطابق النقد</p></td><td id=\"mdgjse_138\"><p>اعتمد المعلّق؛ راجع المرفوض</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"mdgjse_139\"><li class=\"list__item\" id=\"mdgjse_140\"><p id=\"mdgjse_144\"><a data-tooltip=\"ثلاث أدوات في شاشة واحدة: عرض كل الفواتير، إنشاء فواتير استثنائية لمرة واحدة، وتشغيل التوليد الشهري لعدة مشتركين.\" href=\"bills.html\" id=\"mdgjse_145\">Bills</a></p></li><li class=\"list__item\" id=\"mdgjse_141\"><p id=\"mdgjse_146\"><a data-tooltip=\"مراجعة الأموال التي سجّلها الجامعون في الميدان. Approve إن كانت صحيحة؛ Reject إن كانت خاطئة. حتى تعتمد، الدفعة غير نهائية في تقاريرك.\" href=\"bill-collections.html\" id=\"mdgjse_147\">Bill Collections</a></p></li><li class=\"list__item\" id=\"mdgjse_142\"><p id=\"mdgjse_148\"><a data-tooltip=\"سجل قراءات العداد للمشتركين metered. تُستخدم لحساب الاستهلاك والفواتير. راجع الصور عندما يبدو الرقم غريباً.\" href=\"kwh-readings.html\" id=\"mdgjse_149\">KWH Readings</a></p></li><li class=\"list__item\" id=\"mdgjse_143\"><p id=\"mdgjse_150\"><a data-tooltip=\"غرفة التحكم لديك. ترى المشتركين والأموال والفواتير والتحصيل والـ wallet بنظرة واحدة. استخدمها لتحديد ماذا تفعل أولاً كل يوم.\" href=\"dashboard.html\" id=\"mdgjse_151\">Dashboard</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"setup-checklist.html\">قائمة الإعداد</a><a class=\"navigation-links__next\" href=\"dashboard.html\">Dashboard</a></div>"
        },
        "keywords": [
            "Monthly billing workflow",
            "Start here",
            "monthly billing workflow",
            "ابدأ هنا",
            "دورة الفوترة الشهرية"
        ]
    },
    {
        "id": "dashboard",
        "slug": "dashboard",
        "fileName": "dashboard.html",
        "title": {
            "en": "Dashboard",
            "ar": "Dashboard"
        },
        "group": {
            "en": "Your business at a glance",
            "ar": "نظرة على عملك"
        },
        "appRoute": "dashboard",
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start",
                "title": {
                    "en": "Before you start",
                    "ar": "قبل أن تبدأ"
                }
            },
            {
                "id": "your-regular-workflow-daily",
                "title": {
                    "en": "Your regular workflow (daily)",
                    "ar": "سير العمل اليومي"
                }
            },
            {
                "id": "what-you-see-on-this-page",
                "title": {
                    "en": "What you see on this page",
                    "ar": "ما تراه على هذه الصفحة"
                }
            },
            {
                "id": "step-by-step-usage",
                "title": {
                    "en": "Step-by-step usage",
                    "ar": "خطوة بخطوة"
                }
            },
            {
                "id": "validation-mistakes",
                "title": {
                    "en": "Validation mistakes",
                    "ar": "أخطاء التحقق"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\">\n<h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2>\n<p id=\"nokcpz_12\">Your <span class=\"control\" id=\"nokcpz_13\">control room</span>. See\n                                subscribers, money, bills, collections, and wallet at a glance. Use it to decide <span class=\"control\" id=\"nokcpz_14\">what to do first</span> each day.</p>\n</section>\n<section class=\"chapter\">\n<h2 data-toc=\"before-you-start\" id=\"before-you-start\">Before you start</h2>\n<ul class=\"list _bullet\" id=\"nokcpz_15\">\n<li class=\"list__item\" id=\"nokcpz_16\">\n<p id=\"nokcpz_18\">You are signed in as Generator Owner.</p>\n</li>\n<li class=\"list__item\" id=\"nokcpz_17\">\n<p id=\"nokcpz_19\"><a data-tooltip=\"Use this once when you are new to Echtirak, or when you take over an account from someone else. Complete every item before your first real monthly billing run.\" href=\"setup-checklist.html\" id=\"nokcpz_20\">Setup\n                                            checklist</a> done if this is your first month.</p>\n</li>\n</ul>\n</section>\n<section class=\"chapter\">\n<h2 data-toc=\"your-regular-workflow-daily\" id=\"your-regular-workflow-daily\">Your regular\n                                workflow (daily)</h2>\n<ol class=\"list _decimal\" id=\"nokcpz_21\" type=\"1\">\n<li class=\"list__item\" id=\"nokcpz_23\">\n<p id=\"nokcpz_28\">Open <span class=\"control\" id=\"nokcpz_29\">Dashboard</span> after\n                                        sign-in.</p>\n</li>\n<li class=\"list__item\" id=\"nokcpz_24\">\n<p id=\"nokcpz_30\">If <span class=\"control\" id=\"nokcpz_31\">Collections To\n                                            Review</span> is not zero → go to <a data-tooltip=\"Review money your collectors recorded in the field. Approve when correct; reject when wrong. Until you approve, the payment is not final in your reports.\" href=\"bill-collections.html\" id=\"nokcpz_32\">Bill\n                                            Collections</a> first.</p>\n</li>\n<li class=\"list__item\" id=\"nokcpz_25\">\n<p id=\"nokcpz_33\">Check <span class=\"control\" id=\"nokcpz_34\">overdue</span> on Bills\n                                        Status card → follow up or approve pending payments.</p>\n</li>\n<li class=\"list__item\" id=\"nokcpz_26\">\n<p id=\"nokcpz_35\">Note <span class=\"control\" id=\"nokcpz_36\">Wallet Balance</span>\n                                        before sending SMS.</p>\n</li>\n<li class=\"list__item\" id=\"nokcpz_27\">\n<p id=\"nokcpz_37\">Use <span class=\"control\" id=\"nokcpz_38\">Top Debtors</span> for\n                                        collection visits.</p>\n</li>\n</ol>\n<aside class=\"prompt\" data-title=\"\" data-type=\"tip\" id=\"nokcpz_22\">\n<p id=\"nokcpz_39\"><span class=\"control\" id=\"nokcpz_40\">Monthly:</span> Start Phase 1 of\n                                    <a data-tooltip=\"This is the main workflow most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.\" href=\"monthly-billing-workflow.html\" id=\"nokcpz_41\">Monthly\n                                        billing workflow</a> from here.</p>\n</aside>\n</section>\n<section class=\"chapter\">\n<h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">What you see on this\n                                page</h2>\n<section class=\"chapter\">\n<h3 data-toc=\"top-summary-cards\" id=\"top-summary-cards\">Top summary cards</h3>\n<div class=\"table-wrapper\">\n<table class=\"wide\" id=\"nokcpz_45\">\n<thead>\n<tr class=\"ijRowHead\" id=\"nokcpz_46\">\n<th id=\"nokcpz_51\">\n<p>Card</p>\n</th>\n<th id=\"nokcpz_52\">\n<p>Meaning</p>\n</th>\n</tr>\n</thead>\n<tbody>\n<tr id=\"nokcpz_47\">\n<td id=\"nokcpz_53\">\n<p>Subscribers</p>\n</td>\n<td id=\"nokcpz_54\">\n<p>Total, active/inactive, new this week/month</p>\n</td>\n</tr>\n<tr id=\"nokcpz_48\">\n<td id=\"nokcpz_55\">\n<p>Revenue This Month</p>\n</td>\n<td id=\"nokcpz_56\">\n<p>Money from bills this month vs last month</p>\n</td>\n</tr>\n<tr id=\"nokcpz_49\">\n<td id=\"nokcpz_57\">\n<p>Bills Status</p>\n</td>\n<td id=\"nokcpz_58\">\n<p>Pending, paid, overdue counts and overdue amount</p>\n</td>\n</tr>\n<tr id=\"nokcpz_50\">\n<td id=\"nokcpz_59\">\n<p>Wallet Balance</p>\n</td>\n<td id=\"nokcpz_60\">\n<p>Money for Echtirak services (SMS, fees) — not street cash\n                                                    </p>\n</td>\n</tr>\n</tbody>\n</table>\n</div>\n</section>\n<section class=\"chapter\">\n<h3 data-toc=\"action-cards\" id=\"action-cards\">Action cards</h3>\n<div class=\"table-wrapper\">\n<table class=\"wide\" id=\"nokcpz_61\">\n<thead>\n<tr class=\"ijRowHead\" id=\"nokcpz_62\">\n<th id=\"nokcpz_66\">\n<p>Card</p>\n</th>\n<th id=\"nokcpz_67\">\n<p>Meaning</p>\n</th>\n</tr>\n</thead>\n<tbody>\n<tr id=\"nokcpz_63\">\n<td id=\"nokcpz_68\">\n<p>Collections To Review</p>\n</td>\n<td id=\"nokcpz_69\">\n<p>Payments waiting for <span class=\"control\" id=\"nokcpz_70\">your\n                                                            approval</span></p>\n</td>\n</tr>\n<tr id=\"nokcpz_64\">\n<td id=\"nokcpz_71\">\n<p>Collection Channels</p>\n</td>\n<td id=\"nokcpz_72\">\n<p>How money arrived (cash, etc.)</p>\n</td>\n</tr>\n<tr id=\"nokcpz_65\">\n<td id=\"nokcpz_73\">\n<p>Accounting / Consumption</p>\n</td>\n<td id=\"nokcpz_74\">\n<p>Deeper money and usage picture</p>\n</td>\n</tr>\n</tbody>\n</table>\n</div>\n</section>\n<section class=\"chapter\">\n<h3 data-toc=\"charts-and-tables\" id=\"charts-and-tables\">Charts and tables</h3>\n<p id=\"nokcpz_75\">Recent activity, bill charts, revenue comparison, collector breakdown,\n                                    top debtors, wallet statistics.</p>\n</section>\n</section>\n<section class=\"chapter\">\n<h2 data-toc=\"step-by-step-usage\" id=\"step-by-step-usage\">Step-by-step usage</h2>\n<ol class=\"list _decimal\" id=\"nokcpz_76\" type=\"1\">\n<li class=\"list__item\" id=\"nokcpz_77\">\n<p id=\"nokcpz_81\">Read <span class=\"control\" id=\"nokcpz_82\">Collections To\n                                            Review</span> — if not zero, switch to Bill Collections immediately.\n                                    </p>\n</li>\n<li class=\"list__item\" id=\"nokcpz_78\">\n<p id=\"nokcpz_83\">Compare <span class=\"control\" id=\"nokcpz_84\">Revenue This\n                                            Month</span> to what you expect from approved collections.</p>\n</li>\n<li class=\"list__item\" id=\"nokcpz_79\">\n<p id=\"nokcpz_85\">If overdue amount is high, open <a data-tooltip=\"Three tools on one screen: see all bills, create special one-off bills, and run monthly generation for many subscribers.\" href=\"bills.html\" id=\"nokcpz_86\">Bills</a>\n                                        filtered by overdue.</p>\n</li>\n<li class=\"list__item\" id=\"nokcpz_80\">\n<p id=\"nokcpz_87\">Before a big SMS send, check <span class=\"control\" id=\"nokcpz_88\">Wallet Balance</span> and <a data-tooltip=\"Balance you keep with Echtirak to pay for platform services (SMS, subscription charges). Not cash from subscribers — that flows through Bill Collections.\" href=\"wallet.html\" id=\"nokcpz_89\">Wallet</a>.\n                                    </p>\n</li>\n</ol>\n</section>\n<section class=\"chapter\">\n<h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">Validation mistakes</h2>\n<p id=\"nokcpz_90\">The dashboard itself has no save form. Wrong numbers usually mean:</p>\n<ul class=\"list _bullet\" id=\"nokcpz_91\">\n<li class=\"list__item\" id=\"nokcpz_92\">\n<p id=\"nokcpz_95\">Collections still <span class=\"control\" id=\"nokcpz_96\">pending</span> (not approved).</p>\n</li>\n<li class=\"list__item\" id=\"nokcpz_93\">\n<p id=\"nokcpz_97\">Bills generated for wrong <span class=\"control\" id=\"nokcpz_98\">month</span>.</p>\n</li>\n<li class=\"list__item\" id=\"nokcpz_94\">\n<p id=\"nokcpz_99\">Wallet top-up not yet reflected (wait and refresh).</p>\n</li>\n</ul>\n</section>\n<section class=\"chapter\">\n<h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2>\n<ul class=\"list _bullet\" id=\"nokcpz_100\">\n<li class=\"list__item\" id=\"nokcpz_101\">\n<p id=\"nokcpz_104\">Ignoring <span class=\"control\" id=\"nokcpz_105\">Collections To\n                                            Review</span> — cash collections do not finalize until you approve.\n                                    </p>\n</li>\n<li class=\"list__item\" id=\"nokcpz_102\">\n<p id=\"nokcpz_106\">Treating <span class=\"control\" id=\"nokcpz_107\">wallet\n                                            balance</span> as money collected from subscribers.</p>\n</li>\n<li class=\"list__item\" id=\"nokcpz_103\">\n<p id=\"nokcpz_108\">Assuming dashboard updates instantly — refresh after large\n                                        approvals.</p>\n</li>\n</ul>\n</section>\n<section class=\"chapter\">\n<h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2>\n<div class=\"table-wrapper\">\n<table class=\"wide\" id=\"nokcpz_109\">\n<thead>\n<tr class=\"ijRowHead\" id=\"nokcpz_110\">\n<th id=\"nokcpz_114\">\n<p>Problem</p>\n</th>\n<th id=\"nokcpz_115\">\n<p>What to try</p>\n</th>\n</tr>\n</thead>\n<tbody>\n<tr id=\"nokcpz_111\">\n<td id=\"nokcpz_116\">\n<p>Numbers seem old</p>\n</td>\n<td id=\"nokcpz_117\">\n<p>Refresh browser; complete pending approvals</p>\n</td>\n</tr>\n<tr id=\"nokcpz_112\">\n<td id=\"nokcpz_118\">\n<p>Collections card zero but collectors insist they paid</p>\n</td>\n<td id=\"nokcpz_119\">\n<p>Widen date filter on Bill Collections</p>\n</td>\n</tr>\n<tr id=\"nokcpz_113\">\n<td id=\"nokcpz_120\">\n<p>Wallet looks wrong</p>\n</td>\n<td id=\"nokcpz_121\">\n<p>Open Wallet → transactions; contact support with dates</p>\n</td>\n</tr>\n</tbody>\n</table>\n</div>\n</section>\n<section class=\"chapter\">\n<h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2>\n<ul class=\"list _bullet\" id=\"nokcpz_122\">\n<li class=\"list__item\" id=\"nokcpz_123\">\n<p id=\"nokcpz_127\"><a data-tooltip=\"This is the main workflow most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.\" href=\"monthly-billing-workflow.html\" id=\"nokcpz_128\">Monthly\n                                            billing workflow</a></p>\n</li>\n<li class=\"list__item\" id=\"nokcpz_124\">\n<p id=\"nokcpz_129\"><a data-tooltip=\"Review money your collectors recorded in the field. Approve when correct; reject when wrong. Until you approve, the payment is not final in your reports.\" href=\"bill-collections.html\" id=\"nokcpz_130\">Bill\n                                            Collections</a></p>\n</li>\n<li class=\"list__item\" id=\"nokcpz_125\">\n<p id=\"nokcpz_131\"><a data-tooltip=\"Three tools on one screen: see all bills, create special one-off bills, and run monthly generation for many subscribers.\" href=\"bills.html\" id=\"nokcpz_132\">Bills</a>\n</p>\n</li>\n<li class=\"list__item\" id=\"nokcpz_126\">\n<p id=\"nokcpz_133\"><a data-tooltip=\"Balance you keep with Echtirak to pay for platform services (SMS, subscription charges). Not cash from subscribers — that flows through Bill Collections.\" href=\"wallet.html\" id=\"nokcpz_134\">Wallet</a>\n</p>\n</li>\n</ul>\n</section>\n<div class=\"last-modified\">15 May 2026</div>\n<div data-feedback-placeholder=\"true\"></div>\n<div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"monthly-billing-workflow.html\">Monthly billing workflow</a><a class=\"navigation-links__next\" href=\"subscribers.html\">Subscribers</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"-r4tz1l_13\"><span class=\"control\" id=\"-r4tz1l_14\">غرفة التحكم</span> لديك. ترى المشتركين والأموال والفواتير والتحصيل والـ wallet بنظرة واحدة. استخدمها لتحديد <span class=\"control\" id=\"-r4tz1l_15\">ماذا تفعل أولاً</span> كل يوم.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">قبل أن تبدأ</h2><ul class=\"list _bullet\" id=\"-r4tz1l_16\"><li class=\"list__item\" id=\"-r4tz1l_17\"><p id=\"-r4tz1l_19\">أنت مسجّل كـ Generator Owner.</p></li><li class=\"list__item\" id=\"-r4tz1l_18\"><p id=\"-r4tz1l_20\"><a data-tooltip=\"استخدمها مرة واحدة عند بدء العمل على Echtirak، أو عند استلام حساب من شخص آخر. أكمل كل بند قبل أول دورة فوترة شهرية حقيقية.\" href=\"setup-checklist.html\" id=\"-r4tz1l_21\">قائمة الإعداد</a> منتهية إن كان هذا أول شهر.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow-daily\" id=\"your-regular-workflow-daily\">سير العمل اليومي</h2><ol class=\"list _decimal\" id=\"-r4tz1l_22\" type=\"1\"><li class=\"list__item\" id=\"-r4tz1l_24\"><p id=\"-r4tz1l_29\">افتح <span class=\"control\" id=\"-r4tz1l_30\">Dashboard</span> بعد تسجيل الدخول.</p></li><li class=\"list__item\" id=\"-r4tz1l_25\"><p id=\"-r4tz1l_31\">إن كان <span class=\"control\" id=\"-r4tz1l_32\">Collections To Review</span> ليس صفراً → اذهب إلى <a data-tooltip=\"مراجعة الأموال التي سجّلها الجامعون في الميدان. Approve إن كانت صحيحة؛ Reject إن كانت خاطئة. حتى تعتمد، الدفعة غير نهائية في تقاريرك.\" href=\"bill-collections.html\" id=\"-r4tz1l_33\">Bill Collections</a> أولاً.</p></li><li class=\"list__item\" id=\"-r4tz1l_26\"><p id=\"-r4tz1l_34\">راجع <span class=\"control\" id=\"-r4tz1l_35\">overdue</span> على بطاقة Bills Status → تابع أو اعتمد المدفوعات المعلقة.</p></li><li class=\"list__item\" id=\"-r4tz1l_27\"><p id=\"-r4tz1l_36\">لاحظ <span class=\"control\" id=\"-r4tz1l_37\">Wallet Balance</span> قبل إرسال SMS.</p></li><li class=\"list__item\" id=\"-r4tz1l_28\"><p id=\"-r4tz1l_38\">استخدم <span class=\"control\" id=\"-r4tz1l_39\">Top Debtors</span> لزيارات التحصيل.</p></li></ol><aside class=\"prompt\" data-title=\"\" data-type=\"tip\" id=\"-r4tz1l_23\"><p id=\"-r4tz1l_40\"><span class=\"control\" id=\"-r4tz1l_41\">شهرياً:</span> ابدأ المرحلة 1 من <a data-tooltip=\"هذا سير العمل الرئيسي الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.\" href=\"monthly-billing-workflow.html\" id=\"-r4tz1l_42\">دورة الفوترة الشهرية</a> من هنا.</p></aside></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">ما تراه على هذه الصفحة</h2><section class=\"chapter\"><h3 data-toc=\"-r4tz1l_43\" id=\"-r4tz1l_43\">بطاقات الملخص العلوية</h3><div class=\"table-wrapper\"><table class=\"wide\" id=\"-r4tz1l_46\"><thead><tr class=\"ijRowHead\" id=\"-r4tz1l_47\"><th id=\"-r4tz1l_52\"><p>البطاقة</p></th><th id=\"-r4tz1l_53\"><p>المعنى</p></th></tr></thead><tbody><tr id=\"-r4tz1l_48\"><td id=\"-r4tz1l_54\"><p>Subscribers</p></td><td id=\"-r4tz1l_55\"><p>الإجمالي، active/inactive، الجدد هذا الأسبوع/الشهر</p></td></tr><tr id=\"-r4tz1l_49\"><td id=\"-r4tz1l_56\"><p>Revenue This Month</p></td><td id=\"-r4tz1l_57\"><p>أموال الفواتير هذا الشهر مقابل الشهر الماضي</p></td></tr><tr id=\"-r4tz1l_50\"><td id=\"-r4tz1l_58\"><p>Bills Status</p></td><td id=\"-r4tz1l_59\"><p>عدد pending و paid و overdue ومبلغ المتأخر</p></td></tr><tr id=\"-r4tz1l_51\"><td id=\"-r4tz1l_60\"><p>Wallet Balance</p></td><td id=\"-r4tz1l_61\"><p>أموال خدمات Echtirak (SMS، رسوم) — ليست نقد الشارع</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h3 data-toc=\"-r4tz1l_44\" id=\"-r4tz1l_44\">بطاقات الإجراء</h3><div class=\"table-wrapper\"><table class=\"wide\" id=\"-r4tz1l_62\"><thead><tr class=\"ijRowHead\" id=\"-r4tz1l_63\"><th id=\"-r4tz1l_67\"><p>البطاقة</p></th><th id=\"-r4tz1l_68\"><p>المعنى</p></th></tr></thead><tbody><tr id=\"-r4tz1l_64\"><td id=\"-r4tz1l_69\"><p>Collections To Review</p></td><td id=\"-r4tz1l_70\"><p>مدفوعات بانتظار <span class=\"control\" id=\"-r4tz1l_71\">اعتمادك</span></p></td></tr><tr id=\"-r4tz1l_65\"><td id=\"-r4tz1l_72\"><p>Collection Channels</p></td><td id=\"-r4tz1l_73\"><p>كيف وصل المال (نقد، إلخ)</p></td></tr><tr id=\"-r4tz1l_66\"><td id=\"-r4tz1l_74\"><p>Accounting / Consumption</p></td><td id=\"-r4tz1l_75\"><p>صورة أعمق للمال والاستهلاك</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h3 data-toc=\"-r4tz1l_45\" id=\"-r4tz1l_45\">مخططات وجداول</h3><p id=\"-r4tz1l_76\">نشاط حديث، مخططات فواتير، مقارنة إيراد، تفصيل حسب الجامع، أعلى المدينين، إحصاءات wallet.</p></section></section><section class=\"chapter\"><h2 data-toc=\"step-by-step-usage\" id=\"step-by-step-usage\">خطوة بخطوة</h2><ol class=\"list _decimal\" id=\"-r4tz1l_77\" type=\"1\"><li class=\"list__item\" id=\"-r4tz1l_78\"><p id=\"-r4tz1l_82\">اقرأ <span class=\"control\" id=\"-r4tz1l_83\">Collections To Review</span> — إن لم يكن صفراً، انتقل فوراً إلى Bill Collections.</p></li><li class=\"list__item\" id=\"-r4tz1l_79\"><p id=\"-r4tz1l_84\">قارن <span class=\"control\" id=\"-r4tz1l_85\">Revenue This Month</span> بما تتوقعه من التحصيلات المعتمدة.</p></li><li class=\"list__item\" id=\"-r4tz1l_80\"><p id=\"-r4tz1l_86\">إن كان مبلغ المتأخر مرتفعاً، افتح <a data-tooltip=\"ثلاث أدوات في شاشة واحدة: عرض كل الفواتير، إنشاء فواتير استثنائية لمرة واحدة، وتشغيل التوليد الشهري لعدة مشتركين.\" href=\"bills.html\" id=\"-r4tz1l_87\">Bills</a> بفلتر overdue.</p></li><li class=\"list__item\" id=\"-r4tz1l_81\"><p id=\"-r4tz1l_88\">قبل حملة SMS كبيرة، تحقق من <span class=\"control\" id=\"-r4tz1l_89\">Wallet Balance</span> و<a data-tooltip=\"الرصيد الذي تحتفظ به لدى Echtirak لدفع خدمات المنصة (SMS، رسوم الاشتراك). ليس نقد المشتركين — ذلك يمر عبر Bill Collections.\" href=\"wallet.html\" id=\"-r4tz1l_90\">Wallet</a>.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">أخطاء التحقق</h2><p id=\"-r4tz1l_91\">الـ Dashboard نفسه بلا نموذج حفظ. الأرقام الخاطئة غالباً بسبب:</p><ul class=\"list _bullet\" id=\"-r4tz1l_92\"><li class=\"list__item\" id=\"-r4tz1l_93\"><p id=\"-r4tz1l_96\">تحصيلات ما زالت <span class=\"control\" id=\"-r4tz1l_97\">pending</span> (غير معتمدة).</p></li><li class=\"list__item\" id=\"-r4tz1l_94\"><p id=\"-r4tz1l_98\">فواتير مولّدة لـ <span class=\"control\" id=\"-r4tz1l_99\">شهر</span> خاطئ.</p></li><li class=\"list__item\" id=\"-r4tz1l_95\"><p id=\"-r4tz1l_100\">شحن wallet لم يظهر بعد (انتظر وحدّث).</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"-r4tz1l_101\"><li class=\"list__item\" id=\"-r4tz1l_102\"><p id=\"-r4tz1l_105\">تجاهل <span class=\"control\" id=\"-r4tz1l_106\">Collections To Review</span> — التحصيل النقدي لا يُنهى حتى تعتمد.</p></li><li class=\"list__item\" id=\"-r4tz1l_103\"><p id=\"-r4tz1l_107\">اعتبار <span class=\"control\" id=\"-r4tz1l_108\">wallet balance</span> مالاً مجمّعاً من المشتركين.</p></li><li class=\"list__item\" id=\"-r4tz1l_104\"><p id=\"-r4tz1l_109\">افتراض تحديث فوري — حدّث بعد اعتمادات كبيرة.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-r4tz1l_110\"><thead><tr class=\"ijRowHead\" id=\"-r4tz1l_111\"><th id=\"-r4tz1l_115\"><p>المشكلة</p></th><th id=\"-r4tz1l_116\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"-r4tz1l_112\"><td id=\"-r4tz1l_117\"><p>الأرقام قديمة</p></td><td id=\"-r4tz1l_118\"><p>حدّث المتصفح؛ أكمل الاعتمادات المعلقة</p></td></tr><tr id=\"-r4tz1l_113\"><td id=\"-r4tz1l_119\"><p>بطاقة Collections صفر والجامعون يقولون دفعوا</p></td><td id=\"-r4tz1l_120\"><p>وسّع نطاق التاريخ في Bill Collections</p></td></tr><tr id=\"-r4tz1l_114\"><td id=\"-r4tz1l_121\"><p>Wallet يبدو خاطئاً</p></td><td id=\"-r4tz1l_122\"><p>افتح Wallet → transactions؛ تواصل مع الدعم بالتواريخ</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"-r4tz1l_123\"><li class=\"list__item\" id=\"-r4tz1l_124\"><p id=\"-r4tz1l_128\"><a data-tooltip=\"هذا سير العمل الرئيسي الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.\" href=\"monthly-billing-workflow.html\" id=\"-r4tz1l_129\">دورة الفوترة الشهرية</a></p></li><li class=\"list__item\" id=\"-r4tz1l_125\"><p id=\"-r4tz1l_130\"><a data-tooltip=\"مراجعة الأموال التي سجّلها الجامعون في الميدان. Approve إن كانت صحيحة؛ Reject إن كانت خاطئة. حتى تعتمد، الدفعة غير نهائية في تقاريرك.\" href=\"bill-collections.html\" id=\"-r4tz1l_131\">Bill Collections</a></p></li><li class=\"list__item\" id=\"-r4tz1l_126\"><p id=\"-r4tz1l_132\"><a data-tooltip=\"ثلاث أدوات في شاشة واحدة: عرض كل الفواتير، إنشاء فواتير استثنائية لمرة واحدة، وتشغيل التوليد الشهري لعدة مشتركين.\" href=\"bills.html\" id=\"-r4tz1l_133\">Bills</a></p></li><li class=\"list__item\" id=\"-r4tz1l_127\"><p id=\"-r4tz1l_134\"><a data-tooltip=\"الرصيد الذي تحتفظ به لدى Echtirak لدفع خدمات المنصة (SMS، رسوم الاشتراك). ليس نقد المشتركين — ذلك يمر عبر Bill Collections.\" href=\"wallet.html\" id=\"-r4tz1l_135\">Wallet</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"monthly-billing-workflow.html\">دورة الفوترة الشهرية</a><a class=\"navigation-links__next\" href=\"subscribers.html\">Subscribers</a></div>"
        },
        "keywords": [
            "Dashboard",
            "Your business at a glance",
            "dashboard",
            "نظرة على عملك"
        ]
    },
    {
        "id": "subscribers",
        "slug": "subscribers",
        "fileName": "subscribers.html",
        "title": {
            "en": "Subscribers",
            "ar": "Subscribers"
        },
        "group": {
            "en": "People and places",
            "ar": "الناس والمواقع"
        },
        "appRoute": "subscribers",
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start-prerequisites",
                "title": {
                    "en": "Before you start (prerequisites)",
                    "ar": "قبل أن تبدأ"
                }
            },
            {
                "id": "your-regular-workflow",
                "title": {
                    "en": "Your regular workflow",
                    "ar": "سير العمل المعتاد"
                }
            },
            {
                "id": "what-you-see-on-this-page",
                "title": {
                    "en": "What you see on this page",
                    "ar": "ما تراه على هذه الصفحة"
                }
            },
            {
                "id": "step-by-step-add-one-subscriber",
                "title": {
                    "en": "Step-by-step: add one subscriber",
                    "ar": "خطوة بخطوة: إضافة مشترك واحد"
                }
            },
            {
                "id": "validation-mistakes-app-blocks-save",
                "title": {
                    "en": "Validation mistakes (app blocks save)",
                    "ar": "أخطاء التحقق"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2><p id=\"-d6gjqo_12\">Manage everyone who receives electricity from you: add, edit, deactivate, export list, and print <span class=\"control\" id=\"-d6gjqo_13\">QR codes</span> so they can view bills online.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start-prerequisites\" id=\"before-you-start-prerequisites\">Before you start (prerequisites)</h2><ul class=\"list _bullet\" id=\"-d6gjqo_14\"><li class=\"list__item\" id=\"-d6gjqo_15\"><p id=\"-d6gjqo_18\"><a data-tooltip=\"Register each generator (machine or supply zone). Subscribers, readings, and reports are grouped by generator.\" href=\"generators.html\" id=\"-d6gjqo_19\">Generators</a> created.</p></li><li class=\"list__item\" id=\"-d6gjqo_16\"><p id=\"-d6gjqo_20\"><a data-tooltip=\"Define how you charge: fixed monthly amount or by meter (KWH), with prices and fees. Every subscriber must have one model.\" href=\"billing-models.html\" id=\"-d6gjqo_21\">Billing Models</a> created for fixed and/or metered customers.</p></li><li class=\"list__item\" id=\"-d6gjqo_17\"><p id=\"-d6gjqo_22\">Phone numbers verified — SMS and contact depend on them.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">Your regular workflow</h2><section class=\"chapter\"><h3 data-toc=\"new-customer\" id=\"new-customer\">New customer</h3><ol class=\"list _decimal\" id=\"-d6gjqo_26\" type=\"1\"><li class=\"list__item\" id=\"-d6gjqo_27\"><p id=\"-d6gjqo_31\"><span class=\"control\" id=\"-d6gjqo_32\">New</span> → enter name, phone, pick <span class=\"control\" id=\"-d6gjqo_33\">generator</span> and <span class=\"control\" id=\"-d6gjqo_34\">billing model</span>.</p></li><li class=\"list__item\" id=\"-d6gjqo_28\"><p id=\"-d6gjqo_35\">Save → confirm row is <span class=\"control\" id=\"-d6gjqo_36\">active</span>.</p></li><li class=\"list__item\" id=\"-d6gjqo_29\"><p id=\"-d6gjqo_37\">Add <a data-tooltip=\"Link extra locations to one subscriber (shop + home, multiple floors, etc.) so bills and visits target the right place.\" href=\"subscriber-addresses.html\" id=\"-d6gjqo_38\">Subscriber Addresses</a> if they have more than one location.</p></li><li class=\"list__item\" id=\"-d6gjqo_30\"><p id=\"-d6gjqo_39\">Optional: print <span class=\"control\" id=\"-d6gjqo_40\">QR code</span> for the building.</p></li></ol></section><section class=\"chapter\"><h3 data-toc=\"end-of-month-move-out\" id=\"end-of-month-move-out\">End of month / move-out</h3><ol class=\"list _decimal\" id=\"-d6gjqo_41\" type=\"1\"><li class=\"list__item\" id=\"-d6gjqo_42\"><p id=\"-d6gjqo_44\">Find subscriber → set <span class=\"control\" id=\"-d6gjqo_45\">inactive</span> when they leave (do not delete if old bills exist).</p></li><li class=\"list__item\" id=\"-d6gjqo_43\"><p id=\"-d6gjqo_46\">Ensure no wrong bills will generate next month for inactive accounts.</p></li></ol></section><section class=\"chapter\"><h3 data-toc=\"bulk\" id=\"bulk\">Bulk</h3><ul class=\"list _bullet\" id=\"-d6gjqo_47\"><li class=\"list__item\" id=\"-d6gjqo_48\"><p id=\"-d6gjqo_50\"><span class=\"control\" id=\"-d6gjqo_51\">Export CSV</span> for office records.</p></li><li class=\"list__item\" id=\"-d6gjqo_49\"><p id=\"-d6gjqo_52\"><span class=\"control\" id=\"-d6gjqo_53\">Download QR Codes</span> per generator when installing codes in a building.</p></li></ul></section></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">What you see on this page</h2><ul class=\"list _bullet\" id=\"-d6gjqo_54\"><li class=\"list__item\" id=\"-d6gjqo_55\"><p id=\"-d6gjqo_60\"><span class=\"control\" id=\"-d6gjqo_61\">New</span>, <span class=\"control\" id=\"-d6gjqo_62\">Export CSV</span>, <span class=\"control\" id=\"-d6gjqo_63\">Download QR Codes</span></p></li><li class=\"list__item\" id=\"-d6gjqo_56\"><p id=\"-d6gjqo_64\">Search, <span class=\"control\" id=\"-d6gjqo_65\">Clear</span>, <span class=\"control\" id=\"-d6gjqo_66\">Expand/Collapse All</span></p></li><li class=\"list__item\" id=\"-d6gjqo_57\"><p id=\"-d6gjqo_67\">Table: phone, name, generator, model, status, etc.</p></li><li class=\"list__item\" id=\"-d6gjqo_58\"><p id=\"-d6gjqo_68\"><span class=\"control\" id=\"-d6gjqo_69\">Subscriber Details</span> panel: full edit form</p></li><li class=\"list__item\" id=\"-d6gjqo_59\"><p id=\"-d6gjqo_70\"><span class=\"control\" id=\"-d6gjqo_71\">Subscriber Qr-Code</span> for printing</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"step-by-step-add-one-subscriber\" id=\"step-by-step-add-one-subscriber\">Step-by-step: add one subscriber</h2><ol class=\"list _decimal\" id=\"-d6gjqo_72\" type=\"1\"><li class=\"list__item\" id=\"-d6gjqo_73\"><p id=\"-d6gjqo_78\">Subscribers → <span class=\"control\" id=\"-d6gjqo_79\">New</span>.</p></li><li class=\"list__item\" id=\"-d6gjqo_74\"><p id=\"-d6gjqo_80\">Fill <span class=\"control\" id=\"-d6gjqo_81\">phone</span> (required) — use format your team always uses.</p></li><li class=\"list__item\" id=\"-d6gjqo_75\"><p id=\"-d6gjqo_82\">Select <span class=\"control\" id=\"-d6gjqo_83\">generator</span> and <span class=\"control\" id=\"-d6gjqo_84\">billing model</span> — must match their real contract.</p></li><li class=\"list__item\" id=\"-d6gjqo_76\"><p id=\"-d6gjqo_85\">Save → search for phone to confirm.</p></li><li class=\"list__item\" id=\"-d6gjqo_77\"><p id=\"-d6gjqo_86\">If metered, ensure collectors know to read that meter next cycle.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes-app-blocks-save\" id=\"validation-mistakes-app-blocks-save\">Validation mistakes (app blocks save)</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-d6gjqo_87\"><thead><tr class=\"ijRowHead\" id=\"-d6gjqo_88\"><th id=\"-d6gjqo_93\"><p>Field / rule</p></th><th id=\"-d6gjqo_94\"><p>Typical error</p></th></tr></thead><tbody><tr id=\"-d6gjqo_89\"><td id=\"-d6gjqo_95\"><p>Phone</p></td><td id=\"-d6gjqo_96\"><p>Empty or duplicate where not allowed</p></td></tr><tr id=\"-d6gjqo_90\"><td id=\"-d6gjqo_97\"><p>Generator</p></td><td id=\"-d6gjqo_98\"><p>Not selected</p></td></tr><tr id=\"-d6gjqo_91\"><td id=\"-d6gjqo_99\"><p>Billing model</p></td><td id=\"-d6gjqo_100\"><p>Not selected — <span class=\"control\" id=\"-d6gjqo_101\">cannot bill without it</span></p></td></tr><tr id=\"-d6gjqo_92\"><td id=\"-d6gjqo_102\"><p>Required custom fields</p></td><td id=\"-d6gjqo_103\"><p>Red outline — fill before save</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2><ul class=\"list _bullet\" id=\"-d6gjqo_104\"><li class=\"list__item\" id=\"-d6gjqo_105\"><p id=\"-d6gjqo_109\">Wrong <span class=\"control\" id=\"-d6gjqo_110\">billing model</span> (fixed vs metered) — bills wrong all year.</p></li><li class=\"list__item\" id=\"-d6gjqo_106\"><p id=\"-d6gjqo_111\">Typo in <span class=\"control\" id=\"-d6gjqo_112\">phone</span> — SMS goes elsewhere.</p></li><li class=\"list__item\" id=\"-d6gjqo_107\"><p id=\"-d6gjqo_113\">Leaving moved-out customers <span class=\"control\" id=\"-d6gjqo_114\">active</span>.</p></li><li class=\"list__item\" id=\"-d6gjqo_108\"><p id=\"-d6gjqo_115\">Forgetting <span class=\"control\" id=\"-d6gjqo_116\">inactive</span> vs delete — prefer inactive for history.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-d6gjqo_117\"><thead><tr class=\"ijRowHead\" id=\"-d6gjqo_118\"><th id=\"-d6gjqo_122\"><p>Problem</p></th><th id=\"-d6gjqo_123\"><p>What to try</p></th></tr></thead><tbody><tr id=\"-d6gjqo_119\"><td id=\"-d6gjqo_124\"><p>Not in list</p></td><td id=\"-d6gjqo_125\"><p>Clear search; check inactive filter; next page</p></td></tr><tr id=\"-d6gjqo_120\"><td id=\"-d6gjqo_126\"><p>QR does not work</p></td><td id=\"-d6gjqo_127\"><p>Regenerate; subscriber must be active</p></td></tr><tr id=\"-d6gjqo_121\"><td id=\"-d6gjqo_128\"><p>Cannot change model</p></td><td id=\"-d6gjqo_129\"><p>May affect open bills — ask support if mid-cycle</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2><ul class=\"list _bullet\" id=\"-d6gjqo_130\"><li class=\"list__item\" id=\"-d6gjqo_131\"><p id=\"-d6gjqo_135\"><a data-tooltip=\"Use this once when you are new to Echtirak, or when you take over an account from someone else. Complete every item before your first real monthly billing run.\" href=\"setup-checklist.html\" id=\"-d6gjqo_136\">Setup checklist</a></p></li><li class=\"list__item\" id=\"-d6gjqo_132\"><p id=\"-d6gjqo_137\"><a data-tooltip=\"Define how you charge: fixed monthly amount or by meter (KWH), with prices and fees. Every subscriber must have one model.\" href=\"billing-models.html\" id=\"-d6gjqo_138\">Billing Models</a></p></li><li class=\"list__item\" id=\"-d6gjqo_133\"><p id=\"-d6gjqo_139\"><a data-tooltip=\"Three tools on one screen: see all bills, create special one-off bills, and run monthly generation for many subscribers.\" href=\"bills.html\" id=\"-d6gjqo_140\">Bills</a></p></li><li class=\"list__item\" id=\"-d6gjqo_134\"><p id=\"-d6gjqo_141\"><a data-tooltip=\"Send the same message to many subscribers at once. See past campaigns and open details to check delivery.\" href=\"sms-campaigns.html\" id=\"-d6gjqo_142\">SMS Campaigns</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"dashboard.html\">Dashboard</a><a class=\"navigation-links__next\" href=\"subscriber-addresses.html\">Subscriber Addresses</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"lbl4ow_13\">إدارة كل من يستلم الكهرباء منك: إضافة، تعديل، إلغاء تفعيل، تصدير القائمة، وطباعة <span class=\"control\" id=\"lbl4ow_14\">QR codes</span> لعرض الفواتير أونلاين.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start-prerequisites\" id=\"before-you-start-prerequisites\">قبل أن تبدأ</h2><ul class=\"list _bullet\" id=\"lbl4ow_15\"><li class=\"list__item\" id=\"lbl4ow_16\"><p id=\"lbl4ow_19\"><a data-tooltip=\"تسجيل كل generator (مولدة أو منطقة تغذية). المشتركون والقراءات والتقارير تُجمَّع حسب generator.\" href=\"generators.html\" id=\"lbl4ow_20\">Generators</a> مُنشأة.</p></li><li class=\"list__item\" id=\"lbl4ow_17\"><p id=\"lbl4ow_21\"><a data-tooltip=\"تحديد كيف تُحاسب: مبلغ شهري ثابت أو حسب العداد (KWH)، مع الأسعار والرسوم. كل مشترك يحتاج نموذجاً واحداً.\" href=\"billing-models.html\" id=\"lbl4ow_22\">Billing Models</a> للثابت و/أو العداد.</p></li><li class=\"list__item\" id=\"lbl4ow_18\"><p id=\"lbl4ow_23\">أرقام هواتف مُتحقّقة — SMS والتواصل يعتمدان عليها.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">سير العمل المعتاد</h2><section class=\"chapter\"><h3 data-toc=\"lbl4ow_24\" id=\"lbl4ow_24\">مشترك جديد</h3><ol class=\"list _decimal\" id=\"lbl4ow_27\" type=\"1\"><li class=\"list__item\" id=\"lbl4ow_28\"><p id=\"lbl4ow_32\"><span class=\"control\" id=\"lbl4ow_33\">New</span> → الاسم، الهاتف، اختر <span class=\"control\" id=\"lbl4ow_34\">generator</span> و <span class=\"control\" id=\"lbl4ow_35\">billing model</span>.</p></li><li class=\"list__item\" id=\"lbl4ow_29\"><p id=\"lbl4ow_36\"><span class=\"control\" id=\"lbl4ow_37\">Save</span> → تأكد أن الصف <span class=\"control\" id=\"lbl4ow_38\">active</span>.</p></li><li class=\"list__item\" id=\"lbl4ow_30\"><p id=\"lbl4ow_39\">أضف <a data-tooltip=\"ربط مواقع إضافية بمشترك واحد (محل + بيت، طوابق متعددة، إلخ) حتى تستهدف الفواتير والزيارات المكان الصحيح.\" href=\"subscriber-addresses.html\" id=\"lbl4ow_40\">Subscriber Addresses</a> إن كان له أكثر من موقع.</p></li><li class=\"list__item\" id=\"lbl4ow_31\"><p id=\"lbl4ow_41\">اختياري: اطبع <span class=\"control\" id=\"lbl4ow_42\">QR code</span> للمبنى.</p></li></ol></section><section class=\"chapter\"><h3 data-toc=\"lbl4ow_25\" id=\"lbl4ow_25\">نهاية الشهر / مغادرة</h3><ol class=\"list _decimal\" id=\"lbl4ow_43\" type=\"1\"><li class=\"list__item\" id=\"lbl4ow_44\"><p id=\"lbl4ow_46\">ابحث عن المشترك → اجعله <span class=\"control\" id=\"lbl4ow_47\">inactive</span> عند المغادرة (لا تحذف إن وُجدت فواتير قديمة).</p></li><li class=\"list__item\" id=\"lbl4ow_45\"><p id=\"lbl4ow_48\">تأكد أنه لن تُولَّد فاتورة الشهر القادم لحساب inactive.</p></li></ol></section><section class=\"chapter\"><h3 data-toc=\"lbl4ow_26\" id=\"lbl4ow_26\">جماعي</h3><ul class=\"list _bullet\" id=\"lbl4ow_49\"><li class=\"list__item\" id=\"lbl4ow_50\"><p id=\"lbl4ow_52\"><span class=\"control\" id=\"lbl4ow_53\">Export CSV</span> لسجلات المكتب.</p></li><li class=\"list__item\" id=\"lbl4ow_51\"><p id=\"lbl4ow_54\"><span class=\"control\" id=\"lbl4ow_55\">Download QR Codes</span> حسب generator عند تركيب الرموز في مبنى.</p></li></ul></section></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">ما تراه على هذه الصفحة</h2><ul class=\"list _bullet\" id=\"lbl4ow_56\"><li class=\"list__item\" id=\"lbl4ow_57\"><p id=\"lbl4ow_62\"><span class=\"control\" id=\"lbl4ow_63\">New</span>، <span class=\"control\" id=\"lbl4ow_64\">Export CSV</span>، <span class=\"control\" id=\"lbl4ow_65\">Download QR Codes</span></p></li><li class=\"list__item\" id=\"lbl4ow_58\"><p id=\"lbl4ow_66\">بحث، <span class=\"control\" id=\"lbl4ow_67\">Clear</span>، <span class=\"control\" id=\"lbl4ow_68\">Expand/Collapse All</span></p></li><li class=\"list__item\" id=\"lbl4ow_59\"><p id=\"lbl4ow_69\">جدول: phone، name، generator، model، status، إلخ.</p></li><li class=\"list__item\" id=\"lbl4ow_60\"><p id=\"lbl4ow_70\">لوحة <span class=\"control\" id=\"lbl4ow_71\">Subscriber Details</span>: نموذج التعديل الكامل</p></li><li class=\"list__item\" id=\"lbl4ow_61\"><p id=\"lbl4ow_72\"><span class=\"control\" id=\"lbl4ow_73\">Subscriber Qr-Code</span> للطباعة</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"step-by-step-add-one-subscriber\" id=\"step-by-step-add-one-subscriber\">خطوة بخطوة: إضافة مشترك واحد</h2><ol class=\"list _decimal\" id=\"lbl4ow_74\" type=\"1\"><li class=\"list__item\" id=\"lbl4ow_75\"><p id=\"lbl4ow_80\">Subscribers → <span class=\"control\" id=\"lbl4ow_81\">New</span>.</p></li><li class=\"list__item\" id=\"lbl4ow_76\"><p id=\"lbl4ow_82\">املأ <span class=\"control\" id=\"lbl4ow_83\">phone</span> (مطلوب) — استخدم الصيغة التي يتفق عليها فريقك.</p></li><li class=\"list__item\" id=\"lbl4ow_77\"><p id=\"lbl4ow_84\">اختر <span class=\"control\" id=\"lbl4ow_85\">generator</span> و <span class=\"control\" id=\"lbl4ow_86\">billing model</span> — يجب أن يطابقا العقد الحقيقي.</p></li><li class=\"list__item\" id=\"lbl4ow_78\"><p id=\"lbl4ow_87\"><span class=\"control\" id=\"lbl4ow_88\">Save</span> → ابحث بالهاتف للتأكيد.</p></li><li class=\"list__item\" id=\"lbl4ow_79\"><p id=\"lbl4ow_89\">إن كان metered، تأكد أن الجامعين يعرفون قراءة العداد في الدورة القادمة.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes-app-blocks-save\" id=\"validation-mistakes-app-blocks-save\">أخطاء التحقق</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"lbl4ow_90\"><thead><tr class=\"ijRowHead\" id=\"lbl4ow_91\"><th id=\"lbl4ow_96\"><p>الحقل / القاعدة</p></th><th id=\"lbl4ow_97\"><p>خطأ شائع</p></th></tr></thead><tbody><tr id=\"lbl4ow_92\"><td id=\"lbl4ow_98\"><p>Phone</p></td><td id=\"lbl4ow_99\"><p>فارغ أو مكرر حيث لا يُسمح</p></td></tr><tr id=\"lbl4ow_93\"><td id=\"lbl4ow_100\"><p>Generator</p></td><td id=\"lbl4ow_101\"><p>غير محدد</p></td></tr><tr id=\"lbl4ow_94\"><td id=\"lbl4ow_102\"><p>Billing model</p></td><td id=\"lbl4ow_103\"><p>غير محدد — <span class=\"control\" id=\"lbl4ow_104\">لا فوترة بدونه</span></p></td></tr><tr id=\"lbl4ow_95\"><td id=\"lbl4ow_105\"><p>حقول مخصصة مطلوبة</p></td><td id=\"lbl4ow_106\"><p>إطار أحمر — املأ قبل الحفظ</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"lbl4ow_107\"><li class=\"list__item\" id=\"lbl4ow_108\"><p id=\"lbl4ow_112\"><span class=\"control\" id=\"lbl4ow_113\">billing model</span> خاطئ (ثابت مقابل عداد) — فواتير خاطئة طوال السنة.</p></li><li class=\"list__item\" id=\"lbl4ow_109\"><p id=\"lbl4ow_114\">خطأ في <span class=\"control\" id=\"lbl4ow_115\">phone</span> — SMS يذهب لشخص آخر.</p></li><li class=\"list__item\" id=\"lbl4ow_110\"><p id=\"lbl4ow_116\">ترك من غادر <span class=\"control\" id=\"lbl4ow_117\">active</span>.</p></li><li class=\"list__item\" id=\"lbl4ow_111\"><p id=\"lbl4ow_118\">الخلط بين inactive والحذف — يُفضَّل inactive للتاريخ.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"lbl4ow_119\"><thead><tr class=\"ijRowHead\" id=\"lbl4ow_120\"><th id=\"lbl4ow_124\"><p>المشكلة</p></th><th id=\"lbl4ow_125\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"lbl4ow_121\"><td id=\"lbl4ow_126\"><p>غير موجود في القائمة</p></td><td id=\"lbl4ow_127\"><p>امسح البحث؛ تحقق من فلتر inactive؛ الصفحة التالية</p></td></tr><tr id=\"lbl4ow_122\"><td id=\"lbl4ow_128\"><p>QR لا يعمل</p></td><td id=\"lbl4ow_129\"><p>أعد التوليد؛ يجب أن يكون المشترك active</p></td></tr><tr id=\"lbl4ow_123\"><td id=\"lbl4ow_130\"><p>لا أستطيع تغيير النموذج</p></td><td id=\"lbl4ow_131\"><p>قد يؤثر على فواتير مفتوحة — اسأل الدعم منتصف الدورة</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"lbl4ow_132\"><li class=\"list__item\" id=\"lbl4ow_133\"><p id=\"lbl4ow_137\"><a data-tooltip=\"استخدمها مرة واحدة عند بدء العمل على Echtirak، أو عند استلام حساب من شخص آخر. أكمل كل بند قبل أول دورة فوترة شهرية حقيقية.\" href=\"setup-checklist.html\" id=\"lbl4ow_138\">قائمة الإعداد</a></p></li><li class=\"list__item\" id=\"lbl4ow_134\"><p id=\"lbl4ow_139\"><a data-tooltip=\"تحديد كيف تُحاسب: مبلغ شهري ثابت أو حسب العداد (KWH)، مع الأسعار والرسوم. كل مشترك يحتاج نموذجاً واحداً.\" href=\"billing-models.html\" id=\"lbl4ow_140\">Billing Models</a></p></li><li class=\"list__item\" id=\"lbl4ow_135\"><p id=\"lbl4ow_141\"><a data-tooltip=\"ثلاث أدوات في شاشة واحدة: عرض كل الفواتير، إنشاء فواتير استثنائية لمرة واحدة، وتشغيل التوليد الشهري لعدة مشتركين.\" href=\"bills.html\" id=\"lbl4ow_142\">Bills</a></p></li><li class=\"list__item\" id=\"lbl4ow_136\"><p id=\"lbl4ow_143\"><a data-tooltip=\"إرسال نفس الرسالة إلى عدة مشتركين دفعة واحدة. اعرض الحملات السابقة وافتح التفاصيل للتحقق من التسليم.\" href=\"sms-campaigns.html\" id=\"lbl4ow_144\">SMS Campaigns</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"dashboard.html\">Dashboard</a><a class=\"navigation-links__next\" href=\"subscriber-addresses.html\">Subscriber Addresses</a></div>"
        },
        "keywords": [
            "People and places",
            "Subscribers",
            "subscribers",
            "الناس والمواقع"
        ]
    },
    {
        "id": "subscriber-addresses",
        "slug": "subscriber-addresses",
        "fileName": "subscriber-addresses.html",
        "title": {
            "en": "Subscriber Addresses",
            "ar": "Subscriber Addresses"
        },
        "group": {
            "en": "People and places",
            "ar": "الناس والمواقع"
        },
        "appRoute": "subscriber-addresses",
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start",
                "title": {
                    "en": "Before you start",
                    "ar": "قبل أن تبدأ"
                }
            },
            {
                "id": "your-regular-workflow",
                "title": {
                    "en": "Your regular workflow",
                    "ar": "سير العمل المعتاد"
                }
            },
            {
                "id": "what-you-see-on-this-page",
                "title": {
                    "en": "What you see on this page",
                    "ar": "ما تراه على هذه الصفحة"
                }
            },
            {
                "id": "step-by-step",
                "title": {
                    "en": "Step-by-step",
                    "ar": "خطوة بخطوة"
                }
            },
            {
                "id": "validation-mistakes",
                "title": {
                    "en": "Validation mistakes",
                    "ar": "أخطاء التحقق"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2><p id=\"ird7zm_12\">Link <span class=\"control\" id=\"ird7zm_13\">extra locations</span> to one subscriber (shop + home, multiple floors, etc.) so bills and visits target the right place.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">Before you start</h2><ul class=\"list _bullet\" id=\"ird7zm_14\"><li class=\"list__item\" id=\"ird7zm_15\"><p id=\"ird7zm_16\"><a data-tooltip=\"Manage everyone who receives electricity from you: add, edit, deactivate, export list, and print QR codes so they can view bills online.\" href=\"subscribers.html\" id=\"ird7zm_17\">Subscribers</a> already created for that person.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">Your regular workflow</h2><ol class=\"list _decimal\" id=\"ird7zm_18\" type=\"1\"><li class=\"list__item\" id=\"ird7zm_19\"><p id=\"ird7zm_22\">When a subscriber gets a <span class=\"control\" id=\"ird7zm_23\">second meter or address</span> → add row here.</p></li><li class=\"list__item\" id=\"ird7zm_20\"><p id=\"ird7zm_24\">When they <span class=\"control\" id=\"ird7zm_25\">move</span> → update or remove old address; do not leave duplicate active addresses.</p></li><li class=\"list__item\" id=\"ird7zm_21\"><p id=\"ird7zm_26\">Before billing a specific location → confirm address list is current.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">What you see on this page</h2><p id=\"ird7zm_27\">Table of addresses with subscriber name and location text; add / edit / remove; search.</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">Step-by-step</h2><ol class=\"list _decimal\" id=\"ird7zm_28\" type=\"1\"><li class=\"list__item\" id=\"ird7zm_29\"><p id=\"ird7zm_33\">Subscriber Addresses → add.</p></li><li class=\"list__item\" id=\"ird7zm_30\"><p id=\"ird7zm_34\">Choose <span class=\"control\" id=\"ird7zm_35\">subscriber</span>.</p></li><li class=\"list__item\" id=\"ird7zm_31\"><p id=\"ird7zm_36\">Enter full address (building, floor, shop name — what collectors need).</p></li><li class=\"list__item\" id=\"ird7zm_32\"><p id=\"ird7zm_37\">Save and find it in the list.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">Validation mistakes</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"ird7zm_38\"><thead><tr class=\"ijRowHead\" id=\"ird7zm_39\"><th id=\"ird7zm_42\"><p>Issue</p></th><th id=\"ird7zm_43\"><p>Result</p></th></tr></thead><tbody><tr id=\"ird7zm_40\"><td id=\"ird7zm_44\"><p>No subscriber selected</p></td><td id=\"ird7zm_45\"><p>Cannot save</p></td></tr><tr id=\"ird7zm_41\"><td id=\"ird7zm_46\"><p>Empty address text</p></td><td id=\"ird7zm_47\"><p>Required field error</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2><ul class=\"list _bullet\" id=\"ird7zm_48\"><li class=\"list__item\" id=\"ird7zm_49\"><p id=\"ird7zm_52\">Duplicate addresses for same shop.</p></li><li class=\"list__item\" id=\"ird7zm_50\"><p id=\"ird7zm_53\">Address on wrong subscriber.</p></li><li class=\"list__item\" id=\"ird7zm_51\"><p id=\"ird7zm_54\">Forgetting to update after move — collector visits wrong door.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"ird7zm_55\"><thead><tr class=\"ijRowHead\" id=\"ird7zm_56\"><th id=\"ird7zm_59\"><p>Problem</p></th><th id=\"ird7zm_60\"><p>What to try</p></th></tr></thead><tbody><tr id=\"ird7zm_57\"><td id=\"ird7zm_61\"><p>Cannot delete</p></td><td id=\"ird7zm_62\"><p>May be tied to a bill — check with support</p></td></tr><tr id=\"ird7zm_58\"><td id=\"ird7zm_63\"><p>Not visible</p></td><td id=\"ird7zm_64\"><p>Clear search filters</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2><ul class=\"list _bullet\" id=\"ird7zm_65\"><li class=\"list__item\" id=\"ird7zm_66\"><p id=\"ird7zm_68\"><a data-tooltip=\"Manage everyone who receives electricity from you: add, edit, deactivate, export list, and print QR codes so they can view bills online.\" href=\"subscribers.html\" id=\"ird7zm_69\">Subscribers</a></p></li><li class=\"list__item\" id=\"ird7zm_67\"><p id=\"ird7zm_70\"><a data-tooltip=\"Use this once when you are new to Echtirak, or when you take over an account from someone else. Complete every item before your first real monthly billing run.\" href=\"setup-checklist.html\" id=\"ird7zm_71\">Setup checklist</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"subscribers.html\">Subscribers</a><a class=\"navigation-links__next\" href=\"generators.html\">Generators</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"-laiji6_13\">ربط <span class=\"control\" id=\"-laiji6_14\">مواقع إضافية</span> بمشترك واحد (محل + بيت، طوابق متعددة، إلخ) حتى تستهدف الفواتير والزيارات المكان الصحيح.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">قبل أن تبدأ</h2><ul class=\"list _bullet\" id=\"-laiji6_15\"><li class=\"list__item\" id=\"-laiji6_16\"><p id=\"-laiji6_17\"><a data-tooltip=\"إدارة كل من يستلم الكهرباء منك: إضافة، تعديل، إلغاء تفعيل، تصدير القائمة، وطباعة QR codes لعرض الفواتير أونلاين.\" href=\"subscribers.html\" id=\"-laiji6_18\">Subscribers</a> مُنشأون مسبقاً لذلك الشخص.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">سير العمل المعتاد</h2><ol class=\"list _decimal\" id=\"-laiji6_19\" type=\"1\"><li class=\"list__item\" id=\"-laiji6_20\"><p id=\"-laiji6_23\">عند <span class=\"control\" id=\"-laiji6_24\">عداد أو عنوان ثانٍ</span> → أضف صفاً هنا.</p></li><li class=\"list__item\" id=\"-laiji6_21\"><p id=\"-laiji6_25\">عند <span class=\"control\" id=\"-laiji6_26\">الانتقال</span> → حدّث أو أزل العنوان القديم؛ لا تترك عناوين active مكررة.</p></li><li class=\"list__item\" id=\"-laiji6_22\"><p id=\"-laiji6_27\">قبل فوترة موقع معيّن → تأكد أن قائمة العناوين محدّثة.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">ما تراه على هذه الصفحة</h2><p id=\"-laiji6_28\">جدول عناوين مع اسم المشترك ونص الموقع؛ إضافة / تعديل / إزالة؛ بحث.</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">خطوة بخطوة</h2><ol class=\"list _decimal\" id=\"-laiji6_29\" type=\"1\"><li class=\"list__item\" id=\"-laiji6_30\"><p id=\"-laiji6_34\">Subscriber Addresses → إضافة.</p></li><li class=\"list__item\" id=\"-laiji6_31\"><p id=\"-laiji6_35\">اختر <span class=\"control\" id=\"-laiji6_36\">subscriber</span>.</p></li><li class=\"list__item\" id=\"-laiji6_32\"><p id=\"-laiji6_37\">أدخل العنوان كاملاً (مبنى، طابق، اسم المحل — ما يحتاجه الجامع).</p></li><li class=\"list__item\" id=\"-laiji6_33\"><p id=\"-laiji6_38\"><span class=\"control\" id=\"-laiji6_39\">Save</span> وابحث عنه في القائمة.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">أخطاء التحقق</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-laiji6_40\"><thead><tr class=\"ijRowHead\" id=\"-laiji6_41\"><th id=\"-laiji6_44\"><p>المشكلة</p></th><th id=\"-laiji6_45\"><p>النتيجة</p></th></tr></thead><tbody><tr id=\"-laiji6_42\"><td id=\"-laiji6_46\"><p>لم يُختر subscriber</p></td><td id=\"-laiji6_47\"><p>لا يمكن الحفظ</p></td></tr><tr id=\"-laiji6_43\"><td id=\"-laiji6_48\"><p>نص العنوان فارغ</p></td><td id=\"-laiji6_49\"><p>خطأ حقل مطلوب</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"-laiji6_50\"><li class=\"list__item\" id=\"-laiji6_51\"><p id=\"-laiji6_54\">عناوين مكررة لنفس المحل.</p></li><li class=\"list__item\" id=\"-laiji6_52\"><p id=\"-laiji6_55\">عنوان على subscriber خاطئ.</p></li><li class=\"list__item\" id=\"-laiji6_53\"><p id=\"-laiji6_56\">نسيان التحديث بعد الانتقال — الجامع يزور باباً خاطئاً.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-laiji6_57\"><thead><tr class=\"ijRowHead\" id=\"-laiji6_58\"><th id=\"-laiji6_61\"><p>المشكلة</p></th><th id=\"-laiji6_62\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"-laiji6_59\"><td id=\"-laiji6_63\"><p>لا أستطيع الحذف</p></td><td id=\"-laiji6_64\"><p>قد يكون مربوطاً بفاتورة — راجع مع الدعم</p></td></tr><tr id=\"-laiji6_60\"><td id=\"-laiji6_65\"><p>غير ظاهر</p></td><td id=\"-laiji6_66\"><p>امسح فلاتر البحث</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"-laiji6_67\"><li class=\"list__item\" id=\"-laiji6_68\"><p id=\"-laiji6_70\"><a data-tooltip=\"إدارة كل من يستلم الكهرباء منك: إضافة، تعديل، إلغاء تفعيل، تصدير القائمة، وطباعة QR codes لعرض الفواتير أونلاين.\" href=\"subscribers.html\" id=\"-laiji6_71\">Subscribers</a></p></li><li class=\"list__item\" id=\"-laiji6_69\"><p id=\"-laiji6_72\"><a data-tooltip=\"استخدمها مرة واحدة عند بدء العمل على Echtirak، أو عند استلام حساب من شخص آخر. أكمل كل بند قبل أول دورة فوترة شهرية حقيقية.\" href=\"setup-checklist.html\" id=\"-laiji6_73\">قائمة الإعداد</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"subscribers.html\">Subscribers</a><a class=\"navigation-links__next\" href=\"generators.html\">Generators</a></div>"
        },
        "keywords": [
            "People and places",
            "Subscriber Addresses",
            "subscriber addresses",
            "الناس والمواقع"
        ]
    },
    {
        "id": "generators",
        "slug": "generators",
        "fileName": "generators.html",
        "title": {
            "en": "Generators",
            "ar": "Generators"
        },
        "group": {
            "en": "People and places",
            "ar": "الناس والمواقع"
        },
        "appRoute": "generators",
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start",
                "title": {
                    "en": "Before you start",
                    "ar": "قبل أن تبدأ"
                }
            },
            {
                "id": "your-regular-workflow",
                "title": {
                    "en": "Your regular workflow",
                    "ar": "سير العمل المعتاد"
                }
            },
            {
                "id": "what-you-see-on-this-page",
                "title": {
                    "en": "What you see on this page",
                    "ar": "ما تراه على هذه الصفحة"
                }
            },
            {
                "id": "step-by-step",
                "title": {
                    "en": "Step-by-step",
                    "ar": "خطوة بخطوة"
                }
            },
            {
                "id": "validation-mistakes",
                "title": {
                    "en": "Validation mistakes",
                    "ar": "أخطاء التحقق"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2><p id=\"-1qil2p_12\">Register each <span class=\"control\" id=\"-1qil2p_13\">generator</span> (machine or supply zone). Subscribers, readings, and reports are grouped by generator.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">Before you start</h2><ul class=\"list _bullet\" id=\"-1qil2p_14\"><li class=\"list__item\" id=\"-1qil2p_15\"><p id=\"-1qil2p_16\">You know how many generators you run and their names/codes.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">Your regular workflow</h2><ul class=\"list _bullet\" id=\"-1qil2p_17\"><li class=\"list__item\" id=\"-1qil2p_18\"><p id=\"-1qil2p_21\"><span class=\"control\" id=\"-1qil2p_22\">Once:</span> Add every generator before subscribers.</p></li><li class=\"list__item\" id=\"-1qil2p_19\"><p id=\"-1qil2p_23\"><span class=\"control\" id=\"-1qil2p_24\">When you add a machine:</span> New row here, then assign subscribers.</p></li><li class=\"list__item\" id=\"-1qil2p_20\"><p id=\"-1qil2p_25\"><span class=\"control\" id=\"-1qil2p_26\">When retired:</span> Set inactive only when no active subscribers remain.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">What you see on this page</h2><p id=\"-1qil2p_27\">Table of generators; <span class=\"control\" id=\"-1qil2p_28\">New</span>; <span class=\"control\" id=\"-1qil2p_29\">Generator Details</span> for edit (name, code, status).</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">Step-by-step</h2><ol class=\"list _decimal\" id=\"-1qil2p_30\" type=\"1\"><li class=\"list__item\" id=\"-1qil2p_31\"><p id=\"-1qil2p_35\">Generators → <span class=\"control\" id=\"-1qil2p_36\">New</span>.</p></li><li class=\"list__item\" id=\"-1qil2p_32\"><p id=\"-1qil2p_37\">Name (clear area name) and <span class=\"control\" id=\"-1qil2p_38\">code</span> (short ID your team uses on paper).</p></li><li class=\"list__item\" id=\"-1qil2p_33\"><p id=\"-1qil2p_39\">Save as <span class=\"control\" id=\"-1qil2p_40\">active</span>.</p></li><li class=\"list__item\" id=\"-1qil2p_34\"><p id=\"-1qil2p_41\">Use this generator when adding <a data-tooltip=\"Manage everyone who receives electricity from you: add, edit, deactivate, export list, and print QR codes so they can view bills online.\" href=\"subscribers.html\" id=\"-1qil2p_42\">Subscribers</a>.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">Validation mistakes</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-1qil2p_43\"><thead><tr class=\"ijRowHead\" id=\"-1qil2p_44\"><th id=\"-1qil2p_47\"><p>Issue</p></th><th id=\"-1qil2p_48\"><p>Result</p></th></tr></thead><tbody><tr id=\"-1qil2p_45\"><td id=\"-1qil2p_49\"><p>Duplicate code</p></td><td id=\"-1qil2p_50\"><p>Save may fail — use unique codes</p></td></tr><tr id=\"-1qil2p_46\"><td id=\"-1qil2p_51\"><p>Inactive generator</p></td><td id=\"-1qil2p_52\"><p>New subscribers may not assign to it</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2><ul class=\"list _bullet\" id=\"-1qil2p_53\"><li class=\"list__item\" id=\"-1qil2p_54\"><p id=\"-1qil2p_57\">One generator for everything — you lose per-area reports.</p></li><li class=\"list__item\" id=\"-1qil2p_55\"><p id=\"-1qil2p_58\">Deactivating while subscribers still active.</p></li><li class=\"list__item\" id=\"-1qil2p_56\"><p id=\"-1qil2p_59\">Codes that do not match what collectors write on paper.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-1qil2p_60\"><thead><tr class=\"ijRowHead\" id=\"-1qil2p_61\"><th id=\"-1qil2p_63\"><p>Problem</p></th><th id=\"-1qil2p_64\"><p>What to try</p></th></tr></thead><tbody><tr id=\"-1qil2p_62\"><td id=\"-1qil2p_65\"><p>Missing from dropdown on subscriber</p></td><td id=\"-1qil2p_66\"><p>Generator inactive — reactivate or pick another</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2><ul class=\"list _bullet\" id=\"-1qil2p_67\"><li class=\"list__item\" id=\"-1qil2p_68\"><p id=\"-1qil2p_71\"><a data-tooltip=\"Use this once when you are new to Echtirak, or when you take over an account from someone else. Complete every item before your first real monthly billing run.\" href=\"setup-checklist.html\" id=\"-1qil2p_72\">Setup checklist</a></p></li><li class=\"list__item\" id=\"-1qil2p_69\"><p id=\"-1qil2p_73\"><a data-tooltip=\"Manage everyone who receives electricity from you: add, edit, deactivate, export list, and print QR codes so they can view bills online.\" href=\"subscribers.html\" id=\"-1qil2p_74\">Subscribers</a></p></li><li class=\"list__item\" id=\"-1qil2p_70\"><p id=\"-1qil2p_75\"><a data-tooltip=\"History of meter readings for metered subscribers. Used to calculate usage and bills. Check photos when a number looks wrong.\" href=\"kwh-readings.html\" id=\"-1qil2p_76\">KWH Readings</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"subscriber-addresses.html\">Subscriber Addresses</a><a class=\"navigation-links__next\" href=\"bill-collectors.html\">Bill Collectors</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"-eddich_13\">تسجيل كل <span class=\"control\" id=\"-eddich_14\">generator</span> (مولدة أو منطقة تغذية). المشتركون والقراءات والتقارير تُجمَّع حسب generator.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">قبل أن تبدأ</h2><ul class=\"list _bullet\" id=\"-eddich_15\"><li class=\"list__item\" id=\"-eddich_16\"><p id=\"-eddich_17\">تعرف عدد المولدات وأسماءها/رموزها.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">سير العمل المعتاد</h2><ul class=\"list _bullet\" id=\"-eddich_18\"><li class=\"list__item\" id=\"-eddich_19\"><p id=\"-eddich_22\"><span class=\"control\" id=\"-eddich_23\">مرة واحدة:</span> أضف كل generator قبل المشتركين.</p></li><li class=\"list__item\" id=\"-eddich_20\"><p id=\"-eddich_24\"><span class=\"control\" id=\"-eddich_25\">عند إضافة مولدة:</span> صف جديد هنا، ثم عيّن المشتركين.</p></li><li class=\"list__item\" id=\"-eddich_21\"><p id=\"-eddich_26\"><span class=\"control\" id=\"-eddich_27\">عند الإيقاف:</span> اجعلها inactive فقط عندما لا يبقى مشتركون active.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">ما تراه على هذه الصفحة</h2><p id=\"-eddich_28\">جدول generators؛ <span class=\"control\" id=\"-eddich_29\">New</span>؛ <span class=\"control\" id=\"-eddich_30\">Generator Details</span> للتعديل (name، code، status).</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">خطوة بخطوة</h2><ol class=\"list _decimal\" id=\"-eddich_31\" type=\"1\"><li class=\"list__item\" id=\"-eddich_32\"><p id=\"-eddich_36\">Generators → <span class=\"control\" id=\"-eddich_37\">New</span>.</p></li><li class=\"list__item\" id=\"-eddich_33\"><p id=\"-eddich_38\">الاسم (واضح للمنطقة) و <span class=\"control\" id=\"-eddich_39\">code</span> (معرّف قصير يستخدمه فريقك على الورق).</p></li><li class=\"list__item\" id=\"-eddich_34\"><p id=\"-eddich_40\">احفظ كـ <span class=\"control\" id=\"-eddich_41\">active</span>.</p></li><li class=\"list__item\" id=\"-eddich_35\"><p id=\"-eddich_42\">استخدم هذا الـ generator عند إضافة <a data-tooltip=\"إدارة كل من يستلم الكهرباء منك: إضافة، تعديل، إلغاء تفعيل، تصدير القائمة، وطباعة QR codes لعرض الفواتير أونلاين.\" href=\"subscribers.html\" id=\"-eddich_43\">Subscribers</a>.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">أخطاء التحقق</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-eddich_44\"><thead><tr class=\"ijRowHead\" id=\"-eddich_45\"><th id=\"-eddich_48\"><p>المشكلة</p></th><th id=\"-eddich_49\"><p>النتيجة</p></th></tr></thead><tbody><tr id=\"-eddich_46\"><td id=\"-eddich_50\"><p>code مكرر</p></td><td id=\"-eddich_51\"><p>قد يفشل الحفظ — استخدم رموزاً فريدة</p></td></tr><tr id=\"-eddich_47\"><td id=\"-eddich_52\"><p>generator inactive</p></td><td id=\"-eddich_53\"><p>قد لا يُعيَّن لمشتركين جدد</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"-eddich_54\"><li class=\"list__item\" id=\"-eddich_55\"><p id=\"-eddich_58\">generator واحد للكل — تفقد تقارير كل منطقة.</p></li><li class=\"list__item\" id=\"-eddich_56\"><p id=\"-eddich_59\">إلغاء التفعيل والمشتركون ما زالوا active.</p></li><li class=\"list__item\" id=\"-eddich_57\"><p id=\"-eddich_60\">رموز لا تطابق ما يكتبه الجامعون على الورق.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-eddich_61\"><thead><tr class=\"ijRowHead\" id=\"-eddich_62\"><th id=\"-eddich_64\"><p>المشكلة</p></th><th id=\"-eddich_65\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"-eddich_63\"><td id=\"-eddich_66\"><p>غائب من القائمة عند subscriber</p></td><td id=\"-eddich_67\"><p>الـ generator inactive — أعد تفعيله أو اختر غيره</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"-eddich_68\"><li class=\"list__item\" id=\"-eddich_69\"><p id=\"-eddich_72\"><a data-tooltip=\"استخدمها مرة واحدة عند بدء العمل على Echtirak، أو عند استلام حساب من شخص آخر. أكمل كل بند قبل أول دورة فوترة شهرية حقيقية.\" href=\"setup-checklist.html\" id=\"-eddich_73\">قائمة الإعداد</a></p></li><li class=\"list__item\" id=\"-eddich_70\"><p id=\"-eddich_74\"><a data-tooltip=\"إدارة كل من يستلم الكهرباء منك: إضافة، تعديل، إلغاء تفعيل، تصدير القائمة، وطباعة QR codes لعرض الفواتير أونلاين.\" href=\"subscribers.html\" id=\"-eddich_75\">Subscribers</a></p></li><li class=\"list__item\" id=\"-eddich_71\"><p id=\"-eddich_76\"><a data-tooltip=\"سجل قراءات العداد للمشتركين metered. تُستخدم لحساب الاستهلاك والفواتير. راجع الصور عندما يبدو الرقم غريباً.\" href=\"kwh-readings.html\" id=\"-eddich_77\">KWH Readings</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"subscriber-addresses.html\">Subscriber Addresses</a><a class=\"navigation-links__next\" href=\"bill-collectors.html\">Bill Collectors</a></div>"
        },
        "keywords": [
            "Generators",
            "People and places",
            "generators",
            "الناس والمواقع"
        ]
    },
    {
        "id": "bill-collectors",
        "slug": "bill-collectors",
        "fileName": "bill-collectors.html",
        "title": {
            "en": "Bill Collectors",
            "ar": "Bill Collectors"
        },
        "group": {
            "en": "People and places",
            "ar": "الناس والمواقع"
        },
        "appRoute": "bill-collectors",
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start",
                "title": {
                    "en": "Before you start",
                    "ar": "قبل أن تبدأ"
                }
            },
            {
                "id": "your-regular-workflow",
                "title": {
                    "en": "Your regular workflow",
                    "ar": "سير العمل المعتاد"
                }
            },
            {
                "id": "what-you-see-on-this-page",
                "title": {
                    "en": "What you see on this page",
                    "ar": "ما تراه على هذه الصفحة"
                }
            },
            {
                "id": "step-by-step",
                "title": {
                    "en": "Step-by-step",
                    "ar": "خطوة بخطوة"
                }
            },
            {
                "id": "validation-mistakes",
                "title": {
                    "en": "Validation mistakes",
                    "ar": "أخطاء التحقق"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2><p id=\"i7hy0f_12\">Create accounts for <span class=\"control\" id=\"i7hy0f_13\">field staff</span> who record readings and payments. Control which <span class=\"control\" id=\"i7hy0f_14\">generators</span> each person can see.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">Before you start</h2><ul class=\"list _bullet\" id=\"i7hy0f_15\"><li class=\"list__item\" id=\"i7hy0f_16\"><p id=\"i7hy0f_18\"><a data-tooltip=\"Register each generator (machine or supply zone). Subscribers, readings, and reports are grouped by generator.\" href=\"generators.html\" id=\"i7hy0f_19\">Generators</a> exist.</p></li><li class=\"list__item\" id=\"i7hy0f_17\"><p id=\"i7hy0f_20\">You have a unique <span class=\"control\" id=\"i7hy0f_21\">username</span> per person (no sharing logins).</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">Your regular workflow</h2><p id=\"i7hy0f_22\"><span class=\"control\" id=\"i7hy0f_23\">New hire:</span> New collector → assign generators → give password securely → show them collector app. <br/><span class=\"control\" id=\"i7hy0f_25\">Leave:</span> Deactivate account same day. <br/><span class=\"control\" id=\"i7hy0f_27\">Monthly:</span> If someone sees wrong subscribers, fix generator assignment here.</p></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">What you see on this page</h2><p id=\"i7hy0f_28\">Collector list; <span class=\"control\" id=\"i7hy0f_29\">New</span>; <span class=\"control\" id=\"i7hy0f_30\">Bill Collector Details</span> (generators, contact, status).</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">Step-by-step</h2><ol class=\"list _decimal\" id=\"i7hy0f_31\" type=\"1\"><li class=\"list__item\" id=\"i7hy0f_32\"><p id=\"i7hy0f_37\">Bill Collectors → <span class=\"control\" id=\"i7hy0f_38\">New</span>.</p></li><li class=\"list__item\" id=\"i7hy0f_33\"><p id=\"i7hy0f_39\">Name, phone, username.</p></li><li class=\"list__item\" id=\"i7hy0f_34\"><p id=\"i7hy0f_40\">Assign <span class=\"control\" id=\"i7hy0f_41\">all generators</span> they work on.</p></li><li class=\"list__item\" id=\"i7hy0f_35\"><p id=\"i7hy0f_42\">Save → test login on collector device once.</p></li><li class=\"list__item\" id=\"i7hy0f_36\"><p id=\"i7hy0f_43\">Their collections appear in <a data-tooltip=\"Review money your collectors recorded in the field. Approve when correct; reject when wrong. Until you approve, the payment is not final in your reports.\" href=\"bill-collections.html\" id=\"i7hy0f_44\">Bill Collections</a> for your approval.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">Validation mistakes</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"i7hy0f_45\"><thead><tr class=\"ijRowHead\" id=\"i7hy0f_46\"><th id=\"i7hy0f_50\"><p>Issue</p></th><th id=\"i7hy0f_51\"><p>Result</p></th></tr></thead><tbody><tr id=\"i7hy0f_47\"><td id=\"i7hy0f_52\"><p>Username already used</p></td><td id=\"i7hy0f_53\"><p>Cannot save</p></td></tr><tr id=\"i7hy0f_48\"><td id=\"i7hy0f_54\"><p>No generator assigned</p></td><td id=\"i7hy0f_55\"><p>Collector sees empty lists</p></td></tr><tr id=\"i7hy0f_49\"><td id=\"i7hy0f_56\"><p>Missing required fields</p></td><td id=\"i7hy0f_57\"><p>Red on form</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2><ul class=\"list _bullet\" id=\"i7hy0f_58\"><li class=\"list__item\" id=\"i7hy0f_59\"><p id=\"i7hy0f_62\">One login for multiple people — you cannot trace who collected.</p></li><li class=\"list__item\" id=\"i7hy0f_60\"><p id=\"i7hy0f_63\">Former employee still <span class=\"control\" id=\"i7hy0f_64\">active</span>.</p></li><li class=\"list__item\" id=\"i7hy0f_61\"><p id=\"i7hy0f_65\">Wrong generator — collections tied to wrong area.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"i7hy0f_66\"><thead><tr class=\"ijRowHead\" id=\"i7hy0f_67\"><th id=\"i7hy0f_70\"><p>Problem</p></th><th id=\"i7hy0f_71\"><p>What to try</p></th></tr></thead><tbody><tr id=\"i7hy0f_68\"><td id=\"i7hy0f_72\"><p>Collector sees no subscribers</p></td><td id=\"i7hy0f_73\"><p>Edit details → add generators</p></td></tr><tr id=\"i7hy0f_69\"><td id=\"i7hy0f_74\"><p>Collections not showing for you</p></td><td id=\"i7hy0f_75\"><p>They must submit; you filter pending + dates</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2><ul class=\"list _bullet\" id=\"i7hy0f_76\"><li class=\"list__item\" id=\"i7hy0f_77\"><p id=\"i7hy0f_80\"><a data-tooltip=\"Review money your collectors recorded in the field. Approve when correct; reject when wrong. Until you approve, the payment is not final in your reports.\" href=\"bill-collections.html\" id=\"i7hy0f_81\">Bill Collections</a></p></li><li class=\"list__item\" id=\"i7hy0f_78\"><p id=\"i7hy0f_82\"><a data-tooltip=\"History of meter readings for metered subscribers. Used to calculate usage and bills. Check photos when a number looks wrong.\" href=\"kwh-readings.html\" id=\"i7hy0f_83\">KWH Readings</a></p></li><li class=\"list__item\" id=\"i7hy0f_79\"><p id=\"i7hy0f_84\"><a data-tooltip=\"This is the main workflow most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.\" href=\"monthly-billing-workflow.html\" id=\"i7hy0f_85\">Monthly billing workflow</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"generators.html\">Generators</a><a class=\"navigation-links__next\" href=\"billing-models.html\">Billing Models</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"n87z_13\">إنشاء حسابات <span class=\"control\" id=\"n87z_14\">الموظفين الميدانيين</span> الذين يسجلون القراءات والمدفوعات. تحكم بأي <span class=\"control\" id=\"n87z_15\">generators</span> يرى كل شخص.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">قبل أن تبدأ</h2><ul class=\"list _bullet\" id=\"n87z_16\"><li class=\"list__item\" id=\"n87z_17\"><p id=\"n87z_19\"><a data-tooltip=\"تسجيل كل generator (مولدة أو منطقة تغذية). المشتركون والقراءات والتقارير تُجمَّع حسب generator.\" href=\"generators.html\" id=\"n87z_20\">Generators</a> موجودة.</p></li><li class=\"list__item\" id=\"n87z_18\"><p id=\"n87z_21\"><span class=\"control\" id=\"n87z_22\">username</span> فريد لكل شخص (لا تشاركوا الحسابات).</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">سير العمل المعتاد</h2><p id=\"n87z_23\"><span class=\"control\" id=\"n87z_24\">موظف جديد:</span> New collector → عيّن generators → سلّم كلمة المرور بأمان → اعرض تطبيق الجامع. <br/><span class=\"control\" id=\"n87z_26\">مغادرة:</span> عطّل الحساب في نفس اليوم. <br/><span class=\"control\" id=\"n87z_28\">شهرياً:</span> إن رأى شخص مشتركين خاطئين، صحّح تعيين generator هنا.</p></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">ما تراه على هذه الصفحة</h2><p id=\"n87z_29\">قائمة الجامعين؛ <span class=\"control\" id=\"n87z_30\">New</span>؛ <span class=\"control\" id=\"n87z_31\">Bill Collector Details</span> (generators، اتصال، status).</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">خطوة بخطوة</h2><ol class=\"list _decimal\" id=\"n87z_32\" type=\"1\"><li class=\"list__item\" id=\"n87z_33\"><p id=\"n87z_38\">Bill Collectors → <span class=\"control\" id=\"n87z_39\">New</span>.</p></li><li class=\"list__item\" id=\"n87z_34\"><p id=\"n87z_40\">الاسم، الهاتف، username.</p></li><li class=\"list__item\" id=\"n87z_35\"><p id=\"n87z_41\">عيّن <span class=\"control\" id=\"n87z_42\">كل generators</span> التي يعمل عليها.</p></li><li class=\"list__item\" id=\"n87z_36\"><p id=\"n87z_43\"><span class=\"control\" id=\"n87z_44\">Save</span> → جرّب الدخول من جهاز الجامع مرة.</p></li><li class=\"list__item\" id=\"n87z_37\"><p id=\"n87z_45\">تحصيلاتهم تظهر في <a data-tooltip=\"مراجعة الأموال التي سجّلها الجامعون في الميدان. Approve إن كانت صحيحة؛ Reject إن كانت خاطئة. حتى تعتمد، الدفعة غير نهائية في تقاريرك.\" href=\"bill-collections.html\" id=\"n87z_46\">Bill Collections</a> لاعتمادك.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">أخطاء التحقق</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"n87z_47\"><thead><tr class=\"ijRowHead\" id=\"n87z_48\"><th id=\"n87z_52\"><p>المشكلة</p></th><th id=\"n87z_53\"><p>النتيجة</p></th></tr></thead><tbody><tr id=\"n87z_49\"><td id=\"n87z_54\"><p>username مستخدم</p></td><td id=\"n87z_55\"><p>لا يمكن الحفظ</p></td></tr><tr id=\"n87z_50\"><td id=\"n87z_56\"><p>لا generator معيّن</p></td><td id=\"n87z_57\"><p>الجامع يرى قوائم فارغة</p></td></tr><tr id=\"n87z_51\"><td id=\"n87z_58\"><p>حقول مطلوبة ناقصة</p></td><td id=\"n87z_59\"><p>إطار أحمر على النموذج</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"n87z_60\"><li class=\"list__item\" id=\"n87z_61\"><p id=\"n87z_64\">حساب واحد لعدة أشخاص — لا تعرف من حصل التحصيل.</p></li><li class=\"list__item\" id=\"n87z_62\"><p id=\"n87z_65\">موظف سابق ما زال <span class=\"control\" id=\"n87z_66\">active</span>.</p></li><li class=\"list__item\" id=\"n87z_63\"><p id=\"n87z_67\">generator خاطئ — تحصيل مربوط بمنطقة خاطئة.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"n87z_68\"><thead><tr class=\"ijRowHead\" id=\"n87z_69\"><th id=\"n87z_72\"><p>المشكلة</p></th><th id=\"n87z_73\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"n87z_70\"><td id=\"n87z_74\"><p>الجامع لا يرى مشتركين</p></td><td id=\"n87z_75\"><p>عدّل التفاصيل → أضف generators</p></td></tr><tr id=\"n87z_71\"><td id=\"n87z_76\"><p>التحصيل لا يظهر لك</p></td><td id=\"n87z_77\"><p>يجب أن يرسلوه؛ فلتر pending + التواريخ</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"n87z_78\"><li class=\"list__item\" id=\"n87z_79\"><p id=\"n87z_82\"><a data-tooltip=\"مراجعة الأموال التي سجّلها الجامعون في الميدان. Approve إن كانت صحيحة؛ Reject إن كانت خاطئة. حتى تعتمد، الدفعة غير نهائية في تقاريرك.\" href=\"bill-collections.html\" id=\"n87z_83\">Bill Collections</a></p></li><li class=\"list__item\" id=\"n87z_80\"><p id=\"n87z_84\"><a data-tooltip=\"سجل قراءات العداد للمشتركين metered. تُستخدم لحساب الاستهلاك والفواتير. راجع الصور عندما يبدو الرقم غريباً.\" href=\"kwh-readings.html\" id=\"n87z_85\">KWH Readings</a></p></li><li class=\"list__item\" id=\"n87z_81\"><p id=\"n87z_86\"><a data-tooltip=\"هذا سير العمل الرئيسي الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.\" href=\"monthly-billing-workflow.html\" id=\"n87z_87\">دورة الفوترة الشهرية</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"generators.html\">Generators</a><a class=\"navigation-links__next\" href=\"billing-models.html\">Billing Models</a></div>"
        },
        "keywords": [
            "Bill Collectors",
            "People and places",
            "bill collectors",
            "الناس والمواقع"
        ]
    },
    {
        "id": "billing-models",
        "slug": "billing-models",
        "fileName": "billing-models.html",
        "title": {
            "en": "Billing Models",
            "ar": "Billing Models"
        },
        "group": {
            "en": "Billing setup",
            "ar": "إعداد الفوترة"
        },
        "appRoute": "subscription-billing-model",
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start",
                "title": {
                    "en": "Before you start",
                    "ar": "قبل أن تبدأ"
                }
            },
            {
                "id": "your-regular-workflow",
                "title": {
                    "en": "Your regular workflow",
                    "ar": "سير العمل المعتاد"
                }
            },
            {
                "id": "what-you-see-on-this-page",
                "title": {
                    "en": "What you see on this page",
                    "ar": "ما تراه على هذه الصفحة"
                }
            },
            {
                "id": "step-by-step",
                "title": {
                    "en": "Step-by-step",
                    "ar": "خطوة بخطوة"
                }
            },
            {
                "id": "validation-mistakes",
                "title": {
                    "en": "Validation mistakes",
                    "ar": "أخطاء التحقق"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2><p id=\"he90sz_12\">Define <span class=\"control\" id=\"he90sz_13\">how you charge</span>: fixed monthly amount or by <span class=\"control\" id=\"he90sz_14\">meter (KWH)</span>, with prices and fees. Every subscriber must have one model.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">Before you start</h2><ul class=\"list _bullet\" id=\"he90sz_15\"><li class=\"list__item\" id=\"he90sz_16\"><p id=\"he90sz_18\">Decide your real tariffs (fixed vs metered, price per KWH or flat fee).</p></li><li class=\"list__item\" id=\"he90sz_17\"><p id=\"he90sz_19\"><a data-tooltip=\"Set how dollars convert to pounds (or other pairs) on bills when you use more than one currency.\" href=\"currency-rates.html\" id=\"he90sz_20\">Currency Rates</a> if bills show LBP and USD.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">Your regular workflow</h2><ul class=\"list _bullet\" id=\"he90sz_21\"><li class=\"list__item\" id=\"he90sz_22\"><p id=\"he90sz_25\"><span class=\"control\" id=\"he90sz_26\">Setup:</span> Create all models before subscribers — see <a data-tooltip=\"Use this once when you are new to Echtirak, or when you take over an account from someone else. Complete every item before your first real monthly billing run.\" href=\"setup-checklist.html\" id=\"he90sz_27\">Setup checklist</a>.</p></li><li class=\"list__item\" id=\"he90sz_23\"><p id=\"he90sz_28\"><span class=\"control\" id=\"he90sz_29\">Price change:</span> Add new model or edit for <span class=\"control\" id=\"he90sz_30\">next</span> month; avoid changing mid-cycle without a plan.</p></li><li class=\"list__item\" id=\"he90sz_24\"><p id=\"he90sz_31\"><span class=\"control\" id=\"he90sz_32\">New building type:</span> New model (e.g. “Shop metered” vs “Home fixed”).</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">What you see on this page</h2><p id=\"he90sz_33\">Model list; <span class=\"control\" id=\"he90sz_34\">New</span>; <span class=\"control\" id=\"he90sz_35\">Subscription Billing Model Details</span> (type, amounts, currency, fees).</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">Step-by-step</h2><ol class=\"list _decimal\" id=\"he90sz_36\" type=\"1\"><li class=\"list__item\" id=\"he90sz_37\"><p id=\"he90sz_42\">Billing Models → <span class=\"control\" id=\"he90sz_43\">New</span>.</p></li><li class=\"list__item\" id=\"he90sz_38\"><p id=\"he90sz_44\">Name it clearly (who it is for).</p></li><li class=\"list__item\" id=\"he90sz_39\"><p id=\"he90sz_45\">Choose <span class=\"control\" id=\"he90sz_46\">fixed</span> or <span class=\"control\" id=\"he90sz_47\">metered</span>.</p></li><li class=\"list__item\" id=\"he90sz_40\"><p id=\"he90sz_48\">Enter price / rate and currency.</p></li><li class=\"list__item\" id=\"he90sz_41\"><p id=\"he90sz_49\">Save → assign on each <a data-tooltip=\"Manage everyone who receives electricity from you: add, edit, deactivate, export list, and print QR codes so they can view bills online.\" href=\"subscribers.html\" id=\"he90sz_50\">Subscribers</a> row.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">Validation mistakes</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"he90sz_51\"><thead><tr class=\"ijRowHead\" id=\"he90sz_52\"><th id=\"he90sz_55\"><p>Issue</p></th><th id=\"he90sz_56\"><p>Result</p></th></tr></thead><tbody><tr id=\"he90sz_53\"><td id=\"he90sz_57\"><p>Missing price or type</p></td><td id=\"he90sz_58\"><p>Cannot save</p></td></tr><tr id=\"he90sz_54\"><td id=\"he90sz_59\"><p>Wrong currency vs rates</p></td><td id=\"he90sz_60\"><p>Bills show wrong LBP on printout</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2><ul class=\"list _bullet\" id=\"he90sz_61\"><li class=\"list__item\" id=\"he90sz_62\"><p id=\"he90sz_65\">One model for both fixed and metered customers.</p></li><li class=\"list__item\" id=\"he90sz_63\"><p id=\"he90sz_66\">Changing model on subscriber after bill already generated for that month.</p></li><li class=\"list__item\" id=\"he90sz_64\"><p id=\"he90sz_67\">Name too vague (“Model 1”) — office confusion later.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"he90sz_68\"><thead><tr class=\"ijRowHead\" id=\"he90sz_69\"><th id=\"he90sz_72\"><p>Problem</p></th><th id=\"he90sz_73\"><p>What to try</p></th></tr></thead><tbody><tr id=\"he90sz_70\"><td id=\"he90sz_74\"><p>Cannot delete model</p></td><td id=\"he90sz_75\"><p>Subscribers still use it — reassign first</p></td></tr><tr id=\"he90sz_71\"><td id=\"he90sz_76\"><p>Bill amount wrong</p></td><td id=\"he90sz_77\"><p>Trace: model → reading (if metered) → currency rate</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2><ul class=\"list _bullet\" id=\"he90sz_78\"><li class=\"list__item\" id=\"he90sz_79\"><p id=\"he90sz_83\"><a data-tooltip=\"Use this once when you are new to Echtirak, or when you take over an account from someone else. Complete every item before your first real monthly billing run.\" href=\"setup-checklist.html\" id=\"he90sz_84\">Setup checklist</a></p></li><li class=\"list__item\" id=\"he90sz_80\"><p id=\"he90sz_85\"><a data-tooltip=\"Manage everyone who receives electricity from you: add, edit, deactivate, export list, and print QR codes so they can view bills online.\" href=\"subscribers.html\" id=\"he90sz_86\">Subscribers</a></p></li><li class=\"list__item\" id=\"he90sz_81\"><p id=\"he90sz_87\"><a data-tooltip=\"Three tools on one screen: see all bills, create special one-off bills, and run monthly generation for many subscribers.\" href=\"bills.html\" id=\"he90sz_88\">Bills</a></p></li><li class=\"list__item\" id=\"he90sz_82\"><p id=\"he90sz_89\"><a data-tooltip=\"History of meter readings for metered subscribers. Used to calculate usage and bills. Check photos when a number looks wrong.\" href=\"kwh-readings.html\" id=\"he90sz_90\">KWH Readings</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"bill-collectors.html\">Bill Collectors</a><a class=\"navigation-links__next\" href=\"currency-rates.html\">Currency Rates</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"s9kaqr_13\">تحديد <span class=\"control\" id=\"s9kaqr_14\">كيف تُحاسب</span>: مبلغ شهري ثابت أو حسب <span class=\"control\" id=\"s9kaqr_15\">العداد (KWH)</span>، مع الأسعار والرسوم. كل مشترك يحتاج نموذجاً واحداً.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">قبل أن تبدأ</h2><ul class=\"list _bullet\" id=\"s9kaqr_16\"><li class=\"list__item\" id=\"s9kaqr_17\"><p id=\"s9kaqr_19\">قرّرت التعرفة الحقيقية (ثابت مقابل عداد، سعر KWH أو رسوم ثابتة).</p></li><li class=\"list__item\" id=\"s9kaqr_18\"><p id=\"s9kaqr_20\"><a data-tooltip=\"تحديد كيف يتحوّل الدولار إلى الليرة (أو أزواج أخرى) على الفواتير عند استخدام أكثر من عملة.\" href=\"currency-rates.html\" id=\"s9kaqr_21\">Currency Rates</a> إن ظهرت الفواتير بـ LBP و USD.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">سير العمل المعتاد</h2><ul class=\"list _bullet\" id=\"s9kaqr_22\"><li class=\"list__item\" id=\"s9kaqr_23\"><p id=\"s9kaqr_26\"><span class=\"control\" id=\"s9kaqr_27\">الإعداد:</span> أنشئ كل النماذج قبل المشتركين — راجع <a data-tooltip=\"استخدمها مرة واحدة عند بدء العمل على Echtirak، أو عند استلام حساب من شخص آخر. أكمل كل بند قبل أول دورة فوترة شهرية حقيقية.\" href=\"setup-checklist.html\" id=\"s9kaqr_28\">قائمة الإعداد</a>.</p></li><li class=\"list__item\" id=\"s9kaqr_24\"><p id=\"s9kaqr_29\"><span class=\"control\" id=\"s9kaqr_30\">تغيير السعر:</span> نموذج جديد أو تعديل لـ <span class=\"control\" id=\"s9kaqr_31\">الشهر القادم</span>؛ تجنّب التغيير منتصف الدورة بلا خطة.</p></li><li class=\"list__item\" id=\"s9kaqr_25\"><p id=\"s9kaqr_32\"><span class=\"control\" id=\"s9kaqr_33\">نوع مبنى جديد:</span> نموذج جديد (مثلاً «Shop metered» مقابل «Home fixed»).</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">ما تراه على هذه الصفحة</h2><p id=\"s9kaqr_34\">قائمة النماذج؛ <span class=\"control\" id=\"s9kaqr_35\">New</span>؛ <span class=\"control\" id=\"s9kaqr_36\">Subscription Billing Model Details</span> (type، amounts، currency، fees).</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">خطوة بخطوة</h2><ol class=\"list _decimal\" id=\"s9kaqr_37\" type=\"1\"><li class=\"list__item\" id=\"s9kaqr_38\"><p id=\"s9kaqr_43\">Billing Models → <span class=\"control\" id=\"s9kaqr_44\">New</span>.</p></li><li class=\"list__item\" id=\"s9kaqr_39\"><p id=\"s9kaqr_45\">سمِّه بوضوح (لمن هو).</p></li><li class=\"list__item\" id=\"s9kaqr_40\"><p id=\"s9kaqr_46\">اختر <span class=\"control\" id=\"s9kaqr_47\">fixed</span> أو <span class=\"control\" id=\"s9kaqr_48\">metered</span>.</p></li><li class=\"list__item\" id=\"s9kaqr_41\"><p id=\"s9kaqr_49\">أدخل السعر / التعرفة والعملة.</p></li><li class=\"list__item\" id=\"s9kaqr_42\"><p id=\"s9kaqr_50\"><span class=\"control\" id=\"s9kaqr_51\">Save</span> → عيّنه على كل صف في <a data-tooltip=\"إدارة كل من يستلم الكهرباء منك: إضافة، تعديل، إلغاء تفعيل، تصدير القائمة، وطباعة QR codes لعرض الفواتير أونلاين.\" href=\"subscribers.html\" id=\"s9kaqr_52\">Subscribers</a>.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">أخطاء التحقق</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"s9kaqr_53\"><thead><tr class=\"ijRowHead\" id=\"s9kaqr_54\"><th id=\"s9kaqr_57\"><p>المشكلة</p></th><th id=\"s9kaqr_58\"><p>النتيجة</p></th></tr></thead><tbody><tr id=\"s9kaqr_55\"><td id=\"s9kaqr_59\"><p>سعر أو نوع ناقص</p></td><td id=\"s9kaqr_60\"><p>لا يمكن الحفظ</p></td></tr><tr id=\"s9kaqr_56\"><td id=\"s9kaqr_61\"><p>عملة لا تطابق الأسعار</p></td><td id=\"s9kaqr_62\"><p>LBP خاطئ على الطباعة</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"s9kaqr_63\"><li class=\"list__item\" id=\"s9kaqr_64\"><p id=\"s9kaqr_67\">نموذج واحد للثابت والعداد معاً.</p></li><li class=\"list__item\" id=\"s9kaqr_65\"><p id=\"s9kaqr_68\">تغيير النموذج بعد توليد فاتورة ذلك الشهر.</p></li><li class=\"list__item\" id=\"s9kaqr_66\"><p id=\"s9kaqr_69\">اسم غامض («Model 1») — ارتباك لاحقاً في المكتب.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"s9kaqr_70\"><thead><tr class=\"ijRowHead\" id=\"s9kaqr_71\"><th id=\"s9kaqr_74\"><p>المشكلة</p></th><th id=\"s9kaqr_75\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"s9kaqr_72\"><td id=\"s9kaqr_76\"><p>لا أستطيع حذف النموذج</p></td><td id=\"s9kaqr_77\"><p>مشتركون ما زالوا يستخدمونه — أعد التعيين أولاً</p></td></tr><tr id=\"s9kaqr_73\"><td id=\"s9kaqr_78\"><p>مبلغ الفاتورة خاطئ</p></td><td id=\"s9kaqr_79\"><p>تتبع: النموذج → القراءة (إن metered) → سعر العملة</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"s9kaqr_80\"><li class=\"list__item\" id=\"s9kaqr_81\"><p id=\"s9kaqr_85\"><a data-tooltip=\"استخدمها مرة واحدة عند بدء العمل على Echtirak، أو عند استلام حساب من شخص آخر. أكمل كل بند قبل أول دورة فوترة شهرية حقيقية.\" href=\"setup-checklist.html\" id=\"s9kaqr_86\">قائمة الإعداد</a></p></li><li class=\"list__item\" id=\"s9kaqr_82\"><p id=\"s9kaqr_87\"><a data-tooltip=\"إدارة كل من يستلم الكهرباء منك: إضافة، تعديل، إلغاء تفعيل، تصدير القائمة، وطباعة QR codes لعرض الفواتير أونلاين.\" href=\"subscribers.html\" id=\"s9kaqr_88\">Subscribers</a></p></li><li class=\"list__item\" id=\"s9kaqr_83\"><p id=\"s9kaqr_89\"><a data-tooltip=\"ثلاث أدوات في شاشة واحدة: عرض كل الفواتير، إنشاء فواتير استثنائية لمرة واحدة، وتشغيل التوليد الشهري لعدة مشتركين.\" href=\"bills.html\" id=\"s9kaqr_90\">Bills</a></p></li><li class=\"list__item\" id=\"s9kaqr_84\"><p id=\"s9kaqr_91\"><a data-tooltip=\"سجل قراءات العداد للمشتركين metered. تُستخدم لحساب الاستهلاك والفواتير. راجع الصور عندما يبدو الرقم غريباً.\" href=\"kwh-readings.html\" id=\"s9kaqr_92\">KWH Readings</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"bill-collectors.html\">Bill Collectors</a><a class=\"navigation-links__next\" href=\"currency-rates.html\">Currency Rates</a></div>"
        },
        "keywords": [
            "Billing Models",
            "Billing setup",
            "billing models",
            "إعداد الفوترة"
        ]
    },
    {
        "id": "currency-rates",
        "slug": "currency-rates",
        "fileName": "currency-rates.html",
        "title": {
            "en": "Currency Rates",
            "ar": "Currency Rates"
        },
        "group": {
            "en": "Billing setup",
            "ar": "إعداد الفوترة"
        },
        "appRoute": "currency-rates",
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start",
                "title": {
                    "en": "Before you start",
                    "ar": "قبل أن تبدأ"
                }
            },
            {
                "id": "your-regular-workflow",
                "title": {
                    "en": "Your regular workflow",
                    "ar": "سير العمل المعتاد"
                }
            },
            {
                "id": "what-you-see-on-this-page",
                "title": {
                    "en": "What you see on this page",
                    "ar": "ما تراه على هذه الصفحة"
                }
            },
            {
                "id": "step-by-step",
                "title": {
                    "en": "Step-by-step",
                    "ar": "خطوة بخطوة"
                }
            },
            {
                "id": "validation-mistakes",
                "title": {
                    "en": "Validation mistakes",
                    "ar": "أخطاء التحقق"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2><p id=\"-q5axd4_12\">Set how <span class=\"control\" id=\"-q5axd4_13\">dollars convert to pounds</span> (or other pairs) on bills when you use more than one currency.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">Before you start</h2><ul class=\"list _bullet\" id=\"-q5axd4_14\"><li class=\"list__item\" id=\"-q5axd4_15\"><p id=\"-q5axd4_16\">Know today’s rate your business uses for billing (not necessarily black market tick-by-tick unless that is your policy).</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">Your regular workflow</h2><ul class=\"list _bullet\" id=\"-q5axd4_17\"><li class=\"list__item\" id=\"-q5axd4_18\"><p id=\"-q5axd4_20\"><span class=\"control\" id=\"-q5axd4_21\">When rate changes:</span> Add a <span class=\"control\" id=\"-q5axd4_22\">new</span> row with new start date — do not edit old rows used for past bills.</p></li><li class=\"list__item\" id=\"-q5axd4_19\"><p id=\"-q5axd4_23\"><span class=\"control\" id=\"-q5axd4_24\">Start of month:</span> Confirm rate covers the bill month before <a data-tooltip=\"Three tools on one screen: see all bills, create special one-off bills, and run monthly generation for many subscribers.\" href=\"bills.html\" id=\"-q5axd4_25\">Bill Generation</a>.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">What you see on this page</h2><p id=\"-q5axd4_26\">Rate table; <span class=\"control\" id=\"-q5axd4_27\">New</span>; <span class=\"control\" id=\"-q5axd4_28\">Currency Rate Details</span> (from, to, rate, dates).</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">Step-by-step</h2><ol class=\"list _decimal\" id=\"-q5axd4_29\" type=\"1\"><li class=\"list__item\" id=\"-q5axd4_30\"><p id=\"-q5axd4_35\">Currency Rates → <span class=\"control\" id=\"-q5axd4_36\">New</span>.</p></li><li class=\"list__item\" id=\"-q5axd4_31\"><p id=\"-q5axd4_37\">From / To currencies (e.g. USD → LBP).</p></li><li class=\"list__item\" id=\"-q5axd4_32\"><p id=\"-q5axd4_38\">Enter rate (double-check: 1 USD = X LBP).</p></li><li class=\"list__item\" id=\"-q5axd4_33\"><p id=\"-q5axd4_39\">Start date = first day it applies.</p></li><li class=\"list__item\" id=\"-q5axd4_34\"><p id=\"-q5axd4_40\">Save → generate a test bill and read LBP line.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">Validation mistakes</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-q5axd4_41\"><thead><tr class=\"ijRowHead\" id=\"-q5axd4_42\"><th id=\"-q5axd4_46\"><p>Issue</p></th><th id=\"-q5axd4_47\"><p>Result</p></th></tr></thead><tbody><tr id=\"-q5axd4_43\"><td id=\"-q5axd4_48\"><p>Overlapping dates</p></td><td id=\"-q5axd4_49\"><p>Save may fail — end old rate or fix dates</p></td></tr><tr id=\"-q5axd4_44\"><td id=\"-q5axd4_50\"><p>Rate zero or empty</p></td><td id=\"-q5axd4_51\"><p>Validation error</p></td></tr><tr id=\"-q5axd4_45\"><td id=\"-q5axd4_52\"><p>Inverted rate</p></td><td id=\"-q5axd4_53\"><p>Bills show nonsense LBP — fix with new row</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2><ul class=\"list _bullet\" id=\"-q5axd4_54\"><li class=\"list__item\" id=\"-q5axd4_55\"><p id=\"-q5axd4_58\">Editing last month’s rate after bills issued.</p></li><li class=\"list__item\" id=\"-q5axd4_56\"><p id=\"-q5axd4_59\">Forgetting new rate before monthly generation.</p></li><li class=\"list__item\" id=\"-q5axd4_57\"><p id=\"-q5axd4_60\">Office uses one rate, system has another.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-q5axd4_61\"><thead><tr class=\"ijRowHead\" id=\"-q5axd4_62\"><th id=\"-q5axd4_65\"><p>Problem</p></th><th id=\"-q5axd4_66\"><p>What to try</p></th></tr></thead><tbody><tr id=\"-q5axd4_63\"><td id=\"-q5axd4_67\"><p>Wrong LBP on bill</p></td><td id=\"-q5axd4_68\"><p>Which rate date applies to bill month?</p></td></tr><tr id=\"-q5axd4_64\"><td id=\"-q5axd4_69\"><p>Cannot save</p></td><td id=\"-q5axd4_70\"><p>Check date overlap and required fields</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2><ul class=\"list _bullet\" id=\"-q5axd4_71\"><li class=\"list__item\" id=\"-q5axd4_72\"><p id=\"-q5axd4_75\"><a data-tooltip=\"Define how you charge: fixed monthly amount or by meter (KWH), with prices and fees. Every subscriber must have one model.\" href=\"billing-models.html\" id=\"-q5axd4_76\">Billing Models</a></p></li><li class=\"list__item\" id=\"-q5axd4_73\"><p id=\"-q5axd4_77\"><a data-tooltip=\"Three tools on one screen: see all bills, create special one-off bills, and run monthly generation for many subscribers.\" href=\"bills.html\" id=\"-q5axd4_78\">Bills</a></p></li><li class=\"list__item\" id=\"-q5axd4_74\"><p id=\"-q5axd4_79\"><a data-tooltip=\"This is the main workflow most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.\" href=\"monthly-billing-workflow.html\" id=\"-q5axd4_80\">Monthly billing workflow</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"billing-models.html\">Billing Models</a><a class=\"navigation-links__next\" href=\"bills.html\">Bills</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"-f9znfc_13\">تحديد كيف <span class=\"control\" id=\"-f9znfc_14\">يتحوّل الدولار إلى الليرة</span> (أو أزواج أخرى) على الفواتير عند استخدام أكثر من عملة.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">قبل أن تبدأ</h2><ul class=\"list _bullet\" id=\"-f9znfc_15\"><li class=\"list__item\" id=\"-f9znfc_16\"><p id=\"-f9znfc_17\">تعرف السعر الذي تستخدمه شركتك للفوترة اليوم (حسب سياستكم، وليس بالضرورة كل تقلب في السوق).</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">سير العمل المعتاد</h2><ul class=\"list _bullet\" id=\"-f9znfc_18\"><li class=\"list__item\" id=\"-f9znfc_19\"><p id=\"-f9znfc_21\"><span class=\"control\" id=\"-f9znfc_22\">عند تغيّر السعر:</span> أضف صفاً <span class=\"control\" id=\"-f9znfc_23\">جديداً</span> بتاريخ بداية جديد — لا تعدّل صفوفاً استُخدمت لفواتير قديمة.</p></li><li class=\"list__item\" id=\"-f9znfc_20\"><p id=\"-f9znfc_24\"><span class=\"control\" id=\"-f9znfc_25\">بداية الشهر:</span> تأكد أن السعر يغطي شهر الفاتورة قبل <a data-tooltip=\"ثلاث أدوات في شاشة واحدة: عرض كل الفواتير، إنشاء فواتير استثنائية لمرة واحدة، وتشغيل التوليد الشهري لعدة مشتركين.\" href=\"bills.html\" id=\"-f9znfc_26\">Bill Generation</a>.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">ما تراه على هذه الصفحة</h2><p id=\"-f9znfc_27\">جدول الأسعار؛ <span class=\"control\" id=\"-f9znfc_28\">New</span>؛ <span class=\"control\" id=\"-f9znfc_29\">Currency Rate Details</span> (from، to، rate، dates).</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">خطوة بخطوة</h2><ol class=\"list _decimal\" id=\"-f9znfc_30\" type=\"1\"><li class=\"list__item\" id=\"-f9znfc_31\"><p id=\"-f9znfc_36\">Currency Rates → <span class=\"control\" id=\"-f9znfc_37\">New</span>.</p></li><li class=\"list__item\" id=\"-f9znfc_32\"><p id=\"-f9znfc_38\">From / To (مثلاً USD → LBP).</p></li><li class=\"list__item\" id=\"-f9znfc_33\"><p id=\"-f9znfc_39\">أدخل السعر (تحقق مرتين: 1 USD = X LBP).</p></li><li class=\"list__item\" id=\"-f9znfc_34\"><p id=\"-f9znfc_40\">تاريخ البداية = أول يوم يُطبَّق فيه.</p></li><li class=\"list__item\" id=\"-f9znfc_35\"><p id=\"-f9znfc_41\"><span class=\"control\" id=\"-f9znfc_42\">Save</span> → ولّد فاتورة تجريبية واقرأ سطر LBP.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">أخطاء التحقق</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-f9znfc_43\"><thead><tr class=\"ijRowHead\" id=\"-f9znfc_44\"><th id=\"-f9znfc_48\"><p>المشكلة</p></th><th id=\"-f9znfc_49\"><p>النتيجة</p></th></tr></thead><tbody><tr id=\"-f9znfc_45\"><td id=\"-f9znfc_50\"><p>تواريخ متداخلة</p></td><td id=\"-f9znfc_51\"><p>قد يفشل الحفظ — أنهِ السعر القديم أو صحّح التواريخ</p></td></tr><tr id=\"-f9znfc_46\"><td id=\"-f9znfc_52\"><p>سعر صفر أو فارغ</p></td><td id=\"-f9znfc_53\"><p>خطأ تحقق</p></td></tr><tr id=\"-f9znfc_47\"><td id=\"-f9znfc_54\"><p>سعر معكوس</p></td><td id=\"-f9znfc_55\"><p>LBP بلا معنى على الفاتورة — أضف صفاً جديداً</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"-f9znfc_56\"><li class=\"list__item\" id=\"-f9znfc_57\"><p id=\"-f9znfc_60\">تعديل سعر الشهر الماضي بعد إصدار الفواتير.</p></li><li class=\"list__item\" id=\"-f9znfc_58\"><p id=\"-f9znfc_61\">نسيان سعر جديد قبل التوليد الشهري.</p></li><li class=\"list__item\" id=\"-f9znfc_59\"><p id=\"-f9znfc_62\">المكتب يستخدم سعراً والنظام آخر.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-f9znfc_63\"><thead><tr class=\"ijRowHead\" id=\"-f9znfc_64\"><th id=\"-f9znfc_67\"><p>المشكلة</p></th><th id=\"-f9znfc_68\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"-f9znfc_65\"><td id=\"-f9znfc_69\"><p>LBP خاطئ على الفاتورة</p></td><td id=\"-f9znfc_70\"><p>أي تاريخ سعر ينطبق على شهر الفاتورة؟</p></td></tr><tr id=\"-f9znfc_66\"><td id=\"-f9znfc_71\"><p>لا يمكن الحفظ</p></td><td id=\"-f9znfc_72\"><p>تداخل التواريخ والحقول المطلوبة</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"-f9znfc_73\"><li class=\"list__item\" id=\"-f9znfc_74\"><p id=\"-f9znfc_77\"><a data-tooltip=\"تحديد كيف تُحاسب: مبلغ شهري ثابت أو حسب العداد (KWH)، مع الأسعار والرسوم. كل مشترك يحتاج نموذجاً واحداً.\" href=\"billing-models.html\" id=\"-f9znfc_78\">Billing Models</a></p></li><li class=\"list__item\" id=\"-f9znfc_75\"><p id=\"-f9znfc_79\"><a data-tooltip=\"ثلاث أدوات في شاشة واحدة: عرض كل الفواتير، إنشاء فواتير استثنائية لمرة واحدة، وتشغيل التوليد الشهري لعدة مشتركين.\" href=\"bills.html\" id=\"-f9znfc_80\">Bills</a></p></li><li class=\"list__item\" id=\"-f9znfc_76\"><p id=\"-f9znfc_81\"><a data-tooltip=\"هذا سير العمل الرئيسي الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.\" href=\"monthly-billing-workflow.html\" id=\"-f9znfc_82\">دورة الفوترة الشهرية</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"billing-models.html\">Billing Models</a><a class=\"navigation-links__next\" href=\"bills.html\">Bills</a></div>"
        },
        "keywords": [
            "Billing setup",
            "Currency Rates",
            "currency rates",
            "إعداد الفوترة"
        ]
    },
    {
        "id": "bills",
        "slug": "bills",
        "fileName": "bills.html",
        "title": {
            "en": "Bills",
            "ar": "Bills"
        },
        "group": {
            "en": "Bills and payments",
            "ar": "الفواتير والتحصيل"
        },
        "appRoute": "bills",
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start-prerequisites",
                "title": {
                    "en": "Before you start (prerequisites)",
                    "ar": "قبل أن تبدأ"
                }
            },
            {
                "id": "your-regular-workflow",
                "title": {
                    "en": "Your regular workflow",
                    "ar": "سير العمل المعتاد"
                }
            },
            {
                "id": "what-you-see-on-this-page",
                "title": {
                    "en": "What you see on this page",
                    "ar": "ما تراه على هذه الصفحة"
                }
            },
            {
                "id": "step-by-step-monthly-generation",
                "title": {
                    "en": "Step-by-step: monthly generation",
                    "ar": "خطوة بخطوة: التوليد الشهري"
                }
            },
            {
                "id": "validation-mistakes",
                "title": {
                    "en": "Validation mistakes",
                    "ar": "أخطاء التحقق"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2><p id=\"-ngh1t_12\">Three tools on one screen: <span class=\"control\" id=\"-ngh1t_14\">see all bills</span>, <span class=\"control\" id=\"-ngh1t_15\">create special one-off bills</span>, and <span class=\"control\" id=\"-ngh1t_16\">run monthly generation</span> for many subscribers.</p><aside class=\"prompt\" data-title=\"\" data-type=\"tip\" id=\"-ngh1t_13\"><p id=\"-ngh1t_17\"><span class=\"control\" id=\"-ngh1t_18\">Always follow</span> <a data-tooltip=\"This is the main workflow most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.\" href=\"monthly-billing-workflow.html\" id=\"-ngh1t_19\">Monthly billing workflow</a> — readings first, then generation here.</p></aside></section><section class=\"chapter\"><h2 data-toc=\"before-you-start-prerequisites\" id=\"before-you-start-prerequisites\">Before you start (prerequisites)</h2><ul class=\"list _bullet\" id=\"-ngh1t_20\"><li class=\"list__item\" id=\"-ngh1t_21\"><p id=\"-ngh1t_25\"><a data-tooltip=\"Use this once when you are new to Echtirak, or when you take over an account from someone else. Complete every item before your first real monthly billing run.\" href=\"setup-checklist.html\" id=\"-ngh1t_26\">Setup checklist</a> complete.</p></li><li class=\"list__item\" id=\"-ngh1t_22\"><p id=\"-ngh1t_27\">For <span class=\"control\" id=\"-ngh1t_28\">metered</span> generation: <a data-tooltip=\"History of meter readings for metered subscribers. Used to calculate usage and bills. Check photos when a number looks wrong.\" href=\"kwh-readings.html\" id=\"-ngh1t_29\">KWH Readings</a> entered for this month.</p></li><li class=\"list__item\" id=\"-ngh1t_23\"><p id=\"-ngh1t_30\"><a data-tooltip=\"Set how dollars convert to pounds (or other pairs) on bills when you use more than one currency.\" href=\"currency-rates.html\" id=\"-ngh1t_31\">Currency Rates</a> current if you bill in two currencies.</p></li><li class=\"list__item\" id=\"-ngh1t_24\"><p id=\"-ngh1t_32\">Correct <span class=\"control\" id=\"-ngh1t_33\">year and month</span> selected before you confirm generation.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">Your regular workflow</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-ngh1t_34\"><thead><tr class=\"ijRowHead\" id=\"-ngh1t_35\"><th id=\"-ngh1t_40\"><p>When</p></th><th id=\"-ngh1t_41\"><p>Tab</p></th><th id=\"-ngh1t_42\"><p>Action</p></th></tr></thead><tbody><tr id=\"-ngh1t_36\"><td id=\"-ngh1t_43\"><p>Daily</p></td><td id=\"-ngh1t_44\"><p>Bills List</p></td><td id=\"-ngh1t_45\"><p>Find pending/overdue; print or follow up</p></td></tr><tr id=\"-ngh1t_37\"><td id=\"-ngh1t_46\"><p>Monthly</p></td><td id=\"-ngh1t_47\"><p>Bill Generation</p></td><td id=\"-ngh1t_48\"><p>Metered run, then fixed run, then preview</p></td></tr><tr id=\"-ngh1t_38\"><td id=\"-ngh1t_49\"><p>Rare</p></td><td id=\"-ngh1t_50\"><p>Custom Bill Generation</p></td><td id=\"-ngh1t_51\"><p>One correction or extra charge</p></td></tr><tr id=\"-ngh1t_39\"><td id=\"-ngh1t_52\"><p>After generation</p></td><td id=\"-ngh1t_53\"><p>Bills List</p></td><td id=\"-ngh1t_54\"><p>Spot-check amounts</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">What you see on this page</h2><section class=\"chapter\"><h3 data-toc=\"tab-bills-list\" id=\"tab-bills-list\">Tab: Bills List</h3><p id=\"-ngh1t_58\">Filters, table (subscriber, amount, status, period), actions to view/edit/print/pay (as your role allows), bulk reports.</p></section><section class=\"chapter\"><h3 data-toc=\"tab-custom-bill-generation\" id=\"tab-custom-bill-generation\">Tab: Custom Bill Generation</h3><p id=\"-ngh1t_59\">Pick subscriber and period; add lines and fees; preview once.</p></section><section class=\"chapter\"><h3 data-toc=\"tab-bill-generation\" id=\"tab-bill-generation\">Tab: Bill Generation</h3><ul class=\"list _bullet\" id=\"-ngh1t_60\"><li class=\"list__item\" id=\"-ngh1t_61\"><p id=\"-ngh1t_64\"><span class=\"control\" id=\"-ngh1t_65\">Metered</span> — uses readings.</p></li><li class=\"list__item\" id=\"-ngh1t_62\"><p id=\"-ngh1t_66\"><span class=\"control\" id=\"-ngh1t_67\">Fixed</span> — uses model amount.</p></li><li class=\"list__item\" id=\"-ngh1t_63\"><p id=\"-ngh1t_68\"><span class=\"control\" id=\"-ngh1t_69\">Generated Bills Preview</span> — duplicates warning; confirm only when correct.</p></li></ul></section></section><section class=\"chapter\"><h2 data-toc=\"step-by-step-monthly-generation\" id=\"step-by-step-monthly-generation\">Step-by-step: monthly generation</h2><ol class=\"list _decimal\" id=\"-ngh1t_70\" type=\"1\"><li class=\"list__item\" id=\"-ngh1t_71\"><p id=\"-ngh1t_78\">Complete <a data-tooltip=\"History of meter readings for metered subscribers. Used to calculate usage and bills. Check photos when a number looks wrong.\" href=\"kwh-readings.html\" id=\"-ngh1t_79\">KWH Readings</a> for the month.</p></li><li class=\"list__item\" id=\"-ngh1t_72\"><p id=\"-ngh1t_80\">Bills → <span class=\"control\" id=\"-ngh1t_81\">Bill Generation</span>.</p></li><li class=\"list__item\" id=\"-ngh1t_73\"><p id=\"-ngh1t_82\">Choose <span class=\"control\" id=\"-ngh1t_83\">year/month</span> and <span class=\"control\" id=\"-ngh1t_84\">generator</span> (if asked).</p></li><li class=\"list__item\" id=\"-ngh1t_74\"><p id=\"-ngh1t_85\">Run <span class=\"control\" id=\"-ngh1t_86\">metered</span> → wait for preview → fix duplicates → confirm.</p></li><li class=\"list__item\" id=\"-ngh1t_75\"><p id=\"-ngh1t_87\">Run <span class=\"control\" id=\"-ngh1t_88\">fixed</span> → same checks.</p></li><li class=\"list__item\" id=\"-ngh1t_76\"><p id=\"-ngh1t_89\"><span class=\"control\" id=\"-ngh1t_90\">Bills List</span> → filter that month → sample 5–10 bills manually.</p></li><li class=\"list__item\" id=\"-ngh1t_77\"><p id=\"-ngh1t_91\">Optional: <a data-tooltip=\"Send the same message to many subscribers at once. See past campaigns and open details to check delivery.\" href=\"sms-campaigns.html\" id=\"-ngh1t_92\">SMS Campaigns</a> for “bill ready”.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">Validation mistakes</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-ngh1t_93\"><thead><tr class=\"ijRowHead\" id=\"-ngh1t_94\"><th id=\"-ngh1t_100\"><p>Situation</p></th><th id=\"-ngh1t_101\"><p>What the app may do</p></th></tr></thead><tbody><tr id=\"-ngh1t_95\"><td id=\"-ngh1t_102\"><p>No reading for metered customer</p></td><td id=\"-ngh1t_103\"><p>Skip, zero usage, or error in preview — fix reading first</p></td></tr><tr id=\"-ngh1t_96\"><td id=\"-ngh1t_104\"><p>Duplicate same month</p></td><td id=\"-ngh1t_105\"><p>Warning in preview — do not confirm twice</p></td></tr><tr id=\"-ngh1t_97\"><td id=\"-ngh1t_106\"><p>Inactive subscriber</p></td><td id=\"-ngh1t_107\"><p>Often excluded — do not assume they were billed</p></td></tr><tr id=\"-ngh1t_98\"><td id=\"-ngh1t_108\"><p>Custom bill missing fields</p></td><td id=\"-ngh1t_109\"><p>Red validation — period, subscriber, or amount required</p></td></tr><tr id=\"-ngh1t_99\"><td id=\"-ngh1t_110\"><p>Pay/mark paid wrong state</p></td><td id=\"-ngh1t_111\"><p>Message if bill already paid or collection pending</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2><ul class=\"list _bullet\" id=\"-ngh1t_112\"><li class=\"list__item\" id=\"-ngh1t_113\"><p id=\"-ngh1t_117\">Generating <span class=\"control\" id=\"-ngh1t_118\">before</span> readings.</p></li><li class=\"list__item\" id=\"-ngh1t_114\"><p id=\"-ngh1t_119\">Wrong <span class=\"control\" id=\"-ngh1t_120\">month</span> selected (off by one month is very common).</p></li><li class=\"list__item\" id=\"-ngh1t_115\"><p id=\"-ngh1t_121\">Confirming preview with <span class=\"control\" id=\"-ngh1t_122\">duplicates</span>.</p></li><li class=\"list__item\" id=\"-ngh1t_116\"><p id=\"-ngh1t_123\">Marking paid in app without matching <a data-tooltip=\"Review money your collectors recorded in the field. Approve when correct; reject when wrong. Until you approve, the payment is not final in your reports.\" href=\"bill-collections.html\" id=\"-ngh1t_124\">Bill Collections</a> process your team uses.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-ngh1t_125\"><thead><tr class=\"ijRowHead\" id=\"-ngh1t_126\"><th id=\"-ngh1t_130\"><p>Problem</p></th><th id=\"-ngh1t_131\"><p>What to try</p></th></tr></thead><tbody><tr id=\"-ngh1t_127\"><td id=\"-ngh1t_132\"><p>Empty generation list</p></td><td id=\"-ngh1t_133\"><p>Subscribers inactive; wrong model type tab; wrong generator</p></td></tr><tr id=\"-ngh1t_128\"><td id=\"-ngh1t_134\"><p>Amount too high/low</p></td><td id=\"-ngh1t_135\"><p>Check reading, model price, currency rate</p></td></tr><tr id=\"-ngh1t_129\"><td id=\"-ngh1t_136\"><p>Cannot edit bill</p></td><td id=\"-ngh1t_137\"><p>May be paid or locked — open details for status</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2><ul class=\"list _bullet\" id=\"-ngh1t_138\"><li class=\"list__item\" id=\"-ngh1t_139\"><p id=\"-ngh1t_143\"><a data-tooltip=\"This is the main workflow most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.\" href=\"monthly-billing-workflow.html\" id=\"-ngh1t_144\">Monthly billing workflow</a></p></li><li class=\"list__item\" id=\"-ngh1t_140\"><p id=\"-ngh1t_145\"><a data-tooltip=\"History of meter readings for metered subscribers. Used to calculate usage and bills. Check photos when a number looks wrong.\" href=\"kwh-readings.html\" id=\"-ngh1t_146\">KWH Readings</a></p></li><li class=\"list__item\" id=\"-ngh1t_141\"><p id=\"-ngh1t_147\"><a data-tooltip=\"Review money your collectors recorded in the field. Approve when correct; reject when wrong. Until you approve, the payment is not final in your reports.\" href=\"bill-collections.html\" id=\"-ngh1t_148\">Bill Collections</a></p></li><li class=\"list__item\" id=\"-ngh1t_142\"><p id=\"-ngh1t_149\"><a data-tooltip=\"Define how you charge: fixed monthly amount or by meter (KWH), with prices and fees. Every subscriber must have one model.\" href=\"billing-models.html\" id=\"-ngh1t_150\">Billing Models</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"currency-rates.html\">Currency Rates</a><a class=\"navigation-links__next\" href=\"bill-collections.html\">Bill Collections</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"-y0r9lt_13\">ثلاث أدوات في شاشة واحدة: <span class=\"control\" id=\"-y0r9lt_15\">عرض كل الفواتير</span>، <span class=\"control\" id=\"-y0r9lt_16\">إنشاء فواتير استثنائية لمرة واحدة</span>، و<span class=\"control\" id=\"-y0r9lt_17\">تشغيل التوليد الشهري</span> لعدة مشتركين.</p><aside class=\"prompt\" data-title=\"\" data-type=\"tip\" id=\"-y0r9lt_14\"><p id=\"-y0r9lt_18\"><span class=\"control\" id=\"-y0r9lt_19\">اتبع دائماً</span> <a data-tooltip=\"هذا سير العمل الرئيسي الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.\" href=\"monthly-billing-workflow.html\" id=\"-y0r9lt_20\">دورة الفوترة الشهرية</a> — القراءات أولاً، ثم التوليد هنا.</p></aside></section><section class=\"chapter\"><h2 data-toc=\"before-you-start-prerequisites\" id=\"before-you-start-prerequisites\">قبل أن تبدأ</h2><ul class=\"list _bullet\" id=\"-y0r9lt_21\"><li class=\"list__item\" id=\"-y0r9lt_22\"><p id=\"-y0r9lt_26\"><a data-tooltip=\"استخدمها مرة واحدة عند بدء العمل على Echtirak، أو عند استلام حساب من شخص آخر. أكمل كل بند قبل أول دورة فوترة شهرية حقيقية.\" href=\"setup-checklist.html\" id=\"-y0r9lt_27\">قائمة الإعداد</a> مكتملة.</p></li><li class=\"list__item\" id=\"-y0r9lt_23\"><p id=\"-y0r9lt_28\">لتوليد <span class=\"control\" id=\"-y0r9lt_29\">metered</span>: <a data-tooltip=\"سجل قراءات العداد للمشتركين metered. تُستخدم لحساب الاستهلاك والفواتير. راجع الصور عندما يبدو الرقم غريباً.\" href=\"kwh-readings.html\" id=\"-y0r9lt_30\">KWH Readings</a> مدخلة لهذا الشهر.</p></li><li class=\"list__item\" id=\"-y0r9lt_24\"><p id=\"-y0r9lt_31\"><a data-tooltip=\"تحديد كيف يتحوّل الدولار إلى الليرة (أو أزواج أخرى) على الفواتير عند استخدام أكثر من عملة.\" href=\"currency-rates.html\" id=\"-y0r9lt_32\">Currency Rates</a> محدّثة إن فوّرت بعملتين.</p></li><li class=\"list__item\" id=\"-y0r9lt_25\"><p id=\"-y0r9lt_33\"><span class=\"control\" id=\"-y0r9lt_34\">year</span> و <span class=\"control\" id=\"-y0r9lt_35\">month</span> صحيحان قبل التأكيد.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">سير العمل المعتاد</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-y0r9lt_36\"><thead><tr class=\"ijRowHead\" id=\"-y0r9lt_37\"><th id=\"-y0r9lt_42\"><p>متى</p></th><th id=\"-y0r9lt_43\"><p>التبويب</p></th><th id=\"-y0r9lt_44\"><p>الإجراء</p></th></tr></thead><tbody><tr id=\"-y0r9lt_38\"><td id=\"-y0r9lt_45\"><p>يومياً</p></td><td id=\"-y0r9lt_46\"><p>Bills List</p></td><td id=\"-y0r9lt_47\"><p>ابحث pending/overdue؛ اطبع أو تابع</p></td></tr><tr id=\"-y0r9lt_39\"><td id=\"-y0r9lt_48\"><p>شهرياً</p></td><td id=\"-y0r9lt_49\"><p>Bill Generation</p></td><td id=\"-y0r9lt_50\"><p>تشغيل metered ثم fixed ثم preview</p></td></tr><tr id=\"-y0r9lt_40\"><td id=\"-y0r9lt_51\"><p>نادراً</p></td><td id=\"-y0r9lt_52\"><p>Custom Bill Generation</p></td><td id=\"-y0r9lt_53\"><p>تصحيح أو رسوم إضافية لمرة واحدة</p></td></tr><tr id=\"-y0r9lt_41\"><td id=\"-y0r9lt_54\"><p>بعد التوليد</p></td><td id=\"-y0r9lt_55\"><p>Bills List</p></td><td id=\"-y0r9lt_56\"><p>راجع عينة من المبالغ</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">ما تراه على هذه الصفحة</h2><section class=\"chapter\"><h3 data-toc=\"bills-list\" id=\"bills-list\">تبويب: Bills List</h3><p id=\"-y0r9lt_60\">فلاتر، جدول (subscriber، amount، status، period)، إجراءات عرض/تعديل/طباعة/دفع (حسب دورك)، تقارير جماعية.</p></section><section class=\"chapter\"><h3 data-toc=\"custom-bill-generation\" id=\"custom-bill-generation\">تبويب: Custom Bill Generation</h3><p id=\"-y0r9lt_61\">اختر مشتركاً وفترة؛ أضف بنوداً ورسوماً؛ معاينة مرة واحدة.</p></section><section class=\"chapter\"><h3 data-toc=\"bill-generation\" id=\"bill-generation\">تبويب: Bill Generation</h3><ul class=\"list _bullet\" id=\"-y0r9lt_62\"><li class=\"list__item\" id=\"-y0r9lt_63\"><p id=\"-y0r9lt_66\"><span class=\"control\" id=\"-y0r9lt_67\">Metered</span> — يستخدم القراءات.</p></li><li class=\"list__item\" id=\"-y0r9lt_64\"><p id=\"-y0r9lt_68\"><span class=\"control\" id=\"-y0r9lt_69\">Fixed</span> — يستخدم مبلغ النموذج.</p></li><li class=\"list__item\" id=\"-y0r9lt_65\"><p id=\"-y0r9lt_70\"><span class=\"control\" id=\"-y0r9lt_71\">Generated Bills Preview</span> — تحذير تكرار؛ أكّد فقط عند الصحة.</p></li></ul></section></section><section class=\"chapter\"><h2 data-toc=\"step-by-step-monthly-generation\" id=\"step-by-step-monthly-generation\">خطوة بخطوة: التوليد الشهري</h2><ol class=\"list _decimal\" id=\"-y0r9lt_72\" type=\"1\"><li class=\"list__item\" id=\"-y0r9lt_73\"><p id=\"-y0r9lt_80\">أكمل <a data-tooltip=\"سجل قراءات العداد للمشتركين metered. تُستخدم لحساب الاستهلاك والفواتير. راجع الصور عندما يبدو الرقم غريباً.\" href=\"kwh-readings.html\" id=\"-y0r9lt_81\">KWH Readings</a> للشهر.</p></li><li class=\"list__item\" id=\"-y0r9lt_74\"><p id=\"-y0r9lt_82\">Bills → <span class=\"control\" id=\"-y0r9lt_83\">Bill Generation</span>.</p></li><li class=\"list__item\" id=\"-y0r9lt_75\"><p id=\"-y0r9lt_84\">اختر <span class=\"control\" id=\"-y0r9lt_85\">year/month</span> و <span class=\"control\" id=\"-y0r9lt_86\">generator</span> (إن طُلب).</p></li><li class=\"list__item\" id=\"-y0r9lt_76\"><p id=\"-y0r9lt_87\">شغّل <span class=\"control\" id=\"-y0r9lt_88\">metered</span> → انتظر preview → عالج التكرار → أكّد.</p></li><li class=\"list__item\" id=\"-y0r9lt_77\"><p id=\"-y0r9lt_89\">شغّل <span class=\"control\" id=\"-y0r9lt_90\">fixed</span> → نفس الفحوصات.</p></li><li class=\"list__item\" id=\"-y0r9lt_78\"><p id=\"-y0r9lt_91\"><span class=\"control\" id=\"-y0r9lt_92\">Bills List</span> → فلتر ذلك الشهر → راجع 5–10 فواتير يدوياً.</p></li><li class=\"list__item\" id=\"-y0r9lt_79\"><p id=\"-y0r9lt_93\">اختياري: <a data-tooltip=\"إرسال نفس الرسالة إلى عدة مشتركين دفعة واحدة. اعرض الحملات السابقة وافتح التفاصيل للتحقق من التسليم.\" href=\"sms-campaigns.html\" id=\"-y0r9lt_94\">SMS Campaigns</a> لـ «الفاتورة جاهزة».</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">أخطاء التحقق</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-y0r9lt_95\"><thead><tr class=\"ijRowHead\" id=\"-y0r9lt_96\"><th id=\"-y0r9lt_102\"><p>الحالة</p></th><th id=\"-y0r9lt_103\"><p>ما قد يفعل التطبيق</p></th></tr></thead><tbody><tr id=\"-y0r9lt_97\"><td id=\"-y0r9lt_104\"><p>لا قراءة لعميل metered</p></td><td id=\"-y0r9lt_105\"><p>تخطي، استهلاك صفر، أو خطأ في preview — صحّح القراءة أولاً</p></td></tr><tr id=\"-y0r9lt_98\"><td id=\"-y0r9lt_106\"><p>تكرار نفس الشهر</p></td><td id=\"-y0r9lt_107\"><p>تحذير في preview — لا تؤكد مرتين</p></td></tr><tr id=\"-y0r9lt_99\"><td id=\"-y0r9lt_108\"><p>مشترك inactive</p></td><td id=\"-y0r9lt_109\"><p>غالباً يُستبعد — لا تفترض أنه فُوتر</p></td></tr><tr id=\"-y0r9lt_100\"><td id=\"-y0r9lt_110\"><p>فاتورة مخصصة ناقصة</p></td><td id=\"-y0r9lt_111\"><p>تحقق أحمر — period أو subscriber أو amount مطلوب</p></td></tr><tr id=\"-y0r9lt_101\"><td id=\"-y0r9lt_112\"><p>دفع/تعليم paid بحالة خاطئة</p></td><td id=\"-y0r9lt_113\"><p>رسالة إن الفاتورة paid أو collection معلّق</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"-y0r9lt_114\"><li class=\"list__item\" id=\"-y0r9lt_115\"><p id=\"-y0r9lt_119\">التوليد <span class=\"control\" id=\"-y0r9lt_120\">قبل</span> القراءات.</p></li><li class=\"list__item\" id=\"-y0r9lt_116\"><p id=\"-y0r9lt_121\"><span class=\"control\" id=\"-y0r9lt_122\">شهر</span> خاطئ (خطأ شهر واحد شائع جداً).</p></li><li class=\"list__item\" id=\"-y0r9lt_117\"><p id=\"-y0r9lt_123\">تأكيد preview مع <span class=\"control\" id=\"-y0r9lt_124\">تكرارات</span>.</p></li><li class=\"list__item\" id=\"-y0r9lt_118\"><p id=\"-y0r9lt_125\">تعليم paid في التطبيق دون مطابقة عملية <a data-tooltip=\"مراجعة الأموال التي سجّلها الجامعون في الميدان. Approve إن كانت صحيحة؛ Reject إن كانت خاطئة. حتى تعتمد، الدفعة غير نهائية في تقاريرك.\" href=\"bill-collections.html\" id=\"-y0r9lt_126\">Bill Collections</a>.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-y0r9lt_127\"><thead><tr class=\"ijRowHead\" id=\"-y0r9lt_128\"><th id=\"-y0r9lt_132\"><p>المشكلة</p></th><th id=\"-y0r9lt_133\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"-y0r9lt_129\"><td id=\"-y0r9lt_134\"><p>قائمة التوليد فارغة</p></td><td id=\"-y0r9lt_135\"><p>مشتركون inactive؛ تبويب نوع خاطئ؛ generator خاطئ</p></td></tr><tr id=\"-y0r9lt_130\"><td id=\"-y0r9lt_136\"><p>مبلغ مرتفع/منخفض جداً</p></td><td id=\"-y0r9lt_137\"><p>القراءة، سعر النموذج، سعر العملة</p></td></tr><tr id=\"-y0r9lt_131\"><td id=\"-y0r9lt_138\"><p>لا أستطيع تعديل الفاتورة</p></td><td id=\"-y0r9lt_139\"><p>قد تكون paid أو مقفلة — افتح التفاصيل للحالة</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"-y0r9lt_140\"><li class=\"list__item\" id=\"-y0r9lt_141\"><p id=\"-y0r9lt_145\"><a data-tooltip=\"هذا سير العمل الرئيسي الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.\" href=\"monthly-billing-workflow.html\" id=\"-y0r9lt_146\">دورة الفوترة الشهرية</a></p></li><li class=\"list__item\" id=\"-y0r9lt_142\"><p id=\"-y0r9lt_147\"><a data-tooltip=\"سجل قراءات العداد للمشتركين metered. تُستخدم لحساب الاستهلاك والفواتير. راجع الصور عندما يبدو الرقم غريباً.\" href=\"kwh-readings.html\" id=\"-y0r9lt_148\">KWH Readings</a></p></li><li class=\"list__item\" id=\"-y0r9lt_143\"><p id=\"-y0r9lt_149\"><a data-tooltip=\"مراجعة الأموال التي سجّلها الجامعون في الميدان. Approve إن كانت صحيحة؛ Reject إن كانت خاطئة. حتى تعتمد، الدفعة غير نهائية في تقاريرك.\" href=\"bill-collections.html\" id=\"-y0r9lt_150\">Bill Collections</a></p></li><li class=\"list__item\" id=\"-y0r9lt_144\"><p id=\"-y0r9lt_151\"><a data-tooltip=\"تحديد كيف تُحاسب: مبلغ شهري ثابت أو حسب العداد (KWH)، مع الأسعار والرسوم. كل مشترك يحتاج نموذجاً واحداً.\" href=\"billing-models.html\" id=\"-y0r9lt_152\">Billing Models</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"currency-rates.html\">Currency Rates</a><a class=\"navigation-links__next\" href=\"bill-collections.html\">Bill Collections</a></div>"
        },
        "keywords": [
            "Bills",
            "Bills and payments",
            "bills",
            "الفواتير والتحصيل"
        ]
    },
    {
        "id": "bill-collections",
        "slug": "bill-collections",
        "fileName": "bill-collections.html",
        "title": {
            "en": "Bill Collections",
            "ar": "Bill Collections"
        },
        "group": {
            "en": "Bills and payments",
            "ar": "الفواتير والتحصيل"
        },
        "appRoute": "bill-collections",
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start",
                "title": {
                    "en": "Before you start",
                    "ar": "قبل أن تبدأ"
                }
            },
            {
                "id": "your-regular-workflow-daily",
                "title": {
                    "en": "Your regular workflow (daily)",
                    "ar": "سير العمل اليومي"
                }
            },
            {
                "id": "what-you-see-on-this-page",
                "title": {
                    "en": "What you see on this page",
                    "ar": "ما تراه على هذه الصفحة"
                }
            },
            {
                "id": "step-by-step-approve-one-payment",
                "title": {
                    "en": "Step-by-step: approve one payment",
                    "ar": "خطوة بخطوة: اعتماد دفعة واحدة"
                }
            },
            {
                "id": "validation-mistakes",
                "title": {
                    "en": "Validation mistakes",
                    "ar": "أخطاء التحقق"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2><p id=\"-maeva8_12\">Review money your <span class=\"control\" id=\"-maeva8_13\">collectors</span> recorded in the field. <span class=\"control\" id=\"-maeva8_14\">Approve</span> when correct; <span class=\"control\" id=\"-maeva8_15\">reject</span> when wrong. Until you approve, the payment is not final in your reports.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">Before you start</h2><ul class=\"list _bullet\" id=\"-maeva8_16\"><li class=\"list__item\" id=\"-maeva8_17\"><p id=\"-maeva8_20\">Collectors submitted collections from their app.</p></li><li class=\"list__item\" id=\"-maeva8_18\"><p id=\"-maeva8_21\">You know the <span class=\"control\" id=\"-maeva8_22\">bill reference</span> or date range to search.</p></li><li class=\"list__item\" id=\"-maeva8_19\"><p id=\"-maeva8_23\">You understand your rule: approve same day vs batch weekly (pick one habit and keep it).</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow-daily\" id=\"your-regular-workflow-daily\">Your regular workflow (daily)</h2><ol class=\"list _decimal\" id=\"-maeva8_24\" type=\"1\"><li class=\"list__item\" id=\"-maeva8_26\"><p id=\"-maeva8_32\">Open <span class=\"control\" id=\"-maeva8_33\">Bill Collections</span> (or click from Dashboard <span class=\"control\" id=\"-maeva8_34\">Collections To Review</span>).</p></li><li class=\"list__item\" id=\"-maeva8_27\"><p id=\"-maeva8_35\">Set <span class=\"control\" id=\"-maeva8_36\">Collection Status</span> = pending.</p></li><li class=\"list__item\" id=\"-maeva8_28\"><p id=\"-maeva8_37\">Set <span class=\"control\" id=\"-maeva8_38\">Created From / To</span> to this week (or today).</p></li><li class=\"list__item\" id=\"-maeva8_29\"><p id=\"-maeva8_39\">For each row: open <span class=\"control\" id=\"-maeva8_40\">bill preview</span> → check name, amount, bill month.</p></li><li class=\"list__item\" id=\"-maeva8_30\"><p id=\"-maeva8_41\"><span class=\"control\" id=\"-maeva8_42\">Approve</span> or <span class=\"control\" id=\"-maeva8_43\">Reject</span> — tell collector on reject.</p></li><li class=\"list__item\" id=\"-maeva8_31\"><p id=\"-maeva8_44\">Refresh <a data-tooltip=\"Your control room. See subscribers, money, bills, collections, and wallet at a glance. Use it to decide what to do first each day.\" href=\"dashboard.html\" id=\"-maeva8_45\">Dashboard</a>.</p></li></ol><aside class=\"prompt\" data-title=\"\" data-type=\"tip\" id=\"-maeva8_25\"><p id=\"-maeva8_46\"><span class=\"control\" id=\"-maeva8_47\">Rule:</span> Never approve in bulk without opening previews if your team is new.</p></aside></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">What you see on this page</h2><section class=\"chapter\"><h3 data-toc=\"filters\" id=\"filters\">Filters</h3><div class=\"table-wrapper\"><table class=\"wide\" id=\"-maeva8_50\"><thead><tr class=\"ijRowHead\" id=\"-maeva8_51\"><th id=\"-maeva8_57\"><p>Filter</p></th><th id=\"-maeva8_58\"><p>Use</p></th></tr></thead><tbody><tr id=\"-maeva8_52\"><td id=\"-maeva8_59\"><p>Bill Reference</p></td><td id=\"-maeva8_60\"><p>One specific bill</p></td></tr><tr id=\"-maeva8_53\"><td id=\"-maeva8_61\"><p>Bill Collector</p></td><td id=\"-maeva8_62\"><p>One person’s submissions</p></td></tr><tr id=\"-maeva8_54\"><td id=\"-maeva8_63\"><p>Collection Status</p></td><td id=\"-maeva8_64\"><p>Pending / approved / rejected</p></td></tr><tr id=\"-maeva8_55\"><td id=\"-maeva8_65\"><p>Record Status</p></td><td id=\"-maeva8_66\"><p>Active vs cancelled</p></td></tr><tr id=\"-maeva8_56\"><td id=\"-maeva8_67\"><p>Created From / To</p></td><td id=\"-maeva8_68\"><p>Date range — widen if list empty</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h3 data-toc=\"table-and-actions\" id=\"table-and-actions\">Table and actions</h3><p id=\"-maeva8_69\">Subscriber, bill, amount, collector, status, dates. <span class=\"control\" id=\"-maeva8_70\">Approve</span>, <span class=\"control\" id=\"-maeva8_71\">Reject</span>, view bill (read-only).</p></section></section><section class=\"chapter\"><h2 data-toc=\"step-by-step-approve-one-payment\" id=\"step-by-step-approve-one-payment\">Step-by-step: approve one payment</h2><ol class=\"list _decimal\" id=\"-maeva8_72\" type=\"1\"><li class=\"list__item\" id=\"-maeva8_73\"><p id=\"-maeva8_77\">Find pending row.</p></li><li class=\"list__item\" id=\"-maeva8_74\"><p id=\"-maeva8_78\">Open bill preview — subscriber name matches cash payer? Amount matches cash? Bill month correct?</p></li><li class=\"list__item\" id=\"-maeva8_75\"><p id=\"-maeva8_79\">Click <span class=\"control\" id=\"-maeva8_80\">Approve</span>.</p></li><li class=\"list__item\" id=\"-maeva8_76\"><p id=\"-maeva8_81\">Confirm bill status moves toward paid on <a data-tooltip=\"Three tools on one screen: see all bills, create special one-off bills, and run monthly generation for many subscribers.\" href=\"bills.html\" id=\"-maeva8_82\">Bills</a>.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">Validation mistakes</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-maeva8_83\"><thead><tr class=\"ijRowHead\" id=\"-maeva8_84\"><th id=\"-maeva8_89\"><p>Action</p></th><th id=\"-maeva8_90\"><p>App may block if…</p></th></tr></thead><tbody><tr id=\"-maeva8_85\"><td id=\"-maeva8_91\"><p>Approve</p></td><td id=\"-maeva8_92\"><p>Bill already fully paid</p></td></tr><tr id=\"-maeva8_86\"><td id=\"-maeva8_93\"><p>Approve</p></td><td id=\"-maeva8_94\"><p>Amount mismatch with bill rules</p></td></tr><tr id=\"-maeva8_87\"><td id=\"-maeva8_95\"><p>Reject</p></td><td id=\"-maeva8_96\"><p>Already final — use correct process to reverse</p></td></tr><tr id=\"-maeva8_88\"><td id=\"-maeva8_97\"><p>Search</p></td><td id=\"-maeva8_98\"><p>Bill reference typo — no rows</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2><ul class=\"list _bullet\" id=\"-maeva8_99\"><li class=\"list__item\" id=\"-maeva8_100\"><p id=\"-maeva8_104\">Approving <span class=\"control\" id=\"-maeva8_105\">wrong amount</span> because preview was skipped.</p></li><li class=\"list__item\" id=\"-maeva8_101\"><p id=\"-maeva8_106\"><span class=\"control\" id=\"-maeva8_107\">Narrow dates</span> — “no pending” but items are last week.</p></li><li class=\"list__item\" id=\"-maeva8_102\"><p id=\"-maeva8_108\"><span class=\"control\" id=\"-maeva8_109\">Double approve</span> two collections for one bill.</p></li><li class=\"list__item\" id=\"-maeva8_103\"><p id=\"-maeva8_110\">Reject without telling collector — they resubmit the same error.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-maeva8_111\"><thead><tr class=\"ijRowHead\" id=\"-maeva8_112\"><th id=\"-maeva8_116\"><p>Problem</p></th><th id=\"-maeva8_117\"><p>What to try</p></th></tr></thead><tbody><tr id=\"-maeva8_113\"><td id=\"-maeva8_118\"><p>Collector says submitted, you see nothing</p></td><td id=\"-maeva8_119\"><p>All collectors; wider dates; clear bill reference</p></td></tr><tr id=\"-maeva8_114\"><td id=\"-maeva8_120\"><p>Cannot approve</p></td><td id=\"-maeva8_121\"><p>Open bill — may be paid or cancelled</p></td></tr><tr id=\"-maeva8_115\"><td id=\"-maeva8_122\"><p>Dashboard revenue wrong</p></td><td id=\"-maeva8_123\"><p>Count only <span class=\"control\" id=\"-maeva8_124\">approved</span> collections</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2><ul class=\"list _bullet\" id=\"-maeva8_125\"><li class=\"list__item\" id=\"-maeva8_126\"><p id=\"-maeva8_130\"><a data-tooltip=\"This is the main workflow most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.\" href=\"monthly-billing-workflow.html\" id=\"-maeva8_131\">Monthly billing workflow</a></p></li><li class=\"list__item\" id=\"-maeva8_127\"><p id=\"-maeva8_132\"><a data-tooltip=\"Your control room. See subscribers, money, bills, collections, and wallet at a glance. Use it to decide what to do first each day.\" href=\"dashboard.html\" id=\"-maeva8_133\">Dashboard</a></p></li><li class=\"list__item\" id=\"-maeva8_128\"><p id=\"-maeva8_134\"><a data-tooltip=\"Create accounts for field staff who record readings and payments. Control which generators each person can see.\" href=\"bill-collectors.html\" id=\"-maeva8_135\">Bill Collectors</a></p></li><li class=\"list__item\" id=\"-maeva8_129\"><p id=\"-maeva8_136\"><a data-tooltip=\"Three tools on one screen: see all bills, create special one-off bills, and run monthly generation for many subscribers.\" href=\"bills.html\" id=\"-maeva8_137\">Bills</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"bills.html\">Bills</a><a class=\"navigation-links__next\" href=\"kwh-readings.html\">KWH Readings</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"-hxymz4_13\">مراجعة الأموال التي سجّلها <span class=\"control\" id=\"-hxymz4_14\">الجامعون</span> في الميدان. <span class=\"control\" id=\"-hxymz4_15\">Approve</span> إن كانت صحيحة؛ <span class=\"control\" id=\"-hxymz4_16\">Reject</span> إن كانت خاطئة. حتى تعتمد، الدفعة غير نهائية في تقاريرك.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">قبل أن تبدأ</h2><ul class=\"list _bullet\" id=\"-hxymz4_17\"><li class=\"list__item\" id=\"-hxymz4_18\"><p id=\"-hxymz4_21\">الجامعون أرسلوا التحصيلات من تطبيقهم.</p></li><li class=\"list__item\" id=\"-hxymz4_19\"><p id=\"-hxymz4_22\">تعرف <span class=\"control\" id=\"-hxymz4_23\">bill reference</span> أو نطاق التاريخ للبحث.</p></li><li class=\"list__item\" id=\"-hxymz4_20\"><p id=\"-hxymz4_24\">لديك قاعدة: اعتماد يومي أم أسبوعي (اختر عادة واحدة والتزم بها).</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow-daily\" id=\"your-regular-workflow-daily\">سير العمل اليومي</h2><ol class=\"list _decimal\" id=\"-hxymz4_25\" type=\"1\"><li class=\"list__item\" id=\"-hxymz4_27\"><p id=\"-hxymz4_33\">افتح <span class=\"control\" id=\"-hxymz4_34\">Bill Collections</span> (أو من <span class=\"control\" id=\"-hxymz4_35\">Collections To Review</span> في Dashboard).</p></li><li class=\"list__item\" id=\"-hxymz4_28\"><p id=\"-hxymz4_36\"><span class=\"control\" id=\"-hxymz4_37\">Collection Status</span> = pending.</p></li><li class=\"list__item\" id=\"-hxymz4_29\"><p id=\"-hxymz4_38\"><span class=\"control\" id=\"-hxymz4_39\">Created From / To</span> لهذا الأسبوع (أو اليوم).</p></li><li class=\"list__item\" id=\"-hxymz4_30\"><p id=\"-hxymz4_40\">لكل صف: افتح <span class=\"control\" id=\"-hxymz4_41\">bill preview</span> → تحقق من الاسم والمبلغ وشهر الفاتورة.</p></li><li class=\"list__item\" id=\"-hxymz4_31\"><p id=\"-hxymz4_42\"><span class=\"control\" id=\"-hxymz4_43\">Approve</span> أو <span class=\"control\" id=\"-hxymz4_44\">Reject</span> — أخبر الجامع عند الرفض.</p></li><li class=\"list__item\" id=\"-hxymz4_32\"><p id=\"-hxymz4_45\">حدّث <a data-tooltip=\"غرفة التحكم لديك. ترى المشتركين والأموال والفواتير والتحصيل والـ wallet بنظرة واحدة. استخدمها لتحديد ماذا تفعل أولاً كل يوم.\" href=\"dashboard.html\" id=\"-hxymz4_46\">Dashboard</a>.</p></li></ol><aside class=\"prompt\" data-title=\"\" data-type=\"tip\" id=\"-hxymz4_26\"><p id=\"-hxymz4_47\"><span class=\"control\" id=\"-hxymz4_48\">قاعدة:</span> لا تعتمد جماعياً دون معاينة إن كان الفريق جديداً.</p></aside></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">ما تراه على هذه الصفحة</h2><section class=\"chapter\"><h3 data-toc=\"-hxymz4_49\" id=\"-hxymz4_49\">الفلاتر</h3><div class=\"table-wrapper\"><table class=\"wide\" id=\"-hxymz4_51\"><thead><tr class=\"ijRowHead\" id=\"-hxymz4_52\"><th id=\"-hxymz4_58\"><p>الفلتر</p></th><th id=\"-hxymz4_59\"><p>الاستخدام</p></th></tr></thead><tbody><tr id=\"-hxymz4_53\"><td id=\"-hxymz4_60\"><p>Bill Reference</p></td><td id=\"-hxymz4_61\"><p>فاتورة محددة</p></td></tr><tr id=\"-hxymz4_54\"><td id=\"-hxymz4_62\"><p>Bill Collector</p></td><td id=\"-hxymz4_63\"><p>إرسالات شخص واحد</p></td></tr><tr id=\"-hxymz4_55\"><td id=\"-hxymz4_64\"><p>Collection Status</p></td><td id=\"-hxymz4_65\"><p>Pending / approved / rejected</p></td></tr><tr id=\"-hxymz4_56\"><td id=\"-hxymz4_66\"><p>Record Status</p></td><td id=\"-hxymz4_67\"><p>Active مقابل ملغى</p></td></tr><tr id=\"-hxymz4_57\"><td id=\"-hxymz4_68\"><p>Created From / To</p></td><td id=\"-hxymz4_69\"><p>نطاق التاريخ — وسّعه إن كانت القائمة فارغة</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h3 data-toc=\"-hxymz4_50\" id=\"-hxymz4_50\">الجدول والإجراءات</h3><p id=\"-hxymz4_70\">Subscriber، bill، amount، collector، status، dates. <span class=\"control\" id=\"-hxymz4_71\">Approve</span>، <span class=\"control\" id=\"-hxymz4_72\">Reject</span>، عرض الفاتورة (للقراءة فقط).</p></section></section><section class=\"chapter\"><h2 data-toc=\"step-by-step-approve-one-payment\" id=\"step-by-step-approve-one-payment\">خطوة بخطوة: اعتماد دفعة واحدة</h2><ol class=\"list _decimal\" id=\"-hxymz4_73\" type=\"1\"><li class=\"list__item\" id=\"-hxymz4_74\"><p id=\"-hxymz4_78\">ابحث عن صف pending.</p></li><li class=\"list__item\" id=\"-hxymz4_75\"><p id=\"-hxymz4_79\">افتح معاينة الفاتورة — الاسم يطابق من دفع؟ المبلغ يطابق النقد؟ شهر الفاتورة صحيح؟</p></li><li class=\"list__item\" id=\"-hxymz4_76\"><p id=\"-hxymz4_80\">اضغط <span class=\"control\" id=\"-hxymz4_81\">Approve</span>.</p></li><li class=\"list__item\" id=\"-hxymz4_77\"><p id=\"-hxymz4_82\">تأكد أن حالة الفاتورة تتجه إلى paid في <a data-tooltip=\"ثلاث أدوات في شاشة واحدة: عرض كل الفواتير، إنشاء فواتير استثنائية لمرة واحدة، وتشغيل التوليد الشهري لعدة مشتركين.\" href=\"bills.html\" id=\"-hxymz4_83\">Bills</a>.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">أخطاء التحقق</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-hxymz4_84\"><thead><tr class=\"ijRowHead\" id=\"-hxymz4_85\"><th id=\"-hxymz4_90\"><p>الإجراء</p></th><th id=\"-hxymz4_91\"><p>التطبيق قد يمنع إذا…</p></th></tr></thead><tbody><tr id=\"-hxymz4_86\"><td id=\"-hxymz4_92\"><p>Approve</p></td><td id=\"-hxymz4_93\"><p>الفاتورة paid بالكامل مسبقاً</p></td></tr><tr id=\"-hxymz4_87\"><td id=\"-hxymz4_94\"><p>Approve</p></td><td id=\"-hxymz4_95\"><p>المبلغ لا يطابق قواعد الفاتورة</p></td></tr><tr id=\"-hxymz4_88\"><td id=\"-hxymz4_96\"><p>Reject</p></td><td id=\"-hxymz4_97\"><p>الحالة نهائية — استخدم عملية الإلغاء الصحيحة</p></td></tr><tr id=\"-hxymz4_89\"><td id=\"-hxymz4_98\"><p>بحث</p></td><td id=\"-hxymz4_99\"><p>خطأ في bill reference — لا صفوف</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"-hxymz4_100\"><li class=\"list__item\" id=\"-hxymz4_101\"><p id=\"-hxymz4_105\">اعتماد <span class=\"control\" id=\"-hxymz4_106\">مبلغ خاطئ</span> لأن المعاينة تُخطئ.</p></li><li class=\"list__item\" id=\"-hxymz4_102\"><p id=\"-hxymz4_107\"><span class=\"control\" id=\"-hxymz4_108\">تواريخ ضيقة</span> — «لا يوجد pending» والعناصر من الأسبوع الماضي.</p></li><li class=\"list__item\" id=\"-hxymz4_103\"><p id=\"-hxymz4_109\"><span class=\"control\" id=\"-hxymz4_110\">اعتماد مزدوج</span> لنفس الفاتورة.</p></li><li class=\"list__item\" id=\"-hxymz4_104\"><p id=\"-hxymz4_111\">رفض دون إخبار الجامع — يعيد نفس الخطأ.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-hxymz4_112\"><thead><tr class=\"ijRowHead\" id=\"-hxymz4_113\"><th id=\"-hxymz4_117\"><p>المشكلة</p></th><th id=\"-hxymz4_118\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"-hxymz4_114\"><td id=\"-hxymz4_119\"><p>الجامع يقول أرسل ولا ترى شيئاً</p></td><td id=\"-hxymz4_120\"><p>كل الجامعين؛ وسّع التواريخ؛ امسح bill reference</p></td></tr><tr id=\"-hxymz4_115\"><td id=\"-hxymz4_121\"><p>لا أستطيع Approve</p></td><td id=\"-hxymz4_122\"><p>افتح الفاتورة — قد تكون paid أو ملغاة</p></td></tr><tr id=\"-hxymz4_116\"><td id=\"-hxymz4_123\"><p>إيراد Dashboard خاطئ</p></td><td id=\"-hxymz4_124\"><p>احسب فقط التحصيلات <span class=\"control\" id=\"-hxymz4_125\">approved</span></p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"-hxymz4_126\"><li class=\"list__item\" id=\"-hxymz4_127\"><p id=\"-hxymz4_131\"><a data-tooltip=\"هذا سير العمل الرئيسي الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.\" href=\"monthly-billing-workflow.html\" id=\"-hxymz4_132\">دورة الفوترة الشهرية</a></p></li><li class=\"list__item\" id=\"-hxymz4_128\"><p id=\"-hxymz4_133\"><a data-tooltip=\"غرفة التحكم لديك. ترى المشتركين والأموال والفواتير والتحصيل والـ wallet بنظرة واحدة. استخدمها لتحديد ماذا تفعل أولاً كل يوم.\" href=\"dashboard.html\" id=\"-hxymz4_134\">Dashboard</a></p></li><li class=\"list__item\" id=\"-hxymz4_129\"><p id=\"-hxymz4_135\"><a data-tooltip=\"إنشاء حسابات الموظفين الميدانيين الذين يسجلون القراءات والمدفوعات. تحكم بأي generators يرى كل شخص.\" href=\"bill-collectors.html\" id=\"-hxymz4_136\">Bill Collectors</a></p></li><li class=\"list__item\" id=\"-hxymz4_130\"><p id=\"-hxymz4_137\"><a data-tooltip=\"ثلاث أدوات في شاشة واحدة: عرض كل الفواتير، إنشاء فواتير استثنائية لمرة واحدة، وتشغيل التوليد الشهري لعدة مشتركين.\" href=\"bills.html\" id=\"-hxymz4_138\">Bills</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"bills.html\">Bills</a><a class=\"navigation-links__next\" href=\"kwh-readings.html\">KWH Readings</a></div>"
        },
        "keywords": [
            "Bill Collections",
            "Bills and payments",
            "bill collections",
            "الفواتير والتحصيل"
        ]
    },
    {
        "id": "kwh-readings",
        "slug": "kwh-readings",
        "fileName": "kwh-readings.html",
        "title": {
            "en": "KWH Readings",
            "ar": "KWH Readings"
        },
        "group": {
            "en": "Bills and payments",
            "ar": "الفواتير والتحصيل"
        },
        "appRoute": "kva-reading-history",
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start",
                "title": {
                    "en": "Before you start",
                    "ar": "قبل أن تبدأ"
                }
            },
            {
                "id": "your-regular-workflow-monthly-phase-1",
                "title": {
                    "en": "Your regular workflow (monthly — Phase 1)",
                    "ar": "سير العمل الشهري (المرحلة 1)"
                }
            },
            {
                "id": "what-you-see-on-this-page",
                "title": {
                    "en": "What you see on this page",
                    "ar": "ما تراه على هذه الصفحة"
                }
            },
            {
                "id": "step-by-step-verify-one-reading",
                "title": {
                    "en": "Step-by-step: verify one reading",
                    "ar": "خطوة بخطوة: التحقق من قراءة واحدة"
                }
            },
            {
                "id": "validation-mistakes",
                "title": {
                    "en": "Validation mistakes",
                    "ar": "أخطاء التحقق"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2><p id=\"-zvtxl_12\">History of <span class=\"control\" id=\"-zvtxl_13\">meter readings</span> for metered subscribers. Used to calculate usage and bills. Check photos when a number looks wrong.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">Before you start</h2><ul class=\"list _bullet\" id=\"-zvtxl_14\"><li class=\"list__item\" id=\"-zvtxl_15\"><p id=\"-zvtxl_17\">Subscribers on <span class=\"control\" id=\"-zvtxl_18\">metered</span> <a data-tooltip=\"Define how you charge: fixed monthly amount or by meter (KWH), with prices and fees. Every subscriber must have one model.\" href=\"billing-models.html\" id=\"-zvtxl_19\">Billing Models</a>.</p></li><li class=\"list__item\" id=\"-zvtxl_16\"><p id=\"-zvtxl_20\">Collectors entered readings in the field (or you enter corrections here).</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow-monthly-phase-1\" id=\"your-regular-workflow-monthly-phase-1\">Your regular workflow (monthly — Phase 1)</h2><ol class=\"list _decimal\" id=\"-zvtxl_21\" type=\"1\"><li class=\"list__item\" id=\"-zvtxl_23\"><p id=\"-zvtxl_28\">Open KWH Readings after collectors finish routes.</p></li><li class=\"list__item\" id=\"-zvtxl_24\"><p id=\"-zvtxl_29\">Filter by <span class=\"control\" id=\"-zvtxl_30\">this month</span> and each <span class=\"control\" id=\"-zvtxl_31\">generator</span>.</p></li><li class=\"list__item\" id=\"-zvtxl_25\"><p id=\"-zvtxl_32\">Find missing subscribers — chase readings before <a data-tooltip=\"Three tools on one screen: see all bills, create special one-off bills, and run monthly generation for many subscribers.\" href=\"bills.html\" id=\"-zvtxl_33\">Bills</a> generation.</p></li><li class=\"list__item\" id=\"-zvtxl_26\"><p id=\"-zvtxl_34\">Open outliers (very high/low) → check <span class=\"control\" id=\"-zvtxl_35\">meter photo</span>.</p></li><li class=\"list__item\" id=\"-zvtxl_27\"><p id=\"-zvtxl_36\">Fix errors <span class=\"control\" id=\"-zvtxl_37\">before</span> Bill Generation tab.</p></li></ol><aside class=\"prompt\" data-title=\"\" data-type=\"tip\" id=\"-zvtxl_22\"><p id=\"-zvtxl_38\"><span class=\"control\" id=\"-zvtxl_39\">Order:</span> Readings → Bills. Never reverse.</p></aside></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">What you see on this page</h2><p id=\"-zvtxl_40\">Table: subscriber, previous/new reading, consumption, date, collector; filters; <span class=\"control\" id=\"-zvtxl_41\">KWH Reading Details</span>; <span class=\"control\" id=\"-zvtxl_42\">KWH Reading Image</span> zoom.</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step-verify-one-reading\" id=\"step-by-step-verify-one-reading\">Step-by-step: verify one reading</h2><ol class=\"list _decimal\" id=\"-zvtxl_43\" type=\"1\"><li class=\"list__item\" id=\"-zvtxl_44\"><p id=\"-zvtxl_48\">Search subscriber name or phone.</p></li><li class=\"list__item\" id=\"-zvtxl_45\"><p id=\"-zvtxl_49\">Compare new reading to previous — consumption should make sense.</p></li><li class=\"list__item\" id=\"-zvtxl_46\"><p id=\"-zvtxl_50\">Open photo — dial matches typed number?</p></li><li class=\"list__item\" id=\"-zvtxl_47\"><p id=\"-zvtxl_51\">If wrong, edit per your company rule or send collector back.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">Validation mistakes</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-zvtxl_52\"><thead><tr class=\"ijRowHead\" id=\"-zvtxl_53\"><th id=\"-zvtxl_57\"><p>Issue</p></th><th id=\"-zvtxl_58\"><p>Result</p></th></tr></thead><tbody><tr id=\"-zvtxl_54\"><td id=\"-zvtxl_59\"><p>New reading smaller than previous</p></td><td id=\"-zvtxl_60\"><p>Negative consumption — blocked or wrong bill</p></td></tr><tr id=\"-zvtxl_55\"><td id=\"-zvtxl_61\"><p>Huge jump</p></td><td id=\"-zvtxl_62\"><p>Bill very high — verify photo before billing</p></td></tr><tr id=\"-zvtxl_56\"><td id=\"-zvtxl_63\"><p>Missing reading</p></td><td id=\"-zvtxl_64\"><p>Metered bill may fail or show zero</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2><ul class=\"list _bullet\" id=\"-zvtxl_65\"><li class=\"list__item\" id=\"-zvtxl_66\"><p id=\"-zvtxl_69\">Billing before all readings in.</p></li><li class=\"list__item\" id=\"-zvtxl_67\"><p id=\"-zvtxl_70\">Approving photo from <span class=\"control\" id=\"-zvtxl_71\">wrong month</span>.</p></li><li class=\"list__item\" id=\"-zvtxl_68\"><p id=\"-zvtxl_72\">Typo one digit — large bill dispute.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-zvtxl_73\"><thead><tr class=\"ijRowHead\" id=\"-zvtxl_74\"><th id=\"-zvtxl_77\"><p>Problem</p></th><th id=\"-zvtxl_78\"><p>What to try</p></th></tr></thead><tbody><tr id=\"-zvtxl_75\"><td id=\"-zvtxl_79\"><p>No row for subscriber</p></td><td id=\"-zvtxl_80\"><p>Collector must submit; check generator assignment</p></td></tr><tr id=\"-zvtxl_76\"><td id=\"-zvtxl_81\"><p>Cannot edit</p></td><td id=\"-zvtxl_82\"><p>Bill may exist for period — contact support</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2><ul class=\"list _bullet\" id=\"-zvtxl_83\"><li class=\"list__item\" id=\"-zvtxl_84\"><p id=\"-zvtxl_87\"><a data-tooltip=\"This is the main workflow most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.\" href=\"monthly-billing-workflow.html\" id=\"-zvtxl_88\">Monthly billing workflow</a></p></li><li class=\"list__item\" id=\"-zvtxl_85\"><p id=\"-zvtxl_89\"><a data-tooltip=\"Three tools on one screen: see all bills, create special one-off bills, and run monthly generation for many subscribers.\" href=\"bills.html\" id=\"-zvtxl_90\">Bills</a></p></li><li class=\"list__item\" id=\"-zvtxl_86\"><p id=\"-zvtxl_91\"><a data-tooltip=\"Create accounts for field staff who record readings and payments. Control which generators each person can see.\" href=\"bill-collectors.html\" id=\"-zvtxl_92\">Bill Collectors</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"bill-collections.html\">Bill Collections</a><a class=\"navigation-links__next\" href=\"sms-templates.html\">SMS Templates</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"z32vdtz_13\">سجل <span class=\"control\" id=\"z32vdtz_14\">قراءات العداد</span> للمشتركين metered. تُستخدم لحساب الاستهلاك والفواتير. راجع الصور عندما يبدو الرقم غريباً.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">قبل أن تبدأ</h2><ul class=\"list _bullet\" id=\"z32vdtz_15\"><li class=\"list__item\" id=\"z32vdtz_16\"><p id=\"z32vdtz_18\">مشتركون على <a data-tooltip=\"تحديد كيف تُحاسب: مبلغ شهري ثابت أو حسب العداد (KWH)، مع الأسعار والرسوم. كل مشترك يحتاج نموذجاً واحداً.\" href=\"billing-models.html\" id=\"z32vdtz_19\">Billing Models</a> من نوع metered.</p></li><li class=\"list__item\" id=\"z32vdtz_17\"><p id=\"z32vdtz_20\">الجامعون أدخلوا القراءات في الميدان (أو تصحّح هنا).</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow-monthly-phase-1\" id=\"your-regular-workflow-monthly-phase-1\">سير العمل الشهري (المرحلة 1)</h2><ol class=\"list _decimal\" id=\"z32vdtz_21\" type=\"1\"><li class=\"list__item\" id=\"z32vdtz_23\"><p id=\"z32vdtz_28\">افتح KWH Readings بعد انتهاء الجامعين من المسارات.</p></li><li class=\"list__item\" id=\"z32vdtz_24\"><p id=\"z32vdtz_29\">فلتر <span class=\"control\" id=\"z32vdtz_30\">هذا الشهر</span> وكل <span class=\"control\" id=\"z32vdtz_31\">generator</span>.</p></li><li class=\"list__item\" id=\"z32vdtz_25\"><p id=\"z32vdtz_32\">ابحث عن المفقودين — طالب بالقراءة قبل <a data-tooltip=\"ثلاث أدوات في شاشة واحدة: عرض كل الفواتير، إنشاء فواتير استثنائية لمرة واحدة، وتشغيل التوليد الشهري لعدة مشتركين.\" href=\"bills.html\" id=\"z32vdtz_33\">Bills</a>.</p></li><li class=\"list__item\" id=\"z32vdtz_26\"><p id=\"z32vdtz_34\">افتح القيم الشاذة (مرتفعة/منخفضة جداً) → راجع <span class=\"control\" id=\"z32vdtz_35\">meter photo</span>.</p></li><li class=\"list__item\" id=\"z32vdtz_27\"><p id=\"z32vdtz_36\">صحّح الأخطاء <span class=\"control\" id=\"z32vdtz_37\">قبل</span> تبويب Bill Generation.</p></li></ol><aside class=\"prompt\" data-title=\"\" data-type=\"tip\" id=\"z32vdtz_22\"><p id=\"z32vdtz_38\"><span class=\"control\" id=\"z32vdtz_39\">الترتيب:</span> Readings → Bills. لا تعكسه أبداً.</p></aside></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">ما تراه على هذه الصفحة</h2><p id=\"z32vdtz_40\">جدول: subscriber، previous/new reading، consumption، date، collector؛ فلاتر؛ <span class=\"control\" id=\"z32vdtz_41\">KWH Reading Details</span>؛ تكبير <span class=\"control\" id=\"z32vdtz_42\">KWH Reading Image</span>.</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step-verify-one-reading\" id=\"step-by-step-verify-one-reading\">خطوة بخطوة: التحقق من قراءة واحدة</h2><ol class=\"list _decimal\" id=\"z32vdtz_43\" type=\"1\"><li class=\"list__item\" id=\"z32vdtz_44\"><p id=\"z32vdtz_48\">ابحث باسم أو هاتف المشترك.</p></li><li class=\"list__item\" id=\"z32vdtz_45\"><p id=\"z32vdtz_49\">قارن القراءة الجديدة بالسابقة — الاستهلاك يجب أن يكون منطقياً.</p></li><li class=\"list__item\" id=\"z32vdtz_46\"><p id=\"z32vdtz_50\">افتح الصورة — هل العداد يطابق الرقم المكتوب؟</p></li><li class=\"list__item\" id=\"z32vdtz_47\"><p id=\"z32vdtz_51\">إن كان خاطئاً، عدّل حسب سياسة شركتك أو أعد الجامع.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">أخطاء التحقق</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"z32vdtz_52\"><thead><tr class=\"ijRowHead\" id=\"z32vdtz_53\"><th id=\"z32vdtz_57\"><p>المشكلة</p></th><th id=\"z32vdtz_58\"><p>النتيجة</p></th></tr></thead><tbody><tr id=\"z32vdtz_54\"><td id=\"z32vdtz_59\"><p>قراءة جديدة أصغر من السابقة</p></td><td id=\"z32vdtz_60\"><p>استهلاك سالب — ممنوع أو فاتورة خاطئة</p></td></tr><tr id=\"z32vdtz_55\"><td id=\"z32vdtz_61\"><p>قفزة كبيرة</p></td><td id=\"z32vdtz_62\"><p>فاتورة عالية جداً — تحقق من الصورة قبل الفوترة</p></td></tr><tr id=\"z32vdtz_56\"><td id=\"z32vdtz_63\"><p>قراءة ناقصة</p></td><td id=\"z32vdtz_64\"><p>فاتورة metered قد تفشل أو تظهر صفراً</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"z32vdtz_65\"><li class=\"list__item\" id=\"z32vdtz_66\"><p id=\"z32vdtz_69\">الفوترة قبل اكتمال كل القراءات.</p></li><li class=\"list__item\" id=\"z32vdtz_67\"><p id=\"z32vdtz_70\">اعتماد صورة من <span class=\"control\" id=\"z32vdtz_71\">شهر</span> خاطئ.</p></li><li class=\"list__item\" id=\"z32vdtz_68\"><p id=\"z32vdtz_72\">خطأ برقم واحد — نزاع فاتورة كبير.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"z32vdtz_73\"><thead><tr class=\"ijRowHead\" id=\"z32vdtz_74\"><th id=\"z32vdtz_77\"><p>المشكلة</p></th><th id=\"z32vdtz_78\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"z32vdtz_75\"><td id=\"z32vdtz_79\"><p>لا صف للمشترك</p></td><td id=\"z32vdtz_80\"><p>الجامع يجب أن يرسل؛ تحقق من تعيين generator</p></td></tr><tr id=\"z32vdtz_76\"><td id=\"z32vdtz_81\"><p>لا أستطيع التعديل</p></td><td id=\"z32vdtz_82\"><p>قد توجد فاتورة للفترة — تواصل مع الدعم</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"z32vdtz_83\"><li class=\"list__item\" id=\"z32vdtz_84\"><p id=\"z32vdtz_87\"><a data-tooltip=\"هذا سير العمل الرئيسي الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.\" href=\"monthly-billing-workflow.html\" id=\"z32vdtz_88\">دورة الفوترة الشهرية</a></p></li><li class=\"list__item\" id=\"z32vdtz_85\"><p id=\"z32vdtz_89\"><a data-tooltip=\"ثلاث أدوات في شاشة واحدة: عرض كل الفواتير، إنشاء فواتير استثنائية لمرة واحدة، وتشغيل التوليد الشهري لعدة مشتركين.\" href=\"bills.html\" id=\"z32vdtz_90\">Bills</a></p></li><li class=\"list__item\" id=\"z32vdtz_86\"><p id=\"z32vdtz_91\"><a data-tooltip=\"إنشاء حسابات الموظفين الميدانيين الذين يسجلون القراءات والمدفوعات. تحكم بأي generators يرى كل شخص.\" href=\"bill-collectors.html\" id=\"z32vdtz_92\">Bill Collectors</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"bill-collections.html\">Bill Collections</a><a class=\"navigation-links__next\" href=\"sms-templates.html\">SMS Templates</a></div>"
        },
        "keywords": [
            "Bills and payments",
            "KWH Readings",
            "kwh readings",
            "الفواتير والتحصيل"
        ]
    },
    {
        "id": "sms-templates",
        "slug": "sms-templates",
        "fileName": "sms-templates.html",
        "title": {
            "en": "SMS Templates",
            "ar": "SMS Templates"
        },
        "group": {
            "en": "Messages to subscribers",
            "ar": "رسائل للمشتركين"
        },
        "appRoute": "sms-templates",
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start",
                "title": {
                    "en": "Before you start",
                    "ar": "قبل أن تبدأ"
                }
            },
            {
                "id": "your-regular-workflow",
                "title": {
                    "en": "Your regular workflow",
                    "ar": "سير العمل المعتاد"
                }
            },
            {
                "id": "what-you-see-on-this-page",
                "title": {
                    "en": "What you see on this page",
                    "ar": "ما تراه على هذه الصفحة"
                }
            },
            {
                "id": "step-by-step",
                "title": {
                    "en": "Step-by-step",
                    "ar": "خطوة بخطوة"
                }
            },
            {
                "id": "validation-mistakes",
                "title": {
                    "en": "Validation mistakes",
                    "ar": "أخطاء التحقق"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2><p id=\"-84zjai_12\">Ready-made <span class=\"control\" id=\"-84zjai_13\">SMS text</span> with placeholders (name, amount, month). Reuse in campaigns so every message is consistent and professional.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">Before you start</h2><ul class=\"list _bullet\" id=\"-84zjai_14\"><li class=\"list__item\" id=\"-84zjai_15\"><p id=\"-84zjai_17\">Decide message language (Arabic, English, or mixed) your subscribers expect.</p></li><li class=\"list__item\" id=\"-84zjai_16\"><p id=\"-84zjai_18\"><a data-tooltip=\"Balance you keep with Echtirak to pay for platform services (SMS, subscription charges). Not cash from subscribers — that flows through Bill Collections.\" href=\"wallet.html\" id=\"-84zjai_19\">Wallet</a> funded if you will send soon.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">Your regular workflow</h2><ol class=\"list _decimal\" id=\"-84zjai_20\" type=\"1\"><li class=\"list__item\" id=\"-84zjai_21\"><p id=\"-84zjai_24\">Create templates <span class=\"control\" id=\"-84zjai_25\">once</span>: “Bill ready”, “Payment received”, “Reminder”.</p></li><li class=\"list__item\" id=\"-84zjai_22\"><p id=\"-84zjai_26\">Keep a <span class=\"control\" id=\"-84zjai_27\">test template</span> for one-number trials.</p></li><li class=\"list__item\" id=\"-84zjai_23\"><p id=\"-84zjai_28\">Before each campaign season, read templates aloud — do they still match your prices/process?</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">What you see on this page</h2><p id=\"-84zjai_29\">Template list; editor with placeholders; save / new.</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">Step-by-step</h2><ol class=\"list _decimal\" id=\"-84zjai_30\" type=\"1\"><li class=\"list__item\" id=\"-84zjai_31\"><p id=\"-84zjai_35\">SMS Templates → <span class=\"control\" id=\"-84zjai_36\">New</span>.</p></li><li class=\"list__item\" id=\"-84zjai_32\"><p id=\"-84zjai_37\">Short clear text — use placeholders from the picker only.</p></li><li class=\"list__item\" id=\"-84zjai_33\"><p id=\"-84zjai_38\">Save → send test via small <a data-tooltip=\"Send the same message to many subscribers at once. See past campaigns and open details to check delivery.\" href=\"sms-campaigns.html\" id=\"-84zjai_39\">SMS Campaign</a>.</p></li><li class=\"list__item\" id=\"-84zjai_34\"><p id=\"-84zjai_40\">Adjust wording if preview looks wrong.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">Validation mistakes</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-84zjai_41\"><thead><tr class=\"ijRowHead\" id=\"-84zjai_42\"><th id=\"-84zjai_45\"><p>Issue</p></th><th id=\"-84zjai_46\"><p>Result</p></th></tr></thead><tbody><tr id=\"-84zjai_43\"><td id=\"-84zjai_47\"><p>Empty name or body</p></td><td id=\"-84zjai_48\"><p>Cannot save</p></td></tr><tr id=\"-84zjai_44\"><td id=\"-84zjai_49\"><p>Wrong placeholder spelling</p></td><td id=\"-84zjai_50\"><p>Blank name/amount in real SMS</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2><ul class=\"list _bullet\" id=\"-84zjai_51\"><li class=\"list__item\" id=\"-84zjai_52\"><p id=\"-84zjai_55\">Message too long — splits into 2 SMS, costs more.</p></li><li class=\"list__item\" id=\"-84zjai_53\"><p id=\"-84zjai_56\">“Bill ready” before bills exist.</p></li><li class=\"list__item\" id=\"-84zjai_54\"><p id=\"-84zjai_57\">Harsh tone — subscribers ignore future SMS.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-84zjai_58\"><thead><tr class=\"ijRowHead\" id=\"-84zjai_59\"><th id=\"-84zjai_62\"><p>Problem</p></th><th id=\"-84zjai_63\"><p>What to try</p></th></tr></thead><tbody><tr id=\"-84zjai_60\"><td id=\"-84zjai_64\"><p>Blank in sent SMS</p></td><td id=\"-84zjai_65\"><p>Subscriber missing phone or bill data for placeholder</p></td></tr><tr id=\"-84zjai_61\"><td id=\"-84zjai_66\"><p>Cannot save</p></td><td id=\"-84zjai_67\"><p>Required fields; special characters rare issues — simplify text</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2><ul class=\"list _bullet\" id=\"-84zjai_68\"><li class=\"list__item\" id=\"-84zjai_69\"><p id=\"-84zjai_72\"><a data-tooltip=\"Send the same message to many subscribers at once. See past campaigns and open details to check delivery.\" href=\"sms-campaigns.html\" id=\"-84zjai_73\">SMS Campaigns</a></p></li><li class=\"list__item\" id=\"-84zjai_70\"><p id=\"-84zjai_74\"><a data-tooltip=\"Wizard to choose recipients, pick a template, preview text, and send.\" href=\"sms-campaign-create.html\" id=\"-84zjai_75\">SMS Campaign Create</a></p></li><li class=\"list__item\" id=\"-84zjai_71\"><p id=\"-84zjai_76\"><a data-tooltip=\"Balance you keep with Echtirak to pay for platform services (SMS, subscription charges). Not cash from subscribers — that flows through Bill Collections.\" href=\"wallet.html\" id=\"-84zjai_77\">Wallet</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"kwh-readings.html\">KWH Readings</a><a class=\"navigation-links__next\" href=\"sms-campaigns.html\">SMS Campaigns</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"-ntryii_13\">نصوص <span class=\"control\" id=\"-ntryii_14\">SMS جاهزة</span> مع placeholders (الاسم، المبلغ، الشهر). أعد استخدامها في الحملات لرسائل متسقة ومهنية.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">قبل أن تبدأ</h2><ul class=\"list _bullet\" id=\"-ntryii_15\"><li class=\"list__item\" id=\"-ntryii_16\"><p id=\"-ntryii_18\">قرّرت لغة الرسالة (عربي، إنجليزي، أو مختلط) التي يتوقعها مشتركوك.</p></li><li class=\"list__item\" id=\"-ntryii_17\"><p id=\"-ntryii_19\"><a data-tooltip=\"الرصيد الذي تحتفظ به لدى Echtirak لدفع خدمات المنصة (SMS، رسوم الاشتراك). ليس نقد المشتركين — ذلك يمر عبر Bill Collections.\" href=\"wallet.html\" id=\"-ntryii_20\">Wallet</a> ممول إن كنت سترسل قريباً.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">سير العمل المعتاد</h2><ol class=\"list _decimal\" id=\"-ntryii_21\" type=\"1\"><li class=\"list__item\" id=\"-ntryii_22\"><p id=\"-ntryii_25\">أنشئ القوالب <span class=\"control\" id=\"-ntryii_26\">مرة واحدة</span>: «الفاتورة جاهزة»، «تم الدفع»، «تذكير».</p></li><li class=\"list__item\" id=\"-ntryii_23\"><p id=\"-ntryii_27\">احتفظ بقالب <span class=\"control\" id=\"-ntryii_28\">اختبار</span> لرقم واحد.</p></li><li class=\"list__item\" id=\"-ntryii_24\"><p id=\"-ntryii_29\">قبل كل موسم حملات، اقرأ القوالب بصوت عالٍ — هل ما زالت تطابق أسعاركم وعمليتكم؟</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">ما تراه على هذه الصفحة</h2><p id=\"-ntryii_30\">قائمة القوالب؛ محرر مع placeholders؛ حفظ / جديد.</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">خطوة بخطوة</h2><ol class=\"list _decimal\" id=\"-ntryii_31\" type=\"1\"><li class=\"list__item\" id=\"-ntryii_32\"><p id=\"-ntryii_36\">SMS Templates → <span class=\"control\" id=\"-ntryii_37\">New</span>.</p></li><li class=\"list__item\" id=\"-ntryii_33\"><p id=\"-ntryii_38\">نص قصير وواضح — استخدم placeholders من القائمة فقط.</p></li><li class=\"list__item\" id=\"-ntryii_34\"><p id=\"-ntryii_39\"><span class=\"control\" id=\"-ntryii_40\">Save</span> → أرسل اختباراً عبر <a data-tooltip=\"إرسال نفس الرسالة إلى عدة مشتركين دفعة واحدة. اعرض الحملات السابقة وافتح التفاصيل للتحقق من التسليم.\" href=\"sms-campaigns.html\" id=\"-ntryii_41\">SMS Campaign</a> صغيرة.</p></li><li class=\"list__item\" id=\"-ntryii_35\"><p id=\"-ntryii_42\">عدّل الصياغة إن بدا المعاينة خاطئاً.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">أخطاء التحقق</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-ntryii_43\"><thead><tr class=\"ijRowHead\" id=\"-ntryii_44\"><th id=\"-ntryii_47\"><p>المشكلة</p></th><th id=\"-ntryii_48\"><p>النتيجة</p></th></tr></thead><tbody><tr id=\"-ntryii_45\"><td id=\"-ntryii_49\"><p>اسم أو نص فارغ</p></td><td id=\"-ntryii_50\"><p>لا يمكن الحفظ</p></td></tr><tr id=\"-ntryii_46\"><td id=\"-ntryii_51\"><p>تهجئة placeholder خاطئة</p></td><td id=\"-ntryii_52\"><p>اسم/مبلغ فارغ في SMS الحقيقي</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"-ntryii_53\"><li class=\"list__item\" id=\"-ntryii_54\"><p id=\"-ntryii_57\">رسالة طويلة جداً — تنقسم لـ 2 SMS وتكلف أكثر.</p></li><li class=\"list__item\" id=\"-ntryii_55\"><p id=\"-ntryii_58\">«الفاتورة جاهزة» قبل وجود الفواتير.</p></li><li class=\"list__item\" id=\"-ntryii_56\"><p id=\"-ntryii_59\">نبرة قاسية — المشتركون يتجاهلون SMS لاحقاً.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-ntryii_60\"><thead><tr class=\"ijRowHead\" id=\"-ntryii_61\"><th id=\"-ntryii_64\"><p>المشكلة</p></th><th id=\"-ntryii_65\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"-ntryii_62\"><td id=\"-ntryii_66\"><p>فراغ في SMS المرسل</p></td><td id=\"-ntryii_67\"><p>phone ناقص أو بيانات فاتورة للـ placeholder</p></td></tr><tr id=\"-ntryii_63\"><td id=\"-ntryii_68\"><p>لا يمكن الحفظ</p></td><td id=\"-ntryii_69\"><p>حقول مطلوبة؛ بسّط النص عند مشاكل نادرة بالرموز</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"-ntryii_70\"><li class=\"list__item\" id=\"-ntryii_71\"><p id=\"-ntryii_74\"><a data-tooltip=\"إرسال نفس الرسالة إلى عدة مشتركين دفعة واحدة. اعرض الحملات السابقة وافتح التفاصيل للتحقق من التسليم.\" href=\"sms-campaigns.html\" id=\"-ntryii_75\">SMS Campaigns</a></p></li><li class=\"list__item\" id=\"-ntryii_72\"><p id=\"-ntryii_76\"><a data-tooltip=\"معالج لـ اختيار المستلمين، اختيار قالب، معاينة النص، والإرسال.\" href=\"sms-campaign-create.html\" id=\"-ntryii_77\">Create SMS Campaign</a></p></li><li class=\"list__item\" id=\"-ntryii_73\"><p id=\"-ntryii_78\"><a data-tooltip=\"الرصيد الذي تحتفظ به لدى Echtirak لدفع خدمات المنصة (SMS، رسوم الاشتراك). ليس نقد المشتركين — ذلك يمر عبر Bill Collections.\" href=\"wallet.html\" id=\"-ntryii_79\">Wallet</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"kwh-readings.html\">KWH Readings</a><a class=\"navigation-links__next\" href=\"sms-campaigns.html\">SMS Campaigns</a></div>"
        },
        "keywords": [
            "Messages to subscribers",
            "SMS Templates",
            "sms templates",
            "رسائل للمشتركين"
        ]
    },
    {
        "id": "sms-campaigns",
        "slug": "sms-campaigns",
        "fileName": "sms-campaigns.html",
        "title": {
            "en": "SMS Campaigns",
            "ar": "SMS Campaigns"
        },
        "group": {
            "en": "Messages to subscribers",
            "ar": "رسائل للمشتركين"
        },
        "appRoute": "sms-campaigns",
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start",
                "title": {
                    "en": "Before you start",
                    "ar": "قبل أن تبدأ"
                }
            },
            {
                "id": "your-regular-workflow-monthly",
                "title": {
                    "en": "Your regular workflow (monthly)",
                    "ar": "سير العمل الشهري"
                }
            },
            {
                "id": "what-you-see-on-this-page",
                "title": {
                    "en": "What you see on this page",
                    "ar": "ما تراه على هذه الصفحة"
                }
            },
            {
                "id": "step-by-step",
                "title": {
                    "en": "Step-by-step",
                    "ar": "خطوة بخطوة"
                }
            },
            {
                "id": "validation-mistakes",
                "title": {
                    "en": "Validation mistakes",
                    "ar": "أخطاء التحقق"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2><p id=\"auukh8_12\">Send the same message to <span class=\"control\" id=\"auukh8_13\">many subscribers</span> at once. See past campaigns and open details to check delivery.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">Before you start</h2><ul class=\"list _bullet\" id=\"auukh8_14\"><li class=\"list__item\" id=\"auukh8_15\"><p id=\"auukh8_18\"><a data-tooltip=\"Ready-made SMS text with placeholders (name, amount, month). Reuse in campaigns so every message is consistent and professional.\" href=\"sms-templates.html\" id=\"auukh8_19\">SMS Templates</a> ready.</p></li><li class=\"list__item\" id=\"auukh8_16\"><p id=\"auukh8_20\"><a data-tooltip=\"Three tools on one screen: see all bills, create special one-off bills, and run monthly generation for many subscribers.\" href=\"bills.html\" id=\"auukh8_21\">Bills</a> generated if message is about a bill month.</p></li><li class=\"list__item\" id=\"auukh8_17\"><p id=\"auukh8_22\"><a data-tooltip=\"Balance you keep with Echtirak to pay for platform services (SMS, subscription charges). Not cash from subscribers — that flows through Bill Collections.\" href=\"wallet.html\" id=\"auukh8_23\">Wallet</a> balance sufficient.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow-monthly\" id=\"your-regular-workflow-monthly\">Your regular workflow (monthly)</h2><ol class=\"list _decimal\" id=\"auukh8_24\" type=\"1\"><li class=\"list__item\" id=\"auukh8_25\"><p id=\"auukh8_30\">Finish <a data-tooltip=\"This is the main workflow most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.\" href=\"monthly-billing-workflow.html\" id=\"auukh8_31\">Monthly billing workflow</a> Phase 2 (bills generated).</p></li><li class=\"list__item\" id=\"auukh8_26\"><p id=\"auukh8_32\">SMS Campaigns → create → <a data-tooltip=\"Wizard to choose recipients, pick a template, preview text, and send.\" href=\"sms-campaign-create.html\" id=\"auukh8_33\">SMS Campaign Create</a>.</p></li><li class=\"list__item\" id=\"auukh8_27\"><p id=\"auukh8_34\">Use <span class=\"control\" id=\"auukh8_35\">Bills</span> tab with correct <span class=\"control\" id=\"auukh8_36\">year/month</span>.</p></li><li class=\"list__item\" id=\"auukh8_28\"><p id=\"auukh8_37\">After send → open <a data-tooltip=\"After sending, see delivery results: sent, delivered, failed, pending — and fix problem numbers.\" href=\"sms-campaign-details.html\" id=\"auukh8_38\">SMS Campaign Details</a> for failures.</p></li><li class=\"list__item\" id=\"auukh8_29\"><p id=\"auukh8_39\">Fix phones in <a data-tooltip=\"Manage everyone who receives electricity from you: add, edit, deactivate, export list, and print QR codes so they can view bills online.\" href=\"subscribers.html\" id=\"auukh8_40\">Subscribers</a>; resend small follow-up if needed.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">What you see on this page</h2><p id=\"auukh8_41\">Campaign list (name, date, status, counts); button to <span class=\"control\" id=\"auukh8_42\">create</span> new.</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">Step-by-step</h2><ol class=\"list _decimal\" id=\"auukh8_43\" type=\"1\"><li class=\"list__item\" id=\"auukh8_44\"><p id=\"auukh8_49\">Confirm bills exist for target month.</p></li><li class=\"list__item\" id=\"auukh8_45\"><p id=\"auukh8_50\">Create campaign → name it (e.g. “March 2026 bills”).</p></li><li class=\"list__item\" id=\"auukh8_46\"><p id=\"auukh8_51\">Complete create wizard → send.</p></li><li class=\"list__item\" id=\"auukh8_47\"><p id=\"auukh8_52\">Refresh list — status should move to completed.</p></li><li class=\"list__item\" id=\"auukh8_48\"><p id=\"auukh8_53\">Open details if any messages failed.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">Validation mistakes</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"auukh8_54\"><thead><tr class=\"ijRowHead\" id=\"auukh8_55\"><th id=\"auukh8_60\"><p>Issue</p></th><th id=\"auukh8_61\"><p>Result</p></th></tr></thead><tbody><tr id=\"auukh8_56\"><td id=\"auukh8_62\"><p>No rows selected</p></td><td id=\"auukh8_63\"><p>Cannot send</p></td></tr><tr id=\"auukh8_57\"><td id=\"auukh8_64\"><p>No template</p></td><td id=\"auukh8_65\"><p>Send disabled</p></td></tr><tr id=\"auukh8_58\"><td id=\"auukh8_66\"><p>Low wallet</p></td><td id=\"auukh8_67\"><p>Failures or block</p></td></tr><tr id=\"auukh8_59\"><td id=\"auukh8_68\"><p>Wrong month on Bills tab</p></td><td id=\"auukh8_69\"><p>SMS about wrong or missing bill</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2><ul class=\"list _bullet\" id=\"auukh8_70\"><li class=\"list__item\" id=\"auukh8_71\"><p id=\"auukh8_74\">Mass send without <span class=\"control\" id=\"auukh8_75\">preview</span> on one subscriber.</p></li><li class=\"list__item\" id=\"auukh8_72\"><p id=\"auukh8_76\">Duplicate campaign same day — annoyed subscribers.</p></li><li class=\"list__item\" id=\"auukh8_73\"><p id=\"auukh8_77\">Ignoring <span class=\"control\" id=\"auukh8_78\">failed</span> list in details.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"auukh8_79\"><thead><tr class=\"ijRowHead\" id=\"auukh8_80\"><th id=\"auukh8_83\"><p>Problem</p></th><th id=\"auukh8_84\"><p>What to try</p></th></tr></thead><tbody><tr id=\"auukh8_81\"><td id=\"auukh8_85\"><p>Stuck pending</p></td><td id=\"auukh8_86\"><p>Wait; refresh; support if hours pass</p></td></tr><tr id=\"auukh8_82\"><td id=\"auukh8_87\"><p>All failed</p></td><td id=\"auukh8_88\"><p>Wallet; phone numbers; support for SMS account</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2><ul class=\"list _bullet\" id=\"auukh8_89\"><li class=\"list__item\" id=\"auukh8_90\"><p id=\"auukh8_93\"><a data-tooltip=\"Wizard to choose recipients, pick a template, preview text, and send.\" href=\"sms-campaign-create.html\" id=\"auukh8_94\">SMS Campaign Create</a></p></li><li class=\"list__item\" id=\"auukh8_91\"><p id=\"auukh8_95\"><a data-tooltip=\"After sending, see delivery results: sent, delivered, failed, pending — and fix problem numbers.\" href=\"sms-campaign-details.html\" id=\"auukh8_96\">SMS Campaign Details</a></p></li><li class=\"list__item\" id=\"auukh8_92\"><p id=\"auukh8_97\"><a data-tooltip=\"This is the main workflow most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.\" href=\"monthly-billing-workflow.html\" id=\"auukh8_98\">Monthly billing workflow</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"sms-templates.html\">SMS Templates</a><a class=\"navigation-links__next\" href=\"sms-campaign-details.html\">SMS Campaign Details</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"-4txuqs_13\">إرسال نفس الرسالة إلى <span class=\"control\" id=\"-4txuqs_14\">عدة مشتركين</span> دفعة واحدة. اعرض الحملات السابقة وافتح التفاصيل للتحقق من التسليم.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">قبل أن تبدأ</h2><ul class=\"list _bullet\" id=\"-4txuqs_15\"><li class=\"list__item\" id=\"-4txuqs_16\"><p id=\"-4txuqs_19\"><a data-tooltip=\"نصوص SMS جاهزة مع placeholders (الاسم، المبلغ، الشهر). أعد استخدامها في الحملات لرسائل متسقة ومهنية.\" href=\"sms-templates.html\" id=\"-4txuqs_20\">SMS Templates</a> جاهزة.</p></li><li class=\"list__item\" id=\"-4txuqs_17\"><p id=\"-4txuqs_21\"><a data-tooltip=\"ثلاث أدوات في شاشة واحدة: عرض كل الفواتير، إنشاء فواتير استثنائية لمرة واحدة، وتشغيل التوليد الشهري لعدة مشتركين.\" href=\"bills.html\" id=\"-4txuqs_22\">Bills</a> مُولَّدة إن كانت الرسالة عن شهر فاتورة.</p></li><li class=\"list__item\" id=\"-4txuqs_18\"><p id=\"-4txuqs_23\">رصيد <a data-tooltip=\"الرصيد الذي تحتفظ به لدى Echtirak لدفع خدمات المنصة (SMS، رسوم الاشتراك). ليس نقد المشتركين — ذلك يمر عبر Bill Collections.\" href=\"wallet.html\" id=\"-4txuqs_24\">Wallet</a> كافٍ.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow-monthly\" id=\"your-regular-workflow-monthly\">سير العمل الشهري</h2><ol class=\"list _decimal\" id=\"-4txuqs_25\" type=\"1\"><li class=\"list__item\" id=\"-4txuqs_26\"><p id=\"-4txuqs_31\">أنهِ المرحلة 2 من <a data-tooltip=\"هذا سير العمل الرئيسي الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.\" href=\"monthly-billing-workflow.html\" id=\"-4txuqs_32\">دورة الفوترة الشهرية</a> (الفواتير مُولَّدة).</p></li><li class=\"list__item\" id=\"-4txuqs_27\"><p id=\"-4txuqs_33\">SMS Campaigns → إنشاء → <a data-tooltip=\"معالج لـ اختيار المستلمين، اختيار قالب، معاينة النص، والإرسال.\" href=\"sms-campaign-create.html\" id=\"-4txuqs_34\">Create SMS Campaign</a>.</p></li><li class=\"list__item\" id=\"-4txuqs_28\"><p id=\"-4txuqs_35\">استخدم تبويب <span class=\"control\" id=\"-4txuqs_36\">Bills</span> مع <span class=\"control\" id=\"-4txuqs_37\">year/month</span> الصحيحين.</p></li><li class=\"list__item\" id=\"-4txuqs_29\"><p id=\"-4txuqs_38\">بعد الإرسال → افتح <a data-tooltip=\"بعد الإرسال، اعرض نتائج التسليم: sent، delivered، failed، pending — وصحّح الأرقام المشكلة.\" href=\"sms-campaign-details.html\" id=\"-4txuqs_39\">SMS Campaign Details</a> للفاشلة.</p></li><li class=\"list__item\" id=\"-4txuqs_30\"><p id=\"-4txuqs_40\">صحّح الهواتف في <a data-tooltip=\"إدارة كل من يستلم الكهرباء منك: إضافة، تعديل، إلغاء تفعيل، تصدير القائمة، وطباعة QR codes لعرض الفواتير أونلاين.\" href=\"subscribers.html\" id=\"-4txuqs_41\">Subscribers</a>; أعد إرسال متابعة صغيرة إن لزم.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">ما تراه على هذه الصفحة</h2><p id=\"-4txuqs_42\">قائمة الحملات (name، date، status، counts); زر <span class=\"control\" id=\"-4txuqs_43\">إنشاء</span> جديد.</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">خطوة بخطوة</h2><ol class=\"list _decimal\" id=\"-4txuqs_44\" type=\"1\"><li class=\"list__item\" id=\"-4txuqs_45\"><p id=\"-4txuqs_50\">تأكد من وجود فواتير للشهر المستهدف.</p></li><li class=\"list__item\" id=\"-4txuqs_46\"><p id=\"-4txuqs_51\">أنشئ حملة → سمّها (مثلاً «March 2026 bills»).</p></li><li class=\"list__item\" id=\"-4txuqs_47\"><p id=\"-4txuqs_52\">أكمل معالج الإنشاء → أرسل.</p></li><li class=\"list__item\" id=\"-4txuqs_48\"><p id=\"-4txuqs_53\">حدّث القائمة — يجب أن يصبح status مكتملاً.</p></li><li class=\"list__item\" id=\"-4txuqs_49\"><p id=\"-4txuqs_54\">افتح التفاصيل إن فشلت رسائل.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">أخطاء التحقق</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-4txuqs_55\"><thead><tr class=\"ijRowHead\" id=\"-4txuqs_56\"><th id=\"-4txuqs_61\"><p>المشكلة</p></th><th id=\"-4txuqs_62\"><p>النتيجة</p></th></tr></thead><tbody><tr id=\"-4txuqs_57\"><td id=\"-4txuqs_63\"><p>لا صفوف محددة</p></td><td id=\"-4txuqs_64\"><p>لا يمكن الإرسال</p></td></tr><tr id=\"-4txuqs_58\"><td id=\"-4txuqs_65\"><p>لا قالب</p></td><td id=\"-4txuqs_66\"><p>الإرسال معطّل</p></td></tr><tr id=\"-4txuqs_59\"><td id=\"-4txuqs_67\"><p>wallet منخفض</p></td><td id=\"-4txuqs_68\"><p>فشل أو منع</p></td></tr><tr id=\"-4txuqs_60\"><td id=\"-4txuqs_69\"><p>شهر خاطئ في Bills</p></td><td id=\"-4txuqs_70\"><p>SMS عن فاتورة خاطئة أو مفقودة</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"-4txuqs_71\"><li class=\"list__item\" id=\"-4txuqs_72\"><p id=\"-4txuqs_75\">إرسال جماعي دون <span class=\"control\" id=\"-4txuqs_76\">preview</span> لمشترك واحد.</p></li><li class=\"list__item\" id=\"-4txuqs_73\"><p id=\"-4txuqs_77\">حملتان في نفس اليوم — إزعاج المشتركين.</p></li><li class=\"list__item\" id=\"-4txuqs_74\"><p id=\"-4txuqs_78\">تجاهل قائمة <span class=\"control\" id=\"-4txuqs_79\">failed</span> في التفاصيل.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-4txuqs_80\"><thead><tr class=\"ijRowHead\" id=\"-4txuqs_81\"><th id=\"-4txuqs_84\"><p>المشكلة</p></th><th id=\"-4txuqs_85\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"-4txuqs_82\"><td id=\"-4txuqs_86\"><p>عالق pending</p></td><td id=\"-4txuqs_87\"><p>انتظر؛ حدّث؛ الدعم إن مرّت ساعات</p></td></tr><tr id=\"-4txuqs_83\"><td id=\"-4txuqs_88\"><p>الكل failed</p></td><td id=\"-4txuqs_89\"><p>Wallet؛ أرقام الهواتف؛ حساب SMS عند الدعم</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"-4txuqs_90\"><li class=\"list__item\" id=\"-4txuqs_91\"><p id=\"-4txuqs_94\"><a data-tooltip=\"معالج لـ اختيار المستلمين، اختيار قالب، معاينة النص، والإرسال.\" href=\"sms-campaign-create.html\" id=\"-4txuqs_95\">Create SMS Campaign</a></p></li><li class=\"list__item\" id=\"-4txuqs_92\"><p id=\"-4txuqs_96\"><a data-tooltip=\"بعد الإرسال، اعرض نتائج التسليم: sent، delivered، failed، pending — وصحّح الأرقام المشكلة.\" href=\"sms-campaign-details.html\" id=\"-4txuqs_97\">SMS Campaign Details</a></p></li><li class=\"list__item\" id=\"-4txuqs_93\"><p id=\"-4txuqs_98\"><a data-tooltip=\"هذا سير العمل الرئيسي الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.\" href=\"monthly-billing-workflow.html\" id=\"-4txuqs_99\">دورة الفوترة الشهرية</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"sms-templates.html\">SMS Templates</a><a class=\"navigation-links__next\" href=\"sms-campaign-details.html\">SMS Campaign Details</a></div>"
        },
        "keywords": [
            "Messages to subscribers",
            "SMS Campaigns",
            "sms campaigns",
            "رسائل للمشتركين"
        ]
    },
    {
        "id": "sms-campaign-details",
        "slug": "sms-campaign-details",
        "fileName": "sms-campaign-details.html",
        "title": {
            "en": "SMS Campaign Details",
            "ar": "SMS Campaign Details"
        },
        "group": {
            "en": "Messages to subscribers",
            "ar": "رسائل للمشتركين"
        },
        "appRoute": "sms-campaigns",
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start",
                "title": {
                    "en": "Before you start",
                    "ar": "قبل أن تبدأ"
                }
            },
            {
                "id": "your-regular-workflow",
                "title": {
                    "en": "Your regular workflow",
                    "ar": "سير العمل المعتاد"
                }
            },
            {
                "id": "what-you-see-on-this-page",
                "title": {
                    "en": "What you see on this page",
                    "ar": "ما تراه على هذه الصفحة"
                }
            },
            {
                "id": "step-by-step",
                "title": {
                    "en": "Step-by-step",
                    "ar": "خطوة بخطوة"
                }
            },
            {
                "id": "validation-mistakes",
                "title": {
                    "en": "Validation mistakes",
                    "ar": "أخطاء التحقق"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2><p id=\"-233umi_12\">After sending, see <span class=\"control\" id=\"-233umi_13\">delivery results</span>: sent, delivered, failed, pending — and fix problem numbers.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">Before you start</h2><ul class=\"list _bullet\" id=\"-233umi_14\"><li class=\"list__item\" id=\"-233umi_15\"><p id=\"-233umi_16\">Campaign already sent from <a data-tooltip=\"Send the same message to many subscribers at once. See past campaigns and open details to check delivery.\" href=\"sms-campaigns.html\" id=\"-233umi_17\">SMS Campaigns</a>.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">Your regular workflow</h2><ol class=\"list _decimal\" id=\"-233umi_18\" type=\"1\"><li class=\"list__item\" id=\"-233umi_19\"><p id=\"-233umi_24\">Open campaign from list.</p></li><li class=\"list__item\" id=\"-233umi_20\"><p id=\"-233umi_25\">If <span class=\"control\" id=\"-233umi_26\">Failed</span> count is not zero → note phones from the table.</p></li><li class=\"list__item\" id=\"-233umi_21\"><p id=\"-233umi_27\">Fix in <a data-tooltip=\"Manage everyone who receives electricity from you: add, edit, deactivate, export list, and print QR codes so they can view bills online.\" href=\"subscribers.html\" id=\"-233umi_28\">Subscribers</a>.</p></li><li class=\"list__item\" id=\"-233umi_22\"><p id=\"-233umi_29\">Optional small new campaign for failed only (Bills or Subscribers tab).</p></li><li class=\"list__item\" id=\"-233umi_23\"><p id=\"-233umi_30\">Do not spam — one follow-up is enough.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">What you see on this page</h2><p id=\"-233umi_31\">Campaign name; four count boxes; <span class=\"control\" id=\"-233umi_32\">Messages</span> table (phone, status, errors).</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">Step-by-step</h2><ol class=\"list _decimal\" id=\"-233umi_33\" type=\"1\"><li class=\"list__item\" id=\"-233umi_34\"><p id=\"-233umi_38\">Check <span class=\"control\" id=\"-233umi_39\">Delivered</span> vs <span class=\"control\" id=\"-233umi_40\">Sent</span> — large gap may mean pending still updating.</p></li><li class=\"list__item\" id=\"-233umi_35\"><p id=\"-233umi_41\">Sort/filter failed rows.</p></li><li class=\"list__item\" id=\"-233umi_36\"><p id=\"-233umi_42\">For each: wrong number? phone off? typo?</p></li><li class=\"list__item\" id=\"-233umi_37\"><p id=\"-233umi_43\">Update subscriber → retry if business rules allow.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">Validation mistakes</h2><p id=\"-233umi_44\">N/A on this page (read-only). Fixing data happens on Subscribers.</p></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2><ul class=\"list _bullet\" id=\"-233umi_45\"><li class=\"list__item\" id=\"-233umi_46\"><p id=\"-233umi_49\">Assuming delivered = read — subscriber may ignore SMS.</p></li><li class=\"list__item\" id=\"-233umi_47\"><p id=\"-233umi_50\">Resending full list instead of failed only.</p></li><li class=\"list__item\" id=\"-233umi_48\"><p id=\"-233umi_51\">Wrong campaign opened — check name/date.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-233umi_52\"><thead><tr class=\"ijRowHead\" id=\"-233umi_53\"><th id=\"-233umi_56\"><p>Problem</p></th><th id=\"-233umi_57\"><p>What to try</p></th></tr></thead><tbody><tr id=\"-233umi_54\"><td id=\"-233umi_58\"><p>All failed</p></td><td id=\"-233umi_59\"><p>Wallet; SMS service; support</p></td></tr><tr id=\"-233umi_55\"><td id=\"-233umi_60\"><p>One number always fails</p></td><td id=\"-233umi_61\"><p>Format phone with country code as your admin recommends</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2><ul class=\"list _bullet\" id=\"-233umi_62\"><li class=\"list__item\" id=\"-233umi_63\"><p id=\"-233umi_66\"><a data-tooltip=\"Send the same message to many subscribers at once. See past campaigns and open details to check delivery.\" href=\"sms-campaigns.html\" id=\"-233umi_67\">SMS Campaigns</a></p></li><li class=\"list__item\" id=\"-233umi_64\"><p id=\"-233umi_68\"><a data-tooltip=\"Manage everyone who receives electricity from you: add, edit, deactivate, export list, and print QR codes so they can view bills online.\" href=\"subscribers.html\" id=\"-233umi_69\">Subscribers</a></p></li><li class=\"list__item\" id=\"-233umi_65\"><p id=\"-233umi_70\"><a data-tooltip=\"Balance you keep with Echtirak to pay for platform services (SMS, subscription charges). Not cash from subscribers — that flows through Bill Collections.\" href=\"wallet.html\" id=\"-233umi_71\">Wallet</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"sms-campaigns.html\">SMS Campaigns</a><a class=\"navigation-links__next\" href=\"sms-campaign-create.html\">Create SMS Campaign</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"sw4fuu_13\">بعد الإرسال، اعرض <span class=\"control\" id=\"sw4fuu_14\">نتائج التسليم</span>: sent، delivered، failed، pending — وصحّح الأرقام المشكلة.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">قبل أن تبدأ</h2><ul class=\"list _bullet\" id=\"sw4fuu_15\"><li class=\"list__item\" id=\"sw4fuu_16\"><p id=\"sw4fuu_17\">الحملة أُرسلت من <a data-tooltip=\"إرسال نفس الرسالة إلى عدة مشتركين دفعة واحدة. اعرض الحملات السابقة وافتح التفاصيل للتحقق من التسليم.\" href=\"sms-campaigns.html\" id=\"sw4fuu_18\">SMS Campaigns</a>.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">سير العمل المعتاد</h2><ol class=\"list _decimal\" id=\"sw4fuu_19\" type=\"1\"><li class=\"list__item\" id=\"sw4fuu_20\"><p id=\"sw4fuu_25\">افتح الحملة من القائمة.</p></li><li class=\"list__item\" id=\"sw4fuu_21\"><p id=\"sw4fuu_26\">إن كان عدد <span class=\"control\" id=\"sw4fuu_27\">Failed</span> ليس صفراً → سجّل الهواتف من الجدول.</p></li><li class=\"list__item\" id=\"sw4fuu_22\"><p id=\"sw4fuu_28\">صحّح في <a data-tooltip=\"إدارة كل من يستلم الكهرباء منك: إضافة، تعديل، إلغاء تفعيل، تصدير القائمة، وطباعة QR codes لعرض الفواتير أونلاين.\" href=\"subscribers.html\" id=\"sw4fuu_29\">Subscribers</a>.</p></li><li class=\"list__item\" id=\"sw4fuu_23\"><p id=\"sw4fuu_30\">اختياري: حملة صغيرة جديدة للفاشلة فقط (تبويب Bills أو Subscribers).</p></li><li class=\"list__item\" id=\"sw4fuu_24\"><p id=\"sw4fuu_31\">لا تكرر الإزعاج — متابعة واحدة كافية.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">ما تراه على هذه الصفحة</h2><p id=\"sw4fuu_32\">اسم الحملة؛ أربع صناديق عدد؛ جدول <span class=\"control\" id=\"sw4fuu_33\">Messages</span> (phone، status، errors).</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">خطوة بخطوة</h2><ol class=\"list _decimal\" id=\"sw4fuu_34\" type=\"1\"><li class=\"list__item\" id=\"sw4fuu_35\"><p id=\"sw4fuu_39\">قارن <span class=\"control\" id=\"sw4fuu_40\">Delivered</span> و <span class=\"control\" id=\"sw4fuu_41\">Sent</span> — فجوة كبيرة قد تعني تحديث pending.</p></li><li class=\"list__item\" id=\"sw4fuu_36\"><p id=\"sw4fuu_42\">رتّب/فلتر الصفوف الفاشلة.</p></li><li class=\"list__item\" id=\"sw4fuu_37\"><p id=\"sw4fuu_43\">لكل صف: رقم خاطئ؟ هاتف مغلق؟ خطأ مطبعي؟</p></li><li class=\"list__item\" id=\"sw4fuu_38\"><p id=\"sw4fuu_44\">حدّث المشترك → أعد المحاولة إن سمحت سياسة العمل.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">أخطاء التحقق</h2><p id=\"sw4fuu_45\">لا ينطبق على هذه الصفحة (للقراءة فقط). التصحيح في Subscribers.</p></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"sw4fuu_46\"><li class=\"list__item\" id=\"sw4fuu_47\"><p id=\"sw4fuu_50\">افتراض delivered = قرأ المشترك — قد يتجاهل SMS.</p></li><li class=\"list__item\" id=\"sw4fuu_48\"><p id=\"sw4fuu_51\">إعادة إرسال القائمة كاملة بدل الفاشلة فقط.</p></li><li class=\"list__item\" id=\"sw4fuu_49\"><p id=\"sw4fuu_52\">فتح حملة خاطئة — تحقق من الاسم/التاريخ.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"sw4fuu_53\"><thead><tr class=\"ijRowHead\" id=\"sw4fuu_54\"><th id=\"sw4fuu_57\"><p>المشكلة</p></th><th id=\"sw4fuu_58\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"sw4fuu_55\"><td id=\"sw4fuu_59\"><p>الكل failed</p></td><td id=\"sw4fuu_60\"><p>Wallet؛ خدمة SMS؛ الدعم</p></td></tr><tr id=\"sw4fuu_56\"><td id=\"sw4fuu_61\"><p>رقم يفشل دائماً</p></td><td id=\"sw4fuu_62\"><p>صيغة الهاتف مع رمز الدولة كما يوصي المسؤول</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"sw4fuu_63\"><li class=\"list__item\" id=\"sw4fuu_64\"><p id=\"sw4fuu_67\"><a data-tooltip=\"إرسال نفس الرسالة إلى عدة مشتركين دفعة واحدة. اعرض الحملات السابقة وافتح التفاصيل للتحقق من التسليم.\" href=\"sms-campaigns.html\" id=\"sw4fuu_68\">SMS Campaigns</a></p></li><li class=\"list__item\" id=\"sw4fuu_65\"><p id=\"sw4fuu_69\"><a data-tooltip=\"إدارة كل من يستلم الكهرباء منك: إضافة، تعديل، إلغاء تفعيل، تصدير القائمة، وطباعة QR codes لعرض الفواتير أونلاين.\" href=\"subscribers.html\" id=\"sw4fuu_70\">Subscribers</a></p></li><li class=\"list__item\" id=\"sw4fuu_66\"><p id=\"sw4fuu_71\"><a data-tooltip=\"الرصيد الذي تحتفظ به لدى Echtirak لدفع خدمات المنصة (SMS، رسوم الاشتراك). ليس نقد المشتركين — ذلك يمر عبر Bill Collections.\" href=\"wallet.html\" id=\"sw4fuu_72\">Wallet</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"sms-campaigns.html\">SMS Campaigns</a><a class=\"navigation-links__next\" href=\"sms-campaign-create.html\">Create SMS Campaign</a></div>"
        },
        "keywords": [
            "Messages to subscribers",
            "SMS Campaign Details",
            "sms campaign details",
            "رسائل للمشتركين"
        ]
    },
    {
        "id": "sms-campaign-create",
        "slug": "sms-campaign-create",
        "fileName": "sms-campaign-create.html",
        "title": {
            "en": "Create SMS Campaign",
            "ar": "Create SMS Campaign"
        },
        "group": {
            "en": "Messages to subscribers",
            "ar": "رسائل للمشتركين"
        },
        "appRoute": "sms-campaigns-create",
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start",
                "title": {
                    "en": "Before you start",
                    "ar": "قبل أن تبدأ"
                }
            },
            {
                "id": "your-regular-workflow",
                "title": {
                    "en": "Your regular workflow",
                    "ar": "سير العمل المعتاد"
                }
            },
            {
                "id": "what-you-see-on-this-page",
                "title": {
                    "en": "What you see on this page",
                    "ar": "ما تراه على هذه الصفحة"
                }
            },
            {
                "id": "step-by-step",
                "title": {
                    "en": "Step-by-step",
                    "ar": "خطوة بخطوة"
                }
            },
            {
                "id": "validation-mistakes",
                "title": {
                    "en": "Validation mistakes",
                    "ar": "أخطاء التحقق"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2><p id=\"-x5koay_12\">Wizard to <span class=\"control\" id=\"-x5koay_13\">choose recipients</span>, pick a <span class=\"control\" id=\"-x5koay_14\">template</span>, preview text, and <span class=\"control\" id=\"-x5koay_15\">send</span>.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">Before you start</h2><ul class=\"list _bullet\" id=\"-x5koay_16\"><li class=\"list__item\" id=\"-x5koay_17\"><p id=\"-x5koay_20\">Template in <a data-tooltip=\"Ready-made SMS text with placeholders (name, amount, month). Reuse in campaigns so every message is consistent and professional.\" href=\"sms-templates.html\" id=\"-x5koay_21\">SMS Templates</a>.</p></li><li class=\"list__item\" id=\"-x5koay_18\"><p id=\"-x5koay_22\">Bills generated if using <span class=\"control\" id=\"-x5koay_23\">Bills</span> tab.</p></li><li class=\"list__item\" id=\"-x5koay_19\"><p id=\"-x5koay_24\"><a data-tooltip=\"Balance you keep with Echtirak to pay for platform services (SMS, subscription charges). Not cash from subscribers — that flows through Bill Collections.\" href=\"wallet.html\" id=\"-x5koay_25\">Wallet</a> OK.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">Your regular workflow</h2><ol class=\"list _decimal\" id=\"-x5koay_26\" type=\"1\"><li class=\"list__item\" id=\"-x5koay_28\"><p id=\"-x5koay_34\">Name campaign (month + purpose).</p></li><li class=\"list__item\" id=\"-x5koay_29\"><p id=\"-x5koay_35\">Pick template.</p></li><li class=\"list__item\" id=\"-x5koay_30\"><p id=\"-x5koay_36\"><span class=\"control\" id=\"-x5koay_37\">Bills</span> tab → correct year/month → uncheck exclusions.</p></li><li class=\"list__item\" id=\"-x5koay_31\"><p id=\"-x5koay_38\"><span class=\"control\" id=\"-x5koay_39\">Preview</span> one message.</p></li><li class=\"list__item\" id=\"-x5koay_32\"><p id=\"-x5koay_40\"><span class=\"control\" id=\"-x5koay_41\">Confirm</span> send.</p></li><li class=\"list__item\" id=\"-x5koay_33\"><p id=\"-x5koay_42\">Review <a data-tooltip=\"After sending, see delivery results: sent, delivered, failed, pending — and fix problem numbers.\" href=\"sms-campaign-details.html\" id=\"-x5koay_43\">SMS Campaign Details</a>.</p></li></ol><aside class=\"prompt\" data-title=\"\" data-type=\"tip\" id=\"-x5koay_27\"><p id=\"-x5koay_44\"><span class=\"control\" id=\"-x5koay_45\">Bills tab</span> = bill month notices. <span class=\"control\" id=\"-x5koay_46\">Subscribers tab</span> = general news not tied to one bill.</p></aside></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">What you see on this page</h2><p id=\"-x5koay_47\">Campaign name; template; tabs <span class=\"control\" id=\"-x5koay_50\">Bills</span> | <span class=\"control\" id=\"-x5koay_51\">Subscribers</span>; recipient table; checkboxes; <span class=\"control\" id=\"-x5koay_52\">Preview</span>; <span class=\"control\" id=\"-x5koay_53\">Confirmation</span> dialog.</p><section class=\"chapter\"><h3 data-toc=\"tab-bills\" id=\"tab-bills\">Tab: Bills</h3><p id=\"-x5koay_54\">Subscribers who have bills in selected period.</p></section><section class=\"chapter\"><h3 data-toc=\"tab-subscribers\" id=\"tab-subscribers\">Tab: Subscribers</h3><p id=\"-x5koay_55\">Pick people directly (by generator/search).</p></section></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">Step-by-step</h2><ol class=\"list _decimal\" id=\"-x5koay_56\" type=\"1\"><li class=\"list__item\" id=\"-x5koay_57\"><p id=\"-x5koay_63\">SMS Campaigns → create.</p></li><li class=\"list__item\" id=\"-x5koay_58\"><p id=\"-x5koay_64\">Name: <code class=\"code\" id=\"-x5koay_65\">April 2026 - bills ready</code>.</p></li><li class=\"list__item\" id=\"-x5koay_59\"><p id=\"-x5koay_66\">Select template.</p></li><li class=\"list__item\" id=\"-x5koay_60\"><p id=\"-x5koay_67\">Bills tab → set <span class=\"control\" id=\"-x5koay_68\">year/month</span> → review list count.</p></li><li class=\"list__item\" id=\"-x5koay_61\"><p id=\"-x5koay_69\">Preview → read as a subscriber would.</p></li><li class=\"list__item\" id=\"-x5koay_62\"><p id=\"-x5koay_70\">Confirm → wait for completion status.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">Validation mistakes</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-x5koay_71\"><thead><tr class=\"ijRowHead\" id=\"-x5koay_72\"><th id=\"-x5koay_77\"><p>Issue</p></th><th id=\"-x5koay_78\"><p>Result</p></th></tr></thead><tbody><tr id=\"-x5koay_73\"><td id=\"-x5koay_79\"><p>Empty list on Bills tab</p></td><td id=\"-x5koay_80\"><p>No bills that month — generate first</p></td></tr><tr id=\"-x5koay_74\"><td id=\"-x5koay_81\"><p>No template / name</p></td><td id=\"-x5koay_82\"><p>Send blocked</p></td></tr><tr id=\"-x5koay_75\"><td id=\"-x5koay_83\"><p>Nothing selected</p></td><td id=\"-x5koay_84\"><p>Cannot confirm</p></td></tr><tr id=\"-x5koay_76\"><td id=\"-x5koay_85\"><p>Preview still shows empty placeholders</p></td><td id=\"-x5koay_86\"><p>Bad template — fix spelling using the picker list only</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2><ul class=\"list _bullet\" id=\"-x5koay_87\"><li class=\"list__item\" id=\"-x5koay_88\"><p id=\"-x5koay_91\">Wrong tab (subscribers vs bills).</p></li><li class=\"list__item\" id=\"-x5koay_89\"><p id=\"-x5koay_92\">Wrong month.</p></li><li class=\"list__item\" id=\"-x5koay_90\"><p id=\"-x5koay_93\">Select all without excluding closed accounts.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-x5koay_94\"><thead><tr class=\"ijRowHead\" id=\"-x5koay_95\"><th id=\"-x5koay_98\"><p>Problem</p></th><th id=\"-x5koay_99\"><p>What to try</p></th></tr></thead><tbody><tr id=\"-x5koay_96\"><td id=\"-x5koay_100\"><p>List empty</p></td><td id=\"-x5koay_101\"><p><a data-tooltip=\"Three tools on one screen: see all bills, create special one-off bills, and run monthly generation for many subscribers.\" href=\"bills.html\" id=\"-x5koay_102\">Bills</a> for that month; widen filters</p></td></tr><tr id=\"-x5koay_97\"><td id=\"-x5koay_103\"><p>Confirm greyed out</p></td><td id=\"-x5koay_104\"><p>Name, template, selection required</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2><ul class=\"list _bullet\" id=\"-x5koay_105\"><li class=\"list__item\" id=\"-x5koay_106\"><p id=\"-x5koay_109\"><a data-tooltip=\"Send the same message to many subscribers at once. See past campaigns and open details to check delivery.\" href=\"sms-campaigns.html\" id=\"-x5koay_110\">SMS Campaigns</a></p></li><li class=\"list__item\" id=\"-x5koay_107\"><p id=\"-x5koay_111\"><a data-tooltip=\"Ready-made SMS text with placeholders (name, amount, month). Reuse in campaigns so every message is consistent and professional.\" href=\"sms-templates.html\" id=\"-x5koay_112\">SMS Templates</a></p></li><li class=\"list__item\" id=\"-x5koay_108\"><p id=\"-x5koay_113\"><a data-tooltip=\"This is the main workflow most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.\" href=\"monthly-billing-workflow.html\" id=\"-x5koay_114\">Monthly billing workflow</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"sms-campaign-details.html\">SMS Campaign Details</a><a class=\"navigation-links__next\" href=\"wallet.html\">Wallet</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"fymzfq_13\">معالج لـ <span class=\"control\" id=\"fymzfq_14\">اختيار المستلمين</span>، اختيار <span class=\"control\" id=\"fymzfq_15\">قالب</span>، معاينة النص، و<span class=\"control\" id=\"fymzfq_16\">الإرسال</span>.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">قبل أن تبدأ</h2><ul class=\"list _bullet\" id=\"fymzfq_17\"><li class=\"list__item\" id=\"fymzfq_18\"><p id=\"fymzfq_21\">قالب في <a data-tooltip=\"نصوص SMS جاهزة مع placeholders (الاسم، المبلغ، الشهر). أعد استخدامها في الحملات لرسائل متسقة ومهنية.\" href=\"sms-templates.html\" id=\"fymzfq_22\">SMS Templates</a>.</p></li><li class=\"list__item\" id=\"fymzfq_19\"><p id=\"fymzfq_23\">الفواتير مُولَّدة إن كنت تستخدم تبويب <span class=\"control\" id=\"fymzfq_24\">Bills</span>.</p></li><li class=\"list__item\" id=\"fymzfq_20\"><p id=\"fymzfq_25\"><a data-tooltip=\"الرصيد الذي تحتفظ به لدى Echtirak لدفع خدمات المنصة (SMS، رسوم الاشتراك). ليس نقد المشتركين — ذلك يمر عبر Bill Collections.\" href=\"wallet.html\" id=\"fymzfq_26\">Wallet</a> جاهز.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">سير العمل المعتاد</h2><ol class=\"list _decimal\" id=\"fymzfq_27\" type=\"1\"><li class=\"list__item\" id=\"fymzfq_29\"><p id=\"fymzfq_35\">سمّ الحملة (الشهر + الغرض).</p></li><li class=\"list__item\" id=\"fymzfq_30\"><p id=\"fymzfq_36\">اختر القالب.</p></li><li class=\"list__item\" id=\"fymzfq_31\"><p id=\"fymzfq_37\">تبويب <span class=\"control\" id=\"fymzfq_38\">Bills</span> → year/month صحيحان → ألغِ الاستثناءات.</p></li><li class=\"list__item\" id=\"fymzfq_32\"><p id=\"fymzfq_39\"><span class=\"control\" id=\"fymzfq_40\">Preview</span> لرسالة واحدة.</p></li><li class=\"list__item\" id=\"fymzfq_33\"><p id=\"fymzfq_41\"><span class=\"control\" id=\"fymzfq_42\">Confirm</span> الإرسال.</p></li><li class=\"list__item\" id=\"fymzfq_34\"><p id=\"fymzfq_43\">راجع <a data-tooltip=\"بعد الإرسال، اعرض نتائج التسليم: sent، delivered، failed، pending — وصحّح الأرقام المشكلة.\" href=\"sms-campaign-details.html\" id=\"fymzfq_44\">SMS Campaign Details</a>.</p></li></ol><aside class=\"prompt\" data-title=\"\" data-type=\"tip\" id=\"fymzfq_28\"><p id=\"fymzfq_45\"><span class=\"control\" id=\"fymzfq_46\">تبويب Bills</span> = إشعارات شهر الفاتورة. <span class=\"control\" id=\"fymzfq_47\">تبويب Subscribers</span> = أخبار عامة غير مربوطة بفاتورة واحدة.</p></aside></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">ما تراه على هذه الصفحة</h2><p id=\"fymzfq_48\">اسم الحملة؛ القالب؛ تبويبا <span class=\"control\" id=\"fymzfq_51\">Bills</span> | <span class=\"control\" id=\"fymzfq_52\">Subscribers</span>؛ جدول المستلمين؛ مربعات اختيار؛ <span class=\"control\" id=\"fymzfq_53\">Preview</span>؛ نافذة <span class=\"control\" id=\"fymzfq_54\">Confirmation</span>.</p><section class=\"chapter\"><h3 data-toc=\"bills\" id=\"bills\">تبويب: Bills</h3><p id=\"fymzfq_55\">مشتركون لديهم فواتير في الفترة المختارة.</p></section><section class=\"chapter\"><h3 data-toc=\"subscribers\" id=\"subscribers\">تبويب: Subscribers</h3><p id=\"fymzfq_56\">اختر أشخاصاً مباشرة (حسب generator/بحث).</p></section></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">خطوة بخطوة</h2><ol class=\"list _decimal\" id=\"fymzfq_57\" type=\"1\"><li class=\"list__item\" id=\"fymzfq_58\"><p id=\"fymzfq_64\">SMS Campaigns → create.</p></li><li class=\"list__item\" id=\"fymzfq_59\"><p id=\"fymzfq_65\">الاسم: <code class=\"code\" id=\"fymzfq_66\">April 2026 - bills ready</code>.</p></li><li class=\"list__item\" id=\"fymzfq_60\"><p id=\"fymzfq_67\">اختر القالب.</p></li><li class=\"list__item\" id=\"fymzfq_61\"><p id=\"fymzfq_68\">تبويب Bills → حدّد <span class=\"control\" id=\"fymzfq_69\">year/month</span> → راجع عدد القائمة.</p></li><li class=\"list__item\" id=\"fymzfq_62\"><p id=\"fymzfq_70\">Preview → اقرأ كما يراها المشترك.</p></li><li class=\"list__item\" id=\"fymzfq_63\"><p id=\"fymzfq_71\">Confirm → انتظر اكتمال الحالة.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">أخطاء التحقق</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"fymzfq_72\"><thead><tr class=\"ijRowHead\" id=\"fymzfq_73\"><th id=\"fymzfq_78\"><p>المشكلة</p></th><th id=\"fymzfq_79\"><p>النتيجة</p></th></tr></thead><tbody><tr id=\"fymzfq_74\"><td id=\"fymzfq_80\"><p>قائمة فارغة في Bills</p></td><td id=\"fymzfq_81\"><p>لا فواتير ذلك الشهر — ولّد أولاً</p></td></tr><tr id=\"fymzfq_75\"><td id=\"fymzfq_82\"><p>لا اسم / لا قالب</p></td><td id=\"fymzfq_83\"><p>الإرسال معطّل</p></td></tr><tr id=\"fymzfq_76\"><td id=\"fymzfq_84\"><p>لا شيء محدد</p></td><td id=\"fymzfq_85\"><p>لا يمكن Confirm</p></td></tr><tr id=\"fymzfq_77\"><td id=\"fymzfq_86\"><p>Preview يظهر placeholders فارغة</p></td><td id=\"fymzfq_87\"><p>قالب خاطئ — صحّح باستخدام قائمة الـ picker فقط</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"fymzfq_88\"><li class=\"list__item\" id=\"fymzfq_89\"><p id=\"fymzfq_92\">تبويب خاطئ (subscribers مقابل bills).</p></li><li class=\"list__item\" id=\"fymzfq_90\"><p id=\"fymzfq_93\">شهر خاطئ.</p></li><li class=\"list__item\" id=\"fymzfq_91\"><p id=\"fymzfq_94\">Select all دون استبعاد حسابات مغلقة.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"fymzfq_95\"><thead><tr class=\"ijRowHead\" id=\"fymzfq_96\"><th id=\"fymzfq_99\"><p>المشكلة</p></th><th id=\"fymzfq_100\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"fymzfq_97\"><td id=\"fymzfq_101\"><p>قائمة فارغة</p></td><td id=\"fymzfq_102\"><p><a data-tooltip=\"ثلاث أدوات في شاشة واحدة: عرض كل الفواتير، إنشاء فواتير استثنائية لمرة واحدة، وتشغيل التوليد الشهري لعدة مشتركين.\" href=\"bills.html\" id=\"fymzfq_103\">Bills</a> لذلك الشهر؛ وسّع الفلاتر</p></td></tr><tr id=\"fymzfq_98\"><td id=\"fymzfq_104\"><p>Confirm رمادي</p></td><td id=\"fymzfq_105\"><p>الاسم والقالب والاختيار مطلوبة</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"fymzfq_106\"><li class=\"list__item\" id=\"fymzfq_107\"><p id=\"fymzfq_110\"><a data-tooltip=\"إرسال نفس الرسالة إلى عدة مشتركين دفعة واحدة. اعرض الحملات السابقة وافتح التفاصيل للتحقق من التسليم.\" href=\"sms-campaigns.html\" id=\"fymzfq_111\">SMS Campaigns</a></p></li><li class=\"list__item\" id=\"fymzfq_108\"><p id=\"fymzfq_112\"><a data-tooltip=\"نصوص SMS جاهزة مع placeholders (الاسم، المبلغ، الشهر). أعد استخدامها في الحملات لرسائل متسقة ومهنية.\" href=\"sms-templates.html\" id=\"fymzfq_113\">SMS Templates</a></p></li><li class=\"list__item\" id=\"fymzfq_109\"><p id=\"fymzfq_114\"><a data-tooltip=\"هذا سير العمل الرئيسي الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.\" href=\"monthly-billing-workflow.html\" id=\"fymzfq_115\">دورة الفوترة الشهرية</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"sms-campaign-details.html\">SMS Campaign Details</a><a class=\"navigation-links__next\" href=\"wallet.html\">Wallet</a></div>"
        },
        "keywords": [
            "Create SMS Campaign",
            "Messages to subscribers",
            "sms campaign create",
            "رسائل للمشتركين"
        ]
    },
    {
        "id": "wallet",
        "slug": "wallet",
        "fileName": "wallet.html",
        "title": {
            "en": "Wallet",
            "ar": "Wallet"
        },
        "group": {
            "en": "Account",
            "ar": "الحساب"
        },
        "appRoute": "wallet",
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start",
                "title": {
                    "en": "Before you start",
                    "ar": "قبل أن تبدأ"
                }
            },
            {
                "id": "your-regular-workflow",
                "title": {
                    "en": "Your regular workflow",
                    "ar": "سير العمل المعتاد"
                }
            },
            {
                "id": "what-you-see-on-this-page",
                "title": {
                    "en": "What you see on this page",
                    "ar": "ما تراه على هذه الصفحة"
                }
            },
            {
                "id": "step-by-step",
                "title": {
                    "en": "Step-by-step",
                    "ar": "خطوة بخطوة"
                }
            },
            {
                "id": "validation-mistakes",
                "title": {
                    "en": "Validation mistakes",
                    "ar": "أخطاء التحقق"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2><p id=\"-qbnzka_12\">Balance you keep with <span class=\"control\" id=\"-qbnzka_13\">Echtirak</span> to pay for platform services (SMS, subscription charges). <span class=\"control\" id=\"-qbnzka_14\">Not</span> cash from subscribers — that flows through <a data-tooltip=\"Review money your collectors recorded in the field. Approve when correct; reject when wrong. Until you approve, the payment is not final in your reports.\" href=\"bill-collections.html\" id=\"-qbnzka_15\">Bill Collections</a>.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">Before you start</h2><ul class=\"list _bullet\" id=\"-qbnzka_16\"><li class=\"list__item\" id=\"-qbnzka_17\"><p id=\"-qbnzka_18\">Understand your contract: what wallet pays for (SMS, monthly platform fee, etc.).</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">Your regular workflow</h2><ul class=\"list _bullet\" id=\"-qbnzka_19\"><li class=\"list__item\" id=\"-qbnzka_20\"><p id=\"-qbnzka_24\"><span class=\"control\" id=\"-qbnzka_25\">Weekly:</span> Glance at balance if you send SMS often.</p></li><li class=\"list__item\" id=\"-qbnzka_21\"><p id=\"-qbnzka_26\"><span class=\"control\" id=\"-qbnzka_27\">Before big SMS:</span> Check balance and projected charge.</p></li><li class=\"list__item\" id=\"-qbnzka_22\"><p id=\"-qbnzka_28\"><span class=\"control\" id=\"-qbnzka_29\">After top-up:</span> Refresh and read <span class=\"control\" id=\"-qbnzka_30\">Wallet Transactions</span>.</p></li><li class=\"list__item\" id=\"-qbnzka_23\"><p id=\"-qbnzka_31\"><span class=\"control\" id=\"-qbnzka_32\">Monthly:</span> Compare projected charge to budget before billing cycle.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">What you see on this page</h2><p id=\"-qbnzka_33\"><span class=\"control\" id=\"-qbnzka_34\">Overview:</span> current balance, next billing date, projected charge, caps. <br/><span class=\"control\" id=\"-qbnzka_36\">Wallet Transactions:</span> money in/out list.</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">Step-by-step</h2><ol class=\"list _decimal\" id=\"-qbnzka_37\" type=\"1\"><li class=\"list__item\" id=\"-qbnzka_38\"><p id=\"-qbnzka_42\">Open Wallet.</p></li><li class=\"list__item\" id=\"-qbnzka_39\"><p id=\"-qbnzka_43\">Read <span class=\"control\" id=\"-qbnzka_44\">projected next charge</span> and <span class=\"control\" id=\"-qbnzka_45\">days until billing</span>.</p></li><li class=\"list__item\" id=\"-qbnzka_40\"><p id=\"-qbnzka_46\">If balance low → arrange top-up with Echtirak support before SMS campaigns.</p></li><li class=\"list__item\" id=\"-qbnzka_41\"><p id=\"-qbnzka_47\">After SMS, check transactions for SMS charges.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">Validation mistakes</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-qbnzka_48\"><thead><tr class=\"ijRowHead\" id=\"-qbnzka_49\"><th id=\"-qbnzka_52\"><p>Issue</p></th><th id=\"-qbnzka_53\"><p>Result</p></th></tr></thead><tbody><tr id=\"-qbnzka_50\"><td id=\"-qbnzka_54\"><p>Insufficient balance</p></td><td id=\"-qbnzka_55\"><p>SMS failures in campaign details</p></td></tr><tr id=\"-qbnzka_51\"><td id=\"-qbnzka_56\"><p>Over cap</p></td><td id=\"-qbnzka_57\"><p>Charges may stop — contact support</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2><ul class=\"list _bullet\" id=\"-qbnzka_58\"><li class=\"list__item\" id=\"-qbnzka_59\"><p id=\"-qbnzka_62\">Confusing wallet with street collections.</p></li><li class=\"list__item\" id=\"-qbnzka_60\"><p id=\"-qbnzka_63\">Zero balance then blaming SMS “not working”.</p></li><li class=\"list__item\" id=\"-qbnzka_61\"><p id=\"-qbnzka_64\">Ignoring <span class=\"control\" id=\"-qbnzka_65\">override cap</span> messages.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-qbnzka_66\"><thead><tr class=\"ijRowHead\" id=\"-qbnzka_67\"><th id=\"-qbnzka_71\"><p>Problem</p></th><th id=\"-qbnzka_72\"><p>What to try</p></th></tr></thead><tbody><tr id=\"-qbnzka_68\"><td id=\"-qbnzka_73\"><p>SMS all failed</p></td><td id=\"-qbnzka_74\"><p>Top up wallet; retry small test campaign</p></td></tr><tr id=\"-qbnzka_69\"><td id=\"-qbnzka_75\"><p>Unknown debit</p></td><td id=\"-qbnzka_76\"><p>Note date from transactions; email support</p></td></tr><tr id=\"-qbnzka_70\"><td id=\"-qbnzka_77\"><p>Balance not updated after payment</p></td><td id=\"-qbnzka_78\"><p>Allow processing time; send receipt to support</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2><ul class=\"list _bullet\" id=\"-qbnzka_79\"><li class=\"list__item\" id=\"-qbnzka_80\"><p id=\"-qbnzka_83\"><a data-tooltip=\"Send the same message to many subscribers at once. See past campaigns and open details to check delivery.\" href=\"sms-campaigns.html\" id=\"-qbnzka_84\">SMS Campaigns</a></p></li><li class=\"list__item\" id=\"-qbnzka_81\"><p id=\"-qbnzka_85\"><a data-tooltip=\"Your control room. See subscribers, money, bills, collections, and wallet at a glance. Use it to decide what to do first each day.\" href=\"dashboard.html\" id=\"-qbnzka_86\">Dashboard</a></p></li><li class=\"list__item\" id=\"-qbnzka_82\"><p id=\"-qbnzka_87\"><a data-tooltip=\"This is the main workflow most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.\" href=\"monthly-billing-workflow.html\" id=\"-qbnzka_88\">Monthly billing workflow</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"sms-campaign-create.html\">Create SMS Campaign</a><a class=\"navigation-links__next\" href=\"profile.html\">Profile</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"z4oq8ue_13\">الرصيد الذي تحتفظ به لدى <span class=\"control\" id=\"z4oq8ue_14\">Echtirak</span> لدفع خدمات المنصة (SMS، رسوم الاشتراك). <span class=\"control\" id=\"z4oq8ue_15\">ليس</span> نقد المشتركين — ذلك يمر عبر <a data-tooltip=\"مراجعة الأموال التي سجّلها الجامعون في الميدان. Approve إن كانت صحيحة؛ Reject إن كانت خاطئة. حتى تعتمد، الدفعة غير نهائية في تقاريرك.\" href=\"bill-collections.html\" id=\"z4oq8ue_16\">Bill Collections</a>.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">قبل أن تبدأ</h2><ul class=\"list _bullet\" id=\"z4oq8ue_17\"><li class=\"list__item\" id=\"z4oq8ue_18\"><p id=\"z4oq8ue_19\">افهم عقدك: ماذا يدفع الـ wallet (SMS، رسوم شهرية للمنصة، إلخ).</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">سير العمل المعتاد</h2><ul class=\"list _bullet\" id=\"z4oq8ue_20\"><li class=\"list__item\" id=\"z4oq8ue_21\"><p id=\"z4oq8ue_25\"><span class=\"control\" id=\"z4oq8ue_26\">أسبوعياً:</span> نظرة على الرصيد إن أرسلت SMS كثيراً.</p></li><li class=\"list__item\" id=\"z4oq8ue_22\"><p id=\"z4oq8ue_27\"><span class=\"control\" id=\"z4oq8ue_28\">قبل SMS كبير:</span> تحقق من الرصيد والتكلفة المتوقعة.</p></li><li class=\"list__item\" id=\"z4oq8ue_23\"><p id=\"z4oq8ue_29\"><span class=\"control\" id=\"z4oq8ue_30\">بعد الشحن:</span> حدّث واقرأ <span class=\"control\" id=\"z4oq8ue_31\">Wallet Transactions</span>.</p></li><li class=\"list__item\" id=\"z4oq8ue_24\"><p id=\"z4oq8ue_32\"><span class=\"control\" id=\"z4oq8ue_33\">شهرياً:</span> قارن الرسوم المتوقعة بالميزانية قبل دورة الفوترة.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">ما تراه على هذه الصفحة</h2><p id=\"z4oq8ue_34\"><span class=\"control\" id=\"z4oq8ue_35\">Overview:</span> الرصيد الحالي، تاريخ الفوترة القادم، الرسوم المتوقعة، السقوف. <br/><span class=\"control\" id=\"z4oq8ue_37\">Wallet Transactions:</span> قائمة الداخل والخارج.</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">خطوة بخطوة</h2><ol class=\"list _decimal\" id=\"z4oq8ue_38\" type=\"1\"><li class=\"list__item\" id=\"z4oq8ue_39\"><p id=\"z4oq8ue_43\">افتح Wallet.</p></li><li class=\"list__item\" id=\"z4oq8ue_40\"><p id=\"z4oq8ue_44\">اقرأ <span class=\"control\" id=\"z4oq8ue_45\">projected next charge</span> و <span class=\"control\" id=\"z4oq8ue_46\">days until billing</span>.</p></li><li class=\"list__item\" id=\"z4oq8ue_41\"><p id=\"z4oq8ue_47\">إن كان الرصيد منخفضاً → رتّب شحناً مع دعم Echtirak قبل حملات SMS.</p></li><li class=\"list__item\" id=\"z4oq8ue_42\"><p id=\"z4oq8ue_48\">بعد SMS، راجع المعاملات لرسوم SMS.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">أخطاء التحقق</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"z4oq8ue_49\"><thead><tr class=\"ijRowHead\" id=\"z4oq8ue_50\"><th id=\"z4oq8ue_53\"><p>المشكلة</p></th><th id=\"z4oq8ue_54\"><p>النتيجة</p></th></tr></thead><tbody><tr id=\"z4oq8ue_51\"><td id=\"z4oq8ue_55\"><p>رصيد غير كافٍ</p></td><td id=\"z4oq8ue_56\"><p>فشل SMS في تفاصيل الحملة</p></td></tr><tr id=\"z4oq8ue_52\"><td id=\"z4oq8ue_57\"><p>تجاوز السقف</p></td><td id=\"z4oq8ue_58\"><p>قد تتوقف الرسوم — تواصل مع الدعم</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"z4oq8ue_59\"><li class=\"list__item\" id=\"z4oq8ue_60\"><p id=\"z4oq8ue_63\">الخلط بين wallet وتحصيل الشارع.</p></li><li class=\"list__item\" id=\"z4oq8ue_61\"><p id=\"z4oq8ue_64\">رصيد صفر ثم لوم «SMS لا يعمل».</p></li><li class=\"list__item\" id=\"z4oq8ue_62\"><p id=\"z4oq8ue_65\">تجاهل رسائل <span class=\"control\" id=\"z4oq8ue_66\">override cap</span>.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"z4oq8ue_67\"><thead><tr class=\"ijRowHead\" id=\"z4oq8ue_68\"><th id=\"z4oq8ue_72\"><p>المشكلة</p></th><th id=\"z4oq8ue_73\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"z4oq8ue_69\"><td id=\"z4oq8ue_74\"><p>كل SMS فشل</p></td><td id=\"z4oq8ue_75\"><p>اشحن wallet؛ أعد حملة اختبار صغيرة</p></td></tr><tr id=\"z4oq8ue_70\"><td id=\"z4oq8ue_76\"><p>خصم مجهول</p></td><td id=\"z4oq8ue_77\"><p>سجّل التاريخ من المعاملات؛ راسل الدعم</p></td></tr><tr id=\"z4oq8ue_71\"><td id=\"z4oq8ue_78\"><p>الرصيد لم يتحدّث بعد الدفع</p></td><td id=\"z4oq8ue_79\"><p>امنح وقتاً للمعالجة؛ أرسل إيصالاً للدعم</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"z4oq8ue_80\"><li class=\"list__item\" id=\"z4oq8ue_81\"><p id=\"z4oq8ue_84\"><a data-tooltip=\"إرسال نفس الرسالة إلى عدة مشتركين دفعة واحدة. اعرض الحملات السابقة وافتح التفاصيل للتحقق من التسليم.\" href=\"sms-campaigns.html\" id=\"z4oq8ue_85\">SMS Campaigns</a></p></li><li class=\"list__item\" id=\"z4oq8ue_82\"><p id=\"z4oq8ue_86\"><a data-tooltip=\"غرفة التحكم لديك. ترى المشتركين والأموال والفواتير والتحصيل والـ wallet بنظرة واحدة. استخدمها لتحديد ماذا تفعل أولاً كل يوم.\" href=\"dashboard.html\" id=\"z4oq8ue_87\">Dashboard</a></p></li><li class=\"list__item\" id=\"z4oq8ue_83\"><p id=\"z4oq8ue_88\"><a data-tooltip=\"هذا سير العمل الرئيسي الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.\" href=\"monthly-billing-workflow.html\" id=\"z4oq8ue_89\">دورة الفوترة الشهرية</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"sms-campaign-create.html\">Create SMS Campaign</a><a class=\"navigation-links__next\" href=\"profile.html\">Profile</a></div>"
        },
        "keywords": [
            "Account",
            "Wallet",
            "wallet",
            "الحساب"
        ]
    },
    {
        "id": "profile",
        "slug": "profile",
        "fileName": "profile.html",
        "title": {
            "en": "Profile",
            "ar": "Profile"
        },
        "group": {
            "en": "Account",
            "ar": "الحساب"
        },
        "appRoute": "profile",
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start",
                "title": {
                    "en": "Before you start",
                    "ar": "قبل أن تبدأ"
                }
            },
            {
                "id": "your-regular-workflow",
                "title": {
                    "en": "Your regular workflow",
                    "ar": "سير العمل المعتاد"
                }
            },
            {
                "id": "what-you-see-on-this-page",
                "title": {
                    "en": "What you see on this page",
                    "ar": "ما تراه على هذه الصفحة"
                }
            },
            {
                "id": "step-by-step",
                "title": {
                    "en": "Step-by-step",
                    "ar": "خطوة بخطوة"
                }
            },
            {
                "id": "validation-mistakes",
                "title": {
                    "en": "Validation mistakes",
                    "ar": "أخطاء التحقق"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2><p id=\"-mpbk9a_12\">Your <span class=\"control\" id=\"-mpbk9a_13\">business identity</span> in Echtirak: name and contact details that may appear on bills and reports.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">Before you start</h2><ul class=\"list _bullet\" id=\"-mpbk9a_14\"><li class=\"list__item\" id=\"-mpbk9a_15\"><p id=\"-mpbk9a_16\">Know correct legal or trade name and phone for subscribers to reach you.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">Your regular workflow</h2><ul class=\"list _bullet\" id=\"-mpbk9a_17\"><li class=\"list__item\" id=\"-mpbk9a_18\"><p id=\"-mpbk9a_21\"><span class=\"control\" id=\"-mpbk9a_22\">Once after login:</span> Verify name and phone.</p></li><li class=\"list__item\" id=\"-mpbk9a_19\"><p id=\"-mpbk9a_23\"><span class=\"control\" id=\"-mpbk9a_24\">When you rebrand or change number:</span> Update and print one test bill.</p></li><li class=\"list__item\" id=\"-mpbk9a_20\"><p id=\"-mpbk9a_25\"><span class=\"control\" id=\"-mpbk9a_26\">Rare:</span> After change, tell collectors and office staff.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">What you see on this page</h2><p id=\"-mpbk9a_27\">Business / owner fields; <span class=\"control\" id=\"-mpbk9a_28\">Save</span> button.</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">Step-by-step</h2><ol class=\"list _decimal\" id=\"-mpbk9a_29\" type=\"1\"><li class=\"list__item\" id=\"-mpbk9a_30\"><p id=\"-mpbk9a_34\">Top right → <span class=\"control\" id=\"-mpbk9a_35\">Profile</span>.</p></li><li class=\"list__item\" id=\"-mpbk9a_31\"><p id=\"-mpbk9a_36\">Edit phone, email, address fields shown.</p></li><li class=\"list__item\" id=\"-mpbk9a_32\"><p id=\"-mpbk9a_37\">Save → wait for success message.</p></li><li class=\"list__item\" id=\"-mpbk9a_33\"><p id=\"-mpbk9a_38\">Optional: generate PDF bill sample to confirm print header.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">Validation mistakes</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-mpbk9a_39\"><thead><tr class=\"ijRowHead\" id=\"-mpbk9a_40\"><th id=\"-mpbk9a_43\"><p>Issue</p></th><th id=\"-mpbk9a_44\"><p>Result</p></th></tr></thead><tbody><tr id=\"-mpbk9a_41\"><td id=\"-mpbk9a_45\"><p>Required field empty</p></td><td id=\"-mpbk9a_46\"><p>Save blocked — red hints</p></td></tr><tr id=\"-mpbk9a_42\"><td id=\"-mpbk9a_47\"><p>Invalid email/phone format</p></td><td id=\"-mpbk9a_48\"><p>May show validation message</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2><ul class=\"list _bullet\" id=\"-mpbk9a_49\"><li class=\"list__item\" id=\"-mpbk9a_50\"><p id=\"-mpbk9a_52\">Old phone on bills — subscribers call wrong number.</p></li><li class=\"list__item\" id=\"-mpbk9a_51\"><p id=\"-mpbk9a_53\">Frequent name changes — confusion on printed bills already delivered.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-mpbk9a_54\"><thead><tr class=\"ijRowHead\" id=\"-mpbk9a_55\"><th id=\"-mpbk9a_58\"><p>Problem</p></th><th id=\"-mpbk9a_59\"><p>What to try</p></th></tr></thead><tbody><tr id=\"-mpbk9a_56\"><td id=\"-mpbk9a_60\"><p>Save fails</p></td><td id=\"-mpbk9a_61\"><p>Fill all required fields</p></td></tr><tr id=\"-mpbk9a_57\"><td id=\"-mpbk9a_62\"><p>Old name on PDF</p></td><td id=\"-mpbk9a_63\"><p>New bills only — reprint if needed</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2><ul class=\"list _bullet\" id=\"-mpbk9a_64\"><li class=\"list__item\" id=\"-mpbk9a_65\"><p id=\"-mpbk9a_67\"><a data-tooltip=\"Learn how to sign in, use the left menu, and which guide to open for each task. After this page, complete the Setup checklist, then use the Monthly billing workflow every month.\" href=\"getting-started.html\" id=\"-mpbk9a_68\">Getting started</a></p></li><li class=\"list__item\" id=\"-mpbk9a_66\"><p id=\"-mpbk9a_69\"><a data-tooltip=\"Three tools on one screen: see all bills, create special one-off bills, and run monthly generation for many subscribers.\" href=\"bills.html\" id=\"-mpbk9a_70\">Bills</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"wallet.html\">Wallet</a><a class=\"navigation-links__next\" href=\"announcements.html\">Announcements</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"f8gyoy_13\"><span class=\"control\" id=\"f8gyoy_14\">هوية عملك</span> في Echtirak: الاسم وبيانات الاتصال التي قد تظهر على الفواتير والتقارير.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">قبل أن تبدأ</h2><ul class=\"list _bullet\" id=\"f8gyoy_15\"><li class=\"list__item\" id=\"f8gyoy_16\"><p id=\"f8gyoy_17\">تعرف الاسم التجاري أو القانوني الصحيح والهاتف الذي يتصل به المشتركون.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">سير العمل المعتاد</h2><ul class=\"list _bullet\" id=\"f8gyoy_18\"><li class=\"list__item\" id=\"f8gyoy_19\"><p id=\"f8gyoy_22\"><span class=\"control\" id=\"f8gyoy_23\">مرة بعد الدخول:</span> تحقق من الاسم والهاتف.</p></li><li class=\"list__item\" id=\"f8gyoy_20\"><p id=\"f8gyoy_24\"><span class=\"control\" id=\"f8gyoy_25\">عند تغيير العلامة أو الرقم:</span> حدّث واطبع فاتورة تجريبية.</p></li><li class=\"list__item\" id=\"f8gyoy_21\"><p id=\"f8gyoy_26\"><span class=\"control\" id=\"f8gyoy_27\">نادراً:</span> بعد التغيير، أخبر الجامعين وموظفي المكتب.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">ما تراه على هذه الصفحة</h2><p id=\"f8gyoy_28\">حقول العمل / المالك؛ زر <span class=\"control\" id=\"f8gyoy_29\">Save</span>.</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">خطوة بخطوة</h2><ol class=\"list _decimal\" id=\"f8gyoy_30\" type=\"1\"><li class=\"list__item\" id=\"f8gyoy_31\"><p id=\"f8gyoy_35\">أعلى اليمين → <span class=\"control\" id=\"f8gyoy_36\">Profile</span>.</p></li><li class=\"list__item\" id=\"f8gyoy_32\"><p id=\"f8gyoy_37\">عدّل الهاتف والبريد والعنوان الظاهرة.</p></li><li class=\"list__item\" id=\"f8gyoy_33\"><p id=\"f8gyoy_38\"><span class=\"control\" id=\"f8gyoy_39\">Save</span> → انتظر رسالة النجاح.</p></li><li class=\"list__item\" id=\"f8gyoy_34\"><p id=\"f8gyoy_40\">اختياري: ولّد PDF فاتورة للتأكد من ترويسة الطباعة.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">أخطاء التحقق</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"f8gyoy_41\"><thead><tr class=\"ijRowHead\" id=\"f8gyoy_42\"><th id=\"f8gyoy_45\"><p>المشكلة</p></th><th id=\"f8gyoy_46\"><p>النتيجة</p></th></tr></thead><tbody><tr id=\"f8gyoy_43\"><td id=\"f8gyoy_47\"><p>حقل مطلوب فارغ</p></td><td id=\"f8gyoy_48\"><p>الحفظ ممنوع — تلميحات حمراء</p></td></tr><tr id=\"f8gyoy_44\"><td id=\"f8gyoy_49\"><p>صيغة بريد/هاتف غير صالحة</p></td><td id=\"f8gyoy_50\"><p>قد تظهر رسالة تحقق</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"f8gyoy_51\"><li class=\"list__item\" id=\"f8gyoy_52\"><p id=\"f8gyoy_54\">هاتف قديم على الفواتير — المشتركون يتصلون برقم خاطئ.</p></li><li class=\"list__item\" id=\"f8gyoy_53\"><p id=\"f8gyoy_55\">تغيير الاسم كثيراً — ارتباك على فواتير مطبوعة ومسلّمة.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"f8gyoy_56\"><thead><tr class=\"ijRowHead\" id=\"f8gyoy_57\"><th id=\"f8gyoy_60\"><p>المشكلة</p></th><th id=\"f8gyoy_61\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"f8gyoy_58\"><td id=\"f8gyoy_62\"><p>فشل الحفظ</p></td><td id=\"f8gyoy_63\"><p>املأ كل الحقول المطلوبة</p></td></tr><tr id=\"f8gyoy_59\"><td id=\"f8gyoy_64\"><p>اسم قديم على PDF</p></td><td id=\"f8gyoy_65\"><p>للفواتير الجديدة فقط — أعد الطباعة إن لزم</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"f8gyoy_66\"><li class=\"list__item\" id=\"f8gyoy_67\"><p id=\"f8gyoy_69\"><a data-tooltip=\"تتعلم تسجيل الدخول، استخدام القائمة اليسرى، وأي دليل تفتح لكل مهمة. بعد هذه الصفحة، أكمل قائمة الإعداد، ثم استخدم دورة الفوترة الشهرية كل شهر.\" href=\"getting-started.html\" id=\"f8gyoy_70\">البدء</a></p></li><li class=\"list__item\" id=\"f8gyoy_68\"><p id=\"f8gyoy_71\"><a data-tooltip=\"ثلاث أدوات في شاشة واحدة: عرض كل الفواتير، إنشاء فواتير استثنائية لمرة واحدة، وتشغيل التوليد الشهري لعدة مشتركين.\" href=\"bills.html\" id=\"f8gyoy_72\">Bills</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"wallet.html\">Wallet</a><a class=\"navigation-links__next\" href=\"announcements.html\">Announcements</a></div>"
        },
        "keywords": [
            "Account",
            "Profile",
            "profile",
            "الحساب"
        ]
    },
    {
        "id": "announcements",
        "slug": "announcements",
        "fileName": "announcements.html",
        "title": {
            "en": "Announcements",
            "ar": "Announcements"
        },
        "group": {
            "en": "Account",
            "ar": "الحساب"
        },
        "appRoute": "announcements",
        "sections": [
            {
                "id": "what-this-page-is-for",
                "title": {
                    "en": "What this page is for",
                    "ar": "الغرض من هذه الصفحة"
                }
            },
            {
                "id": "before-you-start",
                "title": {
                    "en": "Before you start",
                    "ar": "قبل أن تبدأ"
                }
            },
            {
                "id": "your-regular-workflow",
                "title": {
                    "en": "Your regular workflow",
                    "ar": "سير العمل المعتاد"
                }
            },
            {
                "id": "what-you-see-on-this-page",
                "title": {
                    "en": "What you see on this page",
                    "ar": "ما تراه على هذه الصفحة"
                }
            },
            {
                "id": "step-by-step",
                "title": {
                    "en": "Step-by-step",
                    "ar": "خطوة بخطوة"
                }
            },
            {
                "id": "validation-mistakes",
                "title": {
                    "en": "Validation mistakes",
                    "ar": "أخطاء التحقق"
                }
            },
            {
                "id": "common-mistakes",
                "title": {
                    "en": "Common mistakes",
                    "ar": "أخطاء شائعة"
                }
            },
            {
                "id": "troubleshooting",
                "title": {
                    "en": "Troubleshooting",
                    "ar": "استكشاف الأخطاء"
                }
            },
            {
                "id": "related-pages",
                "title": {
                    "en": "Related pages",
                    "ar": "صفحات ذات صلة"
                }
            }
        ],
        "contentHtml": {
            "en": "<section class=\"chapter\">\n<h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">What this page is for</h2>\n<p id=\"z71wj3_12\"><span class=\"control\" id=\"z71wj3_13\">Messages from Echtirak</span> or your\n                                administrator: maintenance windows, new features, billing reminders, policy changes.</p>\n</section>\n<section class=\"chapter\">\n<h2 data-toc=\"before-you-start\" id=\"before-you-start\">Before you start</h2>\n<p id=\"z71wj3_14\">None — open when you see a notification or badge.</p>\n</section>\n<section class=\"chapter\">\n<h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">Your regular workflow</h2>\n<ol class=\"list _decimal\" id=\"z71wj3_15\" type=\"1\">\n<li class=\"list__item\" id=\"z71wj3_16\">\n<p id=\"z71wj3_20\">Open <span class=\"control\" id=\"z71wj3_21\">Announcements</span>\n                                        when alerted.</p>\n</li>\n<li class=\"list__item\" id=\"z71wj3_17\">\n<p id=\"z71wj3_22\">Read newest first.</p>\n</li>\n<li class=\"list__item\" id=\"z71wj3_18\">\n<p id=\"z71wj3_23\">Follow any deadline (e.g. “generate bills before the\n                                        5th”).</p>\n</li>\n<li class=\"list__item\" id=\"z71wj3_19\">\n<p id=\"z71wj3_24\">Mark read if available so you notice only new items later.</p>\n</li>\n</ol>\n</section>\n<section class=\"chapter\">\n<h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">What you see on this\n                                page</h2>\n<p id=\"z71wj3_25\">List with title and date; full text when you open an item; may include\n                                links.</p>\n</section>\n<section class=\"chapter\">\n<h2 data-toc=\"step-by-step\" id=\"step-by-step\">Step-by-step</h2>\n<ol class=\"list _decimal\" id=\"z71wj3_26\" type=\"1\">\n<li class=\"list__item\" id=\"z71wj3_27\">\n<p id=\"z71wj3_31\">Menu → Announcements.</p>\n</li>\n<li class=\"list__item\" id=\"z71wj3_28\">\n<p id=\"z71wj3_32\">Open unread items.</p>\n</li>\n<li class=\"list__item\" id=\"z71wj3_29\">\n<p id=\"z71wj3_33\">Note dates and actions.</p>\n</li>\n<li class=\"list__item\" id=\"z71wj3_30\">\n<p id=\"z71wj3_34\">Complete related work in <a data-tooltip=\"This is the main workflow most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.\" href=\"monthly-billing-workflow.html\" id=\"z71wj3_35\">Monthly\n                                            billing workflow</a> or <a data-tooltip=\"Balance you keep with Echtirak to pay for platform services (SMS, subscription charges). Not cash from subscribers — that flows through Bill Collections.\" href=\"wallet.html\" id=\"z71wj3_36\">Wallet</a>\n                                        if mentioned.</p>\n</li>\n</ol>\n</section>\n<section class=\"chapter\">\n<h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">Validation mistakes</h2>\n<p id=\"z71wj3_37\">N/A — read-only screen.</p>\n</section>\n<section class=\"chapter\">\n<h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">Common mistakes</h2>\n<ul class=\"list _bullet\" id=\"z71wj3_38\">\n<li class=\"list__item\" id=\"z71wj3_39\">\n<p id=\"z71wj3_41\">Ignoring announcements — miss rate changes or maintenance.\n                                    </p>\n</li>\n<li class=\"list__item\" id=\"z71wj3_40\">\n<p id=\"z71wj3_42\">Assuming announcement replaces normal billing steps.</p>\n</li>\n</ul>\n</section>\n<section class=\"chapter\">\n<h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">Troubleshooting</h2>\n<div class=\"table-wrapper\">\n<table class=\"wide\" id=\"z71wj3_43\">\n<thead>\n<tr class=\"ijRowHead\" id=\"z71wj3_44\">\n<th id=\"z71wj3_47\">\n<p>Problem</p>\n</th>\n<th id=\"z71wj3_48\">\n<p>What to try</p>\n</th>\n</tr>\n</thead>\n<tbody>\n<tr id=\"z71wj3_45\">\n<td id=\"z71wj3_49\">\n<p>Empty list</p>\n</td>\n<td id=\"z71wj3_50\">\n<p>No active announcements</p>\n</td>\n</tr>\n<tr id=\"z71wj3_46\">\n<td id=\"z71wj3_51\">\n<p>Link broken</p>\n</td>\n<td id=\"z71wj3_52\">\n<p>Copy URL; contact support</p>\n</td>\n</tr>\n</tbody>\n</table>\n</div>\n</section>\n<section class=\"chapter\">\n<h2 data-toc=\"related-pages\" id=\"related-pages\">Related pages</h2>\n<ul class=\"list _bullet\" id=\"z71wj3_53\">\n<li class=\"list__item\" id=\"z71wj3_54\">\n<p id=\"z71wj3_57\"><a data-tooltip=\"Learn how to sign in, use the left menu, and which guide to open for each task. After this page, complete the Setup checklist, then use the Monthly billing workflow every month.\" href=\"getting-started.html\" id=\"z71wj3_58\">Getting\n                                            started</a></p>\n</li>\n<li class=\"list__item\" id=\"z71wj3_55\">\n<p id=\"z71wj3_59\"><a data-tooltip=\"This is the main workflow most generator owners repeat every month. Follow the same order each time so readings, bills, collections, and SMS stay aligned.\" href=\"monthly-billing-workflow.html\" id=\"z71wj3_60\">Monthly\n                                            billing workflow</a></p>\n</li>\n<li class=\"list__item\" id=\"z71wj3_56\">\n<p id=\"z71wj3_61\"><a data-tooltip=\"Balance you keep with Echtirak to pay for platform services (SMS, subscription charges). Not cash from subscribers — that flows through Bill Collections.\" href=\"wallet.html\" id=\"z71wj3_62\">Wallet</a>\n</p>\n</li>\n</ul>\n</section>\n<div class=\"last-modified\">15 May 2026</div>\n<div data-feedback-placeholder=\"true\"></div>\n<div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"profile.html\">Profile</a></div>",
            "ar": "<section class=\"chapter\"><h2 data-toc=\"what-this-page-is-for\" id=\"what-this-page-is-for\">الغرض من هذه الصفحة</h2><p id=\"-fhqiox_13\"><span class=\"control\" id=\"-fhqiox_14\">رسائل من Echtirak</span> أو من المسؤول: صيانة، ميزات جديدة، تذكيرات فوترة، تغييرات سياسة.</p></section><section class=\"chapter\"><h2 data-toc=\"before-you-start\" id=\"before-you-start\">قبل أن تبدأ</h2><p id=\"-fhqiox_15\">لا شيء — افتح عند ظهور إشعار أو شارة.</p></section><section class=\"chapter\"><h2 data-toc=\"your-regular-workflow\" id=\"your-regular-workflow\">سير العمل المعتاد</h2><ol class=\"list _decimal\" id=\"-fhqiox_16\" type=\"1\"><li class=\"list__item\" id=\"-fhqiox_17\"><p id=\"-fhqiox_21\">افتح <span class=\"control\" id=\"-fhqiox_22\">Announcements</span> عند التنبيه.</p></li><li class=\"list__item\" id=\"-fhqiox_18\"><p id=\"-fhqiox_23\">اقرأ الأحدث أولاً.</p></li><li class=\"list__item\" id=\"-fhqiox_19\"><p id=\"-fhqiox_24\">اتبع أي موعد نهائي (مثلاً «ولّد الفواتير قبل اليوم 5»).</p></li><li class=\"list__item\" id=\"-fhqiox_20\"><p id=\"-fhqiox_25\">علّم كمقروء إن وُجد لتلاحظ الجديد فقط لاحقاً.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"what-you-see-on-this-page\" id=\"what-you-see-on-this-page\">ما تراه على هذه الصفحة</h2><p id=\"-fhqiox_26\">قائمة بعنوان وتاريخ؛ النص الكامل عند فتح عنصر؛ قد تتضمن روابط.</p></section><section class=\"chapter\"><h2 data-toc=\"step-by-step\" id=\"step-by-step\">خطوة بخطوة</h2><ol class=\"list _decimal\" id=\"-fhqiox_27\" type=\"1\"><li class=\"list__item\" id=\"-fhqiox_28\"><p id=\"-fhqiox_32\">القائمة → Announcements.</p></li><li class=\"list__item\" id=\"-fhqiox_29\"><p id=\"-fhqiox_33\">افتح غير المقروء.</p></li><li class=\"list__item\" id=\"-fhqiox_30\"><p id=\"-fhqiox_34\">سجّل التواريخ والإجراءات.</p></li><li class=\"list__item\" id=\"-fhqiox_31\"><p id=\"-fhqiox_35\">نفّذ العمل المرتبط في <a data-tooltip=\"هذا سير العمل الرئيسي الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.\" href=\"monthly-billing-workflow.html\" id=\"-fhqiox_36\">دورة الفوترة الشهرية</a> أو <a data-tooltip=\"الرصيد الذي تحتفظ به لدى Echtirak لدفع خدمات المنصة (SMS، رسوم الاشتراك). ليس نقد المشتركين — ذلك يمر عبر Bill Collections.\" href=\"wallet.html\" id=\"-fhqiox_37\">Wallet</a> إن ذُكر.</p></li></ol></section><section class=\"chapter\"><h2 data-toc=\"validation-mistakes\" id=\"validation-mistakes\">أخطاء التحقق</h2><p id=\"-fhqiox_38\">لا ينطبق — شاشة للقراءة فقط.</p></section><section class=\"chapter\"><h2 data-toc=\"common-mistakes\" id=\"common-mistakes\">أخطاء شائعة</h2><ul class=\"list _bullet\" id=\"-fhqiox_39\"><li class=\"list__item\" id=\"-fhqiox_40\"><p id=\"-fhqiox_42\">تجاهل الإعلانات — تفويت تغيير أسعار أو صيانة.</p></li><li class=\"list__item\" id=\"-fhqiox_41\"><p id=\"-fhqiox_43\">افتراض أن الإعلان يستبدل خطوات الفوترة العادية.</p></li></ul></section><section class=\"chapter\"><h2 data-toc=\"troubleshooting\" id=\"troubleshooting\">استكشاف الأخطاء</h2><div class=\"table-wrapper\"><table class=\"wide\" id=\"-fhqiox_44\"><thead><tr class=\"ijRowHead\" id=\"-fhqiox_45\"><th id=\"-fhqiox_48\"><p>المشكلة</p></th><th id=\"-fhqiox_49\"><p>ما تجربه</p></th></tr></thead><tbody><tr id=\"-fhqiox_46\"><td id=\"-fhqiox_50\"><p>قائمة فارغة</p></td><td id=\"-fhqiox_51\"><p>لا إعلانات نشطة</p></td></tr><tr id=\"-fhqiox_47\"><td id=\"-fhqiox_52\"><p>رابط معطّل</p></td><td id=\"-fhqiox_53\"><p>انسخ الرابط؛ تواصل مع الدعم</p></td></tr></tbody></table></div></section><section class=\"chapter\"><h2 data-toc=\"related-pages\" id=\"related-pages\">صفحات ذات صلة</h2><ul class=\"list _bullet\" id=\"-fhqiox_54\"><li class=\"list__item\" id=\"-fhqiox_55\"><p id=\"-fhqiox_58\"><a data-tooltip=\"تتعلم تسجيل الدخول، استخدام القائمة اليسرى، وأي دليل تفتح لكل مهمة. بعد هذه الصفحة، أكمل قائمة الإعداد، ثم استخدم دورة الفوترة الشهرية كل شهر.\" href=\"getting-started.html\" id=\"-fhqiox_59\">البدء</a></p></li><li class=\"list__item\" id=\"-fhqiox_56\"><p id=\"-fhqiox_60\"><a data-tooltip=\"هذا سير العمل الرئيسي الذي يكرره أصحاب المولدات كل شهر. اتبع نفس الترتيب حتى تبقى القراءات والفواتير والتحصيل وSMS متوافقة.\" href=\"monthly-billing-workflow.html\" id=\"-fhqiox_61\">دورة الفوترة الشهرية</a></p></li><li class=\"list__item\" id=\"-fhqiox_57\"><p id=\"-fhqiox_62\"><a data-tooltip=\"الرصيد الذي تحتفظ به لدى Echtirak لدفع خدمات المنصة (SMS، رسوم الاشتراك). ليس نقد المشتركين — ذلك يمر عبر Bill Collections.\" href=\"wallet.html\" id=\"-fhqiox_63\">Wallet</a></p></li></ul></section><div class=\"last-modified\">15 May 2026</div><div data-feedback-placeholder=\"true\"></div><div class=\"navigation-links _bottom\"><a class=\"navigation-links__prev\" href=\"profile.html\">Profile</a></div>"
        },
        "keywords": [
            "Account",
            "Announcements",
            "announcements",
            "الحساب"
        ]
    }
];
