const User = require('../models/userModel');

const getOnlineUsersInProjectRoom = async (project) => {
    const usersInProject = await User.findByProjectName(project);
    return usersInProject.filter((user) => {
        return user.tokens.length > 0
    })
}

module.exports = {
    getOnlineUsersInProjectRoom
}