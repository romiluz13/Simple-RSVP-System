# Hadassa & Oscar RSVP 💝

A beautiful and elegant RSVP application to celebrate the eternal love of Hadassa (92) and Oscar (94).

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- 🎨 Modern and elegant design with warm gradients and subtle animations
- 📝 Simple RSVP form with real-time validation
- 💾 MongoDB integration for secure RSVP storage
- 📱 Fully responsive design for all devices
- 🌙 Dark mode optimized
- 📊 Admin panel for viewing statistics and RSVPs
- 📧 Automatic confirmation email sending

## 🚀 Installation & Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update MongoDB connection details
   - Set event details (date, time, location)
   - Configure SendGrid for email sending

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email

# Event Details
NEXT_PUBLIC_EVENT_DATE="28/02/2025"
NEXT_PUBLIC_EVENT_TIME="13:00"
NEXT_PUBLIC_VENUE_NAME="Greco Taverna North TLV"
NEXT_PUBLIC_VENUE_ADDRESS="25 Grinberg St. Tel Aviv"
```

## 💻 Tech Stack

- Next.js 14
- React 18
- MongoDB
- Tailwind CSS
- TypeScript
- SendGrid

## 🛠️ Development

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run linting
- `npm run format` - Format code

## 📄 License

MIT License - Feel free to use this code for your own celebration!
