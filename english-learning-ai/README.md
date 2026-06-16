# English Learning AI 🤖📚

Web học tiếng Anh thông minh sử dụng AI để phân tích văn bản, trích xuất từ vựng, ngữ pháp và tạo bài tập flashcard.

## ✨ Tính năng

- 🤖 **Phân tích AI**: Sử dụng Google Gemini AI để phân tích văn bản tiếng Anh
- 📚 **Từ vựng chi tiết**: Định nghĩa tiếng Việt/Anh, phiên âm IPA, ví dụ, từ đồng nghĩa/trái nghĩa
- 🎯 **Ngữ pháp rõ ràng**: Giải thích cấu trúc, công thức, ví dụ và lỗi thường gặp
- 🎴 **Flashcard tương tác**: Học từ vựng hiệu quả với animation flip
- 💾 **Lưu trữ local**: Tự động lưu các phiên học vào localStorage
- 📊 **Theo dõi tiến độ**: Thống kê số từ đã học, đã thành thạo
- 📱 **Responsive**: Tối ưu cho cả desktop và mobile
- 🔊 **Text-to-Speech**: Phát âm từ vựng bằng Web Speech API

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animation**: Framer Motion
- **AI**: Google Gemini Flash 2.0 (Free tier)
- **Storage**: localStorage (có thể nâng cấp lên Vercel KV/PostgreSQL)
- **Deployment**: Vercel

## 📦 Cài đặt

1. Clone repository:
```bash
git clone https://github.com/YOUR_USERNAME/english-learning-ai.git
cd english-learning-ai
```

2. Install dependencies:
```bash
npm install
```

3. Tạo file `.env.local` và thêm API key:
```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

Lấy API key miễn phí tại: [Google AI Studio](https://makersuite.google.com/app/apikey)

4. Chạy development server:
```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 🏗️ Cấu trúc thư mục

```
english-learning-ai/
├── app/                          # Next.js App Router
│   ├── api/analyze/             # API route phân tích văn bản
│   ├── analysis/[id]/           # Trang kết quả phân tích
│   ├── practice/flashcard/[id]/ # Trang flashcard practice
│   ├── history/                 # Trang lịch sử học tập
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── layout/                  # Header, Footer
│   └── features/                # Feature-specific components
│       ├── text-input/
│       ├── vocabulary/
│       ├── grammar/
│       └── flashcard/
├── lib/
│   ├── ai/                      # AI integration (Gemini)
│   ├── storage/                 # localStorage service
│   ├── types.ts                 # TypeScript types
│   └── utils.ts                 # Utility functions
└── public/                      # Static assets
```

## 🎯 Roadmap

### Phase 1 (Hoàn thành) ✅
- [x] Phân tích văn bản với AI
- [x] Trích xuất từ vựng và ngữ pháp
- [x] Flashcard practice
- [x] Lưu trữ localStorage
- [x] Responsive design

### Phase 2 (Tương lai) 🔮
- [ ] Quiz/Bài tập trắc nghiệm
- [ ] Spaced Repetition System (SRS)
- [ ] Export to Anki
- [ ] Text-to-Speech nâng cao
- [ ] Dark mode
- [ ] Multi-language support
- [ ] User authentication
- [ ] Cloud sync (Vercel KV/PostgreSQL)
- [ ] Gamification (achievements, streaks)
- [ ] API rate limiting
- [ ] PWA support

## 🌐 Deploy lên Vercel

1. Push code lên GitHub
2. Import project trên [Vercel](https://vercel.com)
3. Thêm environment variable: `NEXT_PUBLIC_GEMINI_API_KEY`
4. Deploy!

## 📝 License

MIT License

## 🤝 Contributing

Pull requests are welcome! Hãy mở issue trước khi làm thay đổi lớn.

---

Made with ❤️ and AI
