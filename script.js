// Global variables
let clients = [];
let currentClientId = null;
let snippets = [];

// DOM elements
let clientList;
let searchInput;
let newClientBtn;
let newClientForm;
let newClientSection;
let clientDetailsSection;
let clientName;
let clientPhone;
let clientEmail;
let clientAddress;
let clientNotepad;
let notepadTextarea;
let expandNotepadBtn;
let expenseList;
let addExpenseForm;
let backToList;
let exportBtn;
let exportClientBtn;
let exportDbBtn;
let deleteModal;
let confirmDelete;
let cancelDelete;
let snippetsModal;
let manageSnippetsBtn;
let saveSnippetBtn;
let closeSnippetsModal;
let snippetsList;
let snippetSearch;
let cancelNewClient;
let iniciBtn;
let vendesBtn;
let vendesSection;
let vendesList;
let searchVendesInput;
let exportModal;
let exportStartDate;
let exportEndDate;
let confirmExport;
let cancelExport;

// Helper function to get current date in YYYY-MM-DD format
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Helper function to format date to DD-MM-YYYY
function formatDate(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}

// Helper function to normalize string for search (remove accents and lowercase)
function normalizeString(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Helper function to get the next available ascending ID
function getNextClientId() {
    if (clients.length === 0) {
        return 1;
    }

    const existingIds = clients.map(client => client.id).sort((a, b) => a - b);
    let nextId = 1;

    for (const id of existingIds) {
        if (id === nextId) {
            nextId++;
        } else if (id > nextId) {
            break;
        }
    }

    return nextId;
}

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize DOM elements
    clientList = document.getElementById('clientList');
    searchInput = document.getElementById('searchInput');
    newClientBtn = document.getElementById('newClientBtn');
    newClientForm = document.getElementById('newClientForm');
    newClientSection = document.getElementById('newClientSection');
    clientDetailsSection = document.getElementById('clientDetailsSection');
    clientName = document.getElementById('clientName');
    clientPhone = document.getElementById('clientPhone');
    clientEmail = document.getElementById('clientEmail');
    clientAddress = document.getElementById('clientAddress');
    clientNotepad = document.getElementById('clientNotepad');
    notepadTextarea = document.getElementById('notepadTextarea');
    expandNotepadBtn = document.getElementById('expandNotepadBtn');
    expenseList = document.getElementById('expenseList');
    addExpenseForm = document.getElementById('addExpenseForm');
    backToList = document.getElementById('backToList');
    exportBtn = document.getElementById('exportBtn');
    exportClientBtn = document.getElementById('exportClientBtn');
    exportDbBtn = document.getElementById('exportDbBtn');
    deleteModal = document.getElementById('deleteModal');
    confirmDelete = document.getElementById('confirmDelete');
    cancelDelete = document.getElementById('cancelDelete');
    snippetsModal = document.getElementById('snippetsModal');
    manageSnippetsBtn = document.getElementById('manageSnippetsBtn');
    saveSnippetBtn = document.getElementById('saveSnippetBtn');
    closeSnippetsModal = document.getElementById('closeSnippetsModal');
    snippetsList = document.getElementById('snippetsList');
    snippetSearch = document.getElementById('snippetSearch');
    cancelNewClient = document.getElementById('cancelNewClient');
    iniciBtn = document.getElementById('iniciBtn');
    vendesBtn = document.getElementById('vendesBtn');
    vendesSection = document.getElementById('vendesSection');
    vendesList = document.getElementById('vendesList');
    searchVendesInput = document.getElementById('searchVendesInput');
    exportModal = document.getElementById('exportModal');
    exportStartDate = document.getElementById('exportStartDate');
    exportEndDate = document.getElementById('exportEndDate');
    confirmExport = document.getElementById('confirmExport');
    cancelExport = document.getElementById('cancelExport');

    await loadClients();
    await loadSnippets();
    // Ensure modals are hidden on load
    hideSnippetsModal();
    hideDeleteModal();

    iniciBtn.addEventListener('click', showClientList);
    vendesBtn.addEventListener('click', showVendes);
    newClientBtn.addEventListener('click', showNewClientForm);
    newClientForm.addEventListener('submit', addClient);
    cancelNewClient.addEventListener('click', showClientList);
    searchInput.addEventListener('input', filterClients);
    snippetSearch.addEventListener('input', filterSnippets);
    addExpenseBtn.addEventListener('click', addExpense);
    backToList.addEventListener('click', async () => {
        await saveNotepad();
        showClientList();
    });
    exportBtn.addEventListener('click', exportAllToExcel);
    exportClientBtn.addEventListener('click', exportClientToExcel);
    exportDbBtn.addEventListener('click', exportDatabase);
    manageSnippetsBtn.addEventListener('click', showSnippetsModal);
    saveSnippetBtn.addEventListener('click', saveSnippet);
    closeSnippetsModal.addEventListener('click', hideSnippetsModal);
    confirmDelete.addEventListener('click', deleteExpense);
    cancelDelete.addEventListener('click', hideDeleteModal);
    confirmExport.addEventListener('click', performExport);
    cancelExport.addEventListener('click', hideExportModal);

    // Notepad event listeners
    notepadTextarea.addEventListener('input', saveNotepad);
    notepadTextarea.addEventListener('blur', saveNotepad);
    expandNotepadBtn.addEventListener('click', toggleNotepadSize);

    // Close modals by clicking outside
    snippetsModal.addEventListener('click', (e) => {
        if (e.target === snippetsModal) {
            hideSnippetsModal();
        }
    });

    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            hideDeleteModal();
        }
    });

    exportModal.addEventListener('click', (e) => {
        if (e.target === exportModal) {
            hideExportModal();
        }
    });

    // Close modals with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (snippetsModal.style.display !== 'none') {
                hideSnippetsModal();
            }
            if (deleteModal.style.display !== 'none') {
                hideDeleteModal();
            }
            if (exportModal.style.display !== 'none') {
                hideExportModal();
            }
        }
    });
});

