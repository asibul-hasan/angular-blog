# Refresh Token Implementation Guide

This document explains how to implement the refresh token endpoint for the Angular blog application.

## Overview

The frontend has been updated to support automatic token refresh. When a request fails with a 401 Unauthorized error, the system will automatically attempt to refresh the token using the ` /auth/refresh-token` endpoint.

## Backend Implementation Requirements

### 1. Database Schema Update

Add a refresh token field to your user model:

```javascript
// Example MongoDB schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  refreshToken: String, // Add this field
  // ... other fields
});
```

### 2. Environment Variables

Add the following environment variables:

```env
REFRESH_TOKEN_SECRET=your-refresh-token-secret-key
REFRESH_TOKEN_EXPIRES_IN=7d
```

### 3. Refresh Token Endpoint Implementation

Create a new endpoint `/auth/refresh-token` with the following logic:

```javascript
// Example Express.js implementation
app.post("/api/auth/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find user by ID from the refresh token
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // 1 hour expiration
    );

    // Optionally generate new refresh token
    const newRefreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      body: {
        token: newAccessToken,
        refreshToken: newRefreshToken,
      },
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
});
```

### 4. Login Endpoint Update

Update your login endpoint to also generate and return a refresh token:

```javascript
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate user credentials
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate access token
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // 1 hour expiration
    );

    // Generate refresh token
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

    // Save refresh token to user document
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      body: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: accessToken,
        refreshToken: refreshToken,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
```

### 5. Logout Endpoint Update

Update your logout endpoint to invalidate the refresh token:

```javascript
app.post("/api/auth/logout", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      // Decode token to get user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Remove refresh token from database
      await User.findByIdAndUpdate(decoded.userId, { refreshToken: null });
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
```

## Security Considerations

1. **Use HTTPS**: Always use HTTPS in production to protect tokens in transit
2. **Short-lived Access Tokens**: Keep access tokens short-lived (1 hour as implemented)
3. **Long-lived Refresh Tokens**: Refresh tokens can be longer-lived but should be rotated
4. **Token Storage**: Store refresh tokens securely in the database
5. **Token Revocation**: Implement a way to revoke refresh tokens when needed
6. **Rate Limiting**: Implement rate limiting on the refresh token endpoint to prevent abuse

## Testing

To test the refresh token functionality:

1. Login to get both access and refresh tokens
2. Wait for the access token to expire (or manually expire it)
3. Make a request that requires authentication
4. The frontend should automatically refresh the token and retry the request

## Frontend Integration

The frontend automatically handles:

- Token refresh when a 401 error occurs
- Storing refresh tokens in localStorage
- Periodic token refresh (every 55 minutes)
- Automatic logout when refresh fails

No additional frontend changes are needed.
