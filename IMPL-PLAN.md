# 상식 퀴즈 웹 앱 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**실행자는 이 계획과 `PRD.md`를 함께 읽습니다.** 이 계획은 PRD가 정한 것을 작업 순서로 옮긴 것이고, 다툼이 있으면 PRD가 우선합니다.

**Goal:** 서버 없이 브라우저에서 파일로 열어 동작하는 4지선다 상식 퀴즈 웹 앱을 만든다. 답을 고르면 그 자리에서 정답 여부와 한 줄 해설을 보여 준다.

**Architecture:** 코드 파일 4개로 된 정적 앱이다. `questions.js`가 전역 상수 `QUIZ_DATA` 하나를 선언하고, `script.js`가 즉시 실행 함수 안에서 데이터·규칙·상태·화면 네 층으로 나뉘어 그 데이터를 읽는다. 화면 4개는 `index.html` 안에 모두 들어 있고 한 번에 하나만 보인다.

**Tech Stack:** HTML, CSS, 순수 자바스크립트. 모듈·빌드 도구·프레임워크·외부 라이브러리·네트워크 요청 없음.

**Spec:** `PRD.md`

## 실행 규칙

- **단계가 끝나면 멈춘다.** 사람이 브라우저에서 확인 항목을 점검하고 다음으로 가라고 할 때까지 다음 단계의 태스크를 시작하지 않는다. 단계 끝에서 그 단계의 확인 항목을 사람에게 알린다.
- 태스크마다 확인 절차를 먼저 실행해 실패를 보고, 구현하고, 다시 실행해 통과를 보고, **점검을 통과하면 커밋한다.**
- 계획과 다르게 정해야 할 일이 생기면 혼자 정하지 말고 단계 완료 보고에 그 결정과 이유를 적는다.

## Global Constraints

- 코드 파일은 `index.html`, `style.css`, `script.js`, `questions.js` 4개뿐이다. 테스트 파일을 만들지 않는다.
- `file://`로 열어 동작해야 한다. `import` / `export`를 쓰지 않는다. `fetch`를 쓰지 않는다.
- `questions.js`는 전역 상수 `QUIZ_DATA` 하나만 선언한다.
- `script.js` 전체를 즉시 실행 함수로 감싼다. 전역에 더하는 이름은 없다. 읽는 전역은 `QUIZ_DATA` 하나다.
- `document`를 만지는 함수와 만지지 않는 함수를 섞지 않는다(PRD 5.2의 네 층).
- 점수는 1 / 0.5 / 0 중 하나이고 한 판 만점은 10이다. 표시는 `formatScore`를 거친다.
- 스피드 모드 제한 시간은 15초로 고정한다.
- 순위표는 `localStorage` 키 `quizA.leaderboard.v1` 하나를 쓰고, 조합(`카테고리id|모드`)마다 상위 5건을 남기며, 동점은 먼저 저장된 기록이 위에 온다. 날짜는 `YYYY-MM-DD`다.
- 이름은 앞뒤 공백을 지운 뒤 1~12자로 자르고, 비어 있으면 `익명`으로 저장한다.
- 문항 규칙 5개(PRD 2.5)를 모든 문항이 지킨다.
- 검증은 세 가지다. ① 태스크마다 도는 자체 점검(`?test`), ② 단계마다 사람이 브라우저에서 보는 확인 항목, ③ PRD 7.2의 절차.

## 문항 작성 규칙 (PRD에 없는 추가 결정)

PRD 2.5의 규칙 5개에 더해, 문항을 쓸 때 다음을 지킨다. 요구와 어긋나지 않는 범위에서 문항의 품질을 지키기 위한 것이다.

