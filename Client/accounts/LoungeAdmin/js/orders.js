import { deleteBtnAction, editBtnAction } from "./eventListners.js";
import {
  createCustomElement,
  attachEventListner,
  rowEventListner,
} from "./helpers.js";
import {
  dashboardContainer,
  lists,
  rows,
  details,
  tabularData,
  table,
  recentCustomers,
} from "./common-elements.js";

lists[3].classList.add("hovered");
var response = await axios.get("http://localhost:3000/orders");
const orders = response.data;
console.log(orders);