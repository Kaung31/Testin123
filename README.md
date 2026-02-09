# 🛴 Repair Hub - Pure Electric Scooter Knowledge Base

A comprehensive repair knowledge base and diagnostic tool for Pure Electric scooter mechanics.

## 🎯 Purpose

This app was created by a mechanic at Pure Electric (UK) to solve a real problem: **new mechanics and shops don't have standardized repair instructions**. This platform provides:

- ✅ Step-by-step repair guides for all models
- ✅ Complete error code database with solutions
- ✅ Video tutorials from experienced mechanics
- ✅ Specifications and common issues for each model
- ✅ Search functionality to quickly find solutions

## 🚀 Quick Deploy to Vercel

### 1. Push to GitHub

```bash
# In your project folder
git init
git add .
git commit -m "Initial commit - Repair Hub v2"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/repair-hub.git
git push -u origin main
```

### 2. Deploy on Vercel

**Option A: Website (Easiest)**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your `repair-hub` repository
5. Click "Deploy" (all settings auto-detected)
6. Done! Get your live URL in 2-3 minutes

**Option B: CLI**
```bash
npm i -g vercel
vercel
```

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📱 Features

### 🏠 Dashboard
- Quick search for error codes and parts
- Live stats (repairs completed, parts availability)
- Quick access to all models
- Recent repair logs

### 🛴 Models Section
- Pure Air (Entry-level, 25km range)
- Pure Pro (Mid-range, 40km range)
- Advance (Premium, 50km range)
- Air Go (Ultra-compact, 20km range)

Each model page includes:
- Full specifications
- All repair guides specific to that model
- Common error codes
- Video tutorials

### ⚠️ Error Codes Database
13 error codes documented including:
- E01 - Throttle Malfunction
- E07 - Motor Phase Wire Issue
- E08 - Controller Communication Error
- And more...

Each error code includes:
- Description and severity
- Possible causes
- Step-by-step solutions
- Estimated repair time
- Affected models

### 📖 Repair Guides
55+ repair procedures covering:
- Battery replacement
- Brake servicing
- Motor diagnostics
- Electronics repair
- Mechanical adjustments
- Wheel maintenance

Organized by:
- Difficulty level (Easy/Medium/Hard)
- Category (Battery, Motor, Brakes, etc.)
- Estimated time
- Required tools

### 🎥 Video Tutorials
Video library with:
- Beginner, Intermediate, Advanced categories
- Duration and view counts
- Difficulty ratings
- Model-specific content

## 🔧 Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling
- **Lucide React** - Icon library
- **Vercel** - Deployment platform

## 📂 Project Structure

```
repair-hub-v2/
├── app/
│   ├── page.tsx              # Dashboard/Homepage
│   ├── models/
│   │   ├── page.tsx          # Models overview
│   │   └── [model]/page.tsx  # Individual model pages
│   ├── error-codes/page.tsx  # Error codes database
│   ├── guides/page.tsx       # Repair guides
│   ├── videos/page.tsx       # Video tutorials
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   └── Sidebar.tsx           # Navigation sidebar
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.mjs
```

## 🎨 Design Features

- **Modern Bento-style UI** - Card-based dashboard layout
- **Fully Responsive** - Works on mobile, tablet, desktop
- **Smooth Animations** - Professional hover effects and transitions
- **Dark Sidebar** - Easy navigation with active states
- **Color-coded Difficulty** - Easy/Medium/Hard visual indicators
- **Search Functionality** - Quick access to any content

## 🚦 Future Enhancements

Ideas for v3:
- [ ] User authentication (mechanic accounts)
- [ ] Track completed repairs
- [ ] Add personal notes to guides
- [ ] Upload repair photos
- [ ] Print/export repair procedures
- [ ] Parts inventory management
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Offline mode for workshop use
- [ ] Integration with Pure Electric systems

## 📝 How to Contribute Content

### Adding New Repair Guides
1. Edit `app/guides/page.tsx`
2. Add entry to `guides` array with:
   - Title, category, difficulty
   - Description, steps, required tools
   - Estimated time

### Adding Error Codes
1. Edit `app/error-codes/page.tsx`
2. Add entry to `errorCodes` array with:
   - Code, name, severity
   - Causes and solutions
   - Affected models

### Adding Video Tutorials
1. Edit `app/videos/page.tsx`
2. Add entry to `videos` array
3. Include thumbnail emoji, duration, description

## 🐛 Troubleshooting

**Build fails:**
- Check Node.js version (need 18.x or higher)
- Run `npm install` to ensure dependencies are installed

**Styles not loading:**
- Ensure Tailwind is configured correctly
- Check `globals.css` is imported in layout

**Navigation not working:**
- Verify all page files are in correct folders
- Check Next.js App Router structure

## 📞 Support

For issues or questions:
1. Check Vercel deployment logs
2. Review Next.js documentation
3. Contact the development team

## 📄 License

Internal tool for Pure Electric mechanics. Not for public distribution.

---

**Built by mechanics, for mechanics.** 🔧
