# Oracle Cloud Deployment Guide for MB Barbershop

This guide will help you deploy MB Barbershop to Oracle Cloud's Always Free tier.

## Prerequisites

- Oracle Cloud account (sign up at cloud.oracle.com)
- SSH client installed
- Basic command line knowledge

## Step 1: Create Oracle Autonomous Database

### 1.1 Sign in to Oracle Cloud
1. Go to [cloud.oracle.com](https://cloud.oracle.com)
2. Sign in to your account
3. Navigate to the Oracle Cloud Console

### 1.2 Create Autonomous Database
1. Click **Hamburger Menu** → **Oracle Database** → **Autonomous Database**
2. Click **Create Autonomous Database**
3. Configure:
   - **Compartment**: Select your compartment
   - **Display Name**: `MB-Barbershop-DB`
   - **Database Name**: `TRIMTIMEDB`
   - **Workload Type**: Transaction Processing
   - **Deployment Type**: Shared Infrastructure
   - **Always Free**: Toggle ON
   - **Database Version**: 19c or later
   - **OCPU Count**: 1
   - **Storage**: 20 GB
4. Set **Admin Password** (save this securely)
5. Click **Create Autonomous Database**
6. Wait for provisioning (green status)

### 1.3 Download Wallet
1. Click your database name
2. Click **DB Connection**
3. Click **Download Wallet**
4. Set wallet password (save this)
5. Download and extract the wallet ZIP

### 1.4 Run Schema Script
1. Click **Database Actions** → **SQL**
2. Copy contents of `oracle-schema.sql`
3. Paste and run in SQL worksheet
4. Verify tables created successfully

## Step 2: Create Compute Instance

### 2.1 Create Instance
1. **Hamburger Menu** → **Compute** → **Instances**
2. Click **Create Instance**
3. Configure:
   - **Name**: `trimtime-server`
   - **Compartment**: Your compartment
   - **Availability Domain**: Any
   - **Image**: Oracle Linux 8 or Ubuntu 22.04
   - **Shape**: VM.Standard.A1.Flex (Always Free)
   - **OCPUs**: 1
   - **Memory**: 6 GB
4. **Networking**:
   - Select your VCN (or create new)
   - Assign public IPv4 address: YES
5. **SSH Keys**:
   - Upload your SSH public key OR generate new pair
   - Download private key if generated
6. Click **Create**
7. Note the **Public IP Address**

### 2.2 Configure Security List
1. Click your instance name
2. Click the **Subnet** link
3. Click your **Security List**
4. Click **Add Ingress Rules**
5. Add rule:
   - **Source CIDR**: `0.0.0.0/0`
   - **Destination Port Range**: `3000`
   - **Description**: MB Barbershop App
6. Click **Add Ingress Rules**

### 2.3 Configure Firewall on Instance
SSH into your instance:
```bash
ssh -i your-private-key.key opc@YOUR_PUBLIC_IP
```

For Oracle Linux:
```bash
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

For Ubuntu:
```bash
sudo ufw allow 3000/tcp
sudo ufw enable
```

## Step 3: Install Dependencies

### 3.1 Update System
```bash
sudo yum update -y  # Oracle Linux
# OR
sudo apt update && sudo apt upgrade -y  # Ubuntu
```

### 3.2 Install Node.js
```bash
# Download and install Node.js 20.x
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -  # Oracle Linux
sudo yum install -y nodejs

# OR for Ubuntu:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3.3 Verify Installation
```bash
node --version
npm --version
```

## Step 4: Deploy Application

### 4.1 Transfer Files
From your local machine:
```bash
cd "c:\Users\ycb proj\Desktop\New folder (4)"
scp -i your-private-key.key -r trimtime opc@YOUR_PUBLIC_IP:/home/opc/
```

### 4.2 Connect Database
SSH back into the server:
```bash
ssh -i your-private-key.key opc@YOUR_PUBLIC_IP
cd trimtime
```

Install Oracle Instant Client (if using Oracle DB):
```bash
# Download Oracle Instant Client
wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basic-linux.x64-21.1.0.0.0.zip
unzip instantclient-basic-linux.x64-21.1.0.0.0.zip
sudo mv instantclient_21_1 /opt/oracle/
```

Install Oracle database driver:
```bash
npm install oracledb
```

### 4.3 Setup Environment Variables
Create `.env.local`:
```bash
nano .env.local
```

Add:
```env
# Oracle Database
ORACLE_USER=ADMIN
ORACLE_PASSWORD=your_admin_password
ORACLE_CONNECT_STRING=(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=your-db-host.oraclecloud.com))(connect_data=(service_name=your_service_name))(security=(ssl_server_dn_match=yes)))

# App
NEXT_PUBLIC_APP_URL=http://YOUR_PUBLIC_IP:3000
```

### 4.4 Install Dependencies and Build
```bash
npm install
npm run build
```

## Step 5: Run Application

### 5.1 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 5.2 Start Application
```bash
pm2 start npm --name "trimtime" -- start
pm2 startup
pm2 save
```

### 5.3 View Logs
```bash
pm2 logs trimtime
pm2 status
```

## Step 6: Access Your Website

Open browser and navigate to:
```
http://YOUR_PUBLIC_IP:3000
```

You should see the MB Barbershop homepage!

## Step 7: (Optional) Setup Domain and SSL

### 7.1 Point Domain to Server
1. Get a domain (e.g., from Freenom, Namecheap)
2. Add A record: `@` → `YOUR_PUBLIC_IP`
3. Add A record: `www` → `YOUR_PUBLIC_IP`

### 7.2 Install Nginx
```bash
sudo yum install nginx -y  # Oracle Linux
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 7.3 Configure Nginx
```bash
sudo nano /etc/nginx/conf.d/trimtime.conf
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### 7.4 Install SSL Certificate
```bash
sudo yum install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Monitoring and Maintenance

### Check Application Status
```bash
pm2 status
pm2 logs trimtime
```

### Restart Application
```bash
pm2 restart trimtime
```

### Update Application
```bash
cd /home/opc/trimtime
git pull  # if using git
npm install
npm run build
pm2 restart trimtime
```

### Database Backup
1. Go to Oracle Cloud Console
2. Navigate to your Autonomous Database
3. Click **More Actions** → **Create Manual Backup**

## Troubleshooting

### Application Won't Start
```bash
pm2 logs trimtime --lines 50
```

### Port Not Accessible
```bash
# Check firewall
sudo firewall-cmd --list-all

# Check if app is running
pm2 status
netstat -tulpn | grep 3000
```

### Database Connection Issues
- Verify wallet is in correct location
- Check connection string in `.env.local`
- Ensure database is running in Oracle Cloud Console

## Cost Estimation

**Always Free Resources:**
- 1x Autonomous Database (1 OCPU, 20 GB)
- 2x Compute VMs (1 OCPU each, 6 GB RAM)
- 10 GB Block Volume
- 10 TB/month outbound data transfer

**Monthly Cost: $0** (if staying within Always Free limits)

## Support

For Oracle Cloud support:
- [Oracle Cloud Documentation](https://docs.oracle.com/en-us/iaas/)
- [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/)

---

**Congratulations! Your MB Barbershop barbershop website is now live on Oracle Cloud! 🎉**
