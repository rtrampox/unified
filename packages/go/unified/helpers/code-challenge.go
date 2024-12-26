package helpers

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
)

type CodeChallenge struct {
	CodeChallenge string
	CodeVerifier  string
	Method        string
}

func GenerateCodeChallenge() (*CodeChallenge, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return nil, err
	}

	verifier := base64.RawURLEncoding.EncodeToString(bytes)

	hash := sha256.Sum256([]byte(verifier))

	challenge := base64.RawURLEncoding.EncodeToString(hash[:])

	return &CodeChallenge{
		CodeChallenge: challenge,
		CodeVerifier:  verifier,
		Method:        "S256",
	}, nil
}
