console.log('Client side javascript file is loaded!')

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#Message-1')
const messageTwo = document.querySelector('#Message-2')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const location = search.value
    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''

    fetch('/weather?address=' + location).then((response) => {
    response.json().then((data) => {
        if (data.error) {
            messageOne.textContent = data.error
        } else {
            messageOne.textContent = data.Location
            messageTwo.textContent = 'Clima agora: ' + JSON.parse(JSON.stringify(data.Forecast.Clima_Atual)) 
                                + '   Temperatura atual: ' + JSON.parse(JSON.stringify(data.Forecast.Temperatura_Atual)) 
                                + '   Chance de chuva: ' + JSON.parse(JSON.stringify(data.Forecast.Chance_de_chuva))
            console.log(data.Forecast)
        }
    })
})
})



// fetch('http://puzzle.mead.io/puzzle').then((response) => {
//     response.json().then((data) => {
//         console.log(data)
//     })
// })

// fetch('http://localhost:3000/weather?address=suzano').then((response) => {
//     response.json().then((data) => {
//         if (data.error) {
//             console.log(data.error)
//         } else {
//             console.log(data.Location)
//             console.log(data.Forecast)
//         }
//     })
// })