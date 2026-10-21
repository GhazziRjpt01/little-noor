const draft = {
  en: 'Draft. A legal professional must review this page before the app is shared. This text does not say that Little Noor meets any privacy law.',
  ur: 'مسودہ۔ اس صفحے کو ایپ بانٹنے سے پہلے ایک قانونی ماہر دیکھے۔ یہ متن یہ نہیں کہتا کہ لٹل نور کسی پرائیویسی قانون پر پورا اترتا ہے۔',
  ar: 'مسودة. يجب أن يراجعها مختص قانوني قبل مشاركة التطبيق. هذا النص لا يقول إن ليتل نور يستوفي أي قانون للخصوصية.',
}

const supervision = {
  en: 'Little Noor is for children ages 3 to 10 with a parent or other grown-up nearby. A child should not use the AI teacher alone.',
  ur: 'لٹل نور 3 سے 10 سال کے بچوں کے لیے ہے، اور والدین یا کوئی بڑا ساتھ ہو۔ بچہ AI استاد اکیلے استعمال نہ کرے۔',
  ar: 'ليتل نور للأطفال من 3 إلى 10 سنوات مع ولي أمر أو كبير بجانبهم. لا يستخدم الطفل معلّم الذكاء الاصطناعي وحده.',
}

function page(title, sections) {
  return { title, sections }
}

