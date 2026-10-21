const fetched = 'Arabic, Saheeh International English, and Fateh Muhammad Jalandhry Urdu were copied from api.alquran.cloud on 2026-10-20. Compare them with a printed mushaf before approval.'
const textbook = 'Draft wording for a parent or teacher to compare with a trusted book. Not marked verified.'

const kursi = 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ'
const ikhlas = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ قُلْ هُوَ ٱللَّهُ أَحَدٌ\nٱللَّهُ ٱلصَّمَدُ\nلَمْ يَلِدْ وَلَمْ يُولَدْ\nوَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ'
const falaq = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ\nمِن شَرِّ مَا خَلَقَ\nوَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ\nوَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ\nوَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ'
const nas = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ\nمَلِكِ ٱلنَّاسِ\nإِلَٰهِ ٱلنَّاسِ\nمِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ\nٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ\nمِنَ ٱلْجِنَّةِ وَٱلنَّاسِ'
const bismillah = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
const parents = '۞ وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوٓا۟ إِلَّآ إِيَّاهُ وَبِٱلْوَٰلِدَيْنِ إِحْسَٰنًا ۚ إِمَّا يَبْلُغَنَّ عِندَكَ ٱلْكِبَرَ أَحَدُهُمَآ أَوْ كِلَاهُمَا فَلَا تَقُل لَّهُمَآ أُفٍّۢ وَلَا تَنْهَرْهُمَا وَقُل لَّهُمَا قَوْلًۭا كَرِيمًۭا'
const wudu = 'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ إِذَا قُمْتُمْ إِلَى ٱلصَّلَوٰةِ فَٱغْسِلُوا۟ وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى ٱلْمَرَافِقِ وَٱمْسَحُوا۟ بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى ٱلْكَعْبَيْنِ'
const house = 'وَإِذْ يَرْفَعُ إِبْرَٰهِۦمُ ٱلْقَوَاعِدَ مِنَ ٱلْبَيْتِ وَإِسْمَٰعِيلُ رَبَّنَا تَقَبَّلْ مِنَّآ ۖ إِنَّكَ أَنتَ ٱلسَّمِيعُ ٱلْعَلِيمُ'

function azkar(id, title, arabic, transliteration, en, ur, source, repeatCount, ageMin = 5) {
  return {
    id,
    title,
    arabic,
    transliteration,
    translations: { en, ur },
    source,
    audioUrl: null,
    verified: false,
    reviewedBy: null,
    reviewStatus: 'needs_review',
    repeatCount,
    ageMin,
    ageMax: 10,
  }
}

function category(id, title, items) {
  return { id, title, items }
}

const quranNote = `${fetched} The basmala at the start is included because that API edition returns it with the first ayah.`

