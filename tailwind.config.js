
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
 
    // Or if using `src` directory:
    "./src/pages/index.tsx",
    "./src/pages/components/Navbar.jsx",
    "./src/pages/PetWeight.tsx",
    "./src/pages/appointment.jsx",
    "./src/auth/SignIn.jsx",
    "./src/auth/SignOut.jsx"

  ],
  theme: {
    extend: {},
  },
  plugins: [],
}