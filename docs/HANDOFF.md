# 인수인계 문서 (2026-09-21 기준)

2주 뒤에 돌아와 이어서 작업하기 위한 기록입니다. 프로젝트 규칙은 [`CLAUDE.md`](../CLAUDE.md),
설계 근거는 [`design.md`](design.md)에 있고, 이 문서는 **지금 상태와 다음에 할 일**만 다룹니다.

## 1. 한눈에 보는 현재 상태

| 항목 | 상태 |
|---|---|
| 운영 주소 | https://gpxkit.com (Cloudflare Workers 정적 자산) |
| 리포 | https://github.com/InjunKang/gps-tools — 공개, MIT |
| 도구 | 7개: GPX→KML, KML→GPX, GPX→GeoJSON, GPX→CSV, KML→GeoJSON, GeoJSON→GPX, GeoJSON→KML |
| 언어 | 8개: en(기본), de, ja, es, ko, fr, it, pt — 총 65페이지 |
| 테스트 | 83개 통과 (`npm run verify` = 타입 검사 + 빌드 + 테스트) |
| 배포 | `main`에 push하면 GitHub Actions(CI)와 Cloudflare Workers Builds가 자동 실행 |
| Lighthouse | 모바일 기준 성능·접근성·Best Practices·SEO 모두 100 |
| 검색엔진 | 구글 서치 콘솔(도메인 속성)·Bing 등록 완료, 사이트맵 처리 완료 |
| 색인 | 2026-09-21 기준 구글에 10개 페이지 색인. 경쟁 검색어 순위는 아직 없음(정상) |

## 2. 돌아왔을 때 가장 먼저 할 일

1. **서치 콘솔 → 실적** 메뉴에서 검색어·노출·클릭 데이터를 내보내기(CSV)하거나 캡처한다.
2. 그 데이터를 가지고 다음을 정한다.
   - 노출은 되는데 클릭이 없는 검색어 → 해당 페이지의 제목·설명 다듬기
   - 어떤 변환을 찾는 검색어가 들어오는지 → 다음에 만들 도구
   - 어느 언어에서 유입이 생기는지 → 번역 검수 우선순위
3. `site:gpxkit.com`으로 색인된 페이지 수를 확인한다(목표 64개).
4. 서치 콘솔 **색인 → 페이지**에서 제외 사유를 본다. 아래는 정상이다.
   - "리디렉션이 포함된 페이지": `/gpx-to-kml`(슬래시 없음), `http://`, `www` 주소
   - "발견됨 – 현재 색인이 생성되지 않음": 대기 중

데이터가 쌓이기 전에는 사이트를 자주 바꾸지 않는 것이 좋다.

## 3. 아직 열려 있는 것

| 항목 | 내용 |
|---|---|
| 최신 아이폰/안드로이드에서 "공유…" 버튼 | 실기기 미확인. 브라우저 흉내 테스트로만 검증함 |
| 번역 검수 | ko만 운영자가 검수함. de/ja/es/fr/it/pt는 미검수(기계 작성) |
| AlternativeTo | 2026-09-21 제출, 검수 대기. 일반 대기열은 기약 없음. 유료 우선 검수는 하지 않음 |
| 외부 링크 | 아직 없음. 후보: GitHub awesome 목록 PR(awesome-gis 등), Show HN, Reddit(r/gis, r/Garmin), Product Hunt, SaaSHub |
| 광고 | `AdSlot`은 빈 자리만 있음. **사람 방문이 하루 300~500명을 몇 주 유지할 때** 검토(도구 개수와 무관). 붙이려면 CSP를 열어야 하고 FAQ의 "어디로도 보낼 수 없다" 문구를 8개 언어에서 고쳐야 하며 Lighthouse가 떨어짐. 후보: 애드센스(수익 높음, 추적·쿠키 배너), EthicalAds/Carbon(추적 없음, 최소 트래픽 조건), 후원 링크(CSP 영향 없음, 지금도 가능) |
| 분석 | Cloudflare Web Analytics(JS 비콘)는 CSP와 충돌해서 끔. 서버 측 통계(Cloudflare → Analytics & Logs → Traffic)와 서치 콘솔을 사용 |

## 4. 다음 작업 후보 (검색어 데이터를 보고 고를 것)

- 새 도구: KML→CSV, GeoJSON→CSV는 설정 항목만 추가하면 됨. TCX/FIT 입력은 reader가 필요해 큼.
- KMZ 입력: 지금은 FAQ에서 "직접 압축을 풀라"고 안내 중. 브라우저 내장 압축 해제로 구현 가능.
- 다중 파일 일괄 변환(zip 다운로드).
- IndexNow: 도구를 자주 추가하게 되면 Bing에 즉시 알리는 용도. 사이트 루트에 키 `.txt` 파일 필요.

