const dashboardContainer = document.getElementById("outer-container");
var lists = dashboardContainer.querySelectorAll("li");
var details = dashboardContainer.querySelector(".details");
var tabularData = details.querySelector(".recentOrders");
var table = tabularData.querySelector("table");
var rows = table.querySelectorAll("tr");
var recentCustomers = details.querySelector(".recentCustomers");

export {
  dashboardContainer,
  lists,
  details,
  table,
  tabularData,
  rows,
  recentCustomers,
};
