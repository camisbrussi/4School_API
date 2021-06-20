import { io } from "../app"

import Connection from '../models/chat_connection'
import Message from '../models/chat_message'
import Person from '../models/person';
import User from '../models/user';

io.on("connect", (socket) => { 
  
  socket.on("client_access", async (params, callback) => {
    const socket_id = socket.id;
    const { person_id } = params;

    const connection = await Connection.create({
          socket_id,
          person_id, })
    
     callback(JSON.stringify(connection));

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
  });

  socket.on("client_list_all_messages", async (params,  callback) => {
    const { person_id } = params;

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
      where: {person_id}});

    callback(JSON.stringify(allMessages));
  })

  socket.on("client_send_to_admin", async (params, callback) => {
    const { text, socket_id, socket_id_admin } = params;

    const { person_id } = await Connection.findOne({where: {socket_id}});

    await Message.create({
      text,
      person_id
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
        }
      ],
      where: {person_id}  });

    io.to(socket_id_admin).emit("admin_receive_message", JSON.stringify(allMessages));
    callback(JSON.stringify(allMessages));
  });
});