## 5. 방문자 수 확인 방법

```sh
node scripts/traffic.mjs 7      # 최근 7일. 숫자는 일 수
```

- 이 PC에서 `npx wrangler login`이 되어 있어야 한다(2026-09-22에 로그인함). 다른 PC면 다시 로그인.
- Cloudflare의 순 방문자(IP 수)는 **봇이 그대로 포함**된다. 새 도메인은 취약점 스캐너
  (`/wp-login.php`, `/.env` 탐색)와 오래된 Chrome UA를 단 봇이 대부분이다.
- 스크립트의 "human-looking"도 대략적인 추정이고 운영자·검증 접속이 포함된다.
- **검색으로 들어온 사람 수는 서치 콘솔 → 실적 → 클릭 수가 정확하다**(봇 제외, 2~3일 지연).

기준선(2026-09-17~22, 색인 첫 주): 일 요청 900~1,500, IP 100~275, 이 중 사람은 하루 0~5명으로 추정.
광고 검토 기준(하루 300~500명)은 사람 기준이므로 Cloudflare 숫자와 직접 비교하지 말 것.

## 6. 리포에 없는 설정 (Cloudflare 대시보드에만 있음)

영역(zone)을 다시 만들 일이 생기면 아래를 다시 해야 한다.

| 설정 | 위치 | 값 |
|---|---|---|
| 빌드 변수 | Workers & Pages → gps-tools → Settings → Build → **Build variables and secrets** | `SITE_URL` = `https://gpxkit.com` (런타임 "Variables and Secrets"가 아님. 없으면 빌드가 실패하도록 가드가 걸려 있음) |
| 빌드 명령 | 같은 화면 | Build `npm run build` / Deploy `npx wrangler deploy` / 비운영 브랜치 `npx wrangler versions upload` |
| www 리다이렉트 | gpxkit.com → DNS | `AAAA` `www` → `100::` (Proxied) |
| | gpxkit.com → Rules → Redirect Rules | "Redirect from WWW to root" 템플릿, 301 |
| HTTPS 강제 | gpxkit.com → SSL/TLS → Edge Certificates | Always Use HTTPS: On, HSTS: 6개월 + includeSubDomains, preload 끔 |
| 분석 비콘 | Analytics & Logs → Web Analytics | Automatic setup **Disabled** (켜면 CSP가 막아 콘솔 오류만 생기고 Lighthouse가 92로 떨어짐) |
| 서치 콘솔 인증 | gpxkit.com → DNS | `TXT` `@` = `google-site-verification=…` (지우면 구글·Bing 인증이 모두 풀림) |

커스텀 도메인 연결, `workers.dev`·프리뷰 URL 비활성화는 `wrangler.jsonc`에 들어 있다.

## 7. 작업 방법 요약

```sh
npm install
npm run dev        # http://localhost:4321
npm run verify     # 변경을 끝냈다고 말하기 전에 항상 실행
git push           # main에 push하면 자동 배포
```

- **도구 추가**: `src/config/tools.ts`의 `TOOL_SLUGS`와 `definitions`에 한 줄 + 8개 언어 팩
  (`src/i18n/locales/*.ts`)에 제목·설명·FAQ 추가. 새 포맷이면 `src/lib/convert`에 reader/writer.
  언어 팩에 하나라도 빠지면 컴파일 오류가 난다.
- **언어 추가**: `site.ts`의 `LOCALES`·`LOCALE_NAMES`, 팩 파일, `src/i18n/packs.ts` 항목.
- **FAQ에 사실 주장을 쓰면 테스트로 뒷받침한다.** 변환 동작을 바꾸면 FAQ도 고친다.
- 배포 확인: `gh api repos/InjunKang/gps-tools/commits/<SHA>/check-runs`로 CI와 Cloudflare 빌드 결과를 볼 수 있다.

## 8. 지금까지 실제로 겪은 문제와 교훈

같은 실수를 반복하지 않기 위한 기록이다. 대부분 테스트로 막아 두었다.

