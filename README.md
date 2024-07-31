# ELTE GPA & CCI Calculator

This is a web application designed to help students at Eötvös Loránd University (ELTE) calculate and track their GPA (Grade Point Average) and CCI (Credit Completion Index) efficiently. The application allows users to add, edit, and remove courses, view their academic performance by semester, and share their GPA and CCI details.

## Features

- **Easy Course Management:** Add, edit, and remove courses seamlessly.
- **Detailed Tracking:** Monitor your grades, credits, and calculate both your GPA and CCI with precision.
- **Visual Overview:** Get a clear view of your academic performance by semester.
- **Sharing Options:** Easily share your academic progress via text or as an image for record-keeping or discussions with your academic advisor.

## Technologies Used

- **Frontend:** Next.js and Tailwind CSS for a responsive and clean user interface.
- **Backend:** Firebase for robust data storage and real-time updates.
- **Additional Tools:** HTML-to-Image and DownloadJS for sharing features.

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/elte-gpa-calculator.git
    cd elte-gpa-calculator
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up Firebase:**
    - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
    - Add a web app to your Firebase project and copy the Firebase configuration.
    - Create a file named `firebase.js` in the `app` directory and add the following code, replacing the configuration with your Firebase project's config:

    ```javascript
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";

    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    export const db = getFirestore(app);
    ```

4. **Start the development server:**
    ```bash
    npm run dev
    ```

## Usage

1. **Add Courses:**
   - Enter the course name, grade, credits, and select the semester.
   - Click "Add Course" to save the course details.

2. **Edit Courses:**
   - Click "Edit" next to the course you want to update.
   - Modify the details and click "Update Course" to save the changes.

3. **Remove Courses:**
   - Click "Remove" next to the course you want to delete.

4. **View GPA and CCI:**
   - The application automatically calculates and displays the total GPA and CCI based on the entered courses.

5. **Share Details:**
   - Click "Share via Text" to copy your GPA and CCI details to the clipboard.
   - Click "Share as Image" to download your GPA and CCI details as a PNG image.

## Screenshots

![Screenshot](screenshot.png)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes or improvements.

## License

This project is licensed under the MIT License.




This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
