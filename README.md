# DUMLAO_TSA_Technical_Exam

## Project Overview
A technical examination project built with Next.js, React, and TypeScript. The application features data visualization using Chart.js and modern UI components styled with TailwindCSS.

The scope of the project is to create a To-do List application capable of adding, updating, and deleting task/s. Visualization was also added for the user to easily assess their progress.

## Technologies Used
- [Next.js](https://nextjs.org/) (v16.0.1)
- [React](https://reactjs.org/) (v19.2.0)
- [TypeScript](https://www.typescriptlang.org/)
- [Chart.js](https://www.chartjs.org/) with [react-chartjs-2](https://react-chartjs-2.js.org/)
- [TailwindCSS](https://tailwindcss.com/)

## Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- npm or yarn package manager

### Installation
1. Clone the repository.

2. Ensure that the device being used has Node.js installed.

3. Install dependencies:
   1. cd dumlao_technical_exam
   2. npm install
        # or
      yarn install

4. Run script **'npm run build'**

5. Open the application in production build **'npm start'**

### Available Scripts
- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm start` - Runs the built application in production mode
- `npm run lint` - Runs ESLint to check code quality

### Development
The application is structured as follows:
- `app/` - Contains the main application code
  - `components/` - Reusable UI components
  - `globals.css` - Global styles
  - `layout.tsx` - Root layout component
  - `page.tsx` - Main page component

### Future Improvements
The application was built on a very simple basis. Due to this, interactions with the application are minimal, and is limited to mostly listing down tasks. However, future improvements can include:
  - implementing user-defined categories 
  - enhancing tasks statuses to inform users of their pending tasks (e.g. include an "Urgent" status for tasks that are near the deadline)
  - providing different layouts to suit users' preferences
  - due to the scale of the project, the storage used for this application is through saving a JSON file stored in the local storage of the browser. In the future, a database can be used to provide a robust data storage, and use an API in order to create a secure data access. It will also improve the application when implemented through an MVC (Model-View-Controller) architecture.
  - caching can also be used if a server was implemented to improve data retrieval efficiency.

## Author
Christian John Dumlao