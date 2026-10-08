# 상식 퀴즈 웹 앱 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**실행자는 이 계획과 `PRD.md`를 함께 읽습니다.** 이 계획은 PRD가 정한 것을 작업 순서로 옮긴 것이고, 둘이 어긋나면 PRD가 우선합니다. 실행자는 앞선 대화를 모른다고 가정하고 썼습니다.

**Goal:** 서버 없이 브라우저에서 파일로 열어 동작하는 4지선다 상식 퀴즈 웹 앱을 만든다. 답을 고르면 그 자리에서 정답 여부와 한 줄 해설을 보여 준다.

**Architecture:** 코드 파일 4개로 된 정적 앱이다. `questions.js`가 전역 상수 `QUIZ_DATA` 하나를 선언하고, `script.js`가 즉시 실행 함수 안에서 데이터·규칙·상태·화면 네 층으로 나뉘어 그 데이터를 읽는다. 화면 4개는 `index.html` 안에 모두 들어 있고 한 번에 하나만 보인다.

**Tech Stack:** HTML, CSS, 순수 자바스크립트(ES2015 수준). 모듈·빌드 도구·프레임워크·외부 라이브러리·네트워크 요청 없음.

**Spec:** `PRD.md`

---

## 실행 규칙

1. **단계가 끝나면 멈춘다.** 사람이 브라우저에서 확인 항목을 점검하고 다음으로 가라고 할 때까지 다음 단계의 태스크를 시작하지 않는다. 단계 끝에서 그 단계의 확인 항목을 사람에게 알린다.
2. 태스크마다 이 순서를 지킨다. **확인 절차를 먼저 실행해 실패를 본다 → 구현한다 → 다시 실행해 통과를 본다 → 커밋한다.** 통과하지 못한 태스크를 커밋하지 않는다.
3. 계획과 다르게 정해야 할 일이 생기면 혼자 정하고 넘어가지 말고, 그 결정과 이유를 단계 완료 보고에 적는다.
4. 돌려보지 않은 것을 통과했다고 적지 않는다.

## Global Constraints

- 코드 파일은 `index.html`, `style.css`, `script.js`, `questions.js` 4개뿐이다. 테스트 파일을 만들지 않는다. 자체 점검 코드도 `script.js` 안에 둔다.
- `file://`로 열어 동작해야 한다. `import` / `export`를 쓰지 않는다. `fetch`를 쓰지 않는다. `<script type="module">`을 쓰지 않는다.
- `questions.js`는 전역 상수 `QUIZ_DATA` 하나만 선언한다.
- `script.js` 전체를 즉시 실행 함수로 감싼다. 전역에 더하는 이름은 없다. 읽는 전역은 `QUIZ_DATA` 하나다.
- `document`를 만지는 함수와 만지지 않는 함수를 섞지 않는다(PRD 5.2의 네 층).
- 점수는 1 / 0.5 / 0 중 하나이고 한 판 만점은 10이다. 표시는 `formatScore`를 거친다.
- 스피드 모드 제한 시간은 15초로 고정한다.
- 순위표는 `localStorage` 키 `quizA.leaderboard.v1` 하나를 쓰고, 조합(`카테고리id|모드`)마다 상위 5건을 남기며, 동점은 먼저 저장된 기록이 위에 온다. 날짜는 `YYYY-MM-DD`다.
- 이름은 앞뒤 공백을 지운 뒤 1~12자로 자르고, 비어 있으면 `익명`으로 저장한다.
- 문항 규칙 5개(PRD 2.5)를 모든 문항이 지킨다.
- 커밋 메시지는 한국어로 쓰고 `feat:` / `fix:` / `docs:` 접두사를 붙인다.

## 검증 수단 세 가지

| 수단 | 누가 | 언제 | 무엇을 |
| --- | --- | --- | --- |
| 자체 점검 `?test` | 실행자 | 태스크마다 | 규칙 층 함수의 동작. 단계 1에서 12개, 단계 2에서 15개, 단계 3에서 20개 |
| 단계 완료 기준 | 실행자 | 단계 끝 | PRD 6.1·6.2·6.3의 목록 |
| 직접 확인할 항목 | 사람 | 단계 끝 | 브라우저에서 눈으로. 모두 41개(13 / 17 / 11) |

## 자체 점검 (`?test`)

`script.js` 맨 아래에 점검 코드를 둔다. 주소 끝에 `?test`가 있을 때만 돈다.

```js
function runSelfTest() {
  var pass = 0, fail = 0;
  function check(name, ok) {
    if (ok) { pass++; console.log('PASS ' + name); }
    else { fail++; console.error('FAIL ' + name); }
  }
  // ... 점검 항목들 ...
  console.log('자체 점검 결과: 통과 ' + pass + ', 실패 ' + fail);
}
if (typeof location !== 'undefined' && location.search.indexOf('test') !== -1) runSelfTest();
```

브라우저 없이 터미널에서 같은 점검을 돌릴 때는 다음 한 줄을 쓴다.

```bash
node -e "global.location={search:'?test'};global.document={addEventListener:function(){},getElementById:function(){return null},querySelectorAll:function(){return []},createElement:function(){return {style:{},classList:{add:function(){},remove:function(){}},appendChild:function(){}}}};eval(require('fs').readFileSync('questions.js','utf8'));eval(require('fs').readFileSync('script.js','utf8'))"
```

점검은 규칙 층 함수만 건드린다. 규칙 층이 `document`를 모르기 때문에 화면 없이 돌아간다.

## 문항 작성 규칙 (PRD에 없는 추가 결정)

PRD 2.5의 규칙 5개에 더해 다음을 지킨다.

