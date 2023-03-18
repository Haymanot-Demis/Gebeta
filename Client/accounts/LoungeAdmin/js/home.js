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

lists[1].classList.add("hovered");