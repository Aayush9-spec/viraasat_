# Viraasat Connect

Welcome to **Viraasat Connect**, an AI-powered e-commerce platform designed to connect local artisans with a global digital audience. This application showcases a modern, feature-rich marketplace experience built with Next.js, Genkit for AI, and ShadCN for UI components.

## ✨ Key Features

Viraasat Connect is packed with innovative features for both buyers and artisans, demonstrating a blend of traditional craftsmanship and modern technology.

### For Buyers
- **Dynamic Marketplace**: Explore handcrafted goods with advanced search, filtering, and AI-powered product insights.
- **AI Gifting Concierge**: Get personalized gift suggestions based on recipient, occasion, and taste.
- **AI Room Stylist**: Upload a photo of your room and see it reimagined with artisanal products.
- **Heirloom Ledger**: A digital provenance tracker that tells the story of your purchased item, from the artisan's hands to your home.
- **Patron's Commission**: Collaborate directly with artisans to create bespoke, one-of-a-kind pieces.
- **Live Showcase**: Join real-time events with artisans, watch live demonstrations, and purchase exclusive items.
- **Multi-language Support**: Browse the app in English, Hindi, Tamil, Bengali, and Telugu.
- **Featherlight Mode**: An optional low-data mode for users on slower network connections.

### For Artisans
- **Dedicated Dashboard**: Manage products, view orders, and track customer information.
- **AI-Powered Product Creation**:
  - **Voice-to-Description**: Describe your product with your voice and have AI generate compelling marketing copy.
  - **Image Enhancer**: Upload product photos and use AI to automatically improve their quality.
- **My Story**: A dedicated space to share your journey, craft, and inspiration with customers.

## 🚀 Getting Started

This is a Next.js project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### Running the Development Server

1.  First, install the dependencies:
    ```bash
    npm install
    ```

2.  Then, run the development server:
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

### Running Genkit (AI Flows)

To run the AI flows locally for development and testing, use the Genkit development server:

```bash
npm run genkit:dev
```

This will start the Genkit development UI, typically on [http://localhost:4000](http://localhost:4000), where you can inspect and run your AI flows.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit)
- **UI Components**: [ShadCN](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Internationalization**: `next-intl`
- **Form Management**: `react-hook-form`
- **Schema Validation**: `zod`