1. **출처 제한** — 위키백과, 나무위키, 개인 블로그는 출처로 쓰지 않는다. 정부·공공기관, 학술 기관, 사전·백과 기관, 언론사의 원문 페이지를 쓴다.
2. **열어서 확인** — 문항마다 출처 페이지를 실제로 열어 정답과 해설이 그 페이지에 있는지 대조한다. 열리지 않는 주제는 열리는 주제로 바꾸고, 바꾼 사실을 단계 완료 보고에 적는다.
3. **부정형 금지** — "~이 아닌 것은?", "~에 해당하지 않는 것은?" 같은 부정형 문제를 내지 않는다. 정답이 하나임을 보이기 어렵다.
4. **이견 있는 주제 금지** — 학계에 이견이 있는 주제(예: 어떤 고전의 작가가 누구인가)는 피하고 다른 것을 묻는다.
5. **검수표** — 카테고리 10문항을 쓸 때마다 아래 양식의 표를 보고에 붙인다.

| id | 문제 요약 | 정답 | 출처에서 확인한 내용 | 출처 | 열어서 확인 |
| --- | --- | --- | --- | --- | --- |
| kh-01 | ... | ... | ... | 기관명 | O |

## 문항 작성 템플릿

```js
{
  id: "kh-01",
  question: "조선의 네 번째 임금으로 훈민정음을 창제해 1446년에 반포한 사람은?",
  choices: ["세종", "태종", "성종", "세조"],
  answerIndex: 0,
  explanation: "세종이 1443년 훈민정음을 창제하고 1446년에 반포했다.",
  source: "국사편찬위원회 우리역사넷, 2026-10-08 확인",
  sourceUrl: "https://..."
}
```

최상급 표현을 쓸 때는 기준과 시점을 문제 문장에 넣는다. "가장 넓은 나라는?"이 아니라 **"2024년 기준 국토 면적이 가장 넓은 나라는?"**이다.

## Review Focus

PRD가 함의하지만 어느 확인 항목도 직접 건드리지 않는 입력과 실패 모드 다섯 개다. 각 줄의 확인은 괄호 안 태스크에 넣었다.

1. 보기를 섞은 뒤 `answerIndex`를 다시 계산하지 못해 정답 표시가 엉뚱한 보기에 붙는 경우. (Task 6)
2. `[다음]`을 빠르게 연타해 타이머가 겹쳐 돌아 1초에 2 이상 줄어드는 경우. (Task 10)
3. 10번째 문항에서 시간이 초과되는 경우. `[결과 보기]`가 나타나고 결과 화면으로 이어져야 한다. (Task 10)
4. 답을 고른 뒤 `[힌트]`를 누르는 경우. 보기가 더 사라지거나 점수가 바뀌어서는 안 된다. (Task 11)
5. `localStorage`에 배열이 아닌 값(객체·문자열·`null`)이 들어 있는 경우. (Task 14)

---

# 구현 1단계 — 연습 모드와 점수 (Task 1~8)

**만들 것**: 카테고리 선택 화면, 연습 모드 한 판(10문제), 즉시 해설, 결과 화면과 점수, 자체 점검 12개.
**아직 만들지 않는 것**: 모드 선택 화면, 스피드·힌트 모드, 재풀이, 순위표.

## Task 1: `questions.js` 뼈대와 한국사 10문항

**Files:** Create: `questions.js`

**Interfaces:**
- Produces: 전역 상수 `QUIZ_DATA`. 키는 `korean-history`, `world-geography`, `science`, `arts-culture`. 각 값은 `{ name: string, questions: Question[] }`. `Question`은 `{ id, question, choices[4], answerIndex, explanation, source, sourceUrl? }`.

- [ ] **Step 1: 한국사 주제 10개를 고르고 출처 페이지를 연다**

국사편찬위원회 우리역사넷, 한국학중앙연구원 한국민족문화대백과사전, 국립중앙박물관, 문화재청 같은 기관의 원문을 쓴다. 위키백과·나무위키·블로그는 쓰지 않는다. 주제가 서로 다른 시대와 분야에 걸치게 고른다.

- [ ] **Step 2: `questions.js`를 만들고 `QUIZ_DATA`를 선언한다**

카테고리 4개의 키와 `name`을 모두 선언한다. `korean-history.questions`에만 문항 10개를 넣고 나머지 세 카테고리의 `questions`는 빈 배열로 둔다. `id`는 `kh-01`~`kh-10`.

- [ ] **Step 3: 문항 10개가 PRD 7.3의 검수 6개를 지키는지 하나씩 본다**

정답 하나 / 출처 있음 / 최상급 표현이면 기준과 시점 명시 / 해설 60자 안팎 한 줄 / 보기 4개 서로 다름 / `id` 중복 없음. 어긋나면 그 문항을 고친다.

- [ ] **Step 4: 검수표를 만든다** — 위 양식대로 10줄

- [ ] **Step 5: 문법 오류가 없는지 확인한다**

Run: `node -e "eval(require('fs').readFileSync('questions.js','utf8')); console.log(QUIZ_DATA['korean-history'].questions.length)"`
Expected: `10`

- [ ] **Step 6: 커밋**

```bash
git add questions.js
git commit -m "feat: questions.js 뼈대와 한국사 10문항"
```

## Task 2: 세계지리 10문항

**Files:** Modify: `questions.js`

- [ ] **Step 1: 세계지리 주제 10개를 고르고 출처 페이지를 연다**

외교부 국가·지역 정보, 국토지리정보원, 유엔·세계은행의 공개 통계 같은 원문을 쓴다. 면적·인구·높이처럼 시점에 따라 값이 달라지는 주제가 많으므로, 최상급 표현을 쓰면 문제 문장에 기준과 시점을 반드시 넣는다.

- [ ] **Step 2: `world-geography.questions`에 문항 10개를 작성한다** — `id`는 `wg-01`~`wg-10`
- [ ] **Step 3: 검수 6개를 적용한다**
- [ ] **Step 4: 검수표를 만든다**
- [ ] **Step 5: 확인** — `node -e "...; console.log(QUIZ_DATA['world-geography'].questions.length)"` → `10`
- [ ] **Step 6: 커밋** — `git commit -m "feat: 세계지리 10문항"`

