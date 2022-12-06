const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (message) => {
    console.log(message)

    const html = Mustache.render(messageTemplate, { 
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (locationMessage) => {
    console.log(locationMessage)

    const html = Mustache.render(locationMessageTemplate, {
        url: locationMessage.url,
        createdAt: moment(locationMessage.createdAt).format('h:mm a')
    })

    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, () => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
    })
})

$sendLocationButton.addEventListener('click', () => {

    $sendLocationButton.setAttribute('disabled', 'disabled')

    if (!navigator.geolocation) {
        $sendLocationButton.removeAttribute('disabled')
        return alert('Geolocation is not supported by your browser.')
    }
        
    
    navigator.geolocation.getCurrentPosition((position) => {
        const location = { lat: position.coords.latitude, long: position.coords.longitude }        
        socket.emit('sendLocation', location, () => {            
            console.log('Location shared!')
            $sendLocationButton.removeAttribute('disabled')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    } 
})