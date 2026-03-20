// Translation dictionary for all supported languages
const translations = {
  en: {
    // Page title
    pageTitle: "Client Manager",
    headerTitle: "CLIENT MANAGER",

    // Header buttons
    btnClients: "Clients",
    btnSales: "Sales",
    btnNewClient: "New Client",
    btnExportAll: "Export ALL to Excel",
    btnExportDb: "Export Database",

    // Header button tooltips
    tooltipClients: "View all clients",
    tooltipSales: "View all sales",
    tooltipNewClient: "Create a new client",
    tooltipExportAll: "Export Clients + Sales to Excel",
    tooltipExportDb: "Download a copy of Clients.db. Once a month a backup copy of the database is saved automatically to the Monthly Database folder",

    // Client list section
    clientListTitle: "Client List",
    searchPlaceholder: "Search client by name...",

    // New client section
    newClientTitle: "Add New Client",
    labelName: "Name:",
    labelPhone: "Phone:",
    labelEmail: "Email:",
    labelAddress: "Address:",
    btnAddClient: "Add Client",
    btnCancel: "Cancel",

    // Client details section
    clientReportTitle: "Client Report:",
    btnExportClient: "Export client to Excel",
    labelNotes: "Write notes here...",

    // Sales form
    salesTitle: "Sales",
    labelDate: "Date:",
    labelProduct: "Product or Service:",
    labelPrice: "Price (€):",
    btnAddSale: "Add sale",
    btnSelectProduct: "Select product or service 📝",
    errorFillField: "Fill this field to add sale",

    // Sales list section
    salesListTitle: "Sales List",

    // Back button
    btnBack: "<-- Go back",

    // Delete modal
    deleteTitle: "Delete?",
    btnYes: "YES",
    btnNo: "NO",

    // Snippets modal
    snippetsTitle: "Manage saved products or services",
    snippetLabelProduct: "Product or Service:",
    snippetLabelPrice: "Price (€):",
    snippetPlaceholderText: "Type here...",
    snippetPlaceholderPrice: "Type here...",
    btnSave: "Save",
    snippetSelectTitle: "Select:",
    snippetSearchPlaceholder: "Search product or service...",
    btnClose: "Close",
    btnSelect: "Select",

    // Export modal
    exportTitle: "Select Dates for Export",
    labelExportStartDate: "From (Start date):",
    labelExportEndDate: "To (End date):",
    btnExport: "Export",

    // Delete button text in lists
    btnDelete: "Delete",

    // Alert messages
    alertEnterName: "Please enter a client name",
    alertSaveFailed: "Failed to save client. Please try again.",
    alertNoClient: "No client selected",
    alertSaveError: "Error saving the sale. Please try again.",
    alertFillFields: "Fill the product/service and price fields.",
    alertSaveSnippetError: "Error saving: ",
    alertConfirmDeleteSnippet: "Are you sure you want to delete this product/service?",
    alertDeleteSnippetError: "Error deleting: ",
    alertStartDateRequired: "Start date required.",
    alertEndDateRequired: "End date required.",
    alertNoDataInRange: "No data in the selected date range.",
    alertLoadClientsError: "Error loading clients. Please check the server.",
    alertDeleteVendaFailed: "Failed to delete sale. Please try again.",
    alertDeleteClientFailed: "Failed to delete client. Please try again.",
    alertDownloadDbError: "Error downloading database. Please try again.",

    // Excel export column headers
    excelDate: "Date",
    excelClient: "Client",
    excelProduct: "Product/Service",
    excelPrice: "Price (€)",
  },

  ca: {
    pageTitle: "Gestor de Clients",
    headerTitle: "GESTOR DE CLIENTS",

    btnClients: "Clients",
    btnSales: "Vendes",
    btnNewClient: "Nou Client",
    btnExportAll: "Exportar TOT a Excel",
    btnExportDb: "Exportar Base de dades",

    tooltipClients: "Visualitza tots els clients",
    tooltipSales: "Visualitza totes les vendes",
    tooltipNewClient: "Crea un nou client",
    tooltipExportAll: "Exporta Clients + Vendes a Excel",
    tooltipExportDb: "Baixa ara una còpia de Clients.db. Un cop al mes es guardarà automàticament una còpia de la bbdd a la carpeta Base de Dades mensual",

    clientListTitle: "Llista de Clients",
    searchPlaceholder: "Buscar client per nom...",

    newClientTitle: "Afegir Nou Client",
    labelName: "Nom:",
    labelPhone: "Telèfon:",
    labelEmail: "Correu:",
    labelAddress: "Adreça:",
    btnAddClient: "Afegir Client",
    btnCancel: "Cancel·lar",

    clientReportTitle: "Informe del Client:",
    btnExportClient: "Exportar client a Excel",
    labelNotes: "Escriu notes aquí...",

    salesTitle: "Vendes",
    labelDate: "Data:",
    labelProduct: "Producte o Servei:",
    labelPrice: "Preu (€):",
    btnAddSale: "Afegir venda",
    btnSelectProduct: "Selecciona producte o servei 📝",
    errorFillField: "Omple aquest camp per afegir venda",

    salesListTitle: "Llista de Vendes",

    btnBack: "<-- Torna enrere",

    deleteTitle: "Eliminar?",
    btnYes: "SÍ",
    btnNo: "NO",

    snippetsTitle: "Gestionar productes o serveis guardats",
    snippetLabelProduct: "Producte o Servei:",
    snippetLabelPrice: "Preu (€):",
    snippetPlaceholderText: "Escriu aquí...",
    snippetPlaceholderPrice: "Escriu aquí...",
    btnSave: "Guardar",
    snippetSelectTitle: "Selecciona:",
    snippetSearchPlaceholder: "Buscar producte o servei...",
    btnClose: "Tancar",
    btnSelect: "Seleccionar",

    exportTitle: "Seleccionar Dates per Exportar",
    labelExportStartDate: "Des de (Data d'inici):",
    labelExportEndDate: "Fins (Data de fi):",
    btnExport: "Exportar",

    btnDelete: "Eliminar",

    alertEnterName: "Si us plau, introdueix un nom de client",
    alertSaveFailed: "Error en guardar el client. Torna-ho a provar.",
    alertNoClient: "Cap client seleccionat",
    alertSaveError: "Error en guardar la venda. Torna-ho a provar.",
    alertFillFields: "Omple els camps de producte/servei i preu.",
    alertSaveSnippetError: "Error en guardar: ",
    alertConfirmDeleteSnippet: "Estàs segur que vols eliminar aquest producte/servei?",
    alertDeleteSnippetError: "Error en eliminar: ",
    alertStartDateRequired: "Data d'inici requerida.",
    alertEndDateRequired: "Data de fi requerida.",
    alertNoDataInRange: "No hi ha dades en el rang de dates seleccionat.",
    alertLoadClientsError: "Error carregant clients. Comprova el servidor.",
    alertDeleteVendaFailed: "Error en eliminar la venda. Torna-ho a provar.",
    alertDeleteClientFailed: "Error en eliminar el client. Torna-ho a provar.",
    alertDownloadDbError: "Error descarregant la base de dades. Torna-ho a provar.",

    excelDate: "Data",
    excelClient: "Client",
    excelProduct: "Producte/Servei",
    excelPrice: "Preu (€)",
  },

  es: {
    pageTitle: "Gestor de Clientes",
    headerTitle: "GESTOR DE CLIENTES",

    btnClients: "Clientes",
    btnSales: "Ventas",
    btnNewClient: "Nuevo Cliente",
    btnExportAll: "Exportar TODO a Excel",
    btnExportDb: "Exportar Base de datos",

    tooltipClients: "Ver todos los clientes",
    tooltipSales: "Ver todas las ventas",
    tooltipNewClient: "Crear un nuevo cliente",
    tooltipExportAll: "Exportar Clientes + Ventas a Excel",
    tooltipExportDb: "Descarga una copia de Clients.db. Una vez al mes se guardará automáticamente una copia de la bbdd en la carpeta Base de Datos mensual",

    clientListTitle: "Lista de Clientes",
    searchPlaceholder: "Buscar cliente por nombre...",

    newClientTitle: "Añadir Nuevo Cliente",
    labelName: "Nombre:",
    labelPhone: "Teléfono:",
    labelEmail: "Correo:",
    labelAddress: "Dirección:",
    btnAddClient: "Añadir Cliente",
    btnCancel: "Cancelar",

    clientReportTitle: "Informe del Cliente:",
    btnExportClient: "Exportar cliente a Excel",
    labelNotes: "Escribe notas aquí...",

    salesTitle: "Ventas",
    labelDate: "Fecha:",
    labelProduct: "Producto o Servicio:",
    labelPrice: "Precio (€):",
    btnAddSale: "Añadir venta",
    btnSelectProduct: "Seleccionar producto o servicio 📝",
    errorFillField: "Rellena este campo para añadir venta",

    salesListTitle: "Lista de Ventas",

    btnBack: "<-- Volver atrás",

    deleteTitle: "¿Eliminar?",
    btnYes: "SÍ",
    btnNo: "NO",

    snippetsTitle: "Gestionar productos o servicios guardados",
    snippetLabelProduct: "Producto o Servicio:",
    snippetLabelPrice: "Precio (€):",
    snippetPlaceholderText: "Escribe aquí...",
    snippetPlaceholderPrice: "Escribe aquí...",
    btnSave: "Guardar",
    snippetSelectTitle: "Seleccionar:",
    snippetSearchPlaceholder: "Buscar producto o servicio...",
    btnClose: "Cerrar",
    btnSelect: "Seleccionar",

    exportTitle: "Seleccionar Fechas para Exportar",
    labelExportStartDate: "Desde (Fecha de inicio):",
    labelExportEndDate: "Hasta (Fecha de fin):",
    btnExport: "Exportar",

    btnDelete: "Eliminar",

    alertEnterName: "Por favor, introduce un nombre de cliente",
    alertSaveFailed: "Error al guardar el cliente. Inténtalo de nuevo.",
    alertNoClient: "Ningún cliente seleccionado",
    alertSaveError: "Error al guardar la venta. Inténtalo de nuevo.",
    alertFillFields: "Rellena los campos de producto/servicio y precio.",
    alertSaveSnippetError: "Error al guardar: ",
    alertConfirmDeleteSnippet: "¿Estás seguro de que quieres eliminar este producto/servicio?",
    alertDeleteSnippetError: "Error al eliminar: ",
    alertStartDateRequired: "Fecha de inicio requerida.",
    alertEndDateRequired: "Fecha de fin requerida.",
    alertNoDataInRange: "No hay datos en el rango de fechas seleccionado.",
    alertLoadClientsError: "Error cargando clientes. Comprueba el servidor.",
    alertDeleteVendaFailed: "Error al eliminar la venta. Inténtalo de nuevo.",
    alertDeleteClientFailed: "Error al eliminar el cliente. Inténtalo de nuevo.",
    alertDownloadDbError: "Error descargando la base de datos. Inténtalo de nuevo.",

    excelDate: "Fecha",
    excelClient: "Cliente",
    excelProduct: "Producto/Servicio",
    excelPrice: "Precio (€)",
  }
};

// Get the current language from localStorage, default to English
function getCurrentLanguage() {
  return localStorage.getItem('appLanguage') || 'en';
}

// Set the current language and persist it
function setLanguage(lang) {
  localStorage.setItem('appLanguage', lang);
  applyLanguage();
}

// Get a translated string by key
function t(key) {
  const lang = getCurrentLanguage();
  return translations[lang][key] || translations['en'][key] || key;
}

// Apply translations to all elements with data-i18n attributes
function applyLanguage() {
  const lang = getCurrentLanguage();
  document.documentElement.lang = lang;
  document.title = t('pageTitle');

  // Update elements with data-i18n attribute (text content)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });

  // Update elements with data-i18n-placeholder attribute
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  // Update elements with data-i18n-title attribute (tooltips)
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });

  // Update the language selector to reflect the current language
  const langSelect = document.getElementById('languageSelect');
  if (langSelect) {
    langSelect.value = lang;
  }
}