## Task 3: 과학 10문항

**Files:** Modify: `questions.js`

- [ ] **Step 1: 과학 주제 10개를 고르고 출처 페이지를 연다**

한국과학창의재단, 한국천문연구원, 기상청, 국립과천과학관, 교육과정 자료 같은 원문을 쓴다. 물리·화학·생물·지구과학에 고루 걸치게 고른다.

- [ ] **Step 2: `science.questions`에 문항 10개를 작성한다** — `id`는 `sc-01`~`sc-10`
- [ ] **Step 3: 검수 6개를 적용한다**
- [ ] **Step 4: 검수표를 만든다**
- [ ] **Step 5: 확인** — 길이가 `10`
- [ ] **Step 6: 커밋** — `git commit -m "feat: 과학 10문항"`

## Task 4: 예술과 문화 10문항

**Files:** Modify: `questions.js`

- [ ] **Step 1: 예술과 문화 주제 10개를 고르고 출처 페이지를 연다**

국립중앙박물관, 국립현대미술관, 한국민족문화대백과사전, 유네스코 한국위원회 같은 원문을 쓴다. 작가가 누구인지 학계에 이견이 있는 주제는 피한다.

- [ ] **Step 2: `arts-culture.questions`에 문항 10개를 작성한다** — `id`는 `ac-01`~`ac-10`
- [ ] **Step 3: 검수 6개를 40문항 전체에 적용한다** — `id` 40개가 모두 다른지 이때 함께 본다
- [ ] **Step 4: 검수표 4개를 합쳐 40줄짜리 표를 만든다**
- [ ] **Step 5: 확인**

Run: `node -e "eval(require('fs').readFileSync('questions.js','utf8')); var t=0; for (var k in QUIZ_DATA) t+=QUIZ_DATA[k].questions.length; console.log(t)"`
Expected: `40`

- [ ] **Step 6: 커밋** — `git commit -m "feat: 예술과 문화 10문항"`

## Task 5: 화면 뼈대와 전환, 시작 화면

**Files:** Create: `index.html`, `style.css`, `script.js`

**Interfaces:**
- Consumes: `QUIZ_DATA` (Task 1~4)
- Produces:
  - `showScreen(name)` — `"start" | "quiz" | "result" | "board"`. 그 화면만 보이게 한다.
  - `renderStart()` — 시작 화면을 그린다.
  - `validateCategory(categoryId)` — `{ ok: boolean, reason: string }`을 돌려준다.

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — `index.html`이 없으므로 열 수 없다

- [ ] **Step 2: `index.html`을 만든다**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>상식 퀴즈</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main id="app">
    <section id="screen-start"  class="screen"></section>
    <section id="screen-quiz"   class="screen hidden"></section>
    <section id="screen-result" class="screen hidden"></section>
    <section id="screen-board"  class="screen hidden"></section>
  </main>
  <script src="questions.js"></script>
  <script src="script.js"></script>
</body>
</html>
```

`type="module"`을 쓰지 않는다. `questions.js`가 `script.js`보다 먼저 와야 한다.

- [ ] **Step 3: `style.css`를 만든다**

`.screen.hidden { display: none; }`로 화면을 전환한다. `#app`에 `max-width: 640px; margin: 0 auto; padding: 16px;`을 주고, 보기 버튼은 `width: 100%`에 `box-sizing: border-box`로 둔다. 긴 문장이 넘치지 않게 `word-break: keep-all`을 쓴다. 폭 360px에서 가로 스크롤이 생기지 않아야 한다. 정답·오답 색은 클래스로 분리한다(`.choice.correct`, `.choice.wrong`).

- [ ] **Step 4: `script.js`를 만들고 뼈대를 구현한다**

파일 전체를 `(function () { 'use strict'; ... })();`로 감싼다. 안에 `showScreen`, `renderStart`, `validateCategory`를 둔다.

`validateCategory(categoryId)`가 보는 것: 카테고리가 존재하는가, `questions` 길이가 10인가, 각 문항의 `choices` 길이가 4인가, `answerIndex`가 0 이상 3 이하 정수인가. 어긋나면 `{ ok: false, reason: "문항이 8개입니다" }`처럼 이유를 함께 돌려준다.

`renderStart()`가 그리는 것: 카테고리 버튼 4개와 `연습 모드 · 순위표에 기록되지 않음`. 단계 1에서는 모드가 연습으로 고정이므로 이 문구가 항상 보인다. `validateCategory`가 `ok: false`인 카테고리는 버튼을 `disabled`로 두고 옆에 `reason`을 쓴다. `QUIZ_DATA` 자체가 없으면 `문항 데이터를 읽을 수 없습니다`를 띄우고 버튼 4개를 모두 잠근다.

`DOMContentLoaded`에서 `renderStart()`와 `showScreen('start')`를 부른다.

- [ ] **Step 5: 확인**

`index.html`을 파일로 연다. 기대: 시작 화면에 카테고리 버튼 4개와 `연습 모드 · 순위표에 기록되지 않음`이 보이고 콘솔 오류가 0개다(PRD 6.1 기준 1·8).

- [ ] **Step 6: 커밋** — `git commit -m "feat: 화면 뼈대와 시작 화면"`

## Task 6: 판 시작, 섞기, 퀴즈 화면

**Files:** Modify: `script.js`, `style.css`