1. **출처 제한**: 위키백과, 나무위키, 개인 블로그는 출처로 쓰지 않는다. 정부·공공기관, 학술 기관, 사전·백과 기관, 언론사의 원문 페이지를 쓴다.
2. **열어서 확인**: 문항마다 출처 페이지를 실제로 열어 정답과 해설이 그 페이지에 있는지 대조한다. 열 수 없는 주제는 열 수 있는 주제로 바꾼다.
3. **부정형 금지**: "~이 아닌 것은?", "~에 해당하지 않는 것은?" 같은 부정형 문제를 내지 않는다. 정답이 하나임을 보이기 어렵다.
4. **이견 있는 주제 금지**: 학계에 이견이 있는 주제는 피하고 다른 것을 묻는다.
5. **검수표**: 카테고리 10문항을 쓸 때마다 문항별로 정답과 출처에서 확인한 내용을 적은 표를 보고에 붙인다.

## 자체 점검 (`?test`)

`script.js` 안에 점검 코드를 둔다(PRD 7.4). 주소 끝에 `?test`를 붙여 열었을 때만 돈다. 통과는 `console.log`, 실패는 `console.error`, 마지막에 `자체 점검 결과: 통과 N, 실패 M`.

브라우저 없이 확인할 때는 터미널에서 다음 한 줄로 같은 점검을 돌린다.

```bash
node -e "global.window={location:{search:'?test'}};global.document={addEventListener(){},getElementById:()=>null,querySelectorAll:()=>[]};require('./questions.js');require('./script.js')"
```

점검 항목 수: 단계 1에서 12개, 단계 2에서 15개, 단계 3에서 20개.

## Review Focus

PRD가 함의하지만 어느 확인 항목도 직접 건드리지 않는 입력과 실패 모드 다섯 개다. 각 줄의 확인은 괄호 안 태스크에 넣었다.

1. 보기를 섞은 뒤 `answerIndex`를 다시 계산하지 못해 정답 표시가 엉뚱한 보기에 붙는 경우. (Task 6)
2. `[다음]`을 빠르게 연타해 타이머가 겹쳐 돌아 1초에 2 이상 줄어드는 경우. (Task 10)
3. 10번째 문항에서 시간이 초과되는 경우. `[결과 보기]`가 나타나고 결과 화면으로 이어져야 한다. (Task 10)
4. 답을 고른 뒤 `[힌트]`를 누르는 경우. 보기가 더 사라지거나 점수가 바뀌어서는 안 된다. (Task 11)
5. `localStorage`에 배열이 아닌 값(객체·문자열·`null`)이 들어 있는 경우. (Task 14)

---

# 구현 1단계 — 연습 모드와 점수 (Task 1~8)

범위: 카테고리 선택, 연습 모드 한 판, 즉시 해설, 점수. 모드 선택 화면과 재풀이는 아직 넣지 않는다.

### Task 1: `questions.js` 뼈대와 한국사 10문항

**Files:** Create: `questions.js`

**Interfaces:**
- Produces: 전역 상수 `QUIZ_DATA`. 키는 `korean-history`, `world-geography`, `science`, `arts-culture`. 각 값은 `{ name, questions[] }`이고 문항은 `{ id, question, choices[4], answerIndex, explanation, source, sourceUrl? }`(PRD 4.1·4.2).

- [ ] **Step 1: 한국사 문항 10개의 사실과 출처를 웹에서 확인** — 위 문항 작성 규칙 1·2를 지킨다
- [ ] **Step 2: `QUIZ_DATA`를 선언하고 `korean-history`에 문항 10개를 작성** — 카테고리 4개의 키와 `name`을 모두 선언하되 나머지 `questions`는 빈 배열. `id`는 `kh-01`~`kh-10`
- [ ] **Step 3: PRD 7.3의 검수 6개를 적용하고 검수표를 만든다**
- [ ] **Step 4: 커밋** — `git commit -m "feat: questions.js 뼈대와 한국사 10문항"`

### Task 2: 세계지리 10문항

**Files:** Modify: `questions.js`

