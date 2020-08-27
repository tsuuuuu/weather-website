const submitForm = document.querySelector('#contact-form')
const sender = document.querySelector('#_replyto')

submitForm.addEventListener('submit', (e) => {
    console.log('Validator running')
    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if(sender.value.match(mailFormat)) {
        submitForm.setAttribute('method','POST')
        submitForm.setAttribute('action','https://formspree.io/xrgywglp')
        submitForm.style.display = 'hidden'
        return true
    } else {
        alert("Endereço de email inválido, por favor cheque o email fornecido")
        e.preventDefault()
        return false
    }
})


