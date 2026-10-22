import CryptoJS from 'crypto-js'

/**
 * Utility Kriptografi Universal untuk mendekripsi dokumen PDF (AES-256-CBC)
 * Kompatibel 100% dengan semua perangkat HP (Android/iOS) dan Desktop,
 * baik diakses via HTTP (IP Address/Local) maupun HTTPS.
 *
 * Ekuivalen dengan fungsi PHP:
 *   $key = hex2bin($key);
 *   $decoded = base64_decode($content);
 *   $iv = mb_substr($decoded, 0, openssl_cipher_iv_length("aes-256-cbc"), "8bit");
 *   $encrypted = mb_substr($decoded, openssl_cipher_iv_length("aes-256-cbc"), null, "8bit");
 *   $decrypted = openssl_decrypt($encrypted, "aes-256-cbc", $key, OPENSSL_RAW_DATA, $iv);
 *   $decrypted = base64_decode($decrypted);
 */

/**
 * Mendekripsi file PDF dari backend (Radiologi / Laborat)
 * @param {string} hexKey - Kunci enkripsi dalam format HEX dari backend
 * @param {string} base64Content - Konten terenkripsi dari SFTP dalam format Base64
 * @returns {Promise<Blob>} - Blob PDF yang sudah didekripsi
 */
export async function decryptPdfDocument(hexKey, base64Content) {
  if (!hexKey || !base64Content) {
    throw new Error('Kunci (key) atau konten berkas tidak boleh kosong.')
  }

  try {
    // 1. Parsing Hex Key (32 bytes / 256 bits)
    const cleanKeyHex = hexKey.trim()
    const key = CryptoJS.enc.Hex.parse(cleanKeyHex)

    // 2. Decode Base64 content menjadi WordArray
    const cleanContent = base64Content.trim().replace(/[\r\n\t\s]/g, '')
    const decodedWordArray = CryptoJS.enc.Base64.parse(cleanContent)

    // 3. Ekstrak IV (16 bytes pertama = 4 words @ 4 bytes)
    const ivWords = decodedWordArray.words.slice(0, 4)
    const iv = CryptoJS.lib.WordArray.create(ivWords, 16)

    // 4. Ekstrak Ciphertext (sisa data setelah 16 bytes)
    const ciphertextWords = decodedWordArray.words.slice(4)
    const ciphertextSigBytes = decodedWordArray.sigBytes - 16
    const ciphertext = CryptoJS.lib.WordArray.create(ciphertextWords, ciphertextSigBytes)

    // 5. Decrypt menggunakan AES-256-CBC
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: ciphertext
    })

    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })

    // 6. Decode tahap kedua (seperti $decrypted = base64_decode($decrypted) di PHP)
    let decryptedStr = ''
    try {
      decryptedStr = decrypted.toString(CryptoJS.enc.Utf8)
    } catch {
      decryptedStr = ''
    }

    if (!decryptedStr || decryptedStr.length === 0) {
      decryptedStr = decrypted.toString(CryptoJS.enc.Latin1)
    }

    decryptedStr = decryptedStr.trim()

    let finalBinary = ''
    if (decryptedStr.startsWith('%PDF-')) {
      finalBinary = decryptedStr
    } else {
      try {
        const cleanB64 = decryptedStr.replace(/[\r\n\t\s]/g, '')
        finalBinary = atob(cleanB64)
      } catch {
        finalBinary = decryptedStr
      }
    }

    const finalBytes = new Uint8Array(finalBinary.length)
    for (let i = 0; i < finalBinary.length; i++) {
      finalBytes[i] = finalBinary.charCodeAt(i)
    }

    return new Blob([finalBytes], { type: 'application/pdf' })
  } catch (error) {
    console.error('CryptoJS Decryption Error:', error)
    throw new Error('Gagal mendekripsi berkas dokumen: ' + error.message)
  }
}
