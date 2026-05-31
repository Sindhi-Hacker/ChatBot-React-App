# Aura AI Enterprise ChatBot — React Native Expo Codebase

This folder contains the **production-ready structural React Native Expo (SDK 51+) source files** corresponding to the Aura AI mobile interface. You can copy these files directly into an Expo Router environment to compile the application as native Android, iOS, and Web outputs.

## Directory Structure

```text
aura-mobile/
├── package.json
├── App.tsx
├── tsconfig.json
├── app/
│   ├── _layout.tsx           # Entry-point layout, provider orchestration
│   ├── index.tsx             # Onboarding flow
│   ├── auth/
│   │   └── index.tsx         # OAuth, biometric, and credentials form
│   └── (drawer)/             # Premium React Navigation drawer structure
│       ├── _layout.tsx       # Custom layout, sidebar, user profiles
│       ├── index.tsx         # Dashboard core (stats, charts, summaries)
│       ├── chat.tsx          # Real-time Markdown chat, text-to-speech
│       ├── image-gen.tsx     # Image prompt board
│       ├── models.tsx        # LLM selectors and token allocation
│       └── settings.tsx      # Multi-language, biometric, theme toggles
└── components/
    ├── AdaptiveCard.tsx      # Responsive visual bento boxes
    ├── HapticButton.tsx      # Premium feedback wrapping
    └── MarkdownText.tsx      # Native custom line parsers
```

## Setup & Running Natively

1. **Initialize Expo project:**
   ```bash
   npx create-expo-app aura-mobile --template blank-typescript
   cd aura-mobile
   ```

2. **Install core enterprise navigation and state libraries:**
   ```bash
   npx expo install @react-navigation/drawer react-native-gesture-handler react-native-reanimated zustand expo-secure-store expo-speech expo-router expo-haptics
   ```

3. **Deploy these source files** directly into the folders and run:
   ```bash
   npx expo start
   ```

*Check files in this `/src/expo-code/` directory to inspect core production components.*
