# 🎓 Campus Vibe - Campus Social Platform

A modern, interactive social platform designed for college students to connect, share knowledge, and stay updated with campus activities.

## ✨ Features

### 🗨️ **Discussions & Forums**

- **Create Discussions**: Start conversations on various topics
- **Categories**: Academic, Tech, General, Help, Announcements
- **Search & Filter**: Real-time search with highlighting
- **Voting System**: Upvote/downvote discussions
- **Comments**: Add and manage replies to discussions
- **Tags**: Organize content with custom tags
- **Delete Functionality**: Remove discussions with confirmation

### 📅 **Events Management**

- **Upcoming Events**: View events in the next 30 days
- **Event Registration**: Register/unregister for events
- **Capacity Management**: Track event attendance
- **Categories**: Workshops, Seminars, Fests, Competitions, Hackathons
- **Real-time Updates**: Automatic event list refresh

### 🏛️ **Campus Clubs**

- **Club Information**: Detailed club descriptions and activities
- **Member Counts**: Track club membership
- **Contact Details**: Email and social media links
- **Upcoming Activities**: See what's planned

### 🔍 **Advanced Search & Filtering**

- **Real-time Search**: Instant results as you type
- **Multi-field Search**: Search titles, content, and tags
- **Category Filtering**: Filter by discussion categories
- **Sorting Options**: Sort by recent or popular
- **Search Highlighting**: Matched terms are highlighted
- **Clear Filters**: Easy reset of all search parameters

### 🎨 **Modern UI/UX**

- **Responsive Design**: Works on all devices
- **Dark/Light Mode**: Built-in theme support
- **Smooth Animations**: Engaging user experience
- **Toast Notifications**: User feedback for actions
- **Interactive Elements**: Hover effects and transitions

## 🛠️ **Technologies Used**

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite (Fast development and building)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: LocalStorage for data persistence
- **Icons**: Lucide React (Modern icon library)
- **Development**: Hot reload, TypeScript compilation

## 🚀 **Getting Started**

### **Prerequisites**

- Node.js (version 16 or higher)
- npm or yarn package manager

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/SuyashGargote/campus-vibe-47.git
   cd campus-vibe-47
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:8080/` (or the port shown in terminal)
   - The app will automatically reload when you make changes

### **Available Scripts**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 **How to Use**

### **Discussions**

1. **Create a Discussion**: Click "New Discussion" button
2. **Fill Details**: Add title, content, category, and tags
3. **Post**: Submit your discussion
4. **Interact**: Vote, comment, and engage with others
5. **Search**: Use the search bar to find specific topics
6. **Filter**: Use category and sorting options

### **Events**

1. **View Events**: See upcoming events on the Events page
2. **Create Events**: Add new campus events with details
3. **Register**: Click "Register" to join events
4. **Track**: Monitor event capacity and attendance

### **Clubs**

1. **Browse Clubs**: View all available campus clubs
2. **Join**: Connect with clubs that interest you
3. **Stay Updated**: Check upcoming club activities

## 🏗️ **Project Structure**

```
campus-vibe-47/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── layout/         # Layout components
│   │   └── cards/          # Card components
│   ├── pages/              # Main application pages
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── Discussions.tsx # Discussions page
│   │   ├── Events.tsx      # Events management
│   │   ├── Clubs.tsx       # Campus clubs
│   │   └── NotFound.tsx    # 404 page
│   ├── lib/                # Utility functions
│   │   ├── storage.ts      # Data storage functions
│   │   └── types.ts        # TypeScript type definitions
│   ├── hooks/              # Custom React hooks
│   ├── assets/             # Static assets
│   └── index.css           # Global styles
├── public/                 # Public assets
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## 🔧 **Configuration**

### **Tailwind CSS**

The project uses Tailwind CSS for styling. Configuration can be found in `tailwind.config.ts`.

### **TypeScript**

TypeScript configuration is in `tsconfig.json` with strict type checking enabled.

### **Vite**

Vite configuration is in `vite.config.ts` with React plugin and hot reload enabled.

## 📊 **Data Management**

- **Local Storage**: All data is stored in browser's localStorage
- **Sample Data**: Pre-loaded with sample discussions, events, and clubs
- **Data Persistence**: Data persists between browser sessions
- **Real-time Updates**: Immediate UI updates for all actions

## 🎯 **Key Features Explained**

### **Search Functionality**

- **Real-time Search**: Updates results as you type
- **Multi-field Search**: Searches across titles, content, and tags
- **Highlighting**: Matched search terms are highlighted
- **Smart Filtering**: Combines search with category filters

### **Event System**

- **Automatic Filtering**: Only shows upcoming events
- **Registration Management**: Track user registrations
- **Capacity Control**: Prevent over-registration
- **Real-time Updates**: Immediate attendance updates

### **Discussion Management**

- **Voting System**: Upvote/downvote with user tracking
- **Comment System**: Nested replies to discussions
- **Moderation**: Delete discussions and comments
- **User Interactions**: Track user engagement

## 🚀 **Deployment**

### **Build for Production**

```bash
npm run build
```

### **Preview Production Build**

```bash
npm run preview
```

### **Deploy to Vercel/Netlify**

1. Build the project: `npm run build`
2. Upload the `dist` folder to your hosting platform
3. Configure routing for SPA (Single Page Application)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m 'Add feature'`
5. Push: `git push origin feature-name`
6. Submit a pull request

## 📝 **License**

This project is open source and available under the [MIT License](LICENSE).

## 🆘 **Support**

If you encounter any issues:

1. Check the console for error messages
2. Ensure all dependencies are installed
3. Try refreshing the page
4. Check browser compatibility

## 🔮 **Future Enhancements**

- [ ] User authentication and profiles
- [ ] Real-time notifications
- [ ] Mobile app development
- [ ] Database integration
- [ ] Social media sharing
- [ ] Advanced analytics
- [ ] Admin dashboard
- [ ] Email notifications

## 📞 **Contact**

- **Developer**: Suyash Gargote
- **GitHub**: [@SuyashGargote](https://github.com/SuyashGargote)
- **Project**: [Campus Vibe](https://github.com/SuyashGargote/campus-vibe-47)

---

**Made with ❤️ for the campus community**

_This project demonstrates modern web development practices with React, TypeScript, and Tailwind CSS._
