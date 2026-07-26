# EcoScan Setup & Configuration Guide

## 🚀 Complete Setup Instructions

### Step 1: Clone Repository
```bash
git clone https://github.com/721189/EcoScan-technology-.git
cd EcoScan-technology-
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration

#### Create `.env.local`
```bash
cp .env.example .env.local
```

#### Configure Supabase (Optional but Recommended)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Fill in project details
   - Wait for provisioning (2-3 minutes)

2. **Get API Keys**
   - Go to **Settings > API**
   - Copy "Project URL" (VITE_SUPABASE_URL)
   - Copy "Anon Key" (VITE_SUPABASE_ANON_KEY)

3. **Update `.env.local`**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 4: Run Development Server
```bash
npm run dev
```

The app will open at http://localhost:5173

---

## 🔌 API Integration Setup

### Weather Data (OpenWeatherMap Example)

1. **Get API Key**
   - Visit https://openweathermap.org/api
   - Sign up for free account
   - Create new API key

2. **Add to `.env.local`**
   ```env
   VITE_WEATHER_API_KEY=your-key-here
   ```

3. **Update `lib/api.ts`**
   ```typescript
   export const fetchWeatherData = async (lat: number, lon: number) => {
     const response = await axios.get(
       `https://api.openweathermap.org/data/2.5/weather`,
       {
         params: {
           lat,
           lon,
           appid: import.meta.env.VITE_WEATHER_API_KEY,
           units: 'metric'
         }
       }
     );
     return response.data;
   };
   ```

### Air Quality Data (IQAir Example)

1. **Get API Key**
   - Visit https://www.iqair.com/air-quality-api
   - Register for API access
   - Copy your API key

2. **Add to `.env.local`**
   ```env
   VITE_AQI_API_KEY=your-key-here
   ```

3. **Update `lib/api.ts`**
   ```typescript
   export const fetchAirQualityData = async (lat: number, lon: number) => {
     const response = await axios.get(
       `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${import.meta.env.VITE_AQI_API_KEY}`
     );
     return response.data;
   };
   ```

---

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```

This creates a `dist` folder with optimized production build.

### Preview Build Locally
```bash
npm run preview
```

### Deploy to Vercel (Recommended)

1. **Connect Repository**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository

2. **Set Environment Variables**
   - In Vercel dashboard: Project > Settings > Environment Variables
   - Add all variables from `.env.local`:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_WEATHER_API_KEY` (if using)
     - `VITE_AQI_API_KEY` (if using)

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy

### Deploy to Netlify

1. **Connect Repository**
   - Go to https://netlify.com
   - Click "New site from Git"
   - Choose your repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Set Environment Variables**
   - Site > Settings > Build & deploy > Environment
   - Add environment variables

4. **Deploy**
   - Netlify will automatically build and deploy

---

## 🐛 Troubleshooting

### "Supabase is not configured"

**Solution**: Make sure `.env.local` has correct values:
```bash
# Check if file exists
ls -la .env.local

# Restart dev server
npm run dev
```

### "Module not found" Errors

**Solution**: Reinstall dependencies
```bash
rm -rf node_modules
npm install
npm run dev
```

### Map not loading

**Solution**: Ensure Leaflet CSS is imported
```typescript
import 'leaflet/dist/leaflet.css';
```

### CORS Errors

**Solution**: If using APIs that don't support CORS, use a proxy service or backend:
```typescript
// Option 1: Use CORS proxy (not recommended for production)
const response = await axios.get(
  `https://cors-anywhere.herokuapp.com/${apiUrl}`
);

// Option 2: Create backend proxy endpoint (recommended)
const response = await axios.get('/api/environmental-data', {
  params: { lat, lon }
});
```

### Auth not working

**Solution**: Check Supabase configuration
```typescript
// In lib/supabase.ts
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Leaflet Documentation](https://leafletjs.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [Recharts Documentation](https://recharts.org)

---

## ✅ Verification Checklist

Before deploying to production:

- [ ] All environment variables are set
- [ ] No console errors in browser DevTools
- [ ] Search functionality works
- [ ] Map displays correctly
- [ ] Recommendations display based on data
- [ ] Alerts show for hazardous conditions
- [ ] Auth works (if Supabase configured)
- [ ] Favorites can be saved/loaded
- [ ] Recent searches are tracked
- [ ] Error boundary catches component errors
- [ ] Responsive design works on mobile
- [ ] Build completes without errors: `npm run build`

---

## 🆘 Getting Help

1. **Check Existing Issues**: https://github.com/721189/EcoScan-technology-/issues
2. **Create New Issue**: Provide error message, steps to reproduce, and environment info
3. **Browser Console**: Check for JavaScript errors (F12)
4. **Network Tab**: Check API requests for failures
5. **Environment Variables**: Verify `.env.local` is properly configured

---

Happy coding! 🌍