export const azkarCategories = [
  category('morning', 'Morning', [
    azkar('morning-1', 'Ayat al-Kursi in the morning', kursi, 'Allahu la ilaha illa huwal hayyul qayyum. Read the rest slowly with a parent.', 'Allah - none has the right to be worshipped except Him, the Ever-Living, the Sustainer. A parent can help with the full meaning.', 'اللہ، اس کے سوا کوئی معبود نہیں، وہ ہمیشہ زندہ ہے اور سب کو قائم رکھنے والا ہے۔ پوری آیت کا مطلب بڑے کے ساتھ سنیں۔', `Quran 2:255. ${fetched} Reading it in the morning is taught from hadith collections; confirm that hadith before fixing a count.`, 1, 6),
    azkar('morning-2', 'Surah Al-Ikhlas in the morning', ikhlas, 'Qul huwallahu ahad. Allahus samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.', 'Say: He is Allah, the One. He is the Eternal Refuge. He does not have children, and He was not born. No one is equal to Him.', 'کہو: اللہ ایک ہے۔ وہ بے نیاز ہے۔ نہ اس کی اولاد ہے نہ وہ کسی کی اولاد ہے۔ کوئی اس کے برابر نہیں۔', `Quran 112:1-4. ${quranNote} A hadith teaches reciting it three times in the morning; confirm the hadith number before approval.`, 3, 5),
    azkar('morning-3', 'Surah Al-Falaq in the morning', falaq, 'Qul a\'udhu birabbil falaq, then the following short lines with a parent.', 'Say: I seek refuge in the Lord of the daybreak, from the harm of what He created, from the night when it grows dark, from those who blow on knots, and from an envier when he envies.', 'کہو: میں صبح کے رب کی پناہ مانگتا ہوں، اس کی پیدا کی ہوئی چیز کے شر سے، اندھیری رات کے شر سے، گرہوں پر پھونکنے والیوں کے شر سے، اور حسد کرنے والے کے شر سے۔', `Quran 113:1-5. ${quranNote}`, 3, 5),
    azkar('morning-4', 'Surah An-Nas in the morning', nas, 'Qul a\'udhu birabbin nas, malikin nas, ilahin nas.', 'Say: I seek refuge in the Lord of people, the King of people, the God of people, from the whispering devil who withdraws.', 'کہو: میں لوگوں کے رب، لوگوں کے بادشاہ، لوگوں کے معبود کی پناہ مانگتا ہوں، اس وسوسے سے جو پیچھے ہٹ جاتا ہے۔', `Quran 114:1-6. ${quranNote}`, 3, 5),
    azkar('morning-5', 'A prayer for the morning', 'ٱللَّٰهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ ٱلنُّشُورُ', 'Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilaykan nushur.', 'O Allah, by You we enter the morning and the evening. By You we live and we die, and to You is the return.', 'اے اللہ، تیری مدد سے ہم نے صبح کی اور شام کی۔ تیری مدد سے ہم جیتے اور مرتے ہیں، اور ہمیں تیری طرف لوٹنا ہے۔', `${textbook} Commonly cited from Sunan Abi Dawud for the morning. Confirm the exact Arabic and the number in your edition.`, 1, 6),
    azkar('morning-6', 'The best prayer for forgiveness', 'ٱللَّٰهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا ٱسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَٱغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ ٱلذُّنُوبَ إِلَّا أَنْتَ', 'Allahumma anta rabbi la ilaha illa ant, khalaqtani wa ana abduk, wa ana ala ahdika wa wa\'dika mastata\'t. A\'udhu bika min sharri ma sana\'t, abu\'u laka bini\'matika alayya wa abu\'u bidhanbi faghfir li fa innahu la yaghfirudh dhunuba illa ant.', 'O Allah, You are my Lord. None has the right to be worshipped except You. You created me and I am Your servant. I seek refuge from the evil of what I have done. Forgive me, for none forgives sins except You.', 'اے اللہ، تو میرا رب ہے۔ تیرے سوا کوئی معبود نہیں۔ تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں۔ میں اپنے کیے کے شر سے پناہ مانگتا ہوں۔ مجھے معاف کر، گناہ تیرے سوا کوئی نہیں بخشتا۔', `${textbook} This is the dua known as sayyidul istighfar, reported in Sahih al-Bukhari. Confirm the number and every Arabic word in your printed copy.`, 1, 8),
    azkar('morning-7', 'A short morning praise', 'سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ', 'Subhana Allahi wa bihamdih.', 'Allah is free from every flaw, and I praise Him.', 'اللہ ہر نقص سے پاک ہے اور میں اس کی تعریف کرتا ہوں۔', `${textbook} A short dhikr taught in authentic collections. Confirm the report and the recommended count before approval.`, 1, 4),
    azkar('morning-8', 'Asking for a good day', 'ٱللَّٰهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَٰذَا ٱلْيَوْمِ', 'Allahumma inni as\'aluka khayra hadhal yawm.', 'O Allah, I ask You for the good of this day.', 'اے اللہ، میں تجھ سے اس دن کی بھلائی مانگتا ہوں۔', `${textbook} A short morning asking. Confirm the fuller dua in a hadith book before teaching a longer version.`, 1, 5),
  ]),
  category('evening', 'Evening', [
    azkar('evening-1', 'Ayat al-Kursi in the evening', kursi, 'Allahu la ilaha illa huwal hayyul qayyum. Read the rest with a parent.', 'The same verse as the morning: Allah is the Ever-Living, the Sustainer.', 'وہی آیت: اللہ ہمیشہ زندہ ہے اور سب کو قائم رکھنے والا ہے۔', `Quran 2:255. ${fetched} Confirm the evening-recitation hadith separately.`, 1, 6),
    azkar('evening-2', 'Surah Al-Ikhlas in the evening', ikhlas, 'Qul huwallahu ahad.', 'He is Allah, the One.', 'وہ اللہ ہے، ایک۔', `Quran 112:1-4. ${quranNote}`, 3, 5),
    azkar('evening-3', 'Surah Al-Falaq in the evening', falaq, 'Qul a\'udhu birabbil falaq.', 'I seek refuge in the Lord of the daybreak.', 'میں صبح کے رب کی پناہ مانگتا ہوں۔', `Quran 113:1-5. ${quranNote}`, 3, 5),
    azkar('evening-4', 'Surah An-Nas in the evening', nas, 'Qul a\'udhu birabbin nas.', 'I seek refuge in the Lord of people.', 'میں لوگوں کے رب کی پناہ مانگتا ہوں۔', `Quran 114:1-6. ${quranNote}`, 3, 5),
    azkar('evening-5', 'A prayer for the evening', 'ٱللَّٰهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ ٱلْمَصِيرُ', 'Allahumma bika amsayna wa bika asbahna wa bika nahya wa bika namutu wa ilaykal masir.', 'O Allah, by You we enter the evening and the morning. By You we live and we die, and to You is the return.', 'اے اللہ، تیری مدد سے ہم نے شام کی اور صبح کی۔ تیری مدد سے ہم جیتے اور مرتے ہیں، اور ہمیں تیری طرف لوٹنا ہے۔', `${textbook} The evening pair of the morning dua. Confirm the Arabic, especially the last word, in your edition.`, 1, 6),
    azkar('evening-6', 'Asking forgiveness at night', 'أَسْتَغْفِرُ ٱللَّٰهَ وَأَتُوبُ إِلَيْهِ', 'Astaghfirullaha wa atubu ilayh.', 'I ask Allah to forgive me, and I turn to Him.', 'میں اللہ سے معافی مانگتا ہوں اور اس کی طرف رجوع کرتا ہوں۔', `${textbook} A short istighfar. Do not attach a reward or a count until the hadith is checked.`, 1, 5),
  ]),
  category('waking', 'Waking up', [
    azkar('waking-1', 'Thanks on waking', 'ٱلْحَمْدُ لِلَّٰهِ ٱلَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ ٱلنُّشُورُ', 'Alhamdu lillahil ladhi ahyana ba\'da ma amatana wa ilayhin nushur.', 'Praise belongs to Allah, who gave us life after causing us to die, and to Him is the return.', 'تعریف اللہ کے لیے ہے جس نے ہمیں موت کے بعد زندگی دی، اور اسی کی طرف اٹھنا ہے۔', `${textbook} Reported in Sahih al-Bukhari when waking from sleep. Confirm the number and the Arabic.`, 1, 5),
    azkar('waking-2', 'Beginning the day with Allah\'s name', bismillah, 'Bismillahir rahmanir rahim.', 'In the name of Allah, the Entirely Merciful, the Especially Merciful.', 'شروع اللہ کا نام لے کر جو بڑا مہربان نہایت رحم والا ہے۔', `Quran 1:1 as returned by api.alquran.cloud. ${fetched} Saying it on waking is a family practice; it is not by itself a separate waking hadith.`, 1, 3),
    azkar('waking-3', 'A gentle wake-up praise', 'ٱلْحَمْدُ لِلَّٰهِ', 'Al-hamdu lillah.', 'All praise belongs to Allah.', 'تمام تعریف اللہ کے لیے ہے۔', `${textbook} A short praise. The fuller waking dua is waking-1. Do not treat this short phrase as that hadith.`, 1, 3),
  ]),
  category('sleeping', 'Sleeping', [
    azkar('sleeping-1', 'Before closing the eyes', 'بِٱسْمِكَ ٱللَّٰهُمَّ أَمُوتُ وَأَحْيَا', 'Bismika Allahumma amutu wa ahya.', 'In Your name, O Allah, I die and I live.', 'اے اللہ، تیرے نام کے ساتھ میں مرتا ہوں اور جیتا ہوں۔', `${textbook} Reported in Sahih al-Bukhari for going to sleep. Confirm the number. The words "die and live" here mean sleep and waking, in a gentle sense for children.`, 1, 5),
    azkar('sleeping-2', 'Ayat al-Kursi before sleep', kursi, 'Allahu la ilaha illa huwal hayyul qayyum.', 'Recite Ayat al-Kursi before sleep with a parent nearby.', 'سونے سے پہلے آیت الکرسی بڑے کے ساتھ پڑھیں۔', `Quran 2:255. ${fetched} A report in Sahih al-Bukhari connects this verse with bedtime. Confirm that passage before approval.`, 1, 6),
    azkar('sleeping-3', 'Surah Al-Ikhlas before sleep', ikhlas, 'Qul huwallahu ahad.', 'Read Surah Al-Ikhlas before sleep.', 'سونے سے پہلے سورۃ اخلاص پڑھیں۔', `Quran 112:1-4. ${quranNote}`, 1, 5),
    azkar('sleeping-4', 'Surah Al-Falaq before sleep', falaq, 'Qul a\'udhu birabbil falaq.', 'Read Surah Al-Falaq before sleep.', 'سونے سے پہلے سورۃ فلق پڑھیں۔', `Quran 113:1-5. ${quranNote}`, 1, 5),
    azkar('sleeping-5', 'Surah An-Nas before sleep', nas, 'Qul a\'udhu birabbin nas.', 'Read Surah An-Nas before sleep.', 'سونے سے پہلے سورۃ ناس پڑھیں۔', `Quran 114:1-6. ${quranNote}`, 1, 5),
  ]),
  category('eating', 'Eating', [
    azkar('eating-1', 'Before eating', bismillah, 'Bismillah.', 'In the name of Allah.', 'اللہ کے نام سے۔', `The basmala is Quran 1:1. ${fetched} Saying it before eating is taught in the hadith literature. Confirm the eating report separately. If a child forgets, see the next item.`, 1, 3),
    azkar('eating-2', 'If you forgot at the start', 'بِسْمِ ٱللَّٰهِ أَوَّلَهُ وَآخِرَهُ', 'Bismillahi awwalahu wa akhirah.', 'In the name of Allah at its beginning and its end.', 'اللہ کے نام سے، اس کے شروع میں اور اس کے آخر میں۔', `${textbook} Taught for the person who forgot the basmala at the start of the meal. Confirm the hadith before approval.`, 1, 6),
    azkar('eating-3', 'After eating', 'ٱلْحَمْدُ لِلَّٰهِ ٱلَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ', 'Alhamdu lillahil ladhi at\'amana wa saqana wa ja\'alana muslimin.', 'Praise belongs to Allah, who fed us, gave us drink, and made us Muslims.', 'تعریف اللہ کے لیے ہے جس نے ہمیں کھلایا، پلایا، اور ہمیں مسلمان بنایا۔', `${textbook} A thanks after food reported in the sunan collections. Confirm the Arabic and the grading before approval.`, 1, 5),
    azkar('eating-4', 'Thanks for this food', 'ٱلْحَمْدُ لِلَّٰهِ', 'Al-hamdu lillah.', 'All praise belongs to Allah. A child can say this right after a meal.', 'تمام تعریف اللہ کے لیے ہے۔ بچہ کھانے کے بعد یہ کہہ سکتا ہے۔', `${textbook} A short thanks. It does not replace the fuller dua in the previous item.`, 1, 3),
  ]),
  category('drinking', 'Drinking', [
    azkar('drinking-1', 'Before drinking', bismillah, 'Bismillah.', 'In the name of Allah, before a drink.', 'پینے سے پہلے اللہ کے نام سے۔', `Quran 1:1 for the basmala. ${fetched} The manners of saying it before drinking should be confirmed from a hadith or fiqh book your family follows.`, 1, 3),
    azkar('drinking-2', 'After drinking', 'ٱلْحَمْدُ لِلَّٰهِ', 'Al-hamdu lillah.', 'All praise belongs to Allah, after a drink.', 'پینے کے بعد تمام تعریف اللہ کے لیے ہے۔', `${textbook} A short thanks. Do not present it as a unique numbered hadith until it is checked.`, 1, 3),
  ]),
  category('entering-home', 'Entering home', [
    azkar('entering-home-1', 'On entering home', 'بِسْمِ ٱللَّٰهِ وَلَجْنَا وَبِسْمِ ٱللَّٰهِ خَرَجْنَا وَعَلَى ٱللَّٰهِ رَبِّنَا تَوَكَّلْنَا', 'Bismillahi walajna wa bismillahi kharajna wa alallahi rabbina tawakkalna. Then give salam.', 'In the name of Allah we enter, in the name of Allah we leave, and upon Allah our Lord we rely. Then say salam to the people at home.', 'اللہ کے نام سے ہم داخل ہوئے، اللہ کے نام سے ہم نکلے، اور اپنے رب اللہ پر بھروسہ کیا۔ پھر گھر والوں کو سلام کہیں۔', `${textbook} Commonly cited from Sunan Abi Dawud for entering the home. Confirm the Arabic and then teach the salam with it.`, 1, 5),
    azkar('entering-home-2', 'Salam at the door', 'ٱلسَّلَامُ عَلَيْكُمْ', 'Assalamu alaykum.', 'Peace be upon you. Say this to the people in the house.', 'آپ پر سلامتی ہو۔ گھر والوں کو یہ کہیں۔', `${textbook} The greeting of salam. A reviewer should add the Quran or hadith reference they want children to learn.`, 1, 3),
  ]),
  category('leaving-home', 'Leaving home', [
    azkar('leaving-home-1', 'On leaving home', 'بِسْمِ ٱللَّٰهِ تَوَكَّلْتُ عَلَى ٱللَّٰهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ', 'Bismillahi tawakkaltu alallah, wa la hawla wa la quwwata illa billah.', 'In the name of Allah, I rely on Allah. There is no power and no strength except with Allah.', 'اللہ کے نام سے، میں نے اللہ پر بھروسہ کیا۔ طاقت اور قوت صرف اللہ کے ساتھ ہے۔', `${textbook} Commonly cited for leaving the house. Confirm the collection and number before approval.`, 1, 5),
    azkar('leaving-home-2', 'A short leaving phrase', 'تَوَكَّلْتُ عَلَى ٱللَّٰهِ', 'Tawakkaltu alallah.', 'I rely on Allah.', 'میں نے اللہ پر بھروسہ کیا۔', `${textbook} A short phrase from the longer leaving dua. Do not present the short phrase as the full hadith.`, 1, 4),
  ]),
  category('after-prayer', 'After prayer', [
    azkar('after-prayer-1', 'Asking forgiveness after prayer', 'أَسْتَغْفِرُ ٱللَّٰهَ', 'Astaghfirullah.', 'I ask Allah to forgive me. Many families say this three times after the prayer. Confirm that count with your teacher.', 'میں اللہ سے معافی مانگتا ہوں۔ بہت سے گھر نماز کے بعد یہ تین بار کہتے ہیں۔ تعداد اپنے استاد سے پوچھ لیں۔', `${textbook} The three-times practice is widely taught from hadith. Confirm the wording and the count.`, 3, 5),
    azkar('after-prayer-2', 'The peace dua after prayer', 'ٱللَّٰهُمَّ أَنْتَ ٱلسَّلَامُ وَمِنْكَ ٱلسَّلَامُ تَبَارَكْتَ يَا ذَا ٱلْجَلَالِ وَٱلْإِكْرَامِ', 'Allahumma antas salam wa minkas salam, tabarakta ya dhal jalali wal ikram.', 'O Allah, You are Peace and from You is peace. Blessed are You, O Owner of majesty and honor.', 'اے اللہ، تو سلامتی ہے اور سلامتی تجھ ہی سے ہے۔ اے عزت اور بزرگی والے، تو بابرکت ہے۔', `${textbook} Reported in Sahih Muslim after the tasleem. Confirm the number and the Arabic.`, 1, 7),
    azkar('after-prayer-3', 'After-prayer praise, thirty-three', 'سُبْحَانَ ٱللَّٰهِ', 'Subhana Allah.', 'Allah is free from every flaw. The well-known practice is thirty-three times after prayer. Confirm it before teaching the count as fixed.', 'اللہ ہر نقص سے پاک ہے۔ نماز کے بعد مشہور عمل تینتیس بار ہے۔ تعداد کو ثابت ماننے سے پہلے حوالہ دیکھ لیں۔', `${textbook} Part of the after-prayer dhikr in Sahih Muslim. This item is only the first phrase, not the whole report.`, 33, 6),
    azkar('after-prayer-4', 'After-prayer thanks, thirty-three', 'ٱلْحَمْدُ لِلَّٰهِ', 'Al-hamdu lillah.', 'All praise belongs to Allah. Commonly thirty-three times after the previous phrase.', 'تمام تعریف اللہ کے لیے ہے۔ عام طور پر پچھلے ذکر کے بعد تینتیس بار۔', `${textbook} Part of the same after-prayer report. Confirm the order and the final count in your edition.`, 33, 6),
    azkar('after-prayer-5', 'After-prayer greatness', 'ٱللَّٰهُ أَكْبَرُ', 'Allahu akbar.', 'Allah is the greatest. Families often complete the set with thirty-three or thirty-four. A reviewer must choose the count from a checked hadith.', 'اللہ سب سے بڑا ہے۔ کچھ گھر تینتیس اور کچھ چونتیس مکمل کرتے ہیں۔ تعداد چیک شدہ حدیث سے طے کریں۔', `${textbook} The count at the end of this dhikr is reported with a small difference. Do not freeze one number until the hadith is checked.`, 33, 6),
    azkar('after-prayer-6', 'Ayat al-Kursi after prayer', kursi, 'Allahu la ilaha illa huwal hayyul qayyum.', 'Read Ayat al-Kursi once after the prayer, with a parent if the child is still learning it.', 'نماز کے بعد آیت الکرسی ایک بار پڑھیں، سیکھتے ہوئے بڑے کے ساتھ۔', `Quran 2:255. ${fetched} Reports about reading it after every prayer need a graded reference before approval.`, 1, 7),
    azkar('after-prayer-7', 'Surah Al-Ikhlas after prayer', ikhlas, 'Qul huwallahu ahad.', 'Read Surah Al-Ikhlas after prayer while learning it.', 'نماز کے بعد سیکھنے کے لیے سورۃ اخلاص پڑھیں۔', `Quran 112:1-4. ${quranNote} Do not add a special reward for this placement until a hadith is checked.`, 1, 6),
    azkar('after-prayer-8', 'A quiet thanks after prayer', 'ٱلْحَمْدُ لِلَّٰهِ', 'Al-hamdu lillah.', 'All praise belongs to Allah. Sit calmly for a moment after the prayer.', 'تمام تعریف اللہ کے لیے ہے۔ نماز کے بعد ایک لمحہ خاموش بیٹھیں۔', `${textbook} A simple thanks for children. It is not a replacement for the dhikr above.`, 1, 4),
  ]),
]

function quiz(id, category, title, en, ur, options, correct, explanation, explanationUr, source, difficulty, ageMin, ageMax) {
  const icons = ['sun', 'heart', 'star', 'cloud']
  return {
    id,
    category,
    title,
    arabic: '',
    transliteration: '',
    translations: { en, ur },
    options: options.map((text, index) => ({ id: ['a', 'b', 'c', 'd'][index], text, icon: icons[index], imageUrl: null })),
    correctOptionId: ['a', 'b', 'c', 'd'][correct],
    explanation,
    explanationUr,
    source,
    audioUrl: null,
    verified: false,
    reviewedBy: null,
    reviewStatus: 'needs_review',
    difficulty,
    ageMin,
    ageMax,
  }
}

const basicSource = 'Basic Islamic teaching for children. A reviewer should attach the exact Quran or hadith reference before this is called verified.'
const quranSource = 'Count or name from the standard written mushaf. A reviewer should confirm it against a printed copy.'

