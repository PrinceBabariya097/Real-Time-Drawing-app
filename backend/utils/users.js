const users = []

const addUser = ({name, userID, roomID, host, presenter, socketID}) => {
    const user = {name, userID, roomID, host, presenter, socketID}
    users.push(user)
    return users.filter((item)=> item.roomID===roomID)
}

const removeUser = (id) => {
    const index = users.findIndex((item)=> item.socketID === id);
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) =>{
   return users.find((item)=> item.socketID===id)
}

const getUsersInRoom = (roomID) =>{
     return users.filter((item)=> item.socketID===roomID)
}

module.exports = {addUser,removeUser,getUser,getUsersInRoom}