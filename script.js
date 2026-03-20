// Global state
let clients = [];
let currentClientId = null;
let snippets = [];
let expenseToDelete = null;
let clientToDelete = null;
let vendesToDelete = null;
let notepadSaveTimeoutId = null;

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
let addExpenseBtn;
let backToList;
let exportBtn;
let exportClientBtn;
let exportDbBtn;
let demoResetBtn;
let demoBanner;
let demoBannerCloseBtn;
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
let exportModal;
let exportStartDate;
let exportEndDate;
let confirmExport;
let cancelExport;

function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getDateOnly(dateString) {
    if (!dateString) {
        return '';
    }

    return String(dateString).split('T')[0].split(' ')[0];
}

function formatDate(dateString) {
    const normalisedDate = getDateOnly(dateString);
    if (!normalisedDate) {
        return '';
    }

    const [year, month, day] = normalisedDate.split('-');
    return `${day}-${month}-${year}`;
}

function formatCurrency(value) {
    const amount = Number(value) || 0;
    return new Intl.NumberFormat(getCurrentLanguage(), {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function normalizeString(str = '') {
    return String(str)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function getClientVendes(client) {
    return client?.vendes || client?.expenses || [];
}

function cacheDomElements() {
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
    addExpenseBtn = document.getElementById('addExpenseBtn');
    backToList = document.getElementById('backToList');
    exportBtn = document.getElementById('exportBtn');
    exportClientBtn = document.getElementById('exportClientBtn');
    exportDbBtn = document.getElementById('exportDbBtn');
    demoResetBtn = document.getElementById('demoResetBtn');
    demoBanner = document.getElementById('demoBanner');
    demoBannerCloseBtn = document.getElementById('demoBannerCloseBtn');
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
    exportModal = document.getElementById('exportModal');
    exportStartDate = document.getElementById('exportStartDate');
    exportEndDate = document.getElementById('exportEndDate');
    confirmExport = document.getElementById('confirmExport');
    cancelExport = document.getElementById('cancelExport');
}

function bindEventListeners() {
    iniciBtn.addEventListener('click', showClientList);
    vendesBtn.addEventListener('click', showVendes);
    newClientBtn.addEventListener('click', showNewClientForm);
    newClientForm.addEventListener('submit', addClient);
    cancelNewClient.addEventListener('click', showClientList);
    searchInput.addEventListener('input', filterClients);
    snippetSearch.addEventListener('input', filterSnippets);
    addExpenseBtn.addEventListener('click', addExpense);
    backToList.addEventListener('click', showClientList);
    exportBtn.addEventListener('click', exportAllToExcel);
    exportClientBtn.addEventListener('click', exportClientToExcel);
    exportDbBtn.addEventListener('click', exportDatabase);
    demoResetBtn.addEventListener('click', resetDemoData);
    manageSnippetsBtn.addEventListener('click', showSnippetsModal);
    saveSnippetBtn.addEventListener('click', saveSnippet);
    closeSnippetsModal.addEventListener('click', hideSnippetsModal);
    confirmDelete.addEventListener('click', deleteExpense);
    cancelDelete.addEventListener('click', hideDeleteModal);
    confirmExport.addEventListener('click', performExport);
    cancelExport.addEventListener('click', hideExportModal);
    notepadTextarea.addEventListener('input', queueNotepadSave);
    notepadTextarea.addEventListener('blur', flushNotepadSave);
    expandNotepadBtn.addEventListener('click', toggleNotepadSize);

    if (demoBannerCloseBtn) {
        demoBannerCloseBtn.addEventListener('click', hideDemoBanner);
    }

    snippetsModal.addEventListener('click', (event) => {
        if (event.target === snippetsModal) {
            hideSnippetsModal();
        }
    });

    deleteModal.addEventListener('click', (event) => {
        if (event.target === deleteModal) {
            hideDeleteModal();
        }
    });

    exportModal.addEventListener('click', (event) => {
        if (event.target === exportModal) {
            hideExportModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') {
            return;
        }

        if (snippetsModal.style.display !== 'none') {
            hideSnippetsModal();
        }

        if (deleteModal.style.display !== 'none') {
            hideDeleteModal();
        }

        if (exportModal.style.display !== 'none') {
            hideExportModal();
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initBrowserDB();
    } catch (error) {
        console.error('Error initialising browser database:', error);
        alert(t('alertBrowserInitFailed'));
        return;
    }

    cacheDomElements();
    bindEventListeners();

    await loadClients();
    await loadSnippets();

    applyLanguage();
    hideSnippetsModal();
    hideDeleteModal();
    hideExportModal();
    restoreDemoBannerState();
});

function renderClientList(clientItems = clients) {
    clientList.innerHTML = '';

    clientItems.forEach((client) => {
        const listItem = document.createElement('li');
        const name = document.createElement('span');
        const deleteButton = document.createElement('button');

        name.textContent = client.name;
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = t('btnDelete');

        listItem.addEventListener('click', () => showClientDetails(client.id));
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            showDeleteClientModal(client.id);
        });

        listItem.appendChild(name);
        listItem.appendChild(deleteButton);
        clientList.appendChild(listItem);
    });
}

async function showClientList() {
    if (currentClientId) {
        await flushNotepadSave();
    }

    document.getElementById('clientListSection').classList.remove('hidden');
    newClientSection.classList.add('hidden');
    clientDetailsSection.classList.add('hidden');
    vendesSection.classList.add('hidden');
    currentClientId = null;
}

async function showVendes() {
    if (currentClientId) {
        await flushNotepadSave();
    }

    document.getElementById('clientListSection').classList.add('hidden');
    newClientSection.classList.add('hidden');
    clientDetailsSection.classList.add('hidden');
    vendesSection.classList.remove('hidden');
    renderVendes();
}

async function showNewClientForm() {
    if (currentClientId) {
        await flushNotepadSave();
    }

    document.getElementById('clientListSection').classList.add('hidden');
    newClientSection.classList.remove('hidden');
    clientDetailsSection.classList.add('hidden');
    newClientForm.reset();
    document.getElementById('name').focus();
}

async function addClient(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();

    if (!name) {
        alert(t('alertEnterName'));
        return;
    }

    try {
        await saveSingleClient({
            name,
            phone,
            email,
            address,
            notepad: ''
        });

        newClientForm.reset();
        await showClientList();
    } catch (error) {
        console.error('Error saving client:', error);
        alert(t('alertSaveFailed'));
    }
}

function showClientDetails(clientId) {
    currentClientId = clientId;
    const client = clients.find((item) => item.id === clientId);
    if (!client) {
        return;
    }

    clientName.textContent = client.name;
    clientPhone.textContent = client.phone;
    clientEmail.textContent = client.email;
    clientAddress.textContent = client.address;
    notepadTextarea.value = client.notepad || '';
    renderExpenses(getClientVendes(client));
    document.getElementById('expenseDate').value = getCurrentDate();

    document.getElementById('clientListSection').classList.add('hidden');
    newClientSection.classList.add('hidden');
    clientDetailsSection.classList.remove('hidden');
}

function renderExpenses(expenses) {
    expenseList.innerHTML = '';

    const sortedExpenses = [...(expenses || [])]
        .filter((expense) => expense.product !== null && expense.price !== null)
        .sort((left, right) => new Date(right.date || 0) - new Date(left.date || 0));

    sortedExpenses.forEach((expense) => {
        const listItem = document.createElement('li');
        const label = document.createElement('span');
        const deleteButton = document.createElement('button');

        label.textContent = `${formatDate(expense.date)} - ${expense.product} - ${formatCurrency(expense.price)}`;
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = t('btnDelete');
        deleteButton.addEventListener('click', () => showDeleteModal(expense.id));

        listItem.appendChild(label);
        listItem.appendChild(deleteButton);
        expenseList.appendChild(listItem);
    });
}

function renderVendes() {
    vendesList.innerHTML = '';

    const allVendes = clients
        .flatMap((client) => getClientVendes(client).map((venda) => ({
            vendeId: venda.id,
            clientId: client.id,
            clientName: client.name,
            date: venda.date,
            product: venda.product,
            price: venda.price
        })))
        .sort((left, right) => new Date(right.date || 0) - new Date(left.date || 0));

    allVendes.forEach((venda) => {
        const listItem = document.createElement('li');
        const label = document.createElement('span');
        const deleteButton = document.createElement('button');

        label.textContent = `${formatDate(venda.date)} - ${venda.clientName} - ${venda.product} - ${formatCurrency(venda.price)}`;
        deleteButton.className = 'delete-btn small-delete-btn';
        deleteButton.textContent = t('btnDelete');
        deleteButton.addEventListener('click', () => showDeleteVendesModal(venda.vendeId));

        listItem.appendChild(label);
        listItem.appendChild(deleteButton);
        vendesList.appendChild(listItem);
    });
}

async function addExpense() {
    const date = document.getElementById('expenseDate').value;
    const productInput = document.getElementById('expenseProduct');
    const priceInput = document.getElementById('expensePrice');
    const product = productInput.value.trim();
    const price = Number.parseFloat(priceInput.value);
    const productError = document.getElementById('expenseProductError');
    const priceError = document.getElementById('expensePriceError');

    productInput.classList.remove('error');
    priceInput.classList.remove('error');
    productError.classList.remove('show');
    priceError.classList.remove('show');

    let isValid = true;

    if (!product) {
        productInput.classList.add('error');
        productError.classList.add('show');
        isValid = false;
    }

    if (Number.isNaN(price) || price <= 0) {
        priceInput.classList.add('error');
        priceError.classList.add('show');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const client = clients.find((item) => item.id === currentClientId);
    if (!client) {
        alert(t('alertNoClient'));
        return;
    }

    try {
        apiPostVenda({
            client_id: currentClientId,
            product,
            price,
            date: date || getCurrentDate()
        });

        await loadClients();

        const updatedClient = clients.find((item) => item.id === currentClientId);
        if (updatedClient) {
            renderExpenses(getClientVendes(updatedClient));
        }

        addExpenseForm.reset();
        document.getElementById('expenseDate').value = getCurrentDate();
    } catch (error) {
        console.error('Error saving sale:', error);
        alert(t('alertSaveError'));
    }
}

function filterClients() {
    const searchTerm = normalizeString(searchInput.value);
    const filteredClients = clients.filter((client) =>
        normalizeString(client.name).includes(searchTerm)
    );

    renderClientList(filteredClients);
}

function filterSnippets() {
    renderSnippets(snippetSearch.value);
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
        alert(t('alertStartDateRequired'));
        return;
    }

    if (!endDate) {
        alert(t('alertEndDateRequired'));
        return;
    }

    const rows = [];

    clients.forEach((client) => {
        getClientVendes(client).forEach((expense) => {
            const expenseDate = getDateOnly(expense.date);
            if (expenseDate >= startDate && expenseDate <= endDate) {
                rows.push({
                    [t('excelDate')]: expenseDate,
                    [t('excelClient')]: client.name,
                    [t('excelProduct')]: expense.product,
                    [t('excelPrice')]: expense.price
                });
            }
        });
    });

    if (!rows.length) {
        alert(t('alertNoDataInRange'));
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [
        { wch: 12 },
        { wch: 20 },
        { wch: 25 },
        { wch: 12 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients');
    XLSX.writeFile(workbook, `clients_${startDate}_to_${endDate}.xlsx`);

    hideExportModal();
}

function exportClientToExcel() {
    const client = clients.find((item) => item.id === currentClientId);
    if (!client) {
        return;
    }

    const sales = getClientVendes(client);
    if (!sales.length) {
        alert(t('alertNoSalesToExport'));
        return;
    }

    const rows = sales.map((expense) => ({
        [t('excelDate')]: formatDate(expense.date),
        [t('excelClient')]: client.name,
        [t('excelProduct')]: expense.product,
        [t('excelPrice')]: expense.price
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [
        { wch: 12 },
        { wch: 20 },
        { wch: 25 },
        { wch: 12 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, client.name);
    XLSX.writeFile(workbook, `${client.name}.xlsx`);
}

function exportDatabase() {
    try {
        saveAs(apiExportDb(), 'clients-browser-demo.db');
    } catch (error) {
        console.error('Error downloading browser database:', error);
        alert(t('alertDownloadDbError'));
    }
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

    const filteredSnippets = snippets.filter((snippet) =>
        normalizeString(snippet.name).includes(normalizeString(filterTerm))
    );

    filteredSnippets.forEach((snippet) => {
        const listItem = document.createElement('li');
        const label = document.createElement('span');
        const actions = document.createElement('div');
        const selectButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        label.textContent = `${snippet.name} - ${formatCurrency(snippet.price)}`;
        actions.className = 'list-actions';

        selectButton.textContent = t('btnSelect');
        selectButton.addEventListener('click', () => selectSnippet(snippet.name, snippet.price));

        deleteButton.className = 'delete-btn';
        deleteButton.textContent = t('btnDelete');
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            deleteSnippetFromServer(snippet.id);
        });

        actions.appendChild(selectButton);
        actions.appendChild(deleteButton);
        listItem.appendChild(label);
        listItem.appendChild(actions);
        snippetsList.appendChild(listItem);
    });
}

function saveSnippet() {
    const text = document.getElementById('snippetText').value.trim();
    const price = Number.parseFloat(document.getElementById('snippetPrice').value);

    if (!text || Number.isNaN(price) || price < 0) {
        alert(t('alertFillFields'));
        return;
    }

    saveSnippetToServer(text, price);
}

async function saveSnippetToServer(name, price) {
    try {
        apiPostProducte({ name, price, descripcio: '' });
        document.getElementById('snippetText').value = '';
        document.getElementById('snippetPrice').value = '';
        await loadSnippets();
    } catch (error) {
        console.error('Error saving product/service:', error);
        alert(t('alertSaveSnippetError') + error.message);
    }
}

function selectSnippet(text, price) {
    document.getElementById('expenseProduct').value = text;
    document.getElementById('expensePrice').value = price;
    hideSnippetsModal();
}

function showDeleteModal(vendeId) {
    expenseToDelete = vendeId;
    clientToDelete = null;
    vendesToDelete = null;
    deleteModal.style.display = 'flex';
}

function showDeleteClientModal(clientId) {
    clientToDelete = clientId;
    expenseToDelete = null;
    vendesToDelete = null;
    deleteModal.style.display = 'flex';
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
    try {
        if (expenseToDelete !== null) {
            apiDeleteVenda(expenseToDelete);
            await loadClients();

            const client = clients.find((item) => item.id === currentClientId);
            if (client) {
                renderExpenses(getClientVendes(client));
            }
        } else if (clientToDelete !== null) {
            apiDeleteClient(clientToDelete);
            await loadClients();
            await showClientList();
        } else if (vendesToDelete !== null) {
            apiDeleteVenda(vendesToDelete.vendeId);
            await loadClients();
            renderVendes();
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        alert(expenseToDelete !== null || vendesToDelete !== null ? t('alertDeleteVendaFailed') : t('alertDeleteClientFailed'));
    } finally {
        hideDeleteModal();
    }
}

async function loadClients() {
    try {
        clients = apiGetClients();
        filterClients();
    } catch (error) {
        console.error('Error loading clients:', error);
        alert(t('alertLoadClientsError'));
    }
}

async function saveSingleClient(client) {
    const result = apiPostClient({
        name: client.name,
        phone: client.phone,
        email: client.email,
        address: client.address,
        notepad: client.notepad || ''
    });

    await loadClients();
    return result;
}

async function loadSnippets() {
    try {
        snippets = apiGetProductes();
    } catch (error) {
        console.error('Error loading products/services:', error);
        snippets = [];
    }

    renderSnippets(snippetSearch ? snippetSearch.value : '');
}

async function deleteSnippetFromServer(snippetId) {
    if (!confirm(t('alertConfirmDeleteSnippet'))) {
        return;
    }

    try {
        apiDeleteProducte(snippetId);
        await loadSnippets();
    } catch (error) {
        console.error('Error deleting product/service:', error);
        alert(t('alertDeleteSnippetError') + error.message);
    }
}

function queueNotepadSave() {
    window.clearTimeout(notepadSaveTimeoutId);
    notepadSaveTimeoutId = window.setTimeout(() => {
        saveNotepad().catch((error) => {
            console.error('Error saving notepad:', error);
        });
    }, 250);
}

async function flushNotepadSave() {
    if (notepadSaveTimeoutId) {
        window.clearTimeout(notepadSaveTimeoutId);
        notepadSaveTimeoutId = null;
    }

    await saveNotepad();
}

async function saveNotepad() {
    const client = clients.find((item) => item.id === currentClientId);
    if (!client) {
        return;
    }

    client.notepad = notepadTextarea.value;

    try {
        apiPutClient(currentClientId, {
            name: client.name,
            phone: client.phone,
            email: client.email,
            address: client.address,
            notepad: client.notepad
        });
    } catch (error) {
        console.error('Error saving notepad:', error);
    }
}

function toggleNotepadSize() {
    clientNotepad.classList.toggle('expanded');
    expandNotepadBtn.textContent = clientNotepad.classList.contains('expanded') ? '-' : '+';
}

async function resetDemoData() {
    if (!confirm(t('alertResetDemoConfirm'))) {
        return;
    }

    try {
        if (notepadSaveTimeoutId) {
            window.clearTimeout(notepadSaveTimeoutId);
            notepadSaveTimeoutId = null;
        }

        await resetBrowserDB();

        currentClientId = null;
        newClientForm.reset();
        addExpenseForm.reset();
        searchInput.value = '';
        snippetSearch.value = '';
        notepadTextarea.value = '';
        clientNotepad.classList.remove('expanded');
        expandNotepadBtn.textContent = '+';

        await loadClients();
        await loadSnippets();
        await showClientList();
    } catch (error) {
        console.error('Error resetting demo data:', error);
        alert(t('alertResetDemoFailed'));
    }
}

function hideDemoBanner() {
    if (!demoBanner) {
        return;
    }

    demoBanner.classList.add('hidden');
}

function restoreDemoBannerState() {
    if (!demoBanner) {
        return;
    }

    demoBanner.classList.remove('hidden');
    localStorage.removeItem('demoBannerHidden');
}

window.refreshDynamicContent = function refreshDynamicContent() {
    if (!clientList) {
        return;
    }

    filterClients();

    if (currentClientId && !clientDetailsSection.classList.contains('hidden')) {
        const client = clients.find((item) => item.id === currentClientId);
        if (client) {
            clientName.textContent = client.name;
            clientPhone.textContent = client.phone;
            clientEmail.textContent = client.email;
            clientAddress.textContent = client.address;
            renderExpenses(getClientVendes(client));
        }
    }

    if (!vendesSection.classList.contains('hidden')) {
        renderVendes();
    }

    if (snippetsModal.style.display !== 'none') {
        renderSnippets(snippetSearch.value);
    }
};