**Interfaces:**
- Consumes: `showScreen`, `validateCategory` (Task 5)
- Produces:
  - `shuffle(array)` — 원본을 바꾸지 않고 섞인 새 배열을 돌려준다(피셔-예이츠).
  - `buildRound(categoryId, ids)` — `ids`가 없으면 그 카테고리 전체, 있으면 그 `id`들만 모아 문항 순서와 각 문항의 보기 순서를 섞고 **섞인 보기에 맞는 `answerIndex`를 다시 계산한** 문항 배열을 돌려준다. `QUIZ_DATA`는 고치지 않는다.
  - `startGame(mode, categoryId)` — `state`를 초기화하고 퀴즈 화면으로 전환한다.
  - `renderQuiz()` — 진행 표시·점수·문제·보기 4개를 그린다.

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — 카테고리 버튼을 눌러도 아무 일이 없다

- [ ] **Step 2: `state` 객체를 정의한다**

```js
var state = {
  mode: 'practice',      // 'practice' | 'speed' | 'hint'
  categoryId: null,
  questions: [],         // 섞인 문항. 재풀이에서는 틀린 개수만큼
  index: 0,
  score: 0,              // 이번 회차 점수
  firstRoundScore: null, // 처음 10문제 점수. 결과 화면에 쓰는 값
  wrongIds: [],
  hintUsed: false,
  removed: [],
  answered: false,
  secondsLeft: 15,
  timerId: null,
  isRetry: false
};
```

- [ ] **Step 3: `shuffle`과 `buildRound`를 구현한다**

`buildRound`의 `answerIndex` 재계산은 섞기 전 정답 보기의 **값**을 들고 있다가, 섞은 배열에서 그 값의 위치를 `indexOf`로 찾는 방식으로 한다. 원본 문항 객체를 수정하지 말고 새 객체를 만들어 돌려준다.

- [ ] **Step 4: `startGame`과 `renderQuiz`를 구현한다**

퀴즈 화면 위쪽에 `한국사 · 연습`, `1 / 10`, `점수 0`을 그린다. 점수는 `formatScore`가 없는 단계이므로 숫자 그대로 쓰고 Task 8에서 바꾼다. 보기 버튼 4개에 클릭 처리를 붙이되 동작은 Task 7에서 넣는다.

- [ ] **Step 5: 확인**

- 카테고리를 고른다. 기대: 퀴즈 화면으로 바뀌고 `1 / 10`과 문제와 보기 4개가 보인다.
- 같은 카테고리를 두 번 시작한다. 기대: 문항 순서와 보기 순서가 두 판에서 다르다.
- **Review Focus 1**: 콘솔에서 10문항 각각의 `choices[answerIndex]`를 출력해 `questions.js`에 적힌 그 문항의 정답 문자열과 같은지 확인한다.

- [ ] **Step 6: 커밋** — `git commit -m "feat: 판 시작과 문항·보기 섞기"`

## Task 7: 보기 선택과 즉시 해설

**Files:** Modify: `script.js`, `style.css`

**Interfaces:**
- Consumes: `state`, `renderQuiz` (Task 6)
- Produces:
  - `scoreFor(mode, isCorrect, hintUsed)` — `1 | 0.5 | 0`.
  - `selectChoice(i)` — 이미 답했으면 아무 일도 하지 않는다.
  - `renderFeedback()` — 정답 여부, 한 줄 해설, 출처를 그린다.

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — 보기를 눌러도 반응이 없다

- [ ] **Step 2: `scoreFor`를 구현한다**

틀리면 0. 맞히고 힌트를 썼으면 0.5. 맞히고 힌트를 쓰지 않았으면 1. 모드는 힌트 모드가 아닐 때 `hintUsed`가 항상 거짓이므로 같은 식으로 처리된다.

- [ ] **Step 3: `selectChoice`와 `renderFeedback`을 구현한다**

`selectChoice(i)`: `state.answered`가 참이면 즉시 반환한다. 아니면 `state.answered = true`로 두고, 정답 여부를 가려 `state.score`에 `scoreFor(...)`를 더하고, 틀렸으면 `state.wrongIds`에 그 문항 `id`를 넣고, `renderFeedback()`을 부른다.

`renderFeedback()`: 고른 보기와 정답 보기에 클래스를 붙인다. 색만 쓰지 않고 `O` / `X` 기호와 `정답` / `오답` 글자를 함께 쓴다. 한 줄 해설과 출처를 보기 아래에 띄운다. `sourceUrl`이 있으면 `<a target="_blank" rel="noopener">`로 만든다. 보기 버튼 4개를 모두 `disabled`로 바꾼다. `[다음]`을 띄우되 10번째 문항에서는 `[결과 보기]`로 쓴다.

- [ ] **Step 4: 확인**

- 정답을 고른다. 기대: 그 보기가 초록색이 되고 `O`와 `정답`, 해설 한 줄과 출처 링크가 나오고 점수가 1 늘어난다.
- 오답을 고른다. 기대: 고른 보기는 빨간색에 `X`와 `오답`, 정답 보기는 초록색으로 표시된다.
- 답한 뒤 다른 보기를 누른다. 기대: 아무 반응이 없고 점수가 변하지 않는다.
- 출처 링크를 누른다. 기대: 새 탭에서 열린다.

- [ ] **Step 5: 커밋** — `git commit -m "feat: 보기 선택과 즉시 해설"`

## Task 8: 결과 화면과 단계 1 자체 점검

**Files:** Modify: `script.js`, `style.css`

**Interfaces:**
- Consumes: `state`, `selectChoice` (Task 7)
- Produces:
  - `nextQuestion()` — 다음 문항 또는 결과 화면.
  - `formatScore(score)` — `8` 또는 `7.5` 형태의 문자열.
  - `renderResult()` — 점수와 틀린 문항 목록과 버튼들을 그린다.
  - `runSelfTest()` — `?test`일 때만 돈다.

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — `[다음]`을 눌러도 다음 문항으로 가지 않는다

- [ ] **Step 2: `nextQuestion`과 `formatScore`를 구현한다**

