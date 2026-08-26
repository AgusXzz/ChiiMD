const handler = (m) => m;

handler.before = async function (m) {
	const user = db.data.users[m.sender];
	if (!user?.premiumTime) return;
	if (new Date() - user.premiumTime > 0) {
		user.premiumTime = 0;
		user.premium = false;
	}
};

export default handler;
