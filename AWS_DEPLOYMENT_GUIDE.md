# ☁️ AWS Deployment Guide - Academic Hub DMS

## 🎯 Overview

Deploy your Academic Hub DMS to AWS for **better performance**, **scalability**, and **reliability** than Render.

---

## 🏗️ AWS Architecture Options

### **Option 1: AWS Elastic Beanstalk (Recommended for Beginners)** ⭐
**Best for:** Quick deployment, automatic scaling, managed infrastructure

```
┌─────────────────────────────────────────────────────────────┐
│                     AWS Elastic Beanstalk                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  Load Balancer  │→ │  EC2 Instances  │→ │   RDS DB    │ │
│  │   (Auto SSL)    │  │  (Auto Scaling) │  │ (Postgres)  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│           ↓                    ↓                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   S3 (Static)   │  │ CloudWatch Logs │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

**Pros:**
- ✅ Easy setup (few commands)
- ✅ Automatic scaling
- ✅ Health monitoring
- ✅ Zero-downtime deployments
- ✅ Integrated with other AWS services

**Cons:**
- ⚠️ More expensive than bare EC2
- ⚠️ Less control over infrastructure

**Cost:** ~$25-50/month (Free tier available for 12 months)

---

### **Option 2: AWS EC2 + RDS (More Control)** 💪
**Best for:** Full control, cost optimization, custom configuration

```
┌─────────────────────────────────────────────────────────────┐
│                          Your VPC                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ Application LB  │→ │   EC2 Instance  │→ │   RDS DB    │ │
│  │  or CloudFront  │  │ (t2.micro/small)│  │ (Postgres)  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│           ↓                    ↓                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  S3 + CloudFront│  │  Route 53 (DNS) │                  │
│  │  (Static Files) │  │                 │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

**Pros:**
- ✅ Full control over everything
- ✅ Cost-effective (can use free tier)
- ✅ Better for production
- ✅ Highly customizable

**Cons:**
- ⚠️ More setup required
- ⚠️ Manual scaling
- ⚠️ Need to manage security

**Cost:** ~$15-30/month (Free tier available)

---

### **Option 3: AWS Lightsail (Simplest)** 🚀
**Best for:** Small projects, simple setup, predictable costs

```
┌─────────────────────────────────────────────┐
│         AWS Lightsail Instance              │
│  ┌───────────────────────────────────────┐  │
│  │  Django + Gunicorn + Nginx            │  │
│  │  PostgreSQL (same instance)           │  │
│  │  Static Files (S3 optional)           │  │
│  └───────────────────────────────────────┘  │
│           Fixed IP + SSL Certificate        │
└─────────────────────────────────────────────┘
```

**Pros:**
- ✅ Simplest AWS option
- ✅ Fixed pricing ($3.50-$10/month)
- ✅ Includes data transfer
- ✅ SSH access

**Cons:**
- ⚠️ Limited scaling
- ⚠️ Less powerful than EC2
- ⚠️ Fewer AWS integrations

**Cost:** $5-10/month (predictable)

---

## 🎯 Recommended Approach: **Elastic Beanstalk**

For your Academic Hub DMS, I recommend **AWS Elastic Beanstalk** because:
- Easy to set up
- Automatic scaling for growing users
- Integrated database (RDS)
- Automatic SSL certificates
- Good for both development and production

---

## 📋 Step-by-Step: Deploy to AWS Elastic Beanstalk

### **Prerequisites:**

1. **AWS Account**: Sign up at https://aws.amazon.com
2. **AWS CLI**: Install AWS Command Line Interface
3. **EB CLI**: Install Elastic Beanstalk CLI
4. **Your code**: Ready on your local machine

---

### **Step 1: Install AWS Tools**

```bash
# Install AWS CLI
# Mac:
brew install awscli

# Linux:
pip install awscli

# Windows:
# Download from: https://aws.amazon.com/cli/

# Install EB CLI
pip install awsebcli --upgrade --user

# Verify installation
aws --version
eb --version
```

---

### **Step 2: Configure AWS Credentials**

```bash
# Configure AWS CLI
aws configure

# You'll be prompted for:
# - AWS Access Key ID: [Get from AWS Console → IAM]
# - AWS Secret Access Key: [Get from AWS Console → IAM]
# - Default region: us-east-1 (or your preferred region)
# - Default output format: json
```

