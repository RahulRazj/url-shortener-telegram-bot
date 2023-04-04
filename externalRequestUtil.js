import got from 'got';

export const makeGetReq = async params => {};

export const makePostReq = async params => {
	return new Promise(async (resolve, reject) => {
		try {
			const options = {
				headers: params.headers || {}
			};

			if (params.body && Object.keys(params.body).length > 0) {
				options.json = params.body;
			}

			const response = await got.post(params.connUrl, options);
			return resolve(response.body);
		} catch (error) {
			return reject(error);
		}
	});
};
