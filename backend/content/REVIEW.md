# Content review checklist

Every religious item in this library is unpublished. `verified` is false. Nothing here is labeled authentic.

Before changing an item to `verified`:

1. Compare the Arabic with a printed mushaf or a hadith collection you trust. The Quran lines copied from `api.alquran.cloud` still need that check.
2. Check the transliteration out loud with a teacher.
3. Check the English and Urdu meanings. The Urdu Quran lines use the Fateh Muhammad Jalandhry translation from that same API. Other Urdu lines are simple drafts.
4. Check the source. If a hadith number is missing, or the note says the number differs by edition, find the exact reference. Do not leave a guessed number.
5. Remove any sentence a child aged 3–10 should not hear yet.
6. Only then set `reviewStatus` to `verified` and `verified` to `true`, and set `reviewedBy` to the reviewer's name.

`draft` means the item is an original classroom activity, not a religious quotation.

`needs_review` means a person still has to check the religious wording or the citation.

The public learning pages show these drafts with the existing badge “Demo content - not yet verified.” The database policy does the opposite: anonymous readers can select a row only when `verified` is true. The website still reads the JSON files, not that table.

Do not mark the whole library verified in one step.