**How to get AWS keys:**
1. Go to AWS Console → IAM → Users
2. Click your username
3. Security credentials → Create access key
4. Download and save the keys

---

### **Step 3: Prepare Your Django App**

Create `.ebextensions` directory for AWS configuration:

```bash
mkdir .ebextensions
```

Create `.ebextensions/django.config`:

```yaml
option_settings:
  aws:elasticbeanstalk:container:python:
    WSGIPath: Alx_Capstone_project.wsgi:application
  aws:elasticbeanstalk:application:environment:
    DJANGO_SETTINGS_MODULE: Alx_Capstone_project.settings
    PYTHONPATH: /var/app/current:$PYTHONPATH
  aws:elasticbeanstalk:environment:proxy:staticfiles:
    /static: staticfiles

container_commands:
  01_migrate:
    command: "source /var/app/venv/*/bin/activate && python manage.py migrate --noinput"
    leader_only: true
  02_collectstatic:
    command: "source /var/app/venv/*/bin/activate && python manage.py collectstatic --noinput"
    leader_only: true
  03_create_superuser:
    command: "source /var/app/venv/*/bin/activate && python manage.py create_demo_users || true"
    leader_only: true
```

Create `.ebextensions/01_packages.config`:

```yaml
packages:
  yum:
    postgresql-devel: []
    python3-devel: []
```

---

### **Step 4: Update Django Settings for AWS**

Add to your `settings.py`:

```python
# AWS Elastic Beanstalk configuration
if 'RDS_HOSTNAME' in os.environ:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ['RDS_DB_NAME'],
            'USER': os.environ['RDS_USERNAME'],
            'PASSWORD': os.environ['RDS_PASSWORD'],
            'HOST': os.environ['RDS_HOSTNAME'],
            'PORT': os.environ['RDS_PORT'],
        }
    }

# Allowed hosts for AWS
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '.elasticbeanstalk.com',
    '.amazonaws.com',
    # Add your custom domain here
]

# AWS S3 Static Files (optional but recommended)
if not DEBUG:
    AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME', 'us-east-1')
    AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
    
    # Static files
    STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/static/'
    STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
```

---

### **Step 5: Initialize Elastic Beanstalk**

```bash
# Initialize EB in your project
eb init

# You'll be prompted:
# 1. Select a default region: (choose closest to your users)
# 2. Application name: academic-hub-dms
# 3. Python version: Python 3.11
# 4. Set up SSH: Yes (recommended)
```

---

### **Step 6: Create Environment with Database**

```bash
# Create environment with RDS database
eb create academic-hub-prod \
  --database \
  --database.engine postgres \
  --database.version 14 \
  --instance_type t2.small \
  --region us-east-1

# This will:
# - Create EC2 instance
# - Create RDS PostgreSQL database
# - Set up load balancer
# - Configure security groups
# - Deploy your application
```

**Wait 10-15 minutes for environment creation...**

---

### **Step 7: Set Environment Variables**

```bash
# Set Django secret key
eb setenv SECRET_KEY="your-secret-key-here"

# Set Google Drive credentials (base64 encoded)
eb setenv GOOGLE_CREDENTIALS_BASE64="$(cat credentials.json | base64)"
eb setenv GOOGLE_TOKEN_BASE64="$(cat token.pickle | base64)"

# Set Django settings
eb setenv DEBUG=False
eb setenv DJANGO_SETTINGS_MODULE=Alx_Capstone_project.settings

# Set allowed hosts
eb setenv ALLOWED_HOSTS=".elasticbeanstalk.com,.amazonaws.com"

# Optional: Set CORS origins for frontend
eb setenv CORS_ALLOWED_ORIGINS="https://your-frontend-domain.com"
```

---

### **Step 8: Deploy Your Application**

```bash
# Deploy to Elastic Beanstalk
eb deploy

# Wait for deployment to complete...
# This will:
# - Upload your code
# - Install dependencies
# - Run migrations
# - Collect static files
# - Restart servers
```

---

### **Step 9: Open Your Application**

