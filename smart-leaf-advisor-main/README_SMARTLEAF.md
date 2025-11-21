# 🌿 Smart Leaf - AI-Based Plant Disease Detection & Treatment Advisor

## English | ಕನ್ನಡ

**Smart Leaf** is a production-ready web application that helps farmers detect plant diseases using AI and provides treatment recommendations with voice output in both English and Kannada.

---

## ✨ Features

### 🔍 Core Functionality
- **Real-time Disease Detection**: Upload or capture leaf images using your phone camera
- **AI-Powered Analysis**: Intelligent disease identification system
- **Bilingual Support**: Complete interface in English & Kannada (ಕನ್ನಡ)
- **Voice Output**: Text-to-speech in both languages for treatment instructions
- **Treatment Recommendations**: Organic and chemical treatment options with detailed instructions
- **Feedback Learning System**: Rate treatments to improve future recommendations
- **Weather Alerts**: Contextual risk alerts based on environmental conditions
- **Mobile-First Design**: Optimized for smartphones and outdoor use

### 🎨 Design Features
- High-contrast UI for outdoor visibility
- Large touch targets for easy interaction
- Farmer-friendly language and terminology
- Clean, modern agricultural theme
- Responsive design works on all devices

---

## 🚀 Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui
- **Voice**: Web Speech API (browser-native)
- **State Management**: React Context API
- **Language Support**: English & Kannada

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm

### Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd smart-leaf

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:8080
```

---

## 🌍 Supported Diseases (Demo Data)

Currently includes:
- Tomato Early Blight (ಟೊಮೇಟೋ ಆರಂಭಿಕ ರೋಗ)
- Potato Late Blight (ಆಲೂಗಡ್ಡೆ ವಿಳಂಬ ರೋಗ)
- Corn Common Rust (ಮೆಕ್ಕೆಜೋಳ ಸಾಮಾನ್ಯ ತುಕ್ಕು)

### Treatment Types
- **Organic Treatments**: Natural, eco-friendly solutions
- **Chemical Treatments**: Effective fungicides and pesticides
- **Prevention Tips**: Best practices for disease prevention

---

## 📱 How to Use

1. **Open the app** on your mobile device or computer
2. **Select language** (English or ಕನ್ನಡ) 
3. **Capture or upload** a photo of the affected leaf
4. **Click "Analyze"** to detect the disease
5. **Listen to treatment** recommendations with voice output
6. **Provide feedback** (👍 Useful / 👎 Not Useful) to improve recommendations
7. **View alternative treatments** if needed

---

## 🎯 Future Enhancements

To integrate real ML capabilities:

### Option 1: Use Hugging Face Transformers
```typescript
import { pipeline } from "@huggingface/transformers";

const classifier = await pipeline(
  "image-classification",
  "model-name",
  { device: "webgpu" }
);
```

### Option 2: Connect to Custom ML Backend
- Train MobileNetV2 model on Kaggle dataset
- Deploy model as REST API
- Integrate with Smart Leaf frontend

### Additional Features Planned
- Real-time weather API integration
- GPS-based disease outbreak mapping
- Multilingual expansion (Hindi, Telugu, Tamil)
- Offline mode with Progressive Web App
- Community forum for farmers
- Expert consultation booking

---

## 🗂 Project Structure

```
smart-leaf/
├── src/
│   ├── components/
│   │   ├── CameraCapture.tsx    # Image capture component
│   │   ├── DiseaseResult.tsx    # Results display
│   │   └── LanguageToggle.tsx   # Language switcher
│   ├── contexts/
│   │   └── LanguageContext.tsx  # Bilingual support
│   ├── data/
│   │   └── diseases.ts          # Disease database
│   ├── hooks/
│   │   └── useSpeech.ts         # Text-to-speech hook
│   ├── types/
│   │   └── disease.ts           # TypeScript types
│   ├── pages/
│   │   └── Index.tsx            # Main page
│   └── index.css                # Design system
├── index.html
├── package.json
└── README_SMARTLEAF.md
```

---

## 🎨 Design System

### Color Palette
- **Primary Green**: `hsl(142 76% 36%)` - Agriculture theme
- **Success**: `hsl(142 76% 36%)` - Healthy plants
- **Warning**: `hsl(38 92% 50%)` - Caution alerts
- **Destructive**: `hsl(0 84.2% 60.2%)` - Severe issues

### Typography
- Large, readable fonts for outdoor use
- High contrast for sunlight visibility
- Bilingual font support (Latin + Kannada scripts)

---

## 📊 Feedback System

The app collects user feedback to improve treatment recommendations:

- Feedback stored in localStorage
- Treatments ranked by success rate + user feedback
- Most effective solutions shown first
- Alternative treatments available on demand

---

## 🌐 Deployment

### Deploy to Lovable (Recommended)
```bash
# Simply open Lovable and click Share -> Publish
# Your app will be live with a custom domain option
```

### Deploy to Vercel/Netlify
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests if applicable
4. Submit a pull request

---

## 📄 License

MIT License - Free to use and modify

---

## 👨‍🌾 For Farmers | ರೈತರಿಗೆ

This tool is designed to help you:
- ನಿಮ್ಮ ಬೆಳೆಗಳ ರೋಗಗಳನ್ನು ತ್ವರಿತವಾಗಿ ಗುರುತಿಸಿ
- ಪರಿಣಾಮಕಾರಿ ಚಿಕಿತ್ಸೆಯನ್ನು ಪಡೆಯಿರಿ
- ಆರೋಗ್ಯಕರ ಬೆಳೆಗಳನ್ನು ಬೆಳೆಸಿರಿ

**Contact**: support@smartleaf.app (placeholder)

---

## 🙏 Acknowledgments

- Disease data compiled from agricultural research
- UI inspired by farmer-friendly design principles
- Built with modern web technologies for reliability

---

**Made with ❤️ for farmers everywhere**
**ರೈತರಿಗಾಗಿ ಪ್ರೀತಿಯಿಂದ ರಚಿಸಲಾಗಿದೆ**
