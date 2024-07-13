let endpoint = "http://127.0.0.1:8000/api/v1";

let email = "youssef@gmail.com";
let password = "123456";

let state = document.getElementById("state");
let token = null;
let campaign_id;

(async () => {
  state.innerHTML = "Trying to login...";
  let login = await fetch(`${endpoint}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  let data = await login.json();
  token = data.token;
  console.log(token);
  state.innerHTML = "Logged in successfully!";

  await new Promise((resolve) => setTimeout(resolve, 1000));

  state.innerHTML = "Getting campaigns...";

  // get campaign_id from campaigns

  let campaigns = await fetch(`${endpoint}/campaigns`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  campaigns = await campaigns.json();
  campaign_id = campaigns[0]._id;
  console.log(campaign_id);

  state.innerHTML = "Campaigns fetched successfully!";
  await new Promise((resolve) => setTimeout(resolve, 1000));
  state.innerHTML = "Generating QR code...";

  // get url to generate qr code

  let url = await fetch(`${endpoint}/qrcode/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: campaign_id,
    }),
  });

  url = await url.json();
  console.log(url);
  var url_ =
    "https://api.qrserver.com/v1/create-qr-code/?data=" +
    url.url +
    "&amp;size=200x200";
  $("#barcode").attr("src", url_);

  state.innerHTML = "QR code generated successfully!";
})();
