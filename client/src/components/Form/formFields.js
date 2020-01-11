export default {
  signup: [
    { label: 'Enter your nickname', name: 'name', type: 'text' },
    { label: 'Enter your email', name: 'email', type: 'text' },
    { label: 'Enter your password', name: 'password', type: 'password' }
  ],
  signin: [
    { label: 'Enter your email', name: 'email', type: 'text' },
    { label: 'Enter your password', name: 'signinpassword', type: 'password' }
  ],
  editUser: [
    { label: 'Change nickname', name: 'name', type: 'text' }
  ],
  privateRoom: [
    { label: 'Please, enter a password of this room', name: 'roompassword', type: 'password' }
  ]
};