// Functions
function renderClientList() {
    clientList.innerHTML = '';
    clients.forEach(client => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${client.name}</span>
            <button class="delete-btn">🗑️</button>
        `;
        li.addEventListener('click', () => showClientDetails(client.id));
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showDeleteClientModal(client.id);
        });
        clientList.appendChild(li);
    });
}

async function showClientList() {
    if (currentClientId) {
        await saveNotepad();
    }
    document.getElementById('clientListSection').classList.remove('hidden');
    newClientSection.classList.add('hidden');
    clientDetailsSection.classList.add('hidden');
    vendesSection.classList.add('hidden');
    currentClientId = null;
}

async function showVendes() {
    if (currentClientId) {
        await saveNotepad();
    }
    document.getElementById('clientListSection').classList.add('hidden');
    newClientSection.classList.add('hidden');
    clientDetailsSection.classList.add('hidden');
    vendesSection.classList.remove('hidden');
    renderVendes();
}

async function showNewClientForm() {
    if (currentClientId) {
        await saveNotepad();
    }
    document.getElementById('clientListSection').classList.add('hidden');
    newClientSection.classList.remove('hidden');
    clientDetailsSection.classList.add('hidden');
    newClientForm.reset();
    // Focus the first input field
    document.getElementById('name').focus();
}

async function addClient(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;

    if (!name.trim()) {
        alert('Please enter a client name');
        return;
    }

    const newClient = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        notepad: ''
    };

    try {
        console.log('Saving new client:', newClient);
        await saveSingleClient(newClient);
        newClientForm.reset();
        showClientList();
    } catch (error) {
        console.error('Error saving client:', error);
        alert('Failed to save client. Please try again.');
    }
}

function showClientDetails(clientId) {
    console.log('showClientDetails called with clientId:', clientId);
    currentClientId = clientId;
    const client = clients.find(c => c.id === clientId);
    console.log('Found client:', client);
    if (!client) return;

    clientName.textContent = client.name;
    clientPhone.textContent = client.phone;
    clientEmail.textContent = client.email;
    clientAddress.textContent = client.address;
    notepadTextarea.value = client.notepad || '';

    // Use 'vendes' field from new API, fallback to 'expenses' for compatibility
    const expenses = client.vendes || client.expenses || [];
    renderExpenses(expenses);

    // Set the date field to the current date
    document.getElementById('expenseDate').value = getCurrentDate();

    document.getElementById('clientListSection').classList.add('hidden');
    newClientSection.classList.add('hidden');
    clientDetailsSection.classList.remove('hidden');
    console.log('Sections toggled');
}

function renderExpenses(expenses) {
    expenseList.innerHTML = '';
    // Handle both 'expenses' (legacy) and 'vendes' (new) field names
    const expensesArray = expenses || [];
    const validExpenses = expensesArray.filter(expense => expense.product !== null && expense.price !== null);
    const sortedExpenses = validExpenses.slice().sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date.localeCompare(a.date);
    });
    sortedExpenses.forEach((expense) => {
        const li = document.createElement('li');
        // Use expense.id if available (new API), otherwise fall back to index-based deletion
        const deleteAction = expense.id 
            ? `showDeleteModal(${expense.id})` 
            : `showDeleteModal(${validExpenses.indexOf(expense)})`;
        li.innerHTML = `
            <span>${formatDate(expense.date)} - ${expense.product} - €${expense.price}</span>
            <button onclick="${deleteAction}" class="delete-btn">Eliminar</button>`;
        expenseList.appendChild(li);
    });
}

function renderVendes() {
    vendesList.innerHTML = '';
    const allExpenses = [];
    clients.forEach(client => {
        // Use 'vendes' field from new API, fallback to 'expenses' for compatibility
        const vendesData = client.vendes || client.expenses || [];
        vendesData.forEach((expense) => {
            if (expense.product !== null && expense.price !== null) {
                allExpenses.push({
                    vendeId: expense.id, // Use venda ID from server
                    clientId: client.id,
                    clientName: client.name,
                    date: expense.date,
                    product: expense.product,
                    price: expense.price
                });
            }
        });
    });
    allExpenses.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date) - new Date(a.date);
    });
    allExpenses.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${formatDate(item.date)} - ${item.clientName} - ${item.product} - €${item.price}</span>
            <button onclick="showDeleteVendesModal(${item.vendeId})" class="delete-btn small-delete-btn">Eliminar</button>
        `;
        vendesList.appendChild(li);
    });
}

