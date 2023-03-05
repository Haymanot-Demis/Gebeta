const body = document.body;
const dashboardContainer = document.getElementById("outer-container");

const lists = dashboardContainer.querySelectorAll("li");
console.log(dashboardContainer.classList);

for (let i = 1; i <= 6; i++) {
  console.log(lists[i].id);
  lists[i].addEventListener("click", () => users(i));
}

async function users(id) {
  var response;
  try {
    switch (id) {
      case 1:
        break;
      case 2:
        response = await axios.get("http://localhost:3000/dishes");
        const dishes = response.data;
        console.log(dishes);
        break;
      case 3:
        response = await axios.get("http://localhost:3000/orders");
        const orders = response.data;
        console.log(orders);
        break;
      case 5:
        response = await axios.get("http://localhost:3000/users/all");
        const users = response.data;
        console.log(users);
        break;
      default:
        console.log("not found");
        break;
    }
  } catch (error) {
    console.log(error.message);
  }
}
