const TOKEN_KEY = 'X-Dipal-Token'

interface TokenInfo {
  token: string
  // exp: number
}

class Token {
  private token: TokenInfo | null

  constructor() {
    this.token = this.getTokenFromStorage()
  }

  private getTokenFromStorage(): TokenInfo | null {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      if (!storedToken) return null

      return JSON.parse(storedToken) as TokenInfo
    } catch (error) {
      console.error('解析令牌失败：', error)
      this.remove()
      return null
    }
  }

  get(): TokenInfo | null {
    this.token = this.getTokenFromStorage()
    return this.token
  }

  getTokenStr(): string {
    return this.get()?.token || ''
  }

  // expired(): boolean {
  //   const currentToken = this.get()
  //   if (!currentToken) return true
  //   if (currentToken.exp === undefined) return true
  //   return Date.now() > currentToken.exp * 1000
  // }

  set(tokenInfo: TokenInfo): void {
    try {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenInfo))
      this.token = tokenInfo
    } catch (error) {
      console.error('存储令牌失败：', error)
    }
  }

  remove(): void {
    localStorage.removeItem(TOKEN_KEY)
    this.token = null
  }
}

export default new Token()
