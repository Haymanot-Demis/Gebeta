lists[id].classList.add("hovered");
response = await axios.get("http://localhost:3000/users/all");
const users = response.data;
console.log(users);