export const legalCopy = {
  en: {
    draft: draft.en,
    supervision: supervision.en,
    privacy: page('Privacy policy', [
      {
        title: 'What is collected',
        body: 'A parent account stores an email address, a password kept by the sign-in service, and the parent’s name. A child profile stores a name and an age only. The app does not ask for a photo, address, school, or full date of birth.',
      },
      {
        title: 'Why',
        body: 'The account lets a parent sign in and see one child’s learning numbers. The name and age tell the parent which child the dashboard is showing.',
      },
      {
        title: 'Progress on the account',
        body: 'When a parent is signed in, the account can store lesson counts, Kalima counts, azkar counts, quiz counts, a streak, and stars for that child. Stars are for learning. They are not money.',
      },
      {
        title: 'What stays on this device',
        body: 'If nobody is signed in, practice counts, stars, the language choice, and parent switches stay in this browser. They are not saved to the account. Clearing this site’s data in the browser removes them.',
      },
      {
        title: 'The AI teacher',
        body: 'A question is sent to our server, checked, and then sent to OpenAI to write a short answer and a voice. Little Noor does not save the question, the answer, or the voice file in its database. This draft does not describe what OpenAI keeps. A legal reviewer should check that.',
      },
      {
        title: 'Who can see it',
        body: 'The dashboard is built so a signed-in parent sees only the children on that parent’s account. This page does not claim that a live database check has already been done.',
      },
      {
        title: 'How a parent can view it',
        body: 'Sign in and open Parent Dashboard. It shows the child’s name, age, and the saved numbers.',
      },
      {
        title: 'How a parent can delete it',
        body: 'On Parent Dashboard, choose the child and use Delete child data. That removes the child’s name, age, and saved progress from the parent account. It does not close the parent login. Practice saved only on this device is removed by clearing this site’s data in the browser.',
      },
    ]),
    terms: page('Terms', [
      {
        title: 'A grown-up stays nearby',
        body: 'A parent or other grown-up should stay with the child, including while the child uses the AI teacher.',
      },
      {
        title: 'The account is for a parent',
        body: 'The sign-up form is for a parent or guardian. It is not a child’s own account.',
      },
      {
        title: 'Lesson text',
        body: 'Lesson text that is not marked verified is demo content. It is not finished religious text. A qualified scholar should review it before launch.',
      },
      {
        title: 'Voices',
        body: 'An AI voice can miss Tajweed. When a recorded recitation is stored, the app uses that recording instead.',
      },
      {
        title: 'Stars',
        body: 'Stars and games are for practice. They are not prizes and they are not money.',
      },
      {
        title: 'Chat',
        body: 'Do not type another child’s private information into the chat.',
      },
      {
        title: 'This draft',
        body: 'The app can change. These words are a draft for a legal professional to review. They are not a finished agreement and they do not claim a legal right.',
      },
    ]),
    consent: page('Parental consent', [
      {
        title: 'Who is agreeing',
        body: 'The person creating the account says they are the parent or guardian of the child who will use Little Noor.',
      },
      {
        title: 'The child',
        body: 'The child is between 3 and 10. The parent will stay nearby, including during the AI teacher.',
      },
      {
        title: 'The data',
        body: 'The parent has read the draft privacy policy. The account stores a parent email and name, a child’s name and age, and learning numbers. A chat question is sent to make an answer and is not saved in Little Noor’s database.',
      },
      {
        title: 'View and delete',
        body: 'The parent can open Parent Dashboard to view that child, and can use Delete child data to remove that child’s name, age, and saved progress from the account.',
      },
      {
        title: 'The checkbox',
        body: 'The checkbox at sign up records that the parent agreed to this draft. A legal professional still needs to review the words before the app is shared.',
      },
    ]),
  },
  ur: {
    draft: draft.ur,
    supervision: supervision.ur,
    privacy: page('پرائیویسی پالیسی', [
      {
        title: 'کیا جمع ہوتا ہے',
        body: 'والدین کے اکاؤنٹ میں ای میل، سائن ان سروس میں رکھا پاس ورڈ، اور والدین کا نام ہوتا ہے۔ بچے کے پروفائل میں صرف نام اور عمر ہوتی ہے۔ تصویر، پتہ، اسکول، یا پوری تاریخ پیدائش نہیں مانگی جاتی۔',
      },
      {
        title: 'کیوں',
        body: 'اکاؤنٹ سے والدین سائن ان ہو کر ایک بچے کے سیکھنے کے نمبر دیکھ سکتے ہیں۔ نام اور عمر بتاتے ہیں کہ ڈیش بورڈ کس بچے کا ہے۔',
      },
      {
        title: 'اکاؤنٹ پر پیش رفت',
        body: 'جب والدین سائن ان ہوں، اکاؤنٹ اس بچے کے سبق، کلمہ، اذکار، کوئز، سلسلہ، اور ستارے رکھ سکتا ہے۔ ستارے سیکھنے کے لیے ہیں۔ یہ پیسے نہیں۔',
      },
      {
        title: 'جو اس ڈیوائس پر رہتا ہے',
        body: 'اگر کوئی سائن ان نہ ہو تو مشق کی گنتی، ستارے، زبان، اور والدین کے سوئچ اسی براؤزر میں رہتے ہیں۔ وہ اکاؤنٹ میں محفوظ نہیں ہوتے۔ براؤزر میں اس سائٹ کا ڈیٹا صاف کرنے سے وہ مٹ جاتے ہیں۔',
      },
      {
        title: 'AI استاد',
        body: 'سوال ہمارے سرور پر جاتا ہے، جانچا جاتا ہے، پھر مختصر جواب اور آواز کے لیے OpenAI کو بھیجا جاتا ہے۔ لٹل نور سوال، جواب، یا آواز کی فائل اپنے ڈیٹابیس میں محفوظ نہیں کرتا۔ یہ مسودہ یہ نہیں بتاتا کہ OpenAI کیا رکھتا ہے۔ قانونی جائزہ لینے والے کو یہ دیکھنا چاہیے۔',
      },
      {
        title: 'کون دیکھ سکتا ہے',
        body: 'ڈیش بورڈ اس طرح بنا ہے کہ سائن ان والدین صرف اپنے اکاؤنٹ کے بچے دیکھیں۔ یہ صفحہ یہ دعویٰ نہیں کرتا کہ لائیو ڈیٹابیس کی جانچ ہو چکی ہے۔',
      },
      {
        title: 'والدین کیسے دیکھیں',
        body: 'سائن ان کریں اور پیرنٹ ڈیش بورڈ کھولیں۔ وہاں بچے کا نام، عمر، اور محفوظ نمبر دکھتے ہیں۔',
      },
      {
        title: 'والدین کیسے مٹائیں',
        body: 'پیرنٹ ڈیش بورڈ پر بچہ چنیں اور Delete child data استعمال کریں۔ اس سے بچے کا نام، عمر، اور محفوظ پیش رفت اکاؤنٹ سے مٹ جاتی ہے۔ والدین کا لاگ ان نہیں بند ہوتا۔ صرف اس ڈیوائس کی مشق براؤزر میں اس سائٹ کا ڈیٹا صاف کرنے سے مٹتی ہے۔',
      },
    ]),
    terms: page('شرائط', [
      {
        title: 'ایک بڑا ساتھ رہے',
        body: 'والدین یا کوئی بڑا بچے کے ساتھ رہے، AI استاد کے دوران بھی۔',
      },
      {
        title: 'اکاؤنٹ والدین کا ہے',
        body: 'سائن اپ والدین یا سرپرست کے لیے ہے۔ یہ بچے کا اپنا اکاؤنٹ نہیں۔',
      },
      {
        title: 'سبق کا متن',
        body: 'جو سبق تصدیق شدہ نہیں، وہ ڈیمو مواد ہے۔ وہ مکمل مذہبی متن نہیں۔ لانچ سے پہلے ایک اہل عالم اسے دیکھے۔',
      },
      {
        title: 'آوازیں',
        body: 'AI آواز تجوید سے ہٹ سکتی ہے۔ جب ریکارڈ شدہ تلاوت محفوظ ہو تو ایپ وہی چلاتی ہے۔',
      },
      {
        title: 'ستارے',
        body: 'ستارے اور کھیل مشق کے لیے ہیں۔ یہ انعام یا پیسے نہیں۔',
      },
      {
        title: 'گفتگو',
        body: 'گفتگو میں کسی دوسرے بچے کی نجی معلومات نہ لکھیں۔',
      },
      {
        title: 'یہ مسودہ',
        body: 'ایپ بدل سکتی ہے۔ یہ الفاظ قانونی ماہر کے جائزے کے لیے مسودہ ہیں۔ یہ مکمل معاہدہ نہیں اور کسی قانونی حق کا دعویٰ نہیں کرتے۔',
      },
    ]),
    consent: page('والدین کی رضامندی', [
      {
        title: 'کون رضامند ہے',
        body: 'اکاؤنٹ بنانے والا کہتا ہے کہ وہ اس بچے کے والدین یا سرپرست ہیں جو لٹل نور استعمال کرے گا۔',
      },
      {
        title: 'بچہ',
        body: 'بچہ 3 سے 10 سال کا ہے۔ والدین ساتھ رہیں گے، AI استاد کے دوران بھی۔',
      },
      {
        title: 'ڈیٹا',
        body: 'والدین نے مسودہ پرائیویسی پالیسی پڑھ لی ہے۔ اکاؤنٹ میں والدین کی ای میل اور نام، بچے کا نام اور عمر، اور سیکھنے کے نمبر ہوتے ہیں۔ سوال جواب بنانے کے لیے بھیجا جاتا ہے اور لٹل نور کے ڈیٹابیس میں محفوظ نہیں ہوتا۔',
      },
      {
        title: 'دیکھنا اور مٹانا',
        body: 'والدین پیرنٹ ڈیش بورڈ پر بچہ دیکھ سکتے ہیں، اور Delete child data سے اس بچے کا نام، عمر، اور محفوظ پیش رفت اکاؤنٹ سے ہٹا سکتے ہیں۔',
      },
      {
        title: 'نشان',
        body: 'سائن اپ کا نشان اس مسودے پر رضامندی درج کرتا ہے۔ ایپ بانٹنے سے پہلے ایک قانونی ماہر کو الفاظ دیکھنے ہیں۔',
      },
    ]),
  },
  ar: {
    draft: draft.ar,
    supervision: supervision.ar,
    privacy: page('سياسة الخصوصية', [
      {
        title: 'ما الذي يُجمع',
        body: 'حساب ولي الأمر يحفظ البريد، وكلمة مرور عند خدمة الدخول، واسم ولي الأمر. ملف الطفل يحفظ الاسم والعمر فقط. التطبيق لا يطلب صورة أو عنوانًا أو مدرسة أو تاريخ ميلاد كاملًا.',
      },
      {
        title: 'لماذا',
        body: 'الحساب يتيح لولي الأمر الدخول ورؤية أرقام تعلم طفل واحد. الاسم والعمر يوضحان أي طفل تظهره اللوحة.',
      },
      {
        title: 'التقدم في الحساب',
        body: 'عندما يكون ولي الأمر داخلًا، يمكن للحساب حفظ عدد الدروس والكلمات والأذكار والاختبار وسلسلة الأيام والنجوم لذلك الطفل. النجوم للتعلم. ليست مالًا.',
      },
      {
        title: 'ما يبقى على هذا الجهاز',
        body: 'إذا لم يدخل أحد، تبقى عدّات التمرين والنجوم واختيار اللغة ومفاتيح ولي الأمر في هذا المتصفح. لا تُحفظ في الحساب. مسح بيانات هذا الموقع من المتصفح يزيلها.',
      },
      {
        title: 'معلّم الذكاء الاصطناعي',
        body: 'يُرسل السؤال إلى خادمنا، ويُفحص، ثم يُرسل إلى OpenAI لكتابة جواب قصير وصوت. ليتل نور لا يحفظ السؤال أو الجواب أو ملف الصوت في قاعدة بياناته. هذه المسودة لا تصف ما يحتفظ به OpenAI. على المراجع القانوني التحقق من ذلك.',
      },
      {
        title: 'من يستطيع الرؤية',
        body: 'اللوحة مبنية ليرى ولي الأمر الداخل أطفال حسابه فقط. هذه الصفحة لا تدّعي أن فحص قاعدة بيانات حية قد تم.',
      },
      {
        title: 'كيف يرى ولي الأمر',
        body: 'ادخل وافتح لوحة ولي الأمر. تظهر اسم الطفل وعمره والأرقام المحفوظة.',
      },
      {
        title: 'كيف يحذف ولي الأمر',
        body: 'في لوحة ولي الأمر، اختر الطفل واستخدم Delete child data. هذا يزيل اسم الطفل وعمره والتقدم المحفوظ من الحساب. لا يغلق دخول ولي الأمر. التمرين المحفوظ على هذا الجهاز فقط يُزال بمسح بيانات الموقع من المتصفح.',
      },
    ]),
    terms: page('الشروط', [
      {
        title: 'كبير يبقى بجانب الطفل',
        body: 'يبقى ولي الأمر أو كبير مع الطفل، وأيضًا أثناء معلّم الذكاء الاصطناعي.',
      },
      {
        title: 'الحساب لولي الأمر',
        body: 'نموذج التسجيل لولي الأمر أو الوصي. ليس حسابًا خاصًا بالطفل.',
      },
      {
        title: 'نص الدرس',
        body: 'النص الذي لم يُعلَّم أنه مراجع هو محتوى تجريبي. ليس نصًا دينيًا مكتملًا. يراجعه عالم مؤهل قبل الإطلاق.',
      },
      {
        title: 'الأصوات',
        body: 'قد يخطئ الصوت المولّد في التجويد. إذا وُجدت تلاوة مسجلة، يستخدم التطبيق ذلك التسجيل.',
      },
      {
        title: 'النجوم',
        body: 'النجوم والألعاب للتمرين. ليست جوائز وليست مالًا.',
      },
      {
        title: 'الدردشة',
        body: 'لا تكتب معلومات خاصة بطفل آخر في الدردشة.',
      },
      {
        title: 'هذه المسودة',
        body: 'يمكن أن يتغير التطبيق. هذه الكلمات مسودة ليراجعها مختص قانوني. ليست اتفاقًا مكتملًا ولا تدّعي حقًا قانونيًا.',
      },
    ]),
    consent: page('موافقة ولي الأمر', [
      {
        title: 'من يوافق',
        body: 'من ينشئ الحساب يقول إنه ولي أمر الطفل أو وصيه، والطفل سيستخدم ليتل نور.',
      },
      {
        title: 'الطفل',
        body: 'عمر الطفل بين 3 و 10. يبقى ولي الأمر بجانبه، وأيضًا أثناء معلّم الذكاء الاصطناعي.',
      },
      {
        title: 'البيانات',
        body: 'قرأ ولي الأمر مسودة سياسة الخصوصية. الحساب يحفظ بريد ولي الأمر واسمه، واسم الطفل وعمره، وأرقام التعلم. يُرسل السؤال لصنع جواب ولا يُحفظ في قاعدة بيانات ليتل نور.',
      },
      {
        title: 'العرض والحذف',
        body: 'يستطيع ولي الأمر فتح اللوحة لرؤية الطفل، واستخدام Delete child data لإزالة اسم ذلك الطفل وعمره وتقدمه المحفوظ من الحساب.',
      },
      {
        title: 'المربع',
        body: 'مربع التسجيل يسجل أن ولي الأمر وافق على هذه المسودة. ما زال مختص قانوني بحاجة لمراجعة الكلمات قبل مشاركة التطبيق.',
      },
    ]),
  },
}
