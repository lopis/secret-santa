import assign from './assign'

describe('assign', () => {
  it('assigns correctly', () => {
    const users = [
      { username: 'joe1' },
      { username: 'joe2' },
      { username: 'joe3' },
      { username: 'joe4' },
      { username: 'joe5' },
      { username: 'joe6' }
    ]

    assign(users)

    // Every user gets a secret friend and a helper
    expect(users.every(user => !!user.secretFriend)).toBe(true)
    expect(users.every(user => !!user.helper)).toBe(true)

    // The user is never their own friend
    expect(users.every(user => user.helper != user.username)).toBe(true)
    expect(users.every(user => user.secretFriend != user.username)).toBe(true)

    // The friend and the helper are different
    expect(users.every(user => user.secretFriend != user.helper)).toBe(true)
  })
})