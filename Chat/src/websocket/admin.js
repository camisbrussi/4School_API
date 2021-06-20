import { io } from '../app'
import Connection from '../models/chat_connection'
import Message from '../models/chat_message'
import Person from '../models/person';
import User from '../models/user';

io.on("connect", async(socket) => {

  const allConnectionsWithoutAdmin = await Connection.findAll({
    include: [
      { 
        model: Person,
        as: 'person',
        attributes: ['name', 'type_id']
      }
    ],
    where: { user_id: null } 
  });

  io.emit("admin_list_all_users", JSON.stringify(allConnectionsWithoutAdmin));

  socket.on("service_queue", async (callback) => {
    callback(JSON.stringify(allConnectionsWithoutAdmin));
  });

  socket.on("admin_list_messages_by_user", async (params, callback) => {
    
    const { socket_id } = params;

    const {person_id} = await Connection.findOne({where: {socket_id}});

    const allMessages = await Message.findAll({
      include: [
        { 
          model: Person,
          as: 'person',
          attributes: ['name']
        },
        {
          model: User,
          as: 'user',
          attributes: ['name']
        }
      ],
      where: {person_id}  });
    callback(JSON.stringify(allMessages));
  });
  

  socket.on("admin_send_to_client", async (params, callback) => {
    const { text, socket_id } = params;

    const { person_id, user_id } = await Connection.findOne({where: {socket_id}});

    await Message.create({
      text,
      user_id,
      person_id,
    });

    const allMessages = await Message.findAll({
      include: [
        { 
          model: Person,
          as: 'person',
          attributes: ['name']
        },
        {
          model: User,
          as: 'user',
          attributes: ['name']
        },
      ],
      where: {person_id}  });

    io.to(socket_id).emit("client_receive_message",  JSON.stringify({messages: allMessages, socket_id: socket.id}));
    callback(JSON.stringify(allMessages));
  });

  socket.on("admin_user_in_support", async (params, callback) => {
       
    const { user_id, socket_id } = params;

    let connection = await Connection.findOne({where: {socket_id}});

    await connection.update({user_id});

    connection = await Connection.findOne({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ],
      where: {socket_id}});

    const allConnectionsWithoutAdmin = await Connection.findAll({where: { user_id: null } });

    io.emit('admin_list_all_users', JSON.stringify(allConnectionsWithoutAdmin));

    io.to(socket_id).emit('client_in_support', JSON.stringify(connection))
    callback(JSON.stringify(connection));
  })
});