```bash
# Open in browser
eb open

# Or get the URL
eb status

# Your app will be at:
# http://academic-hub-prod.us-east-1.elasticbeanstalk.com
```

---

### **Step 10: Enable HTTPS (SSL)**

```bash
# Get a free SSL certificate from AWS Certificate Manager
# 1. Go to AWS Console → Certificate Manager
# 2. Request a certificate for your domain
# 3. Validate domain ownership
# 4. Add certificate to load balancer

# Or use EB CLI:
eb config

# Add under listeners:
# HTTPSListener:
#   Protocol: HTTPS
#   Port: 443
#   SSLCertificateId: arn:aws:acm:region:account:certificate/id
```

---

## 🗄️ Database Management

### **Access RDS Database:**

```bash
# Get database connection info
eb printenv | grep RDS

# Connect via psql
psql -h RDS_HOSTNAME \
     -U RDS_USERNAME \
     -d RDS_DB_NAME \
     -p RDS_PORT
```

### **Backup Database:**

```bash
# RDS automatically creates daily backups
# Manual snapshot:
aws rds create-db-snapshot \
  --db-instance-identifier your-db-instance \
  --db-snapshot-identifier manual-backup-$(date +%Y%m%d)
```

---

## 📁 Static Files with S3 (Optional)

For better performance, serve static files from S3:

### **1. Create S3 Bucket:**

```bash
# Create bucket
aws s3 mb s3://academic-hub-static

# Enable public access
aws s3api put-bucket-policy \
  --bucket academic-hub-static \
  --policy file://bucket-policy.json
```

### **2. Install django-storages:**

```bash
pip install django-storages boto3
```

Add to `requirements.txt`:
```
django-storages==1.14
boto3==1.34
```

### **3. Update settings.py:**

```python
# S3 Configuration
AWS_STORAGE_BUCKET_NAME = 'academic-hub-static'
AWS_S3_REGION_NAME = 'us-east-1'
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
AWS_DEFAULT_ACL = 'public-read'

STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/'
```

### **4. Collect static files to S3:**

```bash
python manage.py collectstatic --noinput
```

---

## 🌐 Custom Domain Setup

### **Option 1: Route 53 (AWS DNS)**

```bash
# 1. Register domain in Route 53 or transfer existing domain
# 2. Create hosted zone
aws route53 create-hosted-zone --name yourdomain.com

# 3. Create alias record pointing to EB environment
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR_ZONE_ID \
  --change-batch file://dns-record.json
```

### **Option 2: External DNS (Namecheap, GoDaddy, etc.)**

1. Get EB environment URL: `eb status`
2. In your DNS provider, create CNAME record:
   - Name: `www` or `@`
   - Value: `academic-hub-prod.us-east-1.elasticbeanstalk.com`

---

## 📊 Monitoring & Logs

### **View Logs:**

```bash
# View recent logs
eb logs

# Save logs to file
eb logs --all > eb-logs.txt

# Stream logs in real-time
eb ssh
tail -f /var/log/web.stdout.log
```

### **CloudWatch Monitoring:**

- Go to AWS Console → CloudWatch
- View metrics for:
  - CPU usage
  - Memory usage
  - Network traffic
  - Request count
  - Error rates

### **Set up Alarms:**

```bash
# CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name high-cpu \
  --alarm-description "Alarm when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

---

## 💰 Cost Optimization

### **Free Tier (First 12 Months):**
- ✅ 750 hours EC2 (t2.micro)
- ✅ 750 hours RDS (db.t2.micro)
- ✅ 20GB database storage
- ✅ 5GB S3 storage

### **After Free Tier:**
- EC2 t2.small: ~$17/month
- RDS db.t2.micro: ~$15/month
- Load Balancer: ~$18/month
- **Total: ~$50/month**

### **Cost Reduction Tips:**
1. Use **Reserved Instances** (save 30-70%)
2. **Spot Instances** for development
3. Enable **Auto Scaling** (scale down when idle)
4. Use **S3 Intelligent-Tiering**
5. Delete unused **snapshots** and **volumes**

---

## 🔒 Security Best Practices

### **1. Security Groups:**
```bash
# Only allow HTTPS from anywhere
# Allow SSH only from your IP
# Database only accessible from app servers
```

### **2. IAM Roles:**
- Use IAM roles instead of access keys
- Principle of least privilege
- Rotate credentials regularly

### **3. Environment Variables:**
```bash
# Never commit secrets to Git
# Use EB environment variables
# Encrypt sensitive data
```

### **4. Database Security:**
- Enable encryption at rest
- Use SSL for connections
- Regular backups
- Restricted security groups

---

## 🚀 Deployment Workflow

### **Development → Production:**

```bash
# 1. Develop locally
git add .
git commit -m "New feature"

