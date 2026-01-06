document.addEventListener("DOMContentLoaded", () => {
  const stayUpdatedForm = document.querySelector('#form-stay-updated');
  const buttonSubscribe = stayUpdatedForm.querySelector('button[type=submit]');
  const alert = document.querySelector('.stay-updated .stay-updated-alert');

  stayUpdatedForm.addEventListener("submit", event => {
    event.preventDefault();

    const values = Object.fromEntries(new FormData(stayUpdatedForm));
    console.log("submit values", values);
    // @todo submit to klavyio

    buttonSubscribe.setAttribute('disabled', 'disabled');
    alert.classList.remove('hidden');


  });
});
