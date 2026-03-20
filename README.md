<img width="1918" height="909" alt="image" src="https://github.com/user-attachments/assets/3f76aa05-4c4e-433d-9f43-a46ec6c20e2b" />
<img width="1902" height="898" alt="image" src="https://github.com/user-attachments/assets/e8788cd3-925a-4d18-a47c-0dd2f7696090" />
<img width="981" height="879" alt="image" src="https://github.com/user-attachments/assets/e4880cff-dae5-4f59-b648-43c4e9504059" />
<img width="1220" height="422" alt="image" src="https://github.com/user-attachments/assets/6c0ed483-7d79-4961-95c3-3e8e9e9307d2" />




ClientsVendes - Client and Sales Manager
==========================================

__ClientsVendes__ is a lightweight and efficient management application designed for small businesses. It allows you to keep thorough control of clients, sales and expenses through an intuitive web interface and a robust local database.

🚀 Key Features
----------------------------

- __Client Management (CRUD):__ Create, view and delete clients in a centralized way. Store phone number, email, address and a notepad for each client persistently.
- __Sales and Expense Tracking:__ Detailed record of transactions linked to each client: Product or service + sale price.
- __Recurring Expenses:__ System to create, save and delete recurring expenses to streamline the workflow.
- __Data Export:__ Functionality to export all information to Excel format and make database backups.
- __Clean Interface:__ Minimalist and functional design aimed at the end user.
- __Multi-language Support:__ Available in English, Catalan (Català) and Spanish (Español) with persistent language selection.

🛠️ Tech Stack
------------------

The application is built with modern web technologies to ensure speed and ease of installation:

- __Frontend:__ HTML5, CSS3 and JavaScript (Vanilla).
- __Backend:__ Node.js.
- __Database:__ SQLite (Local database, no external servers needed).

📂 Project Structure
------------------------

The directory tree consists of the following key elements:

- __server.js:__ Main Node.js server.
- __index.html / styles.css / script.js:__ Core of the user interface.
- __translations.js:__ Internationalization (i18n) translation dictionary.
- __Clients.db:__ SQLite database file.
- __/uploads:__ Folder for attachments or documents.
- __/Base de Dades Mensual:__ Historical records and backups.

💻 Installation and Usage
-------------------

__Prerequisites__

Node.js must be installed on the system.

### Steps to get started

1.  **Download or clone** the repository to your local machine.
2.  **Install the dependencies** by running in the terminal:
    ```bash
    npm install
    ```
3.  **Start the server**:
    ```bash
    node server.js
    ```
4.  **Access the application**:
    Open the browser and go to `http://localhost:3000` or use the shortcut `Gestió de Clients (LOCALHOST).url` included in the project root.

---

## ⚙️ Additional Configuration

For technical details about installation on specific local environments, see the file:
📄 `INSTRUCCIONS-NODE-LOCAL.txt`