async function addExpense() {
    const date = document.getElementById('expenseDate').value;
    const productInput = document.getElementById('expenseProduct');
    const priceInput = document.getElementById('expensePrice');
    const product = productInput.value;
    const price = parseFloat(priceInput.value);

    // Clear previous error states
    const productError = document.getElementById('expenseProductError');
    const priceError = document.getElementById('expensePriceError');
    productInput.classList.remove('error');
    priceInput.classList.remove('error');
    productError.classList.remove('show');
    priceError.classList.remove('show');

    // Validate fields
    let isValid = true;
    if (!product || product.trim() === '') {
        productInput.classList.add('error');
        productError.classList.add('show');
        isValid = false;
    }
    if (!price || isNaN(price) || price <= 0) {
        priceInput.classList.add('error');
        priceError.classList.add('show');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const client = clients.find(c => c.id === currentClientId);
    if (!client) {
        alert('No client selected');
        return;
    }

    try {
        // Save to server using new API
        const response = await fetch('http://localhost:3000/api/vendes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: currentClientId,
                product: product.trim(),
                price: price,
                date: date
            })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        // Reload clients to refresh the list
        await loadClients();
        const updatedClient = clients.find(c => c.id === currentClientId);
        if (updatedClient) {
            renderExpenses(updatedClient.vendes || []);
        }
        addExpenseForm.reset();
        // Set the date field to the current date after reset
        document.getElementById('expenseDate').value = getCurrentDate();
    } catch (error) {
        console.error('Error saving expense:', error);
        alert('Error en guardar la venda. Torna-ho a provar.');
    }
}

