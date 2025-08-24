# Razorpay Server Setup

## Environment Variables Setup

Since `.env` files are protected, you need to manually add these environment variables to your server.

### Option 1: Create a .env file manually

1. In your `Server` folder, create a new file called `.env`
2. Add the following content:

```bash
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xEWdAnsz4jtFW5
RAZORPAY_KEY_SECRET=BmsYZKN1f0XD6t7hhd51SxQA
RAZORPAY_ENV=test
```

### Option 2: Set environment variables in your terminal

Before starting the server, run these commands:

**Windows (Command Prompt):**

```cmd
set RAZORPAY_KEY_ID=rzp_test_xEWdAnsz4jtFW5
set RAZORPAY_KEY_SECRET=BmsYZKN1f0XD6t7hhd51SxQA
set RAZORPAY_ENV=test
```

**Windows (PowerShell):**

```powershell
$env:RAZORPAY_KEY_ID="rzp_test_xEWdAnsz4jtFW5"
$env:RAZORPAY_KEY_SECRET="BmsYZKN1f0XD6t7hhd51SxQA"
$env:RAZORPAY_ENV="test"
```

**Linux/Mac:**

```bash
export RAZORPAY_KEY_ID=rzp_test_xEWdAnsz4jtFW5
export RAZORPAY_KEY_SECRET=BmsYZKN1f0XD6t7hhd51SxQA
export RAZORPAY_ENV=test
```

## How It Works Now

1. **Frontend** fetches Razorpay key from server API (`/api/razorpay/config`)
2. **Server** provides the key from environment variables
3. **No hardcoded keys** in frontend code
4. **Secure** - secret key stays on server only

## Testing

1. Set the environment variables
2. Restart your server
3. Click the "Donate" button in the navbar
4. The frontend will automatically fetch the key from the server

## Production

When moving to production:

1. Change `RAZORPAY_ENV=live`
2. Update keys to your live Razorpay keys
3. Never commit the `.env` file to version control