const quizRows = [
  ['kalimas', 'First words', 'The first kalima begins with which meaning?', 'پہلا کلمہ کس معنی سے شروع ہوتا ہے؟', ['None has the right to be worshipped except Allah', 'There are many gods', 'The sun is god', 'A person is god'], 0, 'It teaches tawheed: only Allah is worshipped.', 'یہ توحید سکھاتا ہے: عبادت صرف اللہ کی ہے۔'],
  ['kalimas', 'The messenger', 'Who does the first kalima call the messenger of Allah?', 'پہلا کلمہ کسے اللہ کا رسول کہتا ہے؟', ['Musa', 'Isa', 'Muhammad', 'Ibrahim'], 2, 'The testimony names Muhammad as Allah\'s messenger.', 'گواہی میں محمد کو اللہ کا رسول کہا گیا ہے۔'],
  ['kalimas', 'A witness', 'What does "ashhadu" mean?', '"اشہد" کا کیا مطلب ہے؟', ['I run', 'I bear witness', 'I sleep', 'I eat'], 1, 'Ashhadu means I bear witness.', 'اشہد کا مطلب ہے میں گواہی دیتا ہوں۔'],
  ['kalimas', 'One Allah', 'The kalimas teach us to worship how many gods?', 'کلمے کتنے معبودوں کی عبادت سکھاتے ہیں؟', ['One', 'Two', 'Three', 'Four'], 0, 'Muslims worship Allah alone.', 'مسلمان صرف اللہ کی عبادت کرتے ہیں۔'],
  ['kalimas', 'A partner', 'What does "la sharika lah" mean?', '"لا شریک لہ" کا مطلب کیا ہے؟', ['He has a partner', 'He has no partner', 'He has a son', 'He is far away'], 1, 'It means Allah has no partner.', 'اس کا مطلب ہے اللہ کا کوئی شریک نہیں۔'],
  ['kalimas', 'Praise', 'Where does praise belong in the third kalima?', 'تیسرے کلمے میں تعریف کس کے لیے ہے؟', ['For people only', 'For Allah', 'For statues', 'For no one'], 1, 'Alhamdu lillah means all praise is for Allah.', 'الحمد للہ کا مطلب ہے تمام تعریف اللہ کے لیے ہے۔'],
  ['kalimas', 'The greatest', 'What does "Allahu akbar" mean?', '"اللہ اکبر" کا مطلب کیا ہے؟', ['Allah is the greatest', 'Allah is tired', 'Allah is two', 'Allah is hidden from mercy'], 0, 'Akbar here means greater than everything else.', 'اکبر کا مطلب ہے وہ سب سے بڑا ہے۔'],
  ['kalimas', 'Forgiveness', 'The fifth kalima is mainly about what?', 'پانچواں کلمہ زیادہ تر کس کے بارے میں ہے؟', ['Asking Allah to forgive', 'Buying a toy', 'Counting clouds', 'Drawing a house'], 0, 'Istighfar means asking Allah for forgiveness.', 'استغفار کا مطلب اللہ سے معافی مانگنا ہے۔'],
  ['kalimas', 'Turning away', 'The sixth kalima says a person turns away from what?', 'چھٹا کلمہ کس چیز سے بیزاری بتاتا ہے؟', ['Kindness', 'Disbelief and associating partners with Allah', 'Sharing food', 'Saying salam'], 1, 'It rejects kufr and shirk. A teacher should explain those words gently.', 'یہ کفر اور شرک سے بیزاری ہے۔ استاد یہ الفاظ نرمی سے سمجھائیں۔'],
  ['kalimas', 'How many', 'How many kalimas are in this children\'s set?', 'بچوں کے اس سیٹ میں کتنے کلمے ہیں؟', ['Three', 'Five', 'Six', 'Ten'], 2, 'This textbook set has six kalimas. That count is a school set, not a verse.', 'یہ نصابی سیٹ چھ کلمے ہیں۔ یہ تعداد کسی آیت کا نمبر نہیں۔'],
  ['manners', 'Greeting', 'What do Muslims say when they meet?', 'ملتے وقت مسلمان کیا کہتے ہیں؟', ['Assalamu alaykum', 'Goodbye forever', 'Go away', 'Be quiet always'], 0, 'Salam is a prayer for peace.', 'سلام امن کی دعا ہے۔'],
  ['manners', 'Reply', 'If someone gives you salam, what should you do?', 'اگر کوئی سلام کہے تو کیا کرنا چاہیے؟', ['Hide', 'Reply with salam', 'Shout', 'Turn your back'], 1, 'A greeting should be answered. See Quran 4:86 and confirm the verse before approval.', 'سلام کا جواب دینا چاہیے۔ سورۃ النساء 86 دیکھ کر تصدیق کریں۔'],
  ['manners', 'Truth', 'Which choice is honest?', 'سچ کون سا کام ہے؟', ['Saying what really happened', 'Blaming a friend', 'Hiding a broken cup with a lie', 'Making up a story to win'], 0, 'Honesty is saying what is true.', 'ایمانداری سچ کہنا ہے۔'],
  ['manners', 'Parents', 'How should a child speak to parents?', 'بچے کو ماں باپ سے کیسی بات کرنی چاہیے؟', ['With kind words', 'With shouting', 'With "uff"', 'By walking away'], 0, 'Quran 17:23 tells us not to say "uff" to parents and to speak kindly. The Arabic was fetched for the lessons file.', 'سورۃ الاسراء 23 میں ماں باپ کو اف نہ کہنے اور اچھی بات کرنے کا حکم ہے۔'],
  ['manners', 'Sharing', 'Your friend has no crayon. What is kind?', 'دوست کے پاس کریون نہیں۔ مہربانی کیا ہے؟', ['Share one', 'Hide all of them', 'Laugh', 'Break them'], 0, 'Sharing is a basic good manner.', 'بانٹنا ایک اچھا ادب ہے۔'],
  ['manners', 'Names', 'What should we avoid calling a friend?', 'دوست کو کیا نہیں کہنا چاہیے؟', ['A hurtful name', 'Their real name', 'Salam', 'Please'], 0, 'Name-calling hurts. Allah forbids mocking people in Quran 49:11. Confirm that verse.', 'برے نام دکھ دیتے ہیں۔ سورۃ الحجرات 11 میں مذاق سے منع ہے۔ تصدیق کریں۔'],
  ['manners', 'Listening', 'When a parent is speaking, a kind child does what?', 'جب والدین بول رہے ہوں تو مہربان بچہ کیا کرتا ہے؟', ['Listens', 'Covers both ears', 'Interrupts for fun', 'Runs off'], 0, 'Listening is part of respect.', 'سننا عزت کا حصہ ہے۔'],
  ['manners', 'Sorry', 'If you bump someone, what do you say?', 'اگر کسی سے ٹکرا جاؤ تو کیا کہو؟', ['Sorry', 'Nothing', 'It was your fault', 'Move'], 0, 'A small apology keeps peace.', 'معافی سلامتی رکھتی ہے۔'],
  ['manners', 'Mosque voice', 'Inside the mosque, which voice is better?', 'مسجد میں کون سی آواز بہتر ہے؟', ['A quiet voice', 'A shouting game', 'A drum', 'A race'], 0, 'The mosque is a place for prayer and calm.', 'مسجد نماز اور سکون کی جگہ ہے۔'],
  ['manners', 'Clean hands', 'Before eating, what should you do?', 'کھانے سے پہلے کیا کرنا چاہیے؟', ['Wash your hands', 'Wipe them on the floor', 'Hide them', 'Skip water'], 0, 'Clean hands are a health and cleanliness lesson.', 'صاف ہاتھ صفائی کا سبق ہیں۔'],
  ['manners', 'Thanks', 'When someone helps you, what do you say?', 'جب کوئی مدد کرے تو کیا کہتے ہو؟', ['Thank you', 'Go away', 'Mine', 'No'], 0, 'Gratitude is for people and, more deeply, for Allah.', 'شکر لوگوں کا بھی ہے اور اصل میں اللہ کا بھی۔'],
  ['manners', 'Animals', 'How should we treat a cat or a bird?', 'بلی یا پرندے کے ساتھ کیسا برتاؤ کریں؟', ['Gently', 'By pulling a tail', 'By throwing stones', 'By shouting at it'], 0, 'Kindness to animals is part of good character. A reviewer can add a checked hadith.', 'جانوروں پر مہربانی اچھے اخلاق میں ہے'].concat(['']),
  ['manners', 'Queue', 'At a water tap, what is fair?', 'پانی کے نل پر انصاف کیا ہے؟', ['Wait for your turn', 'Push ahead', 'Splash others', 'Block the tap'], 0, 'Taking turns is fairness.', 'باری لینا انصاف ہے۔'],
  ['manners', 'Secrets', 'A friend tells you a kind secret. What do you do?', 'دوست کوئی اچھی بات راز میں کہے۔ کیا کرو گے؟', ['Keep it', 'Announce it to tease them', 'Change it', 'Sell it'], 0, 'Trust is part of honesty. Do not keep a secret that hides someone being hurt; tell a parent.', 'اعتماد ایمانداری کا حصہ ہے۔ اگر کسی کو نقصان ہو رہا ہو تو راز نہ رکھیں، والدین کو بتائیں۔'],
  ['manners', 'Guests', 'A guest comes to your home. What is kind?', 'مہمان گھر آئے۔ مہربانی کیا ہے؟', ['Smile and make space', 'Hide the chairs', 'Frown', 'Ignore them'], 0, 'Honoring a guest is a Muslim manner. Confirm any hadith before quoting one.', 'مہمان کی عزت مسلمانوں کا ادب ہے۔ حدیث نقل کرنے سے پہلے اسے چیک کریں۔'],
]

function fixMannersAnimal(rows) {
  const index = rows.findIndex((item) => item[1] === 'Animals')
  rows[index][8] = 'جانوروں پر مہربانی اچھے اخلاق میں ہے۔'
  return rows
}

fixMannersAnimal(quizRows)

