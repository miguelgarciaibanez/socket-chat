var socket = io();

var params = new URLSearchParams( window.location.search );

if ( !params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('Name and room is mandatory');
}


var user = {
    name: params.get('name'),
    room: params.get('room')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('enterChat', user, function( resp ){
        console.log(resp);//Connected users
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('createMessage', {
//     user: 'Fernando',
//     message: 'Hola Mundo'
// }, function(resp) {
//     console.log('response server: ', resp);
// });

// Escuchar información
socket.on('createMessage', function(message) {
    console.log('server:', message);

});

//Listen when a user enters or leaves the chat
socket.on('peopleList', function(people) {
    console.log(people);

});


//Private messages
socket.on('privateMessage', function (message) {
    console.log('private message:', message);
});