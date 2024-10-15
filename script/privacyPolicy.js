const footer = document.getElementById('footer-scroll') 
footer.addEventListener('click', ()=>{
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    })
})

