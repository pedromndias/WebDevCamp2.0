const price = document.querySelector("#price");
const button = document.querySelector("#updateBtn");

button.addEventListener("click", async function() {
    const res = await axios.get("https://api.cryptonator.com/api/ticker/btc-usd")
    price.textContent = `$${res.data.ticker.price}`
})

