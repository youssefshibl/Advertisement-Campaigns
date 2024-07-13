let backend_url = "http://127.0.0.1:8000/api/v1/conversions/push";

let uuid;
let app_name;
let token;

(async () => {
  // get parames in url

  let url = new URL(window.location.href);

  uuid = url.searchParams.get("uuid");
  app_name = url.searchParams.get("app_name");
  token = url.searchParams.get("token");

  document.getElementById(
    "info"
  ).innerHTML = `<li class="list-group-item">UUID:  ${uuid}</li>
                                               <li class="list-group-item">App Name :  ${app_name}</li>
                                               <li class="list-group-item">token:  ${token}</li>`;
})();

async function SendEvent() {
  console.log(uuid, app_name, token);
  let event = document.getElementById("event").value;
  if (!event || !uuid || !app_name || !token) {
    alert("Missing parameters or event");
  }

  // set x-api-key header
  let res = await fetch(backend_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": token,
    },
    body: JSON.stringify({
      uuid: uuid,
      app_name: app_name,
      event: event,
    }),
  });
  // check status
  if (res.status !== 201) {
    alert("Error sending event");
  }
  console.log(res);
  let success = document.getElementById("successmessage");
  success.classList.remove("hidden");
  setTimeout(() => {
    success.classList.add("hidden");
  }, 1000);
}
