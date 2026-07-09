# InstaPulse: Instagram Follower Analyzer

InstaPulse is a privacy-first, high-fidelity React web application designed to analyze your Instagram network. By parsing your official Instagram data export completely inside your browser, it determines who is not following you back (unfollowers), who you don't follow back (fans), and mutual connections without requiring your account credentials.

Developed by **Dnyaneshwar Kokate** (**Miracle Developers**).

---

## Key Features

- **100% Privacy-First**: All data extraction and parsing happens locally in your web browser. No files are uploaded to any server, and your Instagram password is never requested.
- **Direct ZIP Upload**: Drop your downloaded Instagram export `.zip` file directly. The app parses the nested JSON logs in memory using `jszip` (no extraction required).
- **Interactive Dashboard**:
  - Connection metrics overview (Total Followers / Following).
  - Circular **Follow Back Rate** gauge.
  - Social network status classification (e.g. Creator Profile, Balanced Network, Unbalanced).
  - Following breakdown distribution bar chart.
- **Detailed Lists & Analytics**:
  - Tabbed tables for Unfollowers, Fans, Mutuals, All Followers, and All Following.
  - Full-text search and sorting (Follow Date, Alphabetical).
  - Quick-copy buttons for single usernames.
  - Direct profile links to open accounts in Instagram.
  - **Copy All Usernames** button for bulk actions.
  - **Export CSV** tool to download lists as spreadsheets.
- **Premium SaaS Styling**: Sleek glassmorphism look, responsive layouts, micro-animations, and system-wide theme switching (Dark/Light mode).
- **Instant Demo Mode**: Load mock follower profiles with a single click to explore all charts and filters instantly.

---

## Step-by-Step: How to Export Instagram JSON Data

To use this application with your personal profile, download your connection data from Instagram in **JSON format**:

1. Open Instagram, go to your **Settings** > **Accounts Center**.
2. Select **"Your information and permissions"** > **"Download your information"**.
3. Click **"Request a download"** or **"Download or transfer information"**.
4. Choose **"Some of your information"** (do NOT download everything, as it is slow and very large).
5. Scroll down, check the box next to **"Followers and following"** under the Connections section, and click **Next**.
6. **Important**: Change the **Format** dropdown from **HTML** to **JSON**.
7. Set the Date Range to **"All time"** and click **"Submit Request"**.
8. Instagram will compile your file (usually takes 5 to 15 minutes). Once ready, download the resulting `.zip` file.
9. Drag and drop the downloaded `.zip` file directly into this app!

---

## Technical Stack

- **Framework**: React 19 (Vite)
- **Styling**: Vanilla CSS (Custom Properties, Flexbox, Grid, Backdrop Filters)
- **ZIP Parser**: `jszip` (npm library for reading zip structures client-side)
- **Iconography**: `lucide-react` (clean vector icon assets)

---

## How to Run the Project Locally

### Prerequisites
Make sure you have **Node.js** (v18 or higher) and **npm** installed on your machine.

### Installation

1. Navigate to the project directory:
   ```bash
   cd /Users/dnyaneshwarkokate/Documents/instagram-tracker
   ```
2. Install the React dependencies:
   ```bash
   npm install --registry=https://registry.npmmirror.com --strict-ssl=false
   ```

### Development
Start the local Vite development server:
```bash
npm run dev
```
Open the URL shown in your terminal (usually `http://localhost:5173`) in your web browser.

### Production Build
Compile and bundle the application into static files for hosting:
```bash
npm run build
```
This will generate the built site in the `/dist` directory. You can host this folder directly on services like **Netlify**, **Vercel**, or **GitHub Pages**.

---

## License

Created by **Dnyaneshwar Kokate** (Miracle Developers). For personal and educational use.
