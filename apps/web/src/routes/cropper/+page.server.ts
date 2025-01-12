import sharp from "sharp";
import type { Actions } from "./$types";
import type { CropArea } from "@rtrampox/svelte-easy-crop";
import {
	completeProfilePictureUpload,
	getSignedProfilePictureUrl,
	type SessionResponse,
} from "@/api";
import { fail } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	return {
		session: event.locals.session.session as SessionResponse,
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { isLoggedIn, session } = locals.session;
		if (!isLoggedIn) {
			return fail(401, { error: "Unauthorized" });
		}

		const form = await request.formData();

		const { height, width, x, y } = JSON.parse(form.get("crop") as string) as CropArea;
		const formFile = form.get("file") as File;
		if (!formFile) {
			return fail(400, { error: "No file" });
		}

		const file = await formFile.arrayBuffer();
		// size must be less than 5mb
		if (file.byteLength > 1024 * 1024 * 5) {
			return fail(400, { error: "File size too large" });
		}

		console.time("resize");

		const resized = await sharp(file)
			.extract({ left: x, top: y, width, height })
			.resize(400, 400, {
				fit: "cover",
				position: "center",
			})
			.webp({
				quality: 85,
				effort: 4,
			})
			.toBuffer();

		console.timeEnd("resize");

		console.time("upload-picture");

		const { data, status } = await getSignedProfilePictureUrl();
		if (status !== 200) {
			return fail(500, { error: "Failed to get signed url" });
		}

		const upload = await fetch(data.signedUrl, {
			method: "PUT",
			body: resized,
			headers: {
				"Content-Type": "image/webp",
				"Last-Modified": data.lastModified,
				"x-rtrampox-user-id": session.user.id,
			},
		});

		const confirmUpload = await completeProfilePictureUpload();
		if (confirmUpload.status !== 200) {
			return fail(500, { error: "Failed to confirm upload" });
		}

		console.timeEnd("upload-picture");

		locals.session.session.user.picture = data.user.picture;

		return { ok: upload.ok };
	},
};
