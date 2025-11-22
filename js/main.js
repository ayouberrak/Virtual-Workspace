// /// variable globales/////
let btnAdd = document.getElementById('btn-add');
let formulaire = document.getElementById('model-form');
let cancelBtn = document.getElementById('cancel-btn');
let photoInput = document.getElementById('Photo');
let photoPreview = document.getElementById('photoPreview');
let btnAddExperiences = document.getElementById('btn-Add-Experiences');
let experiencesContainer = document.getElementById('experiances-contairer');
let form = document.getElementById('formulaire');
let workersContainer = document.getElementById('workers-container');

const modalContainer = document.getElementById('modal-container');
const modalTitle = document.getElementById('modal-title');
const employeesList = document.getElementById('authorized-employees-list');
const noRoleMessage = document.getElementById('no-role-message');
const closeModalBtn = document.getElementById('close-modal-btn');

const containerReception = document.getElementById('container-reception');
const containerServeurs = document.getElementById('container-serveurs');
const containerSecurite = document.getElementById('container-securite');
const containerPersonnel = document.getElementById('container-personnel');
const containerArchives = document.getElementById('container-archives');
const containerConference = document.getElementById('container-conference');

const btnreception = document.getElementById('btn-reception');
const btnserveurs = document.getElementById('btn-salle-serveurs');
const btnsecurite = document.getElementById('btn-salle-securite');
const btnpersonnel = document.getElementById('btn-salle-personnel');
const btnarchives = document.getElementById('btn-salle-darchives');
const btnconference = document.getElementById('btn-salle-conference');

const searchInput = document.getElementById('search-worker');
const filterSelect = document.getElementById('filter-role');

const tempAlert = document.getElementById('temp-alert');

const MAX_WORKERS_ZONE = 5;

///// roles par zones /////
let roleInReceprion = ["Receptionnistes", "Manager", "Nettoyage"];
let roleInServeurs = ["Techniciens IT", "Manager", "Nettoyage"];
let roleInSecurite = ["Agents de securite", "Manager", "Nettoyage"];
let roleInPersonnel = ["Agents de securite", "Manager", "Nettoyage", "Autres roles", "Techniciens IT", "Receptionnistes"];
let roleInArchives = ["Manager"];
let roleInConference = ["Agents de securite", "Manager", "Nettoyage", "Autres roles", "Techniciens IT", "Receptionnistes"];



// /// alert message /////
function showTempAlert(message, duration = 3000) {
        if (tempAlert.timeout) {
            clearTimeout(tempAlert.timeout);
        }

    tempAlert.innerText = message;
    tempAlert.classList.remove('hidden');
    tempAlert.style.opacity = '1';

    tempAlert.timeout = setTimeout(() => {
        tempAlert.style.opacity = '0';
        setTimeout(() => {
            tempAlert.classList.add('hidden');
        }, 300);
    }, duration);
}

///// close and open modal
btnAdd.addEventListener('click', () => {
    formulaire.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
    formulaire.classList.add('hidden');
});

closeModalBtn.addEventListener('click', () => {
    modalContainer.style.display = 'none';
});

///// image preview/////
photoInput.addEventListener('input', (e) => {
    photoPreview.innerHTML = '';
    let img = document.createElement('img');
    img.className = 'w-full h-full object-cover';
    img.onerror = () => {
        img.src = './public/images/default-Photo.jpg';
    };
    img.src = e.target.value;
    photoPreview.appendChild(img);
});
//// serach call /////

if (searchInput && filterSelect) {
    searchInput.addEventListener('input', () => refreshUI());
    filterSelect.addEventListener('change', () => refreshUI());
}