| 문제 | 원인 | 막아 둔 방법 |
|---|---|---|
| 홈 페이지에서 CSP가 무시됨 | `{count && <x/>}`가 `0`을 `<head>`에 렌더링 → 파서가 head를 닫음 → CSP meta가 body로 밀림 | `tests/build-output.test.ts`: head 안에 텍스트 없음, CSP가 head 안에 있음 |
| 첫 배포의 canonical이 example.com | `SITE_URL`을 런타임 변수에 넣음 | `resolveSiteUrl()`이 Cloudflare 빌드에서 변수가 없으면 빌드 실패 |
| Garmin Connect 심박 유실 | togeojson이 `gpxtpx:` 접두사만 인식, Garmin은 `ns3:` | `readers/gpx.ts`에서 접두사 정규화 + 회귀 테스트 |
| 2점짜리 `gx:Track`의 점 하나 유실 | togeojson 버그(`length > 2`) | `readers/kml.ts`에서 NaN 센티넬로 우회 + 회귀 테스트 |
| Latin-1 파일의 움라우트 깨짐 | `file.text()`는 항상 UTF-8 | `decodeXml()`: BOM·XML 선언으로 디코딩 |
| Google Earth 경로의 고도가 0m로 기록 | 지면 고정 경로의 고도 `0`을 실제 값으로 씀 | KML reader: 피처의 고도가 전부 0이면 제거 |
| 아이폰(iOS 13)에서 파일 선택 후 무반응 | 번들에 `??=` → 문법 오류로 스크립트 전체가 죽음 | 빌드 타깃 Safari 13 + 최신 문법 검사 + `error-guard.js` |
| 아이패드(iPadOS 13)에서 "unknown" 오류 | `Blob.arrayBuffer()` 없음 | `src/workers/read-bytes.ts`: FileReader 대체 |
| 아이패드에서 파일명이 `unknown` | Safari 13이 blob 다운로드의 `download` 속성을 무시 | 기능 감지로 이름 변경 안내 문구 표시 (코드로 우회 불가) |
| 데스크톱에 "공유" 버튼이 항상 보임 | `.button { display }`가 `hidden` 속성을 덮음 | 전역 `[hidden] { display: none !important }` + 빌드 테스트. **검증은 속성이 아니라 실제 화면 표시로 할 것** |
| 언어 메뉴 추가 후 오류 가드가 늦게 로드됨 | Astro가 번들 스크립트를 첫 컴포넌트 스크립트 위치로 끌어올림 | 가드를 `<head>`로 이동 + 순서 검사 테스트 |
| Cloudflare가 분석 비콘을 자동 주입 | 도메인 연결 시 기본으로 켜짐 | 대시보드에서 끔(5번 표 참고) |

작업 도구 관련: **Git Bash heredoc에 백슬래시가 든 내용(정규식 등)을 넣으면 백슬래시가 사라진다.**
정규식이나 이스케이프가 든 파일은 편집 도구로 직접 수정할 것. 여러 번 같은 실수를 했다.

## 9. 실제 파일 검증 자료 (로컬 전용, 리포에 없음)

`verification/` 폴더는 gitignore되어 있다. 내려받은 파일의 라이선스가 불분명하기 때문이다.

| 경로 | 내용 |
|---|---|
| `verification/input/` | Strava(7,264점), Garmin Connect(217점), Komoot(1,699점) GPX, Google Earth Pro KML 2개, Google 공식 KML 샘플, QGIS GeoJSON(CRS84, EPSG:3857) |
| `verification/scripts/` | 검증용 스크립트 모음. 실행하려면 그 폴더에서 `npm i puppeteer-core lighthouse playwright` |
| `verification/screenshots/` | 디렉터리 등록용 스크린샷 4장과 아이콘(`icon-512.png`) |

주요 스크립트:
- `realworld.mjs` / `compare.mjs`: 실제 파일을 사이트(워커 경로)로 변환하고, 우리 라이브러리를 쓰지 않고 원본과 개수를 비교
- `stress.mjs`: 35MB·110MB 파일과 깨진 파일 9종
- `webkit.mjs`: Playwright WebKit + iPhone 프로필
- `gpxstudio.mjs`, `earth.mjs`: 변환 결과를 gpx.studio와 Google Earth 웹에 올려 확인
- `share.mjs`, `visible.mjs`: 공유 버튼·안내 문구의 상황별 표시 확인

스크립트는 `http://localhost:4321`(미리보기 서버)을 대상으로 한 것이 많다. 먼저 `npm run build && npm run preview`.

## 10. 외부 서비스 계정 메모

- GitHub: `InjunKang` (커밋 작성자도 이 이름. 과거 커밋의 이메일은 2026-09-21에 다시 써서 교체함)
- Cloudflare: 워커 `gps-tools`, 영역 `gpxkit.com` (같은 계정에 있어야 배포가 됨). 이 PC에 wrangler 로그인됨(2026-09-22)
- 구글 서치 콘솔: `gpxkit.com` 도메인 속성. 처음에 다른 구글 계정으로 연결됐다가 원하는 계정으로 다시 인증함
- Bing 웹마스터 도구: 서치 콘솔에서 가져오기로 등록. 사이트맵 표시가 "URL 1개"인 것은 인덱스 파일 기준이라 정상
- AlternativeTo: GPXKit 제출됨(검수 대기). 비슷한 이름의 "GPTKit"은 무관한 AI 도구
- 참고: "GPXKit"이라는 Swift 라이브러리가 따로 있어 브랜드 검색어는 당분간 그쪽이 상위에 나옴