- [ ] **Step 1: 세계지리 문항 10개의 사실과 출처를 웹에서 확인** — 면적·인구·높이처럼 시점에 따라 달라지는 값은 문제 문장에 기준과 시점을 넣는다
- [ ] **Step 2: `world-geography.questions`에 문항 10개 작성** — `id`는 `wg-01`~`wg-10`
- [ ] **Step 3: 검수 6개 적용과 검수표**
- [ ] **Step 4: 커밋** — `git commit -m "feat: 세계지리 10문항"`

### Task 3: 과학 10문항

**Files:** Modify: `questions.js`

- [ ] **Step 1: 과학 문항 10개의 사실과 출처를 웹에서 확인**
- [ ] **Step 2: `science.questions`에 문항 10개 작성** — `id`는 `sc-01`~`sc-10`
- [ ] **Step 3: 검수 6개 적용과 검수표**
- [ ] **Step 4: 커밋** — `git commit -m "feat: 과학 10문항"`

### Task 4: 예술과 문화 10문항

**Files:** Modify: `questions.js`

- [ ] **Step 1: 예술과 문화 문항 10개의 사실과 출처를 웹에서 확인**
- [ ] **Step 2: `arts-culture.questions`에 문항 10개 작성** — `id`는 `ac-01`~`ac-10`
- [ ] **Step 3: 검수 6개를 40문항 전체에 적용하고 검수표 4개를 합친다** — `id` 40개가 서로 다른지 이때 함께 본다
- [ ] **Step 4: 커밋** — `git commit -m "feat: 예술과 문화 10문항"`

### Task 5: 화면 뼈대와 전환, 시작 화면

**Files:** Create: `index.html`, `style.css`, `script.js`

**Interfaces:**
- Consumes: `QUIZ_DATA` (Task 1~4)
- Produces: `showScreen(name)` — `"start" | "quiz" | "result" | "board"` 중 하나만 보이게 한다. `renderStart()`. `validateCategory(categoryId)` — 문항 10개와 각 문항의 `choices` 길이 4, `answerIndex` 0~3을 확인해 `{ ok, reason }`을 돌려준다.

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — `index.html`이 없어 열리지 않는다
- [ ] **Step 2: `index.html`에 화면 4개의 빈 골격을 만든다** — `#screen-start`, `#screen-quiz`, `#screen-result`, `#screen-board`. `<script src="questions.js">`와 `<script src="script.js">`를 이 순서로. `type="module"`을 쓰지 않는다
- [ ] **Step 3: `style.css`에 화면 전환과 기본 배치를 넣는다** — 숨긴 화면은 `display: none`. 폭 360px에서 가로 스크롤이 생기지 않게 한다
- [ ] **Step 4: `script.js`에 즉시 실행 함수와 `showScreen`, `renderStart`, `validateCategory`를 구현한다** — 시작 화면에 카테고리 버튼 4개와 `연습 모드 · 순위표에 기록되지 않음`을 그린다. `validateCategory`가 `ok: false`면 그 버튼만 잠그고 `reason`을 표시한다. `QUIZ_DATA` 자체가 없으면 "문항 데이터를 읽을 수 없습니다"를 띄우고 버튼 4개를 모두 잠근다
- [ ] **Step 5: 확인** — `index.html`을 파일로 열어 시작 화면과 버튼 4개와 문구가 보이고 콘솔 오류가 0개다
- [ ] **Step 6: 커밋** — `git commit -m "feat: 화면 뼈대와 시작 화면"`

### Task 6: 판 시작, 섞기, 퀴즈 화면

**Files:** Modify: `script.js`, `index.html`, `style.css`