`nextQuestion()`: `state.index`를 1 늘리고, 마지막을 넘었으면 `state.firstRoundScore`를 정하고(처음 회차일 때만) 결과 화면으로 간다. 아니면 `state.answered`와 `state.hintUsed`와 `state.removed`를 초기화하고 `renderQuiz()`를 부른다.

`formatScore(score)`: 정수면 소수점 없이, 아니면 소수 한 자리로.

- [ ] **Step 3: `renderResult`를 구현한다**

점수를 `formatScore(firstRoundScore) + ' / 10'`으로 그린다. 틀린 문항을 문제·정답·해설·출처와 함께 목록으로 보여 주고, 다 맞혔으면 `틀린 문항이 없습니다`를 띄운다. `순위표에 기록되지 않음`을 표시한다. `[같은 모드 다시]`(같은 조합으로 `startGame`)와 `[처음으로]`(시작 화면)를 둔다. 재풀이 버튼은 Task 12에서 붙인다.

- [ ] **Step 4: `runSelfTest`에 점검 12개를 구현한다**

1. `shuffle`이 원본 배열을 바꾸지 않는다
2. `shuffle`의 결과 길이가 원본과 같다
3. `shuffle`의 결과가 원본의 원소를 모두 담는다
4. `buildRound('science')`가 문항 10개를 돌려준다
5. 섞은 뒤 `choices[answerIndex]`가 원래 정답 문자열과 같다 (10문항 모두)
6. `buildRound`가 `QUIZ_DATA`를 바꾸지 않는다
7. `scoreFor('practice', true, false)`가 1
8. `scoreFor('practice', false, false)`가 0
9. `formatScore(8)`이 `"8"`
10. `formatScore(7.5)`가 `"7.5"`
11. `validateCategory('science').ok`가 참
12. 40문항의 `id`가 모두 다르다

- [ ] **Step 5: 확인**

Run: 주소 끝에 `?test`를 붙여 열고 콘솔을 본다
Expected: `자체 점검 결과: 통과 12, 실패 0`

이어서 PRD 7.2의 절차를 실행한다.
- 절차 1-A: `questions.js`를 보며 10문제를 모두 맞힌다 → `10 / 10`, 목록이 비어 있다
- 절차 1-B: 모두 일부러 틀린다 → `0 / 10`, 틀린 문항 10개가 목록에 나온다
- 절차 1-C: 섞어 풀고 맞힌 개수를 손으로 센다 → 점수가 센 개수와 같다
- 모드 선택 화면과 재풀이 버튼이 없는지 확인한다

- [ ] **Step 6: 커밋** — `git commit -m "feat: 결과 화면과 자체 점검 12개 (1단계 완료)"`

---

## 단계 1을 마치면 멈춘다

사람에게 아래 13개를 알리고, 확인이 끝났다는 말을 들을 때까지 Task 9를 시작하지 않는다. 문항을 쓰면서 계획과 달라진 점(바꾼 주제 등)과 40문항 검수표도 함께 보고한다.

### 사람이 브라우저에서 직접 확인할 항목 (13개)

1. 탐색기에서 `index.html`을 더블클릭하면 브라우저에서 열린다.
2. 시작 화면에 카테고리 버튼 4개와 `연습 모드 · 순위표에 기록되지 않음`이 보인다.
3. `[한국사]`를 누르면 상단에 `한국사 · 연습`, `1 / 10`, `점수 0`이 보인다.
4. 정답을 고르면 그 보기가 초록색이 되고 해설 한 줄과 출처 링크가 나온다.
5. 오답을 고르면 고른 보기는 빨간색, 정답 보기는 초록색으로 표시된다.
6. 답을 고른 뒤 다른 보기를 눌러도 변화가 없다.
7. 출처 링크를 누르면 새 탭에서 출처가 열린다.
8. 10번째 문항에서 `[다음]`이 `[결과 보기]`로 바뀐다.
9. 결과 화면의 점수가 맞힌 개수와 같고, 문항별 정답·오답 목록이 보인다.
10. `[같은 모드 다시]`를 누르면 문항 순서와 보기 순서가 앞 판과 달라진다.
11. `[처음으로]`를 누르면 시작 화면으로 돌아간다.
12. 개발자 도구(F12)의 기기 툴바에서 폭을 360px로 두어도 가로 스크롤이 생기지 않는다.
13. 주소 끝에 `?test`를 붙여 열면 콘솔에 `자체 점검 결과: 통과 12, 실패 0`이 나온다.

문항 내용의 사실 확인은 이 13개와 별도로, 검수표를 보고 따로 한다.

---

# 구현 2단계 — 스피드 모드, 힌트 모드, 모드 선택 화면, 재풀이 (Task 9~13)

**만들 것**: 모드 선택 화면, 스피드 모드 타이머, 힌트 모드, 틀린 문제 다시 풀기, 자체 점검 15개.
**아직 만들지 않는 것**: 이름 입력칸, `[기록 저장]`, 순위표 화면, `localStorage`.

## Task 9: 모드 선택 화면

**Files:** Modify: `script.js`, `style.css`

**Interfaces:**
- Consumes: `renderStart`, `startGame` (Task 5·6)
- Produces: 시작 화면이 모드와 카테고리를 각각 고르게 하고 `[시작]`으로 `startGame(mode, categoryId)`를 부른다.

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — 시작 화면에 모드를 고를 곳이 없다
- [ ] **Step 2: `renderStart`에 모드 선택을 넣는다**

모드 3개(연습 / 스피드 / 힌트)를 라디오 버튼이나 토글 버튼으로 둔다. 고른 모드와 카테고리를 지역 변수에 보관하고 `[시작]`에서 `startGame`에 넘긴다. `순위표에 기록되지 않음`은 연습 모드를 골랐을 때만 보이게 바꾼다. 퀴즈 화면 위쪽의 `한국사 · 연습`도 고른 모드 이름을 따르게 한다.

