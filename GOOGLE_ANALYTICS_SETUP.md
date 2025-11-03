# Google Analytics 4 Setup Guide

## Step 1: Create Google Analytics Account

1. Go to https://analytics.google.com/
2. Click "Start measuring" or "Admin" → "Create Account"
3. Enter account name: "Rawabi Alwasit Company"
4. Configure property:
   - Property name: "Rawabi Alwasit Website"
   - Reporting time zone: (GMT+03:00) Riyadh
   - Currency: Saudi Riyal (SAR)
5. Business information:
   - Industry: Manufacturing / Industrial Supplies
   - Business size: Small/Medium
6. Click "Create" and accept terms

## Step 2: Get Measurement ID

After creating the property, you'll get a Measurement ID in format: `G-XXXXXXXXXX`

## Step 3: Add Tracking Code to Website

Once you have your Measurement ID, add it to the Google Analytics tracking code placeholder in all HTML files.

### Current Implementation:
The tracking code has been added to all pages with a placeholder: `G-XXXXXXXXXX`

### To Activate:
1. Replace `G-XXXXXXXXXX` with your actual Measurement ID
2. The code is already in place in all 28 pages

## Step 4: Test Implementation

1. Visit your website
2. Check Google Analytics Real-Time reports
3. Verify that visits are being tracked

## Step 5: Set Up Goals/Events

### Recommended Events to Track:
1. **Contact Form Submission** - When users submit the contact form
2. **WhatsApp Click** - When users click the WhatsApp button
3. **Phone Click** - When users click phone number
4. **Email Click** - When users click email
5. **Get Quote Click** - When users click "Get Quote" button

### How to Set Up:
1. Go to Google Analytics → Admin → Events
2. Create custom events for each action
3. Or use Enhanced Measurement (automatically tracks some events)

## Step 6: Link Google Search Console

1. Go to Google Analytics → Admin → Property Settings
2. Scroll to "Search Console" section
3. Click "Adjust Search Console"
4. Link your verified Search Console property

---

**Note:** The tracking code is ready in all HTML files. Just replace `G-XXXXXXXXXX` with your actual Measurement ID once you create the Analytics account.