const moreQuizzes = [
  ['prayer', 'How many', 'How many obligatory prayers are there in a day?', 'دن میں کتنی فرض نمازیں ہیں؟', ['Three', 'Four', 'Five', 'Six'], 2, 'Muslims pray five obligatory prayers each day.', 'مسلمان دن میں پانچ فرض نمازیں پڑھتے ہیں۔'],
  ['prayer', 'Dawn', 'Which prayer comes at dawn?', 'فجر کے وقت کون سی نماز ہے؟', ['Fajr', 'Maghrib', 'Isha', 'Jumu\'ah only'], 0, 'Fajr is the dawn prayer.', 'فجر صبح کی نماز ہے۔'],
  ['prayer', 'Noon', 'Which prayer comes after the sun passes midday?', 'دوپہر کے بعد کون سی نماز ہے؟', ['Zuhr', 'Fajr', 'Taraweeh', 'Eid'], 0, 'Zuhr is the midday prayer.', 'ظہر دوپہر کی نماز ہے۔'],
  ['prayer', 'Afternoon', 'Which prayer comes in the late afternoon?', 'دن کے آخری حصے میں کون سی نماز ہے؟', ['Asr', 'Fajr', 'Tahajjud only', 'Eid'], 0, 'Asr is the afternoon prayer.', 'عصر دوپہر کے بعد کی نماز ہے۔'],
  ['prayer', 'Sunset', 'Which prayer comes just after sunset?', 'غروبِ آفتاب کے بعد کون سی نماز ہے؟', ['Maghrib', 'Fajr', 'Zuhr', 'Duha only'], 0, 'Maghrib is the sunset prayer.', 'مغرب غروب کی نماز ہے۔'],
  ['prayer', 'Night', 'Which prayer comes at night?', 'رات کو کون سی نماز ہے؟', ['Isha', 'Fajr', 'Zuhr', 'Asr'], 0, 'Isha is the night prayer.', 'عشاء رات کی نماز ہے۔'],
  ['prayer', 'Direction', 'Which way do Muslims face for salah?', 'نماز میں مسلمان کس طرف رخ کرتے ہیں؟', ['Toward the Kaaba in Makkah', 'Toward the nearest shop', 'Toward the sun always', 'Any statue'], 0, 'The qibla is the direction of the Kaaba.', 'قبلہ خانہ کعبہ کی سمت ہے۔'],
  ['prayer', 'Ready', 'What should we make before salah when water is available?', 'پانی ہو تو نماز سے پہلے کیا کریں؟', ['Wudu', 'A loud race', 'A nap in the row', 'A drawing on the wall'], 0, 'Wudu is the washing taught before prayer. Quran 5:6 names the main washes.', 'وضو نماز سے پہلے کی صفائی ہے۔ سورۃ المائدہ 6 میں اصل دھونے کا ذکر ہے۔'],
  ['prayer', 'Face', 'In the wudu verse, what is washed first among these?', 'وضو کی آیت میں ان میں سے پہلے کیا دھویا جاتا ہے؟', ['The face', 'The shoes only', 'The hair dye', 'The belt'], 0, 'Quran 5:6 says to wash the faces. The fetched Arabic is in the lessons file.', 'سورۃ المائدہ 6 میں منہ دھونے کا ذکر ہے۔'],
  ['prayer', 'Arms', 'How far are the arms washed in that verse?', 'اس آیت میں ہاتھ کہاں تک دھوئے جاتے ہیں؟', ['To the elbows', 'Only the fingers', 'Only the shoulders', 'They are not washed'], 0, 'Quran 5:6 says to the elbows.', 'سورۃ المائدہ 6 میں کہنیوں تک کا ذکر ہے۔'],
  ['prayer', 'Head', 'What does the wudu verse say about the head?', 'وضو کی آیت سر کے بارے میں کیا کہتی ہے؟', ['Wipe over it', 'Cover it with food', 'Do not touch it ever', 'Shave it during wudu'], 0, 'The verse says to wipe over your heads.', 'آیت میں سر کا مسح کرنے کو کہا گیا ہے۔'],
  ['prayer', 'Feet', 'In that verse, the feet are washed to where?', 'اس آیت میں پاؤں کہاں تک دھوئے جاتے ہیں؟', ['The ankles', 'The knees only', 'The hips', 'They are skipped'], 0, 'Quran 5:6 says to the ankles. Families may teach extra sunnah steps; ask a parent.', 'سورۃ المائدہ 6 میں ٹخنوں تک کا ذکر ہے۔ اضافی سنتیں والدین سے پوچھیں۔'],
  ['prayer', 'Calm', 'During salah, which body is better?', 'نماز میں کون سا بدن بہتر ہے؟', ['A calm, still body', 'A jumping body', 'A spinning body', 'A body that pushes friends'], 0, 'Salah is quiet worship.', 'نماز خاموش عبادت ہے۔'],
  ['prayer', 'Rows', 'In a group prayer, children should do what?', 'جماعت میں بچوں کو کیا کرنا چاہیے؟', ['Stand in the row calmly', 'Start a race', 'Talk through the prayer', 'Block the door'], 0, 'The row is straight and calm.', 'صف سیدھی اور پُرسکون ہوتی ہے۔'],
  ['prayer', 'Learning', 'If you do not know the words yet, what is right?', 'اگر الفاظ ابھی نہ آئیں تو کیا ٹھیک ہے؟', ['Pray beside a parent and keep learning', 'Make up Arabic', 'Skip wudu', 'Invent a verse'], 0, 'A child learns with a parent. We do not invent Quranic words.', 'بچہ والدین کے ساتھ سیکھتا ہے۔ قرآنی الفاظ خود نہیں بناتے۔'],
  ['basic-knowledge', 'Pillars', 'How many pillars of Islam are in the famous hadith?', 'مشہور حدیث میں اسلام کے کتنے ستون ہیں؟', ['Three', 'Four', 'Five', 'Seven'], 2, 'The hadith "Islam is built upon five" is in Sahih al-Bukhari and Sahih Muslim. Confirm the number in your edition.', 'حدیث "اسلام کی بنیاد پانچ پر ہے" بخاری اور مسلم میں ہے۔ اپنے نسخے میں نمبر دیکھیں۔'],
  ['basic-knowledge', 'First pillar', 'Which pillar is the testimony of faith?', 'کون سا ستون کلمۂ شہادت ہے؟', ['Shahada', 'Hajj only', 'Zakat only', 'Sawm only'], 0, 'The shahada is the first of the five.', 'شہادت پانچ میں پہلا ستون ہے۔'],
  ['basic-knowledge', 'Fast', 'In which month do Muslims fast?', 'مسلمان کس مہینے کے روزے رکھتے ہیں؟', ['Ramadan', 'Muharram only', 'Rajab only', 'Every Monday of the year as a pillar'], 0, 'Fasting in Ramadan is a pillar. Quran 2:185 names Ramadan. Confirm the verse.', 'رمضان کے روزے ستون ہیں۔ سورۃ البقرہ 185 میں رمضان کا ذکر ہے۔ تصدیق کریں۔'],
  ['basic-knowledge', 'Charity', 'What is zakat?', 'زکوٰۃ کیا ہے؟', ['Obligatory charity for those who must pay it', 'A game score', 'A type of shoe', 'A song'], 0, 'Zakat is a pillar. The details of who pays it are for a parent or teacher.', 'زکوٰۃ ایک ستون ہے۔ کس پر فرض ہے، یہ والدین یا استاد بتائیں۔'],
  ['basic-knowledge', 'Journey', 'Hajj is a journey to which city?', 'حج کس شہر کا سفر ہے؟', ['Makkah', 'Cairo', 'Istanbul', 'Delhi'], 0, 'Hajj is to Makkah, once in a lifetime for the person who is able.', 'حج مکہ کا سفر ہے، جو شخص قادر ہو اس پر زندگی میں ایک بار۔'],
  ['basic-knowledge', 'Book', 'What is the holy book of Islam?', 'اسلام کی مقدس کتاب کیا ہے؟', ['The Quran', 'A storybook we invent', 'A newspaper', 'A map only'], 0, 'The Quran is Allah\'s revealed book.', 'قرآن اللہ کی اتاری ہوئی کتاب ہے۔'],
  ['basic-knowledge', 'Prophet', 'Who received the Quran?', 'قرآن کس پر اترا؟', ['Prophet Muhammad', 'Prophet Nuh only', 'Prophet Yusuf only', 'A king in Rome'], 0, 'Allah revealed the Quran to Muhammad through Jibril.', 'اللہ نے قرآن محمد پر جبریل کے ذریعے اتارا۔'],
  ['basic-knowledge', 'Angel', 'Which angel brought the revelation?', 'وحی کون سا فرشتہ لایا؟', ['Jibril', 'A bird', 'A cloud with a face', 'No one'], 0, 'Jibril is the angel of revelation. Confirm the child-friendly wording.', 'جبریل وحی کے فرشتے ہیں۔ بچوں کے لیے الفاظ کی تصدیق کریں۔'],
  ['basic-knowledge', 'Makkah', 'In which city was Prophet Muhammad born?', 'نبی محمد کس شہر میں پیدا ہوئے؟', ['Makkah', 'Madinah', 'Jerusalem', 'Taif only'], 0, 'He was born in Makkah. This is standard seerah; a reviewer should name the book they trust.', 'آپ مکہ میں پیدا ہوئے۔ یہ سیرت کی مشہور بات ہے؛ معتبر کتاب کا نام لکھیں۔'],
  ['basic-knowledge', 'Madinah', 'To which city did the Prophet move in the Hijrah?', 'ہجرت میں نبی کس شہر گئے؟', ['Madinah', 'A desert with no name', 'Rome', 'China'], 0, 'The Hijrah was from Makkah to Madinah.', 'ہجرت مکہ سے مدینہ کی طرف تھی۔'],
  ['basic-knowledge', 'Mercy', 'A Muslim calls Prophet Muhammad a mercy for whom?', 'مسلمان نبی محمد کو کس کے لیے رحمت کہتے ہیں؟', ['The worlds', 'Only one family', 'Only rich people', 'No one'], 0, 'Quran 21:107 calls him a mercy to the worlds. Confirm the verse before approval.', 'سورۃ الانبیاء 107 میں انہیں عالموں کے لیے رحمت کہا گیا ہے۔ تصدیق کریں۔'],
  ['basic-knowledge', 'Clean', 'Before holding a mushaf, a careful child does what?', 'مصحف اٹھانے سے پہلے احتیاط کیا ہے؟', ['Has clean hands and follows the family\'s wudu practice', 'Eats over it', 'Drags it on the floor', 'Draws on the page'], 0, 'We respect the mushaf. Ask a parent about the exact purity rule your family follows.', 'ہم مصحف کی عزت کرتے ہیں۔ طہارت کا قاعدہ اپنے گھر سے پوچھیں۔'],
  ['basic-knowledge', 'Bismillah', 'What does Bismillah mean?', 'بسم اللہ کا کیا مطلب ہے؟', ['In the name of Allah', 'In the name of a person', 'Good night', 'Count to ten'], 0, 'It is the basmala. The Arabic is Quran 1:1 in the azkar file.', 'یہ بسملہ ہے۔ عربی اذکار والی فائل میں سورۃ الفاتحہ کی پہلی آیت ہے۔'],
  ['basic-knowledge', 'Alhamdulillah', 'When do we say Alhamdulillah?', 'الحمد للہ کب کہتے ہیں؟', ['When we thank Allah', 'When we want to scare someone', 'When we lie', 'When we waste food'], 0, 'It means all praise belongs to Allah.', 'اس کا مطلب ہے تمام تعریف اللہ کے لیے ہے۔'],
  ['basic-knowledge', 'Stars here', 'What are the stars in Little Noor?', 'لٹل نور کے ستارے کیا ہیں؟', ['Learning points, not money', 'Coins to spend', 'A prize of cash', 'A ticket'], 0, 'The app\'s stars are for learning. They are not money.', 'یہ ستارے سیکھنے کے لیے ہیں، پیسے نہیں۔'],
  ['prophets', 'First', 'Who is remembered as the first prophet?', 'پہلے نبی کے طور پر کسے یاد کیا جاتا ہے؟', ['Adam', 'Muhammad', 'Isa', 'Yusuf'], 0, 'Adam is the first prophet in Islamic teaching. Confirm the child-level source you prefer.', 'اسلامی تعلیم میں آدم پہلے نبی ہیں۔ بچوں والی کتاب کی تصدیق کریں۔'],
  ['prophets', 'Ark', 'Which prophet built the ark?', 'کشتی کس نبی نے بنائی؟', ['Nuh', 'Yunus', 'Lut', 'Hud'], 0, 'The Quran tells the story of Nuh and the ship. See Surah Nuh and Surah Hud.', 'قرآن نوح اور کشتی کا قصہ بیان کرتا ہے۔ سورۃ نوح اور سورۃ ہود دیکھیں۔'],
  ['prophets', 'Friend', 'Which prophet is known as Khalilullah, the close friend of Allah?', 'اللہ کے خلیل کس نبی کو کہا جاتا ہے؟', ['Ibrahim', 'Yunus', 'Sulayman', 'Dawud'], 0, 'Ibrahim is called Allah\'s close friend in Quran 4:125. Confirm the verse.', 'سورۃ النساء 125 میں ابراہیم کو خلیل کہا گیا ہے۔ تصدیق کریں۔'],
  ['prophets', 'House', 'Who raised the foundations of the Kaaba with Ismail?', 'اسماعیل کے ساتھ کعبہ کی بنیاد کس نے اٹھائی؟', ['Ibrahim', 'Yusuf', 'A later king', 'Nuh'], 0, 'Quran 2:127. The Arabic was fetched into the stories file.', 'سورۃ البقرہ 127۔ عربی کہانیوں والی فائل میں ہے۔'],
  ['prophets', 'Dreams', 'Which prophet\'s story fills a whole surah about his brothers?', 'کس نبی کا قصہ ایک پوری سورت میں ہے جس میں بھائیوں کا ذکر ہے؟', ['Yusuf', 'Hud', 'Salih', 'Shu\'ayb'], 0, 'Surah Yusuf tells his story. Read it with a parent; some parts are for older children.', 'سورۃ یوسف میں یہ قصہ ہے۔ بڑے کے ساتھ پڑھیں؛ کچھ حصے بڑے بچوں کے لیے ہیں۔'],
  ['prophets', 'Baby', 'Which prophet was placed in the river as a baby?', 'کس نبی کو بچپن میں دریا میں رکھا گیا؟', ['Musa', 'Isa', 'Yunus', 'Ibrahim'], 0, 'The Quran tells this in Surah Ta-Ha and Surah Al-Qasas.', 'قرآن یہ قصہ سورۃ طٰہٰ اور سورۃ القصص میں بیان کرتا ہے۔'],
  ['prophets', 'Staff', 'Which prophet\'s staff is part of his story with Pharaoh?', 'فرعون والے قصے میں عصا کس نبی کا ہے؟', ['Musa', 'Yusuf', 'Nuh', 'Lut'], 0, 'Musa\'s signs before Pharaoh are in the Quran. Avoid scary details with little children.', 'موسیٰ کی نشانیاں قرآن میں ہیں۔ چھوٹے بچوں کو ڈراؤنی تفصیل نہ دیں۔'],
  ['prophets', 'Teacher', 'In Surah Al-Kahf, Musa travels to learn from whom?', 'سورۃ کہف میں موسیٰ کس سے سیکھنے جاتے ہیں؟', ['A servant of Allah whom the surah does not name in the child\'s text', 'Pharaoh', 'A merchant only', 'A poet'], 0, 'The Quran describes a teacher without using the later name in the verses themselves. Do not add a name until you decide how to teach it.', 'قرآن اس استاد کا ذکر کرتا ہے۔ بچوں کو نام بعد کی کتابوں سے دینے سے پہلے فیصلہ کریں۔'],
  ['prophets', 'Psalms', 'Which prophet was given the Zabur?', 'زبور کس نبی کو دیا گیا؟', ['Dawud', 'Yusuf', 'Hud', 'Salih'], 0, 'Quran 17:55 mentions the Zabur given to Dawud. Confirm the verse.', 'سورۃ الاسراء 55 میں داؤد کو زبور دیے جانے کا ذکر ہے۔ تصدیق کریں۔'],
  ['prophets', 'Birds', 'Which prophet understood the speech of birds in the Quran?', 'قرآن میں پرندوں کی بولی کس نبی کو آتی ہے؟', ['Sulayman', 'Nuh', 'Lut', 'Hud'], 0, 'Quran 27:16. Confirm the verse.', 'سورۃ النمل 16۔ تصدیق کریں۔'],
  ['prophets', 'Ant', 'Which prophet smiled at an ant\'s words?', 'چیونٹی کی بات پر کس نبی نے مسکراہٹ کی؟', ['Sulayman', 'Adam', 'Hud', 'Salih'], 0, 'The story is in Quran 27:17-19. Keep it gentle.', 'قصہ سورۃ النمل 17 تا 19 میں ہے۔ اسے نرمی سے سنائیں۔'],
  ['prophets', 'Whale', 'Which prophet called Allah from the darkness?', 'اندھیرے میں اللہ کو کس نبی نے پکارا؟', ['Yunus', 'Hud', 'Salih', 'Shu\'ayb'], 0, 'Quran 21:87. Do not add graphic details.', 'سورۃ الانبیاء 87۔ ڈراؤنی تفصیل نہ جوڑیں۔'],
  ['prophets', 'Cradle', 'Which prophet spoke while still a baby in the Quran\'s account?', 'قرآن کے بیان میں کون سا نبی گود میں بولے؟', ['Isa', 'Yusuf', 'Yunus', 'Hud'], 0, 'Quran 19:29-33. Confirm the verses.', 'سورۃ مریم 29 تا 33۔ تصدیق کریں۔'],
  ['prophets', 'Last', 'Who is the last prophet?', 'آخری نبی کون ہیں؟', ['Muhammad', 'Isa', 'Musa', 'Ibrahim'], 0, 'Muslims believe Muhammad is the final messenger. Quran 33:40 calls him the seal of the prophets. Confirm the verse.', 'مسلمان محمد کو آخری رسول مانتے ہیں۔ سورۃ الاحزاب 40 میں خاتم النبیین ہے۔ تصدیق کریں۔'],
  ['prophets', 'Kindness', 'A true story of a prophet should be learned from where?', 'نبی کا سچا قصہ کہاں سے سیکھنا چاہیے؟', ['The Quran or a checked seerah book', 'Any cartoon', 'A guess', 'A dream we invent'], 0, 'We do not invent words for a prophet.', 'ہم نبی کے الفاظ خود نہیں بناتے۔'],
  ['quran', 'Surahs', 'How many surahs are in the Quran?', 'قرآن میں کتنی سورتیں ہیں؟', ['100', '110', '114', '120'], 2, 'A standard mushaf has 114 surahs.', 'معیاری مصحف میں 114 سورتیں ہیں۔'],
  ['quran', 'First surah', 'What is the first surah?', 'پہلی سورت کون سی ہے؟', ['Al-Fatiha', 'Al-Ikhlas', 'An-Nas', 'Al-Baqarah'], 0, 'Al-Fatiha opens the mushaf.', 'فاتحہ مصحف کی پہلی سورت ہے۔'],
  ['quran', 'Last surah', 'What is the last surah?', 'آخری سورت کون سی ہے؟', ['An-Nas', 'Al-Falaq', 'Al-Ikhlas', 'Al-Fatiha'], 0, 'An-Nas is surah 114.', 'ناس سورت نمبر 114 ہے۔'],
  ['quran', 'One', 'Which surah says Allah is One?', 'کون سی سورت کہتی ہے کہ اللہ ایک ہے؟', ['Al-Ikhlas', 'Quraysh', 'Al-Fil', 'Al-Masad'], 0, 'Surah 112. The text is in the azkar file from the API.', 'سورۃ 112۔ متن اذکار کی فائل میں API سے ہے۔'],
  ['quran', 'Daybreak', 'Al-Falaq asks refuge in the Lord of what?', 'فلق کس چیز کے رب کی پناہ مانگتی ہے؟', ['The daybreak', 'A mountain of gold', 'A river only', 'A market'], 0, 'Quran 113:1, fetched from the API.', 'سورۃ الفلق 1، API سے لی گئی۔'],
  ['quran', 'People', 'An-Nas seeks refuge in the Lord of whom?', 'ناس کس کے رب کی پناہ مانگتی ہے؟', ['People', 'Only birds', 'Only fish', 'Only kings of one city'], 0, 'Quran 114:1, fetched from the API.', 'سورۃ الناس 1، API سے لی گئی۔'],
  ['quran', 'Longest', 'Which of these is a very long surah near the front of the Quran?', 'ان میں سے کون سی لمبی سورت قرآن کے شروع میں ہے؟', ['Al-Baqarah', 'Al-Ikhlas', 'Al-Asr', 'Al-Kawthar'], 0, 'Al-Baqarah is the second surah and the longest.', 'بقرہ دوسری اور سب سے لمبی سورت ہے۔'],
  ['quran', 'Short', 'Which of these is a very short surah?', 'ان میں سے کون سی بہت چھوٹی سورت ہے؟', ['Al-Kawthar', 'Al-Baqarah', 'Ali Imran', 'An-Nisa'], 0, 'Al-Kawthar is among the shortest. Confirm the surah number 108.', 'کوثر چھوٹی سورتوں میں ہے۔ نمبر 108 کی تصدیق کریں۔'],
  ['quran', 'Respect', 'How do we treat a page of the Quran?', 'قرآن کے صفحے کے ساتھ کیسا برتاؤ کریں؟', ['With clean hands and care', 'As a coaster', 'By tearing it', 'By drawing over the words'], 0, 'The mushaf is respected.', 'مصحف کی عزت کی جاتی ہے۔'],
  ['quran', 'Meaning', 'If you do not understand an ayah, what should you do?', 'اگر آیت سمجھ نہ آئے تو کیا کریں؟', ['Ask a parent or teacher', 'Invent a meaning', 'Erase it', 'Skip the Quran forever'], 0, 'Children ask a grown-up. We do not invent meanings.', 'بچہ بڑے سے پوچھے۔ معنی خود نہیں بناتے۔'],
  ['quran', 'Arabic', 'The Quran was revealed in which language?', 'قرآن کس زبان میں اترا؟', ['Arabic', 'Latin', 'English first', 'Urdu first'], 0, 'The Quran\'s language is Arabic. Translations help us understand.', 'قرآن کی زبان عربی ہے۔ ترجمہ سمجھنے میں مدد دیتا ہے۔'],
  ['quran', 'Translation', 'Is an English translation the same as the Arabic Quran?', 'کیا انگریزی ترجمہ عربی قرآن کے برابر ہے؟', ['No. It is a translation and can be discussed', 'Yes, every word matches perfectly', 'It replaces the Arabic', 'It is not allowed to exist'], 0, 'A translation is a human explanation. The Arabic is the Quran.', 'ترجمہ انسان کی وضاحت ہے۔ قرآن عربی ہے۔'],
  ['quran', 'Juz', 'A mushaf is often divided into how many juz for reading?', 'پڑھنے کے لیے مصحف اکثر کتنے پاروں میں بٹا ہوتا ہے؟', ['30', '7', '114', '5'], 0, 'Thirty juz is the common division. A reviewer should confirm this teaching point.', 'تیس پارے عام تقسیم ہے۔ اس نکتے کی تصدیق کریں۔'],
  ['quran', 'Listening', 'When the Quran is recited, a polite listener does what?', 'قرآن کی تلاوت ہو تو شائستہ سننے والا کیا کرتا ہے؟', ['Listens quietly', 'Talks over it', 'Plays a loud game', 'Mocks a mistake'], 0, 'Quiet listening is respect. Quran 7:204 mentions listening when the Quran is recited. Confirm it.', 'خاموش سننا عزت ہے۔ سورۃ الاعراف 204 میں سننے کا ذکر ہے۔ تصدیق کریں۔'],
  ['quran', 'Practice', 'What is a good small goal for a child?', 'بچے کے لیے چھوٹا اچھا ہدف کیا ہے؟', ['Learn one short surah with a parent', 'Memorize the whole Quran in one hour', 'Skip the Arabic', 'Change the words'], 0, 'Short, repeated practice is enough.', 'تھوڑی اور بار بار مشق کافی ہے۔'],
  ['history', 'Cave', 'Where did the first revelation come to Prophet Muhammad?', 'پہلی وحی نبی محمد پر کہاں آئی؟', ['The cave of Hira', 'A market in Rome', 'A ship', 'A school in Andalus'], 0, 'This is standard seerah. Name your seerah book when you approve it.', 'یہ مشہور سیرت ہے۔ منظوری پر اپنی سیرت کی کتاب کا نام لکھیں۔'],
  ['history', 'Word', 'The first word of the revelation is remembered as what?', 'پہلی وحی کا پہلا لفظ کیا یاد کیا جاتا ہے؟', ['Iqra, Read', 'Sleep', 'Buy', 'Run'], 0, 'Surah Al-Alaq begins with Iqra. Confirm 96:1 before approval. The Arabic is not pasted here because it was not fetched in this draft.', 'سورۃ العلق اقراء سے شروع ہوتی ہے۔ 96:1 کی تصدیق کریں۔ عربی اس مسودے میں اس لیے نہیں کہ اسے API سے نہیں لیا گیا۔'],
  ['history', 'Helper', 'Who supported the Prophet first in his own home?', 'گھر میں نبی کا ساتھ سب سے پہلے کس نے دیا؟', ['Khadijah', 'A stranger from another faith who mocked him', 'Pharaoh', 'A poet who sold poems'], 0, 'Khadijah\'s support is standard seerah. Confirm the book.', 'خدیجہ کا ساتھ مشہور سیرت ہے۔ کتاب کی تصدیق کریں۔'],
  ['history', 'Cave trip', 'On the journey to Madinah, the Prophet hid with his companion in which cave?', 'مدینہ کے سفر میں نبی اپنے ساتھی کے ساتھ کس غار میں چھپے؟', ['Thawr', 'Hira again for a year', 'A cave in China', 'No cave is mentioned in seerah'], 0, 'The cave of Thawr is standard seerah. Quran 9:40 is read with this story. Confirm it.', 'غارِ ثور مشہور سیرت ہے۔ اس قصے کے ساتھ سورۃ التوبہ 40 پڑھی جاتی ہے۔ تصدیق کریں۔'],
  ['history', 'Companion', 'Who was the companion in that cave?', 'اس غار میں ساتھی کون تھے؟', ['Abu Bakr', 'Abu Lahab', 'Pharaoh', 'A merchant who refused'], 0, 'Abu Bakr as-Siddiq. Confirm the seerah source.', 'ابو بکر صدیق۔ سیرت کے ماخذ کی تصدیق کریں۔'],
  ['history', 'Masjid', 'The Prophet\'s mosque was built in which city?', 'نبی کی مسجد کس شہر میں بنی؟', ['Madinah', 'Rome', 'Cairo', 'Granada'], 0, 'Al-Masjid an-Nabawi is in Madinah.', 'مسجدِ نبوی مدینہ میں ہے۔'],
  ['history', 'Qibla change', 'Muslims first faced another mosque, then turned toward where?', 'پہلے رخ ایک مسجد کی طرف تھا، پھر کہاں ہو گیا؟', ['The Kaaba in Makkah', 'A palace', 'The sea only', 'A mountain in Yemen only'], 0, 'The change of qibla is in Quran 2:144. Confirm the verse.', 'قبلے کا بدلنا سورۃ البقرہ 144 میں ہے۔ تصدیق کریں۔'],
  ['history', 'Treaty', 'The peaceful agreement at Hudaybiyyah is remembered as what?', 'حدیبیہ کے معاہدے کو کیا یاد کیا جاتا ہے؟', ['A treaty', 'A children\'s game', 'A poem contest only', 'A sea battle'], 0, 'Hudaybiyyah was a treaty. Teach it simply, without battle details, for ages 7–10.', 'حدیبیہ ایک معاہدہ تھا۔ 7 سے 10 سال کے بچوں کو بغیر لڑائی کی تفصیل کے سنائیں۔'],
  ['history', 'Opening', 'Makkah was later opened in a way our lessons describe as what?', 'بعد میں مکہ کو ہماری سبق میں کیسے یاد کریں؟', ['With a conquest that a parent should explain gently', 'With a magic spell', 'With a flood', 'It never opened'], 0, 'The opening of Makkah needs a parent\'s wording. This quiz does not tell battle details.', 'فتحِ مکہ والدین کے الفاظ سے سنی جائے۔ اس سوال میں لڑائی کی تفصیل نہیں۔'],
  ['history', 'Farewell', 'Near the end of his life, the Prophet gave which famous sermon?', 'زندگی کے آخر میں نبی نے کون سا مشہور خطبہ دیا؟', ['The Farewell Sermon', 'A sermon in Rome', 'A children\'s play', 'No sermon'], 0, 'The Farewell Sermon is standard seerah. Quote it only from a checked text.', 'حجۃ الوداع کا خطبہ مشہور سیرت ہے۔ اقتباس صرف چیک شدہ متن سے لیں۔'],
  ['history', 'Calendar', 'The Islamic year count begins from what?', 'اسلامی سال کی گنتی کس سے شروع ہوتی ہے؟', ['The Hijrah', 'The birth of Isa', 'The building of a palace in Spain', 'A king\'s birthday'], 0, 'The Hijri calendar starts from the Hijrah. Confirm the historical note.', 'ہجری کیلنڈر ہجرت سے شروع ہوتا ہے۔ تاریخی نوٹ کی تصدیق کریں۔'],
  ['history', 'Books', 'Which books are safe places for a child\'s history lesson?', 'بچے کی تاریخی سبق کے لیے محفوظ کتابیں کون سی ہیں؟', ['A seerah book a parent trusts', 'Any video title', 'A guess in a chat', 'A made-up comic with no review'], 0, 'History about the Prophet needs a checked book.', 'نبی کی تاریخ کے لیے چیک شدہ کتاب چاہیے۔'],
  ['history', 'Respect', 'When we say the Prophet\'s name, a Muslim home often adds what?', 'نبی کا نام لیں تو مسلمان گھر میں اکثر کیا کہتے ہیں؟', ['A prayer of peace upon him', 'A joke', 'Nothing unkind only, with no prayer ever', 'A nickname'], 0, 'We say peace be upon him. Teach the short Arabic only after a parent is happy with the pronunciation.', 'ہم صلی اللہ علیہ وسلم کہتے ہیں۔ مختصر عربی تلفظ والدین کی رضامندی کے بعد سکھائیں۔'],
  ['history', 'Lessons', 'What should a child copy from the Prophet\'s life?', 'نبی کی زندگی سے بچہ کیا اپنائے؟', ['Truth, kindness, and prayer', 'Anger at small things', 'Waste', 'Mocking people'], 0, 'The lessons we teach here are character lessons, not battle stories.', 'یہاں ہم اخلاق کا سبق سکھاتے ہیں، لڑائی کے قصے نہیں۔'],
  ['history', 'Review', 'If two children\'s books disagree, what should we do?', 'اگر دو بچوں کی کتابیں مختلف ہوں تو کیا کریں؟', ['Ask a knowledgeable parent or teacher', 'Pick the exciting one', 'Mix them', 'Invent a third story'], 0, 'Disagreement is a reason for review, not for a new story.', 'اختلاف جائزے کی وجہ ہے، نئی کہانی کی نہیں۔'],
]

