const dashboardContainer = document.getElementById("outer-container");
var lists = dashboardContainer.querySelectorAll("li");
var details = dashboardContainer.querySelector(".details");
var tabularData = details.querySelector(".recentOrders");
var table = tabularData.querySelector("table");
var rows = table?.querySelectorAll("tr");
var recentCustomers = details?.querySelector(".recentCustomers");
var sales = document.querySelector(".numbers");
var cardNumbers = document.querySelectorAll(".numbers");
console.log(lists);
export {
	dashboardContainer,
	lists,
	details,
	table,
	tabularData,
	rows,
	recentCustomers,
	cardNumbers,
};