/////// error rejex//////
function displayError(inputElement, message, condition) {
    const previousError = inputElement.nextElementSibling;
    if (previousError && previousError.classList.contains('error-message')) {
        previousError.remove();
    }

    if (!condition) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-xs mt-1';
        errorDiv.textContent = message;

        inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);

        inputElement.classList.add('border-red-500');
        return false;
    } else {
        inputElement.classList.remove('border-red-500');
        return true;
    }
}
////// model submit///////
form.addEventListener('submit', function (e) {
    e.preventDefault();

    //// rejex validation ////

    const nameRegEx = /^[a-zA-Z\s\u00C0-\u00FF'-]{2,}$/;
    const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegEx = /^\+?(\d[\d\s-]{8,}\d)$/;
    const entrepriseRegEx = /^[a-zA-Z0-9\s.,'-]{2,}$/;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    const isNameValid = displayError(nameInput, ' Minimum 2 caracteres', nameRegEx.test(nameInput.value));
    const isEmailValid = displayError(emailInput, ' Format d email invalide', emailRegEx.test(emailInput.value));
    const isPhoneValid = displayError(phoneInput, ' Numero de telephone invalide.', phoneRegEx.test(phoneInput.value));

    let isExperienceValid = true;
    let experiences = [];


    ////// experiance add ////
    document.querySelectorAll('#experiances-contairer > div').forEach(div => {
        let entInput = div.querySelector('input[name="Entreprise"]');
        let dFrom = div.querySelector('input[name="DateFrom"]').value;
        let dTo = div.querySelector('input[name="DateTo"]').value;
        let ent = entInput.value;

        if (ent && !entrepriseRegEx.test(ent)) {
            displayError(entInput, ' Nom de l entreprise invalide.', entrepriseRegEx.test(ent));
            isExperienceValid = false;
        } else if (ent) {
            displayError(entInput, '', true);
        }

        if (ent && dFrom && dTo) {
            experiences.push({ entreprise: ent, dateFrom: dFrom, dateTo: dTo });
        }
    });


    ///// spot submit //////
    if (!(isNameValid && isEmailValid && isPhoneValid && isExperienceValid)) {
        return;
    }


    //// add new worker ////
    let name = nameInput.value;
    let position = document.getElementById('role').value;
    let image = document.getElementById('Photo').value;
    if (!image){
         image = './public/images/default-Photo.jpg'
    };

    let email = emailInput.value;
    let phone = phoneInput.value;

    let worker = {
        id: Date.now(),
        fullname: name,
        role: position,
        photo: image,
        email: email,
        phone: phone,
        experiences: experiences,
        zonesAsigned: null 
    };

    //// localStorage//
    let employes = JSON.parse(localStorage.getItem('employe')) || [];
    employes.push(worker);
    localStorage.setItem('employe', JSON.stringify(employes));

    //// reset formulaire et close du modal////
    form.reset();
    photoPreview.innerHTML = `<img src="./public/images/default-Photo.jpg" alt="default-Photo" class="w-full h-full object-cover">`;
    experiencesContainer.innerHTML = '';

    formulaire.classList.add('hidden');
    showTempAlert('Employe Ajoute avec Succes!');
    refreshUI();
});

///// btn for add experiances //////
btnAddExperiences.addEventListener('click', () => {
    let div = document.createElement('div');
    div.className = 'mt-4 p-2 rounded-lg bg-gray-50';
    div.innerHTML = `
        <div class="mb-2 flex gap-2 items-center">
            <div class='flex-1'>
                <input type="text" name="Entreprise" placeholder="Entreprise" class="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg ">
            </div>
            <i class="fa-solid fa-trash-can text-red-600 cursor-pointer text-xl delete-exp hover:text-red-400"></i>
        </div>
        <div class="flex gap-2">
            <input type="date" name="DateFrom" class="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg ">
            <input type="date" name="DateTo" class="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg ">
        </div>
    `;
    div.querySelector('.delete-exp').addEventListener('click', () => div.remove());
    experiencesContainer.appendChild(div);
});
// ///// afichage des card dans les zones //////
function refreshUI() {
    workersContainer.innerHTML = "";
    containerReception.innerHTML = "";
    containerServeurs.innerHTML = "";
    containerSecurite.innerHTML = "";
    containerPersonnel.innerHTML = "";
    containerArchives.innerHTML = "";
    containerConference.innerHTML = "";

    let employes = JSON.parse(localStorage.getItem('employe')) || [];
    console.log(employes);

    let searchTerm = "";
    let filterRole = "all";

    if (searchInput) {
        searchTerm = searchInput.value.toLowerCase();
    } else {
        searchTerm = "";
    }
    
    if (filterSelect) {
        filterRole = filterSelect.value;
    } else {
        filterRole = "all";
    }


    ///// filter ana zone is null /////
    employes.forEach(emp => {
        const matchesSearch = emp.fullname.toLowerCase().includes(searchTerm) || emp.role.toLowerCase().includes(searchTerm);
        const matchesRole = filterRole === 'all' || emp.role === filterRole;

        if (emp.zonesAsigned === null) {
            if (matchesSearch && matchesRole) {
                createSidebarCard(emp);
            }
        } else {
            createZoneCard(emp);
        }
        // console.log(emp);
    });

    ///// red zones /////
    redZones(employes, 'Salle Serveurs', document.getElementById('big-container-serveurs'))
    redZones(employes, 'Salle Securite', document.getElementById('big-container-securite'))
    redZones(employes, 'Reception', document.getElementById('big-container-reception'))
    redZones(employes, 'Salle d\'Archives', document.getElementById('big-container-archives'))

}

// /// afichager des card dans sidbar ////

function createSidebarCard(emp) {
    // console.log(emp)
    let card = document.createElement('div');
    card.className = "cursor-pointer px-8 py-2 bg-gray-100 rounded-lg text-gray-800 flex items-center justify-between transition-all cursor-pointer hover:bg-gray-200";
    card.dataset.id = emp.id;
    // console.log(emp.id)

    card.innerHTML = `
        <img src="${emp.photo}" class="w-10 h-10 rounded-full object-cover" onerror="this.src='./public/images/default-Photo.jpg'">
        <div>
            <p class="font-bold text-sm">${emp.fullname}</p>
            <p class="text-gray-500 text-xs">${emp.role}</p>
        </div>
        <div class='deleteWorker'>
            <i class="fas fa-trash text-red-600 hover:text-red-800 cursor-pointer"></i>
        </div>
    `;

    /////// delete call///// 
    card.querySelector('.deleteWorker').addEventListener('click', e => {
        e.stopPropagation();
        if (confirm('vouler vous suprimer le worker ??')) {
            deleteEmployee(emp.id);
        }

    });
    card.addEventListener('click', () => {
        afichierInfoWorker(emp)
    });
    workersContainer.appendChild(card);
}
// //// delete logique /////
function deleteEmployee(id) {
    let employes = JSON.parse(localStorage.getItem('employe')) || [];


    const initialLength = employes.length;
    employes = employes.filter(emp => emp.id !== id);

    if (employes.length < initialLength) {
        localStorage.setItem('employe', JSON.stringify(employes));
        showTempAlert('Employe Supprime avec Succes!');
        refreshUI();
    }
}
//////card in zone/////

function createZoneCard(emp) {
    // console.log(emp);

    let card = document.createElement('div');
    card.className = "relative cursor-pointer max-w-[10rem] hover:scale-[1.02] transition";
    card.dataset.id = emp.id
    // console.log(emp.id);
    

    card.innerHTML = `

        <div class="hidden md:flex relative items-center gap-2 p-1 bg-white/90 rounded-lg w-auto"  >
            <img src="${emp.photo}" 
                class="h-8 w-8 rounded-full object-cover "
                onerror="this.src='./public/images/default-Photo.jpg'">

            <div class='flex-1'>
                <h3 class="text-[0.6rem] font-bold text-gray-800 truncate">${emp.fullname}</h3>
                <h3 class="text-[0.55rem] text-gray-600 ">${emp.role}</h3>
            </div>

            <button class="delete-btn">
                 <i class="fas fa-trash text-red-600 hover:text-red-800 cursor-pointer"></i>
            </button>
        </div>
        <div class="flex md:hidden bg-white/90 rounded-sm"  >
            <img src="${emp.photo}" 
                class="h-6 w-6 rounded-full object-cover "
                onerror="this.src='./public/images/default-Photo.jpg'">

            <div class='flex-1'>
                <h3 class="text-[0.4rem] font-bold text-gray-800 ">${emp.fullname}</h3>
                <h3 class="text-[0.4rem] text-gray-600 ">${emp.role}</h3>
            </div>

            <button class="delete-btn text-[0.7rem]">
                 <i class="fas fa-trash text-red-600 hover:text-red-800 cursor-pointer"></i>
            </button>
        </div>
    `;

    card.addEventListener('click', () => {
        afichierInfoWorker(emp)
    });

    card.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        updateEmployeeZone(emp.id, null);
        showTempAlert(`Employe ${emp.fullname} a ete desassigne.`);
    });


    // //zones if ...//
    if (emp.zonesAsigned === "Reception") {
        containerReception.appendChild(card);
    } else if (emp.zonesAsigned === "Salle Serveurs") {
        containerServeurs.appendChild(card);
    } else if (emp.zonesAsigned === "Salle Securite") {
        containerSecurite.appendChild(card);
    } else if (emp.zonesAsigned === "Salle Personnel") {
        containerPersonnel.appendChild(card);
    } else if (emp.zonesAsigned === "Salle d'Archives") {
        containerArchives.appendChild(card); 
    } else if (emp.zonesAsigned === "Salle de Conference") {
        containerConference.appendChild(card);
    }
}

