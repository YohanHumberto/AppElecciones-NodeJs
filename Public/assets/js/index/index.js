
document.addEventListener('click', (e) => {
  if (e.target.id === 'enviarLogin') {
    ValidarForm(e);
  }
});


function ValidarForm(e) {

  const UserName = document.getElementById('UserName').value.trim();
  const Password = document.getElementById('Password').value.trim();

  if (UserName === '' && Password === '') {
    e.preventDefault();
    alert('complete todos los campos')
  } else {
    console.log('correcto')
  }

}

//Esta funcion es para la vista del elextor llamada candidatos
function activeButton(e) {
  document.getElementById('btn-votar').disabled = false;
}


function disableAlert() {
  setTimeout(() => {
    document.getElementById('alert').parentElement.remove();
  }, 2000);
}