const allQuizRows = [...quizRows, ...moreQuizzes]

export const quizzes = {
  categories: [
    { id: 'kalimas', title: 'Kalimas' },
    { id: 'manners', title: 'Manners' },
    { id: 'prayer', title: 'Prayer' },
    { id: 'basic-knowledge', title: 'Basic knowledge' },
    { id: 'prophets', title: 'Prophets' },
    { id: 'quran', title: 'Quran' },
    { id: 'history', title: 'History' },
  ],
  items: allQuizRows.map((item, index) => quiz(
    `quiz-${index + 1}`,
    item[0],
    item[1],
    item[2],
    item[3],
    item[4],
    item[5],
    item[6],
    item[7],
    item[0] === 'quran' ? quranSource : basicSource,
    index % 5 === 0 ? 'growing' : 'easy',
    index % 5 === 0 ? 7 : 5,
    10,
  )),
}

function story(id, title, ageMin, bodyEn, bodyUr, lessonLearned, source) {
  return {
    id,
    title,
    category: 'stories',
    arabic: '',
    transliteration: '',
    translations: { en: bodyEn, ur: bodyUr },
    bodyEn,
    bodyUr,
    lessonLearned,
    source,
    audioUrl: null,
    verified: false,
    reviewedBy: null,
    reviewStatus: 'needs_review',
    ageMin,
    ageMax: 10,
  }
}

