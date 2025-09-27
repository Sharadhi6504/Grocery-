class SmartGroceryManager {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('groceryItems')) || [];
        this.commonItems = [
            { name: 'Milk', category: 'dairy' },
            { name: 'Bread', category: 'grains' },
            { name: 'Eggs', category: 'dairy' },
            { name: 'Bananas', category: 'fruits' },
            { name: 'Apples', category: 'fruits' },
            { name: 'Chicken Breast', category: 'meat' },
            { name: 'Rice', category: 'grains' },
            { name: 'Tomatoes', category: 'vegetables' },
            { name: 'Onions', category: 'vegetables' },
            { name: 'Cheese', category: 'dairy' },
            { name: 'Yogurt', category: 'dairy' },
            { name: 'Carrots', category: 'vegetables' },
            { name: 'Potatoes', category: 'vegetables' },
            { name: 'Orange Juice', category: 'beverages' },
            { name: 'Pasta', category: 'grains' },
            { name: 'Ground Beef', category: 'meat' },
            { name: 'Lettuce', category: 'vegetables' },
            { name: 'Butter', category: 'dairy' },
            { name: 'Cereal', category: 'grains' },
            { name: 'Toilet Paper', category: 'household' }
        ];
        
        this.initializeEventListeners();
        this.render();
        this.updateStats();
    }

    initializeEventListeners() {
        // Add item
        document.getElementById('addItemBtn').addEventListener('click', () => this.addItem());
        document.getElementById('itemInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addItem();
        });

        // Smart suggestions on input
        document.getElementById('itemInput').addEventListener('input', (e) => this.showSuggestions(e.target.value));

        // Filter and sort
        document.getElementById('filterCategory').addEventListener('change', () => this.render());
        document.getElementById('sortBy').addEventListener('change', () => this.render());

        // Quick actions
        document.getElementById('clearCompleted').addEventListener('click', () => this.clearCompleted());
        document.getElementById('addCommonItems').addEventListener('click', () => this.showCommonItemsModal());
        document.getElementById('exportList').addEventListener('click', () => this.exportList());
        document.getElementById('clearAll').addEventListener('click', () => this.clearAll());
    }

    addItem() {
        const nameInput = document.getElementById('itemInput');
        const categorySelect = document.getElementById('categorySelect');
        const quantityInput = document.getElementById('quantityInput');

        const name = nameInput.value.trim();
        const category = categorySelect.value || 'other';
        const quantity = parseInt(quantityInput.value) || 1;

        if (!name) {
            this.showNotification('Please enter an item name', 'error');
            return;
        }

        // Check for duplicates
        const existingItem = this.items.find(item => 
            item.name.toLowerCase() === name.toLowerCase() && !item.completed
        );

        if (existingItem) {
            existingItem.quantity += quantity;
            this.showNotification(`Updated quantity for ${name}`, 'success');
        } else {
            const newItem = {
                id: Date.now(),
                name: name,
                category: category,
                quantity: quantity,
                completed: false,
                dateAdded: new Date().toISOString()
            };

            this.items.push(newItem);
            this.showNotification(`Added ${name} to your list`, 'success');
        }

        // Clear inputs
        nameInput.value = '';
        categorySelect.value = '';
        quantityInput.value = '1';
        
        // Clear suggestions
        document.getElementById('suggestions').innerHTML = '';

        this.saveToLocalStorage();
        this.render();
        this.updateStats();
    }

    toggleItem(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.completed = !item.completed;
            item.completedDate = item.completed ? new Date().toISOString() : null;
            this.saveToLocalStorage();
            this.render();
            this.updateStats();
        }
    }

    deleteItem(id) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.items = this.items.filter(item => item.id !== id);
            this.saveToLocalStorage();
            this.render();
            this.updateStats();
            this.showNotification('Item deleted', 'success');
        }
    }

    editItem(id) {
        const item = this.items.find(item => item.id === id);
        if (!item) return;

        const newName = prompt('Edit item name:', item.name);
        const newQuantity = prompt('Edit quantity:', item.quantity);

        if (newName && newName.trim()) {
            item.name = newName.trim();
        }
        
        if (newQuantity && !isNaN(parseInt(newQuantity))) {
            item.quantity = parseInt(newQuantity);
        }

        this.saveToLocalStorage();
        this.render();
        this.showNotification('Item updated', 'success');
    }

    showSuggestions(input) {
        const suggestionsContainer = document.getElementById('suggestions');
        
        if (input.length < 2) {
            suggestionsContainer.innerHTML = '';
            return;
        }

        const suggestions = this.commonItems
            .filter(item => 
                item.name.toLowerCase().includes(input.toLowerCase()) &&
                !this.items.some(existingItem => 
                    existingItem.name.toLowerCase() === item.name.toLowerCase() && 
                    !existingItem.completed
                )
            )
            .slice(0, 5);

        if (suggestions.length === 0) {
            suggestionsContainer.innerHTML = '';
            return;
        }

        suggestionsContainer.innerHTML = suggestions
            .map(item => `
                <div class="suggestion-item" onclick="groceryManager.selectSuggestion('${item.name}', '${item.category}')">
                    ${item.name}
                </div>
            `).join('');
    }

    selectSuggestion(name, category) {
        document.getElementById('itemInput').value = name;
        document.getElementById('categorySelect').value = category;
        document.getElementById('suggestions').innerHTML = '';
    }

    render() {
        const listContainer = document.getElementById('shoppingList');
        const emptyState = document.getElementById('emptyState');
        const filterCategory = document.getElementById('filterCategory').value;
        const sortBy = document.getElementById('sortBy').value;

        let filteredItems = this.items;

        // Filter by category
        if (filterCategory) {
            filteredItems = filteredItems.filter(item => item.category === filterCategory);
        }

        // Sort items
        filteredItems.sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortBy === 'category') {
                return a.category.localeCompare(b.category);
            } else if (sortBy === 'date') {
                return new Date(b.dateAdded) - new Date(a.dateAdded);
            }
            return 0;
        });

        // Separate completed and pending items
        const pendingItems = filteredItems.filter(item => !item.completed);
        const completedItems = filteredItems.filter(item => item.completed);

        if (filteredItems.length === 0) {
            emptyState.style.display = 'block';
            listContainer.innerHTML = '<div class="empty-state" id="emptyState"><i class="fas fa-shopping-basket"></i><h3>No items found</h3><p>Try adjusting your filters or add some items!</p></div>';
            return;
        }

        emptyState.style.display = 'none';
        
        const itemsHTML = [...pendingItems, ...completedItems]
            .map(item => this.createItemHTML(item))
            .join('');

        listContainer.innerHTML = itemsHTML;
    }

    createItemHTML(item) {
        const categoryEmoji = {
            fruits: '🍎',
            vegetables: '🥕',
            dairy: '🥛',
            meat: '🥩',
            grains: '🌾',
            snacks: '🍿',
            beverages: '🥤',
            household: '🧽',
            other: '📦'
        };

        const formattedDate = new Date(item.dateAdded).toLocaleDateString();

        return `
            <div class="shopping-item ${item.completed ? 'completed' : ''}" data-id="${item.id}">
                <input type="checkbox" ${item.completed ? 'checked' : ''} 
                       onchange="groceryManager.toggleItem(${item.id})">
                
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-category category-${item.category}">
                        ${categoryEmoji[item.category] || '📦'} ${item.category}
                    </div>
                    <div class="item-quantity">Qty: ${item.quantity}</div>
                    <div class="item-date">Added: ${formattedDate}</div>
                </div>
                
                <div class="item-actions">
                    <button class="edit-btn" onclick="groceryManager.editItem(${item.id})" title="Edit item">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="groceryManager.deleteItem(${item.id})" title="Delete item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    updateStats() {
        const totalItems = this.items.length;
        const completedItems = this.items.filter(item => item.completed).length;
        const categories = [...new Set(this.items.map(item => item.category))].length;

        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('completedItems').textContent = completedItems;
        document.getElementById('categoriesCount').textContent = categories;
    }

    clearCompleted() {
        const completedItems = this.items.filter(item => item.completed);
        if (completedItems.length === 0) {
            this.showNotification('No completed items to clear', 'info');
            return;
        }

        if (confirm(`Are you sure you want to delete ${completedItems.length} completed items?`)) {
            this.items = this.items.filter(item => !item.completed);
            this.saveToLocalStorage();
            this.render();
            this.updateStats();
            this.showNotification(`Cleared ${completedItems.length} completed items`, 'success');
        }
    }

    showCommonItemsModal() {
        const commonItemsNotInList = this.commonItems.filter(commonItem =>
            !this.items.some(item => 
                item.name.toLowerCase() === commonItem.name.toLowerCase() && 
                !item.completed
            )
        );

        if (commonItemsNotInList.length === 0) {
            this.showNotification('All common items are already in your list!', 'info');
            return;
        }

        const selectedItems = [];
        const itemsHTML = commonItemsNotInList
            .map(item => `
                <label style="display: block; margin: 10px 0; cursor: pointer;">
                    <input type="checkbox" value="${item.name}" data-category="${item.category}" style="margin-right: 10px;">
                    ${item.name} (${item.category})
                </label>
            `).join('');

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.5); display: flex; align-items: center; 
            justify-content: center; z-index: 1000;
        `;

        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; max-height: 80vh; overflow-y: auto;">
                <h3 style="margin-bottom: 20px;">Add Common Items</h3>
                <div id="commonItemsList">${itemsHTML}</div>
                <div style="margin-top: 20px; text-align: right;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            style="margin-right: 10px; padding: 10px 20px; background: #ccc; border: none; border-radius: 5px; cursor: pointer;">
                        Cancel
                    </button>
                    <button onclick="groceryManager.addSelectedCommonItems(this)" 
                            style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Add Selected
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    addSelectedCommonItems(button) {
        const modal = button.closest('div').parentElement.parentElement;
        const checkboxes = modal.querySelectorAll('input[type="checkbox"]:checked');
        
        let addedCount = 0;
        checkboxes.forEach(checkbox => {
            const newItem = {
                id: Date.now() + Math.random(),
                name: checkbox.value,
                category: checkbox.dataset.category,
                quantity: 1,
                completed: false,
                dateAdded: new Date().toISOString()
            };
            this.items.push(newItem);
            addedCount++;
        });

        if (addedCount > 0) {
            this.saveToLocalStorage();
            this.render();
            this.updateStats();
            this.showNotification(`Added ${addedCount} items to your list`, 'success');
        }

        modal.remove();
    }

    exportList() {
        const activeItems = this.items.filter(item => !item.completed);
        
        if (activeItems.length === 0) {
            this.showNotification('No items to export', 'info');
            return;
        }

        const exportText = activeItems
            .map(item => `${item.name} (${item.quantity}) - ${item.category}`)
            .join('\n');

        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `grocery-list-${new Date().toDateString()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('List exported successfully!', 'success');
    }

    clearAll() {
        if (this.items.length === 0) {
            this.showNotification('List is already empty', 'info');
            return;
        }

        if (confirm('Are you sure you want to clear all items? This cannot be undone.')) {
            this.items = [];
            this.saveToLocalStorage();
            this.render();
            this.updateStats();
            this.showNotification('All items cleared', 'success');
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('groceryItems', JSON.stringify(this.items));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 15px 20px;
            border-radius: 8px; color: white; font-weight: 500; z-index: 1000;
            animation: slideInRight 0.3s ease-out; max-width: 300px;
        `;

        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };

        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the app when the page loads
let groceryManager;
document.addEventListener('DOMContentLoaded', () => {
    groceryManager = new SmartGroceryManager();
});