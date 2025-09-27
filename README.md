# Smart Grocery Manager

A modern, responsive web application for managing your grocery shopping lists with smart features and an intuitive user interface.

## Features

### 🛒 Core Functionality
- **Add Items**: Easily add grocery items with categories and quantities
- **Smart Suggestions**: Get intelligent suggestions as you type based on common grocery items
- **Categories**: Organize items into categories (Fruits, Vegetables, Dairy, Meat, etc.)
- **Mark Complete**: Check off items as you shop
- **Edit Items**: Modify item names and quantities
- **Delete Items**: Remove unwanted items

### 📊 Smart Management
- **Statistics Dashboard**: View total items, completed items, and active categories
- **Filter by Category**: View items from specific categories only
- **Sort Options**: Sort by name, category, or date added
- **Clear Completed**: Remove all checked items at once

### ⚡ Quick Actions
- **Add Common Items**: Bulk add frequently purchased items
- **Export List**: Download your shopping list as a text file
- **Clear All**: Start fresh with an empty list

### 💾 Data Persistence
- **Local Storage**: Your lists are automatically saved in your browser
- **Session Recovery**: Your data persists between browser sessions

### 📱 Responsive Design
- **Mobile Friendly**: Optimized for phones, tablets, and desktop
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Accessibility**: Keyboard navigation and screen reader friendly

## How to Use

### Getting Started
1. Open `index.html` in your web browser
2. Start adding items to your grocery list
3. Your data will be automatically saved

### Adding Items
1. Type the item name in the input field
2. Select a category from the dropdown (optional)
3. Set the quantity (defaults to 1)
4. Click the "+" button or press Enter

### Smart Suggestions
- As you type, the app will suggest common grocery items
- Click on any suggestion to quickly add it to your list

### Managing Your List
- **Check items off** by clicking the checkbox when shopping
- **Edit items** by clicking the edit icon
- **Delete items** by clicking the trash icon
- **Filter** by category using the dropdown
- **Sort** your list by name, category, or date added

### Quick Actions
- **Add Common Items**: Click to see a list of frequently purchased items you can bulk add
- **Export List**: Download your current shopping list as a text file
- **Clear Completed**: Remove all checked-off items
- **Clear All**: Start with a fresh, empty list

## Technical Details

### Files Structure
```
├── index.html      # Main HTML file
├── styles.css      # CSS styling and responsive design
├── script.js       # JavaScript functionality
└── README.md       # This documentation
```

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

### Local Storage
The app uses browser localStorage to persist your data. Your grocery lists will be saved automatically and restored when you return to the app.

## Customization

### Adding New Categories
To add new categories, modify the category options in both `index.html` and update the corresponding emoji mappings in `script.js`.

### Modifying Common Items
Edit the `commonItems` array in `script.js` to customize the smart suggestions.

### Styling
Modify `styles.css` to change colors, fonts, layout, or add new themes.

## Tips for Best Use

1. **Use Categories**: Organize items by store sections for efficient shopping
2. **Smart Suggestions**: Start typing common items for quick suggestions
3. **Export Lists**: Save lists for recurring shopping trips
4. **Mobile Use**: The app works great on mobile devices for shopping
5. **Bulk Adding**: Use "Add Common Items" to quickly build your list

## Browser Compatibility

This app works in all modern browsers and uses:
- HTML5 for structure
- CSS3 for styling and animations
- Vanilla JavaScript (ES6+) for functionality
- localStorage for data persistence

No external dependencies or internet connection required after initial load!

## Development

To modify or extend the application:

1. **HTML**: Edit `index.html` for structure changes
2. **Styling**: Modify `styles.css` for appearance changes
3. **Functionality**: Update `script.js` for new features

The code is well-commented and modular for easy customization.

---

Enjoy your smart grocery shopping experience! 🛒✨