- [ ] **Step 3: 확인** — 모드 3개 × 카테고리 4개 = 12가지 조합으로 시작할 수 있다. 연습일 때만 문구가 보인다
- [ ] **Step 4: 커밋** — `git commit -m "feat: 모드 선택 화면"`

## Task 10: 스피드 모드 타이머

**Files:** Modify: `script.js`, `style.css`

**Interfaces:**
- Consumes: `state`, `selectChoice`, `nextQuestion` (Task 7·8)
- Produces:
  - `startTimer()` — 15초부터 1초 간격으로 줄인다. **이미 도는 타이머가 있으면 먼저 `stopTimer()`를 부른다.**
  - `stopTimer()` — `clearInterval`하고 `state.timerId`를 `null`로 둔다.
  - `handleTimeout()` — 0점 처리하고 `시간 초과`와 정답을 띄운다.

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — 스피드 모드로 시작해도 남은 초가 보이지 않는다
- [ ] **Step 2: 세 함수를 구현한다**

`startTimer()`는 `state.secondsLeft = 15`로 두고 `setInterval`을 건다. 매 틱마다 1을 빼고 화면을 갱신하며, 0이 되면 `stopTimer()`와 `handleTimeout()`을 부른다.

`handleTimeout()`은 `state.answered = true`로 두고 점수를 더하지 않으며, 그 문항 `id`를 `state.wrongIds`에 넣고, `renderFeedback()`을 부르되 `시간 초과` 문구를 함께 띄운다.

`stopTimer()`를 부르는 자리는 셋이다. 답을 고를 때(`selectChoice` 처음), 시간이 다 됐을 때, 화면을 떠날 때(`showScreen`). 스피드 모드에서만 `renderQuiz` 끝에 `startTimer()`를 부른다.

- [ ] **Step 3: 확인**

- 절차 2-A: 아무것도 누르지 않고 기다린다 → 0초에 `시간 초과`와 정답이 뜨고 0점
- 절차 2-B: 해설이 뜬 상태로 20초 기다린다 → 숫자가 고정되어 있다
- 절차 2-C: `[다음]`을 누른다 → 15에서 다시 시작한다
- **Review Focus 2**: `[다음]`을 빠르게 다섯 번 연타한 뒤 숫자를 10초간 본다 → 1초에 1씩만 줄어든다
- **Review Focus 3**: 10번째 문항에서 시간을 넘긴다 → `[결과 보기]`가 나타나고 결과 화면으로 이어진다

- [ ] **Step 4: 커밋** — `git commit -m "feat: 스피드 모드 타이머"`

## Task 11: 힌트 모드

**Files:** Modify: `script.js`, `style.css`

**Interfaces:**
- Consumes: `state`, `scoreFor`, `selectChoice` (Task 7)
- Produces:
  - `pickHintRemovals(answerIndex)` — 0~3 중 `answerIndex`가 아닌 세 개에서 두 개를 무작위로 골라 돌려준다.
  - `useHint()` — 이미 답했거나 이미 썼으면 아무 일도 하지 않는다.

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — 힌트 모드로 시작해도 `[힌트]` 버튼이 없다
- [ ] **Step 2: 두 함수를 구현하고 힌트 모드에서만 버튼을 그린다**

`useHint()`는 `state.answered`나 `state.hintUsed`가 참이면 즉시 반환한다. 아니면 `state.removed = pickHintRemovals(현재 문항의 answerIndex)`로 두고, 그 위치의 보기 버튼을 감추고, `state.hintUsed = true`로 두고, `[힌트]`를 `disabled`로 바꾼다. `scoreFor`는 이미 `hintUsed`를 받으므로 고치지 않는다.

- [ ] **Step 3: 확인**

- 절차 2-D: 힌트를 누른다 → 보기 2개가 사라지고 정답이 남아 있다. 버튼이 다시 눌리지 않는다
- 10문항 모두에서 힌트를 눌러 정답이 한 번도 사라지지 않는 것을 본다
- 절차 2-E: 힌트를 쓴 정답 2개, 안 쓴 정답 2개를 만든다 → `3 / 10`
- **Review Focus 4**: 답을 고른 뒤 `[힌트]`를 누른다 → 보기가 더 사라지지 않고 점수가 변하지 않는다

- [ ] **Step 4: 커밋** — `git commit -m "feat: 힌트 모드"`

## Task 12: 틀린 문제 다시 풀기

**Files:** Modify: `script.js`

**Interfaces:**
- Consumes: `buildRound` (Task 6), `renderResult` (Task 8)
- Produces: `startRetry()` — `state.wrongIds`로 새 회차를 만든다. `state.firstRoundScore`는 그대로 두고 `state.isRetry = true`로 둔다.

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — 연습 결과 화면에 재풀이 버튼이 없다
- [ ] **Step 2: `startRetry`를 구현하고 `[틀린 문제 다시 풀기]`를 붙인다**

`startRetry()`는 `buildRound(state.categoryId, state.wrongIds)`로 문항을 만들고, `state.index = 0`, `state.score = 0`, `state.wrongIds = []`로 두되 `state.firstRoundScore`는 건드리지 않는다. 재풀이는 연습 모드이므로 타이머와 힌트가 돌지 않아야 한다.

버튼은 연습 모드이고 틀린 문항이 있을 때만 보인다. 결과 화면의 점수는 항상 `state.firstRoundScore`를 쓴다. 재풀이 회차에서 맞힌 개수는 `재풀이: 3문항 중 2개 맞힘`처럼 점수와 구분되게 따로 표시한다.

- [ ] **Step 3: 확인**

- 절차 2-F: 3문제를 틀리고 재풀이해 그중 1개를 또 틀린다 → 재풀이 문항이 3개, 버튼이 다시 나타나고, 점수는 `7 / 10`에서 변하지 않는다
- 절차 2-G: 재풀이를 반복해 다 맞힌다 → 버튼이 사라지고 점수는 여전히 `7 / 10`

