# AIPIA 프론트엔드 과제 전형

AIPIA 프론트엔드 과제 전형으로 Hacker News API를 활용한 뉴스 목록 및 상세 페이지를 구현한 프로젝트입니다.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Query (TanStack Query)
- **API**: Hacker News API

## Features

### 1. 뉴스 목록 페이지 (`/news/list/[tab]`)
- 탭 (Top, New, Best)
- 페이지네이션 (10개 항목씩 표시)
  - 1-10, 11-20 등 그룹 단위로 페이지 버튼 표시
  - 이전/다음 그룹 이동 버튼
  - 상황에 따른 버튼 비활성화
- React Query를 사용한 데이터 캐싱 및 로딩 상태 관리
- 스켈레톤 UI를 통한 로딩 표시

### 2. 뉴스 상세 페이지 (`/news/[id]`)
- 서버 사이드 렌더링 (SSR)
- 뉴스 제목, 작성자, 날짜, 점수, URL 정보 표시
- 스켈레톤 로딩 UI

### 3. URL 기반 상태 관리
- 탭은 URL params로 관리 (`/news/list/top`, `/news/list/new`, `/news/list/best`)
- 페이지는 query string으로 관리 (`?page=1`)
- 새로고침해도 탭, 페이지 상태 유지

## Structure

```
src/
├── app/
│   └── news/
│       ├── page.tsx                 # /news 리다이렉트
│       ├── list/[tab]/
│       │   └── page.tsx            # 뉴스 목록 페이지
│       └── [id]/
│           ├── page.tsx            # 뉴스 상세 페이지
│           └── loading.tsx         # 상세 페이지 로딩 UI
├── components/
│   ├── domains/
│   │   ├── news-pagination.tsx    # 페이지네이션 컴포넌트
│   │   ├── news-list-skeleton.tsx # 목록 스켈레톤
│   │   └── back.tsx               # 뒤로가기 버튼
│   └── ui/                        # shadcn/ui 컴포넌트
└── lib/
    └── utils.ts                   # 유틸리티 함수
```

## Getting Started

### 의존성 설치

```bash
yarn
```

### 개발 서버 실행

```bash
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)를 열어 확인할 수 있습니다.

### 빌드

```bash
yarn build
```

### 프로덕션 실행 (빌드 필수)

```bash
yarn start
```
