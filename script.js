const texts = [
    "Storytelling is the 🔑 to everything.",
    "Join forces with like-minded creators.",
];

let textIndex = 0
let charIndex = 0
let isDeleting = false
let typingSpeed = 0

function typeWriter() {
    const typewriterElement = document.getElementById('typewriter')
    
    // Only run the typewriter if the element exists (home page)
    if (!typewriterElement) return
    
    const currentText = texts[textIndex]
    
    // Convert the string to an array of characters, properly handling Unicode characters like emojis
    const characters = Array.from(currentText)
    if (isDeleting) {
        // Remove a character
        charIndex--;
        typewriterElement.textContent = characters.slice(0, charIndex).join('')
        typingSpeed = 15 // Faster when deleting
    } else {
        // Add a character
        typewriterElement.textContent = characters.slice(0, charIndex + 1).join('')
        charIndex++
        typingSpeed = 60 // Speed when typing
    }
    // If we've completed typing the current text
    if (!isDeleting && charIndex === characters.length) {
        isDeleting = true
        typingSpeed = 1000 // Pause before deleting
    }
    // If we've deleted all characters
    else if (isDeleting && charIndex === 0) {
        isDeleting = false
        textIndex = (textIndex + 1) % texts.length // Move to next text
        typingSpeed = 500 // Pause before typing next text
    }
    setTimeout(typeWriter, typingSpeed)
}

window.onload = function() {
    // Start the typewriter effect
    typeWriter()
    // Font loading detection
    document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded');
    })
}