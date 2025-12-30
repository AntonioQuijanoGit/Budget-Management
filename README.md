# Budget Management

Web application for budget management and expense tracking built with Angular 18. Features a modern, responsive interface with light and dark mode support.

## Features

### Financial Management
- **Dashboard** - Overview with quick statistics, charts, and financial summary
- **Transactions** - Complete record of income and expenses with search and filters
- **Categories** - Management of custom categories with icons and colors
- **Budgets** - Budget setup and tracking
- **Financial Goals** - Setting and monitoring financial objectives
- **Recurring Transactions** - Configuration of automatic periodic transactions
- **Reminders** - Notification and alert system

### Additional Features
- **Statistics** - Charts and analysis of expenses and income
- **Calendar** - Monthly view of transactions
- **Browser Notifications** - Alerts and reminders
- **Auto-generation** - Automatic creation of recurring transactions
- **Light/Dark Mode** - Theme switching
- **Responsive Design** - Works on desktop, tablet, and mobile

## Technologies

- Angular 18
- TypeScript 5.4
- RxJS
- Angular Signals
- Tailwind CSS
- Chart.js
- Lucide Angular
- nginx

## Installation

```bash
# Clone repository
git clone https://github.com/AntonioQuijanoGit/Budget-Management.git
cd Budget-Management

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200`

## Build

```bash
# Build for production
npm run build
```

Production files are generated in the `dist/` directory

## Testing



## Docker

The application can be run using Docker for easy deployment and consistent environment.

### Requirements

- [Docker](https://www.docker.com/get-started) installed
- [Docker Compose](https://docs.docker.com/compose/install/) (optional, but recommended)

### Building the image

```bash
# Build Docker image
docker build -t budget-management .
```

### Run with Docker

```bash
# Run the container
docker run -d -p 8080:80 --name budget-management budget-management
```

The application will be available at `http://localhost:8080`

### Run with Docker Compose

```bash
# Build and run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### Useful Commands

```bash
# View running containers
docker ps

# Stop the container
docker stop budget-management

# Remove the container
docker rm budget-management

# View logs
docker logs budget-management

# Access container shell
docker exec -it budget-management sh
```

## Usage

1. Set your total available budget
2. Add individual expenses with name and amount
3. View remaining budget, total spent, and usage percentage
4. Monitor your progress with visual indicators

## Project Structure

- `src/app/pages/` - Application pages (Dashboard, Transactions, Categories, Budgets, Goals, etc.)
- `src/app/features/` - Feature modules (transactions, categories, goals, recurring, reminders)
- `src/app/components/ui/` - Reusable UI components (Button, Card, Modal, Toast, etc.)
- `src/app/core/` - Core modules (store, models, animations)
- `src/app/services/` - Business logic services
- `src/styles/` - Global styles and design tokens


## Author

**Antonio Quijano**

---

Built with Angular
