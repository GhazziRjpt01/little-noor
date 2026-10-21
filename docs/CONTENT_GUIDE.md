# Little Noor content guide

Religious wording is not stored in this project yet. The JSON files under `frontend/src/data/` are empty slots. A qualified scholar should review every item before launch.

## Files

| File | What it holds |
| --- | --- |
| `frontend/src/data/kalimas.json` | 6 Kalima slots, numbered 1–6 |
| `frontend/src/data/azkar.json` | Morning, evening, and after-prayer lists, with 3 slots each |
| `frontend/src/data/quizQuestions.json` | 8 empty quiz slots in four sets: Kalimas, Manners, Prayer, Basic knowledge |

`frontend/src/services/contentService.js` loads these files for the app. The pages do not need a backend for this data.

## Shared item shape

Each Kalima, azkar entry, and quiz question uses this shape:

| Field | What to put |
| --- | --- |
| `id` | A stable key, such as `kalima-1`. Do not change it after screens start using it. |
| `title` | A short label. The starter titles are numbers only, such as `Kalima 1` or `Morning 1`. You may replace a title with the name you want shown. |
| `arabic` | The Arabic text you supply. |
| `transliteration` | The Latin-letter reading you supply. |
| `translations.en` | The English meaning you supply. |
| `translations.ur` | The Urdu meaning you supply. |
| `source` | The book or reference the wording came from, written so a reviewer can check it. |
| `audioUrl` | Leave `null` until a real audio file exists. |
| `verified` | Keep `false` until a qualified scholar has approved that item. |
| `reviewedBy` | Leave `null` until review. Then record the reviewer's name. |

Every religious field currently contains the exact text `TO_BE_PROVIDED`. Replace that placeholder with the text you provide. Do not leave `TO_BE_PROVIDED` on an item you mark as verified.

## Azkar categories

`azkar.json` has three categories:

- `morning`
- `evening`
- `after-prayer`

Add another object inside a category's `items` array when you need more than three. Copy the same fields. Give the new item its own `id`.

## Quiz questions

Each question has the shared fields, plus:

| Field | What to put |
| --- | --- |
| `category` | One of `kalimas`, `manners`, `prayer`, or `basic-knowledge`. |
| `options` | Four answer choices. Each option has an `id` (`a`, `b`, `c`, `d`), `text`, `icon` (`sun`, `heart`, `star`, or `cloud`), and `imageUrl`. Leave `imageUrl` as `null` until a real picture file exists. The icon lets a young child tap a picture before they can read. |
| `correctOptionId` | The `id` of the correct option. It is `null` until you set it. Leave it `null` rather than guessing. |

The question wording belongs in `translations.en` and `translations.ur`. Use `arabic` and `transliteration` only when that question includes them.

## Showing the demo badge

`frontend/src/components/VerificationBadge.jsx` shows **Demo content - not yet verified** when `verified` is not `true`.

```jsx
import VerificationBadge from '../components/VerificationBadge.jsx'

<VerificationBadge verified={item.verified} />
```

The badge stays hidden only when `verified` is `true`.

## Before launch

1. Replace every `TO_BE_PROVIDED` value with text you have checked against your source.
2. Set `correctOptionId` on each quiz question.
3. Ask a qualified scholar to review the Arabic, transliteration, translations, quiz answers, and sources.
4. After that review, set `verified` to `true` and set `reviewedBy` to the reviewer's name.
5. Keep `verified` as `false` for anything that has not been reviewed.

Do not launch Little Noor with religious text that is still unverified.