# 2. Push to Git
git push origin main

# 3. Deploy to AWS
eb deploy

# 4. Monitor deployment
eb health

# 5. Check logs if issues
eb logs
```

### **Zero-Downtime Deployment:**

Elastic Beanstalk automatically does rolling updates:
1. Deploys to one instance
2. Tests health check
3. If healthy, deploys to next instance
4. Keeps old version running until new version is healthy

---

## 📱 Frontend Deployment (React)

### **Option 1: S3 + CloudFront (Recommended)**

```bash
# Build React app
cd academic-hub-ui
npm run build

# Upload to S3
aws s3 sync dist/ s3://academic-hub-frontend/

# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name academic-hub-frontend.s3.amazonaws.com
```

**Benefits:**
- Global CDN (fast worldwide)
- HTTPS included
- Very cheap (~$1/month)

### **Option 2: AWS Amplify**

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

**Benefits:**
- Automatic builds from Git
- Preview deployments
- Built-in CI/CD

---

## 🆚 AWS vs Render Comparison

| Feature | AWS Elastic Beanstalk | Render |
|---------|----------------------|--------|
| **Setup Complexity** | Medium | Easy |
| **Cost** | $50/month | $25/month |
| **Free Tier** | 12 months | 750 hours/month |
| **Scaling** | Excellent | Limited |
| **Performance** | Excellent | Good |
| **Database** | RDS (managed) | PostgreSQL (managed) |
| **SSL** | Free (ACM) | Free (Let's Encrypt) |
| **Monitoring** | CloudWatch | Basic |
| **Control** | Full control | Limited |
| **Global CDN** | CloudFront | No |
| **Enterprise Ready** | ✅ Yes | ⚠️ Limited |

---

## 🎯 Quick Start Commands

```bash
# Install tools
pip install awscli awsebcli

# Configure AWS
aws configure

# Initialize project
eb init -p python-3.11 academic-hub-dms

# Create environment
eb create academic-hub-prod --database

# Set environment variables
eb setenv SECRET_KEY="your-key" DEBUG=False

# Deploy
eb deploy

# Open app
eb open
```

---

## 🐛 Troubleshooting

### Issue: Deployment fails
```bash
# Check logs
eb logs

# SSH into instance
eb ssh
sudo tail -f /var/log/web.stdout.log
```

### Issue: Database connection fails
```bash
# Verify RDS variables
eb printenv | grep RDS

# Check security groups
# Ensure EC2 can connect to RDS
```

### Issue: Static files not loading
```bash
# Collect static files
eb ssh
source /var/app/venv/*/bin/activate
python manage.py collectstatic --noinput
```

---

## 📚 Additional Resources

- **AWS Documentation**: https://docs.aws.amazon.com/elasticbeanstalk/
- **AWS Free Tier**: https://aws.amazon.com/free/
- **Elastic Beanstalk Pricing**: https://aws.amazon.com/elasticbeanstalk/pricing/
- **Django on AWS**: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-python-django.html

---

## ✅ Deployment Checklist

- [ ] AWS account created
- [ ] AWS CLI installed and configured
- [ ] EB CLI installed
- [ ] `.ebextensions` created
- [ ] `settings.py` updated for AWS
- [ ] `requirements.txt` updated
- [ ] EB initialized (`eb init`)
- [ ] Environment created (`eb create`)
- [ ] Environment variables set
- [ ] Application deployed (`eb deploy`)
- [ ] Database migrated
- [ ] Static files collected
- [ ] SSL certificate configured
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up
- [ ] Backups enabled
- [ ] Google Drive credentials added

---

**Ready to deploy to AWS? Let me know and I can help you through each step!** 🚀
