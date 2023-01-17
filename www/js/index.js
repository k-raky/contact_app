document.addEventListener("deviceready", checkPermissions, false);

function checkPermissions() {
  window.ContactsX.hasPermission(loadContacts, handleError);
}

function loadContacts() {
  window.ContactsX.find(showContacts, handleError, {
    fields: {
      phoneNumbers: true
    },
    baseCountryCode: 'US'
  });
}

function showContacts(contacts) {

  $(contactList).empty()

  const ele = (contact, nb) => `
  <li>
  <a class="contactLink" href="#infoContact" onclick="infoContact('${contact.id}', '${contact.firstName}', '${contact.familyName}', '${contact.phoneNumbers[0].value}', '${contact.organizationName}')">
      <img src="./img/Ellipse ${nb}.png">
      <h2>${contact.firstName} ${contact.familyName}</h2>
      <p>${contact.phoneNumbers[0].value}</p>
  </a>
</li>`

  for (let i = 0; i < contacts.length; i++) {
    var nb = Math.floor(Math.random() * 10 + 1);

    contactList.innerHTML += ele(contacts[i], nb)
    $(contactList).listview("refresh")
  }

}

function infoContact(id, firstName, familyName, number, organizationName) {

  nomContact.value = `${firstName} ${familyName}`;
  numContact.value = number;
  orgContact.value = organizationName;
  idContact.value = id;

  deleteIcon.addEventListener("click", function () {
    deleteContact(id)
  });

}

function addContact() {

  var prenom = firstName.value;
  var nom = lastName.value;
  var number = phoneNumber.value;


  window.ContactsX.save(
    {
      firstName: prenom,
      familyName: nom,
      phoneNumbers: [{
        type: "mobile",
        value: number
      }]
    },
    function (success) {
      console.log(success);
      alert("Contact ajoute");
      loadContacts()
    },
    function (error) {
      console.error(error);
    });
}


function updateInfoContact() {

  var fullName = nomContact.value.split(" ");
  var nom = fullName[1];
  var prenom = fullName[0];
  var number = numContact.value;
  var idCont = idContact.value;
  var org = orgContact.value;


  window.ContactsX.save(
    {
      id : idCont,
      firstName: prenom,
      familyName: nom,
      organizationName : org,
      phoneNumbers: [{
        type: "mobile",
        value: number
      }]
    },
    function (success) {
      console.log(success);
      alert("Contact modifie");
      loadContacts()
      cancelEdit()
    },
    function (error) {
      console.error(error);
    });
}


function deleteContact(id) {

  let text = "Supprimer le contact ?";
  if (confirm(text) == true) {
    window.ContactsX.delete(id,
      function (success) {
        console.log(success);
        alert("Contact supprime");
        location.href = "#home";
        loadContacts()
      },
      function (error) {
        console.error(error);
      });
  } 
}

function updateContact() {
  nomContact.removeAttribute("readonly");
  numContact.removeAttribute("readonly");
  orgContact.removeAttribute("readonly");
  deleteIcon.setAttribute('hidden', true);
  editIcon.setAttribute('hidden', true);
  cancelEditIcon.removeAttribute("hidden");
  validEditIcon.removeAttribute("hidden");
}

function cancelEdit() {
  nomContact.setAttribute("readonly", true);
  numContact.setAttribute("readonly", true);
  orgContact.setAttribute("readonly", true);
  cancelEditIcon.setAttribute('hidden', true);
  validEditIcon.setAttribute('hidden', true);
  deleteIcon.removeAttribute("hidden");
  editIcon.removeAttribute("hidden");
}

function handleError(error) {
  console.log(error)
}

