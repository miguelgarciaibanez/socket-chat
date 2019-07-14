const { io } = require('../server');
const {Users} = require('../classes/users');
const {createMessage} = require('../utils/utils');

const users = new Users();

io.on('connection', (client) => {

    client.on('enterChat', ( user, callback ) => {
        //console.log(callback);
        if (!user.name || !user.room) {
            return callback({
                error:true,
                message:'Name/room is mandatory'
            })
        }    
    
        client.join(user.room);

        let people = users.addPerson( client.id, user.name, user.room );

        client.broadcast.to(user.room).emit('peopleList', {users: users.getPeopleByRoom(user.room)});
        callback(users.getPeopleByRoom(user.room));
        
    });

    client.on('disconnect', () => {
        let deletedPerson = users.deletePerson( client.id );
        client.broadcast.to(deletedPerson.room).emit('createMessage', createMessage('Admin', `${deletedPerson.name} has left the chat`));
        client.broadcast.to(deletedPerson.room).emit('peopleList', {users: users.getPeopleByRoom(deletedPerson.room)});
    })

    client.on('createMessage', ( data ) => {

        let person = users.getPerson(client.id)
        
        let message = createMessage( person.name, data.message );

        client.broadcast.to(person.room).emit('createMessage', message);
    });


    client.on('messagePrivate', ( data ) => {

        let person = users.getPerson( client.id );

        client.broadcast.to(data.to).emit('messagePrivate', createMessage( person.name, data.message));

    })

});