export const stories = [
  story('story-1', 'Adam learns to say sorry', 5, 'Allah taught Adam the names of things and made him the first prophet. When Adam and his wife made a mistake, they asked Allah to forgive them. Allah is the One who accepts a sincere sorry. A parent can read the story from Surah Al-Baqarah with an older child.', 'اللہ نے آدم کو چیزوں کے نام سکھائے اور انہیں پہلا نبی بنایا۔ جب آدم اور ان کی بیوی سے بھول ہوئی تو انہوں نے اللہ سے معافی مانگی۔ اللہ سچی معافی قبول کرتا ہے۔ بڑا بچہ یہ قصہ سورۃ البقرہ سے والدین کے ساتھ پڑھ سکتا ہے۔', 'When we make a mistake, we say sorry to Allah and try again.', 'Quran 2:30-38. Do not add dialogue that is not in the passage you read.'),
  story('story-2', 'Nuh and the big boat', 5, 'Prophet Nuh called his people to worship Allah for a long time. Many of them refused. Allah told him to build a ship. The people who trusted Allah went aboard, and Allah saved them. Little children do not need the frightening parts.', 'نبی نوح نے اپنی قوم کو بہت دیر تک اللہ کی عبادت کی طرف بلایا۔ بہت سے لوگوں نے انکار کیا۔ اللہ نے انہیں کشتی بنانے کو کہا۔ جو لوگ اللہ پر بھروسہ کرتے تھے وہ کشتی میں سوار ہوئے اور اللہ نے انہیں بچایا۔ چھوٹے بچوں کو ڈراؤنا حصہ نہیں سنانا۔', 'Keep calling people to good, and trust Allah.', 'Surah Nuh and Surah Hud. A reviewer should choose the verses for the age group.'),
  story('story-3', 'Ibrahim looks for the true God', 7, 'Prophet Ibrahim saw that a star, the moon, and the sun all disappear. He knew that the true God does not set. He worshipped Allah alone, even when his people were angry.', 'نبی ابراہیم نے دیکھا کہ ستارہ، چاند اور سورج سب غروب ہو جاتے ہیں۔ انہوں نے جانا کہ سچا معبود غروب نہیں ہوتا۔ انہوں نے اکیلے اللہ کی عبادت کی، چاہے لوگ ناراض ہوں۔', 'Allah alone is the One who does not disappear.', 'Quran 6:74-83. Confirm the verses. Do not add insults or violence for young children.'),
  story('story-4', 'Ibrahim and Ismail raise the House', 6, 'Ibrahim and his son Ismail raised the walls of the Kaaba. They asked Allah to accept their work. People still travel to that House to worship Allah alone.', 'ابراہیم اور ان کے بیٹے اسماعیل نے کعبہ کی دیواریں اٹھائیں۔ انہوں نے اللہ سے اپنے کام کی قبولیت مانگی۔ لوگ آج بھی اس گھر کی طرف اکیلے اللہ کی عبادت کے لیے آتے ہیں۔', 'Work for Allah, and ask Him to accept it.', `Quran 2:127. Arabic copied from api.alquran.cloud: ${house}`),
  story('story-5', 'Yusuf tells the truth', 8, 'Prophet Yusuf was kind, and his brothers became jealous. The Quran tells how Allah protected him and how he later forgave his brothers. Read Surah Yusuf with a parent. Skip the parts that are too grown-up.', 'نبی یوسف مہربان تھے، اور ان کے بھائی جل گئے۔ قرآن بتاتا ہے کہ اللہ نے ان کی حفاظت کی اور بعد میں انہوں نے بھائیوں کو معاف کر دیا۔ سورۃ یوسف والدین کے ساتھ پڑھیں۔ جو حصہ بڑا ہو اسے چھوڑ دیں۔', 'Tell the truth, and forgiveness is strong.', 'Surah Yusuf. This retelling adds no quoted speech.'),
  story('story-6', 'Musa\'s mother trusts Allah', 5, 'When Musa was a baby, his mother was afraid. Allah told her He would return the baby to her. She trusted Allah, and Allah brought Musa back to her arms.', 'جب موسیٰ بچے تھے تو ان کی ماں ڈری ہوئی تھیں۔ اللہ نے فرمایا کہ وہ بچہ انہیں واپس دے گا۔ انہوں نے اللہ پر بھروسہ کیا، اور اللہ نے موسیٰ کو ان کی گود میں واپس کیا۔', 'A parent\'s trust in Allah is a quiet kind of courage.', 'Quran 20:38-40 and 28:7-13. Confirm the verses. No extra scene was added.'),
  story('story-7', 'Musa walks with a teacher', 8, 'Musa traveled to learn from a servant of Allah. Some events looked strange until the teacher explained them. The Quran does not give that teacher a name in the passage itself. We wait for a parent before adding any name.', 'موسیٰ اللہ کے ایک بندے سے سیکھنے گئے۔ کچھ باتیں عجیب لگیں، پھر استاد نے انہیں سمجھایا۔ اس حصے میں قرآن نے استاد کا نام نہیں لیا۔ نام جوڑنے سے پہلے والدین سے پوچھیں۔', 'A student stays humble and asks.', 'Quran 18:60-82. Do not name the teacher from later reports until those reports are checked.'),
  story('story-8', 'Dawud remembers Allah', 6, 'Prophet Dawud was given the Zabur and a beautiful voice for remembering Allah. He was also a king who had to be fair. Children can learn that a strong person still needs salah and fairness.', 'نبی داؤد کو زبور ملی اور اللہ کو یاد کرنے کی خوبصورت آواز ملی۔ وہ بادشاہ بھی تھے جنہیں انصاف کرنا تھا۔ بچے سیکھ سکتے ہیں کہ طاقتور آدمی کو بھی نماز اور انصاف چاہیے۔', 'Strength still bows to Allah.', 'Quran 17:55 and 38:17-26. Leave out the harder court story for little children.'),
  story('story-9', 'Sulayman and the ant', 5, 'Prophet Sulayman could understand birds. One day an ant warned the other ants to move aside so they would not be harmed. Sulayman smiled and thanked Allah. He did not crush the tiny creatures.', 'نبی سلیمان پرندوں کی بات سمجھتے تھے۔ ایک دن ایک چیونٹی نے دوسری چیونٹیوں کو خبردار کیا کہ ہٹ جاؤ تاکہ انہیں نقصان نہ پہنچے۔ سلیمان مسکرائے اور اللہ کا شکر کیا۔ انہوں نے چھوٹے جانوروں کو نہیں کچلا۔', 'Notice small creatures, and thank Allah.', 'Quran 27:16-19. Confirm the verses before acting the story out.'),
  story('story-10', 'Yunus calls from the dark', 7, 'Prophet Yunus left his people when he was upset. He ended up in a dark place and called to Allah: there is no god except You, glory be to You, I have been among the wrongdoers. Allah saved him. Teach the meaning before the Arabic.', 'نبی یونس اپنی قوم سے ناراض ہو کر نکلے۔ وہ ایک اندھیری جگہ پہنچے اور اللہ کو پکارا: تیرے سوا کوئی معبود نہیں، تو پاک ہے، میں غلط کرنے والوں میں تھا۔ اللہ نے انہیں بچایا۔ عربی سے پہلے مطلب سکھائیں۔', 'When we are lost, we call Allah and do not give up.', 'Quran 21:87. The Arabic of the dua was not fetched into this draft, so it is not pasted here.'),
  story('story-11', 'Isa speaks with mercy', 6, 'The Quran says Isa was a prophet and a word from Allah to Maryam. As a baby he spoke to defend his mother. He taught people to worship Allah. Muslims love him and do not worship him.', 'قرآن کہتا ہے کہ عیسیٰ نبی تھے اور مریم کی طرف اللہ کی طرف سے ایک کلمہ تھے۔ انہوں نے بچپن میں اپنی ماں کا دفاع کیا۔ انہوں نے لوگوں کو اللہ کی عبادت سکھائی۔ مسلمان انہیں مانتے ہیں اور ان کی عبادت نہیں کرتے۔', 'Love the prophets, and worship only Allah.', 'Quran 19:29-34 and 3:45. Confirm the verses. Do not import stories from other scriptures without review.'),
  story('story-12', 'A gentle boy in Makkah', 6, 'Before prophethood, Muhammad was known among his people as an honest young man. He looked after sheep and helped his family. This lesson uses the character people remembered. A seerah book should be named before more details are added.', 'نبوت سے پہلے محمد اپنی قوم میں ایک سچے نوجوان کے طور پر جانے جاتے تھے۔ وہ بکریاں چراتے اور گھر والوں کی مدد کرتے تھے۔ یہ سبق اس اخلاق کا ہے جو لوگ یاد رکھتے تھے۔ مزید تفصیل سے پہلے سیرت کی کتاب کا نام لکھیں۔', 'Honesty shows before anyone gives you a title.', 'Standard seerah description. Needs a named children\'s seerah book.'),
  story('story-13', 'The word Read', 7, 'In the cave of Hira, the first revealed word is remembered as Iqra: Read. The Prophet repeated that he could not read, and then the words of Surah Al-Alaq came. We do not paste the Arabic here because it was not copied from a fetched mushaf text in this draft.', 'غارِ حرا میں پہلا لفظ اقراء یاد کیا جاتا ہے: پڑھو۔ نبی نے کہا کہ میں پڑھ نہیں سکتا، پھر سورۃ العلق کے الفاظ آئے۔ اس مسودے میں عربی اس لیے نہیں ہے کہ اسے مصحف کے API متن سے نقل نہیں کیا گیا۔', 'Learning begins with trying, and with Allah\'s help.', 'Surah 96:1-5. Fetch the Arabic before teaching the recitation.'),
  story('story-14', 'Kindness to children', 4, 'Muslims remember that the Prophet was gentle with children. He did not shame them for small mistakes. A reviewer should add one checked hadith, such as a report from Sahih al-Bukhari, instead of a made-up scene.', 'مسلمان یاد رکھتے ہیں کہ نبی بچوں کے ساتھ نرم تھے۔ وہ چھوٹی بھول پر انہیں شرمندہ نہیں کرتے تھے۔ جائزہ لینے والا کوئی چیک شدہ حدیث لگائے، بخاری جیسی کتاب سے، خود کوئی منظر نہ بنائے۔', 'Little mistakes need teaching, not shame.', 'Seerah theme. No specific hadith text is quoted until a reviewer adds one.'),
  story('story-15', 'A shared plate', 4, 'A family can put food in the middle and eat together after saying Bismillah. The Prophet\'s manners at meals are taught in hadith books. This story only teaches sharing and the basmala. It does not quote a meal hadith.', 'خاندان کھانا بیچ میں رکھ کر بسم اللہ کے بعد ساتھ کھا سکتا ہے۔ نبی کے کھانے کے آداب حدیث کی کتابوں میں ہیں۔ یہ کہانی صرف بانٹنے اور بسملہ کی ہے۔ یہ کھانے کی کوئی حدیث نقل نہیں کرتی۔', 'Share food and begin with Allah\'s name.', 'Classroom story. Basmala is Quran 1:1. No meal hadith is cited.'),
  story('story-16', 'The salaam at the door', 4, 'A child knocks, says Assalamu alaykum, and waits. The people inside answer. Quran 4:86 teaches that a greeting is returned with a greeting as good or better. Confirm that verse with a parent.', 'بچہ دروازہ کھٹکھٹاتا ہے، السلام علیکم کہتا ہے، اور ٹھہرتا ہے۔ اندر والے جواب دیتے ہیں۔ سورۃ النساء 86 میں سلام کا جواب دینے کا ذکر ہے۔ والدین کے ساتھ آیت دیکھیں۔', 'Bring peace into a room before you bring noise.', 'Quran 4:86. Arabic not fetched in this draft.'),
  story('story-17', 'The broken cup', 4, 'A child breaks a cup and wants to hide it. A parent in this story says, "Tell me the truth. We can clean it together." The story is a practice scene, not a hadith.', 'ایک بچے سے کپ ٹوٹ جاتا ہے اور وہ چھپانا چاہتا ہے۔ اس کہانی میں والد کہتے ہیں: سچ بتاؤ، ہم مل کر صاف کر لیں گے۔ یہ مشق کا منظر ہے، حدیث نہیں۔', 'Truth is safer than a quick lie.', 'Original classroom story. No religious quotation.'),
  story('story-18', 'A chair for a parent', 5, 'A child sees a parent looking tired and brings a chair and a glass of water. Quran 17:23 tells children to speak kindly to parents. The glass of water is our example, not a verse.', 'بچہ دیکھتا ہے کہ والد تھکے ہوئے ہیں، تو وہ کرسی اور پانی کا گلاس لے آتا ہے۔ سورۃ الاسراء 23 بچوں کو والدین سے اچھی بات کرنے کو کہتی ہے۔ پانی کا گلاس ہماری مثال ہے، آیت نہیں۔', 'Kindness to parents is a daily job.', `Quran 17:23. Arabic copied from api.alquran.cloud: ${parents}`),
  story('story-19', 'The neighbor\'s bowl', 6, 'A family cooks a little extra and sends a bowl next door. Muslims teach care for neighbors. A well-known hadith says Jibril kept advising the Prophet about the neighbor. Add the exact hadith only after checking it.', 'ایک خاندان تھوڑا سا کھانا زیادہ پکا کر بغل والے گھر بھیج دیتا ہے۔ مسلمان پڑوسی کا خیال رکھنا سکھاتے ہیں۔ ایک مشہور حدیث میں جبریل بار بار پڑوسی کی وصیت کرتے ہیں۔ ٹھیک حدیث چیک کرنے کے بعد ہی شامل کریں۔', 'A neighbor is part of worship when we are fair and kind.', 'Theme of the neighbor hadith in Sahih al-Bukhari. Number and Arabic are not pasted until checked.'),
  story('story-20', 'A clean heart before Eid', 5, 'Before Eid, a family cleans the house, wears simple clean clothes, and forgives a small quarrel. Eid is a happy day of prayer and thanks. This story does not set the date or the prayer steps. A parent leads those.', 'عید سے پہلے خاندان گھر صاف کرتا ہے، سادہ صاف کپڑے پہنتا ہے، اور چھوٹی ناراضی معاف کرتا ہے۔ عید خوشی، نماز اور شکر کا دن ہے۔ یہ کہانی تاریخ یا نماز کے طریقے مقرر نہیں کرتی۔ وہ والدین بتائیں۔', 'Joy is cleaner when we have forgiven.', 'Family practice around Eid. Not a hadith quotation.'),
]

