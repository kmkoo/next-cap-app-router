## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# EC2에 Redis 설치

# Redis 설치
sudo apt update
sudo apt install redis-server -y

# Redis 실행
sudo systemctl start redis-server

# EC2 부팅 시 Redis 자동 실행
sudo systemctl enable redis-server

# NEXT-CAP-APP-ROUTER/.env 파일 내부 코드 생성 및 수정 필요
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_password
REDIS_URL=redis://127.0.0.1:6379