// /// zones worker///
function updateEmployeeZone(id, newZone) {
    let employes = JSON.parse(localStorage.getItem('employe')) || [];
    for (let i = 0; i < employes.length; i++) {
        if (employes[i].id === id) {
            employes[i].zonesAsigned = newZone;
            break;
        }
    }
    localStorage.setItem('employe', JSON.stringify(employes));
    refreshUI();
}


/// roles and zones afecter/////
function setupZoneButton(btn, rolesAllowed, zoneName) {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();

        let employes = JSON.parse(localStorage.getItem('employe')) || [];
        const workersInZone = employes.filter(emp => emp.zonesAsigned === zoneName).length;

        // /// max/////
        if (workersInZone >= MAX_WORKERS_ZONE) {
            showTempAlert(`Impossible d'ajouter plus d'employes a ${zoneName}. Limite maximale de ${MAX_WORKERS_ZONE} employes atteinte.`, 4000);
            return;
        }

        modalContainer.style.display = 'flex';
        modalTitle.innerText = "Ajouter a : " + zoneName;
        employeesList.innerHTML = "";
        noRoleMessage.style.display = 'none';

        let found = false;

        employes.forEach(emp => {
            // /// roles in table for zones ///
            if (rolesAllowed.includes(emp.role) && emp.zonesAsigned !== zoneName) {
                found = true;
                let div = document.createElement('div');
                div.className = "flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition rounded-lg";

                ///// model demployee true ////
                div.innerHTML = `
                    <img src="${emp.photo}"
                        class="w-10 h-10 rounded-full object-cover "
                        onerror="this.src='./public/images/default-Photo.jpg'">

                    <div class="text-gray-900">
                        <p class="font-semibold text-sm">${emp.fullname}</p>
                        <p class="text-blue-600 text-xs">${emp.role}</p>
                    </div>
                `;
                //// worker add ///
                div.addEventListener('click', () => {
                    if (emp.zonesAsigned && emp.zonesAsigned !== zoneName) {
                        if (!confirm(`Voulez-vous le transférer vers ${zoneName} ?`))
                            return;
                    }
                    const workersInZoneAfterCheck = employes.filter(emp => emp.zonesAsigned === zoneName).length;
                    if (workersInZoneAfterCheck >= MAX_WORKERS_ZONE) {
                        showTempAlert(`Impossible d'ajouter plus d'employes a ${zoneName}. Limite maximale atteinte.`, 4000);
                        modalContainer.style.display = 'none';
                        return;
                    }

                    updateEmployeeZone(emp.id, zoneName);
                    showTempAlert(`Employe ${emp.fullname} assigne a ${zoneName}.`, 3000);
                    modalContainer.style.display = 'none';
                });
                employeesList.appendChild(div);
            }
        });

        // //// aucun////
        if (!found) {
            noRoleMessage.style.display = 'block';
        }
    });
}
// ///calll///
setupZoneButton(btnreception, roleInReceprion, "Reception");
setupZoneButton(btnserveurs, roleInServeurs, "Salle Serveurs");
setupZoneButton(btnsecurite, roleInSecurite, "Salle Securite");
setupZoneButton(btnpersonnel, roleInPersonnel, "Salle Personnel");
setupZoneButton(btnarchives, roleInArchives, "Salle d'Archives");
setupZoneButton(btnconference, roleInConference, "Salle de Conference");

