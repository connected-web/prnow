export const TOKENS = {
  DRY_RUN: 'DRY_RUN'
}

const TOKEN_VALUES_EN: Record<string, string> = {
  DRY_RUN: '[💦]'
}

const LANG_MAP: Record<string, Record<string, string>> = {
  EN: TOKEN_VALUES_EN
}

export function getToken (tokenId: string, lang: string = 'EN'): string {
  const langMap = LANG_MAP[lang.toUpperCase()]
  if (typeof langMap !== 'object' || langMap === null) {
    throw new Error(`Language "${lang}" not supported`)
  }
  const tokenValue = langMap[tokenId]
  if (typeof tokenValue !== 'string' || tokenValue === '') {
    throw new Error(`Token "${tokenId}" not found in language "${lang}"`)
  }
  return tokenValue
}
