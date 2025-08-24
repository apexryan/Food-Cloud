# Razorpay Integration Setup

## Quick Setup

1. **Get Your Razorpay Keys**

   - Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Sign up/Login to your account
   - Go to Settings → API Keys
   - Copy your Key ID and Key Secret

2. **Update Configuration**
   - Open `src/config/razorpay.js`
   - Replace the placeholder keys with your actual keys:

```javascript
export const RAZORPAY_CONFIG = {
  test: {
    key: "rzp_test_YOUR_ACTUAL_TEST_KEY",
    secret: "YOUR_ACTUAL_TEST_SECRET",
  },
  live: {
    key: "rzp_live_YOUR_ACTUAL_LIVE_KEY",
    secret: "YOUR_ACTUAL_LIVE_SECRET",
  },
};
```

3. **Test the Integration**
   - Click the "Donate" button in the navbar
   - Enter an amount
   - Click "Donate Now"
   - Razorpay payment form will open
   - Use test card numbers for testing

## Test Card Numbers

For testing, you can use these test card numbers:

- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **Name**: Any name

## Features

- ✅ Simple donation button in navbar
- ✅ Mobile responsive
- ✅ Amount validation
- ✅ Secure payment processing
- ✅ Success/failure handling
- ✅ Test and live environment support

## How It Works

1. User clicks "Donate" button
2. Dialog opens to enter amount
3. Razorpay checkout opens
4. User completes payment
5. Success message shows with payment ID
6. Dialog closes automatically

## Security Notes

- Never commit your actual Razorpay keys to version control
- Use environment variables in production
- The secret key is only needed on the backend (if you add server-side verification later)
- Frontend only needs the public key ID

## Customization

You can customize:

- Button appearance and position
- Dialog styling
- Payment options
- Success/failure messages
- Currency and amount limits