**Interfaces:**
- Consumes: `showScreen`, `validateCategory` (Task 5)
- Produces: `shuffle(array)` — 원본을 바꾸지 않고 섞인 새 배열(피셔-예이츠). `buildRound(categoryId, ids)` — `ids`가 없으면 전체, 있으면 그 `id`들만 모아 문항 순서와 보기 순서를 섞고 **섞인 보기에 맞는 `answerIndex`를 다시 계산한** 배열을 돌려준다. `QUIZ_DATA`는 고치지 않는다. `startGame(mode, categoryId)`. `renderQuiz()`.

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — 카테고리 버튼을 눌러도 아무 일이 없다
- [ ] **Step 2: `state` 객체와 네 함수를 구현한다** — `state`의 필드는 PRD 5.3을 따른다. 퀴즈 화면 위쪽에 `한국사 · 연습`, `1 / 10`, `점수 0`을 그린다
- [ ] **Step 3: 확인** — 카테고리를 고르면 퀴즈 화면으로 바뀐다. 같은 카테고리를 두 번 시작하면 순서가 다르다. **Review Focus 1**: 10문항 모두에서 `choices[answerIndex]`가 `questions.js`의 정답 문자열과 같은지 확인한다
- [ ] **Step 4: 커밋** — `git commit -m "feat: 판 시작과 문항·보기 섞기"`

### Task 7: 보기 선택과 즉시 해설

**Files:** Modify: `script.js`, `style.css`

**Interfaces:**
- Consumes: `state`, `renderQuiz` (Task 6)
- Produces: `scoreFor(mode, isCorrect, hintUsed)` — `1 | 0.5 | 0`. `selectChoice(i)` — 이미 답했으면 아무 일도 하지 않는다. `renderFeedback()`.

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — 보기를 눌러도 반응이 없다
- [ ] **Step 2: 세 함수를 구현한다** — 색만 쓰지 않고 `O`/`X` 기호와 "정답"/"오답" 글자를 함께 쓴다. `sourceUrl`이 있으면 새 탭으로 열리는 링크로 만든다. 답한 뒤 남은 보기를 잠그고 `[다음]`을 띄운다. 10번째 문항에서는 `[결과 보기]`로 쓴다
- [ ] **Step 3: 확인** — 정답·오답 표시, 답한 뒤 다른 보기를 눌러도 변화 없음
- [ ] **Step 4: 커밋** — `git commit -m "feat: 보기 선택과 즉시 해설"`

### Task 8: 결과 화면과 단계 1 자체 점검

**Files:** Modify: `script.js`, `index.html`, `style.css`

**Interfaces:**
- Consumes: `state`, `selectChoice` (Task 7)
- Produces: `nextQuestion()`. `formatScore(score)` — `8` 또는 `7.5`. `renderResult()`. `runSelfTest()` — `?test`일 때만 돈다.

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — `[다음]`을 눌러도 넘어가지 않는다
- [ ] **Step 2: `nextQuestion`, `formatScore`, `renderResult`를 구현한다** — 결과 화면에 점수(`N / 10`), 틀린 문항을 문제·정답·해설·출처와 함께, 다 맞혔으면 "틀린 문항이 없습니다", "순위표에 기록되지 않음", `[같은 모드 다시]`, `[처음으로]`
- [ ] **Step 3: `runSelfTest`에 점검 12개를 구현한다** — `shuffle`이 원본을 바꾸지 않음 / 길이 보존 / `buildRound`가 문항 10개를 돌려줌 / 섞은 뒤 `choices[answerIndex]`가 원래 정답과 같음(10문항 반복) / `scoreFor` 연습 정답 1 / 연습 오답 0 / `formatScore(8)`이 `"8"` / `formatScore(7.5)`가 `"7.5"` / `validateCategory`가 정상 카테고리에 `ok: true` / 문항 수가 10이 아니면 `ok: false` / `answerIndex`가 범위 밖이면 `ok: false` / 40문항의 `id`가 모두 다름
- [ ] **Step 4: 확인** — 주소 끝에 `?test`를 붙여 열고 콘솔에서 `자체 점검 결과: 통과 12, 실패 0`을 본다. PRD 7.2의 절차 1-A~1-E를 실행한다
- [ ] **Step 5: 커밋** — `git commit -m "feat: 결과 화면과 자체 점검 (1단계 완료)"`

## 단계 1을 마치면 멈춘다

사람에게 아래 13개를 알리고, 확인이 끝났다는 말을 들을 때까지 Task 9를 시작하지 않는다.

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

