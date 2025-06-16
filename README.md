# Chicktopia - Web-Based Chicken Game

## Project Overview
Chicktopia is a delightful web-based chicken raising game featuring an innovative "Earthen Claymorphism" design aesthetic. The game allows players to hatch, raise, and care for virtual chickens in a soft, tactile, clay-like visual environment.

## Design Philosophy: Earthen Claymorphism
The entire UI follows the "Earthen Claymorphism" design philosophy, characterized by:
- Soft, sandy beige color palette (#F6E5C7 background)
- 3D clay-like appearance with realistic shadows and depth
- Rounded, organic shapes that feel tactile and touchable
- Smooth animations and transitions using Framer Motion
- Warm, earthy tones with subtle gradients

## Technology Stack
- **Framework:** React 18 with Vite
- **Styling:** CSS3 with advanced shadow techniques
- **Animations:** Framer Motion for physics-based animations
- **Icons:** React Icons for consistent iconography
- **Font:** Nunito (Google Fonts) for soft, rounded typography

## Project Structure

### Core Components

#### 1. TopNav.jsx
- Fixed navigation bar with claymorphic styling
- Contains logo, ChickCoin balance, navigation links, and menu
- Implements subtle shadows for depth

#### 2. FeatureCard.jsx
- Reusable card component for main game features
- Horizontal scrollable container
- Hover animations with lift and scale effects
- Three main cards: Incubator, Tasks, Gacha Machine

#### 3. ChickenGrid.jsx & ChickenCard.jsx
- Main content area displaying player's chickens
- Responsive grid layout
- Individual chicken cards with status indicators
- Click interaction to open details panel

#### 4. DetailsPanel.jsx
- Sliding side panel for chicken details
- Smooth slide-in animation from right
- Contains chicken info and action buttons
- Overlay design with backdrop blur

#### 5. BottomBar.jsx
- Floating action bar at bottom of screen
- Semi-transparent with backdrop filter
- Five primary action buttons: Feed, Train, Collect Egg, Market, Layout Preview

## Color Palette
- **Primary Background:** #F6E5C7 (Sandy Beige)
- **Card Base:** #D3C4B3 (Warm Light Brown)
- **Accent Colors:** Warm earth tones
- **Shadows:** Soft, realistic clay-like shadows

## Page Layout Structure

### Header Section
- Logo and branding
- Currency display (ChickCoin)
- Navigation menu
- User profile access

### Quick Access Features
- Horizontal scrolling card container
- Primary game features (Incubator, Tasks, Gacha)
- Prominent call-to-action styling

### Main Content Area
- "My Chickens" section title
- Responsive grid of chicken cards
- Status indicators and level information
- Interactive hover effects

### Action Bar
- Fixed bottom positioning
- Primary game actions
- Easy thumb-reach design for mobile

## Responsive Design
- Mobile-first approach
- Flexible grid layouts using CSS Grid and Flexbox
- Smooth scaling across device sizes
- Touch-friendly interaction areas

## Animation System
All animations use Framer Motion for:
- Smooth hover effects on cards
- Sliding panel transitions
- Scale and lift interactions
- Physics-based motion curves

## Development Guidelines

### Code Standards
- Each component has detailed English comments
- Semantic HTML5 structure
- W3C compliant markup
- Modular CSS organization
- Consistent naming conventions

### Performance Optimizations
- Optimized image loading
- Efficient CSS with minimal redundancy
- Component-based architecture for reusability
- Lazy loading for better performance

## Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Game Features (Current Implementation)

### Chicken Management
- View all owned chickens in a grid layout
- Individual chicken status tracking (Hungry, Normal, Egg Ready)
- Level progression system
- Quick action access

### Economy System
- ChickCoin currency display
- Market integration preparation
- Gacha system foundation

### Task System
- Daily and weekly task tracking
- Progress indicators
- Reward system preparation

## Future Enhancements
- Advanced chicken breeding mechanics
- Expanded customization options
- Multiplayer features
- Achievement system
- Enhanced animations and effects

## Browser Compatibility
Optimized for all modern browsers including:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

*This project demonstrates modern web development practices with a focus on user experience, visual design, and maintainable code architecture.*
