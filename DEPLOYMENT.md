# Vercel 임시 배포 안내

## 준비 상태

- React 19 + TypeScript 5.7 + Vite 6.4.5. Next.js와 React Router는 사용하지 않습니다.
- `npm run build`: TypeScript 검사 후 `dist/` 생성. `npm run verify`: 렌더링·앵커·폼 검증.
- 원격 저장소: https://github.com/taeyoon0825/Homepage / 기본·현재 브랜치: `main`.
- 이번 작업 시작 시 작업 트리는 깨끗했고 `HEAD`와 로컬 `origin/main`이 동일했습니다. GitHub 연결 도구로 저장소 접근과 기본 브랜치도 확인했습니다.
- 외부 API, 백엔드, 필수 환경변수 없음. Google Fonts만 외부에서 불러오며 실패 시 시스템 글꼴을 사용합니다. 이미지 자산은 사용하지 않고 SVG 아이콘을 번들에 포함합니다.
- **실제 Vercel 프로젝트 생성·배포 및 GitHub 자동 배포 연결은 수행하지 않았습니다. 확인된 배포 URL이 없습니다.** 사용자 선택에 따라 설정·빌드까지 준비하고 로그인 및 이용 조건 확인은 사용자가 진행합니다.
- 기존 커밋 기록·앱 디자인·기능을 유지했습니다. 원격 저장소 초기화와 강제 Push를 수행하지 않았습니다.

## 먼저 확인할 무료 플랜 조건

Vercel Hobby는 개인·비상업용으로 제한됩니다. 회사 소개·서비스 홍보 홈페이지는 상업적 사용에 해당할 수 있으므로, 테스트·검토 목적을 포함해 자신의 사용 방식이 허용되는지 Vercel에 확인한 뒤 진행하세요. 무료 배포 가능하다고 확정하지 않습니다. 유료 Pro 가입·체험판·추가 과금 기능은 이 작업에서 활성화하지 않았습니다.

- 공식 조건: https://vercel.com/docs/plans/hobby
- 상업적 사용 안내: https://vercel.com/docs/limits/fair-use-guidelines

## 사용자 로그인 및 배포 절차

이용 조건 확인 후 진행합니다. 허용되지 않으면 무료 플랜 배포를 진행하지 말고 다른 플랫폼을 선택합니다.

1. 아래 변경 파일을 검토하고 기존 `main`에 일반 커밋·Push합니다. 다른 변경이 생겼다면 해당 변경과 구분해 확인하세요. 강제 Push는 사용하지 않습니다.

   ```sh
   git status
   git diff
   git add .gitignore .nvmrc package.json package-lock.json index.html vercel.json DEPLOYMENT.md README.md
   git commit -m "Prepare Vercel deployment and disable indexing for review"
   git push origin main
   ```

2. https://vercel.com/new 에서 본인 계정으로 로그인합니다. GitHub 연동 시 `taeyoon0825/Homepage` 저장소 접근 권한을 승인하고 기존 저장소를 Import합니다. 저장소가 보이지 않으면 Vercel GitHub App의 Repository access에서 이 저장소를 허용합니다. 비밀번호나 토큰을 코드·채팅에 입력하지 않습니다.
3. 새 프로젝트 화면에서 다음 값을 확인합니다. 코드가 저장소 루트에 있으므로 하위 폴더를 선택하지 않습니다.

   | 항목 | 값 |
   | --- | --- |
   | Framework Preset | Vite |
   | Root Directory | 저장소 루트 (`./`) |
   | Install Command | `npm ci` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Node.js Version | 24.x (`package.json` 및 `.nvmrc`와 일치) |
   | Environment Variables | 현재는 필요 없음 |

4. Deploy 후 상태가 Ready인지 확인합니다. Domains에 실제 할당된 `vercel.app` 주소를 복사합니다. 이 문서는 특정 주소가 할당되었다고 가정하지 않습니다.
5. Settings의 Git 연결이 해당 저장소인지, Production Branch가 `main`인지 확인합니다. 그 뒤 `main`에 일반 Push하면 프로덕션 자동 배포가 발생합니다. 별도 GitHub Actions·Vercel 토큰은 필요하지 않습니다. 브랜치 보호 규칙이 있다면 PR을 거쳐 `main`으로 병합합니다.
6. 확인용 변경을 Push한 뒤 Deployments에서 커밋 SHA·Ready 상태·접속 화면을 대조해야 **자동 배포 검증 완료**로 판단할 수 있습니다. 현재는 이 단계까지 검증하지 않았습니다.