function lesson(id, title, category, ageMin, bodyEn, bodyUr, arabic, source) {
  return {
    id,
    title,
    category,
    arabic: arabic ?? '',
    transliteration: '',
    translations: { en: bodyEn, ur: bodyUr },
    bodyEn,
    bodyUr,
    source,
    audioUrl: null,
    verified: false,
    reviewedBy: null,
    reviewStatus: 'needs_review',
    ageMin,
    ageMax: 10,
  }
}

const lessonSource = 'Draft lesson for ages 3–10. It is not a fatwa. A parent or teacher should confirm the practice their family follows.'

export const lessons = [
  lesson('lesson-1', 'What wudu is for', 'wudu', 5, 'Wudu is a wash before salah. It helps our body and our heart get ready. We do it calmly, without splashing friends.', 'وضو نماز سے پہلے کی صفائی ہے۔ اس سے بدن اور دل تیار ہوتے ہیں۔ اسے سکون سے کریں، دوستوں پر پانی نہ اچھالیں۔', '', lessonSource),
  lesson('lesson-2', 'The washes Allah named', 'wudu', 6, 'Quran 5:6 tells believers who stand for prayer to wash the face, wash the arms to the elbows, wipe the head, and wash the feet to the ankles. Some families also rinse the mouth and nose. Ask your parent which extra steps you copy.', 'سورۃ المائدہ 6 میں نماز کے لیے اٹھنے والوں کو منہ دھونے، کہنیوں تک ہاتھ دھونے، سر کا مسح کرنے اور ٹخنوں تک پاؤں دھونے کو کہا گیا ہے۔ کچھ گھر منہ اور ناک بھی دھوتے ہیں۔ اضافی عمل والدین سے پوچھیں۔', wudu, `Quran 5:6, the wudu portion. ${fetched}`),
  lesson('lesson-3', 'Saying Bismillah at the tap', 'wudu', 4, 'Many families say Bismillah before wudu. The basmala is Quran 1:1. If your teacher uses a longer phrase, learn that phrase from them.', 'بہت سے گھر وضو سے پہلے بسم اللہ کہتے ہیں۔ بسملہ سورۃ الفاتحہ کی پہلی آیت ہے۔ اگر استاد لمبا جملہ سکھائیں تو وہی سیکھیں۔', bismillah, `Quran 1:1. ${fetched}`),
  lesson('lesson-4', 'Do not waste water', 'wudu', 4, 'A little water is enough. Close the tap while you wipe. Wasting water is not part of being clean.', 'تھوڑا پانی کافی ہے۔ مسح کے وقت نل بند کر دیں۔ پانی ضائع کرنا صفائی کا حصہ نہیں۔', '', lessonSource),
  lesson('lesson-5', 'When water is hard to use', 'wudu', 8, 'Quran 5:6 also mentions tayammum with clean earth when water cannot be used. A parent must show this. Children should not wipe random dust without being taught.', 'سورۃ المائدہ 6 میں پانی نہ ملنے پر پاک مٹی سے تیمم کا ذکر بھی ہے۔ یہ والدین دکھائیں۔ بچہ خود سے مٹی نہ لگائے۔', '', `Quran 5:6. ${fetched} The full verse is long; the Arabic field on the wudu lesson has the washing portion.`),
  lesson('lesson-6', 'Five prayers in the day', 'salah', 5, 'The obligatory prayers are Fajr, Zuhr, Asr, Maghrib, and Isha. A parent calls the child when it is time. We do not guess the clock time from this page.', 'فرض نمازیں فجر، ظہر، عصر، مغرب اور عشاء ہیں۔ وقت پر والدین بلائیں۔ اس صفحے سے گھڑی کا وقت نہ ناپیں۔', '', `${lessonSource} The five prayers are established in authentic hadith. Confirm the reference you want printed.`),
  lesson('lesson-7', 'Face the Kaaba', 'salah', 5, 'For salah we face the Kaaba in Makkah. At home, a parent shows the qibla. We do not turn toward a picture or a person.', 'نماز میں ہم مکہ کے کعبہ کی طرف رخ کرتے ہیں۔ گھر میں قبلہ والدین بتائیں۔ تصویر یا آدمی کی طرف رخ نہیں کرتے۔', '', lessonSource),
  lesson('lesson-8', 'A calm body in salah', 'salah', 4, 'Stand on a clean place. Keep your eyes lowered. Do not poke the person beside you. If you forget a movement, keep going calmly and ask afterward.', 'صاف جگہ کھڑے ہوں۔ نگاہ نیچی رکھیں۔ بغل والے کو نہ چھیڑیں۔ اگر کوئی حرکت بھول جائیں تو سکون سے آگے بڑھیں اور بعد میں پوچھیں۔', '', lessonSource),
  lesson('lesson-9', 'Learning the words', 'salah', 6, 'A child repeats Al-Fatiha with a parent. We never invent Arabic to fill a gap. If a word is hard, we slow down.', 'بچہ الفاتحہ والدین کے ساتھ دہرائے۔ خالی جگہ بھرنے کے لیے عربی خود نہیں بناتے۔ لفظ مشکل ہو تو آہستہ کریں۔', '', lessonSource),
  lesson('lesson-10', 'After the salaam', 'salah', 6, 'When the prayer ends, sit for a short dhikr. The after-prayer items in Daily Azkar are drafts. Use only the ones your teacher has checked.', 'نماز ختم ہو تو تھوڑی دیر ذکر کے لیے بیٹھیں۔ اذکار کے بعد والی نماز والے مسودے ہیں۔ صرف وہ استعمال کریں جنہیں استاد چیک کر چکے ہوں۔', '', lessonSource),
  lesson('lesson-11', 'Clean clothes', 'cleanliness', 3, 'Clean clothes and a clean prayer place are part of getting ready. A small stain is not a disaster. Ask a parent if you are unsure.', 'صاف کپڑے اور صاف جائے نماز تیاری کا حصہ ہیں۔ چھوٹا داغ کوئی آفت نہیں۔ شک ہو تو والدین سے پوچھیں۔', '', lessonSource),
  lesson('lesson-12', 'The bathroom', 'cleanliness', 4, 'We enter the bathroom with the foot your family teaches, and we leave clean. We do not recite Quran inside. A parent teaches the short entrance words if they use them.', 'بیت الخلا میں وہ پاؤں رکھیں جو گھر سکھائے، اور صاف ہو کر نکلیں۔ اندر قرآن نہیں پڑھتے۔ داخلے کے مختصر الفاظ والدین سکھائیں اگر وہ استعمال کرتے ہوں۔', '', lessonSource),
  lesson('lesson-13', 'Hands before food', 'cleanliness', 3, 'Wash your hands before you eat. Say Bismillah. If you forget, the eating azkar include a draft phrase to check.', 'کھانے سے پہلے ہاتھ دھوئیں۔ بسم اللہ کہیں۔ بھول جائیں تو کھانے کے اذکار میں ایک مسودہ جملہ ہے جسے چیک کرنا ہے۔', bismillah, `Quran 1:1 for the basmala. ${fetched}`),
  lesson('lesson-14', 'Kind words', 'kindness', 4, 'A kind word is a gift. We do not copy unkind jokes. If we hurt someone, we say sorry on the same day.', 'نرم بات ایک تحفہ ہے۔ برے مذاق نہیں نقل کرتے۔ کسی کو دکھ ہو تو اسی دن معافی مانگیں۔', '', lessonSource),
  lesson('lesson-15', 'Helping at home', 'kindness', 4, 'Carrying a plate, folding a scarf, or bringing a glass of water is worship when we do it for Allah. No special hadith is quoted here.', 'پلیٹ اٹھانا، اسکارف تہہ کرنا، یا پانی لانا اللہ کے لیے ہو تو عبادت ہے۔ یہاں کوئی خاص حدیث نقل نہیں۔', '', lessonSource),
  lesson('lesson-16', 'The truth', 'honesty', 4, 'If you break something, say what happened. A lie makes a second problem. Parents can help clean the first one.', 'اگر کوئی چیز ٹوٹ جائے تو جو ہوا وہ بتائیں۔ جھوٹ دوسرا مسئلہ بناتا ہے۔ پہلا مسئلہ والدین صاف کرنے میں مدد کرتے ہیں۔', '', lessonSource),
  lesson('lesson-17', 'Other people\'s things', 'honesty', 5, 'A pencil that is not yours stays where it is, unless you are borrowing it with permission. We return what we borrow.', 'جو پنسل آپ کی نہیں وہ وہیں رہے، جب تک اجازت سے ادھار نہ لیں۔ ادھار واپس کرتے ہیں۔', '', lessonSource),
  lesson('lesson-18', 'Parents grow tired', 'parents', 5, 'Quran 17:23 says not to say "uff" to parents and to speak a kind word. When they are tired, we use a soft voice and help with one small job.', 'سورۃ الاسراء 23 کہتی ہے کہ والدین کو اف نہ کہو اور اچھی بات کرو۔ جب وہ تھکے ہوں تو نرم آواز اور ایک چھوٹا کام ان کی مدد ہے۔', parents, `Quran 17:23. ${fetched}`),
  lesson('lesson-19', 'Listening the first time', 'parents', 4, 'When a parent calls, we answer. If we are in the middle of a game, we pause. This is respect, not a race.', 'جب والدین بلائیں تو جواب دیں۔ کھیل کے بیچ میں ہوں تو رکیے۔ یہ عزت ہے، دوڑ نہیں۔', '', lessonSource),
  lesson('lesson-20', 'Sharing toys', 'sharing', 3, 'Two children and one truck can take turns. Count to ten, then swap. Sharing is practiced, not perfect on the first day.', 'دو بچے اور ایک ٹرک باری سے چل سکتا ہے۔ دس تک گنیں، پھر بدل لیں۔ بانٹنا مشق ہے، پہلے دن کامل نہیں ہوتا۔', '', lessonSource),
  lesson('lesson-21', 'A bigger piece', 'sharing', 5, 'Offer the bigger piece first. You can still enjoy yours. We do not quote a hadith here until one is checked.', 'بڑا ٹکڑا پہلے پیش کریں۔ اپنا ٹکڑا پھر بھی اچھا لگے گا۔ حدیث اس وقت تک نقل نہیں کرتے جب تک چیک نہ ہو۔', '', lessonSource),
  lesson('lesson-22', 'Alhamdulillah for small things', 'gratitude', 4, 'A cup of water, a blanket, and a safe home are gifts. Say Alhamdulillah for one of them each morning.', 'پانی کا گلاس، کمبل، اور محفوظ گھر نعمتیں ہیں۔ ہر صبح ان میں سے ایک پر الحمد للہ کہیں۔', '', lessonSource),
  lesson('lesson-23', 'Thank the person too', 'gratitude', 4, 'Thank Allah, and thank the person who helped. Both can be true.', 'اللہ کا شکر کریں، اور جس نے مدد کی اس کا بھی شکریہ کہیں۔ دونوں ٹھیک ہو سکتے ہیں۔', '', lessonSource),
  lesson('lesson-24', 'Salam first', 'daily-life', 3, 'Assalamu alaykum is the first word at the door. Wait for the answer. Then talk.', 'دروازے پر پہلا لفظ السلام علیکم ہے۔ جواب کا انتظار کریں۔ پھر بات کریں۔', '', lessonSource),
  lesson('lesson-25', 'Mosque manners', 'daily-life', 5, 'Walk, do not race. Phones stay quiet. Shoes go where your family puts them. Sit where a grown-up shows you.', 'چلیں، دوڑ نہیں۔ فون خاموش رہے۔ جوتے وہاں رکھیں جہاں گھر والے رکھتے ہیں۔ جہاں بڑا بتائے وہاں بیٹھیں۔', '', lessonSource),
  lesson('lesson-26', 'Ramadan for little children', 'daily-life', 5, 'Little children do not have to fast the whole day. They can help with iftar, share dates, and keep their voices kind. A parent decides any practice fast.', 'چھوٹے بچوں پر پورا دن روزہ لازم نہیں۔ وہ افطار میں مدد، کھجور بانٹنے، اور نرم آواز رکھ سکتے ہیں۔ کوئی مشق والا روزہ والدین طے کریں۔', '', lessonSource),
  lesson('lesson-27', 'Animals and insects', 'daily-life', 4, 'We do not pull tails or crush ants for fun. Sulayman\'s ant is a Quran story about care. Confirm Quran 27:18 before telling it as recitation.', 'ہم مذاق میں دم نہیں کھینچتے اور چیونٹی نہیں کچلتے۔ سلیمان کی چیونٹی قرآن کا خیال رکھنے والا قصہ ہے۔ تلاوت کے طور پر سنانے سے پہلے سورۃ النمل 18 دیکھیں۔', '', lessonSource),
  lesson('lesson-28', 'Asking forgiveness', 'daily-life', 6, 'Astaghfirullah is a short way to ask Allah for forgiveness. The longer sayyidul istighfar is in the morning azkar as a draft. Use the short phrase until the long one is checked.', 'استغفراللہ اللہ سے مختصر معافی ہے۔ لمبا سید الاستغفار صبح کے اذکار میں مسودہ ہے۔ لمبا جملہ چیک ہونے تک مختصر جملہ استعمال کریں۔', '', lessonSource),
  lesson('lesson-29', 'Friends who are left out', 'daily-life', 5, 'If a child is standing alone, invite them into the game. One extra turn is enough. We do not need a pointed hadith to know this is kind.', 'اگر کوئی بچہ اکیلا کھڑا ہو تو اسے کھیل میں بلائیں۔ ایک اضافی باری کافی ہے۔ مہربانی کے لیے کسی خاص حدیث کا انتظار ضروری نہیں۔', '', lessonSource),
  lesson('lesson-30', 'When you are not sure', 'daily-life', 5, 'If a lesson, a dua, or a story feels uncertain, stop and ask a parent or a teacher. Little Noor would rather show a draft than invent a verse.', 'اگر کوئی سبق، دعا یا کہانی غیر یقینی لگے تو رکیں اور والدین یا استاد سے پوچھیں۔ لٹل نور آیت بنانے کے بجائے مسودہ دکھانا پسند کرتا ہے۔', '', 'Project rule for this library. Not a religious source.'),
]

