<img width="1918" height="909" alt="image" src="https://github.com/user-attachments/assets/3f76aa05-4c4e-433d-9f43-a46ec6c20e2b" />
<img width="1902" height="898" alt="image" src="https://github.com/user-attachments/assets/e8788cd3-925a-4d18-a47c-0dd2f7696090" />
<img width="981" height="879" alt="image" src="https://github.com/user-attachments/assets/e4880cff-dae5-4f59-b648-43c4e9504059" />
<img width="1220" height="422" alt="image" src="https://github.com/user-attachments/assets/6c0ed483-7d79-4961-95c3-3e8e9e9307d2" />





ClientsVendes - Gestor de Clients i Vendes
==========================================

__ClientsVendes__ és una aplicació de gestió lleugera i eficient dissenyada per a petites empreses. Permet portar un control exhaustiu dels clients, les vendes i les despeses mitjançant una interfície web intuïtiva i una base de dades local robusta.

🚀 Característiques Principals
----------------------------

- __Gestió de Clients (CRUD):__ Creació, visualització i eliminació de clients de forma centralitzada. Guardar telèfon, correu, direcció i bloc de notes per a cada 
client de manera persistent.
- __Control de Vendes i Despeses:__ Registre detallat de transaccions associades a cada client: Producte o servei + preu de venda.
- __Despeses Habituals:__ Sistema per crear, guardar i suprimir despeses recurrents per agilitzar el flux de treball.
- __Exportació de Dades:__ Funcionalitat per exportar tota la informació a format Excel i realitzar còpies de seguretat de la base de dades.
- __Interfície Neta:__ Disseny minimalista i funcional pensat per a l'usuari final.

🛠️ Stack Tecnològic
------------------

L'aplicació està construïda amb tecnologies web modernes per garantir velocitat i facilitat d'instal·lació:

- __Frontend:__ HTML5, CSS3 i JavaScript (Vanilla).
- __Backend:__ Node.js.
- __Base de dades:__ SQLite (Base de dades local, sense necessitat de servidors externs).

📂 Estructura del Projecte
------------------------

L'arbre de directoris es compon dels següents elements clau:

- __server.js:__ Servidor principal en Node.js.
- __index.html / styles.css / script.js:__ Nucli de la interfície d'usuari.
- __Clients.db:__ Fitxer de la base de dades SQLite.
- __/uploads:__ Carpeta per a fitxers adjunts o documents.
- __/Base de Dades Mensual:__ Històrics i còpies de seguretat.

💻 Instal·lació i Ús
-------------------

__Requisits previs__

Cal tenir instal·lat Node.js al sistema.

### Passos per a la posada en marxa

1.  **Descarregar o clonar** el repositori a la teva màquina local.
2.  **Instal·lar les dependències** necessàries executant a la terminal:
    ```bash
    npm install
    ```
3.  **Iniciar el servidor**:
    ```bash
    node server.js
    ```
4.  **Accedir a l'aplicació**:
    Obre el navegador i entra a `http://localhost:3000` o utilitza l'accés directe `Gestió de Clients (LOCALHOST).url` inclòs a l'arrel del projecte.

---

## ⚙️ Configuració Addicional

Per a detalls tècnics sobre la instal·lació en entorns locals específics, consulta el fitxer:
📄 `INSTRUCCIONS-NODE-LOCAL.txt`