공식 Git 연동: https://vercel.com/docs/git/vercel-for-github

## 경로와 프로덕션 환경

Vite 기본 base `/`를 사용하므로 Vercel 도메인의 루트에 배포합니다. 빌드된 `index.html`은 `/assets/`의 해시가 붙은 JS·CSS를 참조하며 개발 서버 코드가 제거됩니다. 저장소 이름인 `/Homepage/`를 URL base로 설정할 필요가 없습니다.

현재 이동은 `/#services`, `/#business-types`, `/#consultation` 등 해시 앵커입니다. 브라우저는 해시 앞 `/`만 서버에 요청하므로 새로고침에 별도 SPA 재작성 규칙이 필요하지 않습니다. 존재하지 않는 `/services` 같은 경로는 실제 페이지가 아닙니다. 추후 React Router의 BrowserRouter를 도입할 때만 Vercel 공식 Vite 안내에 따라 다음을 `vercel.json`에 병합하고 정적 파일 로딩과 실제 라우트를 다시 확인하세요.

```json
{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}
```

현재는 이 규칙을 적용하지 않았습니다. 서버 API·별도 페이지가 추가되면 그 경로도 고려해야 합니다.

공식 Vite 배포 안내: https://vercel.com/docs/frameworks/frontend/vite

로컬은 Vite 개발 서버의 HMR을 사용하지만 배포본은 정적 파일만 제공합니다. Vercel에 업로드해도 문의 수신 서버가 자동으로 생성되지 않습니다. 로컬 검사와 Vercel 빌드에 Node 24를 사용하도록 설정했습니다. Vercel의 실제 빌드 로그도 확인하세요.

## 환경변수·민감정보

현재 배포에 추가할 변수는 없습니다. `.env`, `.env.*`, `.vercel/`은 Git에서 제외하고 필요하면 값이 없는 `.env.example`만 공유합니다. 현재 추적 파일에서 환경파일·API 키 패턴이 발견되지 않았지만 이는 전문적인 전체 이력 보안 감사를 대체하지 않습니다.

추후 변수는 Vercel Project Settings → Environment Variables에서 Development/Preview/Production을 구분해 입력하고 재배포합니다. **`VITE_` 변수는 공개 JS에 포함되므로 API 비밀키를 넣으면 안 됩니다.** 비밀키는 별도 서버의 환경변수로 처리합니다. 이미 커밋된 비밀은 `.gitignore` 추가로 삭제되지 않으므로 노출 키를 폐기·교체하고 별도 대응합니다.

## 검색 노출: 검토 단계

사용자 선택으로 검색 노출 제한을 적용했습니다.

- `index.html`: `<meta name="robots" content="noindex, nofollow">`.
- `vercel.json`: 전체 응답에 `X-Robots-Tag: noindex, nofollow`.
- canonical, sitemap, robots.txt는 현재 만들지 않았습니다. 실제 도메인 없이 가짜 URL을 생성하지 않습니다.
- `robots.txt`의 `Disallow: /`는 추가하지 않았습니다. 크롤러가 페이지와 noindex 응답을 읽을 수 있어야 합니다. noindex는 비밀번호 보호나 접근 제어가 아니므로 링크를 아는 사람은 볼 수 있습니다.
- 배포 후 문서 원본의 robots 메타와 실제 HTTP 헤더를 모두 확인해야 합니다. 호스팅 설정은 로컬 Vite 프리뷰가 적용하지 않습니다.

```sh
# 실제 배포 URL을 DEPLOYED_URL 자리에 대입
curl -I 'https://DEPLOYED_URL/'
```

## 정식 도메인으로 전환

