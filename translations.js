const translations = {
  en: {
    pageTitle: "Client Manager",
    headerTitle: "CLIENT MANAGER",
    demoBannerTitle: "Portfolio Demo",
    demoBannerText: "Changes are saved only in this browser. The bundled Clients.db file is never modified.",

    btnClients: "Clients",
    btnSales: "Sales",
    btnNewClient: "New Client",
    btnExportAll: "Export ALL to Excel",
    btnExportDb: "Export Database",
    btnResetDemo: "Reset demo data",

    tooltipClients: "View all clients",
    tooltipSales: "View all sales",
    tooltipNewClient: "Create a new client",
    tooltipExportAll: "Export clients and sales to Excel",
    tooltipExportDb: "Download the current browser-only demo database snapshot",
    tooltipResetDemo: "Restore the original bundled demo data in this browser",
    tooltipCloseBanner: "Hide portfolio demo banner",

    clientListTitle: "Client List",
    searchPlaceholder: "Search client by name...",

    newClientTitle: "Add New Client",
    labelName: "Name:",
    labelPhone: "Phone:",
    labelEmail: "Email:",
    labelAddress: "Address:",
    btnAddClient: "Add Client",
    btnCancel: "Cancel",

    clientReportTitle: "Client Report:",
    btnExportClient: "Export client to Excel",
    labelNotes: "Write notes here...",

    salesTitle: "Sales",
    labelDate: "Date:",
    labelProduct: "Product or Service:",
    labelPrice: "Price (EUR):",
    btnAddSale: "Add sale",
    btnSelectProduct: "Select product or service",
    errorFillField: "Fill this field to add sale",

    salesListTitle: "Sales List",
    btnBack: "<-- Go back",

    deleteTitle: "Delete?",
    btnYes: "YES",
    btnNo: "NO",

    snippetsTitle: "Manage saved products or services",
    snippetLabelProduct: "Product or Service:",
    snippetLabelPrice: "Price (EUR):",
    snippetPlaceholderText: "Type here...",
    snippetPlaceholderPrice: "Type here...",
    btnSave: "Save",
    snippetSelectTitle: "Select:",
    snippetSearchPlaceholder: "Search product or service...",
    btnClose: "Close",
    btnSelect: "Select",

    exportTitle: "Select Dates for Export",
    labelExportStartDate: "From (Start date):",
    labelExportEndDate: "To (End date):",
    btnExport: "Export",

    btnDelete: "Delete",

    alertEnterName: "Please enter a client name.",
    alertSaveFailed: "Failed to save client. Please try again.",
    alertNoClient: "No client selected.",
    alertSaveError: "Error saving the sale. Please try again.",
    alertFillFields: "Fill the product/service and price fields.",
    alertSaveSnippetError: "Error saving: ",
    alertConfirmDeleteSnippet: "Are you sure you want to delete this product/service?",
    alertDeleteSnippetError: "Error deleting: ",
    alertStartDateRequired: "Start date required.",
    alertEndDateRequired: "End date required.",
    alertNoDataInRange: "No data in the selected date range.",
    alertLoadClientsError: "Error loading clients from the browser database.",
    alertDeleteVendaFailed: "Failed to delete sale. Please try again.",
    alertDeleteClientFailed: "Failed to delete client. Please try again.",
    alertDownloadDbError: "Error downloading the browser database. Please try again.",
    alertNoSalesToExport: "This client has no sales to export yet.",
    alertResetDemoConfirm: "Reset this browser demo back to the original bundled data?",
    alertResetDemoFailed: "Unable to reset the browser demo data. Please try again.",
    alertBrowserInitFailed: "The browser demo database could not be started.",

    excelDate: "Date",
    excelClient: "Client",
    excelProduct: "Product/Service",
    excelPrice: "Price (EUR)"
  },

  ca: {
    pageTitle: "Gestor de Clients",
    headerTitle: "GESTOR DE CLIENTS",
    demoBannerTitle: "Portfolio Demo",
    demoBannerText: "Els canvis es guarden nomes en aquest navegador. El fitxer Clients.db publicat no es modifica mai.",

    btnClients: "Clients",
    btnSales: "Vendes",
    btnNewClient: "Nou Client",
    btnExportAll: "Exportar TOT a Excel",
    btnExportDb: "Exportar Base de dades",
    btnResetDemo: "Restablir dades demo",

    tooltipClients: "Visualitza tots els clients",
    tooltipSales: "Visualitza totes les vendes",
    tooltipNewClient: "Crea un nou client",
    tooltipExportAll: "Exporta clients i vendes a Excel",
    tooltipExportDb: "Baixa la copia actual de la base de dades guardada nomes en aquest navegador",
    tooltipResetDemo: "Recupera les dades originals del portfolio en aquest navegador",
    tooltipCloseBanner: "Amaga el banner del portfolio",

    clientListTitle: "Llista de Clients",
    searchPlaceholder: "Buscar client per nom...",

    newClientTitle: "Afegir Nou Client",
    labelName: "Nom:",
    labelPhone: "Telefon:",
    labelEmail: "Correu:",
    labelAddress: "Adreca:",
    btnAddClient: "Afegir Client",
    btnCancel: "Cancelar",

    clientReportTitle: "Informe del Client:",
    btnExportClient: "Exportar client a Excel",
    labelNotes: "Escriu notes aqui...",

    salesTitle: "Vendes",
    labelDate: "Data:",
    labelProduct: "Producte o Servei:",
    labelPrice: "Preu (EUR):",
    btnAddSale: "Afegir venda",
    btnSelectProduct: "Selecciona producte o servei",
    errorFillField: "Omple aquest camp per afegir venda",

    salesListTitle: "Llista de Vendes",
    btnBack: "<-- Torna enrere",

    deleteTitle: "Eliminar?",
    btnYes: "SI",
    btnNo: "NO",

    snippetsTitle: "Gestionar productes o serveis guardats",
    snippetLabelProduct: "Producte o Servei:",
    snippetLabelPrice: "Preu (EUR):",
    snippetPlaceholderText: "Escriu aqui...",
    snippetPlaceholderPrice: "Escriu aqui...",
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

    alertEnterName: "Si us plau, introdueix un nom de client.",
    alertSaveFailed: "Error en guardar el client. Torna-ho a provar.",
    alertNoClient: "Cap client seleccionat.",
    alertSaveError: "Error en guardar la venda. Torna-ho a provar.",
    alertFillFields: "Omple els camps de producte/servei i preu.",
    alertSaveSnippetError: "Error en guardar: ",
    alertConfirmDeleteSnippet: "Estas segur que vols eliminar aquest producte/servei?",
    alertDeleteSnippetError: "Error en eliminar: ",
    alertStartDateRequired: "Data d'inici requerida.",
    alertEndDateRequired: "Data de fi requerida.",
    alertNoDataInRange: "No hi ha dades en el rang de dates seleccionat.",
    alertLoadClientsError: "Error carregant clients des de la base de dades del navegador.",
    alertDeleteVendaFailed: "Error en eliminar la venda. Torna-ho a provar.",
    alertDeleteClientFailed: "Error en eliminar el client. Torna-ho a provar.",
    alertDownloadDbError: "Error descarregant la base de dades del navegador. Torna-ho a provar.",
    alertNoSalesToExport: "Aquest client encara no te vendes per exportar.",
    alertResetDemoConfirm: "Vols restablir aquest navegador a les dades originals del portfolio?",
    alertResetDemoFailed: "No s'han pogut restablir les dades del demo. Torna-ho a provar.",
    alertBrowserInitFailed: "No s'ha pogut iniciar la base de dades del demo al navegador.",

    excelDate: "Data",
    excelClient: "Client",
    excelProduct: "Producte/Servei",
    excelPrice: "Preu (EUR)"
  },

  es: {
    pageTitle: "Gestor de Clientes",
    headerTitle: "GESTOR DE CLIENTES",
    demoBannerTitle: "Portfolio Demo",
    demoBannerText: "Los cambios se guardan solo en este navegador. El archivo Clients.db publicado nunca se modifica.",

    btnClients: "Clientes",
    btnSales: "Ventas",
    btnNewClient: "Nuevo Cliente",
    btnExportAll: "Exportar TODO a Excel",
    btnExportDb: "Exportar Base de datos",
    btnResetDemo: "Restablecer demo",

    tooltipClients: "Ver todos los clientes",
    tooltipSales: "Ver todas las ventas",
    tooltipNewClient: "Crear un nuevo cliente",
    tooltipExportAll: "Exportar clientes y ventas a Excel",
    tooltipExportDb: "Descarga la copia actual de la base de datos guardada solo en este navegador",
    tooltipResetDemo: "Recupera los datos originales del portfolio en este navegador",
    tooltipCloseBanner: "Ocultar banner del portfolio",

    clientListTitle: "Lista de Clientes",
    searchPlaceholder: "Buscar cliente por nombre...",

    newClientTitle: "Anadir Nuevo Cliente",
    labelName: "Nombre:",
    labelPhone: "Telefono:",
    labelEmail: "Correo:",
    labelAddress: "Direccion:",
    btnAddClient: "Anadir Cliente",
    btnCancel: "Cancelar",

    clientReportTitle: "Informe del Cliente:",
    btnExportClient: "Exportar cliente a Excel",
    labelNotes: "Escribe notas aqui...",

    salesTitle: "Ventas",
    labelDate: "Fecha:",
    labelProduct: "Producto o Servicio:",
    labelPrice: "Precio (EUR):",
    btnAddSale: "Anadir venta",
    btnSelectProduct: "Seleccionar producto o servicio",
    errorFillField: "Rellena este campo para anadir venta",

    salesListTitle: "Lista de Ventas",
    btnBack: "<-- Volver atras",

    deleteTitle: "Eliminar?",
    btnYes: "SI",
    btnNo: "NO",

    snippetsTitle: "Gestionar productos o servicios guardados",
    snippetLabelProduct: "Producto o Servicio:",
    snippetLabelPrice: "Precio (EUR):",
    snippetPlaceholderText: "Escribe aqui...",
    snippetPlaceholderPrice: "Escribe aqui...",
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

    alertEnterName: "Por favor, introduce un nombre de cliente.",
    alertSaveFailed: "Error al guardar el cliente. Intentalo de nuevo.",
    alertNoClient: "Ningun cliente seleccionado.",
    alertSaveError: "Error al guardar la venta. Intentalo de nuevo.",
    alertFillFields: "Rellena los campos de producto/servicio y precio.",
    alertSaveSnippetError: "Error al guardar: ",
    alertConfirmDeleteSnippet: "Estas seguro de que quieres eliminar este producto/servicio?",
    alertDeleteSnippetError: "Error al eliminar: ",
    alertStartDateRequired: "Fecha de inicio requerida.",
    alertEndDateRequired: "Fecha de fin requerida.",
    alertNoDataInRange: "No hay datos en el rango de fechas seleccionado.",
    alertLoadClientsError: "Error cargando clientes desde la base de datos del navegador.",
    alertDeleteVendaFailed: "Error al eliminar la venta. Intentalo de nuevo.",
    alertDeleteClientFailed: "Error al eliminar el cliente. Intentalo de nuevo.",
    alertDownloadDbError: "Error descargando la base de datos del navegador. Intentalo de nuevo.",
    alertNoSalesToExport: "Este cliente todavia no tiene ventas para exportar.",
    alertResetDemoConfirm: "Quieres restablecer este navegador a los datos originales del portfolio?",
    alertResetDemoFailed: "No se han podido restablecer los datos del demo. Intentalo de nuevo.",
    alertBrowserInitFailed: "No se ha podido iniciar la base de datos del demo en el navegador.",

    excelDate: "Fecha",
    excelClient: "Cliente",
    excelProduct: "Producto/Servicio",
    excelPrice: "Precio (EUR)"
  }
};

function getCurrentLanguage() {
  return localStorage.getItem('appLanguage') || 'en';
}

function setLanguage(lang) {
  localStorage.setItem('appLanguage', lang);
  applyLanguage();
}

function t(key) {
  const lang = getCurrentLanguage();
  return translations[lang][key] || translations.en[key] || key;
}

function applyLanguage() {
  const lang = getCurrentLanguage();
  document.documentElement.lang = lang;
  document.title = t('pageTitle');

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  document.querySelectorAll('[data-i18n-title]').forEach((element) => {
    element.title = t(element.dataset.i18nTitle);
  });

  const langSelect = document.getElementById('languageSelect');
  if (langSelect) {
    langSelect.value = lang;
  }

  if (typeof window.refreshDynamicContent === 'function') {
    window.refreshDynamicContent();
  }
}