function filterClients() {
    const searchTerm = normalizeString(searchInput.value);
    const filteredClients = clients.filter(client =>
        normalizeString(client.name).includes(searchTerm)
    );

    clientList.innerHTML = '';
    filteredClients.forEach(client => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${client.name}</span>
            <button class="delete-btn">🗑️</button>
        `;
        li.addEventListener('click', () => showClientDetails(client.id));
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showDeleteClientModal(client.id);
        });
        clientList.appendChild(li);
    });
}

function filterSnippets() {
    const searchTerm = normalizeString(snippetSearch.value);
    renderSnippets(searchTerm);
}



function exportAllToExcel() {
    showExportModal();
}

function showExportModal() {
    exportModal.style.display = 'flex';
}

function hideExportModal() {
    exportModal.style.display = 'none';
}

function performExport() {
    const startDate = exportStartDate.value;
    const endDate = exportEndDate.value;

    if (!startDate) {
        alert("Data d'inici requerida.");
        return;
    }
    if (!endDate) {
        alert("Data de fi requerida.");
        return;
    }

    const data = [];
    clients.forEach(client => {
        const expenses = client.vendes || client.expenses || [];
        expenses.forEach(expense => {
            if (expense.date >= startDate && expense.date <= endDate) {
                data.push({
                    Data: expense.date,
                    Client: client.name,
                    'Producte/Servei': expense.product,
                    Preu: expense.price
                });
            }
        });
    });

    if (data.length === 0) {
        alert("No hi ha dades en el rang de dates seleccionat.");
        return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [
        {wch: 20}, // Client
        {wch: 12}, // Data
        {wch: 25}, // Producte/Servei
        {wch: 10}  // Preu (€)
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clients');
    XLSX.writeFile(wb, `clients_${startDate}_to_${endDate}.xlsx`);

    hideExportModal();
}

function exportClientToExcel() {
    const client = clients.find(c => c.id === currentClientId);
    if (!client) return;

    const data = client.expenses.map(expense => ({
        Data: formatDate(expense.date),
        Client: client.name,
        'Producte / Servei': expense.product,
        'Preu (€)': expense.price
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [
        {wch: 12}, // Data
        {wch: 20}, // Client
        {wch: 25}, // Producte / Servei
        {wch: 10}  // Preu (€)
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, client.name);
    XLSX.writeFile(wb, `${client.name}.xlsx`);
}

function exportDatabase() {
    fetch('http://localhost:3000/api/export-db')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to download database');
            }
            return response.blob();
        })
        .then(blob => {
            saveAs(blob, 'clients.db');
        })
        .catch(error => {
            console.error('Error downloading database:', error);
            alert('Error downloading database. Please try again.');
        });
}



function showSnippetsModal() {
    snippetsModal.style.display = 'flex';
    snippetSearch.value = '';
    renderSnippets();
}

function hideSnippetsModal() {
    snippetsModal.style.display = 'none';
}

function renderSnippets(filterTerm = '') {
    snippetsList.innerHTML = '';
    const filteredSnippets = snippets.filter(snippet =>
        normalizeString(snippet.name || snippet.text).includes(normalizeString(filterTerm))
    );
    filteredSnippets.forEach((snippet) => {
        const li = document.createElement('li');
        const displayName = snippet.name || snippet.text;
        const displayPrice = snippet.price || 0;
        li.innerHTML = `
            <span>${displayName} - €${parseFloat(displayPrice).toFixed(2)}</span>
            <button onclick="selectSnippet('${displayName.replace(/'/g, "\\'")}', ${displayPrice})">Seleccionar</button>
            <button onclick="deleteSnippetFromServer(${snippet.id}); event.stopPropagation();" class="delete-btn">🗑️</button>
        `;
        snippetsList.appendChild(li);
    });
}

function saveSnippet() {
    const text = document.getElementById('snippetText').value;
    const price = parseFloat(document.getElementById('snippetPrice').value);

    if (!text || !price) {
        alert('Omple els camps de producte/servei i preu.');
        return;
    }

    saveSnippetToServer(text, price);
}

async function saveSnippetToServer(name, price) {
    try {
        const response = await fetch('http://localhost:3000/api/productes-serveis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, descripcio: '' })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save product/service');
        }

        // Clear inputs and reload snippets
        document.getElementById('snippetText').value = '';
        document.getElementById('snippetPrice').value = '';
        await loadSnippets();
    } catch (error) {
        console.error('Error saving product/service:', error);
        alert('Error en guardar: ' + error.message);
    }
}

function selectSnippet(text, price) {
    document.getElementById('expenseProduct').value = text;
    document.getElementById('expensePrice').value = price;
    hideSnippetsModal();
}
let expenseToDelete = null;
let clientToDelete = null;
let vendesToDelete = null;

function showDeleteModal(vendeId) {
    expenseToDelete = vendeId;
    clientToDelete = null;
    vendesToDelete = null;
    deleteModal.style.display = 'flex';
}

function showDeleteClientModal(clientId) {
    clientToDelete = clientId;
    expenseToDelete = null;
    deleteModal.style.display = 'flex';
}

function showDeleteSnippetModal(index) {
    // This function is deprecated - use deleteSnippetFromServer() directly
    // Kept for backward compatibility but not used
    console.log('Deprecated: use deleteSnippetFromServer() instead');
}

function showDeleteVendesModal(vendeId) {
    vendesToDelete = { vendeId };
    expenseToDelete = null;
    clientToDelete = null;
    deleteModal.style.display = 'flex';
}

function hideDeleteModal() {
    deleteModal.style.display = 'none';
    expenseToDelete = null;
    clientToDelete = null;
    vendesToDelete = null;
}

async function deleteExpense() {
    if (expenseToDelete !== null) {
        try {
            // Delete venda from backend via /api/vendes/:id DELETE
            const response = await fetch(`http://localhost:3000/api/vendes/${expenseToDelete}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete venda');
            }
            
            // Reload clients to sync UI with server state
            await loadClients();
            
            // Refresh current client's expenses display
            const client = clients.find(c => c.id === currentClientId);
            if (client) {
                renderExpenses(client.vendes || client.expenses || []);
            }
        } catch (error) {
            console.error('Error deleting venda:', error);
            alert('Failed to delete venda. Please try again.');
        }
    } else if (clientToDelete !== null) {
        try {
            // Delete client from backend via /api/clients/:id DELETE
            const response = await fetch(`http://localhost:3000/api/clients/${clientToDelete}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete client');
            }
            
            // Reload clients to sync UI with server state
            await loadClients();
            renderClientList();
            clientDetailsSection.classList.add('hidden');
            document.getElementById('clientListSection').classList.remove('hidden');
        } catch (error) {
            console.error('Error deleting client:', error);
            alert('Failed to delete client. Please try again.');
        }
    } else if (vendesToDelete !== null) {
        try {
            // Delete venda from backend via /api/vendes/:id DELETE
            const response = await fetch(`http://localhost:3000/api/vendes/${vendesToDelete.vendeId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete venda');
            }
            
            // Reload clients to sync UI with server state
            await loadClients();
            renderVendes();
        } catch (error) {
            console.error('Error deleting venda:', error);
            alert('Failed to delete venda. Please try again.');
        }
    }
    hideDeleteModal();
}

