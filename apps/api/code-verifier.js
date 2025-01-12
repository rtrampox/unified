const crypto = require("node:crypto");

// Function to generate a random code_verifier
function generateCodeVerifier() {
	return crypto.randomBytes(32).toString("base64url"); // base64url encoding
}

// Function to hash the code_verifier using SHA-256 and return a base64url encoded string
function generateCodeChallenge(codeVerifier) {
	return crypto.createHash("sha256").update(codeVerifier).digest("base64url"); // base64url encoding
}

const codeVerifier = generateCodeVerifier();
const codeChallenge = generateCodeChallenge(codeVerifier);

console.log("Code Verifier:", codeVerifier);
console.log("Code Challenge:", codeChallenge);
