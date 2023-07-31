const { pool } = require('../config/dbconfig.js');

class DB {
	static addRequeststoInput = async (request, data = {}) => {
		const keys = Object.keys(data);
		keys.map(key => request.input(key, data[key]));
		return request;
	};
	static exec = async (storedProcedure, data = {}) => {
		let request = await pool.request();
		request = await this.addRequeststoInput(request, data);
		try {
			return await request.execute(storedProcedure);
		} catch (error) {
			throw error;
		}
	};
	static query = async queryString => {
		try {
			return await pool.request().query(queryString);
		} catch (error) {
			throw error;
		}
	};
}

module.exports = { DB };
