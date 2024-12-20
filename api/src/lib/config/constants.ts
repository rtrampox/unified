const BASEURL = "https://usercontent.rtrampox.com.br";

export const configConstants = {
	USERCONTENT_URL: new URL(BASEURL),
	USERCONTENT_PROFILE_URL: (userId: string) => new URL(`${BASEURL}/unified/profile/${userId}/picture.webp`),
	PROFILE_PICTURE_KEY: (userId: string) => `unified/profile/${userId}/picture.webp`,
};
