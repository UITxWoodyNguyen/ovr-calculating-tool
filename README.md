# OVR Calculating Tool - FIFA Online 4 / FC Online

Công cụ tính & tối ưu đào tạo chỉ số cầu thủ cho FIFA Online 4 / FC Online.

## Tính năng chính

- **Tìm kiếm cầu thủ**: Lọc theo tên, vị trí, mùa thẻ (season)
- **Tính OVR chính xác**: Sử dụng công thức weighted average (trung bình có trọng số) đã kiểm chứng
- **Tối ưu đào tạo**: Thuật toán brute-force tìm phương án đào tạo tối ưu (tối đa 5 chỉ số, mỗi chỉ số +0→+2)
- **Tie-break thông minh**: Ưu tiên OVR cao nhất → ít lượt đào tạo hơn → ít chỉ số hơn
- **Giải thích AI**: Tích hợp Claude API để diễn giải phương án đào tạo bằng ngôn ngữ tự nhiên
- **Admin panel**: Chỉnh sửa hệ số vị trí không cần deploy lại code

## Công thức OVR

```
OVR = round( Σ(chỉ_số_i × hệ_số_i) / Σ(hệ_số_i) )
```

Đây là công thức weighted average (trung bình có trọng số), **không** chia cho số lượng chỉ số.

## Ràng buộc đào tạo

| Ràng buộc | Giá trị |
|---|---|
| Số chỉ số tối đa được đào tạo | 5 |
| Mức tăng tối đa mỗi chỉ số | +2 |
| Mức tăng khả dụng | 0, +1, +2 |
| Tổng lượt đào tạo tối đa | 10 (5×2) |

**Lưu ý**: Hệ thống **không bắt buộc dùng hết 10 lượt** - nếu nhiều phương án cho cùng OVR tối đa, sẽ chọn phương án dùng ít lượt hơn.

## Cài đặt & Chạy local

```bash
# Clone project
cd ovr-calculating-tool

# Cài đặt dependencies
npm install

# Setup database
cp .env.example .env
# Chỉnh DATABASE_URL trong .env (mặc định: SQLite file:./dev.db)

# Generate Prisma client & push schema
npx prisma generate
npx prisma db push

# Seed dữ liệu hệ số 12 vị trí
npx ts-node --esm prisma/seed.ts

# Chạy development server
npm run dev
```

Mở http://localhost:3000

## Deploy lên Vercel

1. Push code lên GitHub
2. Import project trên Vercel
3. Thêm Environment Variables:
   - `DATABASE_URL`: PostgreSQL connection string (Vercel Postgres / Neon / Supabase)
   - `ANTHROPIC_API_KEY`: API key Claude (optional, cho AI explanation)
4. Deploy

**Lưu ý**: SQLite không chạy được trên Vercel serverless. Cần đổi sang PostgreSQL trong `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Sau đó chạy `npx prisma generate` và deploy lại.

## Cấu trúc thư mục

```
ovr-calculating-tool/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── positions/     # CRUD vị trí & hệ số
│   │   ├── seasons/       # Mùa thẻ
│   │   ├── players/       # CRUD cầu thủ
│   │   ├── ovr/           # Tính OVR
│   │   ├── training/      # Tối ưu đào tạo
│   │   └── ai/            # Giải thích AI
│   ├── player/[id]/       # Trang chi tiết cầu thủ + tối ưu
│   └── admin/             # Admin panel chỉnh hệ số
├── lib/
│   ├── ovr/calculate.ts   # Core tính OVR (weighted average)
│   ├── optimizer/         # Thuật toán tối ưu brute-force
│   └── prisma.ts          # Prisma client singleton
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed dữ liệu 12 vị trí
├── packages/data/seed/    # JSON dữ liệu hệ số
├── scripts/ingest/        # Script import dữ liệu (CSV)
└── tests/                 # Unit tests
```

## API Endpoints

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/positions` | Danh sách 12 vị trí |
| GET | `/api/positions/:code/weights` | Hệ số vị trí (có seasonId optional) |
| GET | `/api/seasons` | Danh sách mùa thẻ |
| GET | `/api/players` | Tìm cầu thủ (query: position, season, q) |
| GET | `/api/players/:id` | Chi tiết cầu thủ + lịch sử tối ưu |
| POST | `/api/ovr/calculate` | Tính OVR từ chỉ số nhập tay |
| POST | `/api/training/optimize` | Tối ưu đào tạo |
| POST | `/api/ai/explain` | Giải thích AI (Claude) |
| GET | `/api/admin/stats` | Danh sách chỉ số |
| POST | `/api/admin/positions/:code/weights` | Cập nhật hệ số |

## Import dữ liệu cầu thủ

```bash
# Import từ CSV
npm run ingest:players -- --csv=path/to/file.csv
```

Format CSV (xem `sample-players.csv`):
```csv
externalId,name,seasonCode,primaryPositionCode,secondaryPositions,sourceUrl,pace,acceleration,finishing,...
213590,"Lionel Messi","23TOTY","CAM","LM;RM","https://...",89,92,93,...
```

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Database**: Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude API (tool-use pattern)
- **Validation**: Zod

## License

MIT