- [ ] **Step 4: 커밋** — `git commit -m "feat: 틀린 문제 다시 풀기"`

## Task 13: 단계 2 자체 점검 확장

**Files:** Modify: `script.js`

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — `?test`가 아직 12개만 찍는다
- [ ] **Step 2: 점검 3개를 더해 15개로 만든다**

13. `scoreFor('hint', true, true)`가 0.5
14. `scoreFor('hint', true, false)`가 1
15. `pickHintRemovals(i)`가 길이 2이고 `i`를 포함하지 않는다 — `i`를 0~3으로 바꿔 가며 100회 반복

- [ ] **Step 3: 확인**

Run: `?test`로 열고 콘솔을 본다
Expected: `자체 점검 결과: 통과 15, 실패 0`

이어서 단계 1의 절차 1-A~1-C를 다시 실행해 통과를 확인한다(PRD 6.2 완료 기준 11).

- [ ] **Step 4: 커밋** — `git commit -m "feat: 자체 점검 15개 (2단계 완료)"`

---

## 단계 2를 마치면 멈춘다

### 사람이 브라우저에서 직접 확인할 항목 (17개)

1. 시작 화면에서 모드 3개와 카테고리 4개를 고를 수 있다.
2. 연습을 고르면 `순위표에 기록되지 않음`이 보이고, 스피드·힌트를 고르면 사라진다.
3. 스피드로 시작하면 상단에 남은 초가 보인다.
4. 남은 초가 1초에 1씩 줄어든다.
5. 아무것도 누르지 않으면 0초에서 `시간 초과`와 정답이 표시된다.
6. 시간 초과 문항의 점수가 오르지 않는다.
7. 해설이 떠 있는 동안 숫자가 멈춰 있다(20초 기다려 확인).
8. `[다음]`을 누르면 15에서 다시 시작한다.
9. `[다음]`을 빠르게 연타해도 1초에 1씩만 줄어든다.
10. 10번째 문항에서 시간을 넘기면 `[결과 보기]`가 나오고 결과 화면으로 간다.
11. 힌트로 시작하면 `[힌트]` 버튼이 보이고, 연습·스피드에서는 보이지 않는다.
12. `[힌트]`를 누르면 보기 2개가 사라지고 정답은 남는다.
13. 그 문항에서 `[힌트]`가 다시 눌리지 않는다.
14. 힌트를 쓴 정답 2개와 안 쓴 정답 2개를 만들면 점수가 `3 / 10`이다.
15. 연습에서 3문제를 틀리면 결과 화면에 `[틀린 문제 다시 풀기]`가 보이고, 누르면 그 3문제만 나온다.
16. 재풀이에서 또 틀리면 버튼이 다시 나오고, 다 맞힐 때까지 반복해도 점수는 `7 / 10`에서 변하지 않는다.
17. `?test`에서 `자체 점검 결과: 통과 15, 실패 0`이 나온다.

---

# 구현 3단계 — 점수 저장과 순위표 (Task 14~15)

**만들 것**: `localStorage` 읽기·쓰기, 결과 화면의 이름 입력과 `[기록 저장]`, 순위표 화면, 자체 점검 20개.

## Task 14: 저장소와 이름 입력, 기록 저장

**Files:** Modify: `script.js`, `style.css`

**Interfaces:**
- Produces:
  - `loadBoard()` — 저장된 객체를 돌려준다. 읽기 실패, 깨진 JSON, 배열이 아닌 값은 모두 `{}`로 취급한다.
  - `saveRecord(categoryId, mode, name, score)` — 조합 키에 기록을 넣고 정렬해 상위 5건만 남긴다. 성공하면 `true`, 저장할 수 없으면 `false`.
  - `sortRecords(records)` — 점수 내림차순, 동점은 먼저 저장된 것이 위.
  - `isStorageAvailable()` — 쓰기를 한 번 시도해 `boolean`을 돌려준다.
  - `normalizeName(raw)` — 앞뒤 공백을 지우고 1~12자로 자르며, 비면 `익명`.

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — 스피드 결과 화면에 이름 입력칸이 없다
- [ ] **Step 2: 다섯 함수를 구현한다**

읽기와 쓰기를 모두 `try` / `catch`로 감싼다. 키는 `quizA.leaderboard.v1`, 조합 키는 `categoryId + '|' + mode`, 날짜는 `YYYY-MM-DD`.

`sortRecords`는 안정 정렬이어야 한다. 동점일 때 먼저 들어온 것이 위에 오도록, 정렬 전에 원래 순서를 함께 들고 비교한다.

**저장값만 깨져 있을 때는 안내 문구를 띄우지 않는다.** 빈 순위표로 시작하고 다음 저장 때 덮어쓴다. 저장이 실제로 되는데 "저장할 수 없습니다"를 띄우면 맞지 않기 때문이다. 저장소 자체를 못 쓸 때만 PRD 4.4의 문구를 띄운다.

- [ ] **Step 3: 결과 화면에 이름 입력과 `[기록 저장]`을 붙인다**

스피드·힌트 모드에서만 둔다. 저장하면 `[기록 저장]`을 `disabled`로 바꾸고 `[순위표 보기]`를 띄운다. `isStorageAvailable()`이 거짓이면 처음부터 `disabled`로 두고 안내를 쓴다. 연습 결과 화면에는 입력칸을 두지 않는다.

- [ ] **Step 4: 확인**

