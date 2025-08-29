# 🔄 Feature Reuse Guide - Running Login + Create Post

## 🎯 **Reusing Login Feature for Post Creation**

You can reuse the existing `@login.feature` before running `@create-post-desktop.feature` in several ways:

## 🚀 **Method 1: Sequential Feature Execution**

### **Run Both Features in Sequence**
```bash
# Local environment - Login first, then create post
npm run test:login-then-create-post:local

# Live environment - Login first, then create post  
npm run test:login-then-create-post:live

# Manual command
TEST_ENV=local cucumber-js features/login.feature features/create-post-desktop.feature --require step-definitions --require support
```

### **How It Works:**
1. **First**: Runs `features/login.feature` - User logs in successfully
2. **Second**: Runs `features/create-post-desktop.feature` - User is already logged in from previous step
3. **Browser session persists** between features (same browser context)

## 🎯 **Method 2: Tag-Based Execution**

### **Run Specific Scenarios by Tags**
```bash
# Run login scenario first, then create-post scenarios
cucumber-js --tags "@login" --require step-definitions --require support
cucumber-js --tags "@create-post" --require step-definitions --require support

# Or run both tags in one command
cucumber-js --tags "@login or @create-post" --require step-definitions --require support
```

## 🔧 **Method 3: Update Create-Post Background**

### **Option A: Reference Login in Background**
```gherkin
# In create-post-desktop.feature
Background:
  # Assume user is already logged in from previous feature run
  Given I navigate to the new post creation page
```

### **Option B: Check Login State**
```gherkin  
# In create-post-desktop.feature
Background:
  Given I verify I am logged in to the system
  And I navigate to the new post creation page
```

## 📋 **Recommended Approach**

### **Best Practice: Sequential Feature Execution**

**Why this works best:**
- ✅ **Reuses existing login.feature** without modification
- ✅ **Browser session persists** between features
- ✅ **Clear separation of concerns** - login vs post creation
- ✅ **Easy to maintain** - no duplicate login code
- ✅ **Flexible testing** - can run login or post creation independently

### **Commands to Use:**
```bash
# Complete flow - login then create post (local)
npm run test:login-then-create-post:local

# Complete flow - login then create post (live)  
npm run test:login-then-create-post:live

# Test just login
npm run test:local:login

# Test just post creation (assumes already logged in)
npm run test:create-post:local
```

## 🎯 **Feature Execution Order**

### **1. Login Feature Runs First**
```gherkin
# features/login.feature
@smoke @login @happy-path
Scenario: Successful login to access post creation
  Given I am on the chuannhadat.com homepage
  When I click on the login button
  # ... login steps ...
  Then I should be successfully logged in
```

### **2. Create Post Feature Runs Second**
```gherkin
# features/create-post-desktop.feature  
Background:
  # User is already logged in from previous feature
  Given I navigate to the new post creation page

@smoke @create-post @desktop @happy-path
Scenario: Successfully create a new property post
  # ... post creation steps ...
```

## 🔄 **Browser Session Continuity**

### **How Session Persists:**
1. **Login feature completes** - User logged in, session established
2. **Browser context remains open** - Cookies, localStorage, sessionStorage preserved
3. **Create post feature starts** - Same browser, same session
4. **Login state maintained** - `[data-testid="userLoggedIn"]` still present

## 📊 **Execution Examples**

### **Sequential Execution:**
```bash
# This runs both features in order:
TEST_ENV=local cucumber-js features/login.feature features/create-post-desktop.feature --require step-definitions --require support

# Output:
# ✅ Login feature: User logs in successfully  
# ✅ Create post feature: User creates post (already logged in)
```

### **Tag-Based Execution:**
```bash
# This runs scenarios with either tag:
cucumber-js --tags "@login or @create-post" --require step-definitions --require support

# Output:
# ✅ Login scenario: User logs in
# ✅ Create post scenarios: User creates posts
```

## 🎉 **Benefits of Feature Reuse**

- **🔄 No Code Duplication** - Reuse existing login steps
- **🎯 Single Responsibility** - Each feature has one purpose  
- **🚀 Flexible Testing** - Run features independently or together
- **🛠️ Easy Maintenance** - Update login logic in one place
- **📊 Clear Reporting** - Separate reports for login vs post creation

## 🚀 **Ready to Use Commands**

```bash
# Complete user journey (recommended)
npm run test:login-then-create-post:local

# Individual features
npm run test:local:login              # Just login
npm run test:create-post:local        # Just post creation

# Tag-based testing  
npm run test:login-only               # @login scenarios
npm run test:create-post-only         # @create-post scenarios
```

**Your login feature is now reusable across all post creation tests!** 🎯
