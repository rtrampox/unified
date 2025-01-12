import { hash, verify } from "@node-rs/argon2";

async function Hash(password: string): Promise<string> {
	return await hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});
}

async function Compare(password: string, hash: string): Promise<boolean> {
	return await verify(hash, password);
}

export const passwordService = {
	Hash,
	Compare,
};
