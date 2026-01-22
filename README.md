# 🚀 Utku Demirtaş - Portfolio Website

Welcome to my personal portfolio website! This project showcases my journey as a Computer Engineering student, featuring my projects, skills, certifications, and hobbies.

## 🌟 Features

- **Bilingual Support (TR/EN)**: Fully localized content in Turkish and English.
- **Interactive UI**: Modern, responsive design with smooth animations and "firefly" effects.
- **Experience Timeline**: A visual timeline of my professional career.
- **Contact Form**: Integrated with EmailJS for direct communication.
- **Project Showcase**: Highlighted projects with descriptions and tech stacks.
- **Dynamic Content**: Easy to update sections for Skills, Certifications, and more.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animation**: CSS Keyframes & Custom Hooks
- **Email Service**: [EmailJS](https://www.emailjs.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚦 Getting Started

Follow these steps to run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/portfolio-website.git
    cd portfolio-website
     ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    # or
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the site.

## 📧 Configuration (Fixing Email Sending)

This project uses **EmailJS** to send messages from the contact form. If you encounter an error when trying to send a message, it is likely because the environment variables are missing.

### Step-by-Step Fix:

1.  Create an account at [EmailJS](https://www.emailjs.com/).
2.  Create a **Service** and a **Template**.
3.  Get your **Service ID**, **Template ID**, and **Public Key**.
4.  Create a new file named `.env.local` in the root directory of the project.
5.  Add the following lines to `.env.local`, replacing the placeholders with your actual keys:

    ```env
    NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_actual_service_id
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_actual_template_id
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_actual_public_key
    ```

6.  Restart your development server:
    ```bash
    npm run dev
    ```

**Note:** The `.env.local` file is git-ignored and should not be committed to the repository to keep your API keys secure.

## 📂 Project Structure

- `app/`: Main application source code (Next.js App Router).
- `components/`: Reusable UI components.
- `public/`: Static assets (images, icons).
- `styles/`: Global styles and Tailwind configuration.

## 🤝 Contributing

Feel free to fork this repository and submit pull requests. Any improvements are welcome!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---
*Last Verification: Environment variables configured for Vercel deployment.*
