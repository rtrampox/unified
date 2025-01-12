import crypto from "crypto";

/**
 * Service for generating and verifying multifactor authentication tokens
 * @deprecated This service is for demonstration purposes only and should not be used in production.
 */
export class MultifactorServiceDP {
	private readonly SECRET_KEY = process.env.SECRET || crypto.randomBytes(32).toString("hex");

	private generateSessionId(): string {
		return crypto.randomBytes(16).toString("hex");
	}

	/**
	 * Generate a signed verification token
	 * @param userId User identifier
	 * @param otpCode 6-digit OTP code
	 * @param expirationMinutes Token validity period (default 15 minutes)
	 */
	generateVerificationToken(userId: string, otpCode: string, expirationMinutes: number = 15): string {
		// Create payload with expiration
		const payload = {
			sessionId: this.generateSessionId(),
			userId,
			exp: Date.now() + expirationMinutes * 60 * 1000,
		};

		// Create a signature that covers the entire payload
		const payloadString = JSON.stringify(payload);
		const signature = crypto
			.createHmac("sha256", this.SECRET_KEY + otpCode)
			.update(payloadString)
			.digest("hex");

		// Combine payload with signature
		const fullPayload = {
			payload,
			signature,
		};

		// Encode the full payload as a base64 string
		const encoded = Buffer.from(JSON.stringify(fullPayload)).toString("base64");

		return encoded;
	}

	/**
	 * Verify the verification token
	 * @param token Verification token
	 * @param submittedOtpCode Submitted OTP code
	 */
	verifyToken(token: string, submittedOtpCode: string): { valid: boolean; payload?: any } {
		try {
			// Decode the token from base64
			token = Buffer.from(token, "base64").toString("utf-8");

			// Parse the token
			const parsedToken = JSON.parse(token);

			// Recreate signature verification
			const payloadString = JSON.stringify(parsedToken.payload);
			const expectedSignature = crypto
				.createHmac("sha256", this.SECRET_KEY + submittedOtpCode)
				.update(payloadString)
				.digest("hex");

			// Verify signature first
			if (expectedSignature !== parsedToken.signature) {
				return { valid: false };
			}

			// Check expiration
			if (parsedToken.payload.exp < Date.now()) {
				return { valid: false };
			}

			// Verify session and user details if needed
			return {
				valid: true,
				payload: parsedToken.payload,
			};
		} catch {
			// Handle parsing errors or invalid token format
			return { valid: false };
		}
	}
}
