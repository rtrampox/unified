# .env

# FRONT_PUBLIC_URL

Must be the public frotend domain, without protocol

# JWT_SECRET

```js
Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64url");
```

# JWT_PRIVATE_KEY and JWT_PUBLIC_KEY

### private key:

```bash
openssl genpkey -algorithm RSA -out private-key.pem -pkeyopt rsa_keygen_bits:2048 -outform PEM
```

### public key:

```bash
openssl rsa -in private-key.pem -pubout -outform PEM -out public-key.pem
```

copy both outputs to JWT_PRIVATE_KEY and JWT_PUBLIC_KEY vars.
