# .env

# JWT_SECRET

```js
Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64url");
```

# JWT_PRIVATE_KEY and JWT_PUBLIC_KEY

### private key:

```bash
openssl genpkey -algorithm RSA -out private_key_pkcs8.pem -pkeyopt rsa_keygen_bits:2048 -outform PEM
```

### public key:

```bash
openssl rsa -in private_key_pkcs8.pem -pubout -outform PEM -out public_key_pkcs8.pem
```

copy both outputs to JWT_PRIVATE_KEY and JWT_PUBLIC_KEY vars.
