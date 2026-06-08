# ✈️ Travel Advisor App

> An intuitive mobile application designed to help you discover your perfect travel destination based on your budget, weather preferences, and geographical features.

*Note: This application is specifically built and optimized for mobile devices.*

---

## 🚀 Getting Started

Follow these steps to launch the project locally:

1. Download the latest version of this repository and unzip the file to a folder of your liking.
2. Open the project folder with your preferred code editor.
3. Open the terminal within the project directory and run the following command to start the server:

```bash
npx expo start

Wait until the program builds. Once ready, you can use the following terminal commands:
* Press `a` to open the app in an Android emulator.
* Press `w` to open the browser version.

## ✨ User Flow & Features

### 🏠 Home Screen
Upon opening the app, you will be presented with two primary options:
* **Get travel advice**: Start your journey here.
* **Go to your favorites**: Access your saved destinations. *(If this is your first time using the app, you won't have any favorites yet).*

### 🔍 Destination Filter
Selecting **Get travel advice** takes you to the destination filter screen. Customize your perfect vacation by providing:
* Your desired vacation **month**
* Preferred **temperature**
* Daily **budget**
* Additional geographical preferences (toggles for **Sea** or **Mountains**)

Once you are ready, press the **"Get your perfect destination"** button to apply your filters.

### 📋 Destination List
Here you will see all the recommended countries tailored to your selected filters. Each destination card displays:
* A cover photo of the country
* The predicted temperature for that particular month
* The estimated daily budget
* A **heart icon** (located on the top right) to easily add the country to your favorites.

### 🗺️ Destination Details
Pressing on any country will take you to its detailed information screen, which includes:
* Geographical details (presence of mountains or a sea)
* A brief description of the country
* Required travel documents
* **Interactive Map**: Scroll down to view the country's exact location on the map.
* **Weather Calendar**: A calendar showing all predicted temperatures for your selected month.

**Plan Your Trip:**
Select the specific days you want to travel on the calendar to unlock the following actions:
* ✈️ **Look for flights**: Redirects you to the Skyscanner page for that specific country.
* 🏨 **Look for places to stay**: Redirects you to the Booking.com page for accommodation options.
* 🔗 **Share your destination with a friend**: Generates a share link of the country so you can plan together.

### ❤️ Favorites Tab
If you favorited a country, navigating back to the **Favorites** tab will display a layout similar to the **Destination list tab**. However, this section will exclusively showcase all of your favorite countries neatly organized by their respective travel months.