// API functions
async function loadClients() {
    try {
        const response = await fetch('http://localhost:3000/api/clients');
        if (!response.ok) {
            throw new Error('Failed to load clients');
        }
        clients = await response.json();
        renderClientList();
    } catch (error) {
        console.error('Error loading clients:', error);
        alert('Error loading clients. Please check the server.');
    }
}

async function saveClients() {
    try {
        // Note: This function is kept for backward compatibility
        // Individual clients are now saved via saveSingleClient()
        console.log('saveClients() called - reloading from server');
        await loadClients();
    } catch (error) {
        console.error('Error in saveClients:', error);
        throw error;
    }
}

async function saveSingleClient(client) {
    try {
        const response = await fetch('http://localhost:3000/api/clients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: client.name,
                phone: client.phone,
                email: client.email,
                address: client.address,
                notepad: client.notepad || ''
            })
        });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const result = await response.json();
        // Reload clients to ensure UI reflects server state
        await loadClients();
        return result;
    } catch (error) {
        console.error('Error saving client:', error);
        throw error;
    }
}

// Snippets/Products API functions
async function loadSnippets() {
    try {
        const response = await fetch('http://localhost:3000/api/productes-serveis');
        if (!response.ok) {
            throw new Error('Failed to load products/services');
        }
        snippets = await response.json();
        renderSnippets();
    } catch (error) {
        console.error('Error loading products/services:', error);
        snippets = [];
        renderSnippets();
    }
}

async function deleteSnippetFromServer(snippetId) {
    if (!confirm('Estàs segur que vols eliminar aquest producte/servei?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/productes-serveis/${snippetId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete product/service');
        }

        // Reload snippets to reflect deletion
        await loadSnippets();
    } catch (error) {
        console.error('Error deleting product/service:', error);
        alert('Error en eliminar: ' + error.message);
    }
}

async function saveSnippets() {
    // This function is kept for backward compatibility
    // Individual snippets are now saved via saveSnippetToServer()
    console.log('saveSnippets() called - snippets are now saved to server automatically');
}

// Notepad functions
async function saveNotepad() {
    console.log('saveNotepad called');
    const client = clients.find(c => c.id === currentClientId);
    if (!client) {
        console.log('No client found for currentClientId:', currentClientId);
        return;
    }

    client.notepad = notepadTextarea.value;
    console.log('Updated client notepad:', client.notepad);
    try {
        const response = await fetch(`http://localhost:3000/api/clients/${currentClientId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: client.name,
                phone: client.phone,
                email: client.email,
                address: client.address,
                notepad: client.notepad
            })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        console.log('Notepad saved successfully');
    } catch (error) {
        console.error('Error saving notepad:', error);
    }
}

function toggleNotepadSize() {
    clientNotepad.classList.toggle('expanded');
    if (clientNotepad.classList.contains('expanded')) {
        expandNotepadBtn.textContent = '⤣';
    } else {
        expandNotepadBtn.textContent = '⤢';
    }
}
