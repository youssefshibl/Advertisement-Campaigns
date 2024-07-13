(async () => {
  // get parames in url

  let url = new URL(window.location.href);

  let uuid = url.searchParams.get("uuid");
  let app_name = url.searchParams.get("app_name");
  let token = url.searchParams.get("token");
  document.getElementById(
    "info"
  ).innerHTML = `<li class="list-group-item">UUID:  ${uuid}</li>
                                               <li class="list-group-item">App Name :  ${app_name}</li>
                                               <li class="list-group-item">token:  ${token}</li>`;

})();
