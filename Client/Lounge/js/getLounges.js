const body = document.body;
lounges();

async function lounges() {
  try {
    const response = await axios.get("http://localhost:3000/lounges");
    console.log(response.data);
    body.innerText = response.data;
  } catch (error) {
    console.log(error.message);
  }
}
