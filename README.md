# Lockin

Caso precise encriptografar ou descriptografar vários logins ao mesmo tempo, use um dos 2 codigos abaixo no depurador do browser.

<p style="color:red;margin:0px">
IMPORTANTE
</p>
<p style="background-color: #46C2E8; padding:10px;margin:0px">
Lembre sempre de ao chamar o método decryptFirebaseLogins, substituir 'sua-chave-secreta-32-caracteres!!' pela mesma que foi usada para encriptar
</p>

## Encriptografar

```
async function encryptFirebaseLogins(data, secretKey) {
  const keyMaterial = new TextEncoder().encode(secretKey.padEnd(32).slice(0, 32));
  const key = await crypto.subtle.importKey('raw', keyMaterial, { name: 'AES-GCM' }, false, ['encrypt']);

  async function encryptText(text) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(text);
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
    const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.byteLength);
    return btoa(String.fromCharCode(...combined));
  }

  const result = {};

  for (const uid of Object.keys(data)) {
    result[uid] = { logins: {} };
    for (const loginId of Object.keys(data[uid].logins)) {
      const login = data[uid].logins[loginId];
      result[uid].logins[loginId] = {
        ...login,
        password: await encryptText(login.password)
      };
    }
  }

  return result;
}

// Cole seu JSON aqui
const data = { SEU JSON AQUI };

encryptFirebaseLogins(data, 'sua-chave-secreta-32-caracteres!!').then(result => {
  console.log(JSON.stringify(result, null, 2));
});
```

## Descriptografar

```
async function decryptFirebaseLogins(data, secretKey) {
  const keyMaterial = new TextEncoder().encode(secretKey.padEnd(32).slice(0, 32));
  const key = await crypto.subtle.importKey('raw', keyMaterial, { name: 'AES-GCM' }, false, ['decrypt']);

  async function decryptText(cipherText) {
    const combined = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
    return new TextDecoder().decode(decrypted);
  }

  const result = {};

  for (const uid of Object.keys(data)) {
    result[uid] = { logins: {} };
    for (const loginId of Object.keys(data[uid].logins)) {
      const login = data[uid].logins[loginId];
      result[uid].logins[loginId] = {
        ...login,
        password: await decryptText(login.password)
      };
    }
  }

  return result;
}

// Cole seu JSON aqui
const data = { SEU JSON AQUI };

decryptFirebaseLogins(data, 'sua-chave-secreta-32-caracteres!!').then(result => {
  console.log(JSON.stringify(result, null, 2));
});
```