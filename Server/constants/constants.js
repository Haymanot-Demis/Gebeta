module.exports = {
	USER_ROLES: Object.freeze({
		ADMIN: "Admin",
		LOUNGE_ADMIN: "LoungeAdmin",
		USER: "User",
	}),
	DEFAULT_VALUES: Object.freeze({
		LOUNGE_NAME: "NO NAME",
	}),
	DELIVARY_TYPES: Object.freeze({
		DINEIN: "dinein",
		TAKEAWAY: "takeaway",
		DELIVERY: "delivery",
	}),
	ORDER_STATUS: Object.freeze({
		PENDING: "Pending",
		INPREP: "Inpreparation",
		READY: "Ready",
		DELIEVERED: "Delivered",
		CANCELED: "Canceled",
	}),
	PAYMENT_STATUS: Object.freeze({
		PENDING: "Pending",
		SUCCESS: "Success",
		FAILED: "Failed",
	}),
	PAYMENT_TYPES: Object.freeze({ CASH: "Cash", Card: "Card" }),
};
