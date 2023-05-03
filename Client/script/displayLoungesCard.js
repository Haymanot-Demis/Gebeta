import { Client_URL } from "../config/EndPoints";

export default function display(lounges, length, h2_data, grid_count) {
	let i = 0;
	let alone_grid = document.createElement("div");
	alone_grid.classList.add("alone-grid");
	let h2 = document.createElement("h2");
	h2.classList.add("scrolle");
	h2.innerText = h2_data;
	alone_grid.id = "alone-grid_" + grid_count;
	grid_count++;
	for (let i = 0; i < length; i++) {
		let alone_grid_item_scrolle = document.createElement("div");
		let alone_card = document.createElement("div");
		let imc = document.createElement("div");
		let alone_card_img = document.createElement("img");
		let alone_card_content = document.createElement("div");
		let alone_card_header = document.createElement("h2");
		let alone_card_text = document.createElement("p");
		let alone_card_btn = document.createElement("button");
		let link = document.createElement("a");
		let spanY = document.createElement("span");
		spanY.classList.add("yellowStar");
		let spanG = document.createElement("span");
		spanG.classList.add("greyStar");
		link.innerText = "See More";

		alone_grid_item_scrolle.classList.add("alone-grid-item");
		alone_grid_item_scrolle.classList.add("scrolle");
		alone_grid_item_scrolle.id = "alone-grid-item_" + i;

		alone_card.classList.add("alone-card");
		alone_card.id = "alone-card_" + i;

		imc.classList.add("imc");
		imc.id = "imc_" + i;

		alone_card_img.id = "alone-card-img_" + i;
		alone_card_img.classList.add("alone-card-img");
		alone_card_img.src = Client_URL + "/images/" + lounges[i].image;
		alone_card_img.alt = lounges[i].name + "image";

		imc.appendChild(alone_card_img);
		alone_card.appendChild(imc);

		alone_card_content.classList.add("alone-card-content");
		alone_card_content.id = "alone-card-content_" + i;

		alone_card_header.classList.add("alone-card-header");
		alone_card_header.id = "alone-card-header_" + 1;
		alone_card_header.innerText = lounges[i].name;

		alone_card_text.classList.add("alone-card-text");
		alone_card_text.classList.add("rating");
		alone_card_text.id = "alone-card-text_" + i;
		spanY.innerText = "".padEnd(lounges[i].rating, "★");
		spanG.innerText = "".padEnd(5 - lounges[i].rating, "★");
		console.log(spanY, spanG);
		alone_card_text.innerHTML = "Rating: ";
		alone_card_text.appendChild(spanY);
		alone_card_text.appendChild(spanG);

		alone_card_btn.classList.add("alone-card-btn");
		alone_card_btn.id = "alone-card-btn_" + i;

		link.href = Client_URL + `/Lounge/lounge.html?id=${lounges[i]._id}`;
		alone_card_btn.appendChild(link);

		alone_card_content.appendChild(alone_card_header);
		alone_card_content.appendChild(alone_card_text);
		alone_card_content.appendChild(alone_card_btn);

		alone_card.appendChild(alone_card_content);
		alone_grid_item_scrolle.appendChild(alone_card);

		console.log(alone_grid_item_scrolle);
		alone_grid.appendChild(alone_grid_item_scrolle);
	}
	document.body.querySelector("main").appendChild(h2);
	document.body.querySelector("main").appendChild(alone_grid);
}