범위: 모드 선택 화면, 스피드 모드, 힌트 모드, 재풀이. 이름 입력칸과 순위표는 아직 넣지 않는다.

### Task 9: 모드 선택 화면

**Files:** Modify: `script.js`, `index.html`, `style.css`

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — 시작 화면에 모드를 고를 곳이 없다
- [ ] **Step 2: 모드 선택을 `renderStart`에 넣는다** — 모드 3개와 카테고리 4개를 고르고 `[시작]`으로 `startGame(mode, categoryId)`를 부른다. "순위표에 기록되지 않음"은 연습 모드를 골랐을 때만 보인다
- [ ] **Step 3: 확인** — 12가지 조합으로 시작할 수 있고, 연습일 때만 문구가 보인다
- [ ] **Step 4: 커밋** — `git commit -m "feat: 모드 선택 화면"`

### Task 10: 스피드 모드 타이머

**Files:** Modify: `script.js`, `index.html`, `style.css`

**Interfaces:**
- Produces: `startTimer()` — 15초부터 1초 간격. 이미 도는 타이머가 있으면 먼저 멈춘다. `stopTimer()`. `handleTimeout()` — 0점 처리하고 "시간 초과"와 정답을 띄운다.

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — 스피드 모드로 시작해도 남은 초가 없다
- [ ] **Step 2: 세 함수를 구현하고 스피드 모드에서만 남은 초를 그린다** — 답을 고르면, 시간이 다 되면, 화면을 떠나면 모두 `stopTimer`를 부른다
- [ ] **Step 3: 확인** — PRD 절차 2-A·2-B·2-C. **Review Focus 2**: `[다음]`을 다섯 번 연타한 뒤 1초에 1씩만 줄어드는지 10초간 본다. **Review Focus 3**: 10번째 문항에서 시간을 넘겨 `[결과 보기]`로 이어지는지 본다
- [ ] **Step 4: 커밋** — `git commit -m "feat: 스피드 모드 타이머"`

### Task 11: 힌트 모드

**Files:** Modify: `script.js`, `index.html`, `style.css`

**Interfaces:**
- Produces: `pickHintRemovals(answerIndex)` — `answerIndex`가 아닌 세 개에서 두 개를 골라 돌려준다. `useHint()` — 이미 답했거나 이미 썼으면 아무 일도 하지 않는다.

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — 힌트 모드로 시작해도 버튼이 없다
- [ ] **Step 2: 두 함수를 구현하고 힌트 모드에서만 `[힌트]`를 그린다** — `scoreFor`는 이미 `hintUsed`를 받으므로 고치지 않는다
- [ ] **Step 3: 확인** — PRD 절차 2-D·2-E. 10문항 모두에서 정답이 사라지지 않는다. **Review Focus 4**: 답한 뒤 `[힌트]`를 눌러도 변화가 없다
- [ ] **Step 4: 커밋** — `git commit -m "feat: 힌트 모드"`

### Task 12: 틀린 문제 다시 풀기

**Files:** Modify: `script.js`, `index.html`

**Interfaces:**
- Produces: `startRetry()` — `state.wrongIds`로 새 회차를 만든다. `state.firstRoundScore`는 그대로 두고 `state.isRetry`를 세운다.

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — 연습 결과 화면에 재풀이 버튼이 없다
- [ ] **Step 2: `startRetry`를 구현하고 `[틀린 문제 다시 풀기]`를 붙인다** — 틀린 문항이 있을 때만 보인다. 결과 화면의 점수는 항상 `firstRoundScore`를 쓴다. 재풀이 회차에서 맞힌 개수는 점수와 구분되게 따로 표시한다. 재풀이는 연습 모드이므로 타이머와 힌트가 없다
- [ ] **Step 3: 확인** — PRD 절차 2-F·2-G
- [ ] **Step 4: 커밋** — `git commit -m "feat: 틀린 문제 다시 풀기"`