function activity(id, title, category, ageMin, ageMax, points, instructions, reviewStatus = 'draft') {
  return {
    id,
    title,
    category,
    arabic: '',
    transliteration: '',
    translations: {
      en: instructions,
      ur: 'اس سرگرمی کی اردو ہدایت ابھی لکھی نہیں گئی۔ جائزے کے بعد شامل کریں۔',
    },
    instructions,
    source: reviewStatus === 'draft'
      ? 'Original classroom activity. It does not quote a hadith. Suggested stars are learning points, not money, and they are not added automatically on the Games page.'
      : textbook,
    audioUrl: null,
    verified: false,
    reviewedBy: null,
    reviewStatus,
    ageMin,
    ageMax,
    rewardPoints: points,
    difficulty: ageMin <= 5 ? 'easy' : 'growing',
  }
}

export const activities = [
  activity('activity-1', 'Three kind acts', 'kindness', 4, 7, 1, 'With a parent, notice three kind acts today. Draw a star for each one on paper.'),
  activity('activity-2', 'Salam practice', 'daily-life', 3, 6, 1, 'Practice Assalamu alaykum and the reply at home. Take turns being the person at the door.', 'needs_review'),
  activity('activity-3', 'Bismillah at the table', 'eating', 3, 6, 1, 'Before one meal, wash hands and say Bismillah together. Use the eating azkar only after a parent is content with the wording.', 'needs_review'),
  activity('activity-4', 'Thanks walk', 'gratitude', 4, 8, 1, 'Walk through one room and say Alhamdulillah for three things you can see.'),
  activity('activity-5', 'Toy turns', 'sharing', 3, 6, 1, 'Set a timer for two minutes. Share one toy, then swap. No winner and no loser.'),
  activity('activity-6', 'Parent helper', 'parents', 4, 8, 2, 'Choose one job: shoes in a row, a glass of water, or a cushion. Do it without being asked twice.'),
  activity('activity-7', 'Wudu order cards', 'wudu', 6, 10, 2, 'Make four cards: face, arms, head, feet. Put them in the order of Quran 5:6. A parent checks the order.', 'needs_review'),
  activity('activity-8', 'Prayer names', 'salah', 5, 8, 1, 'Match Fajr, Zuhr, Asr, Maghrib, and Isha to morning, midday, afternoon, sunset, and night. Use pictures of the sky, not clocks.'),
  activity('activity-9', 'Quiet standing', 'salah', 4, 7, 1, 'Stand still for twenty slow breaths as if beside a parent in salah. Then relax.'),
  activity('activity-10', 'Qibla finder', 'salah', 6, 10, 1, 'Ask a parent to show the qibla at home. Place a small marker. Do not use a random direction.'),
  activity('activity-11', 'One short surah', 'quran', 6, 10, 2, 'Listen to Al-Ikhlas once with a parent. Repeat only the lines they approve from the azkar draft.', 'needs_review'),
  activity('activity-12', 'Mushaf care', 'quran', 5, 10, 1, 'Show how to pick up a Quran with clean hands and put it in a high, clean place.'),
  activity('activity-13', 'Tasbeeh thirty-three', 'dhikr', 6, 10, 2, 'Open the Tasbeeh page and count to 33 with a parent. The Arabic on that page stays a placeholder until a phrase is linked on purpose.', 'needs_review'),
  activity('activity-14', 'Story together', 'stories', 4, 8, 1, 'Read one story from the draft library. The child retells the lesson in one sentence. The parent corrects any added scene.'),
  activity('activity-15', 'Neighbor bowl', 'kindness', 5, 10, 2, 'With a parent, share a piece of fruit with a neighbor or a family in the next room. Do not go outside alone.'),
  activity('activity-16', 'Sorry note', 'honesty', 5, 8, 1, 'Draw a picture that says sorry for a small mistake. No long speeches needed.'),
  activity('activity-17', 'Truth or mix-up', 'honesty', 6, 10, 1, 'A parent tells two short events, one true and one mixed up. The child spots the made-up part. Use everyday events, not religious claims.'),
  activity('activity-18', 'Clean corner', 'cleanliness', 3, 7, 1, 'Choose one corner and put ten items back where they belong.'),
  activity('activity-19', 'Water saver', 'cleanliness', 4, 8, 1, 'Brush teeth or wash hands while turning the tap off for part of the time. A parent supervises water.'),
  activity('activity-20', 'Mosque bag', 'daily-life', 5, 10, 1, 'Pack a small mosque bag: a bottle of water, clean socks, and a quiet reminder card. Leave the phone on silent.'),
  activity('activity-21', 'Eid kindness list', 'daily-life', 5, 10, 1, 'Before Eid, list three people to greet. Include someone who might be left out.'),
  activity('activity-22', 'Ramadan helper', 'daily-life', 5, 10, 2, 'Help set the iftar table. Children who are not fasting can still pour water and smile.'),
  activity('activity-23', 'Animal kindness', 'kindness', 4, 8, 1, 'Put water out for a bird or be gentle with a pet. A parent stays nearby. Do not approach strange animals.'),
  activity('activity-24', 'Name practice', 'manners', 4, 7, 1, 'Practice calling a friend by the name they like. Cross out any unkind nickname on a paper and throw it away.'),
  activity('activity-25', 'Guest cushion', 'manners', 4, 8, 1, 'When someone visits, move one cushion to make a seat. Say salam first.'),
  activity('activity-26', 'Five pillars fingers', 'basic', 6, 10, 1, 'Hold up five fingers and name shahada, salah, zakat, fasting, and Hajj. A parent corrects the order they prefer to teach.', 'needs_review'),
  activity('activity-27', 'Prophet match', 'prophets', 7, 10, 2, 'Match five prophets to one gentle fact from the draft stories. If a fact feels uncertain, leave it blank for review.', 'needs_review'),
  activity('activity-28', 'No invented verse', 'quran', 7, 10, 1, 'A parent writes one real short ayah from a mushaf. The child copies it. If the draft on screen disagrees with the mushaf, follow the mushaf.', 'needs_review'),
  activity('activity-29', 'Review flag', 'family', 8, 10, 1, 'Sit with a parent and mark one azkar item that still says needs review. Write the question you want a teacher to answer.'),
  activity('activity-30', 'Star jar', 'rewards', 4, 8, 1, 'Put one paper star in a jar for a finished activity. Tell the child these stars are not money and are not the same as the stars counted in Games until a parent says so.'),
]