1. 도메인 구입 후 Vercel Project Settings → Domains에서 추가합니다. 등록기관에 **그때 Vercel이 표시하는** DNS 값을 설정하고 검증·HTTPS 발급을 확인합니다. 고정 IP나 CNAME 값을 미리 가정하지 않습니다.
2. 대표 도메인 하나를 정하고 www 및 임시 vercel.app 주소에서 대표 도메인으로 리디렉션을 설정·확인합니다. Git 연결과 빌드 구조는 그대로 유지할 수 있습니다.
3. `src/config/company.ts`의 `domain`, `shareImage` 및 실제 회사 정보를 확정합니다. 앱 코드에는 도메인에 종속된 내부 링크가 없습니다.
4. `index.html`의 title·description과 OG 태그·canonical을 확정 도메인의 절대 URL로 넣습니다. JS 실행 후 추가되는 OG만으로 모든 공유 크롤러를 지원할 수 없으므로 원본 HTML에도 반영해야 합니다.
5. 정식 공개 시 robots 메타와 Vercel의 X-Robots-Tag를 **함께 제거**하고 재배포합니다. Search Console 등에서 노출 상태를 확인합니다. 검토 브랜치를 계속 noindex로 유지하려면 이후 배포 환경별 설정을 분리합니다.
6. 원페이지 사이트의 sitemap에는 대표 루트 URL 하나를, robots.txt에는 수집 허용 규칙과 확정 sitemap 주소를 추가합니다. 서비스별 상세 페이지가 생기면 실제 페이지 URL만 추가합니다. 해시 앵커는 별도 페이지로 넣지 않습니다.

공식 도메인 연결: https://vercel.com/docs/domains/working-with-domains/add-a-domain

## 배포 후 사용자 확인표

아래 항목은 **실제 배포 후 수행할 항목이며 현재 통과한 것으로 보고하지 않습니다.**

- [ ] 할당된 HTTPS 주소에서 메인 화면, 소개·SEO·GEO 등 서비스 6종 표시.
- [ ] 개발자 도구 Network에서 JS·CSS가 200이고 HTML로 잘못 응답하지 않는지 확인. Google Fonts 실패 시 시스템 글꼴 확인.
- [ ] Console에 앱 오류가 없는지 확인. 확장 프로그램 오류는 사이트 오류와 구분.
- [ ] 상단 메뉴, 모바일 메뉴와 하단 상담 버튼, FAQ 조작.
- [ ] 추천 탭과 방향키 조작, 서비스별 상담 선택·추천 구성 자동 선택.
- [ ] `/#services`와 `/#consultation`에서 새로고침 후 정상 표시 및 섹션 이동.
- [ ] 360·390·768·1440px 및 실제 휴대폰에서 가로 넘침·겹침·입력 키보드·버튼 표시 확인.
- [ ] 잘못된 입력 시 오류와 포커스 이동, 올바른 테스트 입력 시 **전송·접수되지 않았다는 안내** 확인. 실제 고객 개인정보를 테스트에 쓰지 않기.
- [ ] 테스트 제출에 문의 전송 네트워크 요청이 없으며 브라우저 저장소에 입력값이 남지 않는지 확인.
- [ ] robots 메타와 `X-Robots-Tag` 헤더 확인.
- [ ] `main` Push 후 새 커밋의 자동 배포와 최신 화면 확인.

현재 문의 폼은 검증·상태 전환만 작동합니다. 실제 상담을 받으려면 `src/lib/inquiry.ts`의 제출 함수를 실제 API에 연결하고 개인정보 안내를 운영용으로 확정해야 합니다.

Node 24 지원 확인: https://vercel.com/docs/functions/runtimes/node-js/node-js-versions

## 이번 로컬 검증 결과

- 설치된 의존성 확인과 잠금 파일 동기화 완료.
- `npm run build`: TypeScript 및 Vite 빌드 성공.
- `npm run verify`: React 렌더링, 내부 앵커, 구성 요소 및 폼 검증 통과.
- 프로덕션 프리뷰에서 `/` 및 섹션 해시 주소의 루트 응답, 빌드 JS·CSS 응답이 모두 HTTP 200이며 콘텐츠 유형이 올바른 것을 확인.
- 빌드 HTML의 noindex 메타와 Vercel 헤더 설정 확인. Vercel의 실제 응답 헤더 적용은 배포 후 확인 필요.
- 실제 브라우저 렌더링·모바일 실기기·Console·외부 Google Fonts 네트워크 상태 및 Vercel 자동 배포는 미검증.
- 새로고침은 현재 해시 방식의 서버 요청 경로와 로컬 HTTP 응답을 확인한 범위이며, 실제 브라우저에서의 섹션 복원은 배포 후 확인 필요.
- 변경 파일은 로컬 준비 상태이며 이번 작업에서 Git 커밋·Push를 수행하지 않았습니다.
