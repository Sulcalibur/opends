import crypto from 'crypto'
const keyB64 = process.env.TOKEN_ENC_KEY || ''
const key = keyB64 ? Buffer.from(keyB64, 'base64') : crypto.randomBytes(32)

export function encryptToken(token: string) {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return {
    iv: iv.toString('base64'),
    ciphertext: ciphertext.toString('base64'),
    authTag: authTag.toString('base64')
  }
}

export function decryptToken(enc: { iv: string; ciphertext: string; authTag: string }) {
  const iv = Buffer.from(enc.iv, 'base64')
  const authTag = Buffer.from(enc.authTag, 'base64')
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(authTag)
  const plaintext = Buffer.concat([decipher.update(Buffer.from(enc.ciphertext, 'base64')), decipher.final()])
  return plaintext.toString('utf8')
}