### Task 13: 단계 2 자체 점검 확장

**Files:** Modify: `script.js`

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — `?test`가 아직 12개만 찍는다
- [ ] **Step 2: 점검 3개를 더해 15개로 만든다** — `scoreFor`가 힌트 쓴 정답에 0.5 / 힌트 모드에서 힌트 없이 맞히면 1 / `pickHintRemovals`가 2개를 돌려주고 `answerIndex`를 한 번도 포함하지 않음(100회 반복)
- [ ] **Step 3: 확인** — `?test`에서 `자체 점검 결과: 통과 15, 실패 0`. 단계 1의 절차 1-A~1-E를 다시 실행한다
- [ ] **Step 4: 커밋** — `git commit -m "feat: 자체 점검 15개 (2단계 완료)"`

## 단계 2를 마치면 멈춘다

### 사람이 브라우저에서 직접 확인할 항목 (17개)

1. 시작 화면에 모드 3개와 카테고리 4개를 고를 수 있다.
2. 연습을 고르면 "순위표에 기록되지 않음"이 보이고, 스피드·힌트를 고르면 사라진다.
3. 스피드로 시작하면 상단에 남은 초가 보인다.
4. 남은 초가 1초에 1씩 줄어든다.
5. 아무것도 누르지 않으면 0초에서 "시간 초과"와 정답이 표시된다.
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

범위: 결과 화면의 이름 입력과 `[기록 저장]`, 순위표 화면, `localStorage` 읽기·쓰기.

### Task 14: 저장소와 이름 입력, 기록 저장

**Files:** Modify: `script.js`, `index.html`, `style.css`

**Interfaces:**
- Produces: `loadBoard()` — 읽기 실패, 깨진 값, 배열이 아닌 값은 모두 `{}`로 취급. `saveRecord(categoryId, mode, name, score)` — 조합 키에 넣고 정렬해 상위 5건만 남긴다. `sortRecords(records)` — 점수 내림차순, 동점은 먼저 저장된 것이 위. `isStorageAvailable()`. `normalizeName(raw)` — 앞뒤 공백을 지우고 1~12자로 자르며 비면 `익명`.

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — 스피드 결과 화면에 이름 입력칸이 없다
- [ ] **Step 2: 다섯 함수를 구현한다** — 읽기와 쓰기를 모두 `try`/`catch`로 감싼다. 저장값이 깨져 있으면 안내 없이 빈 순위표로 시작하고 다음 저장 때 덮어쓴다(저장 자체는 되므로 "저장할 수 없음" 문구를 띄우지 않는다). 저장소를 아예 쓸 수 없을 때만 PRD 4.4의 문구를 띄운다
- [ ] **Step 3: 스피드·힌트 결과 화면에 입력칸과 `[기록 저장]`을 붙인다** — 저장하면 버튼을 잠그고 `[순위표 보기]`를 띄운다. `isStorageAvailable()`이 거짓이면 처음부터 잠근다. 연습 결과 화면에는 입력칸을 두지 않는다
- [ ] **Step 4: 확인** — PRD 절차 3-A·3-B·3-C·3-G. **Review Focus 5**: 저장값을 `{{{`, `"문자열"`, `null`, `[]`로 바꿔 `loadBoard()`가 네 경우 모두 `{}`를 돌려주는지 본다
- [ ] **Step 5: 커밋** — `git commit -m "feat: 순위표 저장소와 기록 저장"`

### Task 15: 순위표 화면과 단계 3 자체 점검

**Files:** Modify: `script.js`, `index.html`, `style.css`

**Interfaces:**
- Produces: `renderLeaderboard()` — 조합별 표 8개.