// //// info de worker////
function afichierInfoWorker(newwoker) {
    let divInfo = document.createElement('div');
    divInfo.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4';

    let expListItems = newwoker.experiences && newwoker.experiences.length > 0
        ? newwoker.experiences.map(e => `
            <li class="mb-3 p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-blue-50 transition">
                <div class="text-sm text-gray-500 mb-1">${e.dateFrom} <span class="mx-1"> A </span> ${e.dateTo}</div>
                <div class="font-semibold text-gray-900 uppercase">${e.entreprise}</div>
            </li>
          `).join('')
        : `<li class="text-gray-500 italic text-sm p-2">Aucune experience enregistree.</li>`;

    let zoneInfo = newwoker.zonesAsigned ? `
        <div class="mb-4 p-3 rounded-lg shadow-sm">
            <p>
                <span class="text-blue-600 text-xs font-semibold">ZONE ASSIGNEE:</span>
                <span class="font-bold text-gray-900 text-lg block">${newwoker.zonesAsigned}</span>
            </p>
        </div>
    ` : '';

    let modalContent = `
        <div class="bg-white rounded-2xl w-full max-w-md p-6 relative text-gray-900 ">

            <button id="close-info-modal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
                <i class="fa-solid fa-xmark text-2xl"></i>
            </button>

            <div class="flex gap-4 items-center mb-6 ">
                <img src="${newwoker.photo}" class="w-20 h-20 rounded-full object-cover" onerror="this.src='./public/images/default-Photo.jpg'">
                <div>
                    <h2 class="text-xl font-bold">${newwoker.fullname}</h2>
                    <p class="text-blue-500 font-semibold">${newwoker.role}</p>
                </div>
            </div>

            ${zoneInfo}

            <div id="contact-info" class="mb-4 p-3 rounded-lg">
                <p class="mb-1"><span class="text-gray-500 text-xs font-semibold">EMAIL:</span> ${newwoker.email}</p>
                <p><span class="text-gray-500 text-xs font-semibold">TEL:</span> ${newwoker.phone}</p>
            </div>

            <h3 class="mb-3 pb-1 font-bold text-lg">Experiences</h3>
            <ul id="exp-list" class="max-h-40 overflow-y-auto pr-2 no-scrollbar">
                ${expListItems}
            </ul>
        </div>
    `;

    divInfo.innerHTML = modalContent;

    let closeModalInfoBtn = divInfo.querySelector('#close-info-modal');

    divInfo.addEventListener('click', (e) => {
        if (e.target === divInfo) divInfo.remove();
    });
    closeModalInfoBtn.addEventListener('click', () => {
        divInfo.remove();
    });

    document.body.appendChild(divInfo);
}

///// red zones////
function redZones(employes, zoneName, containerElement) {
    let isAssigned = employes.some(e => e.zonesAsigned === zoneName);

    if (isAssigned) {
        containerElement.classList.remove('bg-red-900/40', 'hover:bg-red-500/50');
        containerElement.classList.add('bg-gray-900/40', 'hover:bg-green-500/50');
    } else {
        containerElement.classList.remove('bg-gray-900/40', 'hover:bg-green-500/50');
        containerElement.classList.add('bg-red-900/40', 'hover:bg-red-500/50');
    }
}


///init////
refreshUI();