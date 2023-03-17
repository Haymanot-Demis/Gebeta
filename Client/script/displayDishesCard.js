export default function display(dishes, length, h2_data, grid_count) {
  let i = 0;
  let alone_grid = document.createElement("div");
  alone_grid.classList.add("alone-grid");
  let h2 = document.createElement("h2");
  h2.classList.add("scrolle");
  h2.id = h2_data.split(" ")[0];
  h2.innerText = h2_data;
  alone_grid.id = "alone-grid_" + grid_count;
  grid_count++;
  console.log("length", length);
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
    alone_card_img.src =
      "http://127.0.0.1:5500/Client/images/" + dishes[i].image;
    alone_card_img.alt = dishes[i].name + "image";

    imc.appendChild(alone_card_img);
    alone_card.appendChild(imc);

    alone_card_content.classList.add("alone-card-content");
    alone_card_content.id = "alone-card-content_" + i;

    alone_card_header.classList.add("alone-card-header");
    alone_card_header.id = "alone-card-header_" + 1;
    alone_card_header.innerText = dishes[i].name;

    alone_card_text.classList.add("alone-card-text");
    alone_card_text.id = "alone-card-text_" + i;
    if (!dishes[i].description) {
      alone_card_text.innerText = dishes[i].category;
      alone_card_text.classList.add("rating");
    } else {
      alone_card_text.innerText = dishes[i].description;
    }

    alone_card_btn.classList.add("alone-card-btn");
    alone_card_btn.id = "alone-card-btn_" + i;

    link.href = `http://127.0.0.1:5500/Client/Dishes/dish.html?id=${dishes[i]._id}`;
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