- [ ] **Step 1: 확인 절차를 먼저 실행해 실패를 본다** — `[순위표]`를 눌러도 빈 화면이다
- [ ] **Step 2: `renderLeaderboard`를 구현한다** — 카테고리 4개 × 스피드·힌트 2개 = 8개. 기록이 없는 표에는 "기록이 없습니다". `isStorageAvailable()`이 거짓이면 표 대신 안내. `[처음으로]`를 둔다
- [ ] **Step 3: 점검 5개를 더해 20개로 만든다** — `sortRecords`가 점수 내림차순 / 동점은 먼저 넣은 것이 위 / `saveRecord`가 상위 5건만 남김 / `normalizeName("")`이 `"익명"` / `normalizeName("  긴이름긴이름긴이름긴이름  ")`이 12자
- [ ] **Step 4: 확인** — PRD 절차 3-D~3-I. `?test`에서 `자체 점검 결과: 통과 20, 실패 0`. Chrome과 Firefox에서 각각 `file://`로 열어 `localStorage`를 쓸 수 있는지 확인한다. 단계 1·2의 절차를 다시 실행한다
- [ ] **Step 5: 커밋** — `git commit -m "feat: 순위표 화면 (3단계 완료)"`

## 단계 3을 마치면 멈춘다

### 사람이 브라우저에서 직접 확인할 항목 (11개)

1. 스피드 결과 화면에 이름 입력칸과 `[기록 저장]`이 보인다.
2. 연습 결과 화면에는 입력칸이 없다.
3. 이름을 넣고 저장하면 순위표에 이름·점수·날짜가 보인다.
4. 이름을 비우거나 공백만 넣고 저장하면 `익명`으로 들어간다.
5. `[기록 저장]`을 다시 눌러도 기록이 하나만 있다.
6. 순위표 화면에 표 8개가 있고 연습 모드 표는 없다.
7. 기록이 없는 표에 "기록이 없습니다"가 보인다.
8. 같은 조합에 6건을 저장하면 상위 5건만 남는다.
9. 브라우저를 완전히 닫았다 다시 열어도 기록이 남아 있다.
10. 사생활 보호 창에서 열면 안내가 뜨고 퀴즈는 정상 동작한다.
11. `?test`에서 `자체 점검 결과: 통과 20, 실패 0`이 나온다.

---

# PRD 대응표

| PRD 항목 | 구현하는 태스크 |
| --- | --- |
| 2.1 앱 구성(파일 4개, 서버 없음) | Task 5 |
| 2.2 카테고리 4개와 문항 40개 | Task 1~4 |
| 2.3 한 판 10문제 | Task 6, 8 |
| 2.4 연습 모드 | Task 5~8 |
| 2.4 스피드 모드 | Task 10 |
| 2.4 힌트 모드 | Task 11 |
| 2.5 문항 규칙 5개 | Task 1~4 |
| 3.1 시작 화면 | Task 5, 9 |
| 3.2 퀴즈 화면과 즉시 해설 | Task 6, 7 |
| 3.3 결과 화면 | Task 8, 14 |
| 3.4 순위표 화면 | Task 15 |
| 3.5 한 판의 흐름 | Task 8 |
| 3.6 섞기 | Task 6 |
| 3.7 재풀이 | Task 12 |
| 4.1 `questions.js` 형식 | Task 1 |
| 4.2 필드와 `answerIndex` 재계산 | Task 1, 6 |
| 4.3 순위표 저장 형식 | Task 14 |
| 4.4 데이터 오류 처리 | Task 5(문항), Task 14(저장소) |
| 5.1 전역 1개 원칙 | Task 5 |
| 5.2 네 층 | Task 5~15 전체 |
| 5.3 상태 객체 | Task 6 |
| 5.4 주요 함수 | Task 5~15 전체 |
| 6.1 단계 1 완료 기준 | Task 8 끝 |
| 6.2 단계 2 완료 기준 | Task 13 끝 |
| 6.3 단계 3 완료 기준 | Task 15 끝 |
| 7.2 브라우저 절차 19개 | 각 태스크의 확인 단계 |
| 7.3 문항 40개 검수 | Task 4 |
| 7.4 자체 점검 `?test` | Task 8, 13, 15 |
| 8 범위 밖 | 구현하지 않음 |