- 절차 3-A: 스피드 한 판 뒤 이름을 넣고 저장 → 이름·점수·날짜가 저장된다
- 절차 3-B: 이름을 비우고, 그리고 공백만 넣고 저장 → `익명`
- 절차 3-C: `[기록 저장]`을 다시 누른다 → 눌리지 않고 기록이 하나만 있다
- 절차 3-G: 연습 한 판을 끝낸다 → 순위표 개수가 변하지 않는다
- **Review Focus 5**: 저장값을 `{{{`, `"문자열"`, `null`, `[]`로 각각 바꾸고 `loadBoard()`를 부른다 → 네 경우 모두 `{}`를 돌려주고 오류를 던지지 않는다

- [ ] **Step 5: 커밋** — `git commit -m "feat: 순위표 저장소와 기록 저장"`

## Task 15: 순위표 화면과 단계 3 자체 점검

**Files:** Modify: `script.js`, `style.css`

**Interfaces:**
- Consumes: `loadBoard`, `sortRecords`, `isStorageAvailable` (Task 14)
- Produces: `renderLeaderboard()` — 조합별 표 8개를 그린다.

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — `[순위표]`를 눌러도 빈 화면이다
- [ ] **Step 2: `renderLeaderboard`를 구현한다**

카테고리 4개 × 스피드·힌트 2개 = 표 8개. 각 표에 상위 5건을 이름·점수·날짜로 그린다. 기록이 없는 표에는 `기록이 없습니다`. `isStorageAvailable()`이 거짓이면 표 대신 `이 브라우저에서는 기록을 저장할 수 없습니다`. `[처음으로]`를 둔다. 시작 화면과 결과 화면에서 이 화면으로 올 수 있게 한다.

- [ ] **Step 3: 점검 5개를 더해 20개로 만든다**

16. `sortRecords`가 점수 내림차순으로 정렬한다
17. 동점일 때 먼저 넣은 기록이 위에 온다
18. `saveRecord`를 6번 불러도 그 조합에 5건만 남는다
19. `normalizeName('')`이 `'익명'`
20. `normalizeName('  긴이름긴이름긴이름긴이름  ')`의 길이가 12

- [ ] **Step 4: 확인**

Run: `?test`로 열고 콘솔을 본다
Expected: `자체 점검 결과: 통과 20, 실패 0`

이어서 PRD 7.2의 절차 3-D~3-I를 실행하고, Chrome과 Firefox에서 각각 `file://`로 열어 `localStorage`를 쓸 수 있는지 확인한다. 단계 1·2의 절차도 다시 실행한다.

- [ ] **Step 5: 커밋** — `git commit -m "feat: 순위표 화면과 자체 점검 20개 (3단계 완료)"`

---

## 단계 3을 마치면 멈춘다

### 사람이 브라우저에서 직접 확인할 항목 (11개)

1. 스피드 결과 화면에 이름 입력칸과 `[기록 저장]`이 보인다.
2. 연습 결과 화면에는 입력칸이 없다.
3. 이름을 넣고 저장하면 순위표에 이름·점수·날짜가 보인다.
4. 이름을 비우거나 공백만 넣고 저장하면 `익명`으로 들어간다.
5. `[기록 저장]`을 다시 눌러도 기록이 하나만 있다.
6. 순위표 화면에 표 8개가 있고 연습 모드 표는 없다.
7. 기록이 없는 표에 `기록이 없습니다`가 보인다.
8. 같은 조합에 6건을 저장하면 상위 5건만 남는다.
9. 브라우저를 완전히 닫았다 다시 열어도 기록이 남아 있다.
10. 사생활 보호 창에서 열면 안내가 뜨고 퀴즈는 정상 동작한다.
11. `?test`에서 `자체 점검 결과: 통과 20, 실패 0`이 나온다.

---

# PRD 대응표

PRD의 항목마다 그것을 구현하는 태스크를 적었다. 누락된 요구가 없는지 확인할 때 쓴다.

| PRD 항목 | 구현하는 태스크 |
| --- | --- |
| 2.1 앱 구성(파일 4개, 서버 없음, `file://`) | Task 5 |
| 2.2 카테고리 4개와 문항 40개 | Task 1~4 |
| 2.3 한 판 10문제와 점수 | Task 6, 8 |
| 2.4 연습 모드 | Task 5~8 |
| 2.4 스피드 모드와 15초 타이머 | Task 10 |
| 2.4 힌트 모드와 0.5점 | Task 11 |
| 2.5 문항 규칙 5개 | Task 1~4 |
| 3.1 시작 화면 | Task 5(카테고리), Task 9(모드) |
| 3.2 퀴즈 화면과 즉시 해설 | Task 6, 7 |
| 3.3 결과 화면 | Task 8(점수·목록), Task 14(이름·저장) |
| 3.4 순위표 화면 | Task 15 |
| 3.5 한 판의 흐름 | Task 8 |
| 3.6 섞기 | Task 6 |
| 3.7 재풀이 반복 | Task 12 |
| 4.1 `questions.js` 형식 | Task 1 |
| 4.2 필드와 `answerIndex` 재계산 | Task 1, 6 |
| 4.3 순위표 저장 형식 | Task 14 |
| 4.4 데이터 오류 처리 | Task 5(문항), Task 14(저장소) |
| 5.1 전역 1개 원칙 | Task 5 |
| 5.2 네 층 분리 | Task 5~15 전체 |
| 5.3 상태 객체 | Task 6 |
| 5.4 주요 함수 | Task 5~15 전체 |
| 6.1 단계 1 완료 기준 9개 | Task 8 끝 |
| 6.2 단계 2 완료 기준 11개 | Task 13 끝 |
| 6.3 단계 3 완료 기준 10개 | Task 15 끝 |
| 7.2 브라우저 절차 19개 | 각 태스크의 확인 단계 |
| 7.3 문항 40개 검수 | Task 4 |
| 7.4 자체 점검 `?test` | Task 8(12개), Task 13(15개), Task 15(20개) |
| 7.5 완료 선언 규칙 | 각 단계 끝 |
| 8 범위 밖 | 구현하지 않음 |
