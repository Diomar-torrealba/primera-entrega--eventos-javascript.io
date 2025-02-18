// Regex
const REGEX_NAME = /^[A-Z][a-z]*[ ][A-Z][a-z]*$/;
const REGEX_NUMBER = /^[0](212|412|414|424|416|426)[0-9]{7}$/;

// Selectors
const inputName = document.querySelector('#input-name');
const inputNumber = document.querySelector('#input-number');
const formBtn = document.querySelector('#form-btn');
const form = document.querySelector('#form');
const list = document.querySelector('#list');

// Validations
let nameValidation = false;
let numberValidation = false;
let EditnameValidation = false;
let EditnumberValidation = false;

// Data
let contacts = [];

// Functions
const validateInput = (input, validation) => {
  const infoText = input.parentElement.children[2];
  const infonumber = input.parentElement.children[3];
  
  contacts.forEach(contact => {  
    if (input.value == contact.number && validation){
      infonumber.classList.add('show-info');
      
      validation = false;
    } 
  });
  if (input.value === '') {
    input.classList.remove('correct');
    input.classList.remove('incorrect');
    infoText.classList.remove('show-info');
  } else if (validation) {
    input.classList.add('correct');
    input.classList.remove('incorrect');
    infoText.classList.remove('show-info');
  } else {
    infoText.classList.add('show-info');
    input.classList.add('incorrect');
    input.classList.remove('correct');
  }

  if (nameValidation && numberValidation) {
    formBtn.disabled = false;
    formBtn.classList.remove('desabilitado');
    formBtn.classList.add('habilitado');
  } else {
    formBtn.disabled = true;
    formBtn.classList.add('desabilitado');
    formBtn.classList.remove('habilitado')
  }
};

const renderContacts = () => {
  list.innerHTML = '';
  contacts.forEach(contact => {
    const li = document.createElement('li');
    li.id = contact.id; 
    li.innerHTML = `
      <button class="delete-btn">
        <svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
      <p>${contact.name}</p>
      <p>${contact.number}</p>
      <button class="edit-btn">
      <svg class="edit-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
      </svg>
            
      </button>
    `;
    list.append(li);
  });
}

const getContacts = () => {
  const contactsDb = localStorage.getItem('contacts');
  if (localStorage.getItem('contacts')) {
    contacts = JSON.parse(contactsDb);
  }
  renderContacts();
}

getContacts();

// Events
inputName.addEventListener('input', e => {
  nameValidation = REGEX_NAME.test(inputName.value);
  validateInput(inputName, nameValidation)
});

inputNumber.addEventListener('input', e => {
  numberValidation = REGEX_NUMBER.test(inputNumber.value);
  validateInput(inputNumber, numberValidation)
});

form.addEventListener('submit', e => {
  // Logica de negocio
  e.preventDefault();
  if (!nameValidation || !numberValidation) {
    return;
  };
  
  // Creo el nuevo contacto
  const newContact = {
    id: crypto.randomUUID(), // crea un id aleatorio
    name: inputName.value,
    number: inputNumber.value,
  }

  // Agrego el nuevo contacto al array
  contacts = contacts.concat(newContact);

  // Guardo en el navegador
  localStorage.setItem('contacts', JSON.stringify(contacts));

  // Limpiar el formulario
  nameValidation = false;
  numberValidation = false;

  // Logica de renderizado
  inputName.value = '';
  inputNumber.value = '';
  validateInput(inputName, nameValidation);
  validateInput(inputNumber, numberValidation);
  renderContacts();
});

list.addEventListener('click', e => {
  const deleteBtn = e.target.closest('.delete-btn');
  const editBtn = e.target.closest('.edit-btn');

  // Eliminar
  if (deleteBtn) {
    const id = deleteBtn.parentElement.id;
    contacts = contacts.filter(contact => {
      if (contact.id !== id) {
        return contact;
      }
    });
    localStorage.setItem('contacts', JSON.stringify(contacts));
    renderContacts();
  }

  // Editar
  if (editBtn) {
    const li = editBtn.parentElement;
    const nameEdit = li.children[1];
    const numberEdit = li.children[2];
    if (li.classList.contains('editando')) {
      li.classList.remove('editando');
      contacts = contacts.map(contact => {
        if (contact.id === li.id) {
          return {
            ...contact, 
            name: nameEdit.innerHTML, 
            number: numberEdit.innerHTML
          }
        } else {
          return contact;
        }
      });
      localStorage.setItem('contacts', JSON.stringify(contacts));
      renderContacts();
      
    } else {
      nameEdit.classList.add('editando-input');
      numberEdit.classList.add('editando-input');
      editBtn.classList.add('edit-btnTrue');
      li.classList.add('editando');
      nameEdit.setAttribute('contenteditable', 'true');
      numberEdit.setAttribute('contenteditable', 'true');
      editBtn.innerHTML = `
      <svg  class="edit-icon"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>

      `;
       //constantes de validacion
      const EditnameValidation = REGEX_NAME.test(nameEdit.innerHTML);
      const EditnumberValidation = REGEX_NUMBER.test(numberEdit.innerHTML);
        //validaciones
      nameEdit.addEventListener('input', e => {
        EditnameValidation = REGEX_NAME.test(nameEdit.innerHTML);
        validateInput(nameEdit, EditnameValidation);
        //condicional
        if (EditnameValidation && EditnumberValidation) {
          editBtn.disabled = false;
        } else {
          editBtn.disabled = true;
        }
      });
      //validaciones
      numberEdit.addEventListener('input', e => {
        EditnumberValidation = REGEX_NUMBER.test(numberEdit.innerHTML);
        validateInput(numberEdit, EditnumberValidation);
        //condicional
        if (EditnumberValidation && EditnameValidation) {
          editBtn.disabled = false;
        } else {
          editBtn.disabled = true;
        }
      });
    }
  }
});