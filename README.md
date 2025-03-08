# Ridvan Ermis - Resume Website

A modern, responsive resume website for Ridvan Ermis, a Freelance Automation Specialist, built with HTML, CSS, and JavaScript.

## Features

- Clean, modern design inspired by professional resume websites
- Fully responsive layout that works on all device sizes
- Dark mode toggle with system preference detection and user preference persistence
- Interactive elements including animations and hover effects
- Organized sections for skills, work experience, education, and certifications
- Social media and contact links

## Technologies Used

- HTML5
- CSS3 (with CSS variables, Flexbox, and Grid)
- JavaScript (ES6+)
- Font Awesome for icons
- Google Fonts (Inter)
- LocalStorage for theme preference persistence

## Setup and Usage

1. Clone or download this repository
2. Open `index.html` in your browser to view the website
3. Customize the content in `index.html` to update your personal information
4. Modify styles in `styles.css` to change the appearance
5. Edit the animations and interactions in `script.js` as needed

## Customization

### Colors

The color scheme can be easily modified by changing the CSS variables in the `:root` selector in `styles.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #4b5563;
    /* other color variables */
}
```

For dark mode customization, modify the `[data-theme="dark"]` selector variables:

```css
[data-theme="dark"] {
    --primary-color: #60a5fa;
    --secondary-color: #9ca3af;
    /* other dark theme color variables */
}
```

### Dark Mode Toggle

The website includes a dark mode toggle that:
- Respects the user's system preference by default
- Saves the user's preference in localStorage
- Provides a smooth transition between light and dark themes
- Shows a sun icon in dark mode and a moon icon in light mode

### Profile Picture

Replace `Untitled.jpg` with your own profile picture. For best results, use a square image.

### Adding More Sections

You can add more sections by following the existing HTML structure:

```html
<section class="new-section">
    <div class="container">
        <h3 class="section-title">New Section Title</h3>
        <!-- Your content here -->
    </div>
</section>
```

## Deployment

This is a static website that can be deployed to any web hosting service, including:

- GitHub Pages
- Netlify
- Vercel
- Any standard web hosting provider

## License

This project is available for personal and commercial use.

## Credits

- Profile picture: Ridvan Ermis
- Design inspiration: [Rhino Resumes](https://rhinoresumes.framer.website) 