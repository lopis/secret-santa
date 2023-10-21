function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

export default (users) => {
  shuffleArray(users)
  const helpers = [...users]
  helpers.unshift(helpers.pop())
  const secretFriends = [...helpers]
  secretFriends.unshift(secretFriends.pop())
  users.forEach((user, index) => {
    user.helper = helpers[index].username
    user.secretFriend = secretFriends[index].username
  })
}