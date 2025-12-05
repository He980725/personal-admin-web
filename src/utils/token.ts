import Cookies from 'js-cookie'
const TOKEN_KEY = 'AUTH_TOKEN'

class Token {
  private token: string | null

  constructor() {
    this.token = this.get()
  }

  get() {
    return Cookies.get(TOKEN_KEY) || null
  }
  // expired() {
  //   if (this.token) {
  //     return Date.now() > this.token?.exp * 1000
  //   }
  //   return true
  // }
  remove() {
    Cookies.remove(TOKEN_KEY)
  }
  set() {}
}

export default new Token()
