const body = document.body;
users();

async function users() {
  try {
    const response = await axios.get("http://localhost:3000/users/all");
    console.log(response.data);
  } catch (error) {
    console.log(error.message);
  }
}
