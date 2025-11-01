# MB Barbershop - Barbershop Booking System 💈

A clean and minimal barbershop booking website for local barbers in Addis Ababa, built with Next.js and designed to be hosted on Oracle Cloud.

## Features ✨

- **🏠 Home Page**: Welcoming hero section with shop information
- **💇 Service Catalogue**: Dynamic showcase of all available services
- **✂️ Easy Booking**: Simple booking form (no login required)
- **🔁 Manage Bookings**: Customers can view/edit their bookings via phone number
- **🧑‍🔧 Admin Dashboard**: Full CRUD management for services and bookings
- **📱 Responsive Design**: Works perfectly on all devices

## Tech Stack 🛠

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4 (Poppins font)
- **Language**: TypeScript
- **Database**: Oracle Autonomous Database (production) / In-memory (development)
- **Hosting**: Oracle Cloud (Always Free tier)

## Getting Started 🚀

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd trimtime
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure 📂

```
trimtime/
├── app/
│   ├── api/              # API routes
│   │   ├── bookings/     # Bookings CRUD endpoints
│   │   └── services/     # Services CRUD endpoints
│   ├── admin/            # Admin dashboard page
│   ├── book/             # Booking form page
│   ├── catalogue/        # Services catalogue page
│   ├── manage/           # Manage bookings page
│   ├── success/          # Booking confirmation page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── lib/
│   └── db.ts             # Database utilities
├── oracle-schema.sql     # Oracle database schema
├── package.json
└── README.md
```

## Pages Overview 📄

### 1. **Home (`/`)**
- Hero section with branding
- Quick links to booking and catalogue
- Operating hours (2:00 PM - 12:00 AM)

### 2. **Catalogue (`/catalogue`)**
- Grid display of all services
- Shows name, description, and price
- Direct "Book This" buttons

### 3. **Book (`/book`)**
- Simple booking form
- Name, phone, service, date, time
- Validates working hours
- Redirects to success page

### 4. **Success (`/success`)**
- Booking confirmation
- Shows all appointment details
- Links to manage bookings

### 5. **Manage (`/manage`)**
- Search bookings by phone number
- Edit appointment details
- Cancel bookings

### 6. **Admin (`/admin`)**
- **Login**: Name: `Yeamlak`, Phone: `904120227`
- **Bookings Tab**: View, filter, update status, delete bookings
- **Services Tab**: Add, edit, delete services

## Database Schema 🗄

### Services Table
```sql
- service_id: VARCHAR2(36) PRIMARY KEY
- name: VARCHAR2(100)
- description: VARCHAR2(255)
- price: NUMBER(10,2)
- image_url: VARCHAR2(255)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Bookings Table
```sql
- booking_id: VARCHAR2(36) PRIMARY KEY
- name: VARCHAR2(100)
- phone: VARCHAR2(20)
- service: VARCHAR2(100)
- date_field: DATE
- time_field: VARCHAR2(10)
- status: VARCHAR2(20) [Active/Cancelled/Completed]
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## Oracle Cloud Deployment ☁️

### Setup Oracle Autonomous Database

1. **Create Oracle Cloud Account**
   - Sign up at [cloud.oracle.com](https://cloud.oracle.com)
   - Use Always Free tier

2. **Create Autonomous Database**
   - Go to Oracle Autonomous Database
   - Create database (Always Free option)
   - Download wallet credentials

3. **Run Schema Script**
   - Connect to your Oracle database
   - Execute `oracle-schema.sql`

4. **Update Database Connection**
   - Replace the mock database in `lib/db.ts` with Oracle connection
   - Use environment variables for credentials

### Deploy to Oracle Compute

1. **Create Compute Instance**
   ```bash
   # Oracle Always Free ARM VM
   # 1 OCPU, 1GB RAM
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Upload Project**
   ```bash
   scp -r trimtime/ user@your-oracle-ip:/home/user/
   ```

4. **Build and Run**
   ```bash
   cd trimtime
   npm install
   npm run build
   npm start
   ```

5. **Setup PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   pm2 start npm --name "trimtime" -- start
   pm2 startup
   pm2 save
   ```

6. **Configure Firewall**
   ```bash
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT
   sudo netfilter-persistent save
   ```

## Environment Variables 🔐

Create a `.env.local` file:

```env
# Oracle Database Connection
ORACLE_USER=your_db_user
ORACLE_PASSWORD=your_db_password
ORACLE_CONNECT_STRING=your_connection_string

# Application
NEXT_PUBLIC_APP_URL=http://your-domain.com
```

## Admin Credentials 🔑

- **Name**: Yeamlak
- **Phone**: 904120227

## Working Hours ⏰

Monday - Sunday: **2:00 PM - 12:00 AM (EAT)**

## Default Services 💈

1. Fade Cut - 300 Birr
2. Classic Trim - 250 Birr
3. Kids Cut - 200 Birr
4. Beard Line-Up - 200 Birr
5. Full Package - 500 Birr
6. Pattern Cut - 400 Birr
7. Afro Shaping - 350 Birr

## Future Enhancements 🚀

- [ ] SMS notifications for bookings
- [ ] Photo uploads for services
- [ ] Multiple barber support
- [ ] Customer ratings and reviews
- [ ] Loyalty program
- [ ] Payment integration

## License 📝

© 2025 MB Barbershop. All rights reserved.

## Support 💬

For questions or issues, please contact the administrator.

---

**Built with ❤️ for local barbers in Addis Ababa**
